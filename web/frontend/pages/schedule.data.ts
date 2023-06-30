import { Event } from 'react-big-calendar'
import moment from 'moment-timezone'

export type AdditionalData = {
  id: number
  isActive: boolean
  screenId: number
}

export type Movie = Omit<Event, 'resource'> & {
  resource: AdditionalData
}

function makeDateTime(
  timeFrame: 'past' | 'future' | 'today',
  options: {
    amount?: number
    unit?: moment.unitOfTime.DurationConstructor
    hour?: number
    minute?: number
  }
): Date {
  const now = moment()

  if (timeFrame === 'past') {
    return now
      .subtract(options.amount, options.unit)
      .hour(options.hour)
      .minute(options.minute)
      .toDate()
  }

  if (timeFrame === 'future') {
    return now
      .add(options.amount, options.unit)
      .hour(options.hour)
      .minute(options.minute)
      .toDate()
  }

  return now.hour(options.hour).minute(options.minute).toDate()
}

export const initialData = [
  {
    resource: {
      id: 1,
      isActive: true,
      screenId: 0,
    },
    title: 'The Shawshank Redemption',
    start: makeDateTime('past', {
      amount: 2,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 2, unit: 'days', hour: 12, minute: 0 }),
  },
  {
    resource: {
      id: 2,
      isActive: true,
      screenId: 0,
    },
    title: 'The Godfather',
    start: makeDateTime('past', {
      amount: 1,
      unit: 'days',
      hour: 14,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 1, unit: 'days', hour: 16, minute: 0 }),
  },
  {
    resource: {
      id: 3,
      isActive: true,
      screenId: 0,
    },
    title: 'The Dark Knight',
    start: makeDateTime('today', { hour: 18, minute: 0 }),
    end: makeDateTime('today', { hour: 20, minute: 0 }),
  },
  {
    resource: {
      id: 4,
      isActive: true,
      screenId: 0,
    },
    title: '12 Angry Men',
    start: makeDateTime('past', {
      amount: 4,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 4, unit: 'days', hour: 12, minute: 0 }),
  },
  {
    resource: {
      id: 5,
      isActive: false,
      screenId: 0,
    },
    title: "Schindler's List",
    start: makeDateTime('past', {
      amount: 5,
      unit: 'days',
      hour: 14,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 5, unit: 'days', hour: 16, minute: 0 }),
  },
  {
    resource: {
      id: 6,
      isActive: true,
      screenId: 0,
    },
    title: 'The Lord of the Rings: The Return of the King',
    start: makeDateTime('past', {
      amount: 6,
      unit: 'days',
      hour: 18,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 6, unit: 'days', hour: 20, minute: 0 }),
  },
  {
    resource: {
      id: 7,
      isActive: true,
      screenId: 0,
    },
    title: 'Pulp Fiction',
    start: makeDateTime('past', {
      amount: 7,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 7, unit: 'days', hour: 12, minute: 0 }),
  },
  {
    resource: {
      id: 8,
      isActive: true,
      screenId: 0,
    },
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    start: makeDateTime('past', {
      amount: 8,
      unit: 'days',
      hour: 14,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 8, unit: 'days', hour: 16, minute: 0 }),
  },
  {
    resource: {
      id: 9,
      isActive: false,
      screenId: 0,
    },
    title: 'Forrest Gump',
    start: makeDateTime('past', {
      amount: 9,
      unit: 'days',
      hour: 18,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 9, unit: 'days', hour: 20, minute: 0 }),
  },
  {
    resource: {
      id: 10,
      isActive: false,
      screenId: 0,
    },
    title: 'Inception',
    start: makeDateTime('past', {
      amount: 10,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('past', {
      amount: 10,
      unit: 'days',
      hour: 12,
      minute: 0,
    }),
  },
  {
    resource: {
      id: 11,
      isActive: true,
      screenId: 0,
    },
    title: 'Future Event',
    start: makeDateTime('future', {
      amount: 1,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('future', {
      amount: 1,
      unit: 'days',
      hour: 12,
      minute: 0,
    }),
  },
  {
    resource: {
      id: 12,
      isActive: true,
      screenId: 0,
    },
    title: 'Another Future Event',
    start: makeDateTime('future', {
      amount: 2,
      unit: 'days',
      hour: 14,
      minute: 0,
    }),
    end: makeDateTime('future', {
      amount: 2,
      unit: 'days',
      hour: 16,
      minute: 0,
    }),
  },
]
