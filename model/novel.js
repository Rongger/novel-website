var mongoose = require('mongoose');
var NovelSchema = require('../schema/NovelSchema');
var Novel = mongoose.model('novel', NovelSchema);

// Novel.prototype.save = function(obj, callback) {
// 	var instance = new Novel(obj);
// 	instance.save(function(err){
// 		callback(err);
// 	})
// };

module.exports = Novel;