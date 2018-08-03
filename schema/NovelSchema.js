var mongoose = require("mongoose");

var novelSchema = new mongoose.Schema({
	'name': String,
	'author': String,
	'intro': String,
	'lastdate': String,
	'chapterNow': Number,
	'category': String,
	'chapter_id': String,
	'starNum': Number,
	'clickNum': Number,
	'finished': Boolean,	//是否完结
	'viewsNum': Number,
	'views': Object,
	'imgURL': String,
});

module.exports = novelSchema;
