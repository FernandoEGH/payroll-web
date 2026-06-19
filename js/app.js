import { Navbar } from './components/navbar.js';
import { Sidebar } from './components/sidebar.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderFuncionarios } from './pages/funcionarios.js';
import { renderHolerite } from './pages/holerite.js';
import { renderFerias } from './pages/ferias.js';
import { renderDecimoTerceiro } from './pages/decimoTerceiro.js';
import { renderRescisao } from './pages/rescisao.js';
import { renderConfiguracoes } from './pages/configuracoes.js';
import { initializeStore } from './store.js';

const routes = {
  '#dashboard': renderDashboard,
  '#funcionarios': renderFuncionarios,
  '#holerite': renderHolerite,
  '#ferias': renderFerias,
  '#decimo-terceiro': renderDecimoTerceiro,
  '#rescisao': renderRescisao,
  '#configuracoes': renderConfiguracoes,
};

function router() {
  const hash = window.location.hash || '#dashboard';
  const render = routes[hash];
  if (render) {
    document.getElementById('content').innerHTML = '';
    render();
  }
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.className = saved;
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.className;
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.className = next;
    localStorage.setItem('theme', next);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await initializeStore();
  document.getElementById('navbar').innerHTML = Navbar();
  document.getElementById('sidebar').innerHTML = Sidebar();
  initTheme();
  router();
  window.addEventListener('hashchange', router);
});