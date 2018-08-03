var mongoose = require('mongoose');
var UserSchema = require('../schema/UserSchema');
var User = mongoose.model('user', UserSchema);

module.exports = User;