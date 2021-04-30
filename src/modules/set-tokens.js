import cookie from 'react-cookies'
import moment from 'moment'
import fetch from './fetch-with-headers'
import getApiUrl from './get-api-url'
import handleError from './handle-error'

function setUserCookies () {
  fetch(`${getApiUrl()}me/?format=json`)
    .then(data => data.json())
    .then((meJson) => {
      const expires = new Date(moment().add(6, 'months').toDate())
      if (meJson.id) {
        cookie.save('userId', meJson.player.id, { path: '/', secure: !process.env.NODE_ENV === 'development', expires })
        cookie.save('name', meJson.first_name, { path: '/', secure: !process.env.NODE_ENV === 'development', expires })
      }
    })
    .catch(handleError)
}

export default setUserCookies
