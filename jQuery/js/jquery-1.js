/* hushuxian 2019-7 */


(function(root){
	var version = "1.0.1";

	var jQuery = function(selector,context){

		return new jQuery.fn.init(selector,context);
	}
	jQuery.fn = jQuery.prototype = {
		length : 0,
		selector:"",
		jQuery: version,
		init:function(selector,context){
			var context = context || document;
			var match;

			if(!selector){
				return this;
			}
			if(typeof selector == "string"){
				if(selector.charAt(0) == "<" && selector.charAt(selector.length -1) == ">" && selector.length >= 3){
					jQuery.merge(this,jQuery.parseHTML(selector,context));
				}
				else{
					var nodeList = document.querySelectorAll(selector);
					this.length = nodeList.length;
					for(var i = 0;i<nodeList.length;i++){
						this[i] = nodeList[i];
					}
					this.context = context;
					this.selector = selector;

				}
			}else if(selector.nodeType){
				this.context = this[0] = selector;
				this.length = 1;
			}

		}
	}


	jQuery.prototype.extend = jQuery.extend = function(){
		var depth = false,
		target = arguments[0],
		length = arguments.length,
		i = 1;
		var copy,isArray;

		if(typeof target == "boolean"){
			depth = target;
			target = arguments[1];
			i=2;
		}

		if(typeof target != "object"){
			target = {};
		}

		if(length == i){
			target = this;
			i--;
		}
		

		for(;i<length;i++){
			if((option = arguments[i]) != null){
				for(var name in option){
					if(depth && (jQuery.isObject(option[name]) || (isArray = jQuery.isArray(option[name])))){
						if(isArray) {
						 	copy = target[name] && jQuery.isArray(target[name])? target[name] : [];
						}else{
							copy = target[name] && jQuery.isObject(target[name]) ? target[name] : {};
						}
						target[name] = jQuery.extend(depth,copy,option[name]);
					}else if(option[name] !=  undefined){
						target[name] = option[name];
					}
					
				}
			}
			
		}
		return target;
	}
	jQuery.fn.init.prototype = jQuery.fn ;

	jQuery.extend({
		isObject:function(obj){
			return toString.call(obj) == '[object Object]';
		},
		isArray:function(obj){
			return toString.call(obj) == '[object Array]';
		},
		parseHTML:function(selector,context){
			var regExp = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
			var tag = regExp.exec(selector)[1];
			return [context.createElement(tag)];
		},
		merge:function(result,arr){
			var l = result.length,
			r = arr.length,
			j = 0;
			if(typeof r == 'number'){
				for(;j<r;){
					result[l++] = arr[j++];
				}
			}else{
				while(arr[j] != undefined){
					result[l++] == arr[j++];
				}
			}
			result.length = l;
			return result;
		},
		callbacks:function(){
			var config =  arguments[0].split(/\s+/);
			var isDone =  false,index = 0,memory;
			var list = [];

			function fire(context,arg){
				memory = config.indexOf('memory')>-1 && arg;
				if(list.length){
					for(var i = index;i<list.length;i++){
						if((index++,list[i].apply(context,arg) == false) && config.indexOf('stopOnfalse') > -1){
							break;
						};
					}
				}
			}
			self = {
				add:function(){
					if(arguments.length != 0){
						for(var i = 0;i<arguments.length;i++){
							var fn = arguments[i];
							config.indexOf('unique') > -1 && list.indexOf(fn) > -1 ? '' :
							(toString.call(arguments[i]) == '[object Function]'  ? list.push(arguments[i]) : '');
							if(config.indexOf('memory')>-1 && isDone) this.fireWith(memory); 
						}
					}
					return this;
					
				},
				fireWith:function(arg){
					fire(this,arg);
					
				},
				fire:function(){
					config.indexOf('once') > -1 && isDone ? '' : (this.fireWith(arguments),isDone = true);
				}
			}
			return self;
		},
		Deferred:function(){
			var tuples = [
				['resolve','done',jQuery.callbacks('once memory'),'resolved'],
				['reject','fail',jQuery.callbacks('once memory'),'failed'],
				['notify','progress',jQuery.callbacks('once memory')]
			],
			state = 'pending',
			promise = {
				state : function(){
					return state;
				},
				then : function(){},
				promise : function(){

				}
			}
			,deferred = {};

			tuples.forEach(function(tuple,i){
				var list = tuple[2],
				stateString = tuple[3];

				deferred[tuple[1]] =  list.add;

				if(stateString){
					list.add(function(){
						state = stateString;
					})
				}
				deferred[tuple[0]] = function(){
					deferred[tuple[0] + 'With'](arguments);
					return this;
				}
				deferred[tuple[0] + 'With'] = list.fireWith; 
			})

			return deferred;
		},
		when:function(def){
			return def;
		}

	})
	root.$ = root.jQuery = jQuery;

})(this);