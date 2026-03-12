<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 mb-8 border border-gray-100 dark:border-gray-700">
    <!-- Section title -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
        <ion-icon
          name="bar-chart"
          class="text-white text-xl"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Grafico Comparativo
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Entradas vs Despesas por semana
        </p>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-6 mb-6">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-green-500" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Sem impacto</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-orange-400" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Com impacto do delay</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-red-500" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Despesas</span>
      </div>
    </div>

    <!-- Chart -->
    <div class="relative">
      <!-- Y-axis labels -->
      <div class="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 text-right pr-2">
        <span>{{ formatCompact(maxValue) }}</span>
        <span>{{ formatCompact(maxValue * 0.75) }}</span>
        <span>{{ formatCompact(maxValue * 0.5) }}</span>
        <span>{{ formatCompact(maxValue * 0.25) }}</span>
        <span>0</span>
      </div>

      <!-- Chart area -->
      <div class="ml-16 overflow-x-auto">
        <div
          class="flex items-end gap-2 min-w-max"
          style="height: 300px;"
        >
          <div
            v-for="week in store.result.weeks"
            :key="week.weekNumber"
            class="flex flex-col items-center"
          >
            <!-- Bars -->
            <div class="flex items-end gap-1 h-64">
              <!-- Entries bar -->
              <div
                class="w-6 sm:w-8 rounded-t transition-all duration-300 cursor-pointer"
                :class="hasRealImpact(week) ? 'bg-orange-400 hover:bg-orange-500' : 'bg-green-500 hover:bg-green-600'"
                :style="{ height: `${(week.totalEntries / maxValue) * 100}%` }"
                :title="getWeekTooltip(week)"
              />
              <!-- Expenses bar -->
              <div
                class="w-6 sm:w-8 bg-red-500 hover:bg-red-600 rounded-t transition-all duration-300 cursor-pointer"
                :style="{ height: `${(week.expenses / maxValue) * 100}%` }"
                :title="`Despesas: ${formatCurrency(week.expenses)}`"
              />
            </div>

            <!-- Week label -->
            <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              <div
                class="font-medium px-1 py-0.5 rounded"
                :class="hasRealImpact(week) ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : ''"
              >
                S{{ week.weekNumber }}
              </div>
            </div>

            <!-- Balance indicator -->
            <div
              :class="[
                'mt-1 text-xs font-semibold',
                week.balance >= 0 ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ week.balance >= 0 ? '+' : '' }}{{ formatCompact(week.balance) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Baseline -->
      <div class="ml-16 h-px bg-gray-300 dark:bg-gray-600" />
    </div>

    <!-- Insight box -->
    <div
      class="mt-6 p-4 rounded-xl"
      :class="insightClass"
    >
      <div class="flex items-start gap-3">
        <ion-icon
          :name="insightIcon"
          class="text-xl mt-0.5 flex-shrink-0"
        />
        <div class="text-sm">
          <p class="font-semibold mb-1">
            {{ insightTitle }}
          </p>
          <p class="opacity-80">
            {{ insightText }}
          </p>
        </div>
      </div>
    </div>

    <!-- Explicacao detalhada das semanas impactadas -->
    <div
      v-if="impactedWeeks.length > 0"
      class="mt-6"
    >
      <button
        class="w-full flex items-center justify-between text-base font-bold text-gray-800 dark:text-white mb-4 p-2 -m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click="showImpactAnalysis = !showImpactAnalysis"
      >
        <span class="flex items-center gap-2">
          <ion-icon
            name="alert-circle"
            class="text-orange-500"
          />
          Analise das Semanas com Impacto ({{ impactedWeeks.length }})
        </span>
        <ion-icon
          :name="showImpactAnalysis ? 'chevron-up' : 'chevron-down'"
          class="text-gray-400"
        />
      </button>

      <div
        v-show="showImpactAnalysis"
        class="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <div
          v-for="week in impactedWeeks"
          :key="week.weekNumber"
          class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-orange-800 dark:text-orange-300">
              Semana {{ week.weekNumber }}
            </span>
            <span class="text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full">
              -{{ getWeekReduction(week) }}%
            </span>
          </div>

          <div class="text-sm text-orange-700 dark:text-orange-300 mb-3">
            <p class="mb-1">
              <strong>Recebido:</strong> {{ formatCurrency(week.totalEntries) }}
              <span class="text-orange-500">(esperado: {{ formatCurrency(expectedWeeklyEntries) }})</span>
            </p>
          </div>

          <!-- Motivos do impacto -->
          <div class="text-xs space-y-1">
            <p class="font-semibold text-orange-800 dark:text-orange-300 mb-1">
              Por que esta semana esta impactada?
            </p>
            <ul class="space-y-1 text-orange-700 dark:text-orange-400">
              <li
                v-for="reason in getWeekReasons(week)"
                :key="reason"
                class="flex items-start gap-2"
              >
                <ion-icon
                  name="chevron-forward"
                  class="mt-0.5 flex-shrink-0"
                />
                <span>{{ reason }}</span>
              </li>
            </ul>
          </div>

          <!-- Breakdown por modalidade -->
          <div class="mt-3 pt-3 border-t border-orange-200 dark:border-orange-700 grid grid-cols-3 gap-2 text-xs">
            <div class="text-center">
              <div class="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                PIX
              </div>
              <div class="font-semibold">
                {{ formatCompact(getWeekPix(week)) }}
              </div>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
                <div class="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Debito
              </div>
              <div class="font-semibold">
                {{ formatCompact(getWeekDebit(week)) }}
              </div>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400">
                <div class="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Credito
              </div>
              <div class="font-semibold">
                {{ formatCompact(getWeekCredit(week)) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Explicacao geral do impacto -->
    <div class="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
      <div class="flex items-start gap-3">
        <ion-icon
          name="bulb"
          class="text-xl text-amber-500 mt-0.5 flex-shrink-0"
        />
        <div class="text-sm text-gray-700 dark:text-gray-300">
          <p class="font-semibold mb-2">
            Como funciona o impacto do delay?
          </p>
          <ul class="space-y-1 opacity-90">
            <li
              v-if="store.delayDebit"
              class="flex items-center gap-2"
            >
              <div class="w-2 h-2 rounded-full bg-blue-500" />
              <span><strong>Debito:</strong> Antes D+1, agora D+1+{{ store.delayDays }} = D+{{ 1 + store.delayDays }} (impacto nas primeiras {{ Math.ceil((1 + store.delayDays) / 7) }} semanas)</span>
            </li>
            <li
              v-if="store.delayCredit"
              class="flex items-center gap-2"
            >
              <div class="w-2 h-2 rounded-full bg-purple-500" />
              <span><strong>Credito:</strong> Antes D+30, agora D+30+{{ store.delayDays }} = D+{{ 30 + store.delayDays }} (impacto nas primeiras {{ Math.ceil((30 + store.delayDays) / 7) }} semanas)</span>
            </li>
            <li
              v-if="store.delayPix"
              class="flex items-center gap-2"
            >
              <div class="w-2 h-2 rounded-full bg-emerald-500" />
              <span><strong>PIX:</strong> Antes D+0, agora D+0+{{ store.delayDays }} = D+{{ store.delayDays }} (impacto nas primeiras {{ Math.ceil(store.delayDays / 7) }} semanas)</span>
            </li>
            <li
              v-if="!store.delayDebit && !store.delayCredit && !store.delayPix"
              class="text-gray-500"
            >
              Nenhuma modalidade com delay ativado.
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Semanas sem impacto -->
    <div
      v-if="normalWeeksAfterImpact.length > 0"
      class="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
    >
      <div class="flex items-start gap-3">
        <ion-icon
          name="checkmark-circle"
          class="text-xl text-green-500 mt-0.5 flex-shrink-0"
        />
        <div class="text-sm text-green-800 dark:text-green-300">
          <p class="font-semibold mb-1">
            Semanas normalizadas
          </p>
          <p class="opacity-80">
            A partir da semana {{ firstNormalWeek }}, o fluxo de caixa se normaliza.
            As semanas {{ normalWeeksAfterImpact.map(w => w.weekNumber).join(', ') }} estao com recebimentos dentro do esperado
            pois todos os recebimentos ja estao no novo prazo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useCashFlowStore } from '~/store/cashflow'
import type { WeekCashFlow } from '~/types/cashflow'

const store = useCashFlowStore()

const showImpactAnalysis = ref(false)

// Calcula o valor esperado sem delay para comparar
const expectedWeeklyEntries = computed(() => {
  const dailyDebit = (store.totalVolume * (store.debitPercent / 100)) / 22
  const dailyCredit = (store.totalVolume * (store.creditPercent / 100)) / 22
  const dailyPix = (store.totalVolume * (store.pixPercent / 100)) / 30
  // 5 dias uteis + 2 fim de semana (so PIX)
  return (dailyDebit + dailyCredit + dailyPix) * 5 + dailyPix * 2
})

// Verifica se a semana tem impacto real (recebimentos abaixo do esperado)
function hasRealImpact(week: WeekCashFlow): boolean {
  const threshold = expectedWeeklyEntries.value * 0.95 // 5% de tolerancia
  return week.totalEntries < threshold
}

function getWeekReduction(week: WeekCashFlow): string {
  const expected = expectedWeeklyEntries.value
  const actual = week.totalEntries
  const reduction = ((expected - actual) / expected) * 100
  return reduction.toFixed(1)
}

function getWeekPix(week: WeekCashFlow): number {
  return week.days.reduce((sum, day) => sum + (day.pixAmount || 0), 0)
}

function getWeekDebit(week: WeekCashFlow): number {
  return week.days.reduce((sum, day) => sum + (day.debitAmount || 0), 0)
}

function getWeekCredit(week: WeekCashFlow): number {
  return week.days.reduce((sum, day) => sum + (day.creditAmount || 0), 0)
}

function getWeekReasons(week: WeekCashFlow): string[] {
  const reasons: string[] = []
  const weekNum = week.weekNumber

  // Calcula os prazos esperados de impacto por modalidade
  const debitImpactWeeks = Math.ceil((1 + store.delayDays) / 7) + 1
  const creditImpactWeeks = Math.ceil((30 + store.delayDays) / 7) + 1
  const pixImpactWeeks = Math.ceil(store.delayDays / 7) + 1

  if (store.delayDebit && weekNum <= debitImpactWeeks) {
    const debitExpected = (store.totalVolume * (store.debitPercent / 100)) / 22 * 5 // 5 dias uteis
    const debitActual = getWeekDebit(week)
    if (debitActual < debitExpected * 0.9) {
      reasons.push(`Debito atrasado: vendas pos-ativacao ainda nao chegaram (prazo D+${1 + store.delayDays}). Recebendo apenas debitos de vendas antigas.`)
    }
  }

  if (store.delayCredit && weekNum <= creditImpactWeeks) {
    const creditExpected = (store.totalVolume * (store.creditPercent / 100)) / 22 * 5
    const creditActual = getWeekCredit(week)
    if (creditActual < creditExpected * 0.9) {
      if (weekNum <= 5) {
        reasons.push(`Credito em transicao: recebendo creditos de vendas de ${30 - (weekNum * 7)} a ${37 - (weekNum * 7)} dias atras (prazo antigo D+30).`)
      }
      else {
        reasons.push(`Credito com delay: periodo de ${store.delayDays} dias sem recebimento de credito novo (entre D+30 antigo e D+${30 + store.delayDays} novo).`)
      }
    }
  }

  if (store.delayPix && weekNum <= pixImpactWeeks) {
    reasons.push(`PIX atrasado: vendas pos-ativacao demoram ${store.delayDays} dias para cair (antes era D+0).`)
  }

  if (reasons.length === 0) {
    reasons.push(`Reducao geral nos recebimentos durante o periodo de transicao.`)
  }

  return reasons
}

function getWeekTooltip(week: WeekCashFlow): string {
  if (hasRealImpact(week)) {
    return `S${week.weekNumber}: ${formatCurrency(week.totalEntries)} (impacto do delay: -${getWeekReduction(week)}%)`
  }
  return `S${week.weekNumber}: ${formatCurrency(week.totalEntries)} (normal)`
}

const maxValue = computed(() => {
  const allValues = store.result.weeks.flatMap(w => [w.totalEntries, w.expenses])
  return Math.max(...allValues) * 1.1 // 10% margin
})

const negativeWeeks = computed(() => {
  return store.result.weeks.filter(w => w.balance < 0)
})

const impactedWeeks = computed(() => {
  return store.result.weeks.filter(w => hasRealImpact(w))
})

const normalWeeksAfterImpact = computed(() => {
  const lastImpactedWeek = Math.max(...impactedWeeks.value.map(w => w.weekNumber), 0)
  return store.result.weeks.filter(w => !hasRealImpact(w) && w.weekNumber > lastImpactedWeek)
})

const firstNormalWeek = computed(() => {
  const lastImpactedWeek = Math.max(...impactedWeeks.value.map(w => w.weekNumber), 0)
  return lastImpactedWeek + 1
})

const insightClass = computed(() => {
  if (negativeWeeks.value.length === 0) {
    return 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
  }
  if (negativeWeeks.value.length <= 2) {
    return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
  }
  return 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
})

const insightIcon = computed(() => {
  if (negativeWeeks.value.length === 0) return 'checkmark-circle'
  if (negativeWeeks.value.length <= 2) return 'warning'
  return 'alert-circle'
})

const insightTitle = computed(() => {
  if (negativeWeeks.value.length === 0) {
    return 'Fluxo de caixa positivo!'
  }
  return `${negativeWeeks.value.length} semana(s) com saldo negativo`
})

const insightText = computed(() => {
  if (negativeWeeks.value.length === 0) {
    if (impactedWeeks.value.length === 0) {
      return 'Nenhum impacto real do delay. O cliente mantem o caixa positivo em todas as semanas.'
    }
    return `O cliente consegue manter o caixa positivo mesmo com ${impactedWeeks.value.length} semana(s) de impacto do delay.`
  }
  const totalDeficit = negativeWeeks.value.reduce((sum, w) => sum + Math.abs(w.balance), 0)
  return `O cliente precisara de aproximadamente ${formatCurrency(totalDeficit)} de capital de giro para cobrir o deficit nas semanas ${negativeWeeks.value.map(w => w.weekNumber).join(', ')}.`
})

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toFixed(0)
}
</script>
