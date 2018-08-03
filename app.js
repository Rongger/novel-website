var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var util = require('util');
var bodyParser = require('body-parser');
var port = process.env.PORT || 4000;
var session = require('express-session');  
var cookieParser = require('cookie-parser');  
var moment = require('moment');
var funs = require('./function.js');

var app = express();

mongoose.Promise = global.Promise; 
var DB_URL = 'mongodb://localhost:27017/test';
mongoose.connect(DB_URL, {useMongoClient: true});
var User = require('./model/user');
var Novel = require('./model/novel');
var Chapter = require('./model/chapter');

mongoose.connection.on('connected', function(){
	console.log('Mongoose connection open to ' + DB_URL);
});
mongoose.connection.on('error', function(err){
	console.log('Mongoose connection error:  ' + err);
});
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
}); 

app.set('views', __dirname + '/views/pages');		//设置视图默认路径
// app.engine('.html', require('pug').__express);	
app.set('view engine', 'pug');		//设置模板引擎

app.use(express.static(__dirname + '/public'));	//负责托管静态资源
app.use(bodyParser.urlencoded({extended: false})); //使用中间件
app.use(bodyParser.json());

app.use(cookieParser());  
app.use(session({  
  resave: true, // don't save session if unmodified  
  saveUninitialized: false, // don't create session until something stored  
  secret: 'love'  
}));  

app.listen(port);
console.log('port: ' + port);

/* 首页 */ 
app.get('/', function(req, res){	
	// console.log(req.session.user);
	var user = '',userId = '';
	if(req.session.user){
		user = req.session.user.username,	
		userId = req.session.user.userId;
		var isLogined = !!user;
	}
	Novel.find({category: '穿越小说'}, function(e, cyxs_novel){
		Novel.find({category: '历史架空'}, function(e, lsjk_novel){
			Novel.find({category: '仙侠幻想'}, function(e, xxhx_novel){
				Novel.find({category: '重生小说'}, function(e, csxs_novel){
					Novel.find({}, null, {limit: 10, sort:{"clickNum":-1}}, function(e, clicknovels){			
						Novel.find({}, null, {limit: 10, sort:{"lastdate":-1}}, function(e, lastnovels){
							res.render('index',{
								title: '阅文网_免费的小说阅读网站',
								isLogined: isLogined,
								user: user,
								userId: userId,
								cyxs_novel: cyxs_novel,
								lsjk_novel: lsjk_novel,
								xxhx_novel: xxhx_novel,
								csxs_novel: csxs_novel,
								rank_novel: clicknovels,
								last_novel: lastnovels,
							});
						})
					})
				})
			})
		})
	})
});

/* 注册页 */
app.get('/signup', function(req, res){
	var user = '',userId = '';
	if(req.session.user){
		user = req.session.user.username,	
		userId = req.session.user.userId;
		var isLogined = !!user;
	}
	res.render('signup',{
		title: "会员注册--阅文网",
		isLogined: isLogined,
		user: user,
		userId: userId,
	});
})

/* 登录页 */
app.get('/login', function(req, res){
	var user = '',userId = '';
	if(req.session.user){
		user = req.session.user.username;
		userId = req.session.user.userId;
		var isLogined = !!user;
	}
	res.render('login',{
		title: "会员登录--阅文网",
		isLogined: isLogined,
		user: user,
		userId: userId,
	});
})

/* 小说列表页 */
app.get('/novel', function(req, res){
	var user = '',userId, bookcaseArr = [];
	if(req.session.user){
		user = req.session.user.username,	
		userId = req.session.user.userId;
		var isLogined = !!user;
	}
	if(userId){
		User.findById(userId, function(e, userdoc){
			bookcaseArr = userdoc.star;
		})
	}
	
	var param = url.parse(req.url, true);
	if(param.query.cate!=undefined){
		var cate = param.query.cate;
		var category='';
		if(cate=='cyxs')
			category ='穿越小说';
		else if(cate=='wyxs')
			category ='网游小说';
		else if(cate=='xdyq')
			category ='现代言情';
		else if(cate=='xhmf')
			category ='玄幻魔法';
		else if(cate=='xxhx')
			category ='仙侠幻想';
		else if(cate=='zchm')
			category ='总裁豪门';
		else if(cate=='csxs')
			category ='重生小说';
		else if(cate=='lsjk')
			category ='历史架空';
		Novel.find({category: category}, function(e, noveldoc){
			if(e)	console.log('err' + e);
			else{
				res.render('novel-list', {
					title: "小说阅读_阅文网",
					novels: noveldoc,
					isLogined: isLogined,
					user: user,
					userId: userId,
					bookcaseArr: bookcaseArr,
				});
			}
		})
	} else {
		// console.log('???')
		Novel.find({}, function(err, novels){
			if(err)	console.log('err'+ err);
			else if(novels){
				res.render('novel-list', {
					title: "小说阅读_阅文网",
					novels: novels,
					isLogined: isLogined,
					user: user,
					userId: userId,
					bookcaseArr: bookcaseArr,
				});
			}
		})
	}
})

/* 小说详情页 */
app.get('/novel/:id', function(req, res){
	var _id = req.params.id;
	var user = '',userId = '';
	if(req.session.user){
		user = req.session.user.username,	
		userId = req.session.user.userId;
		var isLogined = !!user;
	}
	Novel.findById(_id, function(err, doc){
		if(err)
			console.log('err: '+ err);
		else if(doc){
			var novel = new Novel(doc);
			novel.clickNum++;
			res.render('novel', {
				title: doc.name+"_阅文网_免费的小说阅读网站",
				nid: _id,
				user: user,
				userId: userId,
				isLogined: isLogined,
				name: doc.name,
				author: doc.author,
				intro: doc.intro,
				chapterNow: doc.chapterNow,
				chapter_id: doc.chapter_id,
				category: doc.category,
				lastdate: doc.lastdate,
				clickNum: doc.clickNum,
				starNum: doc.starNum,
				imgURL: doc.imgURL,
				viewsNum: doc.viewsNum,
				views: doc.views,
			});
			novel.save();
		}
	})
	
})

/* 章节页面 */
app.get('/chapter/:cid/:id', function(req, res){
	var _cid = req.params.cid;
	var _id = req.params.id;
	// console.log(_cid, _id);
	var user = '',userId = '';
	if(req.session.user){
		user = req.session.user.username,	
		userId = req.session.user.userId;
		var isLogined = !!user;
	}
	Chapter.findById({'_id':_cid}, function(err, doc){
		if(err){
			console.log('err: '+err);
		}
		else if(doc){
			var data = doc.contents['c'+_id].replace(/\n/g, "</p><br><p>");
			res.render('chapter', {
				title: "阅文网_免费的小说阅读网站",
				user: user,
				userId: userId,
				isLogined: isLogined,
				index: _id,
				data: data,
			})
		}
	})
})

/* 管理员登录 */
app.get('/admin', function(req, res){
	var admin = '';
	if(req.session.admin){
		admin = req.session.admin;
		var isLogined = !!admin;
	}
	if(isLogined){
		Novel.find({}, function(e, noveldoc){
			User.find({}, function(e, userdoc){
				res.render('admin-login', {
					admin: admin,
					isLogined: isLogined,
					novel: noveldoc,
					user: userdoc,
				});
			})
		})
	} else{
		res.render('admin-login', {
			admin: admin,
			isLogined: isLogined,
		});
	}
})

/* 管理员登出 */
app.get('/admin/logout',function(req,res){  
    req.session.admin = null;  
    res.redirect('/admin');  
});

/* 管理员登录 */
app.post('/ajax/admin-login', function(req, res){
	var ajaxData = req.body;
	if(ajaxData.name == 'admin' && ajaxData.password == 'admin'){
		console.log('aaa');
		req.session.admin = ajaxData.name;
		res.status(200).json({'msg': 1});
	}
})

/* 后台小说详情 */
app.post('/ajax/admin/detailNovel', function(req, res){
	var ajaxData = req.body;
	Novel.findById(ajaxData.nid, function(e, doc){
		res.status(200).json(doc);
	})
})

/* 后台删除小说 */
app.post('/ajax/admin/removeNovel', function(req, res){
	var ajaxData = req.body;
	Novel.remove({'_id':ajaxData.nid}, function(e, doc){
		if(e) console.log(e);
		res.status(200).json({'msg': 1});
	})
})

/* 后台删除用户 */
app.post('/ajax/admin/removeUser', function(req, res){
	var ajaxData = req.body;
	User.remove({'_id':ajaxData.uid}, function(e, doc){
		if(e) console.log(e);
		res.status(200).json({'msg': 1});
	})
})

/* 录入小说 */
app.post('/ajax/newChapter', function(req, res){
	// console.log(req.body);
	var ajaxData = req.body;

	Novel.find({'name': ajaxData.name}, function(err, doc){
		if(err){
			console.log("err: " + err);
		}
		else if(doc.length != 0){
			console.log('save');
			var novelDoc = new Novel(doc[0]);
			novelDoc.chapterNow++;
			novelDoc.lastdate = moment().format('YYYY-MM-DD HH:mm:ss');
			Chapter.findById(novelDoc.chapter_id, function(err, chapterDoc){
				if(err)
					console.log("chapter find err: " + err);
				else if(chapterDoc){	
					//console.log(chapterDoc);
					var chapter = new Chapter(chapterDoc);
					chapter.contents['c' + novelDoc.chapterNow] = ajaxData.body;
					//console.log(novelDoc.chapterNow);
					chapter.save(function(err, doc){
						if(err){	
							console.log('chapter save err: ' + err);
						}else{
							//console.log(doc);
						}
					})
				}
			})
			// Chapter.update({'_id': novelDoc.chapter_id}, 
			// 		{})
			//console.log(novelDoc.contents);
			novelDoc.save(function(err, doc){
				if(err){
					console.log('novel save err: '+ err);
				}
				else{
					res.status('200').end();
				}
			})
		}
		else{
			console.log('news');
			var chapter = new Chapter({
				contents: {
					'c1': ajaxData.body,
				}
			});
			chapter.save(function(err, doc){
				if(err){
					console.log('chapter save err: ' + err);
				}else{
					console.log(doc);
				}
			});
			// console.log(chapter);
			var novel = new Novel({
				'name': ajaxData.name,
				'author': ajaxData.author,
				'intro': ajaxData.intro,
				'lastdate': moment().format('YYYY-MM-DD HH:mm:ss'),
				'chapterNow': 1,
				'category': ajaxData.category,
				'chapter_id': chapter._id,
				'starNum': 0,
				'clickNum': 0,
				'finished': false,
				'viewsNum': 0,
				'views': new Object(),
				'imgURL': ajaxData.imgURL,
			})
			novel.views = {
				'v0': '',
			};
			console.log('cao' + novel.views)
			novel.save(function(err, doc){
				if(err){
					console.log('novel save err: ' + err);
				}
				else{
					res.status('200').end();
				}
			})
			//console.log(novel);
			
		}
	})
})

/* 获取小说 */
app.get('/ajax/novel', function(req, res){
	var ajaxData = req.body;
	Novel.findById(ajaxData._id, function(err, doc){
		res.status(200).json(doc);
	})
})

/* 获取小说 */
app.get('/ajax/novel/:id', function(req, res){
	var _id = req.params.id;
	Novel.find({'_id': _id}, function(err, doc){
		if(err){
			res.status(404).json(err);
		}
		else if(doc){
			res.status(200).json(doc);
		}
	})
})

// 搜索页面
app.get('/search', function(req, res){
	var user = '',userId = '';
	if(req.session.user){
		user = req.session.user.username,	
		userId = req.session.user.userId;
		var isLogined = !!user;
	}
	var param = url.parse(req.url, true);
	var name = {'$regex' : ".*"+ param.query.wd +".*"};
	Novel.find({"name": name}, function(e, doc){
		if(e)
			console.log('err: ' + err);
		else{
			res.render('search', {
				num: doc.length,
				novels: doc,
				user: user,
				userId: userId,
				isLogined: isLogined,
			})
		}
	})
})

/* 排行榜 */
app.post('/ajax/rank', function(req, res){
	Novel.find({}, function(e, doc){
		var query = doc.find({}, {limit: 10}).sort({clickNum: 1});
		res.status(200).json(query);
	})
})

/* 收藏小说 */
app.post('/ajax/addNovel', function(req, res){
	var ajaxData = req.body;
	// console.log(ajaxData.uid, ajaxData.nid);
	User.findById(ajaxData.uid, function(e, userdoc){
		var user = new User(userdoc);
		console.log(user.star);
		user.star.push(ajaxData.nid);
		Novel.findById(ajaxData.nid, function(e, noveldoc){
			var novel = new Novel(noveldoc);
			novel.starNum++;
			novel.save();
		})
		user.save();
	})
	res.status(200).json({code: 0});
})

/* 取消收藏 */
app.post('/ajax/removeNovel', function(req, res){
	var ajaxData = req.body;
	User.findById(ajaxData.uid, function(e, userdoc){
		var user = new User(userdoc);
		console.log(user.star);
		user.star.remove(ajaxData.nid);
		Novel.findById(ajaxData.nid, function(e, noveldoc){
			var novel = new Novel(noveldoc);
			novel.starNum--;
			novel.save();
		})
		user.save();
	})
	res.status(200).json({code: 0});
})

/* 用户注册 */
app.post('/ajax/form-signup', function(req, res){
	var ajaxData = req.body;

	User.find({'username': ajaxData.username}, function(err, doc){
		if(err){
			console.log("err: " + err);
		}
		// 无论有无查询到结果，只要查询不出错，err就是空，result就是非空
		else if(doc.length != 0){
			console.log('注册过了:'+ doc);
			res.status(200).json({code: 1});
			return;
		}
		else{
			var user = new User({
				username: ajaxData.username,
				password: ajaxData.password,
				email: ajaxData.email,
				isAuthor: false,
				star: new Array(),
			});
			//console.log(user);

			user.save(function(err, data){
				if(err){
					console.log("Error: " + err);
				}else{
					console.log("data: " + data);
					// res.render("signup");
					res.status(200).json({code: 0});	
					// 光status()不够，还要end()来不带数据的结束res，带数据可以用res,send()或res.json()
				}
			});
		}
	})	
})

/* 评论接口 */
app.post('/ajax/views', function(req, res){
	var ajaxData = req.body;

	Novel.findById({'_id': ajaxData.nid}, function(e, noveldoc){
		if(e)
			console.log('err: ' + e);
		else{
			var novel = new Novel(noveldoc);
			if(novel.views==undefined)
				novel.views = {};
			var l = novel.viewsNum;
			novel.views['v' + l] = {};
			novel.views['v' + l]['name'] = ajaxData.name;
			novel.views['v' + l]['uid'] = ajaxData.uid;
			novel.views['v' + l]['time'] = moment().format('YYYY-MM-DD HH:mm:ss');
			novel.views['v' + l]['view'] = ajaxData.view;
			novel.viewsNum++;
			novel.save();
		}
		res.status(200).json({
			views: novel.views,
			length: novel.viewsNum,
		});
	})
})

/* 用户登录 */
app.get('/ajax/form-login', function(req, res){
	var param = url.parse(req.url, true);

	User.find({'username': param.query.username}, function(err, doc){
		if(err){
			console.log("err: " + err);
		}
		else if(doc.length == 0){
			res.status(200).json({username: 0, password: 0});
		}
		else{
			if(doc[0].password == param.query.password){
				var user = {
					username: doc[0].username,
					userId: doc[0]._id,
				}
				// console.log(user);
				req.session.user = user;
				res.status(200).json({username: 1, password: 1});
			}else{
				res.status(200).json({username: 1, password: 0});
			}
			
		}
	})
})

/* 用户注销 */
app.get('/logout',function(req,res){  
    req.session.user = null;  
    res.redirect('/');  
});

/* 获取指定类型小说 */
app.post('/ajax/cate', function(req, res){
	var ajaxData = req.body;
	if(ajaxData.category == '全部'){
		Novel.find({}, function(e, doc){
			if(e)
				res.status(404).json(err);
			else{
				res.status(200).json(doc);
			}
		})
	} else {
		Novel.find({'category': ajaxData.category}, function(e, doc){
			if(e)
				res.status(404).json(err);
			else{
				res.status(200).json(doc);
			}
		})
	}
})

Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

