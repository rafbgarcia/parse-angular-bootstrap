module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    isRunningOnSnap: process.env.SNAP_CI,

    env: 'development',

    parseApps: {
      'development': '',
      'tests'      : '',
      'staging'    : ''
    },

    bower: {
      install: {
        options: {}
      }
    },

    copy: {
      fonts: {
        files: [
          { expand: true, cwd: 'lib/assets/vendor/bower/bootstrap-sass-official/vendor/assets/fonts/bootstrap', src: ['*'], dest: 'public/assets/bootstrap/', filter: 'isFile' },
          { expand: true, cwd: 'lib/assets/vendor/bower/fontawesome/fonts', src: ['*'], dest: 'public/assets/fonts/fontawesome', filter: 'isFile' }
        ]
      }
    },

    concat: {
      html: {
        files: {
          'public/index.html': ['lib/html/index.html'],
          'public/user/index.html': ['lib/html/user/index.html']
        },
      }
    },

    sass: {
      options: {
        includePaths: [
          'lib/assets/vendor/bower/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap',
          'lib/assets/vendor/bower/fontawesome/scss',
          'lib/assets/css'
        ]
      },
      dist: {
        files: {
          'public/assets/vendor.css': ['lib/assets/css/vendor-imports.scss'],
          'public/assets/app.css': ['lib/assets/css/app.scss']
        }
      }
    },

    watch: {
      options: {
        nospawn: true
      },
      gruntfile: {
        files: ['Gruntfile.js', 'bower.json'],
        tasks: ['concat']
      },
      html: {
        files: ['lib/html/**/*.html'],
        tasks: ['concat:html']
      },
      styles: {
        files: ['lib/assets/css/**/*.scss'],
        tasks: ['sass']
      },
      js: {
        files: ['lib/**/*.js', '!lib/assets/js/vendor/js/*.js', 'config/routes.js'],
        tasks: ['uglify:js']
      }
    },

    uglify: {
      options: {
        mangle: false,
        compress: false,
        beautify: true
      },
      js: {
        options: {
          separator: '\n;'
        },
        files: {
          'public/assets/config.js': ['lib/assets/js/config/<%= env %>.js'],
          'public/assets/vendor.js': [
            'lib/assets/vendor/bower/jquery/dist/jquery.js',
            'lib/assets/vendor/bower/lodash/dist/lodash.js',
            'lib/assets/vendor/bower/angular/angular.js',
            'lib/assets/vendor/bower/angular-ui-router/release/angular-ui-router.js',
            'lib/assets/vendor/bower/bootstrap-sass-official/vendor/assets/javascripts/bootstrap.js',
            'lib/assets/vendor/bower/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js',
            'lib/assets/vendor/bower/bootstrap-sass-official/vendor/assets/javascripts/**/*js',
            'lib/assets/vendor/bower/angular-bootstrap/ui-bootstrap-tpls.js',
            'lib/assets/vendor/js/**/*.js'
          ],
          'public/assets/lib.js': [
            'lib/assets/js/app/**/*.js',
            'lib/assets/js/initializers/*.js',
            'lib/init_modules.js',
            'config/routes.js'
          ],
          'public/assets/helpers.js': ['lib/helpers/*.js'],
          'public/assets/models.js': ['lib/models/*.js']
        }
      }
    },

    jslint: {

      production: {
        directives: {
          browser: true,
          indent: 2,
          white: true,
          nomen: true,
          predef: [
            'angular',
            '_'
          ]
        },

        src: [
          'lib/assets/js/**/*.js',
          'lib/helpers/**/*.js',
          'lib/models/**/*.js'
        ],
      },

      test: {
        directives: {
          node: true,
          indent: 2,
          white: true,
          nomen: true,
          unparam: true,
          predef: [
            '_',
            'describe', 'it', 'browser', 'expect', 'beforeEach', 'spyOn', 'xit', 'jasmine', // karma and jasmine
            'inject', // angular
            'element', 'by' // webdriver
          ]
        },

        src: [
          'spec/**/*.js',
        ],
      }
    },

    protractor: {
      options: {
        keepAlive: true,
        noColor: false
      },
      test: {
        options: {
          configFile: 'e2e.conf.js'
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    exec: {
      deploy: {
        command: "parse deploy <%= parseApps[env] %> -d \"Deploying revision $(git rev-parse --short HEAD)\""
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-jslint');

  grunt.registerTask('jslint:all', ['jslint:production', 'jslint:test']);
  grunt.registerTask('build', ['bower:install', 'jslint:all', 'sass', 'concat', 'uglify', 'copy:fonts']);
  grunt.registerTask('default', ['build']);

  grunt.registerTask('test_unit', ['tests_environment', 'build', 'karma:unit']);
  grunt.registerTask('test_functional', ['tests_environment', 'build', 'protractor:test']);

  grunt.registerTask('tests_environment', 'Set tests environment', setTestsEnvironment);
  grunt.registerTask('staging_environment', 'Set staging environment', setStagingEnvironment);

  grunt.registerTask('deploy_to_development', ['build', 'exec:deploy', 'exec:announce']);
  grunt.registerTask('deploy_to_staging', ['staging_environment', 'build', 'exec:deploy', 'exec:announce']);
  grunt.registerTask('deploy_to_tests', ['tests_environment', 'build', 'exec:deploy', 'exec:announce']);

  grunt.registerTask('ci', ['tests_environment', 'build', 'test_unit', 'exec:deploy', 'exec:announce', 'test_functional']);

  function setStagingEnvironment() {
    grunt.config.set('env', 'staging');
  }

  function setTestsEnvironment() {
    grunt.config.set('env', 'tests');
  }
};
