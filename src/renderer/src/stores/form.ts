import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
  state: () => ({
    count: 0,
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
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
