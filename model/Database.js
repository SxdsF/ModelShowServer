/**
 * Database
 * @author 孙博闻
 * @date 2017/2/6 下午2:56
 * @version 2.1.0
 * @moduname
 * @router
 * @desc 文件描述
 */

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/modelshow');

let ModelInfo = new mongoose.Schema({
    title      : String,
    description: String,
    cover      : String,
    images     : [String],
    createDate : {type: Date, default: Date.now}
});

let UserInfo = new mongoose.Schema({
    userName   : String,
    token      : String,
    nickName   : String,
    password   : String,
    createDate : {type: Date, default: Date.now},
    collections: [ModelInfo]
});

function modelInfo() {
    return mongoose.model('ModelInfo', ModelInfo);
}

function userInfo() {
    return mongoose.model('UserInfo', UserInfo);
}

module.exports = {
    modelInfo: modelInfo,
    userInfo : userInfo,
    ObjectId : mongoose.Types.ObjectId
};