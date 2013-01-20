jQuery ->

	defaults =
		placement: 'top'			# Popup's place instead of element
		offset: [0, 0]				# In px. [x, y] from current position
		autoOpen: no				# Open after initialize
		onlyOne: no					# Close all instances and open current instance
		closeAfterFocusLoss: yes	# Close when clicked somewhere at the document
		trigger: 'click'			# Action to open popup's current instance. Use 'hover' instead of 'mouseenter' and 'mouseleave'. Through comma. If just one action, then it will double ( 'click' = 'click, click' )
		delay: 0					# In ms. Delay before open current instance

		template: null

		beforeOpen: null
		open: null
		openedOrNot: null			# It will work even if instance did not opened
		notOpened: null

		beforeClose: null
		close: null
		closedOrNot: null			# It will work even if instance did not closed
		notClosed: null


	class Popup extends $.kit

		
		init: ->

			# Set up popup element

			@popup = null

			if _isSelector( @options.template )
				@popup = $( $(@options.template).html() )
			else
				@popup = $( @options.template )

			if @popup?
				$('body').append @popup



			# Set up abbys for all instanses

			if not $.popup?
				$.popup = []

			@abbys = $.popup


			@timer = null	# Timer if @options.delay > 0
			@setOptions @options


		_isSelector: ( string ) ->

			string.charAt(0) is '.' or string.charAt(0) is '#'


		setOption: ( key, value ) ->

			if key? and value?

				switch key

					when 'theme'
						@popup
							.removeClass("-#{@options.theme}-")
							.addClass "-#{value}-"

					when 'placement'
						@popup
							.removeClass("_#{@options.placement}_")
							.addClass "_#{value}_"

					when 'trigger'
						events = value.split '/[ ,]+/'

						
						# Clear all binds
						if typeof @options[key]['in']?
							@$el.off "mouseenter.#{@name}, click.#{@name}"

						if typeof @options[key]['out']?
							@$el.off "mouseleave.#{@name}, click.#{@name}"


						@options[key] = 
							'in': events[0]
							'out': if events[1]? then events[1] else events[0]



						switch @options[key]['in']

							when 'hover'
								
								@$el.on "mouseenter.#{@name}", (event) =>
									@open() if @state is 'closed'

							else

								@$el.on "#{@options[key]['in']}.#{@name}", (event) =>
									@open() if @state is 'closed'


						switch @options[key]['out']

							when 'hover'

								@$el.on "mouseleave.#{@name}", (event) =>
									@close() if @state is 'opened'

							else

								@$el.on "#{@options[key]['out']}.#{@name}", (event) =>
									@close() if @state is 'opened'


					when 'animation'
						if not ( $.easing? and value of $.easing )
							if value of ['scaleIn', 'growUp', 'rotateIn', 'dropIn']
								@popup
									.removeClass("-mx-#{@options.animations}")
									.addClass "-mx-#{value}"

				

				@options[key] = value if key isnt 'trigger'