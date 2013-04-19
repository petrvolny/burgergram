$(document).ready(function () {
	var animateBurger = function(){
		$('.animated').addClass('fadeInDown');
		setTimeout(function(){
			$('.loading').addClass('fadeOutDown');	
		},2000);
		setTimeout(function(){
			$('.animated').removeClass('fadeInDown');
			$('.loading').removeClass('fadeOutDown');	
		}, 2300);
		setTimeout(function(){
				animateBurger();
		}, 2310);
	}
	setTimeout(function(){
		animateBurger();	
	},10);

});