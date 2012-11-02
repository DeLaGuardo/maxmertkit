;(function ( $, window, document, undefined ) {

	var tooltip = 'tooltip',
	defaults = {
		enabled: true
	,	onlyOneOpen: true
	,	animation: true
	,   placement: 'top'
	,   template: '<div class="-tooltip" style="display:none"><i class="-arrow"></i><div class="-tooltip-content"></div></div>'
	,	content: null
	,   theme: 'dark'
	,   trigger: 'hover'
	,   delay: 0
	};

	// Plugin constructor
	function Plugin( element, options ) {
		var me = this;

		me.element = element;

		me._defaults = defaults;
		me._name = tooltip;

		me.options = $.extend({}, me._defaults, options);

		me.tooltipElement = $(me.options.template);
		$('body').append( me.tooltipElement );

		me._setOptions( me._defaults );
		me._setOptions( options );

		if( $.tooltip === undefined )
			$.tooltip = [];
		
		$.tooltip.push(me.element);

		me.init();
	}

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

		switch ( _key ) {
			case 'theme':
				me.tooltipElement.addClass('-' + _value + '-')
			break;

			case 'trigger':
				var _events = _value.split(/[ ,]+/);
					
				if( me.options[_key].in !== undefined )
					$me.off( me.options[_key].in + '.' + me._name );

				if( me.options[_key].out !== undefined )
					$me.off( me.options[_key].out + '.' + me._name );

				me.options[_key] = {
					in: _events[0] 
				,   out: (_events[1] == undefined || _events[1] == '') ? _events[0] : _events[1]
				};
				

				$me.on( me.options[_key].in + '.' + me._name, function() {
					me.open();
				});
				$me.on( me.options[_key].out + '.' + me._name, function() {
					me.close();
				});
			break;

			case 'content':
				me.tooltipElement.find('.-tooltip-content').html(_value);
			break;

			case 'placement':
				me.tooltipElement.addClass('_' + _value + '_')
			break;

			default:
				me.options[_key] = _value;
		}
	}

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

	}






	Plugin.prototype.open = function() {
		var me  = this;
		var $me = $(me.element);
		
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
						})
				} catch( e ) {
					me._open();
				}
				
			}
			else {
				me._open();
			}
	}

	Plugin.prototype._open = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.options.onlyOneOpen )
			$.each(me._getOtherInstanses(), function() {
				if( $.data(this, 'plugin_' + tooltip).getState() === 'open' )
					$.data(this, 'plugin_' + tooltip).close();
			});

		me.tooltipElement.show();
		me.state = 'open';

		$me.trigger('open.' + me._name);
	}

	Plugin.prototype.close = function() {
		var me  = this;
		var $me = $(me.element);
		
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
							$me.trigger('ifNotClosed');
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

		me.tooltipElement.hide();
		me.state = 'close';

		$me.trigger('close');
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

	$.fn[tooltip] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + tooltip)) {
				$.data(this, 'plugin_' + tooltip, new Plugin( this, options ));
			}
			else {
				$.data(this, 'plugin_' + tooltip)._setOptions( options );
			}
		});
	}

})( jQuery, window, document );












// ;(function ( $, window, document, undefined ) {

// 	var tooltip = 'tooltip',
// 	defaults = {
// 		animation: true
// 	,   placement: 'top'
// 	,   template: '<div class="-tooltip"><i class="-arrow"></i><div class="-tooltip-content"></div></div>'
// 	,   theme: 'dark'
// 	,   trigger: 'hover'
// 	,   delay: 0
// 	,   debug: true
// 	};

// 	// Plugin constructor
// 	function Plugin( element, options ) {
// 		this.element = element;

// 		this.options = $.extend( {}, defaults, options) ;
// 		this._oldOptions = [];

// 		this._defaults = defaults;
// 		this._name = tooltip;

// 		this.init();
// 	}

// 	// Plugin.prototype.set = function( options ) {
// 	// 	var me  = this;
// 	// 	var $me = $(me.element);

// 	// 	// If you want to do something, when changing any property, do it here
// 	// 	var logic = function( param ) {
// 	// 		switch ( param ) {
				
// 	// 			case 'trigger':
					
// 	// 				// Get event model  
// 	// 				var _events = me.options.trigger.split(/[ ,]+/);
// 	// 				me.options.trigger = {
// 	// 					in: _events[0] 
// 	// 				,   out: (_events[1] == undefined || _events[1] == '') ? _events[0] : _events[1]
// 	// 				};

// 	// 				$me.off( '.' + me._name );
// 	// 				me.in( me.options.trigger.in );

// 	// 			break;

// 	// 			// If function ifThenOpen returns TRUE: call beforeOpen(); call open();
// 	// 			// else do nothing
// 	// 			case 'ifThenOpen':
// 	// 				if( typeof options[param] == 'function' ) {
// 	// 					$me.on( param + '.' + me._name , function( event ){
// 	// 						if( (options[param])() ) {
// 	// 							me._trigger('beforeOpen');
// 	// 							me.open();
// 	// 						}
// 	// 					});
// 	// 				}
// 	// 			break;
				
// 	// 			case 'beforeOpen':
// 	// 				if( typeof options[param] == 'function' ) {
// 	// 					$me.on( param + '.' + me._name, options[param]);
// 	// 				}
// 	// 			break;

// 	// 		}
// 	// 	}

// 	// 	// Save options, just in case
// 	// 	me._oldOptions.push( me.options );
		
// 	// 	if( me._oldOptions.length > 1 )
// 	// 		me.options = $.extend( {}, this.options, options) ;

// 	// 	if( typeof options == 'object' )
// 	// 	{
// 	// 		for( var param in options ){
// 	// 			if( options.hasOwnProperty(param) ) {
// 	// 				logic( param );
// 	// 			}
// 	// 		}
// 	// 	}

// 	// }

// 	Plugin.prototype.init = function () {
// 		var me  = this;
// 		var $me = $(me.element);

// 		me.state = 'close'; // close | in | open | out

// 		// this.set( me.options );
// 	};


// 	Plugin.prototype.in = function( event ) {
// 		var me  = this;
// 		var $me = $(me.element);

// 		// switch ( event ) {
// 		// 	case 'click':
// 		// 		$me.on( 'click.' + me._name, function( event ){
// 		// 			if( me.options.ifThenOpen )
// 		// 				me._trigger('ifThenOpen');
// 		// 			else {
// 		// 				me._trigger('beforeOpen');
// 		// 				me.open();
// 		// 			}

// 		// 			event.preventDefault();
// 		// 		});
// 		// 	break;
// 		// }
// 	}

// 	Plugin.prototype._checkOpen = function () {
		
// 	}	

// 	Plugin.prototype.open = function () {
// 		alert('opening');
// 	}




// 	Plugin.prototype._trigger = function ( trigger ) {
// 		var me  = this;
// 		var $me = $(me.element);

// 		$me.trigger( trigger + '.' + me._name );
// 	}

// 	$.fn[tooltip] = function ( options ) {
// 		return this.each(function () {
// 			if (!$.data(this, 'plugin_' + tooltip)) {
// 				$.data(this, 'plugin_' + tooltip, new Plugin( this, options ));
// 			}
// 			else {
// 				// $.data(this, 'plugin_' + tooltip).set( options );
// 			}
// 		});
// 	}

// })( jQuery, window, document );