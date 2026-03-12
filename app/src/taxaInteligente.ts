export interface TaxaInteligenteResult {
  discountAmount: number
  dailyDiscount: number
}

/**
 * Calcula o desconto da Taxa Inteligente Stone
 *
 * Fórmula: Desconto = Faturamento × %desconto
 *
 * Exemplo:
 * R$1.000.000 × 0.15% = R$1.500
 *
 * @param billing - Faturamento do cliente em R$
 * @param discountPercent - Percentual de desconto (ex: 0.15 = 0.15%)
 * @param days - Prazo em dias (usado para calcular desconto diário)
 * @returns Desconto total e desconto diário
 */
export function getTaxaInteligenteResult(
  billing: number,
  discountPercent: number,
  days: number,
): TaxaInteligenteResult {
  // Desconto = Faturamento × (%desconto/100)
  const discountRate = discountPercent / 100
  const discountAmount = Number.parseFloat((billing * discountRate).toFixed(2))

  // Desconto diário para referência (desconto total / dias)
  const dailyDiscount = days > 0
    ? Number.parseFloat((discountAmount / days).toFixed(2))
    : 0

  return { discountAmount, dailyDiscount }
}
