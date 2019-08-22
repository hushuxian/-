(function($){

 	$.fn.validate = function(config){
 		var setting = {
 			defaultEvent :'submit',
 			identity:{
 				require:false,
 				identity:false,
 				rule:/(^\d{15}$)|(^\d{17}(\d|X|x)$)/,
 				hint:'请输入正确身份证号码'
 			},
 			tel:{
 				require:false,
 				tel:true,
 				rule:/^0?(13|14|15|18)[0-9]{9}$/,
 				hint:'请输入正确电话号码'
 			},
 			email:{
 				require:false,
 				email:false,
 				rule:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
 				hint:'请输入合法的邮箱地址'
 			}
 		};
 		var root = this[0];

 		$.extend(true,setting,config);
 		var submitBtn = this.find('input:submit').length != 0 ? this.find('input:submit') : this.find('button:submit');

 		switch (setting.defaultEvent) {
 			case 'submit':
 				submitBtn.on('click',(event) =>{
 					event.preventDefault();
 					var dtcs = this.find('input');
 					var i = 0,length = dtcs.length,pass = true;
 					for(;i<length;i++){

 						if(!test(dtcs[i]) || !rangeTest(dtcs[i])) pass = false;
 					}
 					if(!pass) return false;
 				})
 				break;
 			case 'change':
 			case 'blur':
 				this.on('change blur','input',function(){
 					test(this) && rangeTest(this);
 				})
 				break;
 		}

 		function test(obj){
 			var exType = obj.getAttribute('id'),
 			value = obj.value,
 			config = setting[exType],
 			hint = '';
 			
 			if(config && config.require == true && obj.value.length == 0) {
 				addHint(obj,'不能为空');
 				return false;
 			}
 			if(config && config[exType]){
 				var regex = config.rule;
 				hint = !regex.test(value) ? addHint(obj,config.hint) : addHint(obj,'');
 			}

			
 			if(hint.length > 0 ){
 				return false;
 			}
 			return true;
 		}

 		function rangeTest(obj){
 			var value = obj.value;
 			if(typeof value != 'number'){
 				addHint(obj,'请输入数字');
 				return false;
 			}
 			if(obj.max && Number(value) > obj.max){
 				addHint(obj,'请填写小于' + obj.max + '的值' );
 				return false;
 			}
 			if(obj.min && Number(value) < obj.min){
 				addHint(obj,'请填写大于' + obj.min + '的值' );
 				return false;
 			}
 			addHint(obj,'');
 			return true;
 		}

 		function addHint(obj,info){
 			var exType = obj.getAttribute('id'),
 			parent = obj.parentNode,
 			hintExist = findHint(parent);
 			var hint = hintExist || $("<span class='hint " + exType + "'>");
 			!hintExist && parent.appendChild(hint[0]);
 			hint.html(info); 
 			return hint;
 		}
 		function findHint(node){
 			var children = node.childNodes,i = 0,length = children.length;
 			for(; i < length;i++){
 				if(children[i].className.indexOf('hint') > -1)return $(children[i]);
 			}
 			return false;
 		}


 	}; 


})($);