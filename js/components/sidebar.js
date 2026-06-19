export function Sidebar() {
  return `
    <h3>Navegação</h3>
    <ul style="list-style:none;padding:0;">
      <li><a href="#dashboard">🏠 Dashboard</a></li>
      <li><a href="#funcionarios">👥 Funcionários</a></li>
      <li><a href="#holerite">📄 Gerar Holerite</a></li>
      <li><a href="#ferias">🏖️ Férias</a></li>
      <li><a href="#decimo-terceiro">🎄 13º Salário</a></li>
      <li><a href="#rescisao">📋 Rescisão</a></li>
      <li><a href="#configuracoes">⚙️ Configurações</a></li>
    </ul>
    <style>
      aside a { display:block; padding:0.5rem; text-decoration:none; color:var(--text); border-radius:var(--radius); }
      aside a:hover { background: var(--border); }
    </style>
  `;
}