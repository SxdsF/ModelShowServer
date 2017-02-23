/**
 * collections
 * @author 孙博闻
 * @date 2017/2/18 下午6:34
 * @version 2.1.0
 * @moduname
 * @router
 * @desc 文件描述
 */

let express  = require('express');
let Database = require('../model/Database');
let Results  = require('../utils/Results');
let router   = express.Router();


router.get('/', function (req, res, next) {
    res.end('test');
});

router.post('/details', function (req, res, next) {
    let id       = req.body.id;
    let userName = req.body.userName;
    let token    = req.body.token;

    let modelInfoModel = Database.modelInfo();
    modelInfoModel.findOne({_id: Database.ObjectId(id)}, function (err, modelInfo) {
        let result = Results.success();
        if (err) {
            res.json(result);
            res.end();
            return;
        }

        if (!modelInfo) {
            res.json(result);
            res.end();
            return;
        }

        if (userName && token) {
            let userInfoModel = Database.userInfo();
            userInfoModel.findOne({userName: userName, token: token}, function (err, userInfo) {
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

                let index = collections.findIndex((element) => {
                    return element._id.toString() === id.toString();
                });

                result.data.modelInfo   = modelInfo;
                result.data.isCollected = index > -1 ? 1 : 0;
                res.json(result);
                res.end();
            });
        } else {
            result.data.modelInfo   = modelInfo;
            result.data.isCollected = 0;
            res.json(result);
            res.end();
        }
    });
});

module.exports = router;