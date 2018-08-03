$('#submit').on('click', function(e){
	e.preventDefault();
	var data = {
		name: $('#name').val(),
		password: $('#password').val(),
	}
	console.log(data);
	$.ajax({
		url: '/ajax/admin-login',
		data: data,
		async: true,
		type: 'post',
		success: function(data){
			console.log('success');
			document.location.reload();
		}
	})
})

var $navList_item = $('.side-nav .nav-list .navList-item');
$navList_item.click(function(){
	$(this).next().slideToggle();
})

$('.detail-btn').on('click', function(){
	var nid = $(this).parent().siblings('.nid').text();
	$.ajax({
		url: '/ajax/admin/detailNovel',
		type: 'post',
		data: {
			nid: nid,
		},
		success:function(data){
			console.log(data);
			$('.novel-change').after('<div class="mask">'+
				'<div class="novel-wrap">'+
					'<div class="close-btn">X</div>'+
					'<div class="form-group">id<input class="form-control" type="text" value="'+ data._id +'"></div>'+
					'<div class="form-group">小说名<input class="form-control" type="text" value="'+ data.name +'"></div>'+
					'<div class="form-group">作者<input class="form-control" type="text" value="'+ data.author +'"></div>'+
					'<div class="form-group">简介<textarea class="form-control" name="" id="">'+ data.intro +'</textarea></div>'+
					'<div class="form-group">更新时间<input class="form-control" type="text" value="'+ data.lastdate +'"></div>'+
					'<div class="form-group">章节数<input class="form-control" type="text" value="'+ data.chapterNow +'"></div>'+
					'<div class="form-group">小说种类<input class="form-control" type="text" value="'+ data.category +'"></div>'+
					'<div class="form-group">章节id<input class="form-control" type="text" value="'+ data.chapter_id +'"></div>'+
					'<div class="form-group">收藏数<input class="form-control" type="text" value="'+ data.starNum +'"></div>'+
					'<div class="form-group">点击数<input class="form-control" type="text" value="'+ data.clickNum +'"></div>'+
					'<div class="form-group">是否完结<input class="form-control" type="text" value="'+ data.finished +'"></div>'+
					'<div class="form-group">评论数<input class="form-control" type="text" value="'+ data.viewsNum +'"></div>'+
					'<div class="form-group">封面路径<input class="form-control" type="text" value="'+ data.imgURL +'"></div>'+
				'</div></div>');
			$('.close-btn').click(function(){
				$(this).parent().parent().remove();
			})
		}
	})
})

$('.remove-btn').on('click', function(){
	var item = $(this).parent().parent();
	var nid = $(this).parent().siblings('.nid').text();
	var r = confirm('确认要删除？');
	if(r){
		$.ajax({
			url: '/ajax/admin/removeNovel',
			type: 'post',
			data: {
				nid: nid,
			},
			success:function(data){
				console.log(data);
				if(data.msg){
					console.log('删除成功');
					item.remove();
				}
			}
		})
	}
})

$('.user-remove-btn').on('click', function(){
	var item = $(this).parent().parent();
	var uid = $(this).parent().siblings('.uid').text();
	var r = confirm('确认要删除？');
	if(r){
		$.ajax({
			url: '/ajax/admin/removeUser',
			type: 'post',
			data: {
				uid: uid,
			},
			success:function(data){
				console.log(data);
				if(data.msg){
					console.log('删除成功');
					item.remove();
				}
			}
		})
	}
})

$('.select-item').each(function(index){
	$(this).click(function(){
		$('.form-container').hide();
		$($('.form-container')[index]).show();
		$('.select-item').css({'background-color': '#fff', 'color': '#000'});
		$(this).css({'background-color': '#007bff', 'color': '#fff'});
	})
})