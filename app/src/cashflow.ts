import type { CashFlowInputs, CashFlowResult, DayReceipt, WeekCashFlow } from '~/types/cashflow'

const DAYS_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const DAYS_OF_WEEK_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

/**
 * Calcula o fluxo de caixa semanal considerando o delay das Taxas Inteligentes
 *
 * Lógica:
 * - Débito: recebido em D+1 (próximo dia útil)
 * - Crédito: recebido em D+30 (ou conforme delay)
 * - PIX: recebido no mesmo dia
 *
 * Durante o período de transição (primeiras semanas após ativação),
 * o cliente recebe menos porque os recebíveis ainda estão no prazo antigo.
 */
export function calculateCashFlow(inputs: CashFlowInputs): CashFlowResult {
  const weeks: WeekCashFlow[] = []

  // Calcula valores diários base (sem delay)
  const monthlyDebit = inputs.totalVolume * (inputs.debitPercent / 100)
  const monthlyCredit = inputs.totalVolume * (inputs.creditPercent / 100)
  const monthlyPix = inputs.totalVolume * (inputs.pixPercent / 100)

  // Distribui por dia da semana (dias úteis recebem mais)
  // Considerando ~22 dias úteis por mês
  const dailyDebit = monthlyDebit / 22 // Débito só em dias úteis
  const dailyCredit = monthlyCredit / 22 // Crédito só em dias úteis
  const dailyPix = monthlyPix / 30 // PIX todos os dias

  // Valor normal diário (dia útil)
  const normalWeekdayAmount = dailyDebit + dailyCredit + dailyPix
  // Valor fim de semana (só PIX)
  const weekendAmount = dailyPix

  // Gera 12 semanas a partir da data de ativação
  const startDate = new Date(inputs.activationDate)
  // Ajusta para começar na quinta-feira da semana
  const dayOfWeek = startDate.getDay()
  const daysUntilThursday = (4 - dayOfWeek + 7) % 7
  startDate.setDate(startDate.getDate() + daysUntilThursday)

  // Calcula quantas semanas de transição baseado no delay
  const transitionWeeks = Math.ceil(inputs.delayDays / 7) + 1

  for (let week = 0; week < 12; week++) {
    const weekStart = new Date(startDate)
    weekStart.setDate(weekStart.getDate() + week * 7)

    const days: DayReceipt[] = []
    let weekTotal = 0
    const isTransitionWeek = week < transitionWeeks

    // Gera 7 dias da semana (Quinta a Quarta)
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(weekStart)
      currentDate.setDate(currentDate.getDate() + day)

      const dayOfWeekIndex = currentDate.getDay()
      const isWeekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6

      // Durante transição, reduz o valor recebido
      let amount: number
      if (isWeekend) {
        amount = weekendAmount
      }
      else if (isTransitionWeek) {
        // Na transição, recebe menos (simula o delay)
        // Quanto mais perto do fim da transição, mais se aproxima do normal
        const transitionFactor = Math.min(1, (week + 1) / transitionWeeks)
        amount = normalWeekdayAmount * (0.3 + 0.7 * transitionFactor)
      }
      else {
        amount = normalWeekdayAmount
      }

      days.push({
        date: currentDate,
        dayOfWeek: DAYS_OF_WEEK[dayOfWeekIndex],
        dayOfWeekShort: DAYS_OF_WEEK_SHORT[dayOfWeekIndex],
        amount: Math.round(amount * 100) / 100,
        isWeekend,
        isReduced: isTransitionWeek && !isWeekend,
      })

      weekTotal += amount
    }

    // Despesas só nas primeiras semanas (exemplo)
    const expenses = week < 6 ? inputs.weeklyExpenses : 0

    weeks.push({
      weekNumber: week + 1,
      label: `Semana ${week + 1}`,
      days,
      totalEntries: Math.round(weekTotal * 100) / 100,
      expenses,
      balance: Math.round((weekTotal - expenses) * 100) / 100,
      isTransitionWeek,
    })
  }

  // Calcula sumário
  const summary = {
    totalEntries: weeks.reduce((sum, w) => sum + w.totalEntries, 0),
    totalExpenses: weeks.reduce((sum, w) => sum + w.expenses, 0),
    totalBalance: weeks.reduce((sum, w) => sum + w.balance, 0),
    transitionWeeks: weeks.filter(w => w.isTransitionWeek).length,
    normalWeeks: weeks.filter(w => !w.isTransitionWeek).length,
  }

  return { weeks, summary }
}

/**
 * Formata data para exibição
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
