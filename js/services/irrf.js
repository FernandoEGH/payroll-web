import { getTabelas } from '../store.js';
export class IRRFService {
  static getFaixas(ano) {
    const tabelas = getTabelas();
    return tabelas.irrf[ano] || tabelas.irrf['2024'];
  }
  static calcular(rendimentoBruto, inss, dependentes = 0, pensaoAlimenticia = 0, ano) {
    const faixas = this.getFaixas(ano);
    const deducaoDependente = faixas[0].deducaoDependente || 189.59;
    const base = Math.max(0, rendimentoBruto - inss - (dependentes * deducaoDependente) - pensaoAlimenticia);
    let irrf = 0;
    let faixaAplicada = 0;
    for (const faixa of faixas) {
      if (base >= faixa.limiteInferior && base <= faixa.limiteSuperior) {
        irrf = Math.max(0, base * faixa.aliquota - faixa.deducao);
        faixaAplicada = faixa.faixa;
        break;
      }
    }
    return { valor: Math.round(irrf * 100) / 100, baseIRRF: Math.round(base * 100) / 100, faixaAplicada };
  }
}