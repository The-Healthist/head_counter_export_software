import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
  state: () => ({
    count: 0,
    months: [
      'Jan,2025',
      'Feb,2025',
      'Mar,2025',
      'Apr,2025',
      'May,2025',
      'Jun,2025',
      'Jul,2025',
      'Aug,2025',
      'Sep,2025',
      'Oct,2025',
      'Nov,2025',
      'Dec,2025'
    ],
    intervals: [
      '10 Min',
      '20 Min',
      '30 Min',
      '40 Min',
      '50 Min',
      '60 Min',
      '70 Min',
      '80 Min',
      '90 Min',
      '120 Min'
    ]
  }),
  actions: {
    getMonths() {
      return this.months
    },
    getIntervals() {
      return this.intervals
    },
    setMonths(months: string[]) {
      this.months = months
    },
    setIntervals(intervals: string[]) {
      this.intervals = intervals
    }
  }
})
