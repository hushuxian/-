(function(root){
	var push = Array.prototype.push;
	var slice = Array.prototype.slice;
	var _= function(obj){
		var instance;
		if(obj instanceof _){
			return obj;
		}else if(!(this instanceof _)){
			return new _(obj)
		}
		this.wrapped = obj;
	};
	_.functions = function(obj){
		var funs = [];
		var key;
		for(key in obj){
			typeof obj[key] == 'function' ? funs.push(key) : '';
		}
		return funs;
	}
	_.unique = function(arr,callback){
		var rest = [];
		var val;
		for(var i = 0;i<arr.length;i++){
			val = callback ? callback(arr[i]) : arr[i];
			if(rest.indexOf(val) == -1){
				rest.push(val)
			}
		}
		return rest;
	}
	_.restArguments = function(func){
		var restP = func.length -1;
		return function(){
			var restLen = arguments.length - restP;
			var rest = Array(restLen);
			var args = [];
			for(var i = 0;i<restLen;i++){
				rest[i] = auguments[restP+i];
			}
			for(var i = 0;i<restP;i++){
				args.push(arguments[i])
			}
			args[restP] = rest;
			func.apply(this,args);
		}
	}
	_.random = function(min,max){
		if(max == undefined){
			max = min;
			min = 0;
		}
		return Math.floor(Math.random()*(max - min));

	}
	_.clone = function(arr){
		return _.isArray(arr) ? arr.slice() : _.extend({},arr);
	}
	_.sample = function(arr,n){
		var length = arr.length;
		if(n == null){
			return arr[_.random(length -1)]
		}
		var sample = _.clone(arr);
		n = Math.max(0,Math.min(n,length));
		for(var i = 0;i < n;i++){
			var rand = _.random(i,length-1);
			var temp = sample[rand];
			sample[rand] = sample[i];
			sample[i] = temp;
		}
		return sample.slice(0,n);
	}
	_.shuffle = function(arr){
		return _.sample(arr,Infinity);
	}

	function flatten(arr,shallow){
		var ret = [],index = 0,length = arr.length;
		var value;
		for(var i = 0;i<length;i++){
			value = arr[i];
			if(_.isArray(value) || _.isArguments(value)){
				if(!shallow){
					value = flatten(value,shallow);
				}
				var j = 0;
				ret.length +=  value.length;
				while(j < value.length){
					ret[index++] = value[j++]
 				}
			}else{
				ret[index++] = value; 
			}
		}
		return ret;
	}
	_.flatten = function(arr,shallow){
		return flatten(arr,shallow);
	}
	_.initial = function(arr,n){
		[].slice.call(arr,0,Math.max(0,arr.length - (n == null ?  1 : n)));
	}

	_.rest = function(arr,n){
		[].slice.call(arr,n == null ? n : 1);
	}
	var Ctor = function(){};
	var baseCreate = function(prototype){
		if(!_.isObject(prototype)) return {};
		if(Object.create) return Object.create(prototype);
		Ctor.prototype = prototype;
		var result = new Ctor();
		Ctor.protype = null;
		return result;
	};
	_.indentity = function(values){
		return value
	}
	_.isArray = function(array) {
		return toString.call(array) === "[object Array]";
	}
	_.each = function(target,callback){
		var key,i=0;
		if(_.isArray(target)){
			var length = target.length;
			for(;i<length;i++){
				callback.call(target,target[i],i);
			}
		}else{
			for(key in target){
				callback.call(target,key,target[key]);
			}
		}
	}
	_.each(['Object','Function','String','Number','Boolean','Arguments'],function(item){
		_['is'+item] = function(obj){
			return toString.call(obj) ===  '[object ' + item + ']';
		}
	})
	_.map = function(obj,iteratee,context){
		var interatee = cb(interatee,context);
		var keys = !_isArray(obj) && Objects.keys(obj);
		var length = (keys || obj).length;
		var result = Array(length);
		for(var i = 0;i<length;i++){
			var currentKey = keys ? onj[i] : i;
			result[i] = interatee.call(obj[currentKey],i,obj)
		}

		return result;


	}
	_.filter = _.select =  function(obj,interatee,context){
		var interatee = cb(interatee,context);
		var result = [];
		_.each(obj,function(value,index,list){
			if(interatee(value,index,list)) result.push(value);
		});
		return result;
	}
	_.isNaN = function(num){
		return _.isNumber(num) && num !== num;
	}
	_.biseSort = function(arr,item){
		var low = 0,high = mid = arr.length;
		while(low < high){
			mid = Math.floor((low+high)/2);
			if(arr[mid] < item) 
				low = mid + 1;
			else 
				high = mid;
		}
		return low;
	}
	function createPredicateIndexFinder(dir){
		return function(arr,predicate,context){
			var predicate = cb(predicate,context)
			var length = arr.length;
			var index = dir > 0 ? 0 : arr.length - 1;
			for(;index >= 0 && index < length;index += dir){
				if(predicate(arr[index],index,arr)) return index;
			}
			return -1;

		}
	}
	_.findNaN = createPredicateIndexFinder(1);
	_.findLastNaN = createPredicateIndexFinder(-1);
	function createIndexOf(dir,findNaN,biseSort){
		return function(arr,item,isSort){
			var i = 0,length = arr.length,index = -1;
			if(!_.isNaN(item) && isSort && biseSort){
				index = biseSort(arr,item);
				return  arr[index] === item ? index : -1;
			}
			else if(item !== item){
				index = findNaN(arr,_.isNaN);
				return index;
			}
			for(i = dir > 0 ? 0 : arr.length-1;i>= 0 && i<length;i += dir){
				if(arr[i] == item) return i;
			}
			return -1;

		}
	}
	_.indexOf = createIndexOf(1,_.findNaN,_.biseSort);
	_.lastIndexOf = createIndexOf(-1,_.findLastNaN);
	function cb(interatee,context,count){
		if(interatee == null){
			return _.identity
		}
		if(_.isFunction(interatee)){
			return optionmizeCb(interatee,context,count);
		}
	}
	function optionmizeCb(func,context,count){
		if(context == void(0)){
			return func;
		}
		switch(count == null ? 3 : count){
			case 1:
				return func.call(context,value);
			case 3:
				return function(value,index,obj){ 
					return func.call(context,value,index,obj);
				};
			case 4:
				return  function(memo, value, index, obj) {
					return func.call(context,memo,value,index,obj);
				};

		}
	}
	var createReduce = function(dir){
		var reduce = function(obj,interatee,memo,init){
			var keys = !_.isArray(obj) && obj.key;
			var length = keys ? keys.length : obj.length;
			var index = dir > 0 ? 0 : length -1;
			if(!init){
				memo = obj[keys ? keys[index]:index];
				index += dir
			}
			for(;index >= 0 && index < length;index += dir ){
				var currentKey = keys ? keys[index]:index;
				memo = interatee(memo,obj[currentKey],currentKey,obj);
			}
			return memo;
		}
		return function(obj,interatee,memo,context){
			var init = arguments.length >= 3;
			return reduce(obj,optionmizeCb(interatee,context,4),memo,init);
		}
	}
	_.reduce = createReduce(1);
	_.identity = function(value){
		return value;
	}
	_.result = function(instance,obj){
		return instance._chain ? _(obj) : obj;
	}
	_.chain = function(obj){
		//var instance = _(obj);
		this._chain = true;
		return this;
	}
	_.prototype.value = function(){
		return this.wrapped;
	}
	_.minxin = function(obj){
		_.each(_.functions(obj),function(name){
			var func = obj[name];
			_.prototype[name] = function(){
				var args = [this.wrapped];
				push.apply(args,arguments);
				return _.result(this,func.apply(this,args));
			}
		});

	}
	_.minxin(_)
	root._ = _;
})(this)