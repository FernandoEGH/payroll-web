import { INSSService } from './inss.js';
import { IRRFService } from './irrf.js';
import { FGTSService } from './fgts.js';
import { getFuncionarios } from '../store.js';

export class HoleriteCalculator {
  static calcular(params) {
    const func = getFuncionarios().find(f => f.id === params.funcionarioId);
    if (!func) throw new Error('Funcionário não encontrado');
    const salarioBase = Number(func.salarioBase);
    const valorHora = Number(func.valorHora);
    const diasTrab = params.diasTrabalhados || 30;
    const diasUteis = this.getDiasUteis(params.mes, params.ano);
    const salarioProp = (salarioBase / 30) * diasTrab;
    const he50 = (params.horasExtras50 || 0) * valorHora * 1.5;
    const he100 = (params.horasExtras100 || 0) * valorHora * 2;
    const totalHE = he50 + he100;
    const dsr = (totalHE / diasUteis) * (30 - diasUteis);
    const proventosBruto = salarioProp + totalHE + dsr;
    const inssCalc = INSSService.calcular(proventosBruto, params.ano);
    const irrfCalc = IRRFService.calcular(
      proventosBruto, inssCalc.valor, func.dependentes || 0,
      func.pensaoAlimenticia ? Number(func.valorPensao || 0) : 0, params.ano
    );
    const fgtsCalc = FGTSService.calcular(salarioProp, params.ano);
    const vt = func.valeTransporte ? salarioBase * 0.06 : 0;
    const vr = func.valeRefeicao ? (Number(func.valorValeRefeicao || 0) * 0.20) : 0;
    const saude = func.planoSaude ? Number(func.valorPlanoSaude || 0) : 0;
    const pensao = func.pensaoAlimenticia
      ? (func.percentualPensao ? (proventosBruto - inssCalc.valor) * Number(func.percentualPensao) : Number(func.valorPensao))
      : 0;
    const totalDescontos = inssCalc.valor + irrfCalc.valor + vt + vr + saude + pensao;
    const liquido = proventosBruto - totalDescontos;
    return {
      salarioBase: salarioProp, horasExtras50: he50, horasExtras100: he100, dsr,
      inss: inssCalc.valor, irrf: irrfCalc.valor, fgts: fgtsCalc.valor,
      valeTransporte: vt, valeRefeicao: vr, planoSaude: saude, pensaoAlimenticia: pensao,
      totalProventos: Math.round(proventosBruto * 100) / 100,
      totalDescontos: Math.round(totalDescontos * 100) / 100,
      salarioLiquido: Math.round(liquido * 100) / 100,
      baseINSS: proventosBruto, baseIRRF: irrfCalc.baseIRRF,
      detalhamento: { inss: inssCalc, irrf: irrfCalc, fgts: fgtsCalc }
    };
  }
  static getDiasUteis(mes, ano) {
    const data = new Date(ano, mes, 0);
    const totalDias = data.getDate();
    let uteis = 0;
    for (let d = 1; d <= totalDias; d++) {
      const diaSem = new Date(ano, mes - 1, d).getDay();
      if (diaSem !== 0 && diaSem !== 6) uteis++;
    }
    return uteis;
  }
}