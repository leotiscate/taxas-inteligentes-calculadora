export interface TaxaInteligenteResult {
  discountAmount: number
  dailyDiscount: number
}

/**
 * Calcula o desconto da Taxa Inteligente Stone
 *
 * Fórmula: Desconto = Faturamento × %desconto × (dias/30)
 *
 * Exemplo:
 * R$1.000.000 × 0.15% × (7/30) = R$350
 *
 * @param billing - Faturamento do cliente em R$
 * @param discountPercent - Percentual de desconto (ex: 0.15 = 0.15%)
 * @param days - Prazo em dias
 * @returns Desconto total e desconto diário
 */
export function getTaxaInteligenteResult(
  billing: number,
  discountPercent: number,
  days: number,
): TaxaInteligenteResult {
  // Desconto = Faturamento × (%desconto/100) × (dias/30)
  const discountRate = discountPercent / 100
  const discountAmount = Number.parseFloat((billing * discountRate * (days / 30)).toFixed(2))

  // Desconto diário para referência
  const dailyDiscount = Number.parseFloat((billing * discountRate / 30).toFixed(2))

  return { discountAmount, dailyDiscount }
}
