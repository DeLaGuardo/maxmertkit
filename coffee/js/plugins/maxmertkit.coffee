jQuery ->

	defaults =
		name: 'maxmertkit'
		state: 'initialized'
		enabled: on
		theme: 'primary'

	class $.kit

		constructor: ( @el, @options ) ->

			@$el = $( @el )
			@options = $.extend {}, defaults, @options
			
			@init()


		init: ->

			@setOptions( @options )


		setOptions: ( options ) ->

			# TODO: Maybe this is not necessary
			if not options?
				options = @options

			$.each options, ->
				if $.isFunction(value) then setMethod( key, value ) else setOption( key, value )


		setOption: ( key, value ) ->

			if key? and value?

				switch key

					when 'theme'
						@$el
							.removeClass(@options.theme)
							.addClass "-#{value}-"

				@options[key] = value


		setMethod: ( event, handler ) ->

			@$el.bind "#{event}.#{@name}", handler


		enable: ->

			setOption 'enabled', yes


		disable: ->

			setOption 'enabled', no


		pushInstanse: ->

			@abbys.push @el