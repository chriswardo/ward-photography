;(function ($, window, undefined) {
  'use strict';

  /* PLUGIN DEFINITION
   * ========================= */

  $.fn.wardCarousel = function (options) {
    var carousels = [];
    var current_slide = [];
    var timers = [];

    return this.each(function ( cid, c ) {
        carousels[cid] = $(this);
	current_slide[cid] = 0;

	var dots = $('<div class="dots"></div>');
	$(carousels[cid]).find('.slide').each( function( item_id, item ) {
		dots.append( $('<div class="dot-container"><div class="dot"></div></div>').click( function() { gotoSlide(cid,item_id); } ) );
	});
	carousels[cid].append( dots );
	
	
	setCarouselPos(cid,0,0); //initial position

	gotoSlide(cid,0); //start slideshow

	$(window).resize(function() {
		setCarouselPos( cid, $(carousels[cid]).width()*current_slide[cid], 0 );
	});


    });

	function gotoSlide(cid, slide) {
		clearTimeout( timers[cid] );
		current_slide[cid] = slide;
		setCarouselPos( cid, $(carousels[cid]).width()*slide, 2000 );
		slide++;
		if ( slide >= $(carousels[cid]).find('.slide').length ) slide = 0; //back to start
		if ( slide >= 0 && slide < $(carousels[cid]).find('.slide').length ) timers[cid] = setTimeout( function() { gotoSlide(cid, slide); }, 10000 );
	}

	function setCarouselPos( cid, pos, ms ) {
		var width = $(carousels[cid]).width();
		$(carousels[cid]).find('.dot').removeClass('active');
		$(carousels[cid]).find('.slide').each( function( item_id, item ) {
			$(item).animate( { left: ( (item_id * width) - pos ) }, ms, function() { setCurrentDot(cid); } );
		});
	}

	function setCurrentDot(cid) {
		$(carousels[cid]).find('.dot').removeClass('active').each( function( item_id, item ) {
			if ( item_id == current_slide[cid] ) $(this).addClass('active');
		});
	}
  }
;
}(jQuery, window));



