;(function ( $, window, document, undefined ) {

	var _name = 'carousel'
	,	_defaults = {
			interval: 5000
		,	pauseOn: 'hover click'
		,	itemSelector: '.js-carousel-item'
		,	controlSelector: '.js-carousel-control'
		,	hideControls: true
		,	hideControlsDistance: 200
		,	animation: true
		
		,	imageFill: true
		,	imageShowAnimation: true
		,	imageShowInterval: 20000

		,	captionAnimation: 'blurIn'
		,	captionAnimationDelay: 1000

		,	navigation: true
		,	navigationPlacement: undefined
		,	theme: 'info'
		}

	Carousel = function(element, options) {
		var me = this;

		this.name = _name;
		
		this.element = element;
		this.controls = $([]);
		
		this.navigation = $('<div class="-carousel-nav"></div>');
		this.navigation.hide();
		$(this.element).append( this.navigation );
		this.navigation.on( 'click.' + this.name, function( event_ ) {
			if( $(event_.target).is('i') ) {
				var _oldActive = me.active;
				me.active = $(event_.target).index();
				me.slideAnimate( _oldActive );
			}
		});
		
		this.active = 0;
		this.options = $.extend({}, _defaults, options);

		this._setOptions( this.options );

		this.init();
	}

	Carousel.prototype = new $.kit();
	Carousel.prototype.constructor = Carousel;

	Carousel.prototype.__setOption = function ( key_, value_ ) {
		var me  = this;
		var $me = $(me.element);
		switch( key_ ) {

			case 'controlSelector':
				var _controls = $(document).find( value_ );
				me.controls.length > 0 &&
					me.controls.each( function( index_, control_ ) {
						control_.off( 'click.' + me.name);
					});
				me.controls = $([]);
				_controls.each( function( index_, item_ ) {
					$(document).find( $(item_).attr( 'href' ) )[0] === $(me.element)[0] &&  me.controls.push( $(item_) ) ;
				});
				me.controls.each( function( index_, control_ ) {
					control_.on( 'click.' + me.name,  function( event_ ) { $.proxy( me.slide( control_ ), me ); event_.preventDefault() });
				});
			break;

			case 'hideControls':
				$me.off( 'mousemove.' + me.name ) && value_ && $me.on( 'mousemove.' + me.name, function( event_ ) { $.proxy( me.trackMouse( event_ ), me) } );
			break;

			case 'itemSelector':
				me.items = $me.find( value_ );
				me.images = $.map( me.items, function( item_ ) { return $(item_).find( '> img' )[0] });
				me.captions = $.map( me.items, function( item_ ) { return $(item_).find( '.-carousel-caption > div' ) });
				me.navigation.html($.map( me.items, function( item_ ) { return $('<i></i>')}) );
			break;

			case 'imageFill':
				$me.imagesLoaded( function() {
					if( value_ && me.images ) {
						var carouselHeight = $me.innerHeight()
						,	carouselWidth = $me.innerWidth();

						$.each( me.items, function( index_, item_ ) {
							$(item_).css({height: '100%'});
						});

						$.each(me.images, function( index_, image_ ) {
							var imageWidth = $(image_).width()
							,	imageHeight = $(image_).height()
							,	aspectRatio = imageWidth / imageHeight;
							
							$(image_).css({ position: 'absolute', top: 0, left: 0 });

							carouselWidth / carouselHeight < aspectRatio ?
								$(image_).css({ width: 'auto', height: '100%' }) :
								$(image_).css({ width: '100%', height: 'auto' }) ;

						});
					}
				});
			break;

			case 'captionAnimation':
				switch( value_ ) {
					case 'blurIn':
						$.each( me.captions, function( index_, caption_ ) {
							$.each( caption_, function( index__, caption__ ) {
								$(caption__).addClass('-mx-blurIn');
							});
						});
					break;
				}
			break;

			case 'theme':
				$me.removeClass( '-' + me.options.theme + '-' );
				$me.addClass( '-' + value_ + '-' )
			break;

			case 'enabled':
				value_ === true ? $me.removeClass( '-disabled-' ) : $me.addClass( '-disabled-' );
			break;

			case 'navigation':
				me.options.navigation && me.navigation.fadeIn();
			break;

			case 'navigationPlacement':
				me.options.navigationPlacement && $me.addClass( '_' + value_ + '_' );
			break;
		}

		me.options[ key_ ] = value_;
	}

	Carousel.prototype.init = function() {
		var me = this
		,	$me = $(me.element);

		$me.on( 'addItem', me.__setOption( 'itemSelector', me.options.itemSelector ) );
		// TODO: Check if it works
		
		setTimeout($.proxy(me.slideAnimate, me), 200);
		$me.imagesLoaded( function() { $me.animate({ opacity: 1 }) });
	}

	Carousel.prototype.trackMouse = function( event_ ) {
		var me = this
		,	$me = $(me.element)
		,	x = event_.pageX - $me.offset().left
		,	carouselWidth = $me.width()
		,	prev = $.map( me.controls, function( control_ ) { if( control_.data('slide') === 'prev' ) return control_; })[0]
		,	next = $.map( me.controls, function( control_ ) { if( control_.data('slide') === 'next' ) return control_; })[0];
		
		me.options.hideControlsDistance > x ?
			prev.fadeIn() :
			prev.fadeOut();

		me.options.hideControlsDistance > carouselWidth - x  ?
			next.fadeIn() :
			next.fadeOut();
	}

	Carousel.prototype.slide = function( control_ ) {
		var me = this
		,	$me = $(me.element)
		,	_btn = $(control_)
		,	_direction = _btn.data( 'slide' )
		,	_oldActive = me.active;

		// me.clearImageShow();

		if( _direction === 'next' )
			me.active === me.items.length-1 ? me.active = 0 : me.active++;
		if( _direction === 'prev' )
			me.active === 0 ? me.active = me.items.length-1 : me.active--;
		
		me.slideAnimate( _oldActive );
	}

	Carousel.prototype.slideAnimate = function( from_ ) {
		var me = this
		,	$me = $(me.element);

		// Fist – if animation is in $.easing (HIGH priority)
		if( $.easing && me.options.animation in $.easing ) {
			$(me.items.eq(0)).animate({ marginLeft: me.active * -100 + '%' }, me.startImageShowAnimation(from_) );
		}
		// Second – if animation and csstransitions are available
		else if( me.options.animation && Modernizr.csstransitions ) {
			$(me.items.eq(0)).css({ marginLeft: me.active * -100 + '%' });
			me.startImageShowAnimation(from_);
		}
		// Third – if only animation is available
		else if( me.options.animation ) {
			$(me.items.eq(0)).animate({ marginLeft: me.active * -100 + '%' }, me.startImageShowAnimation(from_) );
		}
		
		me.navigation.find('._active_').removeClass('_active_');
		me.navigation.find('i').eq( me.active ).addClass('_active_');
	}

	Carousel.prototype.startImageShowAnimation = function( old_ ) {
		var me = this
		,	$me = $(me.element)
		,	oldImage = $(me.images[ old_ ])
		,	image = $(me.images[ me.active ])
		,	deltaHeight = $me.innerHeight() - image.height()
		,	deltaWidth = $me.innerWidth() - image.width();

		$me.imagesLoaded( function() {
			setTimeout(function(){
				oldImage.stop().css({ top:0, left:0 }); 
				$.each( me.captions[ old_ ], function( index__, caption__ ) {
					switch( me.options.captionAnimation ) {
						case true:
							setTimeout(function(){
								$(caption__).stop().animate({opacity:0});
							}, me.options.captionAnimationDelay * (index__ + 1));
						break;

						case 'blurIn':
							setTimeout(function(){
								$(caption__).removeClass( '-mx-start' );
							}, me.options.captionAnimationDelay * (index__ + 1));
						break;
					}
				});
			}, 1000);

			switch( me.options.imageShowAnimation ) {
				case 'scrollDown':
					image.addClass('-mx-scrollDown').css({ top: deltaHeight, left: deltaWidth });
				break;

				case 'scrollDown-fast':
					image.addClass('-mx-scrollDown-fast').css({ top: deltaHeight, left: deltaWidth });
				break;

				case true:
					image.animate({ top: deltaHeight, left: deltaWidth }, me.options.imageShowInterval);
				break;
			}
		});

		
		$.each( me.captions[ me.active ], function( index__, caption__ ) {
			switch( me.options.captionAnimation ) {
				case true:
					setTimeout(function(){
						$(caption__).animate({opacity:1});
					}, me.options.captionAnimationDelay * (index__ + 1));
				break;

				case 'blurIn':
					setTimeout(function(){
						$(caption__).addClass( '-mx-start' );
					}, me.options.captionAnimationDelay * (index__ + 1));
				break;
			}
		});
		
	}

	Carousel.prototype.setActive = function() {
		var me = this
		,	$me = $(me.element);

		$me.find( me.options.itemSelector + '._active_' ).removeClass( '_active_' );
		me.items.eq( me.active ).addClass( '_active_' );
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Carousel( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );