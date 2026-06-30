import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import earthAsset from "../../assets/earth-bluemarble.jpg.asset.json";
import cloudsAsset from "../../assets/earth-clouds.png.asset.json";
const earthMap = earthAsset.url;
const cloudsMap = cloudsAsset.url;

type City = { name: string; lat: number; lon: number };
const CITIES: City[] = [
  { name: "USA", lat: 38, lon: -97 },
  { name: "Canada", lat: 56, lon: -106 },
  { name: "UK", lat: 54, lon: -2 },
  { name: "Germany", lat: 51, lon: 10 },
  { name: "UAE", lat: 24, lon: 54 },
  { name: "Australia", lat: -25, lon: 134 },
];
const HUB = "UK";
const R = 1; // sphere radius

function latLonToVec3(lat: number, lon: number, r = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

// Great-circle slerp between two points on the sphere, raised above surface for an arc bulge.
function greatCircleArc(a: THREE.Vector3, b: THREE.Vector3, steps = 64, maxLift = 0.25) {
  const pts: THREE.Vector3[] = [];
  const angle = a.angleTo(b);
  const sinA = Math.sin(angle) || 1e-6;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const w1 = Math.sin((1 - t) * angle) / sinA;
    const w2 = Math.sin(t * angle) / sinA;
    const p = new THREE.Vector3()
      .addScaledVector(a, w1)
      .addScaledVector(b, w2);
    // bulge: lift towards midpoint
    const lift = 1 + Math.sin(Math.PI * t) * maxLift * (angle / Math.PI);
    p.normalize().multiplyScalar(R * (1 + (lift - 1)));
    pts.push(p);
  }
  return pts;
}

export function EarthHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const size = () => Math.min(container.clientWidth, container.clientHeight);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 3.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    // Earth group (so we can tilt + rotate)
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180; // axial tilt
    scene.add(earthGroup);

    // Textures
    const texLoader = new THREE.TextureLoader();
    const dayTex = texLoader.load(earthMap, () => setReady(true));
    dayTex.colorSpace = THREE.SRGBColorSpace;
    dayTex.anisotropy = 8;

    // Earth surface with custom shader (sunlight from upper-left, soft terminator, subtle night side)
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: dayTex },
        uSunDir: { value: new THREE.Vector3(-0.6, 0.55, 0.8).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uMap;
        uniform vec3 uSunDir;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec3 base = texture2D(uMap, vUv).rgb;
          vec3 n = normalize(vNormal);
          float ndl = dot(n, normalize(uSunDir));
          float day = smoothstep(-0.2, 0.35, ndl);

          // Natural day color (no warm push)
          vec3 dayCol = base;

          // Night side: dim with a very subtle warm city-light hint on land only
          float land = step(0.12, max(base.r, base.g) - base.b * 0.6);
          vec3 nightCol = base * 0.12 + vec3(1.0, 0.78, 0.4) * 0.08 * land;

          // Cool atmospheric tint at terminator (replaces the brown warm glow)
          float term = smoothstep(0.0, 0.25, 1.0 - abs(ndl)) * 0.15;
          vec3 termCol = vec3(0.4, 0.6, 1.0) * term;

          vec3 col = mix(nightCol, dayCol, day) + termCol;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 128, 128), earthMat);
    earthGroup.add(earth);

    // Thin atmospheric rim (fresnel, backside)
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float rim = pow(1.0 - abs(dot(vNormal, vView)), 2.2);
          vec3 col = mix(vec3(0.35, 0.55, 0.95), vec3(0.75, 0.9, 1.0), rim);
          gl_FragColor = vec4(col, rim * 0.85);
        }
      `,
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.035, 96, 96), atmoMat);
    earthGroup.add(atmo);

    // Clouds layer (slightly above surface, semi-transparent, slower rotation)
    const cloudsTex = texLoader.load(cloudsMap);
    cloudsTex.colorSpace = THREE.SRGBColorSpace;
    cloudsTex.anisotropy = 8;
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.012, 128, 128),
      new THREE.MeshBasicMaterial({
        map: cloudsTex,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    );
    earthGroup.add(clouds);

    // City markers + arcs group (rotates with earth)
    const markerGroup = new THREE.Group();
    earthGroup.add(markerGroup);

    // Start with India / South Asia facing the camera (lon ~78°E)
    const initialLon = 78;
    const initialRotY = Math.PI / 2 - ((initialLon + 180) * Math.PI) / 180;
    earth.rotation.y = initialRotY;
    clouds.rotation.y = initialRotY;
    markerGroup.rotation.y = initialRotY;


    const hubCity = CITIES.find((c) => c.name === HUB)!;
    const hubPos = latLonToVec3(hubCity.lat, hubCity.lon).multiplyScalar(1.005);

    // Label anchors keyed by city
    const anchors: Record<string, THREE.Object3D> = {};

    // Markers
    CITIES.forEach((c) => {
      const p = latLonToVec3(c.lat, c.lon).multiplyScalar(1.005);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffe6a8 }),
      );
      dot.position.copy(p);
      markerGroup.add(dot);

      // glow sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: makeGlowTexture(),
        color: 0xffd070,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(p);
      sprite.scale.setScalar(0.13);
      sprite.userData.pulse = Math.random() * Math.PI * 2;
      markerGroup.add(sprite);

      // anchor slightly above surface for label
      const anchor = new THREE.Object3D();
      anchor.position.copy(p).multiplyScalar(1.08);
      markerGroup.add(anchor);
      anchors[c.name] = anchor;
    });

    // Arcs (hub-and-spoke) + traveling particles
    const travelers: { sprite: THREE.Sprite; pts: THREE.Vector3[]; t: number; speed: number }[] = [];
    CITIES.filter((c) => c.name !== HUB).forEach((c) => {
      const p = latLonToVec3(c.lat, c.lon).multiplyScalar(1.005);
      const pts = greatCircleArc(hubPos, p, 96, 0.35);

      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0xffd070,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geom, mat);
      markerGroup.add(line);

      // softer wider halo line
      const halo = new THREE.Line(
        geom,
        new THREE.LineBasicMaterial({
          color: 0xffb84d,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      markerGroup.add(halo);

      // traveler
      const tSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeGlowTexture(),
          color: 0xffe9a8,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      tSprite.scale.setScalar(0.07);
      markerGroup.add(tSprite);
      travelers.push({ sprite: tSprite, pts, t: Math.random(), speed: 0.05 + Math.random() * 0.04 });
    });

    function makeGlowTexture() {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(255,230,160,1)");
      g.addColorStop(0.35, "rgba(255,200,90,0.6)");
      g.addColorStop(1, "rgba(255,180,60,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // Mouse parallax
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      tilt.tx = (e.clientX / window.innerWidth - 0.5) * 0.35;
      tilt.ty = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener("mousemove", onMove);

    // Resize
    const resize = () => {
      const s = size();
      renderer.setSize(s, s, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Animate
    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      const t = clock.elapsedTime;

      // smooth tilt
      tilt.x += (tilt.ty - tilt.x) * 0.05;
      tilt.y += (tilt.tx - tilt.y) * 0.05;

      earth.rotation.y += dt * 0.06; // continuous Earth spin
      clouds.rotation.y += dt * 0.075; // clouds drift slightly faster
      markerGroup.rotation.copy(earth.rotation);
      atmo.rotation.copy(earth.rotation);

      earthGroup.rotation.x = -tilt.x * 0.6;
      // keep axial tilt on z, add small floating y bob via camera
      camera.position.y = Math.sin(t * 0.5) * 0.03;
      camera.lookAt(0, 0, 0);

      // pulse marker sprites
      markerGroup.children.forEach((obj) => {
        if (obj instanceof THREE.Sprite) {
          const base = 0.13;
          obj.userData.pulse += dt * 2.5;
          obj.scale.setScalar(base + Math.sin(obj.userData.pulse) * 0.04);
        }
      });

      // move travelers along their arcs
      travelers.forEach((tr) => {
        tr.t = (tr.t + dt * tr.speed) % 1;
        if (tr.t < 0) tr.t += 1;
        const idx = tr.t * (tr.pts.length - 1);
        const i0 = Math.min(Math.floor(idx), tr.pts.length - 1);
        const i1 = Math.min(tr.pts.length - 1, i0 + 1);
        const f = idx - i0;
        tr.sprite.position.lerpVectors(tr.pts[i0], tr.pts[i1], f);
      });

      // project labels via anchor world positions
      const s = size();
      const worldPos = new THREE.Vector3();
      const camDir = new THREE.Vector3();
      CITIES.forEach((c) => {
        const el = labelRefs.current[c.name];
        const anchor = anchors[c.name];
        if (!el || !anchor) return;
        anchor.getWorldPosition(worldPos);
        camDir.copy(camera.position).normalize();
        const facing = worldPos.clone().normalize().dot(camDir); // >0 = front hemisphere
        const proj = worldPos.clone().project(camera);
        const x = (proj.x * 0.5 + 0.5) * s;
        const y = (-proj.y * 0.5 + 0.5) * s;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        el.style.opacity = facing > 0.2 ? "1" : "0";
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      renderer.dispose();
      dayTex.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
      <div
        ref={containerRef}
        className="relative aspect-square w-[min(92vh,1050px)] max-w-[110vw] -translate-x-[6%] md:-translate-x-[9%] lg:-translate-x-[10%]"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 1.2s ease" }}
      >
        {CITIES.map((c) => (
          <div
            key={c.name}
            ref={(el) => {
              labelRefs.current[c.name] = el;
            }}
            className="absolute top-0 left-0 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.18em] text-foreground/95 glass border border-white/10 whitespace-nowrap will-change-transform"
            style={{ transition: "opacity 0.4s ease" }}
          >
            {c.name}
          </div>
        ))}
      </div>
    </div>
  );
}
