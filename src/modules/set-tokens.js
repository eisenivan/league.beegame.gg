import cookie from 'react-cookies'
import fetch from './fetch-with-headers'
import getApiUrl from './get-api-url'
import handleError from './handle-error'

function setUserCookies () {
  fetch(`${getApiUrl()}me/?format=json`)
    .then(data => data.json())
    .then((meJson) => {
      if (meJson.id) {
        cookie.save('userId', meJson.player.id, { path: '/', secure: !process.env.NODE_ENV === 'development' })
        cookie.save('name', meJson.first_name, { path: '/', secure: !process.env.NODE_ENV === 'development' })
      }
    })
    .catch(handleError)
}

export default setUserCookies
