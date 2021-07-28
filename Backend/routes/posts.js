const express = require('express');
const { Post,User,Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            limit : 10, //10개만 가져와라.

            //offset : 0, //시작점 1번부터 10번까지 offset : 10이면 11부터 20까지
            order : [
                ['createdAt','DESC'],
                [Comment, 'createdAt', 'DESC']
            ], //최신 작성된것부터 가져온다.
            include : [{
                model : User,
                attributes : ['id','nickname']
            },{
               model : Image, 
            },{
                model : Comment,
                include : [
                    {
                        model : User,
                        attributes : ['id','nickname']
                    }
                ]
            },{
                model : User,
                as : 'Likers',
                attributes : ['id'],
            }]
        });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        next(err);
    }

});

module.exports = router;