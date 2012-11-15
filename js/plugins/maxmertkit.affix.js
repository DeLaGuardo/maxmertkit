;(function ( $, window, document, undefined ) {

	var _name = 'affix'
	,	_defaults = {
			offset: 100	// Y
		,	position: 'top'
		,	inside: 'parent'
		}

	Affix = function(element, options) {
		this.name = _name;
		
		this.element = element;
		this.options = $.extend({}, _defaults, options);

		this.init();
	}

	Affix.prototype._setOptions = function( options_ ) {
		var me  = this;
		var $me = $(me.element);

		$.each( options_, function( key_, value_ ) {
			me._setOption( key_, value_ );
			me.__setOption( key_, value_ );

			var currentOption = { };
				currentOption[ key_ ] = value_;

			if( $.isFunction( value_ ) ) {
				me._on( $me, currentOption );
			}

		});
	}

	Affix.prototype._setOption = function( key_, value_ ) {
		var me  = this;
		var $me = $(me.element);

		switch( key_ ) {
			// case 'theme':
			// 	me.El.removeClass( '-' + me.options.theme + '-' );
			// 	me.El.addClass( '-' + value_ + '-' )
			// break;

			// case 'enabled':
			// 	value_ === true ? me.El.removeClass( '-disabled-' ) : me.El.addClass( '-disabled-' );
			// break;
		}
	}

	Affix.prototype._on = function( element_, handlers_ ) {
		var me = this;

		$.each( handlers_, function( event, handler ) {
			element_.bind( event + '.' + me.name, handler );
		});
	}
	
	Affix.prototype.enable = function() {
		var me = this;

		me._setOption( 'enabled', true )
	}

	Affix.prototype.disable = function() {
		var me = this;

		me._setOption( 'enabled', false )
	}

	Affix.prototype.getState = function() {
		return this.state;
	}

	Affix.prototype.init = function() {
		var me = this,
			$me = $(me.element);

		me.$window = $(window);
		
		me.$window.on( 'scroll.' + me.name, $.proxy(me.checkPosition, this) );
		me.$window.on( 'click.' + me.name, $.proxy( function() { setTimeout( $.proxy(me.checkPosition, this) , 1 ) }, this ) );

		me.$parent = me.options.inside === 'parent' ? $me.parent() : $me.closest( me.options.inside );
		$me.css({ top: me.$parent.offset().top + me.options.offset });

		me.checkPosition();
	}

	Affix.prototype.checkPosition = function() {
		var me = this
		,	$me = $(me.element);

		if( ! $me.is(':visible') ) return;
		
		
		var scrollHeight = $(document).height()
		,	scrollTop = me.$window.scrollTop()
		,	position = $me.offset()
		,	height = $me.outerHeight()
		,	offset = me.options.offset

		,	$parentHeight = me.$parent.outerHeight()
		,	$parentOffset = me.$parent.offset();
		
		var q = scrollTop + me.options.offset;
		
		if( q <= $parentOffset.top ) {
			$me.css({
				position: 'absolute',
				top: $parentOffset.top
			});
		} else if( $parentOffset.top + me.$parent.outerHeight() - height <= q && q >= $parentOffset.top ) {
			$me.css({
				position: 'absolute',
				top: $parentOffset.top + $parentHeight - height
			});
		} else {
			$me.css({
				position: 'fixed',
				top: offset
			});
		}
	}

	Affix.prototype._getOtherInstanses = function( instanses_ ) {
		var me = this;
		
		return $.grep( instanses_ , function( el ) {
			return $.data($(el[0]), 'kit-' + me.name) !== me;
		});
		
	}

	Affix.prototype._removeInstanse = function( instanses_ ) {
		var me = this;
		
		var what
		,	a = arguments.splice(0,1)
		,	L = a.length
		,	ax;

		while( L && instanses_.length ) {
			what = a[ --L ];
			
			while( (ax = instanses_.indexOf( what ) ) != -1 ){
				instanses_.splice( ax, 1 );
			}
		}

		return me;
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Affix( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );