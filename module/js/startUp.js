(function(global){
	var startUp = global.startUp = {
		version:'0.0.1'
	}
	var data = {};
	var cache = {};
	var anonymousMeta = {};
	var status = {
		FECTHED:1,
		SAVED :2,
		LOADING:3,
		LOADED:4,
		EXCUTING:5,
		EXCUTED:6
	};

	function isArray(arr){
		return toString.call(arr) === '[object Array]';
	}

	function isFunction(fn){
		return toString.call(fn) === '[object Function]'
	}

	function isString(str){
		return toString.call(str) === '[object String]'
	}

	function Module(uri,depths){
		this.uri = uri,
		this.depths = depths || [],
		this.exports = null,
		this.status = 0,
		this._waitings =  {}, 
		this._remains = 0;
	}
	
	Module.prototype.load = function(){
		var module = this;
		module.status = status.LOADING;
		var uris = module.resolve(); // 依赖列表
		var len = module._remains = uris.length;

		var m;
		for(var i = 0; i<len;i++){
			m = Module.get(uris[i]);
			if(m.status < status.LOADED){
				m._waitings[module.uri] = m._waitings[module.uri] || 1;   

			}else{
				module._remains --;
			}
			
		}
		if(module._remains == 0){
			module.onload();
		}

		var requestCache = {};
		for(var i = 0;i<len;i++){
			m = Module.get(uris[i]);
			if(m.status <  status.FECTHED){
				m.fecth(requestCache);
			}
		}
		for(var i in requestCache){
			requestCache[i]();
		}


	}

	Module.prototype.fecth = function(requestCache){
		var module = this;
		module.status = status.FECTHED;
		var uri = module.uri;
		requestCache[uri] = sendRequest;
		function sendRequest(){
			startUp.request(uri,onRequest);
		}
		function onRequest(){
			if(anonymousMeta){
				module.save(uri,anonymousMeta);
			}
			module.load()
		}
	}
	Module.prototype.onload =  function(){
		var mod = this;
		mod.status = status.LOADED;
		if(mod.callback){
			mod.callback();
		}
		_waitings = mod._waitings;
		var uri,m;
		for(uri in _waitings){
			m = cache[uri];
			m._remains -= _waitings[uri];
			if(m._remains == 0){
				m.onload();
			}
		}
	}
	Module.prototype.save = function(uri,meta){
		var mod = Module.get(uri);
		mod.id = uri;
		mod.depths = meta.depths || [];
		mod.factory = meta.factory;
		mod.status = status.SAVED;
	}
	Module.prototype.exec = function(){
		var module = this;
		if(module.status >= status.EXCUTING){
			return module.exports;
		}
		module.status = status.EXCUTING;

		var uri = module.uri;
		var factory = module.factory;
		function require(id){
			return Module.get(require.resolve(id)).exec();
		}
		require.resolve = function(id){
			return startUp.resolve(id,uri);
		}
		var exports = isFunction(factory) ? factory(require,module.exports = {},module) : factory;

		if (exports === undefined) {
			exports = module.exports;
		}
		module.exports = exports;
		module.status = status.EXECUTED; 
		return exports;

	}
	Module.prototype.resolve = function(){ //返回实例对象格式化后的依赖列表
		var mod = this;
		var ids = mod.depths;
		var uris = [];
		for(var i = 0;i<ids.length;i++){
			uris[i] = startUp.resolve(ids[i],mod.uri);
		}
		return uris;
	}
	Module.get = function(uri,depths){ 
		return cache[uri] || (cache[uri] = new Module(uri,depths));
	}

	Module.use = function(depths,callback,uri){
		var module = Module.get(uri,isArray(depths) ?  depths : [depths]);
		module.callback = function(){
			var exports = [];
			var uris = module.resolve();
			for(var i = 0;i<uris.length;i++){
				exports[i] = cache[uris[i]].exec();
			}
			if(callback){
				callback.apply(global,exports);
			}

		}
		module.load();

	}

	Module.define = function(factory){
		var depths;
		if (isFunction(factory)) {
			depths = parseDepths(factory.toString());
		}
		var meta = {
			id:"",
			uri:"",
			depths:depths,
			factory:factory
		}
		anonymousMeta = meta;
	}

	var REQUIRE_RE = /\brequire\s*\(\s*(['"])(.+)\1\s*\)/g
	function parseDepths(code){
		var  rect =[];
		code.replace(REQUIRE_RE,function(m1,m2,m3){
			if(m3)rect.push(m3);
		})
		return rect;
	}
	data.preload = [];
	var _cid = 0;
	function cid(){
		return _cid ++;
	}
	data.cwd = document.URL.match(/[^?]*\//g)[0];
	Module.preload = function(callback){
		var length = data.preload.length;
		!length && callback();
	} 
	 
	function parseAlias(path){
		var alias = data.alias;
		return  alias && isString(alias[path]) ? alias[path] : path;
	}
	var PATHS_RE = /^([^\/:]+)(\/.+)$/;
	function parsePath(id){
		var paths = data.paths;
		if(paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])){
			id = paths[m[1]] + m[2]
		}
		return id;
	}
	function addBase(id,uri){
		var result;
		
		uri = (uri ? uri.match(/[^?]*\//g)[0] : data.cwd);
		if (id.charAt(0) === ".") {
			result = replacePath( uri + id);
		}
		else{
			result = uri + id;
		}
		return result;
	}
	var DOT_RE = /\/\.\//g
	var DOT_DOUBLE = /\/[^\/]+\/\.\.\//
	function replacePath(path){
		path = path.replace(DOT_RE,'/');
		while(DOT_DOUBLE.test(path)){
			path = path.replace(DOT_DOUBLE,'/');
		} 
		console.log(path);
		return path;
	}
	function normalize(path){
		var last = path.length -1;
		var lastC = path.charAt(last);
		return (lastC === '/' || path.substring(last -2) === ".js") ? path :( path + '.js');
	}
	startUp.request = function(uri,callback){
		var node =  document.createElement('script');
		node.src = uri;
		document.body.appendChild(node);
		node.onload = function(){
			callback();
		}
	}
	startUp.config = function(config){
		var key;
		for(var key in config){
			data[key] = config[key];
		}
	}
	startUp.resolve = function(child,parent){
		if(!child) return  "";
		child = parseAlias(child);
		child = parsePath(child);
		child = normalize(child);
		return addBase(child,parent);
	}
	startUp.use = function(list,callback){
		Module.preload(function(){
			Module.use(list,callback,data.cwd + '_use_' + cid());
		})
	}

	global.define = Module.define;
})(this);