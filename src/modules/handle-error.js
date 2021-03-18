function handleError (e, setter) {
  if (setter && typeof setter === 'function') {
    setter(e)
  } else {
    console.warn(e)
  }
}

export default handleError
