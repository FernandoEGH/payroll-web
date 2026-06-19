export function getDiasUteis(mes, ano) {
  const data = new Date(ano, mes, 0);
  const totalDias = data.getDate();
  let uteis = 0;
  for (let d = 1; d <= totalDias; d++) {
    const diaSem = new Date(ano, mes - 1, d).getDay();
    if (diaSem !== 0 && diaSem !== 6) uteis++;
  }
  return uteis;
}