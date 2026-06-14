import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import "./ColorBends.css";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uRotation;
  uniform float uScale;
  uniform float uFrequency;
  uniform float uWarpStrength;
  uniform float uMouseInfluence;
  uniform float uNoise;
  uniform float uParallax;
  uniform float uIterations;
  uniform float uIntensity;
  uniform float uBandWidth;
  uniform float uTransparent;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor;
  uniform vec3 uColors[4];

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amp * noise(p);
      p *= 2.04;
      amp *= 0.5;
    }
    return value;
  }

  mat2 rotate2d(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  vec3 palette(float t) {
    vec3 a = mix(uColors[0], uColors[1], smoothstep(0.0, 0.38, t));
    vec3 b = mix(uColors[2], uColors[3], smoothstep(0.45, 1.0, t));
    return mix(a, b, smoothstep(0.30, 0.92, t));
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 p = (uv - 0.5) * aspect;
    vec2 mouse = (uMouse - 0.5) * aspect;

    p += mouse * uParallax * 0.18;
    p *= rotate2d(uRotation);
    p *= uScale;

    float t = uTime;
    float bands = 0.0;
    float glow = 0.0;
    vec3 colorMix = vec3(0.0);

    for (int i = 0; i < 4; i++) {
      if (float(i) >= uIterations) break;
      float fi = float(i);
      vec2 q = p;
      float local = t * (0.72 + fi * 0.18);
      q.x += sin(q.y * (1.1 + uFrequency) + local + fi * 1.8) * uWarpStrength * 0.18;
      q.y += cos(q.x * (1.4 + uFrequency * 0.7) - local * 0.84 + fi) * uWarpStrength * 0.13;
      q += (fbm(q * (1.6 + uFrequency) + local * 0.18) - 0.5) * uNoise * 3.0;
      q += mouse * uMouseInfluence * 0.15;

      float ridge = sin(q.x * uFrequency * 2.4 + local + fi * 2.1) * 0.25;
      float bend = q.y + ridge + sin(q.x * 0.72 - local * 0.38) * 0.18;
      float width = max(0.018, 1.0 / max(uBandWidth, 0.1));
      float band = exp(-abs(bend) / width);
      float soft = smoothstep(0.02, 1.0, band);
      bands += soft * (0.55 + fi * 0.12);
      glow += exp(-abs(bend) / (width * 2.4)) * 0.22;
      colorMix += palette(fract(0.18 + fi * 0.23 + q.x * 0.08 + t * 0.04)) * soft;
      p = p.yx * vec2(0.88, -0.92) + vec2(0.07, -0.03);
    }

    float vignette = smoothstep(0.92, 0.12, length((uv - 0.5) * vec2(aspect.x, 1.0)));
    float mist = fbm((uv + mouse * 0.05) * 2.2 + t * 0.035);
    float energy = clamp(bands * 0.36 + glow * 0.55 + mist * 0.10, 0.0, 1.0);
    vec3 base = uColor;
    vec3 col = mix(base, colorMix / max(bands, 0.001), clamp(energy * uIntensity, 0.0, 1.0));
    col += palette(mist) * glow * 0.16 * uIntensity;
    col = mix(base, col, vignette * 0.96 + 0.04);

    float alpha = uTransparent > 0.5
      ? clamp((energy * 0.86 + glow * 0.20) * vignette * uIntensity, 0.0, 0.95)
      : 1.0;

    gl_FragColor = vec4(col, alpha);
  }
`;

function hexToColor(value) {
  return new THREE.Color(value);
}

export default function ColorBends({
  colors = ["#12324a", "#2f6f95", "#74aed5", "#b8e7f4"],
  rotation = 88,
  speed = 0.12,
  scale = 1.15,
  frequency = 0.75,
  warpStrength = 0.65,
  mouseInfluence = 0.45,
  noise = 0.04,
  parallax = 0.22,
  iterations = 2,
  intensity = 0.95,
  bandWidth = 5.5,
  transparent = true,
  autoRotate = -2,
  color = "#0b2435",
  className = ""
}) {
  const rootRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothMouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  const colorUniforms = useMemo(() => {
    const list = [...colors];
    while (list.length < 4) list.push(list[list.length - 1] || "#ffffff");
    return list.slice(0, 4).map(hexToColor);
  }, [colors]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, transparent ? 0 : 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    root.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uRotation: { value: THREE.MathUtils.degToRad(rotation) },
      uScale: { value: scale },
      uFrequency: { value: frequency },
      uWarpStrength: { value: warpStrength },
      uMouseInfluence: { value: mouseInfluence },
      uNoise: { value: noise },
      uParallax: { value: parallax },
      uIterations: { value: iterations },
      uIntensity: { value: intensity },
      uBandWidth: { value: bandWidth },
      uTransparent: { value: transparent ? 1 : 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: smoothMouseRef.current },
      uColor: { value: hexToColor(color) },
      uColors: { value: colorUniforms }
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    const onPointerMove = (event) => {
      const rect = root.getBoundingClientRect();
      mouseRef.current.set(
        THREE.MathUtils.clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1),
        THREE.MathUtils.clamp(1 - (event.clientY - rect.top) / Math.max(1, rect.height), 0, 1)
      );
    };

    let raf = 0;
    let start = performance.now();
    const frame = (now) => {
      const elapsed = (now - start) / 1000;
      smoothMouseRef.current.lerp(mouseRef.current, 0.055);
      uniforms.uTime.value = elapsed * speed;
      uniforms.uRotation.value = THREE.MathUtils.degToRad(rotation + elapsed * autoRotate);
      uniforms.uMouse.value.copy(smoothMouseRef.current);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [
    autoRotate,
    bandWidth,
    color,
    colorUniforms,
    frequency,
    intensity,
    iterations,
    mouseInfluence,
    noise,
    parallax,
    rotation,
    scale,
    speed,
    transparent,
    warpStrength
  ]);

  return <div ref={rootRef} className={`color-bends ${className}`.trim()} />;
}
