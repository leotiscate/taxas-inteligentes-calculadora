<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <ProductCard
      v-for="product in sortedResults"
      :key="product.type"
      :product="product"
      :difference-from-best="getDifference(product.type)"
    />
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
</script>
