import { getFuncionarios, saveFuncionario, deleteFuncionario } from '../store.js';
import { Modal } from '../components/modal.js';

export function renderFuncionarios() {
  const content = document.getElementById('content');
  const funcs = getFuncionarios();
  content.innerHTML = `
    <div class="flex" style="justify-content:space-between;">
      <h1>Funcionários</h1>
      <button id="add-func" class="btn">+ Novo Funcionário</button>
    </div>
    <table id="tabela-func">
      <thead><tr><th>Nome</th><th>CPF</th><th>Salário</th><th>Ações</th></tr></thead>
      <tbody></tbody>
    </table>
  `;
  const tbody = document.querySelector('#tabela-func tbody');
  function refreshTabela() {
    tbody.innerHTML = getFuncionarios().map(f => `
      <tr>
        <td>${f.nome}</td>
        <td>${f.cpf}</td>
        <td>R$ ${Number(f.salarioBase).toFixed(2)}</td>
        <td>
          <button class="btn btn-outline edit-func" data-id="${f.id}">Editar</button>
          <button class="btn btn-outline del-func" data-id="${f.id}">Excluir</button>
        </td>
      </tr>
    `).join('');
    document.querySelectorAll('.edit-func').forEach(b => b.addEventListener('click', editar));
    document.querySelectorAll('.del-func').forEach(b => b.addEventListener('click', excluir));
  }
  refreshTabela();

  document.getElementById('add-func').addEventListener('click', () => editar({ target: { dataset: {} } }));

  function editar(event) {
    const id = event.target.dataset.id;
    const func = id ? getFuncionarios().find(f => f.id === id) : {};
    const contentModal = `
      <form id="func-form">
        <input type="hidden" id="func-id" value="${func.id || ''}">
        <label>Nome</label><input id="nome" value="${func.nome || ''}" required>
        <label>CPF</label><input id="cpf" value="${func.cpf || ''}" required>
        <label>Salário Base</label><input id="salario" type="number" step="0.01" value="${func.salarioBase || ''}" required>
        <label>Valor Hora</label><input id="valorHora" type="number" step="0.01" value="${func.valorHora || ''}" required>
        <label>Dependentes</label><input id="dependentes" type="number" value="${func.dependentes || 0}">
        <button class="btn mt-3" type="submit">Salvar</button>
      </form>
    `;
    const modal = Modal(func.id ? 'Editar Funcionário' : 'Novo Funcionário', contentModal, () => {});
    document.getElementById('func-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {
        id: document.getElementById('func-id').value || undefined,
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        salarioBase: parseFloat(document.getElementById('salario').value),
        valorHora: parseFloat(document.getElementById('valorHora').value),
        dependentes: parseInt(document.getElementById('dependentes').value) || 0,
        valeTransporte: true,
        valeRefeicao: false,
        planoSaude: false,
        pensaoAlimenticia: false,
      };
      saveFuncionario(formData);
      modal.querySelector('.modal-overlay').remove();
      refreshTabela();
    });
  }

  function excluir(event) {
    if (confirm('Excluir funcionário?')) {
      deleteFuncionario(event.target.dataset.id);
      refreshTabela();
    }
  }
}