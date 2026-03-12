<template>
  <div>
    <!-- Section title -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
        <ion-icon
          name="grid"
          class="text-white text-xl"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Resultado da Comparacao
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Ordenado pela melhor opcao
        </p>
      </div>
    </div>

    <!-- Cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <ProductCard
        v-for="(product, index) in sortedResults"
        :key="product.type"
        :product="product"
        :difference-from-best="getDifference(product.type)"
        class="animate-fade-in-up opacity-0"
        :class="`stagger-${index + 1}`"
      />
    </div>

    <!-- Summary footer -->
    <div
      v-if="bestProduct"
      class="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
            <ion-icon
              name="checkmark"
              class="text-2xl text-white"
            />
          </div>
          <div>
            <p class="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
              Recomendacao para o cliente
            </p>
            <p class="text-xl font-bold text-emerald-800 dark:text-emerald-200">
              {{ bestProduct.displayName }}
            </p>
          </div>
        </div>
        <div class="text-center sm:text-right">
          <p class="text-sm text-emerald-600 dark:text-emerald-400">
            Ganho
          </p>
          <p class="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            {{ formatCurrency(bestProduct.netAmount) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useComparisonStore } from '~/store/comparison'
import { getProductDifferences } from '~/src/comparison'
import type { ProductType } from '~/types/comparison'
import ProductCard from '~/components/cards/ProductCard.vue'

const store = useComparisonStore()

const sortedResults = computed(() => store.results)
const bestProduct = computed(() => store.bestProduct)

const differences = computed(() => {
  return getProductDifferences(store.results.map(r => ({
    type: r.type,
    name: r.name,
    netAmount: r.netAmount,
    isBestOption: r.isBestOption,
    details: r.details,
  })))
})

function getDifference(type: ProductType): number {
  return differences.value.get(type) || 0
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}
</script>
