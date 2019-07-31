(function($){
	 $.fn.lazyload = function(settings){
	 	var setting = settings || {};
	 	var col = setting.col || 5,
	 	deft = setting.defaultImg || 'default.jpg',
	 	elem = this[0],
	 	allImg = this.find('img'),
	 	imgWidth = Math.floor(elem.clientWidth/col),
	 	loaded = 0,
	 	imgTop = 0,imgSrc,delay = null;

	 	allImg.attr('src',deft).width(imgWidth).height(imgWidth);
	 	update();

	 	function update(){
	 		 if(elem.scrollTop < elem.scrollHeight){
	 			for(var i = loaded;i< allImg.length;i++){
	 				imgTop = allImg[i].offsetTop
	 				if(imgTop < elem.clientHeight + elem.scrollTop){
						imgSrc = allImg[i].getAttribute('data-src');
						allImg[i].setAttribute('src',imgSrc);
						loaded = i;
	 				}
	 			}
	 		}
	 	}
	 	function _delay(){//函数节流
		    clearTimeout(delay);
		    delay = setTimeout(() => {
		       update();
		       console.log(loaded);
		    },100)
		};
	 	this.scroll(function(){
	 		_delay()
	 	});
	 }

 	

})($);