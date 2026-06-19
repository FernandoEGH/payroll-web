import { INSSService } from './inss.js';
import { IRRFService } from './irrf.js';

export class FeriasCalculator {
  static calcular({ salarioBase, diasFerias, diasVendidos, dependentes, ano }) {
    const salarioDia = salarioBase / 30;
    const valorFerias = salarioDia * diasFerias;
    const adicionalUmTerco = valorFerias / 3;
    const abonoValor = diasVendidos * salarioDia;
    const adicionalAbono = diasVendidos > 0 ? abonoValor / 3 : 0;
    const totalBruto = valorFerias + adicionalUmTerco + abonoValor + adicionalAbono;
    const baseINSS = valorFerias + adicionalUmTerco;
    const inssCalc = INSSService.calcular(baseINSS, ano);
    const irrfCalc = IRRFService.calcular(totalBruto, inssCalc.valor, dependentes, 0, ano);
    const totalDescontos = inssCalc.valor + irrfCalc.valor;
    return {
      valorFerias,
      adicionalUmTerco,
      abonoValor,
      adicionalAbono,
      totalBruto,
      inss: inssCalc.valor,
      irrf: irrfCalc.valor,
      totalLiquido: totalBruto - totalDescontos
    };
  }
}