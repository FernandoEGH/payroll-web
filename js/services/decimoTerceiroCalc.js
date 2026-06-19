import { INSSService } from './inss.js';
import { IRRFService } from './irrf.js';

export class DecimoTerceiroCalculator {
  static calcular({ salarioBase, mesesTrabalhados, dependentes, ano, parcela }) {
    const valorBruto = (salarioBase / 12) * Math.min(mesesTrabalhados, 12);
    if (parcela === 1) {
      const valorParcela = valorBruto / 2;
      return { valorBruto, valorParcela, inss: 0, irrf: 0, totalLiquido: valorParcela, parcela: 1 };
    }
    const valorParcela = valorBruto / 2;
    const inssCalc = INSSService.calcular(valorBruto, ano);
    const irrfCalc = IRRFService.calcular(valorBruto, inssCalc.valor, dependentes, 0, ano);
    const descontos = inssCalc.valor + irrfCalc.valor;
    return {
      valorBruto,
      valorParcela,
      inss: inssCalc.valor,
      irrf: irrfCalc.valor,
      totalLiquido: Math.max(0, valorParcela - descontos),
      parcela: 2
    };
  }
}