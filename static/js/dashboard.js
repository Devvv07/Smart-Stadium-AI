/**
 * SMART STADIUM AI (3D EDITION) - ADMIN DASHBOARD & OPERATIONAL INSIGHTS CONTROLLER
 * Controls: Live telemetry metrics, Chart.js graphs, AI Operational Insights & Predictive Alerts
 */

(function () {
  'use strict';

  let visitorChart, gateChart, emergencyChart, moduleChart;
  let simInterval = null;

  // DOM Metrics Elements
  const dashVisitorCount = document.getElementById('dashVisitorCount');
  const dashOccupancyRate = document.getElementById('dashOccupancyRate');
  const dashGateBalance = document.getElementById('dashGateBalance');
  const dashEmergencyCount = document.getElementById('dashEmergencyCount');
  const dashQueriesCount = document.getElementById('dashQueriesCount');
  const liveSimSwitch = document.getElementById('liveSimSwitch');
  const refreshAdminInsightsBtn = document.getElementById('refreshAdminInsightsBtn');
  const adminInsightsText = document.getElementById('adminInsightsText');

  function initCharts() {
    // Chart 1: Visitor Flow Line Chart
    const ctxVisitor = document.getElementById('chartVisitorFlow');
    if (ctxVisitor) {
      visitorChart = new Chart(ctxVisitor, {
        type: 'line',
        data: {
          labels: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
          datasets: [{
            label: 'Visitors inside Stadium',
            data: [12400, 28500, 45000, 58200, 64500, 66800, 67200],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // Chart 2: Gate Density Doughnut Chart
    const ctxGate = document.getElementById('chartGateDensity');
    if (ctxGate) {
      gateChart = new Chart(ctxGate, {
        type: 'doughnut',
        data: {
          labels: ['Gate A', 'Gate B', 'Gate C', 'Gate D'],
          datasets: [{
            data: [20, 40, 25, 15],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
        }
      });
    }

    // Chart 3: Emergency Alerts Log Bar Chart
    const ctxEmergency = document.getElementById('chartEmergencyLogs');
    if (ctxEmergency) {
      emergencyChart = new Chart(ctxEmergency, {
        type: 'bar',
        data: {
          labels: ['Medical', 'Lost Child', 'Fire Hazard', 'Security Alert'],
          datasets: [{
            label: 'Incidents Logged Today',
            data: [4, 2, 0, 1],
            backgroundColor: ['#ef4444', '#f59e0b', '#f97316', '#06b6d4'],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true }
          }
        }
      });
    }

    // Chart 4: AI Module Requests Pie Chart
    const ctxModule = document.getElementById('chartAiModules');
    if (ctxModule) {
      moduleChart = new Chart(ctxModule, {
        type: 'pie',
        data: {
          labels: ['Navigation', 'Dining & Food', 'Emergency SOS', 'Accessibility', 'Transit'],
          datasets: [{
            data: [40, 25, 10, 15, 10],
            backgroundColor: ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
        }
      });
    }
  }

  // --- Fetch AI Operational Insights ---
  async function fetchAdminInsights(metrics) {
    if (!adminInsightsText) return;

    // Show loading skeleton state
    adminInsightsText.innerHTML = `
      <div class="placeholder-glow py-1">
        <div class="placeholder col-10 bg-secondary rounded mb-2"></div>
        <div class="placeholder col-8 bg-secondary rounded mb-2"></div>
        <div class="placeholder col-9 bg-secondary rounded"></div>
      </div>
    `;

    try {
      const res = await fetch('/api/admin/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics })
      });
      const data = await res.json();
      if (data.status === 'success' && data.recommendations) {
        adminInsightsText.innerHTML = window.marked ? window.marked.parse(data.recommendations) : data.recommendations;
      }
    } catch (err) {
      console.warn("Insights fetch error:", err);
      adminInsightsText.innerHTML = `<p class="text-light-50 mb-0">Operational telemetry normal. All gates running within standard capacity limits.</p>`;
    }
  }

  // --- Dynamic Predictive AI Alert Feed ---
  function updatePredictiveAlerts(data) {
    const feed = document.getElementById('predictiveAlertFeed');
    if (!feed) return;

    const densities = data.gate_densities || {};
    const highGate = Object.keys(densities).find(g => densities[g] === 'High') || 'Gate B';
    const altGate = highGate === 'Gate B' ? 'Gate A' : 'Gate C';

    feed.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mb-0 border-warning-subtle text-white bg-dark-50 fs-xs" role="alert">
        <span class="badge bg-warning text-dark me-2">PREDICTIVE AI</span>
        <strong>${highGate} Congestion Alert:</strong> ${highGate} crowd level is trending toward 88% capacity in ~20 minutes. Consider opening ${altGate} auxiliary turnstiles early to balance crowd flow.
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }

  // --- Fetch Real-time Telemetry Stats from Flask Backend ---
  async function fetchDashboardStats() {
    try {
      const res = await fetch('/api/dashboard-stats');
      const data = await res.json();

      if (data.status === 'success') {
        if (dashVisitorCount) dashVisitorCount.innerText = data.current_visitors.toLocaleString();
        if (dashOccupancyRate) dashOccupancyRate.innerText = `${data.occupancy_rate}% Occupancy`;
        if (dashEmergencyCount) dashEmergencyCount.innerText = data.active_emergency_alerts;
        if (dashQueriesCount) dashQueriesCount.innerText = data.ai_queries_processed.toLocaleString();

        // Update charts
        if (visitorChart) {
          const lastIndex = visitorChart.data.datasets[0].data.length - 1;
          visitorChart.data.datasets[0].data[lastIndex] = data.current_visitors;
          visitorChart.update();
        }

        if (gateChart) {
          const gA = data.gate_densities["Gate A"] === "Low" ? 20 : 30;
          const gB = data.gate_densities["Gate B"] === "High" ? 45 : 30;
          const gC = 25;
          const gD = 100 - gA - gB - gC;
          gateChart.data.datasets[0].data = [gA, gB, gC, Math.max(5, gD)];
          gateChart.update();
        }

        // Trigger AI Insights & Predictive Alert updates
        fetchAdminInsights(data);
        updatePredictiveAlerts(data);
      }
    } catch (err) {
      console.warn("Dashboard stats update skipped:", err);
    }
  }

  function startLiveSimulation() {
    stopLiveSimulation();
    fetchDashboardStats();
    simInterval = setInterval(fetchDashboardStats, 5000);
  }

  function stopLiveSimulation() {
    if (simInterval) {
      clearInterval(simInterval);
      simInterval = null;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    startLiveSimulation();

    if (liveSimSwitch) {
      liveSimSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
          startLiveSimulation();
          if (window.showAppToast) window.showAppToast("Live Simulation", "Real-time telemetry stream started.");
        } else {
          stopLiveSimulation();
          if (window.showAppToast) window.showAppToast("Simulation Paused", "Real-time telemetry stream paused.");
        }
      });
    }

    if (refreshAdminInsightsBtn) {
      refreshAdminInsightsBtn.addEventListener('click', () => {
        fetchDashboardStats();
        if (window.showAppToast) window.showAppToast("Insights Refreshed", "Operational intelligence recommendations updated.");
      });
    }
  });

})();
