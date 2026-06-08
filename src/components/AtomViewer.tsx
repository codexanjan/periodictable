import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ChemicalElement } from '../types/element';
import { Info, RotateCcw } from 'lucide-react';

interface AtomViewerProps {
  element: ChemicalElement;
}

export const AtomViewer: React.FC<AtomViewerProps> = ({ element }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    setLoading(true);

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Get container dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 12);

    // 3. Renderer setup (with alpha for transparent background)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4f46e5, 0.4); // Subtle indigo tint
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 4;
    controlsRef.current = controls;

    // 6. Groups for organization
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);

    // Keep track of resources to dispose
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // --- BUILD NUCLEUS ---
    const protonCount = element.number;
    const neutronCount = Math.round(element.atomic_mass) - protonCount;

    // Cap display counts to keep it clean and performant
    const maxNucleusParticles = 30;
    const displayProtons = Math.min(protonCount, maxNucleusParticles / 2);
    const displayNeutrons = Math.min(Math.max(1, neutronCount), maxNucleusParticles / 2);
    const totalParticles = displayProtons + displayNeutrons;

    // Share sphere geometry for efficiency
    const particleGeo = new THREE.SphereGeometry(0.24, 16, 16);
    geometries.push(particleGeo);

    const protonMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red
      roughness: 0.2,
      metalness: 0.5,
      emissive: 0x991b1b,
      emissiveIntensity: 0.2,
    });
    const neutronMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Blue
      roughness: 0.2,
      metalness: 0.5,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.2,
    });
    materials.push(protonMat, neutronMat);

    // Pac-man cluster of spheres representing the nucleus
    const particles: THREE.Mesh[] = [];

    for (let i = 0; i < totalParticles; i++) {
      const isProton = i < displayProtons;
      const mesh = new THREE.Mesh(particleGeo, isProton ? protonMat : neutronMat);

      // Distribute particles using Fibonacci sphere packing
      const phi = Math.acos(-1 + (2 * i) / totalParticles);
      const theta = Math.sqrt(totalParticles * Math.PI) * phi;
      const radius = 0.15 + Math.random() * 0.35; // Random layer depth

      mesh.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      nucleusGroup.add(mesh);
      particles.push(mesh);
    }

    // --- BUILD SHELLS AND ELECTRONS ---
    interface ElectronData {
      mesh: THREE.Mesh;
      radius: number;
      angle: number;
      speed: number;
      tiltX: number;
      tiltZ: number;
    }

    const electrons: ElectronData[] = [];
    const shellGroup = new THREE.Group();
    atomGroup.add(shellGroup);

    const electronGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 }); // Bright glowing yellow
    geometries.push(electronGeo);
    materials.push(electronMat);

    // Render shells based on Bohr configurations
    element.shells.forEach((eCount, shellIdx) => {
      const shellRadius = 1.6 + shellIdx * 1.0;
      const orbitSpeed = 0.04 / (shellIdx + 1); // Inner shells orbit faster

      // Orbits are tilted slightly in 3D for a more dynamic look
      const tiltX = (shellIdx * 0.25) % (Math.PI / 2);
      const tiltZ = (shellIdx * 0.15) % (Math.PI / 2);

      // Create Ring/Orbit line helper
      const ringPoints = [];
      const segmentCount = 64;
      for (let i = 0; i <= segmentCount; i++) {
        const theta = (i / segmentCount) * Math.PI * 2;
        // Flat circle in X-Z plane
        const p = new THREE.Vector3(shellRadius * Math.cos(theta), 0, shellRadius * Math.sin(theta));
        // Apply tilt
        p.applyAxisAngle(new THREE.Vector3(1, 0, 0), tiltX);
        p.applyAxisAngle(new THREE.Vector3(0, 0, 1), tiltZ);
        ringPoints.push(p);
      }

      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x64748b,
        transparent: true,
        opacity: 0.3,
      });
      const orbitLine = new THREE.Line(ringGeo, ringMat);
      shellGroup.add(orbitLine);
      geometries.push(ringGeo);
      materials.push(ringMat);

      // Place electrons along the tilted orbit
      for (let i = 0; i < eCount; i++) {
        const eMesh = new THREE.Mesh(electronGeo, electronMat);
        const startingAngle = (i / eCount) * Math.PI * 2;

        shellGroup.add(eMesh);

        electrons.push({
          mesh: eMesh,
          radius: shellRadius,
          angle: startingAngle,
          speed: orbitSpeed,
          tiltX,
          tiltZ,
        });
      }
    });

    setLoading(false);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // 1. Slow rotation of the nucleus
      nucleusGroup.rotation.y += 0.005;
      nucleusGroup.rotation.x += 0.002;

      // 2. Animate electrons along orbits
      electrons.forEach((elec) => {
        elec.angle += elec.speed;

        // Position on 2D circle
        const x = elec.radius * Math.cos(elec.angle);
        const z = elec.radius * Math.sin(elec.angle);
        const pos = new THREE.Vector3(x, 0, z);

        // Apply same tilts as the orbit rings
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), elec.tiltX);
        pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), elec.tiltZ);

        elec.mesh.position.copy(pos);
      });

      // 3. Update controls
      controls.update();

      // 4. Render
      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Clean up function
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      // Dispose resources
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [element]);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[320px] md:h-[360px] lg:h-[400px] flex items-center justify-center rounded-2xl bg-slate-900/5 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 z-10">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-500 font-semibold">Generating 3D Atom...</span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
        <button
          onClick={resetCamera}
          title="Reset Camera View"
          className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 bg-white/30 dark:bg-slate-900/30 px-2 py-1 rounded backdrop-blur-sm z-10">
        <Info className="w-3.5 h-3.5" />
        Drag to rotate. Scroll to zoom.
      </div>

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
