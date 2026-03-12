export interface CashFlowInputs {
  totalVolume: number // Recebimentos totais mensais
  debitPercent: number // % do volume em débito
  creditPercent: number // % do volume em crédito
  pixPercent: number // % do volume em PIX
  delayDays: 7 | 15 | 30 // Prazo do delay
  activationDate: Date // Data de ativação
  weeklyExpenses: number // Contas a pagar semanais
}

export interface DayReceipt {
  date: Date
  dayOfWeek: string
  dayOfWeekShort: string
  amount: number
  isWeekend: boolean
  isReduced: boolean // Se está no período de transição (menor recebimento)
}

export interface WeekCashFlow {
  weekNumber: number
  label: string
  days: DayReceipt[]
  totalEntries: number
  expenses: number
  balance: number
  isTransitionWeek: boolean // Semana com recebimento reduzido
}

export interface CashFlowResult {
  weeks: WeekCashFlow[]
  summary: {
    totalEntries: number
    totalExpenses: number
    totalBalance: number
    transitionWeeks: number
    normalWeeks: number
  }
}

export const DELAY_OPTIONS: Array<{ value: 7 | 15 | 30; label: string }> = [
  { value: 7, label: '7 dias' },
  { value: 15, label: '15 dias' },
  { value: 30, label: '30 dias' },
]

export const DEFAULT_CASHFLOW_VALUES: CashFlowInputs = {
  totalVolume: 1000000,
  debitPercent: 30,
  creditPercent: 40,
  pixPercent: 30,
  delayDays: 7,
  activationDate: new Date(),
  weeklyExpenses: 100000,
}
