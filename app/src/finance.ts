/**
 * Calcula juros compostos
 * @param amount - Valor principal
 * @param dailyFactor - Fator diário
 * @param businessDays - Dias úteis
 */
export function compoundInterest(amount: number, dailyFactor: number, businessDays: number): number {
  const interest = amount * Math.pow(dailyFactor, businessDays) - amount
  return Number.parseFloat(interest.toFixed(2))
}

/**
 * Retorna a alíquota de IR baseada no prazo em dias corridos
 * Tabela regressiva:
 * - Até 180 dias: 22,5%
 * - 181 a 360 dias: 20%
 * - 361 a 720 dias: 17,5%
 * - Acima de 720 dias: 15%
 */
export function getIndexIR(days: number): number {
  if (days <= 180) {
    return 22.5
  }
  else if (days <= 360) {
    return 20
  }
  else if (days <= 720) {
    return 17.5
  }
  else {
    return 15
  }
}

/**
 * Retorna a alíquota de IOF baseada nos dias até o resgate
 * Tabela regressiva: 96% no dia 1 até 0% no dia 30
 */
export function getIOFPercentage(daysToRedeem: number): number {
  const iofTable: number[] = [
    96, 93, 90, 86, 83, 80, 76, 73, 70, 66, 63, 60, 56, 53, 50, 46, 43, 40, 36,
    33, 30, 26, 23, 20, 16, 13, 10, 6, 3, 0,
  ]

  if (daysToRedeem >= 1 && daysToRedeem <= 30) {
    const index: number = daysToRedeem - 1
    const pct = iofTable[index] ?? 0
    return pct
  }

  return 0 // No IOF for redemption after 30 days or invalid days
}

/**
 * Calcula o valor do IOF sobre o rendimento
 */
export function getIOFAmount(daysToRedeem: number, interestAmount: number): number {
  const iofPercentage: number = getIOFPercentage(daysToRedeem)
  return Number.parseFloat((interestAmount * (iofPercentage / 100)).toFixed(2))
}

/**
 * Converte dias corridos para dias úteis
 * Proporção: 252 dias úteis / 365 dias corridos
 */
export function toBusinessDays(calendarDays: number): number {
  return calendarDays * (252 / 365)
}

/**
 * Calcula o fator diário para taxa CDI
 * Fórmula: (1 + CDI × %CDI)^(1/252)
 */
export function getDailyFactor(cdiRate: number, percentCdi: number): number {
  const yearlyRate = (cdiRate / 100) * (percentCdi / 100)
  return Math.pow(1 + yearlyRate, 1 / 252)
}
