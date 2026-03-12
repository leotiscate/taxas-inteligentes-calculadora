<template>
  <div
    class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 overflow-hidden border-2 transition-all duration-300 card-hover"
    :class="cardClasses"
  >
    <!-- Best option glow effect -->
    <div
      v-if="isBestOption"
      class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"
    />

    <!-- Header with gradient background -->
    <div
      class="relative px-6 py-5"
      :class="headerClasses"
    >
      <!-- Best option badge -->
      <BestOptionBadge
        v-if="isBestOption"
        class="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
      />

      <!-- Product icon and name -->
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
          :class="iconBgClass"
        >
          <ion-icon
            :name="productIcon"
            class="text-2xl text-white"
          />
        </div>
        <div>
          <h3 class="text-lg font-bold text-white">
            {{ displayName }}
          </h3>
          <p class="text-sm text-white/70">
            {{ productSubtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="relative p-6">
      <!-- Main value display -->
      <div class="text-center mb-6">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          {{ valueLabel }}
        </p>
        <p
          class="text-4xl font-bold tracking-tight"
          :class="isBestOption ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-100'"
        >
          {{ formattedNetAmount }}
        </p>
      </div>

      <!-- Details section for investment products -->
      <div
        v-if="hasInvestmentDetails"
        class="space-y-3"
      >
        <!-- Gross interest -->
        <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-green-500" />
            <span class="text-sm text-gray-600 dark:text-gray-400">Rendimento Bruto</span>
          </div>
          <span class="text-sm font-semibold text-green-600 dark:text-green-400">
            {{ formattedInterestAmount }}
          </span>
        </div>

        <!-- IOF (if applicable) -->
        <div
          v-if="hasIof"
          class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-orange-500" />
            <span class="text-sm text-gray-600 dark:text-gray-400">IOF</span>
          </div>
          <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">
            -{{ formattedIofAmount }}
          </span>
        </div>

        <!-- IR -->
        <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-red-500" />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              IR ({{ taxPercentage }}%)
            </span>
          </div>
          <span class="text-sm font-semibold text-red-600 dark:text-red-400">
            -{{ formattedTaxAmount }}
          </span>
        </div>

        <!-- Net result -->
        <div class="flex items-center justify-between pt-2">
          <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Liquido</span>
          <span
            class="text-lg font-bold"
            :class="isBestOption ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-100'"
          >
            {{ formattedNetAmount }}
          </span>
        </div>
      </div>

      <!-- Details for Taxa Inteligente -->
      <div
        v-if="isTaxaInteligente"
        class="space-y-4"
      >
        <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500" />
            <span class="text-sm text-gray-600 dark:text-gray-400">Desconto por dia</span>
          </div>
          <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {{ formattedDailyDiscount }}
          </span>
        </div>

        <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
          <div class="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300">
            <ion-icon
              name="checkmark-circle"
              class="text-xl"
            />
            <span class="text-sm font-medium">Sem IOF e sem IR</span>
          </div>
          <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Desconto aplicado diretamente na taxa
          </p>
        </div>
      </div>

      <!-- Difference from best option -->
      <div
        v-if="!isBestOption && differenceFromBest > 0"
        class="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4"
      >
        <div class="flex items-center gap-2 text-red-700 dark:text-red-400">
          <ion-icon
            name="trending-down"
            class="text-lg"
          />
          <p class="text-sm">
            <span class="font-bold">{{ formattedDifference }}</span>
            a menos que a melhor opcao
          </p>
        </div>
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

const productSubtitle = computed(() => {
  const subtitles: Record<string, string> = {
    cdb: 'Com IOF e IR',
    compromissada: 'Sem IOF, com IR',
    aplicacaoAutomatica: '20% do CDI',
    taxaInteligente: 'Desconto Stone',
  }
  return subtitles[props.product.type] || ''
})

const productIcon = computed(() => {
  const icons: Record<string, string> = {
    cdb: 'bar-chart',
    compromissada: 'shield-checkmark',
    aplicacaoAutomatica: 'wallet',
    taxaInteligente: 'flash',
  }
  return icons[props.product.type] || 'cash'
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
const cardClasses = computed(() => {
  if (isBestOption.value) {
    return 'border-emerald-400 dark:border-emerald-500 best-option-glow'
  }
  return 'border-gray-100 dark:border-gray-700'
})

const headerClasses = computed(() => {
  const classes: Record<ProductColor, string> = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    amber: 'bg-gradient-to-br from-amber-500 to-orange-500',
    green: 'bg-gradient-to-br from-emerald-500 to-teal-500',
  }
  return classes[props.product.color] || classes.blue
})

const iconBgClass = computed(() => {
  const classes: Record<ProductColor, string> = {
    blue: 'bg-blue-600/50',
    purple: 'bg-purple-600/50',
    amber: 'bg-amber-600/50',
    green: 'bg-emerald-600/50',
  }
  return classes[props.product.color] || classes.blue
})
</script>
