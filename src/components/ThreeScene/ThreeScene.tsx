import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useStore } from '@/src/store';
import { latLonToUtm } from '@/src/utils/coordinates';
import { itemDefs } from '@/src/data/lotes';

const ThreeScene = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const { activeLotId, getActiveLot, isDarkMode, activeMarkers } = useStore();

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        currentMount.innerHTML = '';

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(isDarkMode ? 0x0f172a : 0xe0f2fe);

        const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(50, 100, 50);
        scene.add(dirLight);

        const activeLot = getActiveLot();
        const pts = activeLot.coordenadas_utm;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        pts.forEach(p => {
            if (p[0] < minX) minX = p[0];
            if (p[0] > maxX) maxX = p[0];
            if (p[1] < minY) minY = p[1];
            if (p[1] > maxY) maxY = p[1];
        });
        const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
        const maxDim = Math.max(maxX - minX, maxY - minY);

        camera.position.set(0, maxDim * 0.8, maxDim * 1.2);
        camera.lookAt(0, 0, 0);

        const shape = new THREE.Shape();
        pts.forEach((p, i) => {
            const x = p[0] - cx, y = p[1] - cy;
            i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
        });
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false });
        geometry.rotateX(Math.PI / 2);
        scene.add(new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0x86efac })));

        const itemsGroup = new THREE.Group();
        scene.add(itemsGroup);

        activeMarkers.forEach(marker => {
            const utm = latLonToUtm(marker.lat, marker.lng);
            const px = utm[0] - cx;
            const pz = utm[1] - cy;
            const def = itemDefs[marker.type];
            if (!def) return;

            const group = new THREE.Group();
            const yOffset = 0.3;

            switch (def.type) {
                case 'cabana': {
                    const base = new THREE.Mesh(new THREE.BoxGeometry(def.size[0], 0.2, def.size[2]), new THREE.MeshLambertMaterial({ color: 0x964B00 }));
                    base.position.set(0, yOffset + 0.1, 0);
                    const house = new THREE.Mesh(new THREE.BoxGeometry(def.size[0] * 0.8, def.size[1], def.size[2] * 0.8), new THREE.MeshLambertMaterial({ color: def.colorHex }));
                    house.position.set(0, yOffset + 0.2 + def.size[1] / 2, 0);
                    const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(def.size[0] * 0.5, 0.1, def.size[2] * 0.5), new THREE.MeshLambertMaterial({ color: 0x00008B }));
                    solarPanel.position.set(0, yOffset + 0.2 + def.size[1] + 0.05, 0);
                    group.add(base, house, solarPanel);
                    break;
                }
                case 'piscina':
                case 'yoga': {
                    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(def.size[0] / 2, def.size[0] / 2, def.size[1], 32), new THREE.MeshLambertMaterial({ color: def.colorHex }));
                    mesh.position.set(0, yOffset + def.size[1] / 2, 0);
                    group.add(mesh);
                    break;
                }
                default: {
                    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...def.size), new THREE.MeshLambertMaterial({ color: def.colorHex }));
                    mesh.position.set(0, yOffset + def.size[1] / 2, 0);
                    group.add(mesh);
                    break;
                }
            }
            group.position.set(px, 0, pz);
            itemsGroup.add(group);
        });

        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [activeLotId, activeMarkers, isDarkMode, getActiveLot]);

    return <div ref={mountRef} className="w-full h-full"></div>;
};

export default ThreeScene;

