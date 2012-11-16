;(function ( $, window, document, undefined ) {

	var _name = 'slider'
	,	_defaults = {
			itemSelector: '.js-item'
		,	arrowLeft: '.js-arrow-left'
		,	arrowRight: '.js-arrow-right'
		}

	Slider = function(element, options) {
		this.name = _name;
		
		this.element = element;
		this.options = $.extend({}, _defaults, options);

		this.init();
	}

	Slider.prototype = new $.kit();
	Slider.prototype.constructor = Slider;

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Slider( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );