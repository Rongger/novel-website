$(function(){
	'use strict';

	var $inputs = $("dl input"),
		inputs = [],
		$form_signup = $("#signup"),
		$form_login = $("#login");

	// 遍历$inputs数组
	$inputs.each(function(index, node){
		var tmp = new Input(node);
		inputs.push(tmp);
	});

	
	$form_signup.on('submit', function(e){
		e.preventDefault();

		// 触发所有框的blur事件
		$inputs.trigger('blur');

		// 检查所有输入框是否输入正确，成功提交，否则return
		for(var i=0,l=inputs.length;i<l;i++){
			var item = inputs[i];
			var r = item.validator.is_valid(item.get_val());
			if(!r){
				console.log("提交失败");
				return;
			}
		}
		var data = {};
		for(var i=0,l=$inputs.length;i<l;i++){
			data[$inputs[i].name] = $($inputs[i]).val();
		}
		// console.log(data);
		$.ajax({
			url: '/ajax/form-signup',
			type: 'POST',
			async: true,
			data: data,
			success: function(data, textStatus, jqXHR){
				if(jqXHR.responseJSON.code === 1){
					alert("该用户名已注册");
				}
				else if(jqXHR.responseJSON.code === 0){
					var $msg_success = $(".msg-success");
					$(".form-container").css("display", "none");
					$msg_success.css("display", "block").html("注册成功！现在可以<a href='/login'>登录</a>");
				}
				
			}
		})
	});

	$form_login.on('submit', function(e){
		e.preventDefault();
		console.log("yes");
		$inputs.trigger('blur');

		// 检查所有输入框是否输入正确，成功提交，否则return
		for(var i=0,l=inputs.length;i<l;i++){
			var item = inputs[i];
			var r = item.validator.is_valid(item.get_val());
			if(!r){
				console.log("提交失败");
				return;
			}
		}
		var data = {};
		for(var i=0,l=$inputs.length;i<l;i++){
			data[$inputs[i].name] = $($inputs[i]).val();
		}

		$.ajax({
			url: '/ajax/form-login',
			type: 'GET',
			async: true,
			data: data,
			success: function(data, textStatus, jqXHR){
				var resJSON = jqXHR.responseJSON;
				if(resJSON.username === 0){
					alert("该用户名未注册");
				}
				else if(resJSON.username === 1){
					if(resJSON.password === 1){
						console.log("登录成功");
						location.href = "/";
					}
					else if(resJSON.password === 0){
						alert("密码错误");
					}
				}
				
			}
		})
	})
})

