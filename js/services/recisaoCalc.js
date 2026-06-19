import { INSSService } from './inss.js';
import { IRRFService } from './irrf.js';
import { FGTSService } from './fgts.js';

export class RescisaoCalculator {
  static calcular({ salarioBase, dataAdmissao, dataDesligamento, tipo, avisoPrevio, diasTrabalhadosMes, dependentes, ano }) {
    const msTrab = this.mesesTrabalhados(dataAdmissao, dataDesligamento);
    const saldoSalario = (salarioBase / 30) * diasTrabalhadosMes;
    let aviso = 0;
    if ((tipo === 'SEM_JUSTA_CAUSA' || tipo === 'RESCISAO_INDIRETA') && avisoPrevio === 'INDENIZADO') {
      const anos = Math.floor(msTrab / 12);
      const diasAdicionais = Math.min(anos * 3, 90);
      aviso = (salarioBase / 30) * (30 + diasAdicionais);
    }
    const decimoProp = (salarioBase / 12) * msTrab;
    const feriasVencidas = Math.floor(msTrab / 12) * (salarioBase + salarioBase/3);
    const feriasProp = ((salarioBase/12) * (msTrab % 12)) * 1.3333;
    const fgts = FGTSService.calcular(salarioBase, ano); // simplificado
    const saldoFGTS = fgts.valor * msTrab;
    const multaFGTS = (tipo === 'SEM_JUSTA_CAUSA' || tipo === 'RESCISAO_INDIRETA') ? saldoFGTS * 0.4 : 0;
    const baseINSS = saldoSalario + decimoProp;
    const inssCalc = INSSService.calcular(baseINSS, ano);
    const irrfCalc = IRRFService.calcular(baseINSS, inssCalc.valor, dependentes, 0, ano);
    const totalBruto = saldoSalario + aviso + decimoProp + feriasVencidas + feriasProp;
    const descontos = inssCalc.valor + irrfCalc.valor;
    return {
      saldoSalario,
      avisoPrevio: aviso,
      decimoTerceiroProp: decimoProp,
      feriasVencidas,
      feriasProporcionais: feriasProp,
      multaFGTS,
      fgtsSaldo: saldoFGTS,
      inss: inssCalc.valor,
      irrf: irrfCalc.valor,
      totalLiquido: totalBruto - descontos + multaFGTS + saldoFGTS
    };
  }
  static mesesTrabalhados(ini, fim) {
    return (fim.getFullYear() - ini.getFullYear()) * 12 + (fim.getMonth() - ini.getMonth()) + 1;
  }
}