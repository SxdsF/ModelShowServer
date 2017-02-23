let express    = require('express');
let Database   = require('../model/Database');
let Results    = require('../utils/Results');
let router     = express.Router();
const pageSize = 10;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/index', (req, res, next) => {
    let page  = req.body.page;
    let query = Database.modelInfo().find({}, ['_id', 'title', 'cover']);
    query.skip((page - 1) * pageSize);
    query.limit(pageSize);
    query.exec(function (err, modelInfo) {
        let result = Results.success();
        if (!err) {
            result.data.list = modelInfo;
            result.data.more = result.data.list.length === pageSize ? 1 : 0;
        }
        res.json(result);//给客户端返回一个json格式的数据
        res.end();
    });
});

module.exports = router;
