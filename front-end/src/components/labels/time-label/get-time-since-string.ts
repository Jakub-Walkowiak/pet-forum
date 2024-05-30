const getTimeSinceString = (date: Date) => {
  const since = Date.now() - date.getTime()

  const ONE_SECOND = 1000
  const ONE_MINUTE = 60 * ONE_SECOND
  const ONE_HOUR = 60 * ONE_MINUTE
  const ONE_DAY = 24 * ONE_HOUR
  const ONE_MONTH = 30 * ONE_DAY
  const ONE_YEAR = 365 * ONE_DAY

  if (since < ONE_MINUTE) return `${Math.floor(since / ONE_SECOND)}s`
  else if (since < ONE_HOUR) return `${Math.floor(since / ONE_MINUTE)}min`
  else if (since < ONE_DAY) return `${Math.floor(since / ONE_HOUR)}h`
  else if (since < ONE_MONTH) return `${Math.floor(since / ONE_DAY)}d`
  else if (since < ONE_YEAR) return `${Math.floor(since / ONE_MONTH)}mos`
  else return `${Math.floor(since / ONE_YEAR)}yrs`
}

export default getTimeSinceString
