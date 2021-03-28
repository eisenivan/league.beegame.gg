function getApiUrl () {
  return (process.env.REACT_APP_STAGE === 'true')
    ? 'https://api-staging.beegame.gg/'
    : 'https://api.beegame.gg/'
}

export default getApiUrl
