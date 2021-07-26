const express = require('express');
const cors = require('cors');
const { post } = require('./routes/post');
const db = require('./models');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const app = express();
db.sequelize.sync()
    .then(()=>{
        console.log("db연결 성공");
    })
    .catch((err)=>{
        console.error(err);
    })

app.use(cors({
    origin : true,
}));
app.use(express.json()); //front에서 보낸 data req.body에 넣어주는 역활
app.use(express.urlencoded({extended : true})); //front에서 보낸 data req.body에 넣어주는 역활

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