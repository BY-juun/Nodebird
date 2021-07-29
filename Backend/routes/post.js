const express = require('express');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares')
const router = express.Router();
const {Post, Comment, Image, User} =  require('../models');

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
                model : Comment, //댓글 작성자
                include : [{
                    model : User,
                    attributes : ['id','nickname'],
                }]
            },{
                model : User,//작성자
                attributes : ['id','nickname'],
            },{
                model : User, // 좋아요 누른 사람
                as : 'Likers',
                attributes : ['id']
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
            PostId : parseInt(req.params.postId,10),
            UserId : req.body.userId,
        })
        const fullComment = await Comment.findOne({
            where : {id : comment.id},
            include : [{
                model : User,
                attributes : ['id','nickname'],
            }]
        })
        res.status(201).json(fullComment);
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.patch('/:postId/like',isLoggedIn,async(req,res,next)=>{ //patch post/1/like
    try{
        const post = await Post.findOne({where : {id : req.params.postId}})
        if(!post){
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }
        await post.addLikers(req.user.id); //관계함수
        res.json({postId : post.id, UserId : req.user.id});
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.patch('/:postId/unlike',isLoggedIn,async(req,res,next)=>{
    try{
        const post = await Post.findOne({where : {id : req.params.id}})
        if(!post){
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }
        await post.removeLikers(req.user.id);
        res.json({postId : post.id, UserId : req.user.id});
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.delete('/:postId',isLoggedIn,async(req,res,next)=>{
    try {
        await Post.destroy({
            where : {id : req.params.postId},
            UserId : req.user.id
        });
        res.json({PostId : parseInt(req.params.postId)});
    }catch(err){
        console.error(err);
        next(err);
    }
});



module.exports = router; 

