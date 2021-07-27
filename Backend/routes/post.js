const express = require('express');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares')
const router = express.Router();
const {Post, Comment, Image} =  require('../models');

router.post('/',isLoggedIn,async(req,res,next)=>{
    try{
        const post = await Post.create({
            content : req.body.content,
            UserId : req.user.id, // 로그인했기 때문에,  req.user가 존재함
        })
        const fullPost = await Post.findOne({
            where : {id : post.id},
            include : [{
                model : Image
            }, {
                model : Comment
            },{
                model : User
            }]
        })
        res.status(201).json(fullPost);
    }catch(err){
        console.error(err);
        next(err);
    }
    
});

router.post('/:postId/comment',isLoggedIn, async(req,res,next)=>{
    try{
        const post = await Post.findOne({ //게시글 존재하는지 확인
            where : {id : req.params.postId}
        })
        if(!post) {
            return res.status(403).send('존재하지 않는 게시글입니다');
        }
        const comment = await Comment.create({
            content : req.body.content,
            PostId : req.params.postId,
            UserId : req.body.userId,
        })
        res.status(201).json(comment);
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.delete('/',(req,res)=>{
    res.json({id : 1});
});



module.exports = router; 

