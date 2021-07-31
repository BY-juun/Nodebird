const express = require('express');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const router = express.Router();
const { Post, Comment, Image, User, Hashtag } = require('../models');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const image = require('../models/image');
const hashtag = require('../models/hashtag');

try {
    fs.accessSync('uploads'); // upload폴더 있는지 확인
} catch (error) {
    console.log('uploads 폴더가 없으므로 생성합니다');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) { // 제로초.png
            const ext = path.extname(file.originalname); // 확장자 추출(.png)
            const basename = path.basename(file.originalname, ext); // 제로초
            done(null, basename + '_' + new Date().getTime() + ext); // 제로초15184712891.png
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});



router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        console.log(req.body.content);
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        console.log("Hashtags : ", hashtags);
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id, // 로그인했기 때문에,  req.user가 존재함
        })

        if (hashtags) {
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() }
            }))); // [[노드, true],[익스프레스,false]]이런식
            await post.addHashtags(result.map((v) => v[0]))
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
                const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
                await post.addImages(images);
            } else { // 이미지를 하나만 올리면 image: 제로초.png
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image
            }, {
                model: Comment, //댓글 작성자
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }, {
                model: User,//작성자
                attributes: ['id', 'nickname'],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id']
            }]
        })
        res.status(201).json(fullPost);
    } catch (err) {
        console.error(err);
        next(err);
    }

});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({ //게시글 존재하는지 확인
            where: { id: req.params.postId }
        })
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다');
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId, 10),
            UserId: req.body.userId,
        })
        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }]
        })
        res.status(201).json(fullComment);
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { //patch post/1/like
    try {
        const post = await Post.findOne({ where: { id: req.params.postId } })
        if (!post) {
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }
        await post.addLikers(req.user.id); //관계함수
        res.json({ postId: post.id, UserId: req.user.id });
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.patch('/:postId/unlike', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } })
        if (!post) {
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }
        await post.removeLikers(req.user.id);
        res.json({ postId: post.id, UserId: req.user.id });
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
    try {
        await Post.destroy({
            where: { id: req.params.postId },
            UserId: req.user.id
        });
        res.json({ PostId: parseInt(req.params.postId) });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // POST /post/images
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
});


router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({ //게시글 존재하는지 확인
            where: { id: req.params.postId },
            include : [{
                model : Post,
                as : 'Retweet',
            }]
        })
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다');
        }
        if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) //자기게시글을 리트윗하려고하는경우 , 리트윗한걸 다시 리트윗
        {
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다');
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where : {
                UserId : req.user.id,
                RetweetId : retweetTargetId,
            }
        });
        if(exPost){
            return res.status(403).send('이미 리트윗했습니다');
        }

        const retweet = await Post.create({
            UserId : req.user.id,
            RetweetId : retweetTargetId,
            content : 'retweet',
        });
        const retweetWithPrevPost = await Post.findOne({
            where : {id : retweet.id},
            include : [{
                model : Post,
                as : 'Retweet',
                include : [{
                    model : User,
                    attributes : ['id','nickname']
                },{
                    model : Image,
                }]
            },{
                model : User,
                attributes : ['id','nickname']
            },{
                model : Image
            },{
                model : Comment,
                include : [{
                    model : User,
                    attributes : ['id','nickname']
                }]
            },{
                model : User,
                as : 'Likers',
                attributes : ['id'],
            }]
        })
        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
})

module.exports = router;

