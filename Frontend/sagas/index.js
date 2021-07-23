import {all,fork,call,put, take,put} from 'redux-saga/effects';
import axios from 'axios'

function loginAPI(data) {
    return axios.post('/api/login',data);
}

function* logIn(action) {
    try{
        yield put({
            type: 'LOGIN_IN_REQUEST',
            data : result.data,
        })
        const result = yield call(logInAPI,action.data); // 이러면 parameter로 들어감
                            //첫번째 자리 함수 그 다음부터는 parameter
        yield put({ //put은 dispatch라고 생각
            type : 'LOG_IN_SUCCESS',
            data : result.data //성공결과가 담긴다
        })
    }catch(error){
        yield put ({
            type : 'LOG_IN_FAILURE',
            data : error.response.data //실패결과가 담긴다
        })
    }
   
}

function logOutAPI() {
    return axios.post('/api/logout');
}

function* logOut() {
    try{
        yield put({
            tpye: 'LOGIN_OUT_REQUEST',
            data : result.data,
        })
        const result = yield call(logInAPI)
        yield put({ //put은 dispatch라고 생각
            type : 'LOG_OUT_SUCCESS',
            data : result.data //성공결과가 담긴다
        })
    }catch(error){
        yield put ({
            type : 'LOG_OUT_FAILURE',
            data : error.response.data //실패결과가 담긴다
        })
    }
   
}

function addPostAPI(data) {
    return axios.post('/api/post',data);
}

function* addPost(action) {
    try{
        yield put({
            tpye: 'ADD_POST_REQUEST',
            data : result.data,
        })
        const result = yield call(logInAPI,action.data)
        yield put({ //put은 dispatch라고 생각
            type : 'ADD_POST_SUCCESS',
            data : result.data //성공결과가 담긴다
        })
    }catch(error){
        yield put ({
            type : 'ADD_POST_FAILURE',
            data : error.response.data //실패결과가 담긴다
        })
    }
   
}

function* watchLogin() {
    yield take('LOG_IN_REQUEST', logIn); //LOG_IN이라는 action이 시작될때까지 기다리겠다
}
//loginrequest 할 때, type은 loginrequest이고, data가 따로 있는데
//이는 login함수의 parameter로 들어간다

function* watchLogOut() {
    yield take('LOG_OUT_REQUEST',logOut);
}

function* watchAddPost() {
    yield take('ADD_POST',addPost);
} //eventlistner와 비슷

//rootsaga를 만들고 거기에 만들고싶은 비동기action들을 넣어준다
export default function* rootSaga() { //중단점이 있는 함수
    yield all([ //all은 배열을 받음 > 동시에 실행
       fork(watchLogin), //fork는 함수 실행
       fork(watchLogOut), //call(동기함수호출)과 fork(비동기함수호출)는 다르다.
       fork(watchAddPost),
    ]);
}