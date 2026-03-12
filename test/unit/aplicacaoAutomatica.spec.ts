import { describe, it, expect } from 'vitest'
import { getAplicacaoAutomaticaResult, APLICACAO_AUTOMATICA_PERCENT_CDI } from '../../app/src/aplicacaoAutomatica'
import { getCDBResult } from '../../app/src/cdb'

describe('aplicacaoAutomatica.ts', () => {
  describe('APLICACAO_AUTOMATICA_PERCENT_CDI', () => {
    it('should be 20% of CDI', () => {
      expect(APLICACAO_AUTOMATICA_PERCENT_CDI).toBe(20)
    })
  })

  describe('getAplicacaoAutomaticaResult', () => {
    it('should calculate result with fixed 20% CDI rate', () => {
      const result = getAplicacaoAutomaticaResult(1000000, 13.65, 7)

      expect(result.interestAmount).toBeGreaterThan(0)
      expect(result.iofAmount).toBeGreaterThan(0) // IOF applies
      expect(result.taxPercentage).toBe(22.5)
      expect(result.taxAmount).toBeGreaterThan(0)
      expect(result.netAmount).toBeLessThan(result.interestAmount)
    })

    it('should have much lower return than 100% CDI CDB', () => {
      const appAuto = getAplicacaoAutomaticaResult(1000000, 13.65, 7)
      const cdb100 = getCDBResult(1000000, 13.65, 100, 7)

      // 20% CDI should yield about 1/5 of 100% CDI
      expect(appAuto.interestAmount).toBeLessThan(cdb100.interestAmount * 0.25)
    })

    it('should calculate net amount correctly', () => {
      const result = getAplicacaoAutomaticaResult(1000000, 13.65, 7)

      const expectedNet = result.interestAmount - result.iofAmount - result.taxAmount
      expect(result.netAmount).toBeCloseTo(expectedNet, 2)
    })

    it('should have IOF for periods under 30 days', () => {
      const result7 = getAplicacaoAutomaticaResult(1000000, 13.65, 7)
      const result30 = getAplicacaoAutomaticaResult(1000000, 13.65, 30)

      expect(result7.iofAmount).toBeGreaterThan(0)
      expect(result30.iofAmount).toBe(0)
    })
  })
})
