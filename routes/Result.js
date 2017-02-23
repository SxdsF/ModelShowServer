/**
 * .Result
 * @author 孙博闻
 * @date 2017/2/4 下午5:26
 * @desc 文件描述
 */

let Result = function (code, message, data) {
    this.code = code;
    this.message = message;
    this.data = data;
};

module.exports = Result;