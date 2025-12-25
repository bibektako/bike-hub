import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

const BikeView360 = ({ bike }) => {
  // For 360° view, we'll use a simple rotating camera around a placeholder
  // In a real implementation, you would load a GLB/GLTF model or use image sequence
  
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Placeholder bike model - replace with actual GLB/GLTF loader */}
        <mesh>
          <boxGeometry args={[2, 1, 0.5]} />
          <meshStandardMaterial color="#0ea5e9" />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.8, -0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={1}
        />
        <Environment preset="sunset" />
      </Canvas>
      <div className="text-center text-white mt-2">
        <p className="text-sm">360° Interactive View - {bike.name}</p>
        <p className="text-xs text-gray-400">Drag to rotate, scroll to zoom</p>
      </div>
    </div>
  );
};

export default BikeView360;

