import { getFuncionarios } from '../store.js';
import { DecimoTerceiroCalculator } from '../services/decimoTerceiroCalc.js';

export function renderDecimoTerceiro() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h1>Décimo Terceiro Salário</h1>
    <div class="grid-2 mt-4">
      <div class="card">
        <form id="dt-form">
          <label>Funcionário</label>
          <select id="func-select" required></select>
          <label>Ano</label>
          <input type="number" id="ano" value="${new Date().getFullYear()}">
          <label>Meses Trabalhados</label>
          <input type="number" id="meses" value="12" min="1" max="12">
          <label>Parcela</label>
          <select id="parcela">
            <option value="1">1ª Parcela</option>
            <option value="2">2ª Parcela</option>
          </select>
          <button type="submit" class="btn mt-3">Calcular</button>
        </form>
      </div>
      <div class="card" id="resultado-dt" style="display:none"></div>
    </div>
  `;

  const funcSelect = document.getElementById('func-select');
  getFuncionarios().forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.nome;
    funcSelect.appendChild(opt);
  });

  document.getElementById('dt-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const func = getFuncionarios().find(f => f.id === funcSelect.value);
    if (!func) return;
    const resultado = DecimoTerceiroCalculator.calcular({
      salarioBase: Number(func.salarioBase),
      mesesTrabalhados: parseInt(document.getElementById('meses').value),
      dependentes: func.dependentes || 0,
      ano: parseInt(document.getElementById('ano').value),
      parcela: parseInt(document.getElementById('parcela').value)
    });
    document.getElementById('resultado-dt').style.display = 'block';
    document.getElementById('resultado-dt').innerHTML = `
      <h3>${resultado.parcela === 1 ? '1ª' : '2ª'} Parcela</h3>
      <p>Valor Bruto (proporcional): R$ ${resultado.valorBruto.toFixed(2)}</p>
      <p>Valor da Parcela: R$ ${resultado.valorParcela.toFixed(2)}</p>
      <p>INSS: R$ ${resultado.inss.toFixed(2)}</p>
      <p>IRRF: R$ ${resultado.irrf.toFixed(2)}</p>
      <p><strong>Líquido: R$ ${resultado.totalLiquido.toFixed(2)}</strong></p>
    `;
  });
}