import {createStore,combineReducers,applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import { blogsReducer } from '../reducers/blogsReducer'
import { usersReducer } from '../reducers/usersReducer'
import { commentsReducer } from '../reducers/commentsReducer'
const rootReducer={
    blogs:blogsReducer,
    user:usersReducer,
    comments:commentsReducer
}

export const configureStore=()=>{
    const store=createStore(combineReducers(rootReducer),applyMiddleware(thunk))
    return store
}