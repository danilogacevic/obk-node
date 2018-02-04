(function() {

"use strict";
	
	// ------------------------------------
	// Isotope
	// ------------------------------------
	var $containerIsotope = $('#container-isotope');
	$containerIsotope.imagesLoaded( function(){
		$containerIsotope.isotope({
			resizable: false, // disable normal resizing
			itemSelector : '.isotope-item'
		});
	});

	$(window).smartresize(function(){
		$containerIsotope.isotope({
			itemWidth: $('.isotope .isotope-item').width()
		});
	});

	// filter items when filter link is clicked
	$('#filters a').click(function(){
		var selector = $(this).attr('data-filter');
		$containerIsotope.isotope({ filter: selector });
		// add .active class to <li> and remove others
		$(this).parent().parent().find('.active').removeClass('active');
		$(this).parent().addClass('active');
		return false;
	});



	// ------------------------------------
	// Masonry
	// ------------------------------------
	var $containerMasonry = $('#container-masonry');
	$containerMasonry.masonry({
		resizable: false, // disable normal resizing
		itemSelector: '.masonry-item',
		columnWidth: $('.masonry .masonry-item').outerWidth(true)
	});

	$(window).smartresize(function(){
		$containerMasonry.masonry({
			columnWidth: $('.masonry .masonry-item').outerWidth(true)
		});
	});



	


})();