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

		_setOption: ( key, value ) ->
			me = @

			# Do something if changing specific option
			switch key

				when 'enabled'
					if value then @$el.removeClass( '-disabled-' ) else @$el.addClass( '-disabled-' )

				when 'content'
					if value isnt undefined and value isnt null
						@$popup.find( '.js-content' ).html value
					else
						@$popup.find( '.js-content' ).html @$el.data 'content'

				when 'placement'
					if @options.placement isnt undefined
						@$popup.removeClass @options.placement

					@$popup.addClass '_' + value + '_'

				when 'animation'
					if $.easing isnt undefined or not value_ of $.easing
						switch value
							when 'scaleIn'
								@$popup.addClass('-mx-scaleIn')

							when 'growUp'
								@$popup.addClass('-mx-growUp')

							when 'rotateIn'
								@$popup.addClass('-mx-rotateIn')

							when 'dropIn'
								@$popup.addClass('-mx-dropIn')

				when 'theme'
					if @options.theme isnt undefined
						@$popup.removeClass '-'+@options.theme+'-'

					@$popup.addClass '-'+value+'-'


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
								me.close() if me.state is 'opened'
						else
							@$el.on me.event( @options[ key ].out ), ( event ) ->
								me.close() if me.state is 'opened'
								event.preventDefault()

			# After all processes save option
			@options[ key ] = value;


		init: ->
			@state = 'closed'


			# Check if template has selector
			# 	then find it in DOM
			# 	else create element and add it to DOM
			if @options.template.charAt( 0 ) isnt '.' and @options.template.charAt( 0 ) isnt '#'
				@$popup = $( @options.template )
			else
				@$popup = $( $(@options.template).html() )

			

			@_setOptions $.extend {}, _defaults, @options
			@name = _name
			
			

			@$popup.css
				position: 'absolute'
				display: 'none'
			.find('.-arrow')
				.css
					opacity: 0

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
			
			# Timer before popup show
			@timeout = setTimeout ->
				
				# We can show popup if its not already opened and its enabled
				if me.options.enabled is on and me.state isnt 'opened'
					
					# We use state to check popup's condition
					me.state = 'in'

					# Do beforeOpen() function if it exists
					if me.options.beforeOpen isnt undefined
						before = me.options.beforeOpen.call me.$el
						before
							.done ->
								me._open()
							.fail ->
								me.state = 'closed'
								me.$el.trigger me.event( 'ifOpenedOrNot' )
								me.$el.trigger me.event( 'ifNotOpened' )

					# If there is no beforeOpen(), then just show popup
					else
						me._open()

			, @options.delay


		_open: ->
			me = @

			if @state is 'in'

				# If we can show only one instance of the popup, then
				# check all instances status, and
				# if status is opened, then close instance
				if @options.onlyOne is on
					
					$.each @_getInstances($.popup), ->
						instance = $(@).data 'kit-'+me.name
						instance.close() if instance.getState() is 'opened'

				# Popup positioning
				@_setPosition()

				# Show animation or just show popup
				if @options.animation isnt undefined
					@_openAnimation() 
				else 
					@$popup
						.show()
						.find('.-arrow')
						.css(opacity: 1)

				@state = 'opened'

				@$el.trigger @event 'open'

			@$el.trigger @event 'ifOpenedOrNot'			


		_openAnimation: ->
			animation = @options.animation.split /[ ,]+/
			animationIn = animation[0]
			animationOut = animation[1]

			if $.easing isnt undefined and ( animationIn of $.easing or animationOut of $.easing )
				@$popup.slideDown
					duration: @options.animationDuration
					easing: animationIn
					complete: ->
						$(@).find( '.-arrow' ).animate opacity: 1

			else
				@$popup
					.show()
					.find( '.-arrow' ).css opacity: 1
				if Modernizr isnt undefined and Modernizr.csstransitions and Modernizr.csstransforms3d and Modernizr.cssanimations
					@$popup.addClass '-mx-start'


		_setPosition: ->
			buttonWidth = @$el.outerWidth()
			buttonHeight = @$el.outerHeight()
			buttonPosition = @$el.offset()
			popupHeight = @$popup.outerHeight()
			popupWidth = @$popup.outerWidth()
			arrowSize = 8

			# Fix. If buttun and popup are in position:fixed element
			zIndex = 1
			position = 'absolute'

			$.each @$el.parents, (index, item) ->
				$item = $(item)
				itemZIndex = $item.css('z-index')
				if itemZIndex isnt 'auto' and parseInt( itemZIndex ) > zIndex
					zIndex = itemZIndex + 1
				if $item.css( 'position' ) is 'fixed'
					position = 'fixed'

			@$popup.css zIndex: zIndex
			if position is 'fixed'
				buttonPosition.top += $(document).scrollTop()

			switch @options.placement
				when 'top'
					positionSetter =
						top: buttonPosition.top - popupHeight - arrowSize + @options.offset[0]
						left: buttonPosition.left + buttonWidth / 2 - popupWidth / 2 + @options.offset[1]

				when 'bottom'
					positionSetter = 
						top: buttonPosition.top + buttonHeight + arrowSize + @options.offset[0]
						left: buttonPosition.left + buttonWidth / 2 - popupWidth / 2 + @options.offset[1]

				when 'left'
					positionSetter = 
						top: buttonPosition.top + buttonHeight / 2 - popupHeight / 2 + @options.offset[0]
						left: buttonPosition.left - popupWidth - arrowSize + @options.offset[1]

				when 'right'
					positionSetter = 
						top: buttonPosition.top + buttonHeight / 2 - popupHeight / 2 + @options.offset[0]
						left: buttonPosition.left + buttonWidth + arrowSize + @options.offset[1]

			@$popup.css positionSetter


		close: ->
			me = @
			clearTimeout @timeout

			if @options.enabled is on and @state isnt 'closed'
				@state = 'out'

				if @options.beforeClose isnt undefined
					after = @options.beforeClose.call @$el
					after
						.done ->
							me._close()
						.fail ->
							me.$el.trigger me.event 'ifNotClosed'
							me.$el.trigger me.event 'ifClosedOrNot'
							me.state = 'opened'
				else
					@_close()


		_close: ->
			if @state is 'out'
				if @options.animation is undefined
					@$popup.hide()
				else
					@_closeAnimation()
				@state = 'closed'
				@$el.trigger @event 'close'

			@$el.trigger @event 'ifClosedOrNot'


		_closeAnimation: ->
			animation = @options.animation.split /[ ,]+/
			animationIn = animation[0]
			animationOut = animation[1]

			if $.easing isnt undefined and ( animationIn of $.easing or animationOut of $.easing )
				@$popup.slideUp
					duration: @options.animationDuration
					easing: animationOut
					complete: ->
						$(@).find( '.-arrow' ).animate opacity: 0

			else
				if Modernizr isnt undefined and Modernizr.csstransitions and Modernizr.csstransforms3d and Modernizr.cssanimations
					@$popup.removeClass '-mx-start'


	$.fn[ _name ] = ( options ) ->
		@each ->
			instance = $.data @, 'kit-' + _name
			if not instance
				$.data @, 'kit-' + _name, new Popup this, options
			else
				if typeof(options) is 'object'
					instance._setOptions options
				else
				if typeof(options) is 'string' and options.charAt(0) isnt '_'
					instance[options]
				# else 
				# 	$.error( 'Error in popup' )