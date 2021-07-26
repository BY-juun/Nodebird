const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const db = require('./models');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const passportConfig = require('./passport');


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
}));

app.use(express.json()); //front에서 보낸 data req.body에 넣어주는 역활
app.use(express.urlencoded({extended : true})); //front에서 보낸 data req.body에 넣어주는 역활
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret : process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/post',postRouter);
app.use('/user',userRouter);

app.get('/',(req,res)=>{
    res.send("오랜만이야 backend")
});

app.post('/api/post',(req,res)=>{
    res.json({id : 1, content : 'hello'});
});

app.delete('/api/post',(req,res)=>{
    res.json({id : 1});
});

app.listen(3065,()=>{
    console.log("서버 실행 중");
})