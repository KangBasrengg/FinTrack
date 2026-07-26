import { useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

function Coin({ startPos, endPos, delayOffset, scrollY }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Scroll progress controls the coin's journey
    // We multiply scroll by a factor to control how fast it takes off
    const scroll = scrollY.current;
    
    // Coins animate sequentially based on delayOffset
    const startScroll = delayOffset * 100;
    const endScroll = startScroll + 400; // takes 400px of scroll to complete journey
    
    let progress = 0;
    if (scroll > startScroll) {
       progress = (scroll - startScroll) / (endScroll - startScroll);
    }
    progress = Math.max(0, Math.min(1, progress));

    const x = startPos[0] + (endPos[0] - startPos[0]) * progress;
    const z = startPos[2] + (endPos[2] - startPos[2]) * progress;
    // Add a higher arc to the y axis so it flies up clearly from the wallet
    const y = startPos[1] + (endPos[1] - startPos[1]) * progress + Math.sin(progress * Math.PI) * 3.5;

    // Scale up slightly at the peak of the arc for 3D depth effect
    let scale = 1 + Math.sin(progress * Math.PI) * 0.5;
    let opacity = 1;

    // Fade out and shrink when reaching the hand
    if (progress > 0.8) {
      const fadeProgress = (progress - 0.8) / 0.2; // 0 to 1
      opacity = 1 - fadeProgress;
      scale = scale * (1 - fadeProgress);
    }
    
    meshRef.current.scale.set(scale, scale, scale);
    
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    if (material) {
       material.opacity = Math.max(0, opacity);
       material.transparent = true;
       // We can also disable visibility if opacity is effectively 0
       meshRef.current.visible = opacity > 0.01;
    }

    // Ambient floating noise
    const noiseY = Math.sin(t * 2 + delayOffset) * 0.1;
    
    meshRef.current.position.set(x, y + noiseY, z);
    
    // Rotate dynamically
    meshRef.current.rotation.x = progress * Math.PI * 4 + t;
    meshRef.current.rotation.y = progress * Math.PI * 4;
    meshRef.current.rotation.z = Math.cos(t);
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
      <meshStandardMaterial 
        color="#10b981" 
        metalness={0.7} 
        roughness={0.2}
        envMapIntensity={2}
      />
    </mesh>
  );
}

function RealHand() {
  const obj = useLoader(OBJLoader, '/3Dhand/15252_Key_Ring_Wall_Mount_Hand_v1.obj');
  const handObj = useMemo(() => {
    const clone = obj.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Apply skin tone material to all parts of the OBJ
        child.material = new THREE.MeshStandardMaterial({ 
          color: "#ffcba4", 
          roughness: 0.3,
          metalness: 0.1
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [obj]);

  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
     if (group.current) {
        group.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
     }
  });

  return (
    <group ref={group} position={[2.2, -0.5, 0.5]} rotation={[Math.PI / 2, Math.PI, Math.PI / 1.5]}>
       {/* 
         Scale down the OBJ drastically as they are often exported in large units (like mm).
       */}
       <primitive object={handObj} scale={0.08} />
    </group>
  );
}

function Wallet({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const frontFlap = useRef<THREE.Mesh>(null);
  const frontAccent = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if(group.current && frontFlap.current && frontAccent.current) {
        const scroll = scrollY.current;
        const progress = Math.min(1, Math.max(0, scroll / 500));
        
        // Tilt wallet upwards slightly when scrolling
        group.current.rotation.z = 0.2 + progress * 0.2;
        
        // Open the flap more when scrolling
        const flapAngle = 0.5 + progress * 0.8;
        frontFlap.current.rotation.x = flapAngle;
        frontAccent.current.rotation.x = flapAngle;
    }
  });

  return (
    <group ref={group} position={[-2.5, -1, 0]} rotation={[0.2, 0.6, 0.2]}>
      {/* Back flap */}
      <mesh position={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[2.5, 1.8, 0.15]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Front flap */}
      <mesh ref={frontFlap} position={[0, -0.2, 0.2]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[2.5, 1.5, 0.15]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Wallet accent (Green stripe) */}
      <mesh ref={frontAccent} position={[0, -0.2, 0.28]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[2.6, 1.6, 0.02]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      {/* Money stack inside wallet */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.1]} castShadow>
         <boxGeometry args={[2.2, 1.0, 0.2]} />
         <meshStandardMaterial color="#34d399" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Scene({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  // Start inside the wallet's opening
  const start = [-2.3, -0.3, 0.5];
  // End inside the hand's palm
  const end = [2.2, -0.5, 0.5];

  return (
    <group>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Wallet scrollY={scrollY} />
        
        <Suspense fallback={null}>
          <RealHand />
        </Suspense>

        {/* 5 Coins flying from wallet to hand */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Coin 
            key={i}
            startPos={start}
            endPos={end}
            delayOffset={i * 0.5}
            scrollY={scrollY}
          />
        ))}
      </Float>
    </group>
  );
}

export default function Hero3D() {
  const scrollY = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none z-10">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={2048}
        />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#10b981" />
        
        {/* We removed PresentationControls so it doesn't disappear when dragged */}
        <Scene scrollY={scrollY} />
        
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.6} 
          scale={20} 
          blur={2.5} 
          far={5} 
          color="#0f172a"
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
