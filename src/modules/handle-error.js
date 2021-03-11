function handleError (e) {
  console.warn(e)
  return new Response(JSON.stringify({ // eslint-disable-line
    code: 400,
    message: 'Stupid network Error'
  }))
}

export default handleError
