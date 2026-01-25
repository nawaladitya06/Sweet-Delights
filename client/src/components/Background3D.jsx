import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';

function Sweet({ position, color, geometryType = 'cylinder' }) {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh
                ref={meshRef}
                position={position}
                scale={hovered ? 1.2 : 1}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {geometryType === 'cylinder' ? (
                    <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
                ) : (
                    <sphereGeometry args={[0.4, 32, 32]} />
                )}
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
        </Float>
    );
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                {/* Floating Cakes (Cream & Chocolate) */}
                <Sweet position={[-3, 2, 0]} color="#5D4037" geometryType="cylinder" /> {/* Chocolate Cake */}
                <Sweet position={[4, -2, -2]} color="#FFF8E1" geometryType="cylinder" /> {/* Cream Cake */}
                <Sweet position={[-2, -3, 0]} color="#D7CCC8" geometryType="sphere" /> {/* Truffle */}
                <Sweet position={[3, 3, -1]} color="#3E2723" geometryType="sphere" /> {/* Dark Truffle */}
                <Sweet position={[0, 0, -5]} color="#D32F2F" geometryType="cylinder" /> {/* Cherry Red Accent Cake */}
            </Canvas>
        </div>
    );
}
