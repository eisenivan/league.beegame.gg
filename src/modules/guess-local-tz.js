import moment from 'moment-timezone'
import { DATE_TIME_FORMAT } from '../constants'

function guessLocalTz (startTime) {
  return moment.utc(startTime).tz(moment.tz.guess())
}

export function formatTime (startTime) {
  return guessLocalTz(startTime).format('h:mm A z')
}

export function formatDateTime (startTime) {
  return guessLocalTz(startTime).format(DATE_TIME_FORMAT)
}

export default guessLocalTz
