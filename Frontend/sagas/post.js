import { all, fork , delay,takeLatest,put} from 'redux-saga/effects';
import axios from 'axios'

function addPostAPI(data) {
    return axios.post('/api/post',data);
}

function* addPost(action) {
    try{
        yield delay(1000);
        //const result = yield call(logInAPI,action.data)
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

function* watchAddPost() {
    yield takeLatest('ADD_POST_REQUEST',addPost);
} //eventlistner와 비슷

export default function* postSage(){
    yield all([
        fork(watchAddPost),
    ])
}