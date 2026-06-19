import { getFuncionarios } from '../store.js';
import { RescisaoCalculator } from '../services/rescisaoCalc.js';

export function renderRescisao() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h1>Rescisão Contratual</h1>
    <div class="grid-2 mt-4">
      <div class="card">
        <form id="rescisao-form">
          <label>Funcionário</label>
          <select id="func-select" required></select>
          <label>Tipo de Rescisão</label>
          <select id="tipo">
            <option value="SEM_JUSTA_CAUSA">Sem Justa Causa</option>
            <option value="COM_JUSTA_CAUSA">Com Justa Causa</option>
            <option value="PEDIDO_DEMISSAO">Pedido de Demissão</option>
            <option value="RESCISAO_INDIRETA">Rescisão Indireta</option>
            <option value="TERMINO_CONTRATO">Término de Contrato</option>
          </select>
          <label>Aviso Prévio</label>
          <select id="aviso">
            <option value="TRABALHADO">Trabalhado</option>
            <option value="INDENIZADO">Indenizado</option>
            <option value="NAO_APLICAVEL">Não Aplicável</option>
          </select>
          <label>Data de Desligamento</label>
          <input type="date" id="data-desligamento">
          <label>Dias Trabalhados no Mês</label>
          <input type="number" id="dias-trab" value="15" min="1" max="31">
          <button type="submit" class="btn mt-3">Calcular</button>
        </form>
      </div>
      <div class="card" id="resultado-rescisao" style="display:none"></div>
    </div>
  `;

  const funcSelect = document.getElementById('func-select');
  getFuncionarios().forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.nome;
    funcSelect.appendChild(opt);
  });

  document.getElementById('rescisao-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const func = getFuncionarios().find(f => f.id === funcSelect.value);
    if (!func) return;
    const resultado = RescisaoCalculator.calcular({
      salarioBase: Number(func.salarioBase),
      dataAdmissao: new Date(func.dataAdmissao || '2022-01-01'),
      dataDesligamento: new Date(document.getElementById('data-desligamento').value),
      tipo: document.getElementById('tipo').value,
      avisoPrevio: document.getElementById('aviso').value,
      diasTrabalhadosMes: parseInt(document.getElementById('dias-trab').value),
      dependentes: func.dependentes || 0,
      ano: new Date().getFullYear()
    });
    document.getElementById('resultado-rescisao').style.display = 'block';
    document.getElementById('resultado-rescisao').innerHTML = `
      <h3>Resumo da Rescisão</h3>
      <p>Saldo de Salário: R$ ${resultado.saldoSalario.toFixed(2)}</p>
      <p>Aviso Prévio: R$ ${resultado.avisoPrevio.toFixed(2)}</p>
      <p>13º Proporcional: R$ ${resultado.decimoTerceiroProp.toFixed(2)}</p>
      <p>Férias Vencidas: R$ ${resultado.feriasVencidas.toFixed(2)}</p>
      <p>Férias Proporcionais: R$ ${resultado.feriasProporcionais.toFixed(2)}</p>
      <p>Multa FGTS: R$ ${resultado.multaFGTS.toFixed(2)}</p>
      <p>Saldo FGTS: R$ ${resultado.fgtsSaldo.toFixed(2)}</p>
      <p>INSS: R$ ${resultado.inss.toFixed(2)}</p>
      <p>IRRF: R$ ${resultado.irrf.toFixed(2)}</p>
      <p><strong>Total Líquido: R$ ${resultado.totalLiquido.toFixed(2)}</strong></p>
    `;
  });
}