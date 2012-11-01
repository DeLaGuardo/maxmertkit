;(function ( $, window, document, undefined ) {

	var tooltip = 'tooltip',
	defaults = {
		animation: true
	,   placement: 'top'
	,   template: '<div class="-tooltip"><i class="-arrow"></i><div class="-tooltip-content"></div></div>'
	,   theme: 'dark'
	,   trigger: 'hover'
	,   delay: 0
	,   debug: true
	};

	// Plugin constructor
	function Plugin( element, options ) {
		var me = this;

		me.element = element;

		me._defaults = defaults;
		me._name = tooltip;

		me._set( defaults, options );
		me.init();
	}

	Plugin.prototype._set = function( __oldOptions, __options ) {
		var me = this;

		me.options = $.extend( {}, __oldOptions, __options) ;

		if( typeof __options == 'object' )
		{
			for( var param in __options ){
				if( __options.hasOwnProperty(param) ) {
					
					// This is options setter, and if you want to do something, when property changing, do it here.
					switch( param ) {

						case 'trigger':
							var _events = me.options.trigger.split(/[ ,]+/);
							me.options.trigger = {
								in: _events[0] 
							,   out: (_events[1] == undefined || _events[1] == '') ? _events[0] : _events[1]
							};
						break; // -trigger

					}
				}
			}
		}
	}

	Plugin.prototype.init = function () {
		var me  = this;
		var $me = $(me.element);

		me.state = 'close'; // close | in | open | out

	}

	$.fn[tooltip] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + tooltip)) {
				$.data(this, 'plugin_' + tooltip, new Plugin( this, options ));
			}
			else {
				$.data(this, 'plugin_' + tooltip)._set( $.data(this, 'plugin_' + tooltip).options, options );
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