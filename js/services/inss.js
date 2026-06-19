import { getTabelas } from '../store.js';
export class INSSService {
  static getFaixas(ano) {
    const tabelas = getTabelas();
    return tabelas.inss[ano] || tabelas.inss['2024'];
  }
  static calcular(salarioContribuicao, ano) {
    const faixas = this.getFaixas(ano);
    const teto = faixas[faixas.length-1].limiteSuperior === Infinity 
      ? faixas[faixas.length-2].limiteSuperior 
      : faixas[faixas.length-1].limiteSuperior;
    const base = Math.min(salarioContribuicao, teto);
    let valor = 0;
    const detalhes = [];
    for (const faixa of faixas) {
      if (base <= faixa.limiteInferior) break;
      const baseFaixa = Math.min(base - faixa.limiteInferior, faixa.limiteSuperior - faixa.limiteInferior);
      if (baseFaixa > 0) {
        const contrib = baseFaixa * faixa.aliquota;
        valor += contrib;
        detalhes.push({ faixa: faixa.faixa, baseCalculo: baseFaixa, aliquota: faixa.aliquota, valor: contrib });
      }
    }
    return { valor: Math.round(valor * 100) / 100, aliquotaEfetiva: base > 0 ? valor / base : 0, detalhamento: detalhes };
  }
}