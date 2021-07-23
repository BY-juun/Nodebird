export const initialState = {
    mainPosts:
        [{
            id: 1,
            User:
            {
                id: 1,
                nickname: '병준'
            },
            content: "첫번째 게시글 #hashtag #express",
            Images:
                [{
                    src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
                }, {
                    src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
                }, {
                    src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
                }],
            Comments:
                [{
                    User: {
                        nickname: 'nero',
                    },
                    content: '우와 개정판이 나왔군요~',
                }, {
                    User: {
                        nickname: 'hero',
                    },
                    content: '얼른 사고싶어요~',
                }]
        }],
    imagePaths: [],
    postAdded: false,
}

const ADD_POST = 'ADD_POST';
export const addPost = {
    type: ADD_POST
};

const dummyPost = {
    id: 2,
    content: '더미데이터입니다.',
    User: {
        id: 1,
        nickname: '제로초',
    },
    Images: [],
    Comments: [],
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                mainPosts : [dummyPost, ...state.mainPosts], //앞에다 추가해야 위로올라옴
                postAdded : true,
            }
        default:
            return state;
    }
}

export default reducer;