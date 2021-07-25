const express = require('express');
const { post } = require('./routes/post');
const db = require('./models');


const app = express();
db.sequelize.sync()
    .then(()=>{
        console.log("db연결 성공");
    })
    .catch((err)=>{
        console.error(err);
    })

const postRouter = require('./routes/post');

app.use('/post',postRouter);

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