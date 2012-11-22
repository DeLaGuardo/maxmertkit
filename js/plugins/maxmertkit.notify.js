;(function ( $, window, document, undefined ) {

	var _name = 'notify'
	,	_defaults = {
			enabled: true
		,	animation: null
		,	animationDuration: 0
		,	theme: 'dark'

		,	template: '<div class="-notify-container js-notify-container"></div>'
		,	templateNotify: '<div class="-notify -mx-releaseIn _bottom_"></div>'
		,	templateNotifyHeader: '<div class="-notify-header"></div>'
		,	templateNotifyContent: '<div class="-notify-content"></div>'
		}

	Notify = function(message, options) {
		if( this.state === 'uninitialized' ) {
			this.name = _name;
			this._id = 0;
			this.notifications = [];
			this.archive = [];

			this.$element = $('<div class="-notify-container js-notify-container"></div>');
			$('body').append( this.$element );

			this.options = options === undefined ? 
								$.extend({}, _defaults, message) :
								$.extend({}, _defaults, options);
		}
		
		typeof options === 'object' && this._setOptions( options );
		typeof message === 'string' && this.notify( message, options );
		// options === undefined && this.showNotificationCenter();
		
	}

	Notify.prototype = new $.kit();
	Notify.prototype.constructor = Notify;


	Notify.prototype.__setOption = function( key_, value_ ) {
		var me  = this;
		var $me = me.$element;

		switch( key_ ) {
			case 'theme':
				$me.removeClass( '-' + me.options.theme + '-' );
				$me.addClass( '-' + value_ + '-' )
			break;

			case 'enabled':
				value_ === true ? $me.removeClass( '-disabled-' ) : $me.addClass( '-disabled-' );
			break;


		}

		me.options[ key_ ] = value_;
	}

	Notify.prototype.notify = function( message_, options_ ) {
		var me  = this
		,	$me = me.$element
		,	notification = {}
		,	header;
		
		notification.$element = $( me.options.templateNotify );
		notification._id = me._id++;
		notification.$element.attr('id', 'notification' + notification._id );

		options_ && $.each( options_, function( key_, value_ ) {
			switch( key_ ) {
				case 'header':
					notification.header = $( me.options.templateNotifyHeader ).append( value_ );
				break;

				case 'theme':
					notification.theme && notification.$element.removeClass( notification.theme );
					notification.$element.addClass( '-' + value_ + '-' );
					notification.theme = value_;
				break;
			}
		});

		notification.content = $( me.options.templateNotifyContent ).append( message_ );

		notification.$element.append( notification.header !== undefined && notification.header, notification.content );

		me.notifyShow( notification );
	}

	Notify.prototype.notifyShow = function( notification_ ) {
		var me  = this
		,	$me = me.$element;

		me.notifications.index = me.notifications.push( notification_ ) - 1;
		$me.append( notification_.$element );
		setTimeout(function(){ notification_.$element.addClass('-mx-start'); },1);
		// setTimeout(function(){
		// 	$me.find('#notification'+notification_._id).remove();
		// 	me.archive.push( me.notifications[me.notifications.index] );
		// 	me.notifications.slice( me.notifications.index, me.notifications.index );
		// }, 3000)
	}

	// Notify.prototype._getOtherInstanses = function( instanses_ ) {
	// 	var me = this;
		
	// 	// return $.grep( instanses_ , function( el ) {
	// 	// 	return $.data($(el[0]), 'notify-' + me.name) !== me;
	// 	// });
		
	// }

	// Notify.prototype._removeInstanse = function( instanses_ ) {
	// 	// var me = this;
		
	// 	// var what
	// 	// ,	a = arguments.splice(0,1)
	// 	// ,	L = a.length
	// 	// ,	ax;

	// 	// while( L && instanses_.length ) {
	// 	// 	what = a[ --L ];
			
	// 	// 	while( (ax = instanses_.indexOf( what ) ) != -1 ){
	// 	// 		instanses_.splice( ax, 1 );
	// 	// 	}
	// 	// }

	// 	// return me;
	// }

	$[_name] = function( message_, options_ ) {
		
		// return new Notify( options_ );
		// return this.each(function() {
			// console.log($('body').data( 'kit-' + _name ));
			if( ! $('body').data( 'kit-' + _name ) ) {
				$('body').data( 'kit-' + _name, new Notify( message_, options_ ) );
			}
			else {
				$('body').data( 'kit-' + _name).notify( message_, options_ );
			}
		// });
	}

})( jQuery, window, document );