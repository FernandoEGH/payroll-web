import { getFuncionarios } from '../store.js';
import { FeriasCalculator } from '../services/feriasCalc.js';

export function renderFerias() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h1>Cálculo de Férias</h1>
    <div class="grid-2 mt-4">
      <div class="card">
        <form id="ferias-form">
          <label>Funcionário</label>
          <select id="func-select" required></select>
          <label>Tipo</label>
          <select id="tipo">
            <option value="integrais">Integrais (30 dias)</option>
            <option value="proporcionais">Proporcionais</option>
          </select>
          <label>Dias de Férias</label>
          <input type="number" id="dias-ferias" value="30" min="1" max="30">
          <label>Dias Vendidos (Abono)</label>
          <input type="number" id="dias-vendidos" value="0" min="0" max="10">
          <button type="submit" class="btn mt-3">Calcular</button>
        </form>
      </div>
      <div class="card" id="resultado-ferias" style="display:none"></div>
    </div>
  `;

  const funcSelect = document.getElementById('func-select');
  getFuncionarios().forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.nome;
    funcSelect.appendChild(opt);
  });

  document.getElementById('ferias-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const func = getFuncionarios().find(f => f.id === funcSelect.value);
    if (!func) return;
    const diasFerias = parseInt(document.getElementById('dias-ferias').value);
    const diasVendidos = parseInt(document.getElementById('dias-vendidos').value);
    const ano = new Date().getFullYear();
    const resultado = FeriasCalculator.calcular({
      salarioBase: Number(func.salarioBase),
      diasFerias,
      diasVendidos,
      dependentes: func.dependentes || 0,
      ano
    });
    document.getElementById('resultado-ferias').style.display = 'block';
    document.getElementById('resultado-ferias').innerHTML = `
      <h3>Recibo de Férias</h3>
      <div class="holerite">
        <p>Férias: R$ ${resultado.valorFerias.toFixed(2)}</p>
        <p>1/3 Constitucional: R$ ${resultado.adicionalUmTerco.toFixed(2)}</p>
        <p>Abono Pecuniário: R$ ${resultado.abonoValor.toFixed(2)}</p>
        <p>Adic. Abono: R$ ${resultado.adicionalAbono.toFixed(2)}</p>
        <p>Total Bruto: R$ ${resultado.totalBruto.toFixed(2)}</p>
        <p>INSS: R$ ${resultado.inss.toFixed(2)}</p>
        <p>IRRF: R$ ${resultado.irrf.toFixed(2)}</p>
        <p><strong>Total Líquido: R$ ${resultado.totalLiquido.toFixed(2)}</strong></p>
      </div>
    `;
  });
}