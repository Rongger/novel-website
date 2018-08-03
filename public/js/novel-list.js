$(function(){
	var url = window.location.href;
	var category;
	if(url.indexOf('cate=cyxs')>-1)
		category ='穿越小说';
	else if(url.indexOf('cate=wyxs')>-1)
		category ='网游小说';
	else if(url.indexOf('cate=xdyq')>-1)
		category ='现代言情';
	else if(url.indexOf('cate=xhmf')>-1)
		category ='玄幻魔法';
	else if(url.indexOf('cate=xxhx')>-1)
		category ='仙侠幻想';
	else if(url.indexOf('cate=zchm')>-1)
		category ='总裁豪门';
	else if(url.indexOf('cate=csxs')>-1)
		category ='重生小说';
	else if(url.indexOf('cate=lsjk')>-1)
		category ='历史架空';
	// else
	// 	category = '全部';
	console.log(category);

	$('.main-cate li').each(function(index){
		if($(this).text()==category){
			console.log($(this))
			$('.main-cate li').removeClass('active');
			$(this).addClass('active');
		}
		// $(this).click(function(){
		// 	var cate = $(this).text();
		// 	var $that = $(this);
		// 	console.log(cate);
		// 	$.ajax({
		// 		url: '/ajax/cate',
		// 		type: 'POST',
		// 		async: true,
		// 		data: {
		// 			'category': cate,
		// 		},
		// 		success:function(data){
		// 			$('.main-cate li').removeClass('active');
		// 			$that.addClass('active');
		// 			var html = '', text = '加入书架';
		// 			console.log(data.length);
		// 			var idArr = $('.hidedata').text().split(',');
		// 			for(var i=0,l=data.length;i<l;i++){
		// 				// for(var j=0,length=idArr.length;j<length;j++){
		// 				// 	if(data[i]._id == idArr[j])
		// 				// 		text = '取消收藏';
		// 				// }
		// 				html += ('<div class="main-item clearfix"><div class="novel-img-w"><img class="novel-img" src="'+data[i].imgURL+'" alt="'+data[i].name+'"></div>'+
		// 				'<div class="novel-info"><p class="clearfix">'+
		// 						'<a href="/novel/'+data[i]._id+'" class="title">'+data[i].name+'</a><span class="author">作者:&nbsp;&nbsp;'+data[i].author+'</span><span class="category">['+data[i].category+']</span>'+
		// 						'<a class="collect" href="javascript:;">'+ text +'</a></p>'+
		// 					'<p class="intro">'+data[i].intro+'</p>'+
		// 					'<p><span>点击量:'+ data[i].clickNum+'</span><span>订阅人气:'+data[i].starNum+'</span><span>更新: '+data[i].lastdate+'</span></p></div></div>');
		// 			}
		// 			console.log(html);
		// 			console.log($('.main-w'));
		// 			$('.main-w').html(html);
		// 		}
		// 	})
		// })
	})

	$(".main-item .collect").each(function(index){
		$(this).click(function(){
			var nid = $(this).data('id');
			var uid = $(".user").text();
			var that = $(this);
			console.log('nid:'+nid, 'uid:'+uid);
			if(that.text()=='加入书架'){
				$.ajax({
					url: '/ajax/addNovel',
					type: 'POST',
					async: true,
					data: {
						nid: nid,
						uid: uid,
					},
					success: function(data){
						if(data.code==0){
							that.text('取消收藏').css("background-color", '#a29494');
						}
					}
				})
			} else{
				$.ajax({
					url: '/ajax/removeNovel',
					type: 'POST',
					async: true,
					data: {
						nid: nid,
						uid: uid,
					},
					success: function(data){
						if(data.code==0){
							that.text('加入书架').css("background-color", 'red');
						}
					}
				})
			}
			
		})
	})

	// $.ajax({
	// 	url: '/ajax/novel',
	// 	type: 'GET',
	// 	async: true,
	// 	data: {
	// 		'_id': ,
	// 	}	
	// 	success: function(data, textStatus, jqXHR){
	// 		console.log(jqXHR.responseJSON);
	// 	}
	// })
})