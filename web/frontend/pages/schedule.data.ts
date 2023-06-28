import { Event } from 'react-big-calendar'
import moment from 'moment-timezone'

export type Movie = Event & {
  id: number
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
    id: 1,
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
    id: 2,
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
    id: 3,
    title: 'The Dark Knight',
    start: makeDateTime('today', { hour: 18, minute: 0 }),
    end: makeDateTime('today', { hour: 20, minute: 0 }),
  },
  {
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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
