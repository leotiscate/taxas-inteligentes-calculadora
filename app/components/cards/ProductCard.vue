<template>
  <div
    :class="[
      'relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 overflow-hidden transition-all duration-300 card-hover',
      featured
        ? 'border-4 border-emerald-500 ring-4 ring-emerald-500/20'
        : 'border-2 border-gray-100 dark:border-gray-700'
    ]"
  >
    <!-- Header with gradient background -->
    <div
      :class="[
        'relative',
        headerClasses,
        featured ? 'px-6 py-6' : 'px-5 py-4'
      ]"
    >
      <!-- Product icon and name -->
      <div :class="featured ? 'flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left' : 'flex items-center gap-3'">
        <div
          :class="[
            'rounded-xl flex items-center justify-center shadow-lg',
            iconBgClass,
            featured ? 'w-14 h-14' : 'w-10 h-10'
          ]"
        >
          <ion-icon
            :name="productIcon"
            :class="['text-white', featured ? 'text-2xl' : 'text-xl']"
          />
        </div>
        <div class="min-w-0">
          <h3 :class="['font-bold text-white whitespace-nowrap', featured ? 'text-xl' : 'text-sm']">
            {{ displayName }}
          </h3>
          <p :class="['text-white/70 whitespace-nowrap', featured ? 'text-sm' : 'text-xs']">
            {{ productSubtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div :class="['relative', featured ? 'p-6' : 'p-5']">
      <!-- Main value display -->
      <div :class="['text-center', featured ? 'mb-6' : 'mb-4']">
        <p :class="['font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1', featured ? 'text-sm' : 'text-xs']">
          {{ valueLabel }}
        </p>
        <p :class="['font-bold tracking-tight text-gray-800 dark:text-gray-100', featured ? 'text-4xl' : 'text-2xl']">
          {{ formattedNetAmount }}
        </p>
      </div>

      <!-- Details section for investment products -->
      <div
        v-if="hasInvestmentDetails"
        class="space-y-2 text-sm"
      >
        <!-- Gross interest -->
        <div class="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span class="text-gray-600 dark:text-gray-400">Bruto</span>
          </div>
          <span class="font-semibold text-green-600 dark:text-green-400">
            {{ formattedInterestAmount }}
          </span>
        </div>

        <!-- IOF (if applicable) -->
        <div
          v-if="hasIof"
          class="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span class="text-gray-600 dark:text-gray-400">IOF</span>
          </div>
          <span class="font-semibold text-orange-600 dark:text-orange-400">
            -{{ formattedIofAmount }}
          </span>
        </div>

        <!-- IR -->
        <div class="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span class="text-gray-600 dark:text-gray-400">IR ({{ taxPercentage }}%)</span>
          </div>
          <span class="font-semibold text-red-600 dark:text-red-400">
            -{{ formattedTaxAmount }}
          </span>
        </div>

        <!-- Net result -->
        <div class="flex items-center justify-between pt-1">
          <span class="font-bold text-gray-700 dark:text-gray-300">Liquido</span>
          <span class="font-bold text-gray-800 dark:text-gray-100">
            {{ formattedNetAmount }}
          </span>
        </div>
      </div>

      <!-- Details for Taxa Inteligente -->
      <div
        v-if="isTaxaInteligente"
        :class="featured ? 'space-y-4' : 'space-y-3'"
      >
        <div :class="['flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700', featured ? 'text-base' : 'text-sm']">
          <div class="flex items-center gap-2">
            <div :class="['rounded-full bg-emerald-500', featured ? 'w-2 h-2' : 'w-1.5 h-1.5']" />
            <span class="text-gray-600 dark:text-gray-400">Por dia</span>
          </div>
          <span :class="['font-semibold text-emerald-600 dark:text-emerald-400', featured ? 'text-lg' : '']">
            {{ formattedDailyDiscount }}
          </span>
        </div>

        <div :class="['bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center', featured ? 'p-4' : 'p-3']">
          <div :class="['flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300', featured ? 'flex-wrap' : '']">
            <ion-icon
              name="checkmark-circle"
              :class="featured ? 'text-xl' : 'text-base'"
            />
            <span :class="['font-medium', featured ? 'text-sm' : 'text-xs']">Sem IOF e sem IR</span>
          </div>
          <p
            v-if="featured"
            class="mt-2 text-xs text-emerald-600 dark:text-emerald-400"
          >
            Desconto aplicado diretamente na sua taxa de maquininha
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

const props = withDefaults(defineProps<{
  product: ProductResult
  featured?: boolean
}>(), {
  featured: false,
})

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

const displayName = computed(() => props.product.displayName)
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
