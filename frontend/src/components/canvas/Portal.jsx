import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../../shaders/portal/vertex.glsl?raw';
import fragmentShader from '../../shaders/portal/fragment.glsl?raw';

export default function Portal() {
  const portalMaterial = useRef();

  useFrame((state, delta) => {
    if (portalMaterial.current) {
      portalMaterial.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[8, 8]} />
      <shaderMaterial
        ref={portalMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColorStart: { value: new THREE.Color('#00d2ff') },
          uColorEnd: { value: new THREE.Color('#ffffff') }
        }}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
