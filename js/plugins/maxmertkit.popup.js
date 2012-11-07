;(function ( $, window, document, undefined ) {

	var _name = 'dropdown'
	,	_defaults = {
			placement: 'top'
		,	offset: [0, 0]
		,	autoOpen: false
		,	template: '<div class="-dropdown" style="display:none"><i class="-arrow"></i><div class="-dropdown-content js-content"></div></div>'
		}

	$.dropdown = function( element_, options_ ) {
		$.kit.apply( this, element_, options_ );

		this.element = element_;
		this.name = _name;

		this.options = $.extend( {}, this.options, _defaults );
		this.options = $.extend( {}, this.options, options_ );
		
		this.El = $(this.options.template);
		$('body').append( this.El );
		// CSS manupulations just in case
		this.El.css({position: 'absolute'});
		this.El.find('.-arrow').css({opacity: 0});

		this._setOptions( this.options );

		if( typeof $.dropdown.instanses === 'undefined' )
			$.dropdown.instanses = []
		
		if( this.element !== undefined )
			$.dropdown.instanses.push( this.element );
		
		this.timeout = null;

		this.init();
	}

	$.dropdown.prototype = new $.kit();
	$.dropdown.prototype.constructor = $.dropdown;

	$.dropdown.prototype._setOption = function( key_, value_ ) {
		var me  = this;
		var $me = $(me.element);

		switch( key_ ) {
			case 'theme':
				me.El.removeClass( '-' + me.options.theme + '-' );
				me.El.addClass( '-' + value_ + '-' )
			break;

			case 'enabled':
				value_ === true ? me.El.removeClass( '-disabled-' ) : me.El.addClass( '-disabled-' );
			break;

			case 'trigger':
				var _events = value_.split(/[ ,]+/);
					
				if( me.options[key_].in !== undefined )
					$me.off( 'mouseenter.' + me.name, 'click.' + me.name );

				if( me.options[key_].out !== undefined )
					$me.off( 'mouseleave.' + me.name, 'click.' + me.name );

				me.options[key_] = {
					in: _events[0] 
				,   out: (_events[1] == undefined || _events[1] == '') ? _events[0] : _events[1]
				};
				
				switch( me.options[key_].in ) {
					case 'hover':
						$me.on('mouseenter.' + me.name, function( event ) {
							if( me.state == 'closed' )
								me.open();
						});
					break;
					
					default:
						$me.on( me.options[key_].in + '.' + me.name, function() {
							if( me.state == 'closed' )
								me.open();
						});
				}

				switch( me.options[key_].out ) {
					case 'hover':
						$me.on('mouseleave.' + me.name, function( event ) {
							me.close();
						});
					break;

					default:
						$me.on( me.options[key_].out + '.' + me.name, function() {
							if( me.state == 'opened' )
								me.close();
						});
				}
			break;

			case 'content':
				if( value_ !== null )
					me.El.find('.js-content').html(value_);
				else
					me.El.find('.js-content').html( $me.data('content') );
			break;

			case 'placement':
				me.El.removeClass('_' + me.options.placement + '_')
				me.El.addClass('_' + value_ + '_')
			break;
				
		}

		if( key_ !== 'trigger' )
			me.options[ key_ ] = value_;
	}

	$.dropdown.prototype.init = function() {
		var me  = this;

		if( me.options.autoOpen )
			me.open()
	}

	$.dropdown.prototype.open = function() {
		var me  = this;
		var $me = $(me.element);
		
		me.timeout = setTimeout(function(){
			if( me.options.enabled === true && me.state !== 'opened' ) {
				
				me.state = 'in';

				if( me.options.beforeOpen !== undefined && (typeof me.options.beforeOpen === 'object' || typeof me.options.beforeOpen === 'function' )) {
					
					try {
						me.options.beforeOpen()
							.done(function(){
								me._open();
							})
							.fail(function(){
								me.state = 'closed';
								$me.trigger('ifNotOpened.' + me.name);
								$me.trigger('ifOpenedOrNot.' + me.name);
							})
					} catch( e ) {
						me._open();
					}
					
				}
				else {
					me._open();
				}
			}
		}, me.options.delay)
	}

	$.dropdown.prototype._open = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.state === 'in' ) {
			
			if( me.options.onlyOne )
				
				$.each( me._getOtherInstanses( $.dropdown.instanses ), function() {
					if( $.data( this, 'kit-' + me.name ).getState() === 'opened' )
						$.data( this, 'kit-' + me.name ).close();
				});

			me._setPosition();
			
			if( me.options.animation !== null && me.options.animation !== false )
			{	
				me.El.slideDown({
					duration: me.options.animationDuration,
					easing: me.options.animation,
					complete: function(){
						me.El.find('.-arrow').animate({opacity: 1});
					}
				});
			}
			else
			{
				me.El.find('.-arrow').css({opacity: 1});
				me.El.show();
			}
			
			me.state = 'opened';
			$me.trigger('open.' + me.name);
		}

		$me.trigger('ifOpenedOrNot.' + me.name);
	}

	$.dropdown.prototype.close = function() {
		var me  = this;
		var $me = $(me.element);
		
		clearTimeout( me.timeout );

		if( me.options.enabled === true && me.state !== 'closed' ) {

			me.state = 'out';

			if( me.options.beforeClose != undefined && (typeof me.options.beforeClose === 'object' || typeof me.options.beforeClose === 'function' ))
			{
				
				try {
					me.options.beforeClose()
						.done(function(){
							me._close();
						})
						.fail(function(){
							$me.trigger('ifNotClosed.' + me.name);
							$me.trigger('ifClosedOrNot.' + me.name);
							me.state = 'opened';
						})
				} catch( e ) {
					me._close();
				}
				
			}
			else {
				me._close();
			}
		}
	}

	$.dropdown.prototype._close = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.state === 'out' ) {
			me.El.find('.-arrow').css({opacity: 0});
			me.El.hide();
			me.state = 'closed';

			$me.trigger('close');	
		}
		
		$me.trigger('ifClosedOrNot.' + me.name);
	}

	$.dropdown.prototype._setPosition = function() {
		var me  = this;
		var $me = $(me.element);

		var actualWidth = $me.width();
		var actualHeight = $me.height();
		var actualPosition = $me.offset();
		
		var pos = {}

		switch( me.options.placement ) {
			case 'top':
				pos = { top: actualPosition.top - me.El.height() - 10 + me.options.offset[0], left: actualPosition.left + actualWidth / 2 - me.El.width() / 2 + me.options.offset[1] }
			break;

			case 'bottom':
				pos = { top: actualPosition.top + actualHeight + 5 + me.options.offset[0], left: actualPosition.left + actualWidth / 2 - me.El.width() / 2 + me.options.offset[1] };
			break;

			case 'left':
				pos = { top: actualPosition.top + actualHeight / 2 - me.El.height(), left: actualPosition.left - me.El.width() - 15 + me.options.offset[1] }
			break;

			case 'right':
				pos = { top: actualPosition.top + actualHeight / 2 - me.El.height(), left: actualPosition.left + actualWidth + me.options.offset[1] + 5 }
			break;
		}

		me.El.css(pos);
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new $.dropdown( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}
	
	

})( jQuery, window, document );