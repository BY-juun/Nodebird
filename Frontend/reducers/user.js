export const initialState = {
    isLoggedIn: false,
    me: null,
    signUpData: {},
    loginData: {},
}


export const loginRequsetAction = (data) => {
    return {
        type: 'LOG_IN_Request',
        data,
    }
}
export const loginSuccessAction = (data) => {
    return {
        type: 'LOG_IN_Success',
        data,
    }
}
export const loginFailureAction = (data) => {
    return {
        type: 'LOG_IN_Failure',
        data,
    }
}

export const logoutRequestAction = () => {
    return {
        type: 'LOG_OUT_Request',
    }
}
export const logoutSuccessAction = () => {
    return {
        type: 'LOG_OUT_Success',
    }
}
export const logoutFailureAction = () => {
    return {
        type: 'LOG_OUT_Failure',
    }
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN_Request':
            return {
                ...state,
                isLoggedIn: true,
                me: action.data
            }

        case 'LOG_OUT_Request':
            return {
                ...state,
                isLoggedIn: false,
                me: null,
            }
        default:
            return state;
    }
}
export default reducer;