import { getFuncionarios, saveHolerite } from '../store.js';
import { HoleriteCalculator } from '../services/holeriteCalc.js';

export function renderHolerite() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1>Gerar Holerite</h1>
      <div class="flex">
        <select id="ano-select" class="mr-2"></select>
        <button id="modo-auto" class="btn">Automático</button>
        <button id="modo-manual" class="btn btn-outline">Manual</button>
      </div>
    </div>
    
    <div class="grid-2 mt-4">
      <div class="card">
        <h2>Dados do Cálculo</h2>
        <form id="holerite-form">
          <label>Funcionário</label>
          <select id="funcionario-select" required></select>
          <label>Mês</label>
          <input type="number" id="mes" min="1" max="12" value="${new Date().getMonth()+1}" required>
          <label>Ano</label>
          <input type="number" id="ano" value="${new Date().getFullYear()}" required>
          <label>Dias Trabalhados</label>
          <input type="number" id="dias-trab" min="1" max="31" value="30">
          
          <div id="campos-automatico">
            <h3>Parâmetros Automáticos</h3>
            <div class="grid-2">
              <div><label>Horas Extras 50%</label><input type="number" id="he50" value="0"></div>
              <div><label>Horas Extras 100%</label><input type="number" id="he100" value="0"></div>
              <div><label>Faltas (dias)</label><input type="number" id="faltas" value="0"></div>
            </div>
          </div>
          
          <div id="campos-manual" style="display:none">
            <p>Modo manual: insira todos os valores diretamente.</p>
            <!-- Campos manuais dinâmicos podem ser adicionados -->
          </div>
          
          <button type="submit" class="btn mt-3">Calcular</button>
        </form>
      </div>
      
      <div class="card" id="resultado-container" style="display:none">
        <h2>Visualização</h2>
        <div id="holerite-preview"></div>
        <div class="flex mt-3">
          <button id="salvar-holerite" class="btn">Salvar</button>
          <button id="export-pdf" class="btn btn-outline">PDF</button>
          <button id="export-excel" class="btn btn-outline">Excel</button>
        </div>
      </div>
    </div>
  `;

  const funcSelect = document.getElementById('funcionario-select');
  getFuncionarios().forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = `${f.nome} - R$ ${f.salarioBase}`;
    funcSelect.appendChild(opt);
  });

  let modo = 'automatico';
  document.getElementById('modo-auto').addEventListener('click', () => {
    modo = 'automatico';
    document.getElementById('campos-automatico').style.display = 'block';
    document.getElementById('campos-manual').style.display = 'none';
  });
  document.getElementById('modo-manual').addEventListener('click', () => {
    modo = 'manual';
    document.getElementById('campos-automatico').style.display = 'none';
    document.getElementById('campos-manual').style.display = 'block';
  });

  document.getElementById('holerite-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      funcionarioId: funcSelect.value,
      mes: parseInt(document.getElementById('mes').value),
      ano: parseInt(document.getElementById('ano').value),
      diasTrabalhados: parseInt(document.getElementById('dias-trab').value),
      horasExtras50: parseFloat(document.getElementById('he50').value) || 0,
      horasExtras100: parseFloat(document.getElementById('he100').value) || 0,
      faltas: parseInt(document.getElementById('faltas').value) || 0,
    };

    if (modo === 'automatico') {
      const resultado = HoleriteCalculator.calcular(data);
      mostrarResultado(resultado, data);
    }
  });

  function mostrarResultado(resultado, params) {
    document.getElementById('resultado-container').style.display = 'block';
    document.getElementById('holerite-preview').innerHTML = `
      <div class="holerite">
        <div class="header">
          <h3>Holerite ${params.mes}/${params.ano}</h3>
        </div>
        <div class="section proventos">
          <p>Salário Base: R$ ${resultado.salarioBase.toFixed(2)}</p>
          <p>Horas Extras 50%: R$ ${resultado.horasExtras50.toFixed(2)}</p>
          <p>DSR: R$ ${resultado.dsr.toFixed(2)}</p>
          <p><strong>Total Proventos: R$ ${resultado.totalProventos.toFixed(2)}</strong></p>
        </div>
        <div class="section descontos">
          <p>INSS: R$ ${resultado.inss.toFixed(2)}</p>
          <p>IRRF: R$ ${resultado.irrf.toFixed(2)}</p>
          <p>Vale Transporte: R$ ${resultado.valeTransporte.toFixed(2)}</p>
          <p><strong>Total Descontos: R$ ${resultado.totalDescontos.toFixed(2)}</strong></p>
        </div>
        <div class="total">
          <p>Salário Líquido: R$ ${resultado.salarioLiquido.toFixed(2)}</p>
          <p>FGTS: R$ ${resultado.fgts.toFixed(2)}</p>
        </div>
      </div>
    `;
    document.getElementById('salvar-holerite').onclick = () => {
      const holerite = { ...resultado, ...params, modo };
      saveHolerite(holerite);
      alert('Holerite salvo!');
    };
    document.getElementById('export-pdf').onclick = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text('Holerite', 10, 10);
      doc.autoTable({
        head: [['Descrição', 'Valor']],
        body: [
          ['Salário Base', resultado.salarioBase.toFixed(2)],
          ['Horas Extras', resultado.horasExtras50.toFixed(2)],
          ['INSS', resultado.inss.toFixed(2)],
          ['IRRF', resultado.irrf.toFixed(2)],
          ['Líquido', resultado.salarioLiquido.toFixed(2)]
        ]
      });
      doc.save(`holerite-${params.mes}-${params.ano}.pdf`);
    };
    document.getElementById('export-excel').onclick = () => {
      const ws = XLSX.utils.aoa_to_sheet([
        ['Descrição', 'Valor'],
        ['Salário Base', resultado.salarioBase],
        ['Horas Extras', resultado.horasExtras50],
        ['INSS', resultado.inss],
        ['IRRF', resultado.irrf],
        ['Líquido', resultado.salarioLiquido]
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Holerite');
      XLSX.writeFile(wb, `holerite-${params.mes}-${params.ano}.xlsx`);
    };
  }
}