//connect is the connection between the store and our react component
//anything that has to do with the store is imported from redux --- anything that has to do with react and redux is imported from react-redux

import { createStore, applyMiddleware } from 'redux'; 
import reducer from './ducks/users';
import promiseMiddleware from 'redux-promise-middleware'

export default createStore( reducer, applyMiddleware( promiseMiddleware() ) );
