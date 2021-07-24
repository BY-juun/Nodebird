import { all, fork , delay,takeLatest,put} from 'redux-saga/effects';
import axios from 'axios'


function loginAPI(data) {
    return axios.post('/api/login',data);
}


function* logIn(action) {
    try{
        yield delay(1000);
        //const result = yield call(logInAPI,action.data); // 이러면 parameter로 들어감
                       //첫번째 자리 함수 그 다음부터는 parameter
        yield put({ //put은 dispatch라고 생각
            type : 'LOG_IN_SUCCESS',
            //data : result.data //성공결과가 담긴다
            data : action.data,
        })
    }catch(error){
        yield put ({
            type : 'LOG_IN_FAILURE',
            data : error.response.data //실패결과가 담긴다
        })
    }
   
}


function* watchLogIn() {

    yield takeLatest('LOG_IN_REQUEST', logIn); //LOG_IN이라는 action이 시작될때까지 기다리겠다
}

function logOutAPI() {
    return axios.post('/api/logout');
}

function* logOut() {
    try{

        yield delay(1000);
        //const result = yield call(logInAPI)
        yield put({ //put은 dispatch라고 생각
            type : 'LOG_OUT_SUCCESS',
        })
    }catch(error){
        console.error(err);
        yield put ({
            type : 'LOG_OUT_FAILURE',
            error: err.response.data,//실패결과가 담긴다
        })
    }
   
}

//takeEvery로 하면, 실수로 버튼이 두번눌리거나 했을 때, 실제로 글이 두번올라가는 상황이 발생할 수 있다.
//이걸 막기 위해 takeLatest

//loginrequest 할 때, type은 loginrequest이고, data가 따로 있는데
//이는 login함수의 parameter로 들어간다

function* watchLogOut() {
    yield takeLatest('LOG_OUT_REQUEST',logOut);
}

export default function* userSage(){
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
    ])
}