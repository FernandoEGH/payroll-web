export function Navbar() {
  return `
    <div class="flex" style="align-items:center;">
      <h2 style="margin-right:1rem;">📊 Sistema de Holerites</h2>
      <nav style="display:flex;gap:1rem;">
        <a href="#dashboard" class="btn btn-outline">Dashboard</a>
        <a href="#funcionarios" class="btn btn-outline">Funcionários</a>
        <a href="#holerite" class="btn btn-outline">Holerite</a>
        <a href="#ferias" class="btn btn-outline">Férias</a>
        <a href="#decimo-terceiro" class="btn btn-outline">13º</a>
        <a href="#rescisao" class="btn btn-outline">Rescisão</a>
        <a href="#configuracoes" class="btn btn-outline">Config</a>
      </nav>
    </div>
    <button id="theme-toggle" class="theme-toggle">🌓</button>
  `;
}