$(function() {
	'use strict';

	var form_rule = {
		// 用户名 长度1-16  接受大小写字母、数字、下划线
		// 密码  长度6-16  接受大小写字母、数字、下划线
		// 邮箱  
		rule_username: {
			minLength: 1,
			maxLength: 16,
			pattern: "^[A-Za-z0-9_]*$",
		},
		rule_password: {
			minLength: 6,
			maxLength: 16,
			pattern: "^[A-Za-z0-9_]*$",
		},
		rule_email: {
			pattern: "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$",
		}
	}

	window.Input = function(selector) {
		var $ele,
			$error_ele,
			me = this,
			rule = {};

		// 加载验证器
		this.load_validator = function() {
			var val = this.get_val();
			// console.log(val, rule);
			this.validator = new Validator(val, rule);
		}	

		// 获取输入值
		this.get_val = function() {
			return $ele.val();
		}

		function init() {
			find_ele();
			get_error_ele();
			parse_rule();
			// 这里在函数内，作用域变了，所以this.validator未定义，用me保存之前的this,再引用
			me.load_validator();
			listen();
		}

		// 监听用户的输入
		function listen() {
			$ele.on('blur', function(){
				// 同上
				var valid = me.validator.is_valid(me.get_val());

				if(valid){ 
					$error_ele.hide();
				} else {
					$error_ele.show();
				}
			});
		}

		// 获取错误div对象
		function get_error_ele() {
			$error_ele = $(get_error_selector());
		}

		// 获取错误div的选择器
		function get_error_selector() {
			return '#' + $ele.attr('name') + '-input-error';
		}

		// 匹配元素
		function find_ele() {
			if(selector instanceof jQuery){
				$ele = selector;
			} else {
				$ele = $(selector);
			}
		}

		// 解析规则
		function parse_rule() {
			rule = form_rule['rule_' + $ele.attr('name')];
		}

		init();
	}
})