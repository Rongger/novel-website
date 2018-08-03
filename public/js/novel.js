var $chapterList_bd = $('.chapterlist-bd'),
	$chapterList = $('.chapterList'),
	$tabs = $('.click-hd h3'),
	$tabs_item = $('.click-bd .item');
var cid = $chapterList.data('cid');
var html = '';
for(var i=1,l=$chapterList.data('num');i<=l;i++){
	html += "<li><a href='' target='_blank'>第"+ i +"章</a></li>";
}
$chapterList.html(html);

$tabs.each(function(index){
	$(this).click(function(){
		$tabs.removeClass('active');
		$(this).addClass('active');
		$tabs_item.addClass('hide');
		$($tabs_item[index]).removeClass('hide');
	})
})
if($('.finished-span').text()==false)
	$('.finished-span').text('连载中');
else if($('.finished-span').text()==true)
	$('.finished-span').text('已完结');	

var $ca = $chapterList.children('li').children('a');
$ca.each(function(index){
	$(this).attr('href', '/chapter/'+cid+'/'+(parseInt(index)+parseInt(1)));
})

var $view_submit = $('#view-submit');
$view_submit.click(function(){
	var view = $('#view-content').val();
	data = {
		view: view,
		name: $(this).data('user'),
		uid: $(this).data('uid'),
		nid: $(this).data('nid'),
	}
	$.ajax({
		url: '/ajax/views',
		type: 'post',
		async: true,
		data: data,
		success: function(viewdata){
			var $viewul = $('.viewslist-bd ul');
			var html = '';
			for(var i=0,l=viewdata.length;i<l;i++){
				var str = 'v'+i;
				html += ('<li>'+
					'<div class="user"><img src="/img/profle.png" alt=""></div>'+
					'<div class="discuss-info">'+
					'<dl class="reader-reply"><dt>'+
					'<span class="name">'+ viewdata.views[str].name +'</span>'+
					'<span class="time">'+ viewdata.views[str].time +'</span>'+
					'</dt><dd class="view-content">'+ viewdata.views[str].view +'</dd>'+
					'</dl></div></li>');
			}
			// console.log($viewul);
			$viewul.html(html);
			// console.log(viewdata);
		}
	})
})