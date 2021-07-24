export const initialState = {
    isLoggingIn : false, // 로그인 시도 중 true면 loading창을 띄어놓도록
    isLoggedIn: false,
    isLoggingOut : false,
    me: null,
    signUpData: {},
    loginData: {},
}


export const loginRequsetAction = (data) => {
    return {
        type: 'LOG_IN_REQUEST',
        data,
    }
}

export const logoutRequestAction = () => {
    return {
        type: 'LOG_OUT_REQUEST',
    }
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN_REQUEST':
            return {
                ...state,
                isLoggingIn: true,
            }
        case 'LOG_IN_SUCCESS': //saga가 호출
            return {
                ...state,
                isLoggingIn : false,
                isLoggedIn: true,
                me: {...action.data, nickname : 'byJuun'}
            }
        case 'LOG_IN_FAILURE': //saga가 호출
            return {
                ...state,
                isLoggingIn : false,
                isLoggedIn : false,
            }



        case 'LOG_OUT_REQUEST':
            return {
                ...state,
                isLoggingOut: true,
            }
        case 'LOG_OUT_SUCCESS': //saga가 호출
            return {
                ...state,
                isLoggingOut : false,
                isLoggedIn: false,
                me: null,
            }
        case 'LOG_OUT_FAILURE': //saga가 호출
            return {
                ...state,
                isLoggingOut : false,
            }
        default:
            return state;
    }
}
export default reducer;