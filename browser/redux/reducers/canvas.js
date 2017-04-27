let initialState = {}

export default (prevState = initialState, action) => {
  let newState = Object.assign({}, prevState)
  switch (action.type) {
    case 'test':
      return newState
    default:
      return newState
  }
}