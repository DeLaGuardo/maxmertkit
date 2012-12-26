jQuery ->

	_name = 'kit'
	_defaults = 
		enabled: true
		theme: 'dark'


	class $.kit

		constructor: (@el, options) ->
			@$el = $(@el)
			@name = _name
			@options = $.extend {}, _defaults, options
			@init()


		_setOptions: ( options ) ->
			me = @
			newFunction = ->
		
			@options = {} if @options is undefined

			$.each options, ( key, value ) ->
				me._setOption key, value

				if $.isFunction value
					newFunction[ key ] = value
					me._setFunctions newFunction


		_setFunctions: ( newFunctions ) ->
			me = @

			$.each newFunctions, ( event, func ) ->
				me.$el.bind event + '.' + me.name, func


		enable: ->
			@_setOption 'enabled', true


		disable: ->
			@_setOption 'enabled', false


		event: ( name ) ->
			name + '.' + @name


		getState: ->
			@state


		_getInstance: ( el ) ->
			$.data $( el )[0], 'kit-' + @name


		_getInstances: ( instances ) ->
			me = @

			$.grep instances, ( el ) ->
				me._getInstance( el ) != me


		_removeInstance: ( instances ) ->
			instancesToRemove = arguments.splice 0, 1
			removeLength = instancesToRemove.length

			while removeLength and instances.length
				instance = instancesToRemove[ --removeLength ]
				while ( ax = instances.indexOf instance ) != -1
					instances.splice ax, 1

			@

