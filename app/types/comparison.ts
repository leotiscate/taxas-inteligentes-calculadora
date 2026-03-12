import type { CDBResult } from '~/src/cdb'
import type { CompromissadaResult } from '~/src/compromissada'
import type { AplicacaoAutomaticaResult } from '~/src/aplicacaoAutomatica'
import type { TaxaInteligenteResult } from '~/src/taxaInteligente'

export type ProductType = 'cdb' | 'compromissada' | 'aplicacaoAutomatica' | 'taxaInteligente'

export type PeriodOption = 3 | 7 | 15 | 30

export interface ComparisonState {
  // Inputs
  billing: number // Faturamento (default: 1.000.000)
  period: PeriodOption // Dias (dropdown fixo: 3, 7, 15, 30)
  cdiRate: number // Taxa CDI % a.a.
  cdbPercent: number // % do CDI para CDB
  compromissadaPercent: number // % do CDI para Compromissada
  taxaInteligenteDiscount: number // % desconto (ex: 0.15)

  // Loading
  isLoadingCdi: boolean
}

export interface ProductResult {
  type: ProductType
  name: string
  displayName: string
  netAmount: number
  isBestOption: boolean
  color: ProductColor
  details: CDBResult | CompromissadaResult | AplicacaoAutomaticaResult | TaxaInteligenteResult
}

export type ProductColor = 'blue' | 'purple' | 'amber' | 'green'

export const PRODUCT_COLORS: Record<ProductType, ProductColor> = {
  cdb: 'blue',
  compromissada: 'purple',
  aplicacaoAutomatica: 'amber',
  taxaInteligente: 'green',
}

export const PRODUCT_DISPLAY_NAMES: Record<ProductType, string> = {
  cdb: 'CDB',
  compromissada: 'Compromissada',
  aplicacaoAutomatica: 'App. Automática',
  taxaInteligente: 'Taxa Inteligente',
}

export const PERIOD_OPTIONS: PeriodOption[] = [3, 7, 15, 30]

export const DEFAULT_VALUES: ComparisonState = {
  billing: 1000000,
  period: 7,
  cdiRate: 13.65,
  cdbPercent: 100,
  compromissadaPercent: 100,
  taxaInteligenteDiscount: 0.15,
  isLoadingCdi: false,
}
