(function() {

  module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    return grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      meta: {
        banner: '/*\n\n<%= pkg.name %> web framework v<%= pkg.version %>\nhttp://maxmert.com\n\nIncludes jQuery.js\nhttp://jquery.com\n\nCopyright <%= grunt.template.today("yyyy") %> Vetrenko Maxim Sergeevich\nReleased under MIT license\n\nDate: <%= grunt.template.today() %>\n\n*/'
      },
      concat: {
        prod: {
          src: 'js/plugins/*.js',
          dest: 'js/plugins/min/maxmertkit.min.js'
        }
      },
      min: {
        prod: {
          src: '<%= concat.prod.dest %>',
          dest: '<%= concat.prod.dest %>'
        }
      },
      sass: {
        prodkit: {
          options: {
            style: 'compressed'
          },
          files: {
            'css/maxmertkit.css': 'css/sass/maxmertkit.scss',
            'css/maxmertkit-components.css': 'css/sass/maxmertkit-components.scss',
            'css/maxmertkit-animation.css': 'css/sass/maxmertkit-animation.scss'
          }
        },
        prodkitmain: {
          options: {
            style: 'compressed'
          },
          files: {
            'css/maxmertkit.css': 'css/sass/maxmertkit.scss'
          }
        },
        prodkitwidgets: {
          options: {
            style: 'compressed'
          },
          files: {
            'css/maxmertkit-components.css': 'css/sass/maxmertkit-components.scss'
          }
        },
        prodkitanimation: {
          options: {
            style: 'compressed'
          },
          files: {
            'css/maxmertkit-animation.css': 'css/sass/maxmertkit-animation.scss'
          }
        }
      },
      watch: {
        prod: {
          files: ['<%= concat.prod.src %>'],
          tasks: 'concat:prod min:prod'
        },
        prodkit: {
          files: ['css/sass/_font.scss', 'css/sass/_mixin.scss', 'css/sass/themes/*.scss', 'css/sass/modificators/*.scss', 'css/sass/classes/*.scss'],
          tasks: 'sass:prodkit'
        },
        prodkitmain: {
          files: ['css/sass/_init.scss', 'css/sass/maxmertkit.scss'],
          tasks: 'sass:prodkitmain'
        }
      }
    });
  };

}).call(this);
