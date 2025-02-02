export const allReminders = [
  {
    title: '5m',
    value: 5*60*1000,
  },
  {
    title: '10m',
    value: 10*60*1000,
  },
  {
    title: '15m',
    value: 15*60*1000,
  },
  {
    title: '30m',
    value: 30*60*1000,
  },
  {
    title: '1h',
    value: 1*60*60*1000,
  },
  {
    title: '2h',
    value: 2*60*60*1000,
  },
  {
    title: '1d',
    value: 24*60*60*1000,
  },
]

const objectsEqual = (o1, o2) => {
  return typeof o1 === 'object' && Object.keys(o1).length > 0 
      ? Object.keys(o1).length === Object.keys(o2).length 
          && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
      : o1 === o2;
}

export const arraysEqual = (a1, a2) => a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));