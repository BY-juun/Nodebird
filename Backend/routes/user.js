const express = require('express');
const bcrypt = require('bcrypt');
const { User,Post } = require('../models');
const passport = require('passport');
const db = require('../models');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const e = require('express');

router.get('/',async(req,res,next)=>{
    try{
        if(req.user) //새로고침해도 로그인 유지되도록
        {
            const user = await User.findOne({
                where : {id : req.user.id}
            });
            const fullUserWithoutPassword = await User.findOne({
                where : {id : user.id},
                attributes : {
                    exclude : ['password']
                },
                include : [{
                    model : Post, //hasMany관계여서 front에서는 Posts로 사용할 수 있다.
                    attributes : ['id']
                },{
                    model : User,
                    as : 'Followings',
                    attributes : ['id']
                },{
                    model : User,
                    as : 'Followers',
                    attributes : ['id']
                }]
            });
            return res.status(200).json(fullUserWithoutPassword);
        }else {
            res.status(200).json(null);
        }
        
    }catch(error){
        console.error(error);
        next(error);
    }
    
})

router.post('/login', isNotLoggedIn ,(req,res,next) => {
    passport.authenticate('local', (err,user,info)=>{
        if(err){
            console.error(err);
            return next(err);
        }
        if(info){ //client error
            res.status(401).send(info.reason);
        }
        return req.login(user, async(loginErr) => {
            if (loginErr) {
              console.error(loginErr);
              return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where : {id : user.id},
                attributes : {
                    exclude : ['password']
                },
                include : [{
                    model : Post, //hasMany관계여서 front에서는 Posts로 사용할 수 있다.
                },{
                    model : User,
                    as : 'Followings'
                },{
                    model : User,
                    as : 'Followers'
                }]
            });
            return res.status(200).json(fullUserWithoutPassword);
          });
    })(req,res,next);
});

router.post('/logout',isLoggedIn ,(req,res,next)=>{
    req.logout();
    req.session.destroy();
    res.send('ok');
})

router.post('/', isNotLoggedIn ,async (req, res, next) => {
    try { //await하는애들은 비동기니까 try catch로 감싸기
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        })
        if (exUser) {
            return res.status(403).send('이미 사용 중인 아이디 입니다');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({ //await 안넣어주면, 비동기이기 때문에, 뒤에 res.json()이 먼저실행될수도있음.
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        })
        res.status(200).send('ok')


    } catch (error) {
        console.error(error);
        next(error);
    }

});

module.exports = router;

