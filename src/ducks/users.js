// reducer + action creator methods

import axios from 'axios';

const initialState = {
    user: {}            //when someone authenticates, info is being sent back as an object
}


const GET_USER_INFO = 'GET_USER_INFO'; //stored in variable to help with debugging... if you mispell a string => no error... mispell a var => error


export function getUserInfo() {  //action creator --> returns an object
    const userData = axios.get('/auth/me')
            .then(res => {
                return res.data
            })

    return {
        type: GET_USER_INFO,
        payload: userData
    }
}

export default function reducer( state = initialState, action ) {  //state = initialState --> if state is ever undefined, it's value will be initial state... if state is defined, initialState will be ignored
    switch(action.type) {
        case GET_USER_INFO + '_FULFILLED':  //can also be PENDING but we only really care about when the action has been fulfilled 
            return Object.assign( {}, state, { user: action.payload })

        default:
            return state;
    }
}