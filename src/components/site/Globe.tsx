import { useEffect, useRef } from "react";
import * as THREE from "three";

const TEX_BASE =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/";

const CITIES = [
  { name: "USA", lat: 38.9, lng: -77.0 },
  { name: "Canada", lat: 45.4, lng: -75.7 },
  { name: "United Kingdom", lat: 51.5, lng: -0.12 },
  { name: "Germany", lat: 52.5, lng: 13.4 },
  { name: "UAE", lat: 24.5, lng: 54.4 },
  { name: "Australia", lat: -33.9, lng: 151.2 },
];

// Hub-and-spoke routes prevent random intersections.
const HUB = "United Kingdom";

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Build a smooth great-circle-ish arc that bulges away from the Earth's surface.
function buildArc(start: THREE.Vector3, end: THREE.Vector3, R: number) {
  const angle = start.angleTo(end);
  // Higher bulge for longer routes — premium airline-route feel.
  const bulge = R * (0.18 + angle * 0.32);
  const segments = 96;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Slerp along great circle
    const sinA = Math.sin(angle);
    const a = Math.sin((1 - t) * angle) / sinA;
    const b = Math.sin(t * angle) / sinA;
    const p = start.clone().multiplyScalar(a).add(end.clone().multiplyScalar(b));
    // Lift along the normal using sin curve so arc bulges up
    const lift = Math.sin(Math.PI * t) * bulge;
    p.normalize().multiplyScalar(R + lift * 0.5 + 0.02);
    points.push(p);
  }
  return new THREE.CatmullRomCurve3(points);
}

export function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const earthGroup = new THREE.Group();
    root.add(earthGroup);

    const R = 2;

    // --- Textures ---
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const dayMap = loader.load(TEX_BASE + "earth_atmos_2048.jpg");
    const nightMap = loader.load(TEX_BASE + "earth_lights_2048.png");
    const specMap = loader.load(TEX_BASE + "earth_specular_2048.jpg");
    const normalMap = loader.load(TEX_BASE + "earth_normal_2048.jpg");
    const cloudsMap = loader.load(TEX_BASE + "earth_clouds_1024.png");
    [dayMap, nightMap].forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
    [dayMap, nightMap, specMap, normalMap].forEach((t) => {
      t.anisotropy = 8;
    });

    // Sun direction shaped so Europe/Africa get lit nicely
    const sunDir = new THREE.Vector3(0.9, 0.35, 0.5).normalize();

    // --- Photoreal Earth shader ---
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: dayMap },
        nightMap: { value: nightMap },
        specMap: { value: specMap },
        normalMap: { value: normalMap },
        sunDir: { value: sunDir },
        rimColor: { value: new THREE.Color(0x5d8bff) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vN;
        varying vec3 vPos;
        void main(){
          vUv = uv;
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vPos = mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayMap;
        uniform sampler2D nightMap;
        uniform sampler2D specMap;
        uniform vec3 sunDir;
        uniform vec3 rimColor;
        varying vec2 vUv;
        varying vec3 vN;
        varying vec3 vPos;
        void main(){
          vec3 nrm = normalize(vN);
          vec3 sun = normalize((viewMatrix * vec4(sunDir,0.0)).xyz);
          float l = dot(nrm, sun);
          // Wider day band so Europe, North America and the Middle East stay clearly lit
          float dayMix = smoothstep(-0.35, 0.15, l);
          vec3 day = texture2D(dayMap, vUv).rgb;
          // brighten landmasses
          day = pow(day, vec3(0.88)) * 1.35;
          // gentle ocean tint (no darkening)
          float oceanMask = 1.0 - texture2D(specMap, vUv).r;
          day = mix(day, day * vec3(0.75, 0.9, 1.1), oceanMask * 0.35);

          vec3 night = texture2D(nightMap, vUv).rgb;
          night = pow(night, vec3(0.8)) * 2.6;
          night *= vec3(1.0, 0.82, 0.5);

          // ambient fill so dark side never reads as pure black
          vec3 ambient = day * 0.18;
          vec3 col = mix(night + ambient, day, dayMix);

          // ocean specular highlight
          vec3 viewDir = normalize(-vPos);
          vec3 h = normalize(sun + viewDir);
          float spec = pow(max(dot(nrm, h), 0.0), 80.0) * oceanMask * dayMix;
          col += vec3(0.7, 0.85, 1.0) * spec * 0.9;

          // atmospheric rim
          float rim = pow(1.0 - max(dot(nrm, viewDir), 0.0), 2.4);
          col += rimColor * rim * 0.85;

          // terminator warm glow
          float term = smoothstep(0.0, 0.2, abs(l));
          col += vec3(1.0, 0.6, 0.3) * (1.0 - term) * 0.22 * (1.0 - dayMix);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 128, 128), earthMat);
    earthGroup.add(earth);

    // --- Clouds ---
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.012, 96, 96),
      new THREE.MeshPhongMaterial({
        map: cloudsMap,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );
    earthGroup.add(clouds);

    // --- Atmospheric halo (back-side fresnel) ---
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.22, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { c: { value: new THREE.Color(0x4d7bff) } },
        vertexShader: `varying vec3 vN; void main(){vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader: `varying vec3 vN; uniform vec3 c;
          void main(){
            float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 2.4);
            gl_FragColor = vec4(c, 1.0) * i;
          }`,
      }),
    );
    root.add(atmo);

    // Inner soft glow disc behind earth for bloom-like feel
    const glowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(R * 1.7, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { c: { value: new THREE.Color(0x3a6dff) } },
        vertexShader: `varying vec2 vUv; void main(){vUv=uv-0.5; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader: `varying vec2 vUv; uniform vec3 c;
          void main(){
            float d = length(vUv)*2.0;
            float a = smoothstep(1.0, 0.0, d);
            gl_FragColor = vec4(c, a*a*0.35);
          }`,
      }),
    );
    glowDisc.position.z = -0.6;
    root.add(glowDisc);

    // --- City markers (gold) ---
    const cityMap: Record<string, THREE.Vector3> = {};
    CITIES.forEach((c) => {
      const pos = latLngToVec3(c.lat, c.lng, R * 1.005);
      cityMap[c.name] = pos;

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.032, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffd86b }),
      );
      dot.position.copy(pos);
      earthGroup.add(dot);

      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          color: 0xffd17a,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      glow.position.copy(pos);
      glow.scale.set(0.28, 0.28, 0.28);
      earthGroup.add(glow);

      // Pulsing ring (sprite scaled over time)
      const ring = new THREE.Sprite(
        new THREE.SpriteMaterial({
          color: 0xffd17a,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      ring.position.copy(pos);
      ring.userData.base = pos.clone();
      ring.userData.phase = Math.random() * Math.PI * 2;
      ring.userData.isPulse = true;
      earthGroup.add(ring);
    });

    // --- Hub-and-spoke arcs ---
    type ArcRec = {
      curve: THREE.CatmullRomCurve3;
      line: THREE.Line;
      geom: THREE.BufferGeometry;
      total: number;
      traveler: THREE.Sprite;
      offset: number;
    };
    const arcs: ArcRec[] = [];
    const hubPos = cityMap[HUB];
    CITIES.filter((c) => c.name !== HUB).forEach((c, idx) => {
      const end = cityMap[c.name];
      const curve = buildArc(hubPos, end, R);
      const points = curve.getPoints(120);
      const positions = new Float32Array(points.length * 3);
      points.forEach((p, k) => {
        positions[k * 3] = p.x;
        positions[k * 3 + 1] = p.y;
        positions[k * 3 + 2] = p.z;
      });
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geom.setDrawRange(0, 0);
      const mat = new THREE.LineBasicMaterial({
        color: 0xffd17a,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geom, mat);
      earthGroup.add(line);

      // Traveling glowing particle along the route
      const traveler = new THREE.Sprite(
        new THREE.SpriteMaterial({
          color: 0xfff1c4,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      traveler.scale.set(0.16, 0.16, 0.16);
      earthGroup.add(traveler);

      arcs.push({
        curve,
        line,
        geom,
        total: points.length,
        traveler,
        offset: idx * 0.18,
      });
    });

    // --- Floating particles around the globe ---
    const pGeo = new THREE.BufferGeometry();
    const pCount = 380;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = R * (1.5 + Math.random() * 1.6);
      const t = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const s = Math.sqrt(1 - u * u);
      pPos[i * 3] = r * s * Math.cos(t);
      pPos[i * 3 + 1] = r * u;
      pPos[i * 3 + 2] = r * s * Math.sin(t);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xaac4ff,
        size: 0.022,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    root.add(particles);

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0x3a4f80, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.copy(sunDir).multiplyScalar(5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc878, 0.9);
    rim.position.set(-5, -1, -2);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x4d7bff, 0.5);
    fill.position.set(-3, 2, 4);
    scene.add(fill);

    // --- Interaction ---
    const onMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouseRef.current.ty = (e.clientY / window.innerHeight - 0.5) * 0.45;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    let t = 0;
    const animate = () => {
      t += 0.005;
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      earthGroup.rotation.y += 0.0014;
      clouds.rotation.y += 0.00045;
      root.rotation.x = mouseRef.current.y * 0.35;
      root.rotation.y = mouseRef.current.x * 0.35 + Math.sin(t * 0.3) * 0.02;
      root.position.y = Math.sin(t * 0.6) * 0.05;

      particles.rotation.y += 0.0006;

      // Pulse markers
      earthGroup.children.forEach((obj) => {
        if ((obj as THREE.Sprite).userData?.isPulse) {
          const sp = obj as THREE.Sprite;
          const ph = (t * 1.4 + sp.userData.phase) % (Math.PI * 2);
          const k = (Math.sin(ph) + 1) * 0.5;
          const s = 0.18 + k * 0.55;
          sp.scale.set(s, s, s);
          (sp.material as THREE.SpriteMaterial).opacity = (1 - k) * 0.55;
        }
      });

      // Animate arcs as airline routes with traveling particles
      arcs.forEach((a) => {
        const cycle = 2.6;
        const phase = ((t + a.offset) % cycle) / cycle; // 0..1
        // Draw the line growing then fading
        const draw = Math.min(1, phase * 1.6);
        a.geom.setDrawRange(0, Math.floor(draw * a.total));
        const fade =
          phase < 0.7 ? 0.9 : Math.max(0, 1 - (phase - 0.7) / 0.3) * 0.9;
        (a.line.material as THREE.LineBasicMaterial).opacity =
          0.35 + Math.sin(t * 3 + a.offset * 10) * 0.08 + fade * 0.3;

        // Traveler
        const travelT = phase < 0.95 ? phase / 0.95 : 1;
        const pos = a.curve.getPoint(travelT);
        a.traveler.position.copy(pos);
        const tOpacity =
          phase < 0.08
            ? phase / 0.08
            : phase > 0.9
              ? Math.max(0, 1 - (phase - 0.9) / 0.1)
              : 1;
        (a.traveler.material as THREE.SpriteMaterial).opacity = tOpacity;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
