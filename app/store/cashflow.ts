import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { calculateCashFlow } from '~/src/cashflow'
import { DEFAULT_CASHFLOW_VALUES } from '~/types/cashflow'
import type { CashFlowResult } from '~/types/cashflow'

export const useCashFlowStore = defineStore('cashflow', () => {
  // State
  const totalVolume = ref(DEFAULT_CASHFLOW_VALUES.totalVolume)
  const debitPercent = ref(DEFAULT_CASHFLOW_VALUES.debitPercent)
  const creditPercent = ref(DEFAULT_CASHFLOW_VALUES.creditPercent)
  const pixPercent = ref(DEFAULT_CASHFLOW_VALUES.pixPercent)
  const delayDays = ref<7 | 15 | 30>(DEFAULT_CASHFLOW_VALUES.delayDays)
  const activationDate = ref(DEFAULT_CASHFLOW_VALUES.activationDate)
  const weeklyExpenses = ref(DEFAULT_CASHFLOW_VALUES.weeklyExpenses)

  // Despesas customizadas por semana (índice 0-11)
  const customWeeklyExpenses = ref<Record<number, number>>({})

  // Computed - Results
  const result = computed<CashFlowResult>(() => {
    const baseResult = calculateCashFlow({
      totalVolume: totalVolume.value,
      debitPercent: debitPercent.value,
      creditPercent: creditPercent.value,
      pixPercent: pixPercent.value,
      delayDays: delayDays.value,
      activationDate: activationDate.value,
      weeklyExpenses: weeklyExpenses.value,
    })

    // Aplica despesas customizadas por semana
    const weeksWithCustomExpenses = baseResult.weeks.map((week, index) => {
      const customExpense = customWeeklyExpenses.value[index]
      if (customExpense !== undefined) {
        const newExpenses = customExpense
        const newBalance = week.totalEntries - newExpenses
        return {
          ...week,
          expenses: newExpenses,
          balance: Math.round(newBalance * 100) / 100,
        }
      }
      return week
    })

    // Recalcula sumário
    const summary = {
      totalEntries: weeksWithCustomExpenses.reduce((sum, w) => sum + w.totalEntries, 0),
      totalExpenses: weeksWithCustomExpenses.reduce((sum, w) => sum + w.expenses, 0),
      totalBalance: weeksWithCustomExpenses.reduce((sum, w) => sum + w.balance, 0),
      transitionWeeks: weeksWithCustomExpenses.filter(w => w.isTransitionWeek).length,
      normalWeeks: weeksWithCustomExpenses.filter(w => !w.isTransitionWeek).length,
    }

    return { weeks: weeksWithCustomExpenses, summary }
  })

  // Computed - Valores calculados
  const debitValue = computed(() => totalVolume.value * (debitPercent.value / 100))
  const creditValue = computed(() => totalVolume.value * (creditPercent.value / 100))
  const pixValue = computed(() => totalVolume.value * (pixPercent.value / 100))

  // Actions
  function setTotalVolume(value: number) {
    if (value > 0) {
      totalVolume.value = value
    }
  }

  function setDebitPercent(value: number) {
    if (value >= 0 && value <= 100) {
      debitPercent.value = value
      // Ajusta os outros para somar 100%
      const remaining = 100 - value
      const ratio = creditPercent.value / (creditPercent.value + pixPercent.value) || 0.5
      creditPercent.value = Math.round(remaining * ratio)
      pixPercent.value = remaining - creditPercent.value
    }
  }

  function setCreditPercent(value: number) {
    if (value >= 0 && value <= 100) {
      creditPercent.value = value
      const remaining = 100 - value
      const ratio = debitPercent.value / (debitPercent.value + pixPercent.value) || 0.5
      debitPercent.value = Math.round(remaining * ratio)
      pixPercent.value = remaining - debitPercent.value
    }
  }

  function setPixPercent(value: number) {
    if (value >= 0 && value <= 100) {
      pixPercent.value = value
      const remaining = 100 - value
      const ratio = debitPercent.value / (debitPercent.value + creditPercent.value) || 0.5
      debitPercent.value = Math.round(remaining * ratio)
      creditPercent.value = remaining - debitPercent.value
    }
  }

  function setDelayDays(value: 7 | 15 | 30) {
    delayDays.value = value
  }

  function setActivationDate(value: Date) {
    activationDate.value = value
  }

  function setWeeklyExpenses(value: number) {
    if (value >= 0) {
      weeklyExpenses.value = value
    }
  }

  function setCustomWeekExpense(weekIndex: number, value: number) {
    if (value >= 0) {
      customWeeklyExpenses.value[weekIndex] = value
    }
  }

  function clearCustomWeekExpense(weekIndex: number) {
    delete customWeeklyExpenses.value[weekIndex]
  }

  function resetToDefaults() {
    totalVolume.value = DEFAULT_CASHFLOW_VALUES.totalVolume
    debitPercent.value = DEFAULT_CASHFLOW_VALUES.debitPercent
    creditPercent.value = DEFAULT_CASHFLOW_VALUES.creditPercent
    pixPercent.value = DEFAULT_CASHFLOW_VALUES.pixPercent
    delayDays.value = DEFAULT_CASHFLOW_VALUES.delayDays
    activationDate.value = new Date()
    weeklyExpenses.value = DEFAULT_CASHFLOW_VALUES.weeklyExpenses
    customWeeklyExpenses.value = {}
  }

  return {
    // State
    totalVolume,
    debitPercent,
    creditPercent,
    pixPercent,
    delayDays,
    activationDate,
    weeklyExpenses,
    customWeeklyExpenses,

    // Computed
    result,
    debitValue,
    creditValue,
    pixValue,

    // Actions
    setTotalVolume,
    setDebitPercent,
    setCreditPercent,
    setPixPercent,
    setDelayDays,
    setActivationDate,
    setWeeklyExpenses,
    setCustomWeekExpense,
    clearCustomWeekExpense,
    resetToDefaults,
  }
})
