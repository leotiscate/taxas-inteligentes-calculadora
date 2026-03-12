import { getCDBResult } from './app/src/cdb'
import { getCompromissadaResult } from './app/src/compromissada'
import { getAplicacaoAutomaticaResult } from './app/src/aplicacaoAutomatica'
import { getTaxaInteligenteResult } from './app/src/taxaInteligente'

const billing = 1000000
const cdiRate = 13.65
const days = 7

console.log('=== TESTE DE CALCULOS ===')
console.log('Faturamento: R$ 1.000.000')
console.log('CDI: 13.65% a.a.')
console.log('Prazo: 7 dias')
console.log('')

const cdb = getCDBResult(billing, cdiRate, 100, days)
console.log('CDB (100% CDI):')
console.log('  Bruto: R$', cdb.interestAmount.toFixed(2))
console.log('  IOF: R$', cdb.iofAmount.toFixed(2))
console.log('  IR (' + cdb.taxPercentage + '%): R$', cdb.taxAmount.toFixed(2))
console.log('  Liquido: R$', cdb.netAmount.toFixed(2))
console.log('')

const comp = getCompromissadaResult(billing, cdiRate, 100, days)
console.log('Compromissada (100% CDI):')
console.log('  Bruto: R$', comp.interestAmount.toFixed(2))
console.log('  IOF: R$ 0.00 (isento)')
console.log('  IR (' + comp.taxPercentage + '%): R$', comp.taxAmount.toFixed(2))
console.log('  Liquido: R$', comp.netAmount.toFixed(2))
console.log('')

const appAuto = getAplicacaoAutomaticaResult(billing, cdiRate, days)
console.log('Aplicacao Automatica (20% CDI):')
console.log('  Bruto: R$', appAuto.interestAmount.toFixed(2))
console.log('  IOF: R$', appAuto.iofAmount.toFixed(2))
console.log('  IR (' + appAuto.taxPercentage + '%): R$', appAuto.taxAmount.toFixed(2))
console.log('  Liquido: R$', appAuto.netAmount.toFixed(2))
console.log('')

const taxaInt = getTaxaInteligenteResult(billing, 0.15, days)
console.log('Taxa Inteligente (0.15%):')
console.log('  Desconto: R$', taxaInt.discountAmount.toFixed(2))
console.log('  Por dia: R$', taxaInt.dailyDiscount.toFixed(2))
