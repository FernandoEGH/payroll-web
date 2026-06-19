import { getTabelas } from '../store.js';

export class FGTSService {
  static getAliquota(ano) {
    const tabelas = getTabelas();
    return tabelas.fgts[ano] || 0.08;
  }
  static calcular(salarioBase, ano) {
    const aliquota = this.getAliquota(ano);
    return { valor: salarioBase * aliquota, aliquota };
  }
}