import { describe, it, expect } from 'vitest'
import {
  compoundInterest,
  getIndexIR,
  getIOFPercentage,
  getIOFAmount,
  toBusinessDays,
  getDailyFactor,
} from '../../app/src/finance'

describe('finance.ts', () => {
  describe('getIndexIR', () => {
    it('should return 22.5% for periods up to 180 days', () => {
      expect(getIndexIR(1)).toBe(22.5)
      expect(getIndexIR(90)).toBe(22.5)
      expect(getIndexIR(180)).toBe(22.5)
    })

    it('should return 20% for periods between 181 and 360 days', () => {
      expect(getIndexIR(181)).toBe(20)
      expect(getIndexIR(270)).toBe(20)
      expect(getIndexIR(360)).toBe(20)
    })

    it('should return 17.5% for periods between 361 and 720 days', () => {
      expect(getIndexIR(361)).toBe(17.5)
      expect(getIndexIR(540)).toBe(17.5)
      expect(getIndexIR(720)).toBe(17.5)
    })

    it('should return 15% for periods above 720 days', () => {
      expect(getIndexIR(721)).toBe(15)
      expect(getIndexIR(1000)).toBe(15)
    })
  })

  describe('getIOFPercentage', () => {
    it('should return 96% for day 1', () => {
      expect(getIOFPercentage(1)).toBe(96)
    })

    it('should return 0% for day 30', () => {
      expect(getIOFPercentage(30)).toBe(0)
    })

    it('should return 0% for days after 30', () => {
      expect(getIOFPercentage(31)).toBe(0)
      expect(getIOFPercentage(100)).toBe(0)
    })

    it('should return 0% for invalid days', () => {
      expect(getIOFPercentage(0)).toBe(0)
      expect(getIOFPercentage(-1)).toBe(0)
    })
  })

  describe('getIOFAmount', () => {
    it('should calculate IOF correctly for day 1', () => {
      expect(getIOFAmount(1, 100)).toBe(96)
    })

    it('should return 0 for day 30', () => {
      expect(getIOFAmount(30, 100)).toBe(0)
    })
  })

  describe('toBusinessDays', () => {
    it('should convert calendar days to business days', () => {
      const businessDays = toBusinessDays(365)
      expect(businessDays).toBeCloseTo(252, 0)
    })

    it('should convert 7 calendar days correctly', () => {
      const businessDays = toBusinessDays(7)
      expect(businessDays).toBeCloseTo(4.83, 1)
    })
  })

  describe('getDailyFactor', () => {
    it('should calculate daily factor for 100% CDI at 13.65%', () => {
      const factor = getDailyFactor(13.65, 100)
      // (1 + 0.1365)^(1/252) ≈ 1.000508
      expect(factor).toBeCloseTo(1.000508, 5)
    })

    it('should calculate daily factor for 20% CDI at 13.65%', () => {
      const factor = getDailyFactor(13.65, 20)
      // (1 + 0.0273)^(1/252) ≈ 1.000107
      expect(factor).toBeCloseTo(1.000107, 5)
    })
  })

  describe('compoundInterest', () => {
    it('should calculate compound interest correctly', () => {
      const amount = 1000000
      const dailyFactor = 1.000508 // ~100% CDI at 13.65%
      const businessDays = 4.83 // ~7 calendar days

      const interest = compoundInterest(amount, dailyFactor, businessDays)
      expect(interest).toBeGreaterThan(0)
      expect(interest).toBeLessThan(amount * 0.01) // Less than 1% for 7 days
    })
  })
})
