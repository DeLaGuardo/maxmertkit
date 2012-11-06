;(function ( $, window, document, undefined ) {

	var tooltip = 'tooltip',
	defaults = {
		enabled: true 		// On all events if true
	,	autoOpen: false		// Open after initialize if true
	,	onlyOneOpen: true 	// Close other instanses of plugin if true
	,	animation: null 	// 'easeOutElastic'
	,	duration: 400		// In ms, time of animation
	,   placement: 'top' 	// top, bottom, left, right, Position of tooltip
	,	offset: [0, 0]		// In px [x, y]
	,   template: '<div class="-tooltip" style="display:none"><i class="-arrow"></i><div class="-tooltip-content"></div></div>'
	,	content: null		// Set any content of tooltip here
	,   theme: 'dark' 		// All statuses of maxmertkit framework
	,   trigger: 'hover' 	// event-to-show, event-to-close ( 'hover, click' )
	,   delay: 0			// Delay before show
	};

	// Plugin constructor
	function Plugin( element, options ) {
		var me = this;

		me.element = element;

		me._defaults = defaults;
		me._name = tooltip;

		me.options = $.extend({}, me._defaults, options);

		// Append tooltip element to the body
		me.tooltipElement = $(me.options.template);
		$('body').append( me.tooltipElement );

		// CSS manupulations just in case
		me.tooltipElement.css({position: 'absolute'});
		me.tooltipElement.find('.-arrow').css({opacity: 0});

		// We already have all options, but we need to react on the values
		me._setOptions( me.options );

		if( $.tooltip === undefined )
			$.tooltip = [];
		
		// Store all instanses in $.tooltip
		$.tooltip.push(me.element);

		// Timer before open
		me.timeout = null;
		
		me.init();
	}

	// Go through all _options and react on them (save or set events)
	Plugin.prototype._setOptions = function( _options ) {
		var me = this;
		var $me = $(me.element);

		$.each( _options, function( key, value ) {
			me._setOption( key, value );

			var currentOption = {};
				currentOption[key] = value;

			if( $.isFunction( value ) ) {
				me._on( $me, currentOption);
			}

		});
	}

	Plugin.prototype._setOption = function( _key, _value ) {
		var me  = this;
		var $me = $(me.element);

		// React on setting options
		switch ( _key ) {
			case 'theme':
				me.tooltipElement.removeClass('-' + me.options.theme + '-');
				me.tooltipElement.addClass('-' + _value + '-')
			break;

			case 'trigger':
				var _events = _value.split(/[ ,]+/);
					
				if( me.options[_key].in !== undefined )
					$me.off( 'mouseenter.' + me._name, 'click.' + me._name );

				if( me.options[_key].out !== undefined )
					$me.off( 'mouseleave.' + me._name, 'click.' + me._name );

				me.options[_key] = {
					in: _events[0] 
				,   out: (_events[1] == undefined || _events[1] == '') ? _events[0] : _events[1]
				};
				
				switch( me.options[_key].in ) {
					case 'hover':
						$me.on('mouseenter.' + me._name, function( event ) {
							if( me.state == 'close' )
								me.open();
						});
					break;
					
					default:
						$me.on( me.options[_key].in + '.' + me._name, function() {
							if( me.state == 'close' )
								me.open();
						});
				}

				switch( me.options[_key].out ) {
					case 'hover':
						$me.on('mouseleave.' + me._name, function( event ) {
							me.close();
						});
					break;

					default:
						$me.on( me.options[_key].out + '.' + me._name, function() {
							if( me.state == 'open' )
								me.close();
						});
				}
			break;

			case 'content':
				if( _value !== null )
					me.tooltipElement.find('.-tooltip-content').html(_value);
				else
					me.tooltipElement.find('.-tooltip-content').html( $me.data('tooltip-content') );
			break;

			case 'placement':
				me.tooltipElement.removeClass('_' + me.options.placement + '_')
				me.tooltipElement.addClass('_' + _value + '_')
			break;
		}

		me.options[_key] = _value;
	}

	// Set all callbacks here
	Plugin.prototype._on = function( _element, _handlers ) {
		var me = this;

		$.each( _handlers, function( event, handler ) {
			_element.bind( event + '.' + me._name, handler );
		});
	}

	Plugin.prototype.enable = function() {
		var me = this;

		me._setOption( enabled, true )
	}

	Plugin.prototype.disable = function() {
		var me = this;

		me._setOption( enabled, false )
	}

	Plugin.prototype.init = function () {
		var me  = this;
		var $me = $(me.element);

		me.state = 'close'; // close | in | open | out
		if( me.options.autoOpen ) {
			me.open();
		}
	}



	Plugin.prototype.open = function() {
		var me  = this;
		var $me = $(me.element);
		
		me.timeout = setTimeout(function(){
			if( me.options.enabled === true && me.state !== 'open' )

			me.state = 'in';

			if( me.options.beforeOpen != undefined && (typeof me.options.beforeOpen === 'object' || typeof me.options.beforeOpen === 'function' ))
			{
				
				try {
					me.options.beforeOpen()
						.done(function(){
							me._open();
						})
						.fail(function(){
							me.state = 'close';
							$me.trigger('ifNotOpened.' + me._name);
							$me.trigger('ifOpenedOrNot.' + me._name);
						})
				} catch( e ) {
					me._open();
				}
				
			}
			else {
				me._open();
			}
		}, me.options.delay)
	}

	Plugin.prototype._open = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.options.onlyOneOpen )
			$.each(me._getOtherInstanses(), function() {
				if( $.data(this, 'plugin_' + tooltip).getState() === 'open' )
					$.data(this, 'plugin_' + tooltip).close();
			});

		me._setPosition();
		
		if( me.options.animation !== null && me.options.animation !== false )
		{	
			me.tooltipElement.slideDown({
				duration: me.options.duration,
				easing: me.options.animation,
				complete: function(){
					me.tooltipElement.find('.-arrow').animate({opacity: 1});
				}
			});
		}
		else
		{
			me.tooltipElement.find('.-arrow').css({opacity: 1});
			me.tooltipElement.show();
		}
		
		me.state = 'open';
		$me.trigger('open.' + me._name);
		$me.trigger('ifOpenedOrNot.' + me._name);
	}

	Plugin.prototype.close = function() {
		var me  = this;
		var $me = $(me.element);
		console.log('close');
		clearTimeout( me.timeout );

		if( me.options.enabled === true && me.state !== 'close' )

			me.state = 'out';

			if( me.options.beforeClose != undefined && (typeof me.options.beforeClose === 'object' || typeof me.options.beforeClose === 'function' ))
			{
				
				try {
					me.options.beforeClose()
						.done(function(){
							me._close();
						})
						.fail(function(){
							$me.trigger('ifNotClosed.' + me._name);
							$me.trigger('ifClosedOrNot.' + me._name);
							me.state = 'open';
						})
				} catch( e ) {
					me._close();
				}
				
			}
			else {
				me._close();
			}
	}

	Plugin.prototype._close = function() {
		var me  = this;
		var $me = $(me.element);

		me.tooltipElement.find('.-arrow').css({opacity: 0});
		me.tooltipElement.hide();
		me.state = 'close';

		$me.trigger('close');
		$me.trigger('ifClosedOrNot.' + me._name);
	}

	Plugin.prototype._setPosition = function() {
		var me  = this;
		var $me = $(me.element);

		var actualWidth = $me.width();
		var actualHeight = $me.height();
		var actualPosition = $me.offset();
		
		var pos = {}

		switch( me.options.placement ) {
			case 'top':
				pos = { top: actualPosition.top - me.tooltipElement.height() - 10 + me.options.offset[0], left: actualPosition.left + actualWidth / 2 - me.tooltipElement.width() / 2 + me.options.offset[1] }
			break;

			case 'bottom':
				pos = { top: actualPosition.top + actualHeight + 5 + me.options.offset[0], left: actualPosition.left + actualWidth / 2 - me.tooltipElement.width() / 2 + me.options.offset[1] };
			break;

			case 'left':
				pos = { top: actualPosition.top + actualHeight / 2 - me.tooltipElement.height(), left: actualPosition.left - me.tooltipElement.width() - 15 + me.options.offset[1] }
			break;

			case 'right':
				pos = { top: actualPosition.top + actualHeight / 2 - me.tooltipElement.height(), left: actualPosition.left + actualWidth + me.options.offset[1] + 5 }
			break;
		}

		me.tooltipElement.css(pos);
	}

	Plugin.prototype.getState = function() {
		return this.state;
	}

	Plugin.prototype._getOtherInstanses = function() {
		var me = this;
		
		return $.grep( $.tooltip , function( el ) {
			return $.data(el, 'plugin_' + tooltip) !== me;
		})
		
	}

	Plugin.prototype._removeInstanse = function() {
		var me = this;
		
		var what, a= arguments, L= a.length, ax;

		while(L && $.tooltip.length){
			what= a[--L];
			while((ax= $.tooltip.indexOf(what))!= -1){
				$.tooltip.splice(ax, 1);
			}
		}

		return this;
		
	}

	Plugin.prototype.destroy = function() {
		var me  = this;
		var $me = $(me.element);

		me._removeInstanse(me.element);
		$me.off('.' + me._name);
		me.tooltipElement.remove();
		$me.removeData( 'plugin_' + tooltip );
	}

	$.fn[tooltip] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + tooltip)) {
				$.data(this, 'plugin_' + tooltip, new Plugin( this, options ));
			}
			else {
				if( typeof options === 'object' ) {
					$.data(this, 'plugin_' + tooltip)._setOptions( options );
				}
				// debugger;
				// if( typeof options === 'string' && options[0] !== '_' ) {
				// 	$.data(this, 'plugin_' + tooltip)[options];
				// }
			}
		});
	}

})( jQuery, window, document );