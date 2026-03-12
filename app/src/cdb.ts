import * as finance from './finance'

export interface CDBResult {
  interestAmount: number
  taxAmount: number
  taxPercentage: number
  iofAmount: number
  netAmount: number
}

/**
 * Calcula o resultado de uma aplicação em CDB
 *
 * Fórmula:
 * - Fator Diário = (1 + CDI × %CDI)^(1/252)
 * - Dias Úteis = dias × 252/365
 * - Rendimento Bruto = Capital × Fator^DiasÚteis - Capital
 * - IOF = Tabela regressiva (96%→0% em 30 dias) sobre rendimento
 * - IR = Tabela regressiva (22.5%→15%) sobre (rendimento - IOF)
 * - Líquido = Bruto - IOF - IR
 *
 * @param amount - Valor do investimento
 * @param cdiRate - Taxa CDI % a.a. (ex: 13.65)
 * @param percentCdi - % do CDI para o CDB (ex: 100 = 100% do CDI)
 * @param days - Prazo em dias corridos
 * @returns Resultado com rendimento bruto, IOF, IR, líquido
 */
export function getCDBResult(
  amount: number,
  cdiRate: number,
  percentCdi: number,
  days: number,
): CDBResult {
  // Converte dias corridos para dias úteis (252/365)
  const businessDays = finance.toBusinessDays(days)

  // Calcula fator diário
  const dailyFactor = finance.getDailyFactor(cdiRate, percentCdi)

  // Rendimento bruto
  const interestAmount = finance.compoundInterest(amount, dailyFactor, businessDays)

  // IOF = Tabela regressiva sobre rendimento
  const iofAmount = finance.getIOFAmount(days, interestAmount)

  // IR = Tabela regressiva sobre (rendimento - IOF)
  const taxPercentage = finance.getIndexIR(days)
  const taxAmount = Number.parseFloat(((interestAmount - iofAmount) * (taxPercentage / 100)).toFixed(2))

  // Líquido = Bruto - IOF - IR
  const netAmount = Number.parseFloat((interestAmount - iofAmount - taxAmount).toFixed(2))

  return { interestAmount, taxAmount, taxPercentage, iofAmount, netAmount }
}
