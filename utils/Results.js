/**
 * ResultUtils
 * @author 孙博闻
 * @date 2017/2/17 下午6:18
 * @version 0.0.1
 * @moduname
 * @router
 * @desc 返回值工具
 */
let Result = require('../routes/Result');
let Data   = require('../routes/Data');

function failure() {
    return new Result(0, '请求失败', new Data());
}

function success() {
    return new Result(1, '请求成功', new Data());
}

module.exports = {
    failure: failure,
    success: success
};