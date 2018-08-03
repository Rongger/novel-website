var $bannerimgs = $(".banner ul li");
var $spans = $('.banner .btns span'); 

var num = 0,timer=0;
timer = setInterval(function(){
	nextimg();
}, 2500);

$(".banner ul").hover(function(){
	clearInterval(timer);
}, function(){
	timer = setInterval(function(){
		nextimg();
	}, 3000);
})

function nextimg(){
	num++;
	if(num==5)
		num=0;
	$bannerimgs.addClass('hide');
	$($bannerimgs[num]).removeClass('hide');
	$spans.removeClass('spans-active');
	$($spans[num]).addClass('spans-active');
}

$spans.each(function(index){
	$(this).click(function(){
		console.log($(this));
		$bannerimgs.addClass('hide');
		$($bannerimgs[index]).removeClass('hide');
		$spans.removeClass('spans-active');
		$(this).addClass('spans-active');
		num=index;
	})
})