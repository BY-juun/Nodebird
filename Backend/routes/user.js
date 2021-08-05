const express = require('express');
const bcrypt = require('bcrypt');
const { User,Post,Image,Comment } = require('../models');
const passport = require('passport');
const db = require('../models');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Op} = require('sequelize');

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

router.get('/:id/posts', async (req, res, next) => { // GET /user/1/posts
    try {
      const user = await User.findOne({ where: { id: req.params.id }});
      if (user) {
        const where = {};
        if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
          where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
        } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
        const posts = await user.getPosts({
          where,
          limit: 10,
          include: [{
            model: Image,
          }, {
            model: Comment,
            include: [{
              model: User,
              attributes: ['id', 'nickname'],
            }]
          }, {
            model: User,
            attributes: ['id', 'nickname'],
          }, {
            model: User,
            through: 'Like',
            as: 'Likers',
            attributes: ['id'],
          }, {
            model: Post,
            as: 'Retweet',
            include: [{
              model: User,
              attributes: ['id', 'nickname'],
            }, {
              model: Image,
            }]
          }],
        });
        console.log(posts);
        res.status(200).json(posts);
      } else {
        res.status(404).send('존재하지 않는 사용자입니다.');
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => { // DELETE /user/follower/2
    try {
      const user = await User.findOne({ where: { id: req.params.userId }});
      if (!user) {
        res.status(403).send('없는 사람을 차단하려고 하시네요?');
      }
      await user.removeFollowings(req.user.id);
      res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

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

router.patch('/nickname',isLoggedIn,async(req,res,next)=>{
    try{
        await User.update({
            nickname : req.body.nickname,   
        },{
            where : {id : req.user.id},
        })
        res.status(200).json({nickname : req.body.nickname});
    }catch(err){
        console.error(err);
        next(err);
    }
})


router.patch('/:userId/follow',isLoggedIn,async(req,res,next)=>{
    try{
        const user = await User.findOne({where : {id : req.params.userId}});
        if(!user)
        {
            res.status(403).send("존재하지 않는 사용자입니다");
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({UserId : parseInt(req.params.userId)});
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.delete('/:userId/follow',isLoggedIn,async(req,res,next)=>{
    try{
        const user = await User.findOne({where : {id : req.params.userId}});
        if(!user)
        {
            res.status(403).send("존재하지 않는 사용자입니다");
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({UserId : parseInt(req.params.userId)});
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/followers',isLoggedIn,async(req,res,next)=>{  //follower 불러오기
    try{
        const user = await User.findOne({where : {id : req.user.id}});
        if(!user)
        {
            res.status(403).send("존재하지 않는 사용자입니다");
        }
        const followers = await user.getFollowers({
            limit : parseInt(req.query.limit,10)
        });
        res.status(200).json(followers);
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/followings',isLoggedIn,async(req,res,next)=>{  //follower 불러오기
    try{
        const user = await User.findOne({where : {id : req.user.id}});
        if(!user)
        {
            res.status(403).send("존재하지 않는 사용자입니다");
        }
        const followings = await user.getFollowings({
            limit : parseInt(req.query.limit,10)
        });
        res.status(200).json(followings);
    }catch(err){
        console.error(err);
        next(err);
    }
})
module.exports = router;

