import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  canvas: require('./canvas').default
})

export default rootReducer