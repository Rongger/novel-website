$(function(){
	'use strict';

	window.Validator = function(val, rule){
		this.is_valid = function(new_val){
			val = new_val;
			if(!val)	return false;
			for(var key in rule){
				var r = this["validate_" + key]();
				if(r === false)
					return false
			}
			return true;
		}

		this.vaildate_max = function(){
			val = parseFloat(val);
			return val <= rule.max;
		}

		this.vaildate_min = function(){
			val = parseFloat(val);
			return val >= rule.min;
		}

		this.validate_maxLength = function(){
			val = val.toString();
			return val.length <= rule.maxLength;
		}

		this.validate_minLength = function(){
			val = val.toString();
			return val.length >= rule.minLength;
		}

		this.validate_numeric = function(){
			return $.isNumeric(val);
		}

		// 判断是否符合正则规则
		this.validate_pattern = function(){
			var reg = new RegExp(rule.pattern);
			return reg.test(val);
		}
	}
})