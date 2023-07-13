import moment from 'moment-timezone'
import { Event } from 'react-big-calendar'

export type AdditionalData = {
  id: number
  screenId: number
  isActive: boolean
  isProduct: boolean
  lens: string
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

export const initialData: Movie[] = [
  {
    resource: {
      id: 1,
      isActive: true,
      isProduct: true,
      screenId: 0,
      lens: 'cs',
    },
    title: 'The Shawshank Redemption',
    start: makeDateTime('future', {
      amount: 2,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('future', {
      amount: 2,
      unit: 'days',
      hour: 12,
      minute: 0,
    }),
  },
  {
    resource: {
      id: 2,
      isActive: false,
      isProduct: false,
      screenId: 0,
      lens: 'cs',
    },
    title: 'The Godfather',
    start: makeDateTime('today', {
      hour: 16,
      minute: 0,
    }),
    end: makeDateTime('today', {
      hour: 18,
      minute: 0,
    }),
  },
  {
    resource: {
      id: 3,
      isActive: true,
      isProduct: true,
      screenId: 0,
      lens: 'cs',
    },
    title: 'The Dark Knight',
    start: makeDateTime('today', { hour: 18, minute: 0 }),
    end: makeDateTime('today', { hour: 20, minute: 0 }),
  },
  {
    resource: {
      id: 13,
      isActive: true,
      isProduct: true,
      screenId: 0,
      lens: 'vv',
    },
    title: 'Spider man',
    start: makeDateTime('today', { hour: 14, minute: 0 }),
    end: makeDateTime('today', { hour: 16, minute: 0 }),
  },
  {
    resource: {
      id: 4,
      isActive: true,
      isProduct: true,
      screenId: 0,
      lens: 'cs',
    },
    title: '12 Angry Men',
    start: makeDateTime('future', {
      amount: 4,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('future', {
      amount: 4,
      unit: 'days',
      hour: 12,
      minute: 0,
    }),
  },
  {
    resource: {
      id: 5,
      isActive: false,
      isProduct: true,
      screenId: 0,
      lens: 'cs',
    },
    title: "Schindler's List",
    start: makeDateTime('today', {
      amount: 5,
      unit: 'days',
      hour: 9,
      minute: 0,
    }),
    end: makeDateTime('today', {
      amount: 5,
      unit: 'days',
      hour: 12,
      minute: 0,
    }),
  },
  {
    resource: {
      id: 6,
      isActive: true,
      isProduct: true,
      screenId: 0,
      lens: 'cs',
    },
    title: 'The Lord of the Rings: The Return of the King',
    start: makeDateTime('past', {
      amount: 1,
      unit: 'days',
      hour: 18,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 1, unit: 'days', hour: 20, minute: 0 }),
  },
  {
    resource: {
      id: 7,
      isActive: true,
      isProduct: true,
      screenId: 0,
      lens: 'cs',
    },
    title: 'Pulp Fiction',
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
      id: 8,
      isActive: true,
      isProduct: true,
      screenId: 0,
      lens: 'vv',
    },
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    start: makeDateTime('past', {
      amount: 4,
      unit: 'days',
      hour: 14,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 4, unit: 'days', hour: 16, minute: 0 }),
  },
  {
    resource: {
      id: 9,
      isActive: false,
      isProduct: true,
      screenId: 0,
      lens: 'cs',
    },
    title: 'Forrest Gump',
    start: makeDateTime('past', {
      amount: 3,
      unit: 'days',
      hour: 18,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 3, unit: 'days', hour: 20, minute: 0 }),
  },
  {
    resource: {
      id: 10,
      isActive: false,
      isProduct: true,
      screenId: 0,
      lens: 'cs',
    },
    title: 'Inception',
    start: makeDateTime('past', {
      amount: 2,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('past', {
      amount: 2,
      unit: 'days',
      hour: 12,
      minute: 0,
    }),
  },
  {
    resource: {
      id: 11,
      isActive: true,
      isProduct: true,
      screenId: 0,
      lens: 'cs',
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
      isProduct: true,
      screenId: 0,
      lens: 'cs',
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
