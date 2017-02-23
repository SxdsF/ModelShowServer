let express    = require('express');
let Database   = require('../model/Database');
let crypto     = require('crypto');
let Results    = require('../utils/Results');
let router     = express.Router();
const pageSize = 10;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
    let userName      = req.body.userName;
    let password      = req.body.password;
    let userInfoModel = Database.userInfo();
    userInfoModel.findOne({userName: userName}, function (err, userInfo) {
        let result = Results.success();
        if (err) {
            result.data.status  = 0;//0是注册失败，1是注册成功
            result.data.message = '注册失败';
            res.json(result);//给客户端返回一个json格式的数据
            res.end();
            return;
        }

        if (userInfo && userInfo.userName) {
            result.data.status  = 0;//0是注册失败，1是注册成功
            result.data.message = '账号已注册过';
            res.json(result);//给客户端返回一个json格式的数据
            res.end();
            return;
        }

        let hash = crypto.createHash('md5');
        hash.update(password);
        let newUser = {
            userName: userName,
            password: hash.digest('hex'),
        };
        userInfoModel.create(newUser, function (err) {
            result.data.status  = err ? -1 : 1;//0是注册失败，1是注册成功
            result.data.message = err ? '注册失败' : '注册成功';
            res.json(result);//给客户端返回一个json格式的数据
            res.end();
        });
    });
});

router.post('/login', function (req, res, next) {
    let userName = req.body.userName;
    let password = req.body.password;
    let hash     = crypto.createHash('md5');
    hash.update(password);
    let select        = {
        userName: userName,
        password: hash.digest('hex'),
    };
    let userInfoModel = Database.userInfo();
    userInfoModel.findOne(select, function (err, userInfo) {
        let result = Results.success();
        if (err) {
            result.data.status  = 0;//0是登录失败，1是登录成功
            result.data.message = '登录失败';
            res.json(result);
            res.end();
            return;
        }

        if (!userInfo) {
            result.data.status  = 0;//0是登录失败，1是登录成功
            result.data.message = '用户名或密码错误';
            res.json(result);
            res.end();
            return;
        }

        let token = new Date().getTime().toString();
        token     = crypto.createHash('md5').update(token).digest('hex');

        let update = {$set: {token: token}};
        userInfoModel.updateOne(select, update, function (err) {
            if (err) {
                result.data.status  = 0;//0是登录失败，1是登录成功
                result.data.message = '登录失败';
                res.json(result);
                res.end();
                return;
            }

            result.data.status  = 1;//0是登录失败，1是登录成功
            result.data.message = '登录成功';
            result.data.token   = token;
            res.json(result);
            res.end();
        });
    });
});

router.post('/logout', function (req, res, next) {
    let userName = req.body.userName;
    let token    = req.body.token;
    let select   = {
        userName: userName,
        token   : token,
    };

    let userInfoModel = Database.userInfo();
    userInfoModel.findOne(select, function (err, userInfo) {
        let result = Results.success();
        if (err) {
            result.data.status  = 0;//0是退出登录失败，1是退出登录成功
            result.data.message = '退出登录失败';
            res.json(result);
            res.end();
            return;
        }

        if (!userInfo) {
            result.data.status  = 0;//0是退出登录失败，1是退出登录成功
            result.data.message = '账户信息错误';
            res.json(result);
            res.end();
            return;
        }

        let update = {$set: {token: ''}};
        userInfoModel.updateOne(select, update, function (err) {
            if (err) {
                result.data.status  = 0;//0是退出登录失败，1是退出登录成功
                result.data.message = '退出登录失败';
                res.json(result);
                res.end();
                return;
            }

            result.data.status  = 1;//0是退出登录失败，1是退出登录成功
            result.data.message = '退出登录成功';
            res.json(result);
            res.end();
        });
    });
});

router.post('/collect', function (req, res, next) {
    let userName    = req.body.userName;
    let token       = req.body.token;
    let id          = req.body.id;
    let isCollected = req.body.isCollected;
    let select      = {
        userName: userName,
        token   : token,
    };

    let userInfoModel = Database.userInfo();
    userInfoModel.findOne(select, function (err, userInfo) {
        let result = Results.success();
        if (err) {
            result.data.status  = 0;//0是收藏失败，1是收藏成功
            result.data.message = '操作失败';
            res.json(result);
            res.end();
            return;
        }

        if (!userInfo) {
            result.data.status  = 0;//0是收藏失败，1是收藏成功
            result.data.message = '操作失败';
            res.json(result);
            res.end();
            return;
        }

        let modelInfoModel = Database.modelInfo();
        modelInfoModel.findOne({_id: Database.ObjectId(id)}, function (err, modelInfo) {
            if (err) {
                result.data.status  = 0;//0是收藏失败，1是收藏成功
                result.data.message = '操作失败';
                res.json(result);
                res.end();
                return;
            }

            if (!modelInfo) {
                result.data.status  = 0;//0是收藏失败，1是收藏成功
                result.data.message = '操作失败';
                res.json(result);
                res.end();
                return;
            }

            let collections = userInfo.collections;

            let index = collections.findIndex((element) => {
                return element._id.toString() === id.toString();
            });
            if (index < 0) {
                if (isCollected === 1) {
                    collections.push(modelInfo);
                }
            } else {
                if (isCollected !== 1) {
                    collections.splice(index, 1);
                }
            }

            let update = {$set: {collections: collections}};
            userInfoModel.updateOne(select, update, function (err) {
                if (err) {
                    result.data.status  = 0;//0是收藏失败，1是收藏成功
                    result.data.message = '操作失败';
                    res.json(result);
                    res.end();
                    return;
                }

                result.data.status  = 1;//0是收藏失败，1是收藏成功
                result.data.message = '操作成功';
                res.json(result);
                res.end();
            });
        });
    });
});

router.post('/collections', function (req, res, next) {
    let userName = req.body.userName;
    let token    = req.body.token;
    let page     = req.body.page;

    let userInfoModel = Database.userInfo();

    userInfoModel.findOne({userName: userName, token: token}, function (err, userInfo) {
        let result = Results.success();
        if (err) {
            res.json(result);
            res.end();
            return;
        }

        if (!userInfo) {
            res.json(result);
            res.end();
            return;
        }

        let collections = userInfo.collections;
        let start       = (page - 1) * pageSize;
        if (collections.length - start > pageSize) {
            result.data.list = collections.slice(start, start + pageSize);
            result.data.more = 1;
        } else {
            result.data.list = collections.slice(start);
            result.data.more = 0;
        }
        res.json(result);
        res.end();
    });
});

module.exports = router;
