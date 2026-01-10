"use client";

import { useRef, useMemo } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useVoidStore } from "@/lib/store";

// Custom Sun Shader Material
const SunMaterial = shaderMaterial(
    {
        time: 0,
        colorA: new THREE.Color("#ff6600"),
        colorB: new THREE.Color("#ffcc00"),
        colorC: new THREE.Color("#ff3300"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform vec3 colorC;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 6; i++) {
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }
    
    void main() {
      vec3 pos = vPosition * 2.0;
      
      // Animated turbulence
      float noise1 = fbm(pos + time * 0.1);
      float noise2 = fbm(pos * 2.0 - time * 0.15);
      float noise3 = fbm(pos * 4.0 + time * 0.2);
      
      // Combine noises
      float finalNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
      
      // Color mixing based on noise
      vec3 color = mix(colorA, colorB, finalNoise + 0.5);
      color = mix(color, colorC, noise3 * 0.5 + 0.25);
      
      // Add bright spots (solar flares)
      float flare = pow(max(0.0, noise2), 3.0) * 2.0;
      color += vec3(1.0, 0.8, 0.4) * flare;
      
      // Fresnel rim
      float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
      color += vec3(1.0, 0.5, 0.2) * fresnel * 0.5;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ SunMaterial });

// Corona/Glow effect shader
const CoronaMaterial = shaderMaterial(
    {
        time: 0,
        color: new THREE.Color("#ff8800"),
    },
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      
      // Corona rays
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float rays = sin(angle * 12.0 + time * 2.0) * 0.5 + 0.5;
      rays = pow(rays, 2.0);
      
      // Radial falloff
      float corona = 1.0 - smoothstep(0.2, 0.5, dist);
      corona *= rays * 0.5 + 0.5;
      
      // Animated flicker
      corona *= 0.8 + sin(time * 3.0) * 0.2;
      
      // Outer glow
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 3.0);
      
      vec3 finalColor = color * (corona + glow * 0.5);
      float alpha = corona * 0.8 + glow * 0.3;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ CoronaMaterial });

function Sun() {
    const sunRef = useRef<THREE.Mesh>(null);
    const coronaRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const coronaMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const glowRef = useRef<THREE.PointLight>(null);

    const { cursor } = useVoidStore();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (materialRef.current) {
            materialRef.current.uniforms.time.value = time;
        }
        if (coronaMaterialRef.current) {
            coronaMaterialRef.current.uniforms.time.value = time;
        }

        if (sunRef.current) {
            sunRef.current.rotation.y = time * 0.02;

            // Subtle movement based on cursor
            const targetX = (cursor.x / window.innerWidth - 0.5) * 2;
            const targetY = -(cursor.y / window.innerHeight - 0.5) * 2;
            sunRef.current.position.x += (targetX * 3 - sunRef.current.position.x) * 0.02;
            sunRef.current.position.y += (targetY * 2 - sunRef.current.position.y) * 0.02;
        }

        if (glowRef.current) {
            // Pulsing light intensity
            glowRef.current.intensity = 3 + Math.sin(time * 2) * 0.5;
        }
    });

    return (
        <group position={[-15, 8, -40]}>
            {/* Main sun sphere */}
            <mesh ref={sunRef} scale={8}>
                <sphereGeometry args={[1, 64, 64]} />
                {/* @ts-expect-error - Custom shader material */}
                <sunMaterial ref={materialRef} />
            </mesh>

            {/* Corona */}
            <mesh ref={coronaRef} scale={16}>
                <planeGeometry args={[1, 1]} />
                {/* @ts-expect-error - Custom shader material */}
                <coronaMaterial
                    ref={coronaMaterialRef}
                    transparent
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Point light from sun */}
            <pointLight
                ref={glowRef}
                color="#ff8844"
                intensity={3}
                distance={100}
                decay={2}
            />

            {/* Ambient glow */}
            <pointLight color="#ffaa66" intensity={1} distance={60} />
        </group>
    );
}

// Galaxy spiral arms
function GalaxySpiral() {
    const pointsRef = useRef<THREE.Points>(null);

    const PARTICLE_COUNT = 15000;

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Spiral arm parameters
            const armAngle = (i % 3) * (Math.PI * 2 / 3); // 3 arms
            const distance = Math.random() * 40 + 5;
            const spiralAngle = armAngle + distance * 0.3;

            // Add randomness for natural look
            const randomOffset = (Math.random() - 0.5) * 3;

            positions[i3] = Math.cos(spiralAngle) * distance + randomOffset;
            positions[i3 + 1] = (Math.random() - 0.5) * 2; // Thin disk
            positions[i3 + 2] = Math.sin(spiralAngle) * distance + randomOffset - 30;

            // Colors: blue/purple core, white/blue arms
            const distanceRatio = distance / 45;
            if (distanceRatio < 0.3) {
                // Core - purple/pink
                colors[i3] = 0.8 + Math.random() * 0.2;
                colors[i3 + 1] = 0.3 + Math.random() * 0.3;
                colors[i3 + 2] = 0.9 + Math.random() * 0.1;
            } else if (distanceRatio < 0.6) {
                // Mid - blue
                colors[i3] = 0.4 + Math.random() * 0.3;
                colors[i3 + 1] = 0.6 + Math.random() * 0.3;
                colors[i3 + 2] = 1.0;
            } else {
                // Outer - white/cyan
                colors[i3] = 0.7 + Math.random() * 0.3;
                colors[i3 + 1] = 0.9 + Math.random() * 0.1;
                colors[i3 + 2] = 1.0;
            }
        }

        return [positions, colors];
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    });

    return (
        <points ref={pointsRef} position={[0, 0, -30]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

// Floating asteroids/planets
function SpaceObjects() {
    const groupRef = useRef<THREE.Group>(null);

    const objects = useMemo(() => {
        return Array.from({ length: 8 }, () => ({
            position: [
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 30,
                -20 - Math.random() * 40,
            ] as [number, number, number],
            scale: 0.3 + Math.random() * 0.7,
            speed: 0.1 + Math.random() * 0.3,
            rotationSpeed: 0.01 + Math.random() * 0.02,
            color: ["#4a9eff", "#ff6b6b", "#00ff88", "#ffaa00", "#ff55aa"][Math.floor(Math.random() * 5)],
        }));
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.children.forEach((child, i) => {
            const obj = objects[i];
            child.rotation.x += obj.rotationSpeed;
            child.rotation.y += obj.rotationSpeed * 0.7;
        });
    });

    return (
        <group ref={groupRef}>
            {objects.map((obj, i) => (
                <mesh key={i} position={obj.position} scale={obj.scale}>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshStandardMaterial
                        color={obj.color}
                        emissive={obj.color}
                        emissiveIntensity={0.3}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Dust particles
function CosmicDust() {
    const pointsRef = useRef<THREE.Points>(null);
    const DUST_COUNT = 3000;

    const positions = useMemo(() => {
        const pos = new Float32Array(DUST_COUNT * 3);
        for (let i = 0; i < DUST_COUNT; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = Math.random() * -80;
        }
        return pos;
    }, []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < DUST_COUNT; i++) {
            // Slow drift
            positions[i * 3 + 2] += 0.02;
            if (positions[i * 3 + 2] > 0) {
                positions[i * 3 + 2] = -80;
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#ffffff"
                transparent
                opacity={0.4}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

export function UltimateSpaceScene() {
    const { camera } = useThree();
    const { scrollProgress } = useVoidStore();

    useFrame(() => {
        // Dynamic camera movement
        camera.position.z = 15 - scrollProgress * 10;
        camera.position.y = scrollProgress * 3;
        camera.rotation.x = scrollProgress * 0.15;
    });

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.05} />

            {/* The Sun */}
            <Sun />

            {/* Galaxy spiral */}
            <GalaxySpiral />

            {/* Floating space objects */}
            <SpaceObjects />

            {/* Cosmic dust */}
            <CosmicDust />

            {/* Background color */}
            <color attach="background" args={["#000005"]} />
            <fog attach="fog" args={["#000010", 40, 100]} />
        </>
    );
}
