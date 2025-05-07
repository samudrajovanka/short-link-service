const isErrorNeon = (error: Error) => {
  return error.name === 'NeonDbError'
}