;(function ( $, window, document, undefined ) {
	
	var _defaults = {
		enabled: true
	,	autoOpen: false
	,	onlyOneOpen: true 	// Close other instanses of plugin if true
	,	animation: null 	// 'easeOutElastic'
	,	duration: 400		// In ms, time of animation
	,   template: ''
	,   theme: 'dark' 		// All statuses of maxmertkit framework
	,   trigger: 'hover' 	// event-to-show, event-to-close ( 'hover, click' )
	,   delay: 0			// Delay before show
	}

	$.kit = function( name_, element_, options_ ) {
		this.name = name_;

		this.options = $.extend({}, _defaults, options_);
		this.element = element_;

		this._setOptions( this.options );

		this.init();
	}

	$.kit.prototype._setOptions = function( options_ ) {
		var me  = this;
		var $me = $(me.element);

		$.each( options_, function( key_, value_ ) {
			me._setOption( key_, value_ );

			var currentOption = {};
				currentOption[ key_ ] = value_;

			if( $.isFunction( value_ ) ) {
				me._on( $me, currentOption);
			}

		});
	}

	$.kit.prototype._setOption = function( key_, value_ ) {
		var me  = this;
		var $me = $(me.element);

		// React on setting options
		switch ( key_ ) {
			// case 'theme':
			// 	me.tooltipElement.removeClass('-' + me.options.theme + '-');
			// 	me.tooltipElement.addClass('-' + value_ + '-')
			// break;

			case 'trigger':
				var events = value_.split(/[ ,]+/);
					
				if( me.options[key_].in !== undefined )
					$me.off( 'mouseenter.' + me.name, 'click.' + me.name );

				if( me.options[key_].out !== undefined )
					$me.off( 'mouseleave.' + me.name, 'click.' + me.name );

				me.options[key_] = {
					in: events[0] 
				,   out: (events[1] == undefined || events[1] == '') ? events[0] : events[1]
				};
				
				switch( me.options[key_].in ) {
					case 'hover':
						$me.on('mouseenter.' + me.name, function( event ) {
							if( me.state == 'close' )
								me.open();
						});
					break;
					
					default:
						$me.on( me.options[key_].in + '.' + me.name, function() {
							if( me.state == 'close' )
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
							if( me.state == 'open' )
								me.close();
						});
				}
			break;

			case 'placement':
				me.tooltipElement.removeClass('_' + me.options.placement + '_')
				me.tooltipElement.addClass('_' + value_ + '_')
			break;

			default:
				me.options[key_] = value_;
		}
	}

	$.kit.prototype._on = function( element_, handlers_ ) {
		var me = this;

		$.each( handlers_, function( event, handler ) {
			element_.bind( event + '.' + me.name, handler );
		});
	}

	$.kit.prototype.init = function() {
		// console.log( 'init' );
	}

	$.fn[ $.kit.prototype.name ] = function( options_ ) {
		var name = $.kit.prototype.name;
		console.log( name );
		return this.each(function() {
			if( ! $.data( this, 'kit-' + name ) ) {
				$.data( this, 'kit-' + name, new $.kit( name, this, options_ ) )
			}
			else {
				if( typeof options_ === 'object' ) {
					$.data(this, 'kit-' + name)._setOptions( options_ );
				}
			}
		});
	}

})( jQuery, window, document );

// ;(function ( $, window, document, undefined ) {

// 	slice = Array.prototype.slice;

// 	$.kit = function( name_, base_, prototype_ ) {
		
// 		var fullName,
// 			namespace = name_.split( '.' )[0],
// 			constructor,
// 			existingConstructor,
// 			basePrototype;

// 			name = name_.split( '.' )[1];
// 			fullName = namespace + '-' + name;

// 			if ( ! prototype_ ) {
// 				prototype_ = base_;
// 				base_ = $.Kit;
// 			}

// 			$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
// 				return !!$.data( elem, fullName );
// 			};

// 			$[ namespace ] = $[ namespace ] || {};
// 			existingConstructor = $[ namespace ][ name ];
// 			constructor = $[ namespace ][ name ] = function( options, element ) {
// 				// allow instantiation without "new" keyword
// 				if ( !this._createKit ) {
// 					return new constructor( options, element );
// 				}

// 				// allow instantiation without initializing for simple inheritance
// 				// must use "new" keyword (the code above always passes args)
// 				if ( arguments.length ) {
// 					this._createKit( options, element );
// 				}
// 			};
// 			// extend with the existing constructor to carry over any static properties
// 			$.extend( constructor, existingConstructor, {
// 				version: prototype_.version,
// 				// copy the object used to create the prototype in case we need to
// 				// redefine the widget later
// 				_proto: $.extend( {}, prototype_ ),
// 				// track widgets that inherit from this widget in case this widget is
// 				// redefined after a widget inherits from it
// 				_childConstructors: []
// 			});

// 			basePrototype = new base_();

// 			// we need to make the options hash a property directly on the new instance
// 			// otherwise we'll modify the options hash on the prototype that we're
// 			// inheriting from
// 			basePrototype.options = $.kit.extend( {}, basePrototype.options );

// 			$.each( prototype_, function( prop_, value_ ) {
// 			if ( $.isFunction( value_ ) ) {
// 				prototype_[ prop_ ] = (function() {
// 					var _super = function() {
// 							return base_.prototype[ prop_ ].apply( this, arguments );
// 						},
// 						_superApply = function( args ) {
// 							return base_.prototype[ prop_ ].apply( this, args );
// 						};
						
// 						return function() {
// 							var __super = this._super,
// 								__superApply = this._superApply,
// 								returnValue;

// 							this._super = _super;
// 							this._superApply = _superApply;

// 							returnValue = value_.apply( this, arguments );

// 							this._super = __super;
// 							this._superApply = __superApply;

// 							return returnValue;
// 						};
// 					})();
// 				}
// 			});

// 		constructor.prototype = $.kit.extend( basePrototype, {
// 			// TODO: remove support for widgetEventPrefix
// 			// always use the name + a colon as the prefix, e.g., draggable:start
// 			// don't prefix for widgets that aren't DOM-based
// 			widgetEventPrefix: basePrototype.widgetEventPrefix || name
// 		}, prototype_, {
// 			constructor: constructor,
// 			namespace: namespace,
// 			name: name,
// 			fullName: fullName
// 		});

// 		// If this widget is being redefined then we need to find all widgets that
// 		// are inheriting from it and redefine all of them so that they inherit from
// 		// the new version of this widget. We're essentially trying to replace one
// 		// level in the prototype chain.
// 		if ( existingConstructor ) {
// 			$.each( existingConstructor._childConstructors, function( i, child ) {
// 				var childPrototype = child.prototype;

// 				// redefine the child widget using the same prototype that was
// 				// originally used, but inherit from the new version of the base
// 				$.widget( childPrototype.namespace + "." + childPrototype.name, constructor, child._proto );
// 			});
// 			// remove the list of existing child constructors from the old constructor
// 			// so the old child constructors can be garbage collected
// 			delete existingConstructor._childConstructors;
// 		} else {
// 			base_._childConstructors.push( constructor );
// 		}

// 		console.log(name);
// 		$.kit.bridge( name, constructor );
// 	}

// 	$.kit.extend = function( target_ ) {
// 		var args = slice.call( arguments, 1 )
// 		,	index = 0
// 		,	length = args.length
// 		,	key
// 		,	value;

// 		for( ; index < length; index++ ) {
// 			for( key in args[ index ] ) {

// 				value = args[ index ][ key ];
				
// 				if( args[ index ].hasOwnProperty( key ) && value !== undefined ) {

// 					// If we have an object value in heritable args
// 					// we need to propely extend it
// 					if( $.isPlainObject( value ) ) {
						
// 						// If we already have a value in target_[ key ]
// 						// then we need to extend it merge new and old values
// 						// else just add new value
// 						target_[ key ] = $.isPlainObject( target_[ key ] ) ?
// 							$.kit.extend( {}, target_[ key ], value ) :
// 							$.kit.extend( {}, value );

// 					}
// 					else
// 					{
// 						target_[ key ] = value;
// 					}

// 				}

// 			}
// 		}

// 		return target_;
// 	}

// 	$.kit.bridge = function( name_, target_ ) {
		
// 		var fullName = target_.prototype.fullName;

// 		$.fn[ name_ ] = function( options_ ) {

// 			// If type of options is "string"
// 			// then we should call method with passed name_
// 			var isMethod = typeof options_ === 'string'
// 			,	args = slice.call( arguments, 1 )
// 			,	returnValue = this;

// 			options = ! isMethod && args.length ?
// 				$.kit.extend.apply( null, [options].concat( args ) ) :
// 				options;

// 			if( isMethod ) {
// 				this.each(function() {
// 					var instance = $.data(this, fullName)
// 					,	methodValue;

// 					if( ! instance ) {
// 						return $.error( 'Can\'t call method' );
// 					}

// 					if( ! $.isFunction( instance[ options ] ) && options.charAt( 0 ) === '_' ) {
// 						return $.error( 'No such method' );
// 					}

// 					methodValue = instance[ options ].apply( instance, args );
					
// 					if ( methodValue !== instance && methodValue !== undefined ) {
// 						returnValue = methodValue && methodValue.jquery ?
// 							returnValue.pushStack( methodValue.get() ) :
// 							methodValue;
						
// 						return false;
// 					}
// 				})
// 			}
// 			else {
// 				this.each(function() {
// 					var instance = $.data( this, fullName );
					
// 					if ( instance ) {
// 						instance.option( options || {} )._init(); //-----------------
// 					}
// 					else {
// 						new object( options, this );
// 					}
// 				})
// 			}

// 			return returnValue;

// 		}
// 	}

// 	$.Kit = function(  ) {};
// 	$.Kit._childConstructors = [];
// 	$.Kit.prototype = {
// 		name: 'kit',
// 		fullName: 'kit-fullname', //-----------
// 		options: {
// 			def: 'default'
// 		},

// 	}

// })( jQuery, window, document );