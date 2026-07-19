/**
 * SMART STADIUM AI (3D EDITION) - THREE.JS 3D ENGINE
 * Includes: Hero 3D Stadium + 25+ POIs Interactive 3D Zone Map, Camera Fly-To & 3D Animated Route Line
 */

(function () {
  'use strict';

  // --- 25+ STADIUM POINTS OF INTEREST (POIs) DATASET ---
  window.STADIUM_POIS = [
    // Gates
    { id: "gate_a", name: "Gate A", category: "Gates", pos: [0, 0.6, -11], size: [3.5, 1.2, 2], color: 0x3b82f6, icon: "fa-door-open", info: "North Entrance, VIP & Wheelchair Ramp" },
    { id: "gate_b", name: "Gate B", category: "Gates", pos: [12, 0.6, 0], size: [2, 1.2, 3.5], color: 0xf59e0b, icon: "fa-door-open", info: "East Entrance & Express Pass" },
    { id: "gate_c", name: "Gate C", category: "Gates", pos: [0, 0.6, 11], size: [3.5, 1.2, 2], color: 0xef4444, icon: "fa-door-open", info: "South Entrance & Metro Direct Hub" },
    { id: "gate_d", name: "Gate D", category: "Gates", pos: [-12, 0.6, 0], size: [2, 1.2, 3.5], color: 0x8b5cf6, icon: "fa-door-open", info: "West Entrance, Media & Team Bus Bay" },

    // Seating Blocks
    { id: "block_1", name: "Block 1", category: "Seating", pos: [-5, 1.5, -7], size: [3, 2, 2], color: 0x2563eb, icon: "fa-chair", info: "North-West Lower Tier Seating" },
    { id: "block_2", name: "Block 2", category: "Seating", pos: [5, 1.5, -7], size: [3, 2, 2], color: 0x2563eb, icon: "fa-chair", info: "North-East Lower Tier Seating" },
    { id: "vip_block", name: "VIP Block", category: "Seating", pos: [-7, 2.2, 0], size: [2.5, 3, 3], color: 0x06b6d4, icon: "fa-crown", info: "Hospitality Skybox & Executive Suites" },
    { id: "general_stand", name: "General Stand", category: "Seating", pos: [0, 2.5, 7], size: [6, 3.2, 2.5], color: 0x1d4ed8, icon: "fa-users", info: "South Upper Tier Fan Section" },

    // Food & Drinks
    { id: "food_court", name: "Food Court", category: "Food", pos: [-4, 0.8, -3], size: [3.5, 1.4, 2.5], color: 0x10b981, icon: "fa-utensils", info: "Main Concourse: Halal, Vegan & Gluten-Free" },
    { id: "canteen", name: "Canteen", category: "Food", pos: [4, 0.8, 3], size: [2.5, 1.2, 2.2], color: 0x10b981, icon: "fa-burger", info: "Express Snack & Beverage Counter" },
    { id: "water_station", name: "Water Station", category: "Food", pos: [-1, 0.5, -5], size: [1.5, 1, 1.5], color: 0x38bdf8, icon: "fa-faucet-drip", info: "Free Reusable Hydration Station" },
    { id: "snack_kiosk", name: "Snack Kiosk", category: "Food", pos: [6, 0.8, -3], size: [2, 1.2, 2], color: 0x34d399, icon: "fa-cookie", info: "Pretzels, Popcorn & Soft Drinks" },

    // Restrooms
    { id: "washroom_men", name: "Washroom (Men)", category: "Washrooms", pos: [-8, 0.6, -5], size: [2, 1, 2], color: 0x64748b, icon: "fa-restroom", info: "Men's Restroom Suite A" },
    { id: "washroom_women", name: "Washroom (Women)", category: "Washrooms", pos: [8, 0.6, -5], size: [2, 1, 2], color: 0x64748b, icon: "fa-restroom", info: "Women's Restroom Suite B" },
    { id: "accessible_washroom", name: "Accessible Washroom", category: "Washrooms", pos: [-8, 0.6, 5], size: [2.2, 1, 2.2], color: 0x22c55e, icon: "fa-wheelchair", info: "Priority Accessible & Family Washroom" },

    // Facilities
    { id: "parking", name: "Parking", category: "Facilities", pos: [14, 0.5, 8], size: [4, 0.8, 4], color: 0x9333ea, icon: "fa-square-p", info: "Zone P1/P2 EV & Handicap Parking" },
    { id: "medical_room", name: "Medical Room", category: "Facilities", pos: [6, 0.8, -6], size: [2.5, 1.4, 2.5], color: 0xec4899, icon: "fa-briefcase-medical", info: "24/7 First Aid & CPR Doctor Station" },
    { id: "first_aid", name: "First Aid Point", category: "Facilities", pos: [-6, 0.8, 6], size: [2, 1.2, 2], color: 0xf43f5e, icon: "fa-kit-medical", info: "Emergency Defibrillator (AED) Kiosk" },
    { id: "security_desk", name: "Security Desk", category: "Facilities", pos: [0, 0.8, -8.5], size: [2.5, 1.2, 2], color: 0x0284c7, icon: "fa-shield-halved", info: "Stadium Control & Police Officers" },
    { id: "lost_found", name: "Lost & Found", category: "Facilities", pos: [9, 0.6, 4], size: [2.2, 1, 2], color: 0xeab308, icon: "fa-box-open", info: "Information Desk 3 & Lost Items" },
    { id: "atm", name: "ATM/Cash Point", category: "Facilities", pos: [-9, 0.6, 2], size: [1.8, 1, 1.8], color: 0x14b8a6, icon: "fa-money-bill-transfer", info: "Cash Cards & Card Top-up Kiosk" },
    { id: "fan_zone", name: "Fan Zone", category: "Facilities", pos: [0, 0.5, -14], size: [8, 0.6, 4], color: 0xf59e0b, icon: "fa-flag-checkered", info: "Plaza Stage, Big Screens & Games" },
    { id: "merchandise", name: "Merchandise Store", category: "Facilities", pos: [-9, 0.8, -2], size: [2.5, 1.2, 2.5], color: 0xa855f7, icon: "fa-shirt", info: "Official FIFA 2026 Apparel & Souvenirs" },
    { id: "prayer_room", name: "Prayer Room", category: "Facilities", pos: [8, 0.6, -2], size: [2.2, 1, 2], color: 0x10b981, icon: "fa-hands-praying", info: "Quiet Reflection & Multi-faith Room" },

    // Exits
    { id: "main_exit", name: "Main Exit", category: "Exits", pos: [0, 0.5, 13.5], size: [5, 0.8, 2], color: 0x475569, icon: "fa-door-open", info: "South Plaza Egress to Metro Direct" },
    { id: "emergency_exit", name: "Emergency Exit", category: "Exits", pos: [-13, 0.5, 6], size: [2, 0.8, 3], color: 0xd97706, icon: "fa-person-running", info: "Direct Evacuation Route to West Lawn" }
  ];

  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  // --- 1. HERO 3D SCENE ---
  let heroScene, heroCamera, heroRenderer, heroStadiumGroup, heroFootball, heroParticles;
  let mouseX = 0, mouseY = 0;

  function initHeroScene() {
    const container = document.getElementById('hero-canvas-container');
    const canvas = document.getElementById('hero-canvas');
    if (!container || !canvas || !isWebGLAvailable()) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    heroScene = new THREE.Scene();
    heroScene.fog = new THREE.FogExp2(0x0a0f1d, 0.035);

    heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    heroCamera.position.set(0, 12, 28);
    heroCamera.lookAt(0, 0, 0);

    heroRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    heroRenderer.setSize(width, height);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    heroScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x3b82f6, 1.8);
    dirLight.position.set(15, 25, 20);
    heroScene.add(dirLight);

    heroStadiumGroup = new THREE.Group();

    // Outer Canopy Ring
    const ringGeo = new THREE.TorusGeometry(8, 1.2, 16, 50);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8, emissive: 0x1e3a8a, emissiveIntensity: 0.2 });
    const canopyRing = new THREE.Mesh(ringGeo, ringMat);
    canopyRing.rotation.x = Math.PI / 2;
    canopyRing.position.y = 2.5;
    heroStadiumGroup.add(canopyRing);

    // Seating Stands
    for (let i = 1; i <= 3; i++) {
      const standGeo = new THREE.CylinderGeometry(5 + i * 1.5, 4.5 + i * 1.5, 1, 32, 1, true);
      const standMat = new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x2563eb : 0x1d4ed8, roughness: 0.4 });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.y = i * 0.7;
      heroStadiumGroup.add(stand);
    }

    // Grass Pitch
    const pitchGeo = new THREE.PlaneGeometry(10, 6);
    const pitchMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.6 });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.y = 0.1;
    heroStadiumGroup.add(pitch);

    // Floating 3D FIFA Football
    const ballGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, emissive: 0x3b82f6, emissiveIntensity: 0.15 });
    heroFootball = new THREE.Mesh(ballGeo, ballMat);
    const ballWire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.61, 2), new THREE.MeshBasicMaterial({ color: 0x0f172a, wireframe: true }));
    heroFootball.add(ballWire);
    heroFootball.position.set(0, 5.5, 0);
    heroScene.add(heroFootball);

    heroScene.add(heroStadiumGroup);

    // Particle Background
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(200 * 3);
    for (let i = 0; i < 200 * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 60;
      pPos[i + 1] = Math.random() * 30 - 5;
      pPos[i + 2] = (Math.random() - 0.5) * 60;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    heroParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.4, transparent: true, opacity: 0.7 }));
    heroScene.add(heroParticles);

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', onHeroResize);
    animateHero();
  }

  function onHeroResize() {
    const container = document.getElementById('hero-canvas-container');
    if (!container || !heroRenderer) return;
    heroCamera.aspect = container.clientWidth / container.clientHeight;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animateHero() {
    requestAnimationFrame(animateHero);
    if (heroStadiumGroup) heroStadiumGroup.rotation.y += 0.003;
    if (heroFootball) {
      heroFootball.rotation.y += 0.01;
      heroFootball.position.y = 5.5 + Math.sin(Date.now() * 0.002) * 0.4;
    }
    if (heroParticles) heroParticles.rotation.y -= 0.001;
    if (heroCamera) {
      heroCamera.position.x += (mouseX * 4 - heroCamera.position.x) * 0.05;
      heroCamera.position.y += (-mouseY * 3 + 12 - heroCamera.position.y) * 0.05;
      heroCamera.lookAt(0, 2, 0);
    }
    heroRenderer.render(heroScene, heroCamera);
  }


  // --- 2. INTERACTIVE 3D STADIUM ZONE MAP SCENE ---
  let mapScene, mapCamera, mapRenderer, mapRaycaster, mapMouse;
  let poiMeshes = [];
  let currentRouteMesh = null;
  let isOrbitDragging = false, prevMouseX = 0, prevMouseY = 0;
  let targetCamPos = { x: 0, y: 26, z: 26 };

  function initMapScene() {
    const canvas = document.getElementById('stadium-map-canvas');
    if (!canvas || !isWebGLAvailable()) return;

    const parent = canvas.parentElement;
    const width = parent.clientWidth || 800;
    const height = 500;

    mapScene = new THREE.Scene();
    mapScene.background = new THREE.Color(0x0a0f1d);

    mapCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    mapCamera.position.set(0, 26, 26);
    mapCamera.lookAt(0, 0, 0);

    mapRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    mapRenderer.setSize(width, height);
    mapRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mapRaycaster = new THREE.Raycaster();
    mapMouse = new THREE.Vector2();

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    mapScene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(10, 30, 10);
    mapScene.add(dir);

    // Stadium Oval Floor Base
    const floorMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(18, 19, 0.4, 48),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    floorMesh.position.y = -0.2;
    mapScene.add(floorMesh);

    // Pitch Outline on Floor
    const pitch = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 8),
      new THREE.MeshStandardMaterial({ color: 0x065f46 })
    );
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.y = 0.02;
    mapScene.add(pitch);

    // Build 25+ POI Extruded 3D Blocks
    buildPoiMeshes();

    // Populate Navigation Dropdowns
    populateNavigationDropdowns();

    // Event Listeners for Controls, Raycasting Hover & Touch
    canvas.addEventListener('mousedown', (e) => { isOrbitDragging = true; prevMouseX = e.clientX; prevMouseY = e.clientY; });
    window.addEventListener('mouseup', () => { isOrbitDragging = false; });
    canvas.addEventListener('mousemove', onMapMouseMove);
    canvas.addEventListener('click', onMapMouseClick);
    canvas.addEventListener('wheel', onMapWheel, { passive: true });

    // Touch events for mobile drag/zoom
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isOrbitDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      if (isOrbitDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        rotateMapCamera(deltaX, deltaY);
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });
    canvas.addEventListener('touchend', () => { isOrbitDragging = false; });

    window.addEventListener('resize', onMapResize);
    animateMap();
  }

  function buildPoiMeshes() {
    poiMeshes.forEach(m => mapScene.remove(m));
    poiMeshes = [];

    window.STADIUM_POIS.forEach(poi => {
      const boxGeo = new THREE.BoxGeometry(...poi.size);
      const boxMat = new THREE.MeshStandardMaterial({
        color: poi.color,
        roughness: 0.3,
        metalness: 0.2,
        emissive: poi.color,
        emissiveIntensity: 0.15
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.position.set(...poi.pos);
      boxMesh.userData = { ...poi };

      // Pin Marker Indicator
      const pinMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      pinMesh.position.set(0, poi.size[1] / 2 + 0.6, 0);
      boxMesh.add(pinMesh);

      mapScene.add(boxMesh);
      poiMeshes.push(boxMesh);
    });
  }

  function populateNavigationDropdowns() {
    const origSelect = document.getElementById('navOrigin');
    const destSelect = document.getElementById('navDestination');
    if (!origSelect || !destSelect) return;

    origSelect.innerHTML = '';
    destSelect.innerHTML = '';

    window.STADIUM_POIS.forEach(p => {
      const opt1 = document.createElement('option');
      opt1.value = p.name;
      opt1.innerText = `${p.name} (${p.category})`;
      origSelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = p.name;
      opt2.innerText = `${p.name} (${p.category})`;
      destSelect.appendChild(opt2);
    });

    destSelect.value = "Food Court";
  }

  function rotateMapCamera(deltaX, deltaY) {
    if (!mapCamera) return;
    const rotSpeed = 0.005;
    const radius = Math.sqrt(mapCamera.position.x ** 2 + mapCamera.position.z ** 2);
    let theta = Math.atan2(mapCamera.position.x, mapCamera.position.z) - deltaX * rotSpeed;
    
    targetCamPos.x = radius * Math.sin(theta);
    targetCamPos.z = radius * Math.cos(theta);
    targetCamPos.y = Math.max(10, Math.min(40, mapCamera.position.y + deltaY * 0.05));
  }

  function onMapWheel(e) {
    if (!mapCamera) return;
    const zoomFactor = e.deltaY * 0.02;
    targetCamPos.y = Math.max(8, Math.min(40, targetCamPos.y + zoomFactor));
    targetCamPos.z = Math.max(8, Math.min(40, targetCamPos.z + zoomFactor));
  }

  function onMapMouseMove(e) {
    const canvas = document.getElementById('stadium-map-canvas');
    if (!canvas) return;

    if (isOrbitDragging) {
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      rotateMapCamera(deltaX, deltaY);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    mapMouse.x = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mapMouse.y = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    mapRaycaster.setFromCamera(mapMouse, mapCamera);
    const visibleMeshes = poiMeshes.filter(m => m.visible);
    const intersects = mapRaycaster.intersectObjects(visibleMeshes);

    const tooltip = document.getElementById('map3dTooltip');
    if (intersects.length > 0) {
      const hovered = intersects[0].object;
      canvas.style.cursor = 'pointer';

      visibleMeshes.forEach(m => m.material.emissiveIntensity = 0.15);
      hovered.material.emissiveIntensity = 0.6;

      if (tooltip) {
        tooltip.classList.remove('d-none');
        tooltip.style.left = `${e.clientX - rect.left + 15}px`;
        tooltip.style.top = `${e.clientY - rect.top - 10}px`;
        document.getElementById('tooltipTitle').innerText = hovered.userData.name;
        document.getElementById('tooltipDesc').innerText = `${hovered.userData.info} (Click to Navigate)`;
      }
    } else {
      canvas.style.cursor = 'default';
      visibleMeshes.forEach(m => m.material.emissiveIntensity = 0.15);
      if (tooltip) tooltip.classList.add('d-none');
    }
  }

  function onMapMouseClick(e) {
    mapRaycaster.setFromCamera(mapMouse, mapCamera);
    const visibleMeshes = poiMeshes.filter(m => m.visible);
    const intersects = mapRaycaster.intersectObjects(visibleMeshes);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      window.selectPOI(clickedMesh.userData.id);
    }
  }

  // Camera Fly-To POI Function
  window.flyCameraToPOI = function (poiId) {
    const mesh = poiMeshes.find(m => m.userData.id === poiId);
    if (!mesh) return;

    targetCamPos.x = mesh.position.x * 1.4;
    targetCamPos.y = mesh.position.y + 12;
    targetCamPos.z = mesh.position.z + 12;

    // Pulse animation
    mesh.scale.set(1.25, 1.25, 1.25);
    mesh.material.emissiveIntensity = 0.8;
    setTimeout(() => {
      mesh.scale.set(1, 1, 1);
      mesh.material.emissiveIntensity = 0.15;
    }, 400);
  };

  // Select POI Helper
  window.selectPOI = function (poiId) {
    const poi = window.STADIUM_POIS.find(p => p.id === poiId);
    if (!poi) return;

    const origSelect = document.getElementById('navOrigin');
    const destSelect = document.getElementById('navDestination');
    if (destSelect) destSelect.value = poi.name;

    const originName = origSelect ? origSelect.value : (window.STADIUM_POIS[0] ? window.STADIUM_POIS[0].name : "Gate A");

    // Draw 3D route line and fly camera
    if (window.draw3dRoutePath) {
      window.draw3dRoutePath(originName, poi.name);
    }
    window.flyCameraToPOI(poiId);

    if (window.showAppToast) {
      window.showAppToast("POI Selected", `Destination set to ${poi.name} (${poi.category})`);
    }
  };

  // Filter POIs by Category
  window.filterPOIsByCategory = function (category) {
    poiMeshes.forEach(mesh => {
      if (category === 'ALL' || mesh.userData.category === category) {
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  };

  function onMapResize() {
    const canvas = document.getElementById('stadium-map-canvas');
    if (!canvas || !mapRenderer) return;
    const width = canvas.parentElement.clientWidth;
    mapCamera.aspect = width / 500;
    mapCamera.updateProjectionMatrix();
    mapRenderer.setSize(width, 500);
  }

  function animateMap() {
    requestAnimationFrame(animateMap);

    // Smooth Damped Camera Interpolation
    if (mapCamera) {
      mapCamera.position.x += (targetCamPos.x - mapCamera.position.x) * 0.08;
      mapCamera.position.y += (targetCamPos.y - mapCamera.position.y) * 0.08;
      mapCamera.position.z += (targetCamPos.z - mapCamera.position.z) * 0.08;
      mapCamera.lookAt(0, 0, 0);
    }

    // Pulse floating pins
    poiMeshes.forEach(mesh => {
      const pin = mesh.children[0];
      if (pin) pin.position.y = mesh.userData.size[1] / 2 + 0.6 + Math.sin(Date.now() * 0.004) * 0.1;
    });

    // Pulse active 3D glowing route mesh
    if (currentRouteMesh && currentRouteMesh.material) {
      currentRouteMesh.material.emissiveIntensity = 0.65 + Math.sin(Date.now() * 0.006) * 0.35;
    }

    mapRenderer.render(mapScene, mapCamera);
  }


  // --- 3. ANIMATED 3D ROUTE LINE GENERATOR ---
  window.draw3dRoutePath = function (originName, destName) {
    if (!mapScene) return;

    if (currentRouteMesh) {
      mapScene.remove(currentRouteMesh);
      if (currentRouteMesh.geometry) currentRouteMesh.geometry.dispose();
      if (currentRouteMesh.material) currentRouteMesh.material.dispose();
      currentRouteMesh = null;
    }

    const origPoi = window.STADIUM_POIS.find(z => z.name === originName) || window.STADIUM_POIS[0];
    const destPoi = window.STADIUM_POIS.find(z => z.name === destName) || window.STADIUM_POIS[1];

    if (!origPoi || !destPoi) return;

    // Calculate elevated positions above block height so line doesn't z-fight or clip
    const startPos = new THREE.Vector3(
      origPoi.pos[0],
      origPoi.pos[1] + (origPoi.size[1] / 2) + 0.3,
      origPoi.pos[2]
    );
    const endPos = new THREE.Vector3(
      destPoi.pos[0],
      destPoi.pos[1] + (destPoi.size[1] / 2) + 0.3,
      destPoi.pos[2]
    );

    // Arch height dynamically scaled with distance between POIs
    const dist = startPos.distanceTo(endPos);
    const midPos = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
    midPos.y += Math.max(3.0, dist * 0.22);

    const curve = new THREE.CatmullRomCurve3([startPos, midPos, endPos]);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.28, 10, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.4
    });

    currentRouteMesh = new THREE.Mesh(tubeGeo, tubeMat);
    mapScene.add(currentRouteMesh);

    // Pan camera smoothly to view destination POI
    targetCamPos.x = destPoi.pos[0] * 1.3;
    targetCamPos.y = Math.max(16, destPoi.pos[1] + 14);
    targetCamPos.z = destPoi.pos[2] + 16;
  };


  // --- 4. HERO SECTION CTA BUTTON FIX LISTENERS ---
  function initHeroCtaButtons() {
    const heroOpenMapBtn = document.getElementById('heroOpenMapBtn');
    const heroTalkAiBtn = document.getElementById('heroTalkAiBtn');

    if (heroOpenMapBtn) {
      heroOpenMapBtn.addEventListener('click', () => {
        // Switch to 3D Map Tab
        const mapTabEl = document.getElementById('map-tab');
        if (mapTabEl) {
          const tab = new bootstrap.Tab(mapTabEl);
          tab.show();
        }

        // Scroll smoothly to section
        const mapSec = document.getElementById('map-section');
        if (mapSec) mapSec.scrollIntoView({ behavior: 'smooth' });

        // Focus camera on center
        targetCamPos = { x: 0, y: 26, z: 26 };
        if (window.showAppToast) window.showAppToast("3D Map Opened", "Interactive 3D Stadium Map active!");
      });
    }

    if (heroTalkAiBtn) {
      heroTalkAiBtn.addEventListener('click', () => {
        const chatTabEl = document.getElementById('chat-tab');
        if (chatTabEl) {
          const tab = new bootstrap.Tab(chatTabEl);
          tab.show();
        }
        const userInput = document.getElementById('userInput');
        if (userInput) userInput.focus();
      });
    }
  }

  // Initialization on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
    initMapScene();
    initHeroCtaButtons();
  });

})();
