const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
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

