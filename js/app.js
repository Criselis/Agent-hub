/* ============================================================
   AgentHub Admin Dashboard - Application Logic (Redesign v2)
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // State
  // ============================================================
  const state = {
    currentSection: 'dashboard',
    theme: localStorage.getItem('agenthub-theme') || 'light',
    mobileSidebarOpen: false,
    errorLogResolved: new Set(),
  };

  try {
    const saved = JSON.parse(localStorage.getItem('agenthub-resolved') || '[]');
    state.errorLogResolved = new Set(saved);
  } catch (e) { /* ignore */ }

  // ============================================================
  // DOM Helpers
  // ============================================================
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ============================================================
  // Utility: Toast Notifications
  // ============================================================
  function showToast(message, type = 'info') {
    const container = $('#toast-container');
    if (!container) return;

    const icons = { success: '\u2713', error: '\u2715', info: '\u2139' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || '\u2139'}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  window.showToast = showToast;

  // ============================================================
  // Theme
  // ============================================================
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('agenthub-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const toggle = $('#theme-toggle');
    if (toggle) {
      toggle.innerHTML = theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
    }
  }
  function toggleTheme() {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
  }

  // ============================================================
  // Navigation
  // ============================================================
  function navigateTo(section) {
    state.currentSection = section;

    $$('.sidebar-nav a').forEach((link) => {
      const sectionName = link.getAttribute('data-section');
      link.classList.toggle('active', sectionName === section);
    });

    const titles = {
      dashboard: 'Dashboard',
      users: 'Usuarios',
      agents: 'Agentes',
      skills: 'Skills',
      contracts: 'Contrataciones',
      error_logs: 'Log de Errores',
    };
    const titleEl = $('#section-title');
    if (titleEl) titleEl.textContent = titles[section] || 'Dashboard';

    $$('.section-content').forEach((el) => {
      el.classList.toggle('active', el.id === `section-${section}`);
    });

    closeMobileSidebar();
  }

  // ============================================================
  // Mobile Sidebar
  // ============================================================
  function openMobileSidebar() {
    state.mobileSidebarOpen = true;
    $('#sidebar').classList.add('open');
    const backdrop = $('#sidebar-backdrop');
    if (backdrop) backdrop.classList.add('show');
  }
  function closeMobileSidebar() {
    state.mobileSidebarOpen = false;
    $('#sidebar').classList.remove('open');
    const backdrop = $('#sidebar-backdrop');
    if (backdrop) backdrop.classList.remove('show');
  }

  // ============================================================
  // Dropdown
  // ============================================================
  function toggleDropdown(btnEl) {
    const container = btnEl.closest('.dropdown-container');
    if (!container) return;
    const menu = container.querySelector('.dropdown-menu');
    if (!menu) return;
    const isOpen = menu.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
      menu.classList.add('open');
      btnEl.setAttribute('aria-expanded', 'true');
    }
  }
  function closeAllDropdowns() {
    $$('.dropdown-menu.open').forEach((menu) => {
      menu.classList.remove('open');
      const btn = menu.closest('.dropdown-container')?.querySelector('.dropdown-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) closeAllDropdowns();
  });

  // ============================================================
  // Modal
  // ============================================================
  function openModal(modalId) {
    const modal = $(`#${modalId}`);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }
  function closeModal(modalId) {
    const modal = $(`#${modalId}`);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  function closeAllModals() {
    $$('.modal-overlay.open').forEach((modal) => {
      modal.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeAllModals(); closeAllDropdowns(); }
    if (e.key === 'Enter') {
      const ddItem = e.target.closest('.dropdown-item');
      if (ddItem) ddItem.click();
    }
  });

  // ============================================================
  // Utility formatters
  // ============================================================
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(value);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatDateFull = (dateStr) =>
    new Date(dateStr).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  // ============================================================
  // Badge helpers
  // ============================================================
  const planBadge = (plan) => {
    const map = { Free: 'badge-free', Pro: 'badge-pro', Enterprise: 'badge-enterprise' };
    return `<span class="badge ${map[plan] || 'badge-free'}">${plan}</span>`;
  };
  const statusBadge = (status) => {
    if (status === 'active') return `<span class="badge badge-active">Activo</span>`;
    if (status === 'inactive') return `<span class="badge badge-inactive">Inactivo</span>`;
    if (status === 'pending') return `<span class="badge badge-pending">Pendiente</span>`;
    if (status === 'failing') return `<span class="badge badge-failing">Fallando</span>`;
    return `<span class="badge badge-inactive">${status}</span>`;
  };
  const typeBadge = (type) => {
    const map = { critical: 'badge-critical', warning: 'badge-warning', info: 'badge-info' };
    const labels = { critical: 'Critical', warning: 'Warning', info: 'Info' };
    return `<span class="badge ${map[type] || 'badge-info'}">${labels[type] || type}</span>`;
  };
  const agentStatusBadge = (status) => {
    if (status === 'active') return `<span class="badge badge-active">Activo</span>`;
    if (status === 'inactive') return `<span class="badge badge-inactive">Inactivo</span>`;
    if (status === 'failing') return `<span class="badge badge-failing">Fallando</span>`;
    return `<span class="badge badge-inactive">${status}</span>`;
  };

  const statusBarColor = (status) => {
    if (status === 'active') return '#10b981';
    if (status === 'inactive') return '#94a3b8';
    if (status === 'failing') return '#ef4444';
    return '#94a3b8';
  };

  // ============================================================
  // RENDER: Dashboard (5 KPIs, 3 charts, 3 info cards)
  // ============================================================
  function renderDashboard() {
    const container = $('#section-dashboard');
    if (!container) return;

    const m = AgentHub.metrics;

    const kpiData = [
      {
        title: 'Ingresos del Mes',
        value: formatCurrency(m.monthlyRevenue),
        change: `${m.revenueChange >= 0 ? '+' : ''}${m.revenueChange}%`,
        positive: m.revenueChange >= 0,
        icon: '\uD83D\uDCB0',
        boxBg: 'bg-blue-50 dark:bg-blue-900/20',
        boxText: 'text-blue-600 dark:text-blue-400',
      },
      {
        title: 'Descuentos',
        value: formatCurrency(m.discounts),
        change: `${m.discountsChange >= 0 ? '+' : ''}${m.discountsChange}%`,
        positive: m.discountsChange >= 0,
        icon: '\uD83C\uDFF7\uFE0F',
        boxBg: 'bg-orange-50 dark:bg-orange-900/20',
        boxText: 'text-orange-600 dark:text-orange-400',
      },
      {
        title: 'Agentes Activos',
        value: m.activeAgents.toString(),
        change: `${m.activeAgentsChange >= 0 ? '+' : ''}${m.activeAgentsChange}%`,
        positive: m.activeAgentsChange >= 0,
        icon: '\uD83E\uDD16',
        boxBg: 'bg-green-50 dark:bg-green-900/20',
        boxText: 'text-green-600 dark:text-green-400',
      },
      {
        title: 'Agentes Fallando',
        value: m.failingAgents.toString(),
        change: `${m.failingAgentsChange >= 0 ? '+' : ''}${m.failingAgentsChange}%`,
        positive: m.failingAgentsChange <= 0,
        icon: '\u26A0\uFE0F',
        boxBg: 'bg-red-50 dark:bg-red-900/20',
        boxText: 'text-red-600 dark:text-red-400',
      },
      {
        title: 'Contratos Activos',
        value: m.activeContracts.toString(),
        change: `${m.activeContractsChange >= 0 ? '+' : ''}${m.activeContractsChange}%`,
        positive: m.activeContractsChange >= 0,
        icon: '\uD83D\uDCCB',
        boxBg: 'bg-purple-50 dark:bg-purple-900/20',
        boxText: 'text-purple-600 dark:text-purple-400',
      },
    ];

    let kpiHtml = '';
    kpiData.forEach((kpi, idx) => {
      kpiHtml += `
        <div class="kpi-card animate-fade-in animate-fade-in-d${idx + 1}" style="animation-fill-mode: both;">
          <div class="flex items-center gap-4">
            <div class="kpi-icon-box ${kpi.boxBg} ${kpi.boxText}">${kpi.icon}</div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">${kpi.title}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">${kpi.value}</p>
              <p class="mt-1 text-xs font-medium ${kpi.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                ${kpi.change} vs mes anterior
              </p>
            </div>
          </div>
        </div>`;
    });

    // Chart card data
    const days = ['Lun', 'Mar', 'Mi\u00e9', 'Jue', 'Vie', 'S\u00e1b', 'Dom'];
    const weekData = [42, 55, 38, 62, 48, 30, 22];
    const weekData2 = [28, 35, 30, 45, 40, 20, 15];
    const rentalData = [8, 12, 7, 15, 10, 5, 3];
    const errorData = [3, 5, 2, 7, 4, 1, 0];
    const maxVal = Math.max(...weekData, ...weekData2, ...rentalData, ...errorData);

    const unifiedBarHtml = days.map((day, i) => {
      const h1 = (weekData[i] / maxVal) * 180;
      const h2 = (weekData2[i] / maxVal) * 180;
      const h3 = (rentalData[i] / maxVal) * 180;
      const h4 = (errorData[i] / maxVal) * 180;
      return `
        <div class="flex-1 flex flex-col items-center gap-2">
          <div class="w-full flex items-end justify-center gap-1" style="height:180px;">
            <div class="w-3 rounded-t bg-blue-500 dark:bg-blue-400 transition-all hover:opacity-80" style="height:${h1}px" title="Consultas: ${weekData[i]}"></div>
            <div class="w-3 rounded-t bg-emerald-400 dark:bg-emerald-500 transition-all hover:opacity-80" style="height:${h2}px" title="Agentes: ${weekData2[i]}"></div>
            <div class="w-3 rounded-t bg-purple-400 dark:bg-purple-500 transition-all hover:opacity-80" style="height:${h3}px" title="Contratos: ${rentalData[i]}"></div>
            <div class="w-3 rounded-t bg-red-400 dark:bg-red-500 transition-all hover:opacity-80" style="height:${h4}px" title="Errores: ${errorData[i]}"></div>
          </div>
          <span class="text-[10px] text-gray-400 dark:text-gray-500 font-medium">${day}</span>
        </div>`;
    }).join('');

    // Recent activity mock
    const recentActivity = [
      { action: 'Nuevo agente contratado', detail: 'DataBot - TechCorp S.A.', time: 'Hace 2 min' },
      { action: 'Error resuelto', detail: 'AutoMate - Timeout recuperado', time: 'Hace 15 min' },
      { action: 'Usuario registrado', detail: 'Diego Hernández - CloudSys', time: 'Hace 1 hora' },
      { action: 'Contrato finalizado', detail: 'AutoMate - Analytix Corp', time: 'Hace 3 horas' },
      { action: 'Alerta de rendimiento', detail: 'WebScout - Latencia alta', time: 'Hace 5 horas' },
    ];

    // Latest contracts
    const latestContracts = AgentHub.contracts.slice(0, 4).map(c => `
      <div class="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">${c.agent}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">${c.client}</p>
        </div>
        <span class="text-sm font-semibold text-gray-900 dark:text-white">${formatCurrency(c.total)}</span>
      </div>`).join('');

    // General stats
    const totalUsers = AgentHub.users.length;
    const activeUsers = AgentHub.users.filter(u => u.status === 'active').length;
    const totalAgents = AgentHub.agents.length;
    const activeAgentsCount = AgentHub.agents.filter(a => a.status === 'active').length;
    const totalContracts = AgentHub.contracts.length;
    const totalSkills = AgentHub.skills.length;

    container.innerHTML = `
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Resumen General</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        ${kpiHtml}
      </div>

      <!-- Single Unified Chart - Full Width -->
      <div class="chart-card mt-8 animate-fade-in animate-fade-in-d1" style="animation-fill-mode: both;">
        <div class="chart-header">
          <span class="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Actividad Semanal</span>
        </div>
        <div class="chart-body">
          <div class="w-full">
            <div class="flex items-center gap-6 mb-5">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-sm bg-blue-500 dark:bg-blue-400"></span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Consultas</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-500"></span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Agentes</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-sm bg-purple-400 dark:bg-purple-500"></span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Contratos</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-sm bg-red-400 dark:bg-red-500"></span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Errores</span>
              </div>
            </div>
            <div class="flex items-end gap-3 h-48">
              ${unifiedBarHtml}
            </div>
          </div>
        </div>
      </div>

      <!-- Info Cards Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <div class="info-card animate-fade-in animate-fade-in-d2" style="animation-fill-mode: both;">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            Actividad Reciente
          </h3>
          <div class="space-y-0">
            ${recentActivity.map(a => `
              <div class="flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                <div class="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200">${a.action}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">${a.detail}</p>
                </div>
                <span class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">${a.time}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="info-card animate-fade-in animate-fade-in-d3" style="animation-fill-mode: both;">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            Últimos Contratos
          </h3>
          <div>
            ${latestContracts}
          </div>
        </div>

        <div class="info-card animate-fade-in animate-fade-in-d4" style="animation-fill-mode: both;">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-purple-500"></span>
            Estadísticas Generales
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p class="text-xs text-gray-500 dark:text-gray-400">Usuarios</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">${totalUsers}</p>
              <p class="text-xs text-green-600 dark:text-green-400">${activeUsers} activos</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p class="text-xs text-gray-500 dark:text-gray-400">Agentes</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">${totalAgents}</p>
              <p class="text-xs text-green-600 dark:text-green-400">${activeAgentsCount} activos</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p class="text-xs text-gray-500 dark:text-gray-400">Contratos</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">${totalContracts}</p>
              <p class="text-xs text-blue-600 dark:text-blue-400">${m.activeContracts} activos</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p class="text-xs text-gray-500 dark:text-gray-400">Skills</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">${totalSkills}</p>
              <p class="text-xs text-purple-600 dark:text-purple-400">en catálogo</p>
            </div>
          </div>
        </div>
      </div>`;
  }

  // ============================================================
  // RENDER: Users
  // ============================================================
  function renderUsers() {
    const container = $('#section-users');
    if (!container) return;

    let rows = '';
    AgentHub.users.forEach((user) => {
      const displayStatus = user.status;
      rows += `
        <tr>
          <td>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                ${user.name.charAt(0)}${user.name.split(' ')[1]?.charAt(0) || ''}
              </div>
              <span class="font-medium text-gray-900 dark:text-white">${user.name}</span>
            </div>
          </td>
          <td class="text-gray-600 dark:text-gray-400">${user.email}</td>
          <td>${planBadge(user.plan)}</td>
          <td>${statusBadge(displayStatus)}</td>
          <td>
            <div class="dropdown-container">
              <button class="btn btn-ghost btn-icon dropdown-btn" aria-label="Opciones" onclick="window._toggleDropdown(this)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/></svg>
              </button>
              <div class="dropdown-menu">
                <button class="dropdown-item" onclick="window._viewUser(${user.id})">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  Ver detalle
                </button>
                <button class="dropdown-item danger" onclick="window._deleteUser(${user.id})">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  Eliminar
                </button>
              </div>
            </div>
          </td>
        </tr>`;
    });

    container.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Usuarios Registrados</h2>
        <span class="text-sm text-gray-500 dark:text-gray-400">${AgentHub.users.length} usuarios</span>
      </div>
      <div class="table-container">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  window._viewUser = (userId) => {
    const user = AgentHub.users.find((u) => u.id === userId);
    if (!user) return;
    const modal = $('#modal-user-detail');
    if (!modal) return;
    modal.querySelector('.modal-body').innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div class="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400">
            ${user.name.charAt(0)}${user.name.split(' ')[1]?.charAt(0) || ''}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${user.name}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">${user.email}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Empresa</p>
            <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${user.company}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Plan</p>
            <p class="mt-1">${planBadge(user.plan)}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Estado</p>
            <p class="mt-1">${statusBadge(user.status)}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Registro</p>
            <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${formatDateFull(user.registeredAt)}</p>
          </div>
        </div>
      </div>`;
    openModal('modal-user-detail');
    closeAllDropdowns();
  };

  window._deleteUser = (userId) => {
    const user = AgentHub.users.find((u) => u.id === userId);
    if (user) showToast(`Usuario "${user.name}" eliminado correctamente`, 'success');
    closeAllDropdowns();
  };

  window._toggleDropdown = toggleDropdown;

  // ============================================================
  // RENDER: Agents (with colored status bar)
  // ============================================================
  function renderAgents() {
    const container = $('#section-agents');
    if (!container) return;

    let cards = '';
    AgentHub.agents.forEach((agent) => {
      const skillTags = agent.skills
        .map((s) => `<span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">${s}</span>`)
        .join('');

      cards += `
        <div class="agent-card">
          <div class="agent-status-bar" style="background:${statusBarColor(agent.status)}"></div>
          <div class="agent-card-body">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">${agent.name}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">${agent.owner}</p>
              </div>
              <div class="flex items-center gap-2">
                ${agentStatusBadge(agent.status)}
                <div class="dropdown-container">
                  <button class="btn btn-ghost btn-icon dropdown-btn" aria-label="Opciones" onclick="window._toggleDropdown(this)">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/></svg>
                  </button>
                  <div class="dropdown-menu">
                    <button class="dropdown-item" onclick="window._configureAgent(${agent.id})">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      Configurar
                    </button>
                    <button class="dropdown-item danger" onclick="window._deleteAgent(${agent.id})">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-3">
              ${skillTags}
            </div>
            <button class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 mt-3 skills-toggle" onclick="window._toggleSkills(this, ${agent.id})">
              <svg class="w-3.5 h-3.5 transition-transform duration-300 skills-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
              <span>Ver skills</span>
            </button>
            <div class="skills-collapse" data-agent-skills="${agent.id}">
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Skills detalladas</p>
                <ul class="space-y-1.5">
                  ${agent.skills.map((s) => `<li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>${s}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>`;
    });

    container.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Agentes</h2>
        <span class="text-sm text-gray-500 dark:text-gray-400">${AgentHub.agents.length} agentes</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${cards}
      </div>`;
  }

  window._toggleSkills = (btn, agentId) => {
    const collapse = document.querySelector(`[data-agent-skills="${agentId}"]`);
    const arrow = btn.querySelector('.skills-arrow');
    const text = btn.querySelector('span');
    if (!collapse) return;
    const isOpen = collapse.classList.contains('open');
    if (isOpen) {
      collapse.classList.remove('open');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
      if (text) text.textContent = 'Ver skills';
    } else {
      collapse.classList.add('open');
      if (arrow) arrow.style.transform = 'rotate(180deg)';
      if (text) text.textContent = 'Ocultar skills';
    }
  };

  window._configureAgent = (agentId) => {
    const agent = AgentHub.agents.find((a) => a.id === agentId);
    if (!agent) return;
    const modal = $('#modal-agent-config');
    if (!modal) return;
    modal.querySelector('.modal-body').innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-lg font-bold text-blue-600 dark:text-blue-400">
            ${agent.name.charAt(0)}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${agent.name}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">${agent.owner}</p>
          </div>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">System Prompt</p>
          <textarea rows="8" class="w-full bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm font-mono leading-relaxed resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none">${agent.systemPrompt}</textarea>
        </div>
      </div>`;
    openModal('modal-agent-config');
    closeAllDropdowns();
  };

  window._deleteAgent = (agentId) => {
    const agent = AgentHub.agents.find((a) => a.id === agentId);
    if (agent) showToast(`Agente "${agent.name}" eliminado correctamente`, 'success');
    closeAllDropdowns();
  };

  // ============================================================
  // RENDER: Skills (as small cards with icons)
  // ============================================================
  function renderSkills() {
    const container = $('#section-skills');
    if (!container) return;

    const skillIcons = [
      '\uD83C\uDF10', '\uD83D\uDCC4', '\uD83D\uDCC5', '\uD83D\uDCE8', '\uD83D\uDD0D',
      '\uD83E\uDDF1', '\u2699\uFE0F', '\uD83D\uDCCA', '\uD83D\uDCE6', '\uD83D\uDD17',
      '\uD83D\uDC40', '\uD83D\uDCDC'
    ];

    let cards = '';
    AgentHub.skills.forEach((skill, i) => {
      const icon = skillIcons[i % skillIcons.length];
      cards += `
        <div class="skill-card flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-lg flex-shrink-0">
            ${icon}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-gray-900 dark:text-white text-sm">${skill.name}</h3>
              <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium">${skill.agentCount} agentes</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${skill.description}</p>
          </div>
          <div class="dropdown-container flex-shrink-0">
            <button class="btn btn-ghost btn-icon dropdown-btn" aria-label="Opciones" onclick="window._toggleDropdown(this)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/></svg>
            </button>
            <div class="dropdown-menu">
              <button class="dropdown-item" onclick="window._viewSkill(${skill.id})">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                Ver detalle
              </button>
              <button class="dropdown-item danger" onclick="window._deleteSkill(${skill.id})">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>`;
    });

    container.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Catálogo de Skills</h2>
        <span class="text-sm text-gray-500 dark:text-gray-400">${AgentHub.skills.length} skills</span>
      </div>

      <div class="p-5 mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center flex-shrink-0 text-lg">\uD83D\uDCA1</div>
          <div>
            <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-1">¿Qué es una Skill?</h3>
            <p class="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
              Las Skills son capacidades adicionales que pueden asignarse a los agentes de IA para extender sus funcionalidades. 
              Cada agente puede tener múltiples skills, lo que permite personalizar su comportamiento según las necesidades del cliente.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        ${cards}
      </div>`;
  }

  window._viewSkill = (skillId) => {
    const skill = AgentHub.skills.find((s) => s.id === skillId);
    if (!skill) return;
    const agentsUsing = AgentHub.agents.filter((a) => a.skills.includes(skill.name));
    const modal = $('#modal-skill-detail');
    if (!modal) return;
    const agentList = agentsUsing.length
      ? agentsUsing.map((a) => `<li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>${a.name} <span class="text-gray-400 dark:text-gray-500">- ${a.owner}</span></li>`).join('')
      : '<p class="text-sm text-gray-400 dark:text-gray-500">Ningún agente utiliza esta skill.</p>';
    modal.querySelector('.modal-body').innerHTML = `
      <div class="space-y-4">
        <div class="pb-4 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${skill.name}</h3>
            <span class="badge badge-info">${skill.agentCount} agentes</span>
          </div>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Descripción</p>
          <p class="text-sm text-gray-700 dark:text-gray-300">${skill.description}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Agentes que la utilizan</p>
          <ul class="space-y-1.5">${agentList}</ul>
        </div>
      </div>`;
    openModal('modal-skill-detail');
    closeAllDropdowns();
  };

  window._deleteSkill = (skillId) => {
    const skill = AgentHub.skills.find((s) => s.id === skillId);
    if (skill) showToast(`Skill "${skill.name}" eliminada correctamente`, 'success');
    closeAllDropdowns();
  };

  // ============================================================
  // RENDER: Contracts
  // ============================================================
  function renderContracts() {
    const container = $('#section-contracts');
    if (!container) return;

    let rows = '';
    AgentHub.contracts.forEach((c) => {
      const skillTags = c.skills.slice(0, 2)
        .map((s) => `<span class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">${s}</span>`)
        .join('');
      const remaining = c.skills.length - 2;

      rows += `
        <tr>
          <td class="font-medium text-gray-900 dark:text-white">${c.client}</td>
          <td>
            <span class="text-gray-900 dark:text-white font-medium">${c.agent}</span>
          </td>
          <td>
            <div class="flex flex-wrap gap-1">
              ${skillTags}
              ${remaining > 0 ? `<span class="text-xs text-gray-400 dark:text-gray-500">+${remaining} más</span>` : ''}
            </div>
          </td>
          <td class="text-gray-600 dark:text-gray-400 text-sm">${formatDate(c.startDate)} — ${formatDate(c.endDate)}</td>
          <td class="font-medium text-gray-900 dark:text-white">${formatCurrency(c.total)}</td>
          <td>
            <div class="dropdown-container">
              <button class="btn btn-ghost btn-icon dropdown-btn" aria-label="Opciones" onclick="window._toggleDropdown(this)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/></svg>
              </button>
              <div class="dropdown-menu">
                <button class="dropdown-item" onclick="window._viewContract(${c.id})">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  Ver detalle
                </button>
              </div>
            </div>
          </td>
        </tr>`;
    });

    container.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Contrataciones</h2>
        <span class="text-sm text-gray-500 dark:text-gray-400">${AgentHub.contracts.length} contratos</span>
      </div>
      <div class="table-container">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Agente</th>
                <th>Skills</th>
                <th>Fechas</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  window._viewContract = (contractId) => {
    const c = AgentHub.contracts.find((ct) => ct.id === contractId);
    if (!c) return;
    const modal = $('#modal-contract-detail');
    if (!modal) return;
    const skillRows = c.skills.map((s, i) => `
      <tr>
        <td class="py-2 text-sm text-gray-700 dark:text-gray-300">${s}</td>
        <td class="py-2 text-sm text-gray-900 dark:text-white text-right font-medium">${formatCurrency(c.skillPrices[i] || 0)}</td>
      </tr>`).join('');
    modal.querySelector('.modal-body').innerHTML = `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Cliente</p>
            <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${c.client}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Agente</p>
            <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${c.agent}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Duración</p>
            <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${c.duration}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Periodo</p>
            <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${formatDate(c.startDate)} — ${formatDate(c.endDate)}</p>
          </div>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Skills Contratadas</p>
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700">
                <th class="py-1.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500">Skill</th>
                <th class="py-1.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">Precio</th>
              </tr>
            </thead>
            <tbody>${skillRows}</tbody>
            <tfoot>
              <tr class="border-t border-gray-200 dark:border-gray-600">
                <td class="py-2 text-sm font-semibold text-gray-900 dark:text-white">Total</td>
                <td class="py-2 text-sm font-semibold text-gray-900 dark:text-white text-right">${formatCurrency(c.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>`;
    openModal('modal-contract-detail');
    closeAllDropdowns();
  };

  // ============================================================
  // RENDER: Error Logs
  // ============================================================
  function renderErrorLogs() {
    const container = $('#section-error_logs');
    if (!container) return;

    let rows = '';
    AgentHub.errorLogs.forEach((log) => {
      const isResolved = state.errorLogResolved.has(log.id) || log.resolved;
      rows += `
        <tr class="${isResolved ? 'opacity-60' : ''}">
          <td class="text-sm text-gray-600 dark:text-gray-400 font-mono">${log.timestamp}</td>
          <td class="font-medium text-gray-900 dark:text-white">${log.agent}</td>
          <td>${typeBadge(log.type)}</td>
          <td class="text-gray-600 dark:text-gray-400 max-w-xs truncate">${log.description}</td>
          <td>
            <div class="dropdown-container">
              <button class="btn btn-ghost btn-icon dropdown-btn" aria-label="Opciones" onclick="window._toggleDropdown(this)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/></svg>
              </button>
              <div class="dropdown-menu">
                <button class="dropdown-item" onclick="window._viewError(${log.id})">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  Ver detalle
                </button>
                ${!isResolved ? `
                <button class="dropdown-item" onclick="window._resolveError(${log.id})">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Marcar como resuelto
                </button>` : ''}
              </div>
            </div>
          </td>
        </tr>`;
    });

    const totalErrors = AgentHub.errorLogs.length;
    const resolvedCount = AgentHub.errorLogs.filter((l) => state.errorLogResolved.has(l.id) || l.resolved).length;

    container.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Log de Errores</h2>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">${resolvedCount}/${totalErrors} resueltos</span>
          <span class="text-sm text-gray-500 dark:text-gray-400">${totalErrors} eventos</span>
        </div>
      </div>
      <div class="table-container">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Agente</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  window._viewError = (errorId) => {
    const log = AgentHub.errorLogs.find((l) => l.id === errorId);
    if (!log) return;
    const modal = $('#modal-error-detail');
    if (!modal) return;
    modal.querySelector('.modal-body').innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${log.agent}</h3>
            ${typeBadge(log.type)}
          </div>
          <span class="text-xs text-gray-400 dark:text-gray-500 font-mono">${log.timestamp}</span>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Mensaje</p>
          <p class="text-sm text-gray-700 dark:text-gray-300">${log.description}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Contexto</p>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-700 dark:text-gray-300">${log.context}</p>
          </div>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Stack Trace</p>
          <pre class="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono leading-relaxed overflow-x-auto">${log.stackTrace}</pre>
        </div>
      </div>`;
    openModal('modal-error-detail');
    closeAllDropdowns();
  };

  window._resolveError = (errorId) => {
    const log = AgentHub.errorLogs.find((l) => l.id === errorId);
    if (!log) return;
    state.errorLogResolved.add(log.id);
    localStorage.setItem('agenthub-resolved', JSON.stringify([...state.errorLogResolved]));
    showToast(`Error de "${log.agent}" marcado como resuelto`, 'success');
    renderErrorLogs();
    closeAllDropdowns();
  };

  // ============================================================
  // Search
  // ============================================================
  function handleSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) return;

    // Simple search across users and agents
    const foundUsers = AgentHub.users.filter(u => 
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q)
    );
    const foundAgents = AgentHub.agents.filter(a => 
      a.name.toLowerCase().includes(q) || a.owner.toLowerCase().includes(q)
    );

    let msg = '';
    if (foundUsers.length) {
      msg += `Usuarios: ${foundUsers.map(u => u.name).join(', ')}. `;
    }
    if (foundAgents.length) {
      msg += `Agentes: ${foundAgents.map(a => a.name).join(', ')}. `;
    }
    if (!msg) {
      msg = `No se encontraron resultados para "${q}"`;
    }
    showToast(msg, 'info');
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    applyTheme(state.theme);

    // Create toast container
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    // Global functions
    window._navigateTo = navigateTo;
    window._toggleTheme = toggleTheme;
    window._openMobileSidebar = openMobileSidebar;
    window._closeMobileSidebar = closeMobileSidebar;
    window._handleSearch = handleSearch;

    // Modal close handlers
    $$('.modal-overlay').forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        });
      }
    });

    // Search handler
    const searchInput = $('#search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSearch(searchInput.value);
        }
      });
    }

    // Render all sections
    renderDashboard();
    renderUsers();
    renderAgents();
    renderSkills();
    renderContracts();
    renderErrorLogs();

    // Navigate to default
    navigateTo('dashboard');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();