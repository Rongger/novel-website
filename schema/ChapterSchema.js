var mongoose = require('mongoose');

var chapterSchema = new mongoose.Schema({
	'contents': Object,
})

module.exports = chapterSchema;