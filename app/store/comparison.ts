import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { compareProducts } from '~/src/comparison'
import { DEFAULT_VALUES, PRODUCT_COLORS, PRODUCT_DISPLAY_NAMES } from '~/types/comparison'
import type { PeriodOption, ProductResult } from '~/types/comparison'

export const useComparisonStore = defineStore('comparison', () => {
  // State
  const billing = ref(DEFAULT_VALUES.billing)
  const period = ref<PeriodOption>(DEFAULT_VALUES.period)
  const cdiRate = ref(DEFAULT_VALUES.cdiRate)
  const cdbPercent = ref(DEFAULT_VALUES.cdbPercent)
  const compromissadaPercent = ref(DEFAULT_VALUES.compromissadaPercent)
  const taxaInteligenteDiscount = ref(DEFAULT_VALUES.taxaInteligenteDiscount)
  const isLoadingCdi = ref(DEFAULT_VALUES.isLoadingCdi)
  const showCompromissada = ref(false) // Toggle para mostrar/esconder Compromissada

  // Computed - Results
  const results = computed<ProductResult[]>(() => {
    const comparisonResults = compareProducts({
      billing: billing.value,
      days: period.value,
      cdiRate: cdiRate.value,
      cdbPercent: cdbPercent.value,
      compromissadaPercent: compromissadaPercent.value,
      taxaInteligenteDiscount: taxaInteligenteDiscount.value,
    })

    // Filtra Compromissada se não estiver ativada
    const filtered = showCompromissada.value
      ? comparisonResults
      : comparisonResults.filter(r => r.type !== 'compromissada')

    return filtered.map(result => ({
      ...result,
      displayName: PRODUCT_DISPLAY_NAMES[result.type],
      color: PRODUCT_COLORS[result.type],
    }))
  })

  const bestProduct = computed<ProductResult | null>(() => {
    return results.value.find(r => r.isBestOption) || null
  })

  // Actions
  function setBilling(value: number) {
    if (value > 0) {
      billing.value = value
    }
  }

  function setPeriod(value: PeriodOption) {
    period.value = value
  }

  function setCdiRate(value: number) {
    if (value > 0) {
      cdiRate.value = value
    }
  }

  function setCdbPercent(value: number) {
    if (value > 0) {
      cdbPercent.value = value
    }
  }

  function setCompromissadaPercent(value: number) {
    if (value > 0) {
      compromissadaPercent.value = value
    }
  }

  function setTaxaInteligenteDiscount(value: number) {
    if (value >= 0) {
      taxaInteligenteDiscount.value = value
    }
  }

  function setShowCompromissada(value: boolean) {
    showCompromissada.value = value
  }

  function toggleCompromissada() {
    showCompromissada.value = !showCompromissada.value
  }

  function resetToDefaults() {
    billing.value = DEFAULT_VALUES.billing
    period.value = DEFAULT_VALUES.period
    cdiRate.value = DEFAULT_VALUES.cdiRate
    cdbPercent.value = DEFAULT_VALUES.cdbPercent
    compromissadaPercent.value = DEFAULT_VALUES.compromissadaPercent
    taxaInteligenteDiscount.value = DEFAULT_VALUES.taxaInteligenteDiscount
    showCompromissada.value = false
  }

  return {
    // State
    billing,
    period,
    cdiRate,
    cdbPercent,
    compromissadaPercent,
    taxaInteligenteDiscount,
    isLoadingCdi,
    showCompromissada,

    // Computed
    results,
    bestProduct,

    // Actions
    setBilling,
    setPeriod,
    setCdiRate,
    setCdbPercent,
    setCompromissadaPercent,
    setTaxaInteligenteDiscount,
    setShowCompromissada,
    toggleCompromissada,
    resetToDefaults,
  }
})
