/* Author: Bima Arafah (@fgaeg) & Arif Widipratomo (@mambows)

*/


//Self invoke function, this will allow you to use '$' instead 'jQuery'
(function($){

// Fix sub menu position when topmenu exceed one line
function setSubmenuPos() {
	var primaryNav 	= $('.primary-nav'),
		primaryNavH	= primaryNav.innerHeight();
		subMenu		= primaryNav.find('> li > ul');
		subMenu.css('top', primaryNavH+5);
}

$(window).resize(function(){
	setTimeout(function(){
		setSubmenuPos();
	}, 200);
});

/**
// initialise plugins when document ready
///////////////////////////////////////////////
*/
$(document).ready(function() {

	// Fix submenu position on Ipad
	if( $(window).width <= 768 ) {
		setSubmenuPos();
	}

	// Back to top animation
	$('.back-top').click( function(){
		$('html, body').animate({ scrollTop: 0 });
	});

	/* trigger for radio button on search header */
	$("#radio-set-search").buttonset();

	/* superfish for primary menu on top */
	$('ul.primary-nav').superfish({
		dropShadows: false
	});

	/* Mobile Menu */
	$('.primary-navigation ul.primary-nav').mobileMenu();

	/* define function for login panel active on click */
	function login_btn_panel() {
		var mouse_is_inside = true;

		$(".login-link").click(function() {
			// toggle the class for .login-link
			$(this).toggleClass("highlight");

			var loginBox = $(".form-login-panel");
			if (loginBox.is(":visible")) {
				loginBox.fadeOut("fast");
			} else {
				loginBox.fadeIn("fast");
			}
			return false;
		});

		$(".form-login-panel").mouseup(function() {
			return false;
		});

		$(document).mouseup(function(e) {
			if($(e.target).parent("a.signin").length === 0) {
				$(".login-link").removeClass("highlight");
				$(".form-login-panel").css("display","none");
			}
		});

		$(".form-login-panel").hover(function(){
			mouse_is_inside=true;
		}, function(){
			mouse_is_inside=false;
		});

		$("body").click(function(){
			if(!mouse_is_inside)
				$(".form-login-panel").fadeOut("fast");
		});

	}
	login_btn_panel();


	/* Headline Carousel */
	function headlines() {

		$('#headlines-carousel').carouFredSel({
			responsive: true,
			circular: false,
			infinite: false,
			auto: false,
			items: {
				visible: 1,
				width: 200,
				height: "variables"
			},
			scroll: {
				fx: 'fade'
			}
		});

		$('#headlines-thumbs').carouFredSel({
			responsive: true,
			circular: false,
			infinite: false,
			auto: false,
			prev: '#prev',
			next: '#next',
			items: {
				visible: {
					min: 2,
					max: 4
				},
				width: 180
			}
		});

		$('#headlines-thumbs a').click(function() {
			$('#headlines-carousel').trigger('slideTo', '#'+this.href.split('#').pop());
			$('#headlines-thumbs a').removeClass('selected');
			$(this).addClass('selected');
			return false;
		});

	}
	headlines();


	// fire the carousel for widget
	$('#content .carousel-post').carouFredSel({
		responsive: true,
		circular: false,
		infinite: false,
		auto: false,
		prev: '.carousel-post-prev',
		next: '.carousel-post-next',
		pagination: ".carousel-post-pag",
		items: {
			visible: {
				min: 2,
				max: 4
			},
			width: 180
		}
	});

	$('#secondary .carousel-post').carouFredSel({
		responsive: true,
		circular: false,
		infinite: false,
		auto: false,
		pagination: ".carousel-post-pag",
		items: {
			visible: 2,
			width: 180
		}
	});



	// pulling request flickr feed via JSON method
	function pull_flickr_image_request() {
		// Our very special jQuery JSON fucntion call to Flickr, gets details of the most recent 20 images
		$.getJSON("http://api.flickr.com/services/feeds/groups_pool.gne?id=" + flickrid + "&lang=en-us&format=json&jsoncallback=?", displayImages);

		function displayImages(data) {
			// Randomly choose where to start. A random number between 0 and the number of photos we grabbed (20) minus 9 (we are displaying 9 photos).
			var iStart = Math.floor(Math.random()*(11));
			// Reset our counter to 0
			var iCount = 0;

			// Start putting together the HTML string
			var htmlString = "<ul>";

			// Now start cycling through our array of Flickr photo details
			$.each(data.items, function(i,item){

				// Let's only display 9 photos (a 3x3 grid), starting from a random point in the feed
				if (iCount > iStart && iCount < (iStart + 12)) {

					// I only want the ickle square thumbnails
					var sourceSquare = (item.media.m).replace("_m.jpg", "_s.jpg");

					// Here's where we piece together the HTML
					htmlString += '<li><a href="' + item.link + '" target="_blank">';
					htmlString += '<img src="' + sourceSquare + '" alt="' + item.title + '" title="' + item.title + '"/>';
					htmlString += '</a></li>';
				}
				// Increase our counter by 1
				iCount++;
			});
		// Pop our HTML in the #images DIV
		$('.widget_photos .widget-inner-content').html(htmlString + "</ul>");

		// Close down the JSON function call
		}
	}
	// then fire the function above to execute
	pull_flickr_image_request();



	// fire the custom bg image
	// if is set and ready, then call it
	if(custom_bg_image !== null) {
		$.supersized({
			transition: 1,
			slides: [ {image : custom_bg_image, title : 'newspaper portal'} ]
		});
	}


	// jquery ui tabs for widget
	$(".widget_tabs").tabs({
		event: "mouseover",
		fx: { opacity:'toggle', duration: 200 },
		show: function(event, ui) {
				$(this).css('height', 'auto');
		},
		cookie: {
			// cookie for a day, without, it would be a session cookie
			expires: 1
		}
	});


	// for subscribe with ui tabs
	$(".widget_subscribe").tabs({
		fx: { opacity:'toggle', duration: 200 },
		show: function(event, ui) {
				$(this).css('height', 'auto');
		},
		cookie: {
			// cookie for a day, without, it would be a session cookie
			expires: 1
		}
	});


	// for tabs related below the content on detail page
	$("#related-articles").tabs({
		fx: { opacity:'toggle', duration: 200 },
		show: function(event, ui) {
				$(this).css('height', 'auto');
		},
		cookie: {
			// cookie for a day, without, it would be a session cookie
			expires: 1
		}
	});


	// prevent default for event on each tabs link
	if ($().tabs) {
		$('.ui-tabs-nav a').click( function (e) {
			e.preventDefault();
		});
	}


	// jtweetsanywhere for widget twitter
	$('.widget-tweets').jTweetsAnywhere({
		// username: 'nukman',
		searchParams: ['q='+tweet],
		count: 3,
		showTweetFeed: {
			autoConformToTwitterStyleguide: true,
			expandHovercards: true,
			showSource: true,
			showTimestamp: {
				refreshInterval: 15
			},
			autorefresh: {
				mode: 'trigger-insert',
				interval: 30
			},
			paging: { mode: 'none' }
		},
		onDataRequestHandler: function(stats, options) {
			if (stats.dataRequestCount < 11) {
				return true;
			} else {
				stopAutorefresh(options);
				// alert("To avoid struggling with Twitter's rate limit, we stop loading data after 10 API calls.");
			}
		}
	});


	// sticky breadcrumb
	$("#nav-page").sticky({topSpacing:0,center:true});


	// ride the carousel
	$("#news-footer-carousel").carouFredSel({
		responsive: true,
		width: "100%",
		height: "auto",
		scroll: {
			// fx: "directscroll",
			// easing: "linear",
			pauseOnHover: true,
			items: "page"
		},
		auto: {
			play: false
		},
		items: {
			visible: {
				min: 2,
				max: 4
			}
		},
		prev	: {
			button	: "#news-footer-prev",
			key		: "left"
		},
		next	: {
			button	: "#news-footer-next",
			key		: "right"
		},
		pagination	: "#news-footer-pag"
	});

});

})(jQuery);


