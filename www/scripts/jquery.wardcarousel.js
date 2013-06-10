;(function ($, window, undefined) {
  'use strict';

  /* PLUGIN DEFINITION
   * ========================= */

  $.fn.wardCarousel = function (options) {
    var carousels = [];
    var current_slide = [];
    var timers = [];
    var slideshow = true;
    var mousedown_time = 0;
    var mousedown_posx = 0, mousedown_posy = 0;

    return this.each(function ( cid, c ) {
        carousels[cid] = $(this);
	current_slide[cid] = 0;

	var dots = $('<div class="dots"></div>');
	$(carousels[cid]).find('.slide').each( function( item_id, item ) {
		dots.append( $('<div class="dot-container"><div class="dot"></div></div>').click( function() { gotoSlide(cid,item_id,2000); } ) );
	});
	carousels[cid].append( dots );
	
	$(carousels[cid]).find('.slide[href]').mousedown( function(e) {
		mousedown_time = new Date();
		mousedown_posx = e.pageX;
		mousedown_posy = e.pageY;
	});
	$(carousels[cid]).find('.slide[href]').mouseup( function(e) {
		var now = new Date();
		var time_diff = now - mousedown_time;
		var pos_diff = Math.sqrt( Math.pow(e.pageX - mousedown_posx,2) + Math.pow(e.pageY - mousedown_posy,2) );

		if ( time_diff < 200 && pos_diff < 30 ) window.location.href = $(this).attr('href');		
	});	
	
	setCarouselPos(cid,0,0); //initial position

	gotoSlide(cid,0,0); //start slideshow

	$(window).resize(function() {
		setCarouselPos( cid, $(carousels[cid]).width()*current_slide[cid], 0 );
	});
	
	
	setupSwipe(cid);

    });

	function gotoSlide(cid, slide, ms) {

		$(carousels[cid]).find('.slide').removeClass('active');
		clearTimeout( timers[cid] );
		current_slide[cid] = slide;
		setCarouselPos( cid, $(carousels[cid]).width()*slide, ms );
		if ( slideshow ) {
			slide++;
			if ( slide >= $(carousels[cid]).find('.slide').length ) slide = 0; //back to start
			if ( slide >= 0 && slide < $(carousels[cid]).find('.slide').length ) timers[cid] = setTimeout( function() { gotoSlide(cid, slide, 2000); }, 10000 );
		}

	}

	function setCarouselPos( cid, pos, ms ) {
		if ( $(carousels[cid]).hasClass('sliding') ) return; //in process of sliding
		var width = $(carousels[cid]).width();
		$(carousels[cid]).find('.dot').removeClass('active');
		$(carousels[cid]).find('.slide').each( function( item_id, item ) {
			setCurrentDot(cid);
			if ( item_id != current_slide[cid] ) $(carousels[cid]).addClass('slideshowing');
			$(item).animate( { left: ( (item_id * width) - pos ) }, ms, function() { $(carousels[cid]).removeClass('slideshowing'); /*setCurrentDot(cid);*/ } );
		});
	}

	function setCurrentDot(cid) {
		$(carousels[cid]).find('.dot').removeClass('active').each( function( item_id, item ) {
			if ( item_id == current_slide[cid] ) $(this).addClass('active');
		});
	}


	function setupSwipe(cid) {
		carousels[cid].find('.slide:first').addClass('active');

		    var wrap = carousels[cid],
		    slides = wrap.find('.slide'),
		    active = slides.filter('.active'),
		    i = slides.index(active),
		    width = wrap.width();

		slides

		.on('swipeleft', function(e) {
			if (i === slides.length - 1) { return; }
			slides.eq(i + 1).trigger('activate');
		})

		.on('swiperight', function(e) {
			if (i === 0) { return; }
			slides.eq(i - 1).trigger('activate');
		})

		.on('activate', function(e) {
			$(slides).removeClass('active');

			jQuery(e.target).addClass('active');

			i = slides.index(e.target);
		})

		.on('movestart', function(e) {
			i = current_slide[cid];

			if ( wrap.hasClass('slideshowing') ) {
				e.preventDefault();
				return;
			}

			if ((e.distX > e.distY && e.distX < -e.distY) ||
			    (e.distX < e.distY && e.distX > -e.distY)) {
				e.preventDefault();
				return;
			}
			slideshow = false; //temporarily disable slideshow
			wrap.addClass('notransition');
			wrap.addClass('sliding');
		})

		.on('move', function(e) {
			width = wrap.width();
			var left = e.distX;
			if ( !wrap.hasClass('sliding') ) {
				return;
			}
			
			if (e.distX < 0) { //left
				if ( slides[i+1] ) { //if there's something to the right
					$(slides[i]).css('left', left);
					$(slides[i+1]).css('left',(left+width) );
				}
				else { //end
					$(slides[i]).css('left', left/4);
				}

			}
			if (e.distX > 0) { //right

				if ( slides[i-1] ) { //if there's something to the left
					$(slides[i]).css('left', left);
					$(slides[i-1]).css('left',(left-width) );
				}
				else { //end
					$(slides[i]).css('left', left/4);
				}

			}
		})

		.on('moveend', function(e) {
			width = wrap.width();
			wrap.removeClass('notransition');
			wrap.removeClass('sliding');
	
			var speed = 1; //pixels per ms
				
			var t = Math.abs( ($(slides[i]).position().left - 0) / speed );
			$(slides[i]).animate({ left: 0 }, t, function() { gotoSlide(cid, i, 0) });
			if ( $(slides[i-1]).length > 0 ) $(slides[i-1]).animate({ left: -width }, t, function() { } );
			if ( $(slides[i+1]).length > 0 ) $(slides[i+1]).animate({ left: width }, t, function() { } );
			
			slideshow = true;
		});


	}



  }
;
}(jQuery, window));



