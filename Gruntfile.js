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
        files: [{
          expand: true,
          cwd: 'lib/assets/vendor/bower/bootstrap-sass-official/vendor/assets/fonts/bootstrap',
          src: ['*'],
          dest: 'parse/public/assets/fonts/bootstrap',
          filter: 'isFile'
        }, {
          expand: true,
          cwd: 'lib/assets/vendor/bower/fontawesome/fonts',
          src: ['*'],
          dest: 'parse/public/assets/fonts/fontawesome',
          filter: 'isFile'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: 'lib/assets/images',
          src: ['*'],
          dest: 'parse/public/assets/images',
          filter: 'isFile'
        }]
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

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'lib/html/',
          src: ['**/*'],
          dest: 'parse/public/',
          filter: 'isFile'
        }, ]
      },
    },

    watch: {
      options: {
        nospawn: true
      },
      gruntfile: {
        files: ['Gruntfile.js', 'bower.json'],
        tasks: ['build']
      },
      html: {
        files: ['lib/html/**/*.html'],
        tasks: ['htmlmin']
      },
      styles: {
        files: ['lib/assets/css/**/*.scss'],
        tasks: ['sass']
      },
      vendor_js: {
        files: ['lib/assets/vendor/**/*.js'],
        tasks: ['uglify:vendor_js']
      },
      app_js: {
        files: ['lib/**/*.js', 'config/**/*.js', '!lib/assets/vendor/**/*.js'],
        tasks: ['uglify:app_js']
      }
    },

    uglify: {
      options: {
        mangle: false,
        sourceMap: true,
        sourceMapIncludeSources: true
      },

      vendor_js: {
        options: {
          separator: '\n;',
          compress: false,
          beautify: false
        },
        files: {
          'parse/public/assets/vendor.js': [
            'lib/assets/vendor/bower/jquery/dist/jquery.js',
            'lib/assets/vendor/bower/lodash/dist/lodash.js',
            'lib/assets/vendor/bower/angular/angular.js',
            'lib/assets/vendor/bower/angular-ui-router/release/angular-ui-router.js',
            'lib/assets/vendor/bower/angular-bootstrap/ui-bootstrap-tpls.js',
            'lib/assets/vendor/js/**/*.js'
          ]
        }
      },
      app_js: {
        options: {
          separator: '\n;',
          compress: false,
          beautify: false
        },
        files: {
          'parse/public/assets/config.js': ['lib/assets/js/config/<%= env %>.js'],
          'parse/public/assets/lib.js': [
            'lib/assets/js/app/**/*.js',
            'lib/assets/js/initializers/*.js',
            'lib/init_modules.js',
            'config/routes.js'
          ],
          'parse/public/assets/helpers.js': ['lib/helpers/*.js'],
          'parse/public/assets/models.js': ['lib/models/*.js'],
          'parse/public/assets/controllers.js': ['lib/controllers/*.js']
        }
      }
    },

    jsbeautifier: {
      files: [
        '*.js',
        'config/**/*.js',
        'lib/*.js',
        'lib/assets/js/**/*.js',
        'lib/helpers/**/*.js',
        'lib/models/js/**/*.js',
        'spec/**/*.js'
      ],
      options: {
        js: {
          indentSize: 2,
          jslintHappy: true,
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
            '_', 'window',
            'describe', 'it', 'browser', 'expect', 'beforeEach', 'spyOn', 'xit', 'jasmine', 'runs', 'waitsFor', // karma and jasmine
            'inject', 'angular', // angular
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
      watch_unit: {
        configFile: 'karma.conf.js',
        singleRun: false
      },
      run_unit: {
        configFile: 'karma.conf.js'
      }
    },

    exec: {
      clean: {
        command: 'rm -rf parse/public/*'
      },

      deploy: {
        command: "cd parse && parse deploy <%= apps[env] %> -d \"Deploying revision $(git rev-parse --short HEAD)\""
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-jsbeautifier');


  // Build
  grunt.registerTask('jslint:all', ['jslint:production', 'jslint:test']);
  grunt.registerTask('build', ['exec:clean', 'bower:install', 'jsbeautifier', 'jslint:all', 'sass', 'htmlmin', 'uglify', 'copy']);
  grunt.registerTask('build_for_tests', ['sass', 'htmlmin', 'uglify', 'copy']);
  grunt.registerTask('default', ['build']);


  // Tests
  grunt.registerTask('tests_environment', 'Set tests environment', setTestsEnvironment);
  grunt.registerTask('staging_environment', 'Set staging environment', setStagingEnvironment);

  grunt.registerTask('test_unit', ['tests_environment', 'build_for_tests', 'karma:watch_unit']);
  grunt.registerTask('run_test_unit', ['tests_environment', 'build_for_tests', 'karma:run_unit']);
  grunt.registerTask('test_functional', ['tests_environment', 'build_for_tests', 'protractor:test']);

  // Deploy
  grunt.registerTask('deploy_to_tests', ['tests_environment', 'build', 'exec:deploy']);
  grunt.registerTask('deploy_to_staging', ['staging_environment', 'build', 'exec:deploy']);
  grunt.registerTask('deploy_to_development', ['build', 'exec:deploy']);

  grunt.registerTask('ci', ['tests_environment', 'build', 'run_test_unit', 'exec:deploy', 'test_functional']);

  function setStagingEnvironment() {
    grunt.config.set('env', 'staging');
  }

  function setTestsEnvironment() {
    grunt.config.set('env', 'tests');
  }
};
