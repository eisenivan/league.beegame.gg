import moment from 'moment-timezone'

function guessLocalTz (startTime) {
  return moment.utc(startTime).tz(moment.tz.guess())
}

export default guessLocalTz
