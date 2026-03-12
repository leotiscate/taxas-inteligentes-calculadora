<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-white/10 p-6 mb-6">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <BillingInput />
      <PeriodSelect />
      <CdiRateInput />
      <CdbPercentInput />
      <CompromissadaPercentInput />
      <DiscountInput />
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
