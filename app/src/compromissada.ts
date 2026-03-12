import * as finance from './finance'

export interface CompromissadaResult {
  interestAmount: number
  taxAmount: number
  taxPercentage: number
  netAmount: number
}

/**
 * Calcula o resultado de uma aplicação em Compromissada
 *
 * Similar ao CDB, mas SEM IOF (IOF = 0 sempre)
 * IR normal pela tabela regressiva
 *
 * Fórmula:
 * - Fator Diário = (1 + CDI × %CDI)^(1/252)
 * - Dias Úteis = dias × 252/365
 * - Rendimento Bruto = Capital × Fator^DiasÚteis - Capital
 * - IOF = 0 (SEMPRE)
 * - IR = Tabela regressiva sobre rendimento
 * - Líquido = Bruto - IR
 *
 * @param amount - Valor do investimento (faturamento do cliente)
 * @param cdiRate - Taxa CDI % a.a. (ex: 13.65)
 * @param percentCdi - % do CDI para a compromissada (ex: 100 = 100% do CDI)
 * @param days - Prazo em dias corridos
 * @returns Resultado com rendimento bruto, IR, líquido
 */
export function getCompromissadaResult(
  amount: number,
  cdiRate: number,
  percentCdi: number,
  days: number,
): CompromissadaResult {
  // Converte dias corridos para dias úteis (252/365)
  const businessDays = finance.toBusinessDays(days)

  // Calcula fator diário
  const dailyFactor = finance.getDailyFactor(cdiRate, percentCdi)

  // Rendimento bruto
  const interestAmount = finance.compoundInterest(amount, dailyFactor, businessDays)

  // IOF = 0 (SEMPRE para compromissada)
  // IR = Tabela regressiva sobre rendimento
  const taxPercentage = finance.getIndexIR(days)
  const taxAmount = Number.parseFloat((interestAmount * (taxPercentage / 100)).toFixed(2))

  // Líquido = Bruto - IR
  const netAmount = Number.parseFloat((interestAmount - taxAmount).toFixed(2))

  return { interestAmount, taxAmount, taxPercentage, netAmount }
}
