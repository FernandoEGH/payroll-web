const STORE_KEYS = {
  FUNCIONARIOS: 'funcionarios',
  HOLERITES: 'holerites',
  FERIAS: 'ferias',
  DECIMO_TERCEIRO: 'decimo_terceiro',
  RESCISOES: 'rescisoes',
  TABELAS: 'tabelas',
  CONFIG: 'config',
};

export async function initializeStore() {
  if (!localStorage.getItem(STORE_KEYS.TABELAS)) {
    const response = await fetch('data/defaultTables.json');
    const defaultTables = await response.json();
    localStorage.setItem(STORE_KEYS.TABELAS, JSON.stringify(defaultTables));
  }
}

function getCollection(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function setCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFuncionarios() { return getCollection(STORE_KEYS.FUNCIONARIOS); }
export function saveFuncionario(func) {
  const funcs = getFuncionarios();
  if (!func.id) func.id = crypto.randomUUID();
  const index = funcs.findIndex(f => f.id === func.id);
  if (index >= 0) funcs[index] = func;
  else funcs.push(func);
  setCollection(STORE_KEYS.FUNCIONARIOS, funcs);
  return func;
}
export function deleteFuncionario(id) {
  const funcs = getFuncionarios().filter(f => f.id !== id);
  setCollection(STORE_KEYS.FUNCIONARIOS, funcs);
}

export function getHolerites() { return getCollection(STORE_KEYS.HOLERITES); }
export function saveHolerite(h) {
  const holerites = getHolerites();
  if (!h.id) h.id = crypto.randomUUID();
  const index = holerites.findIndex(ho => ho.funcionarioId === h.funcionarioId && ho.mes === h.mes && ho.ano === h.ano);
  if (index >= 0) holerites[index] = h;
  else holerites.push(h);
  setCollection(STORE_KEYS.HOLERITES, holerites);
  return h;
}

export function getTabelas() { return JSON.parse(localStorage.getItem(STORE_KEYS.TABELAS) || '{}'); }
export function updateTabelas(tabelas) { localStorage.setItem(STORE_KEYS.TABELAS, JSON.stringify(tabelas)); }