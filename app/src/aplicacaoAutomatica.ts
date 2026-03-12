import * as finance from './finance'

export interface AplicacaoAutomaticaResult {
  interestAmount: number
  taxAmount: number
  taxPercentage: number
  iofAmount: number
  netAmount: number
}

// Taxa fixa de 20% do CDI para Aplicação Automática
export const APLICACAO_AUTOMATICA_PERCENT_CDI = 20

/**
 * Calcula o resultado de uma Aplicação Automática (CDB 20% CDI)
 *
 * Igual ao CDB, mas com taxa FIXA de 20% do CDI
 * Tem IOF + IR normalmente
 * Rendimento muito baixo (mostrar ao cliente quanto perde)
 *
 * Fórmula:
 * - Taxa = 20% do CDI (fixa)
 * - Fator Diário = (1 + CDI × 0.20)^(1/252)
 * - Dias Úteis = dias × 252/365
 * - Rendimento Bruto = Capital × Fator^DiasÚteis - Capital
 * - IOF = Tabela regressiva (96%→0% em 30 dias) sobre rendimento
 * - IR = Tabela regressiva (22.5%→15%) sobre (rendimento - IOF)
 * - Líquido = Bruto - IOF - IR
 *
 * @param amount - Valor do investimento (faturamento do cliente)
 * @param cdiRate - Taxa CDI % a.a. (ex: 13.65)
 * @param days - Prazo em dias corridos
 * @returns Resultado com rendimento bruto, IOF, IR, líquido
 */
export function getAplicacaoAutomaticaResult(
  amount: number,
  cdiRate: number,
  days: number,
): AplicacaoAutomaticaResult {
  // Converte dias corridos para dias úteis (252/365)
  const businessDays = finance.toBusinessDays(days)

  // Calcula fator diário com taxa fixa de 20% do CDI
  const dailyFactor = finance.getDailyFactor(cdiRate, APLICACAO_AUTOMATICA_PERCENT_CDI)

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
