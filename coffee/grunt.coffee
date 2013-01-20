module.exports = (grunt) ->

	grunt.initConfig

		pkg: grunt.file.readJSON 'package.json'

		meta:
			banner: '/*\n\n<%= pkg.name %> web framework v<%= pkg.version %>\nhttp://maxmert.com\n\nIncludes jQuery.js\nhttp://jquery.com\n\nCopyright <%= grunt.template.today("yyyy") %> Vetrenko Maxim Sergeevich\nReleased under MIT license\n\nDate: <%= grunt.template.today() %>\n\n*/'


		concat:
			prod:
				src: 'js/plugins/*.js'
				dest: 'js/plugins/min/maxmertkit.min.js'


		min:
			prod:
				src: '<%= concat.prod.dest %>'
				dest: '<%= concat.prod.dest %>'


		watch:
			prod:
				files: '<%= concat.prod.src %>'
				tasks: 'concat:prod min:prod'

