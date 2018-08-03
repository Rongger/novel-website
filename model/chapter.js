var mongoose = require("mongoose");
var ChapterSchema = require("../schema/ChapterSchema");

var Chapter = mongoose.model('chapter', ChapterSchema);

module.exports = Chapter;