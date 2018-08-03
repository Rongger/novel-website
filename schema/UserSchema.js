var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	sex: Boolean,
	isAuthor: Boolean,
	star: Array,
	myNovels: Array,
}, {usePushEach: true});

module.exports = userSchema;



