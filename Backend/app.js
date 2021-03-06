const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const multer = require('multer')
const db = require('./models');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const passportConfig = require('./passport');
const path = require('path');

dotenv.config();
const app = express();
db.sequelize.sync()
    .then(()=>{
        console.log("db연결 성공");
    })
    .catch((err)=>{
        console.error(err);
    })

passportConfig();

app.use(cors({
    origin : true,
    credentials :true , //이걸 해줘야 cookie도 같이 보낼 수 있다.
}));
app.use(morgan('dev'));
app.use('/',express.static(path.join(__dirname,'uploads')));
app.use(express.json()); //front에서 보낸 data req.body에 넣어주는 역활 axios에서 데이터 보낼 때 받는 역할
app.use(express.urlencoded({extended : true})); //front에서 보낸 data req.body에 넣어주는 역활 일반 form에서 보낼 때 받는 역할
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret : process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/posts',postsRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);
app.use('/hashtag',hashtagRouter);


app.listen(3065,()=>{
    console.log("서버 실행 중");
})