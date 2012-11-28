jQuery ->
	
	_name = 'popup'
	_defaults = 
		placement: 'top'
		offset: [0, 0]
		autoOpen: false
		template: '<div class="js-content"></div>'
		onlyOne: false
		content: null
		header: null
		trigger: 'click'
		delay: 0

		# beforeOpen: $.noop()
		# open: $.noop()
		# ifOpenedOrNot: $.noop()
		# ifNotOpened: $.noop()
		# beforeClose: $.noop()
		# close: $.noop()
		# ifClosedOrNot: $.noop()
		# ifNotClosed: $.noop()

	class Popup extends $.kit

		constructor: (@element, options) ->
			@$el = $(@element)
			@name = _name
			@_setOptions $.extend {}, _defaults, options
			@init()

		_setOption: ( key, value ) ->
			me = @

			# Do something if changing specific option
			switch key
				
				when 'theme'
					@$el.removeClass '-' + @options.theme + '-'

				when 'enabled'
					if value then @$el.removeClass( '-disabled-' ) else @$el.addClass( '-disabled-' )

				when 'trigger'
					events = value.split /[ ,]+/

					# Off all binds from clicker
					@$el.off @.event('mouseenter'), @.event('mouseleave'), @.event('click')

					# Set trigger.in and trigger.out
					@options[ key ] =
						'in': events[0]
						'out': if events[1] isnt undefined and events[1] isnt '' then events[1] else events[0]

					# If trigger.in is hover
					#	then set 'mouseenter' event
					# 	else set custom event
					switch @options[ key ].in
						when 'hover'
							@$el.on me.event('mouseenter'), ( event ) ->
								me.open() if me.state is 'closed'
						else
							@$el.on me.event( @options[ key ].in ), ( event ) ->
								me.open() if me.state is 'closed'
								event.preventDefault()

					# If trigger.out is hover
					# 	then set 'mouseleave' event
					# 	else set custom event
					switch @options[ key ].out
						when 'hover'
							@$el.on me.event('mouseleave'), ( event ) ->
								me.close() if me.state is 'open'
						else
							@$el.on me.event( @options[ key ].out ), ( event ) ->
								me.close() if me.state is 'open'
								event.preventDefault()

			# After all processes save option
			@options[ key ] = value;


		init: ->
			@state = 'closed'

			# Check if template has selector
			# 	then find it in DOM
			# 	else create element and add it to DOM
			if @options.template.charAt( 0 ) != '.' or @options.template.charAt( 0 ) != '#'
				@$popup = $( @options.template )
			else
				@$popup = $( $(@options.template).html() )
				$( 'body' ).append @$popup

			# Create instance collector if undefined
			# And push every instance to collector
			$.popup = [] if $.popup is undefined	
			$.popup.push @element if @element != undefined

			# Timer before popup show
			@timeout = undefined

			@open() if @options.autoOpen

			@


		
		open: ->
			me = @

			@timeout = setTimeout ->
				if me.options.enabled is on and me.state isnt 'opened'
					me.state = 'in'
					if me.options.beforeOpen isnt undefined
						before = me.options.beforeOpen.call me.$el
						before
							.done ->
								me._open()
							.fail ->
								me.state = 'closed'
								me.$el.trigger me.event( 'ifNotOpened' )
								me.$el.trigger me.event( 'ifOpenedOrNot' )
				else
					me._open()







	$.fn[ _name ] = ( options ) ->
		@each ->
			if not $.data @, 'kit-' + _name
				$.data @, 'kit-' + _name, new Popup this, options