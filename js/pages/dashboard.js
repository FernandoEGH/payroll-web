import { getFuncionarios, getHolerites } from '../store.js';

export function renderDashboard() {
  const content = document.getElementById('content');
  const funcs = getFuncionarios();
  const holerites = getHolerites();
  const totalProventos = holerites.reduce((s, h) => s + (h.totalProventos || 0), 0);
  const totalDescontos = holerites.reduce((s, h) => s + (h.totalDescontos || 0), 0);

  content.innerHTML = `
    <h1>Dashboard</h1>
    <div class="grid-3 mt-3">
      <div class="card">
        <h3>Funcionários</h3>
        <p class="mt-2" style="font-size:2rem;">${funcs.length}</p>
      </div>
      <div class="card">
        <h3>Holerites Gerados</h3>
        <p class="mt-2" style="font-size:2rem;">${holerites.length}</p>
      </div>
      <div class="card">
        <h3>Total Proventos</h3>
        <p class="mt-2" style="font-size:2rem;color:green;">R$ ${totalProventos.toFixed(2)}</p>
      </div>
    </div>
    <div class="grid-2 mt-4">
      <div class="card">
        <h3>Últimas Simulações</h3>
        <table>
          <thead><tr><th>Funcionário</th><th>Mês/Ano</th><th>Líquido</th></tr></thead>
          <tbody>
            ${holerites.slice(-5).map(h => {
              const func = funcs.find(f => f.id === h.funcionarioId);
              return `<tr><td>${func?.nome || 'N/A'}</td><td>${h.mes}/${h.ano}</td><td>R$ ${h.salarioLiquido?.toFixed(2)}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3>Gráfico (simplificado)</h3>
        <div style="display:flex;height:200px;align-items:end;">
          <div style="width:40%;height:${Math.min(100, totalProventos/100)}px;background:var(--success);margin:0 2px;"></div>
          <div style="width:40%;height:${Math.min(100, totalDescontos/100)}px;background:var(--danger);margin:0 2px;"></div>
        </div>
        <p>Proventos vs Descontos</p>
      </div>
    </div>
  `;
}