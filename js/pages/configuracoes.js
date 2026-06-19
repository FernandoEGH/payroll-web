import { getTabelas, updateTabelas } from '../store.js';

export function renderConfiguracoes() {
  const content = document.getElementById('content');
  const tabelas = getTabelas();
  content.innerHTML = `
    <h1>Configurações de Tabelas</h1>
    <div class="card mt-4">
      <h3>Tabelas INSS/IRRF/FGTS</h3>
      <textarea id="tabelas-json" style="height:400px;font-family:monospace;">${JSON.stringify(tabelas, null, 2)}</textarea>
      <button id="salvar-tabelas" class="btn mt-3">Salvar Tabelas</button>
    </div>
  `;
  document.getElementById('salvar-tabelas').addEventListener('click', () => {
    try {
      const novas = JSON.parse(document.getElementById('tabelas-json').value);
      updateTabelas(novas);
      alert('Tabelas atualizadas!');
    } catch (e) {
      alert('JSON inválido');
    }
  });
}