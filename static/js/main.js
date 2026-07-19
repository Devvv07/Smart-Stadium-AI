/**
 * SMART STADIUM AI (3D EDITION) - MAIN CONTROLLER
 * Connects: Fan/Staff Role Switcher, Staff Console, Multi-language UI, 3D POIs, API modules
 */

(function () {
  'use strict';

  // --- STATIC UI TRANSLATION DICTIONARY ---
  const I18N_DICTIONARY = {
    "English": {
      "nav_hero": "Hero", "nav_assistant": "AI Assistant", "nav_map": "3D Map", "nav_crowd": "Crowd AI",
      "nav_emergency": "Emergency SOS", "nav_dashboard": "Admin Dashboard",
      "hero_badge": "FIFA World Cup 2026 Official Tech Partner", "hero_title": "3D Smart Stadium",
      "hero_subtext": "Navigate matches seamlessly with real-time Gemini AI assistance, 3D interactive gate & facility mapping, live crowd intelligence, and multi-language speech AI.",
      "btn_ask_ai": "Ask AI Assistant", "btn_open_map": "Open 3D Map", "stat_seats": "Stadium Seats",
      "stat_occupancy": "Current Occupancy", "stat_queries": "AI Queries Solved",
      "tab_assistant": "AI Assistant", "tab_map": "3D Stadium Map", "tab_crowd": "Crowd Intelligence",
      "tab_emergency": "Emergency SOS", "tab_accessibility": "Accessibility", "tab_transport": "Transport & Eco",
      "tab_faq": "FAQs", "tab_dashboard": "Admin Dashboard"
    },
    "Spanish": {
      "nav_hero": "Inicio", "nav_assistant": "Asistente IA", "nav_map": "Mapa 3D", "nav_crowd": "Multitud AI",
      "nav_emergency": "SOS Emergencia", "nav_dashboard": "Panel Admin",
      "hero_badge": "Socio Tecnológico Oficial FIFA 2026", "hero_title": "Estadio Inteligente 3D",
      "hero_subtext": "Navega en los partidos sin problemas con la asistencia de IA de Gemini en tiempo real, mapas interactivos 3D y guía de voz en varios idiomas.",
      "btn_ask_ai": "Consultar a IA", "btn_open_map": "Abrir Mapa 3D", "stat_seats": "Asientos del Estadio",
      "stat_occupancy": "Ocupación Actual", "stat_queries": "Consultas Resueltas",
      "tab_assistant": "Asistente IA", "tab_map": "Mapa 3D Estadio", "tab_crowd": "Inteligencia Multitud",
      "tab_emergency": "SOS Emergencia", "tab_accessibility": "Accesibilidad", "tab_transport": "Transporte y Eco",
      "tab_faq": "Preguntas Frecuentes", "tab_dashboard": "Panel de Control"
    },
    "French": {
      "nav_hero": "Accueil", "nav_assistant": "Assistant IA", "nav_map": "Carte 3D", "nav_crowd": "Foule IA",
      "nav_emergency": "SOS Urgence", "nav_dashboard": "Tableau de Bord",
      "hero_badge": "Partenaire Technologique Officiel FIFA 2026", "hero_title": "Stade Intelligent 3D",
      "hero_subtext": "Naviguez facilement pendant les matchs grâce à l'assistance Gemini IA en temps réel, la cartographie 3D et le support vocal multilingue.",
      "btn_ask_ai": "Demander à l'IA", "btn_open_map": "Ouvrir la Carte 3D", "stat_seats": "Places du Stade",
      "stat_occupancy": "Taux d'occupation", "stat_queries": "Requêtes IA traitées",
      "tab_assistant": "Assistant IA", "tab_map": "Carte 3D du Stade", "tab_crowd": "Intelligence Foule",
      "tab_emergency": "SOS Urgence", "tab_accessibility": "Accessibilité", "tab_transport": "Transport & Éco",
      "tab_faq": "FAQ", "tab_dashboard": "Tableau de Bord"
    },
    "Portuguese": {
      "nav_hero": "Início", "nav_assistant": "Assistente IA", "nav_map": "Mapa 3D", "nav_crowd": "Multidão IA",
      "nav_emergency": "SOS Emergência", "nav_dashboard": "Painel Admin",
      "hero_badge": "Parceiro Tecnológico Oficial FIFA 2026", "hero_title": "Estádio Inteligente 3D",
      "hero_subtext": "Navegue nas partidas perfeitamente com a assistência de IA do Gemini em tempo real, mapeamento 3D interativo e voz multilíngue.",
      "btn_ask_ai": "Perguntar à IA", "btn_open_map": "Abrir Mapa 3D", "stat_seats": "Assentos do Estádio",
      "stat_occupancy": "Ocupação Atual", "stat_queries": "Consultas Respondidas",
      "tab_assistant": "Assistente IA", "tab_map": "Mapa 3D Estádio", "tab_crowd": "Inteligência Multidão",
      "tab_emergency": "SOS Emergência", "tab_accessibility": "Acessibilidade", "tab_transport": "Transporte e Eco",
      "tab_faq": "Perguntas Frecuentes", "tab_dashboard": "Painel Admin"
    },
    "Hindi": {
      "nav_hero": "होम", "nav_assistant": "एआई सहायक", "nav_map": "3D मैप", "nav_crowd": "भीड़ एआई",
      "nav_emergency": "आपातकालीन SOS", "nav_dashboard": "एडमिन डैशबोर्ड",
      "hero_badge": "फीफा विश्व कप 2026 आधिकारिक तकनीकी भागीदार", "hero_title": "3D स्मार्ट स्टेडियम",
      "hero_subtext": "रियल-टाइम जेमिनी एआई सहायता, 3D इंटरैक्टिव मैप और बहुभाषी आवाज एआई के साथ मैचों में नेविगेट करें।",
      "btn_ask_ai": "एआई से पूछें", "btn_open_map": "3D मैप खोलें", "stat_seats": "स्टेडियम सीटें",
      "stat_occupancy": "वर्तमान उपस्थिति", "stat_queries": "एआई प्रश्न हल किए गए",
      "tab_assistant": "एआई सहायक", "tab_map": "3D स्टेडियम मैप", "tab_crowd": "भीड़ इंटेलिजेंस",
      "tab_emergency": "आपातकालीन SOS", "tab_accessibility": "सुगमता", "tab_transport": "परिवहन और पर्यावरण",
      "tab_faq": "अक्सर पूछे जाने वाले प्रश्न", "tab_dashboard": "एडमिन डैशबोर्ड"
    }
  };

  // Toast Notification Helper
  window.showAppToast = function (title, body) {
    const toastEl = document.getElementById('liveToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    if (!toastEl) return;

    if (toastTitle) toastTitle.innerText = title;
    if (toastBody) toastBody.innerText = body;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  };

  // --- 1. FAN / STAFF ROLE SWITCHER ENGINE ---
  function initRoleSwitcher() {
    const roleFanBtn = document.getElementById('roleFanBtn');
    const roleStaffBtn = document.getElementById('roleStaffBtn');
    const staffBadge = document.getElementById('staffNavbarBadge');
    const staffOnlyNavs = document.querySelectorAll('.staff-only-nav');

    const savedRole = localStorage.getItem('stadium_role') || 'fan';
    setRoleMode(savedRole);

    if (roleFanBtn) {
      roleFanBtn.addEventListener('click', () => setRoleMode('fan'));
    }
    if (roleStaffBtn) {
      roleStaffBtn.addEventListener('click', () => setRoleMode('staff'));
    }

    function setRoleMode(mode) {
      localStorage.setItem('stadium_role', mode);

      if (mode === 'staff') {
        document.body.classList.remove('mode-fan');
        document.body.classList.add('mode-staff');

        if (roleFanBtn) roleFanBtn.classList.remove('active');
        if (roleStaffBtn) roleStaffBtn.classList.add('active');
        if (staffBadge) staffBadge.classList.remove('d-none');

        staffOnlyNavs.forEach(el => el.classList.remove('d-none'));

        // Switch focus to Staff Console / Admin Dashboard
        const staffTabBtn = document.getElementById('staff-console-tab');
        if (staffTabBtn) {
          const tab = new bootstrap.Tab(staffTabBtn);
          tab.show();
        }

        window.showAppToast("STAFF MODE ACTIVATED", "Accessing Staff Console, AI Insights & Decision Support Telemetry.");

      } else {
        document.body.classList.remove('mode-staff');
        document.body.classList.add('mode-fan');

        if (roleStaffBtn) roleStaffBtn.classList.remove('active');
        if (roleFanBtn) roleFanBtn.classList.add('active');
        if (staffBadge) staffBadge.classList.add('d-none');

        staffOnlyNavs.forEach(el => el.classList.add('d-none'));

        // Default focus to AI Assistant
        const chatTabBtn = document.getElementById('chat-tab');
        if (chatTabBtn) {
          const tab = new bootstrap.Tab(chatTabBtn);
          tab.show();
        }

        window.showAppToast("FAN MODE ACTIVATED", "Switched to Fan Navigation & Assistant View.");
      }
    }
  }

  // --- 2. Theme Toggle ---
  function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('stadium_theme') || 'dark';
    htmlEl.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('stadium_theme', newTheme);
        updateThemeIcon(newTheme);
      });
    }

    function updateThemeIcon(theme) {
      if (!themeIcon) return;
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon text-warning' : 'fa-solid fa-sun text-warning';
    }
  }

  // --- 3. Multi-Language Engine ---
  function initLanguageEngine() {
    const langSelect = document.getElementById('languageSelect');
    if (!langSelect) return;

    langSelect.addEventListener('change', (e) => {
      const lang = e.target.value;
      translateStaticUi(lang);
      window.showAppToast("Language Updated", `System language set to ${lang}`);
    });
  }

  function translateStaticUi(lang) {
    const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY["English"];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerText = dict[key];
    });
  }

  // --- 4. 3D Card Tilt Effect ---
  function init3dTiltCards() {
    const tiltCard = document.getElementById('heroTiltCard');
    if (!tiltCard) return;

    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / rect.height) * 16;
      const rotateY = (x / rect.width) * 16;
      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // --- 5. Navbar & Tab Link Sync ---
  function initTabSync() {
    document.querySelectorAll('[data-tab-target]').forEach(link => {
      link.addEventListener('click', () => {
        const targetTabId = link.getAttribute('data-tab-target');
        const tabEl = document.getElementById(targetTabId);
        if (tabEl) {
          const tab = new bootstrap.Tab(tabEl);
          tab.show();
        }
      });
    });
  }

  // --- 6. POI Controls ---
  function initPoiControls() {
    document.querySelectorAll('.poi-cat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.poi-cat-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-category');
        if (window.filterPOIsByCategory) window.filterPOIsByCategory(cat);
      });
    });

    const searchInput = document.getElementById('poiSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query || !window.STADIUM_POIS) return;

        const match = window.STADIUM_POIS.find(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
        if (match && window.flyCameraToPOI) {
          window.flyCameraToPOI(match.id);
        }
      });
    }
  }

  // --- 7. Render Accessible POI Directory Table ---
  function renderAccessiblePoiTable() {
    const tbody = document.getElementById('accessiblePoiTableBody');
    if (!tbody || !window.STADIUM_POIS) return;

    tbody.innerHTML = '';
    window.STADIUM_POIS.forEach(poi => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="fw-bold text-white"><i class="fa-solid ${poi.icon || 'fa-location-dot'} text-warning me-2"></i>${poi.name}</td>
        <td><span class="badge bg-secondary-subtle text-light border border-secondary">${poi.category}</span></td>
        <td class="text-light-50">${poi.info}</td>
        <td>
          <button class="btn btn-glass-sm btn-select-poi" data-id="${poi.id}"><i class="fa-solid fa-crosshairs me-1"></i> Focus 3D</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-select-poi').forEach(btn => {
      btn.addEventListener('click', () => {
        const poiId = btn.getAttribute('data-id');
        if (window.selectPOI) window.selectPOI(poiId);
      });
    });
  }

  // --- 8. STAFF DECISION SUPPORT CONSOLE CONTROLLER ---
  function initStaffConsole() {
    let selectedIncidentType = "Gate Overcrowding";
    const detailsInput = document.getElementById('staffIncidentDetails');
    const submitBtn = document.getElementById('submitStaffIncidentBtn');
    const actionCard = document.getElementById('staffActionCard');
    const actionText = document.getElementById('staffActionPlanText');
    const urgencyBadge = document.getElementById('staffUrgencyBadge');

    document.querySelectorAll('.btn-staff-incident').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedIncidentType = btn.getAttribute('data-type');
        triggerStaffIncident(selectedIncidentType);
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const customDetails = detailsInput ? detailsInput.value : '';
        triggerStaffIncident(selectedIncidentType, customDetails);
      });
    }

    async function triggerStaffIncident(type, details = '') {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Dispatching...`;
      }

      window.showAppToast("STAFF INCIDENT LOGGED", `Dispatching decision-support action plan for ${type}...`);

      try {
        const res = await fetch('/api/staff/incident', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, details })
        });
        const data = await res.json();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane me-1"></i> Dispatch AI Plan`;
        }

        if (actionCard && data.action_plan) {
          actionCard.classList.remove('d-none');

          if (actionText && window.marked) {
            actionText.innerHTML = window.marked.parse(data.action_plan);
          }

          if (urgencyBadge) {
            urgencyBadge.innerText = `URGENCY: ${data.urgency || 'HIGH'}`;
            urgencyBadge.className = "badge rounded-pill fs-xs px-3 py-2 ";
            if (data.urgency === 'CRITICAL') urgencyBadge.classList.add('badge-urgency-critical');
            else if (data.urgency === 'HIGH') urgencyBadge.classList.add('badge-urgency-high');
            else if (data.urgency === 'MEDIUM') urgencyBadge.classList.add('badge-urgency-medium');
            else urgencyBadge.classList.add('badge-urgency-low');
          }

          actionCard.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        console.error("Staff Console error:", err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane me-1"></i> Dispatch AI Plan`;
        }
      }
    }
  }

  // --- 9. 3D ROUTE NAVIGATION CONTROLLER ---
  function initNavigationController() {
    const generateRouteBtn = document.getElementById('generateRouteBtn');
    const origSelect = document.getElementById('navOrigin');
    const destSelect = document.getElementById('navDestination');
    const routeCard = document.getElementById('routeOutputCard');
    const origText = document.getElementById('routeOriginText');
    const destText = document.getElementById('routeDestText');
    const timeText = document.getElementById('routeTimeText');
    const dirText = document.getElementById('routeDirectionsText');

    if (generateRouteBtn) {
      generateRouteBtn.addEventListener('click', () => {
        const origin = origSelect ? origSelect.value : 'Gate A';
        const destination = destSelect ? destSelect.value : 'Food Court';
        triggerRouteGeneration(origin, destination);
      });
    }

    if (origSelect) {
      origSelect.addEventListener('change', () => {
        const origin = origSelect.value;
        const destination = destSelect ? destSelect.value : 'Food Court';
        if (window.draw3dRoutePath) window.draw3dRoutePath(origin, destination);
      });
    }

    if (destSelect) {
      destSelect.addEventListener('change', () => {
        const origin = origSelect ? origSelect.value : 'Gate A';
        const destination = destSelect.value;
        if (window.draw3dRoutePath) window.draw3dRoutePath(origin, destination);
      });
    }

    async function triggerRouteGeneration(origin, destination) {
      // 1. Render glowing 3D route path in Three.js map
      if (window.draw3dRoutePath) {
        window.draw3dRoutePath(origin, destination);
      }

      // 2. Fetch step-by-step navigation instructions from backend
      if (routeCard) {
        routeCard.classList.remove('d-none');
        if (origText) origText.innerText = origin;
        if (destText) destText.innerText = destination;
        if (timeText) timeText.innerText = "Calculating...";
        if (dirText) dirText.innerHTML = `<div class="spinner-border spinner-border-sm text-success me-2"></div> Generating AI walking route...`;
      }

      try {
        const langSelect = document.getElementById('languageSelect');
        const language = langSelect ? langSelect.value : 'English';

        const res = await fetch('/api/navigate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin, destination, language })
        });
        const data = await res.json();

        if (timeText) timeText.innerText = data.estimated_time || "3-5 mins";
        if (dirText && data.directions) {
          dirText.innerHTML = window.marked ? window.marked.parse(data.directions) : data.directions;
        }

        if (routeCard) routeCard.scrollIntoView({ behavior: 'smooth' });
        if (window.showAppToast) window.showAppToast("Route Generated", `3D Route rendered from ${origin} to ${destination}!`);

      } catch (err) {
        console.error("Navigation controller error:", err);
        if (dirText) dirText.innerText = `Proceed from ${origin} towards ${destination}. Follow green overhead concourse signs.`;
      }
    }

    window.triggerRouteGeneration = triggerRouteGeneration;
  }

  // DOM Loaded
  document.addEventListener('DOMContentLoaded', () => {
    initRoleSwitcher();
    initThemeToggle();
    initLanguageEngine();
    init3dTiltCards();
    initTabSync();
    initPoiControls();
    renderAccessiblePoiTable();
    initStaffConsole();
    initNavigationController();
  });

})();
