;(function ( $, window, document, undefined ) {

	var _name = 'carousel'
	,	_defaults = {
			interval: 5000
		,	pauseOn: 'hover click'
		,	itemSelector: '.js-carousel-item'
		,	controlSelector: '.js-carousel-control'
		,	hideControls: true
		,	hideDistance: 200
		,	animation: 'easeOutQuad'
		}

	Carousel = function(element, options) {
		this.name = _name;
		
		this.element = element;
		this.controls = $([]);
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
			break;
		}

		me.options[ key_ ] = value_;
	}

	Carousel.prototype.init = function() {
		var me = this
		,	$me = $(me.element);

		$me.on( 'addItem', me.__setOption( 'itemSelector', me.options.itemSelector ) );
		// TODO: Check if it works
	}

	Carousel.prototype.trackMouse = function( event_ ) {
		var me = this
		,	$me = $(me.element)
		,	x = event_.pageX - $me.offset().left
		,	carouselWidth = $me.width()
		,	prev = $.map( me.controls, function( control_ ) { if( control_.data('slide') === 'prev' ) return control_; })[0]
		,	next = $.map( me.controls, function( control_ ) { if( control_.data('slide') === 'next' ) return control_; })[0];
		
		me.options.hideDistance > x ?
			prev.fadeIn() :
			prev.fadeOut();

		me.options.hideDistance > carouselWidth - x  ?
			next.fadeIn() :
			next.fadeOut();
	}

	Carousel.prototype.slide = function( control_ ) {
		var me = this
		,	$me = $(me.element)
		,	_btn = $(control_)
		,	_direction = _btn.data( 'slide' );

		// console.log(_direction === 'next' && me.active === me.items.length);
		_direction === 'next' && me.active === me.items.length ? me.active = 0 : me.active++;
		_direction === 'prev' && me.active === 0 ? me.active = me.items.length : me.active--;
console.log(me.active);
		if( $.easing && me.options.animation in $.easing ) {
			$(me.items.eq(0)).animate({ left: me.active * -100 + '%' });
		}
		// else {
		// 	console.log('css')
		// }
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