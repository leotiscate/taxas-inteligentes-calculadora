<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-white/10 overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-white/15 transition-shadow duration-300"
    :class="{ 'ring-2 ring-stone-green': isBestOption }"
  >
    <!-- Header with gradient background -->
    <div
      class="px-6 py-4 bg-gradient-to-r relative"
      :class="headerGradientClass"
    >
      <BestOptionBadge
        v-if="isBestOption"
        class="absolute -top-0 right-4 transform -translate-y-1/2"
      />
      <h3 class="text-xl font-bold text-white drop-shadow-sm">
        {{ displayName }}
      </h3>
    </div>

    <div class="p-6">
      <!-- Main value -->
      <div class="mb-4">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {{ valueLabel }}
        </p>
        <p
          class="text-3xl font-bold"
          :class="isBestOption ? 'text-stone-green' : 'text-gray-900 dark:text-gray-100'"
        >
          {{ formattedNetAmount }}
        </p>
      </div>

      <!-- Details for investment products -->
      <div
        v-if="hasInvestmentDetails"
        class="space-y-2 text-sm"
      >
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Rendimento Bruto</span>
          <span class="font-medium text-green-600 dark:text-green-400">{{ formattedInterestAmount }}</span>
        </div>

        <div
          v-if="hasIof"
          class="flex justify-between"
        >
          <span class="text-gray-600 dark:text-gray-400">IOF</span>
          <span class="font-medium text-red-600 dark:text-red-400">-{{ formattedIofAmount }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">
            IR ({{ taxPercentage }}%)
          </span>
          <span class="font-medium text-red-600 dark:text-red-400">-{{ formattedTaxAmount }}</span>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700 dark:text-gray-300">Rendimento Liquido</span>
            <span
              class="font-bold"
              :class="isBestOption ? 'text-stone-green' : 'text-gray-900 dark:text-gray-100'"
            >
              {{ formattedNetAmount }}
            </span>
          </div>
        </div>
      </div>

      <!-- Details for Taxa Inteligente -->
      <div
        v-if="isTaxaInteligente"
        class="space-y-2 text-sm"
      >
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Desconto por dia</span>
          <span class="font-medium text-green-600 dark:text-green-400">{{ formattedDailyDiscount }}</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Sem IOF, sem IR - desconto direto na taxa
        </p>
      </div>

      <!-- Difference from best -->
      <div
        v-if="!isBestOption && differenceFromBest > 0"
        class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
      >
        <p class="text-sm text-red-700 dark:text-red-400">
          <span class="font-medium">{{ formattedDifference }}</span> a menos que a melhor opcao
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import type { ProductColor, ProductResult } from '~/types/comparison'
import type { TaxaInteligenteResult } from '~/src/taxaInteligente'
import BestOptionBadge from './BestOptionBadge.vue'

const props = defineProps<{
  product: ProductResult
  differenceFromBest: number
}>()

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

const displayName = computed(() => props.product.displayName)
const isBestOption = computed(() => props.product.isBestOption)
const isTaxaInteligente = computed(() => props.product.type === 'taxaInteligente')
const hasInvestmentDetails = computed(() => !isTaxaInteligente.value)

const valueLabel = computed(() => {
  return isTaxaInteligente.value ? 'Desconto Total' : 'Rendimento Liquido'
})

const formattedNetAmount = computed(() => formatCurrency(props.product.netAmount))
const formattedDifference = computed(() => formatCurrency(props.differenceFromBest))

// Investment details
const details = computed(() => props.product.details)

const hasIof = computed(() => {
  if (isTaxaInteligente.value) return false
  return 'iofAmount' in details.value && (details.value as { iofAmount: number }).iofAmount > 0
})

const formattedInterestAmount = computed(() => {
  if ('interestAmount' in details.value) {
    return formatCurrency((details.value as { interestAmount: number }).interestAmount)
  }
  return ''
})

const formattedIofAmount = computed(() => {
  if ('iofAmount' in details.value) {
    return formatCurrency((details.value as { iofAmount: number }).iofAmount)
  }
  return ''
})

const formattedTaxAmount = computed(() => {
  if ('taxAmount' in details.value) {
    return formatCurrency((details.value as { taxAmount: number }).taxAmount)
  }
  return ''
})

const taxPercentage = computed(() => {
  if ('taxPercentage' in details.value) {
    return (details.value as { taxPercentage: number }).taxPercentage
  }
  return 0
})

// Taxa Inteligente details
const formattedDailyDiscount = computed(() => {
  if (isTaxaInteligente.value && 'dailyDiscount' in details.value) {
    return formatCurrency((details.value as TaxaInteligenteResult).dailyDiscount)
  }
  return ''
})

// Styling
const headerGradientClass = computed(() => {
  const gradientMap: Record<ProductColor, string> = {
    blue: 'from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800',
    purple: 'from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800',
    amber: 'from-amber-500 to-amber-600 dark:from-amber-700 dark:to-amber-800',
    green: 'from-stone-green to-emerald-600 dark:from-emerald-700 dark:to-emerald-800',
  }
  return gradientMap[props.product.color] || gradientMap.blue
})
</script>
