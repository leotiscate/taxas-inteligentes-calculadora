import { getCDBResult, type CDBResult } from './cdb'
import { getCompromissadaResult, type CompromissadaResult } from './compromissada'
import { getAplicacaoAutomaticaResult, type AplicacaoAutomaticaResult } from './aplicacaoAutomatica'
import { getTaxaInteligenteResult, type TaxaInteligenteResult } from './taxaInteligente'

export type ProductType = 'cdb' | 'compromissada' | 'aplicacaoAutomatica' | 'taxaInteligente'

export interface ComparisonResult {
  type: ProductType
  name: string
  netAmount: number
  isBestOption: boolean
  details: CDBResult | CompromissadaResult | AplicacaoAutomaticaResult | TaxaInteligenteResult
}

export interface ComparisonInput {
  billing: number
  days: number
  cdiRate: number
  cdbPercent: number
  compromissadaPercent: number
  taxaInteligenteDiscount: number
}

/**
 * Compara todos os produtos de investimento e retorna ordenado pelo melhor resultado
 */
export function compareProducts(input: ComparisonInput): ComparisonResult[] {
  const results: ComparisonResult[] = []

  // CDB
  const cdbResult = getCDBResult(input.billing, input.cdiRate, input.cdbPercent, input.days)
  results.push({
    type: 'cdb',
    name: 'CDB',
    netAmount: cdbResult.netAmount,
    isBestOption: false,
    details: cdbResult,
  })

  // Compromissada
  const compromissadaResult = getCompromissadaResult(
    input.billing,
    input.cdiRate,
    input.compromissadaPercent,
    input.days,
  )
  results.push({
    type: 'compromissada',
    name: 'Compromissada',
    netAmount: compromissadaResult.netAmount,
    isBestOption: false,
    details: compromissadaResult,
  })

  // Aplicação Automática
  const appAutoResult = getAplicacaoAutomaticaResult(
    input.billing,
    input.cdiRate,
    input.days,
  )
  results.push({
    type: 'aplicacaoAutomatica',
    name: 'Aplicação Automática',
    netAmount: appAutoResult.netAmount,
    isBestOption: false,
    details: appAutoResult,
  })

  // Taxa Inteligente
  const taxaIntResult = getTaxaInteligenteResult(
    input.billing,
    input.taxaInteligenteDiscount,
    input.days,
  )
  results.push({
    type: 'taxaInteligente',
    name: 'Taxa Inteligente',
    netAmount: taxaIntResult.discountAmount,
    isBestOption: false,
    details: taxaIntResult,
  })

  // Ordena por melhor resultado (maior netAmount)
  results.sort((a, b) => b.netAmount - a.netAmount)

  // Marca o melhor como best option
  if (results.length > 0) {
    results[0].isBestOption = true
  }

  return results
}

/**
 * Identifica o melhor produto da comparação
 */
export function getBestProduct(results: ComparisonResult[]): ComparisonResult | null {
  if (results.length === 0) return null
  return results.find(r => r.isBestOption) || results[0]
}

/**
 * Calcula a diferença entre o melhor produto e os outros
 */
export function getProductDifferences(results: ComparisonResult[]): Map<ProductType, number> {
  const differences = new Map<ProductType, number>()
  if (results.length === 0) return differences

  const best = getBestProduct(results)
  if (!best) return differences

  for (const result of results) {
    differences.set(result.type, Number.parseFloat((best.netAmount - result.netAmount).toFixed(2)))
  }

  return differences
}
