$(document).ready(function() {
	var desktop = {
                helpers : {
                        thumbs : true,
                        overlay : {
                            opacity: 0.9,
                        },
                        title: {
                        }
                },
                nextClick: true,
                //closeBtn : false,
                //arrows: false,
                openEffect  : 'fade',
                closeEffect : 'fade',
                nextEffect  : 'fade',
                prevEffect  : 'fade',
        };

	$("[rel='fancybox-thumb']").fancybox( desktop );

	setCoverBackground();
});
var prevWidth = $(window).width();
var prevHeight = $(window).height();
$(window).resize(function() {
	if ( Math.abs( $(window).width() - prevWidth ) > 20 || Math.abs( $(window).height() - prevHeight ) > 20 ) {

		//TODO: do this on a timer so as to not overload it when resizing
		waitForFinalEvent(function(){
			setCoverBackground();
		}, 1000, "resizing");

		prevWidth = $(window).width();
		prevHeight = $(window).height();

	}
});
$(window).bind('orientationchange', function(event) {
	adapt_to_orientation();
	setCoverBackground();

});

function setCoverBackground() {
	$.backstretch( $('body').attr('cover') );
}

var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

function adapt_to_orientation() {
	var content_width, screen_dimension;

	if (window.orientation == 0 || window.orientation == 180) {
		// portrait
		content_width = 630;
		screen_dimension = screen.width * 0.98; // fudge factor was necessary in my case
	} else if (window.orientation == 90 || window.orientation == -90) {
		// landscape
		content_width = 950;
		screen_dimension = screen.height;
	}

	var viewport_scale = screen_dimension / content_width;

	// resize viewport
	$('meta[name=viewport]').attr('content',
		'width=' + content_width + ',' +
		'minimum-scale=' + viewport_scale + ', maximum-scale=' + viewport_scale);
}
