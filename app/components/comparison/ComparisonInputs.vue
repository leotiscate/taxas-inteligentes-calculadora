<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 mb-8 border border-gray-100 dark:border-gray-700">
    <!-- Section title -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
        <ion-icon
          name="options"
          class="text-white text-xl"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Parametros da Simulacao
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Ajuste os valores para comparar os produtos
        </p>
      </div>
    </div>

    <!-- Input grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
      <BillingInput />
      <PeriodSelect />
      <CdiRateInput />
      <CdbPercentInput />
      <CompromissadaPercentInput />
      <DiscountInput />
    </div>

    <!-- Quick info -->
    <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
      <div class="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center gap-1">
          <ion-icon
            name="information-circle"
            class="text-blue-500"
          />
          <span>IR: 22,5% ate 180 dias | 20% ate 360 dias | 17,5% ate 720 dias | 15% acima</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import BillingInput from '~/components/inputs/BillingInput.vue'
import PeriodSelect from '~/components/inputs/PeriodSelect.vue'
import CdiRateInput from '~/components/inputs/CdiRateInput.vue'
import CdbPercentInput from '~/components/inputs/CdbPercentInput.vue'
import CompromissadaPercentInput from '~/components/inputs/CompromissadaPercentInput.vue'
import DiscountInput from '~/components/inputs/DiscountInput.vue'
</script>
