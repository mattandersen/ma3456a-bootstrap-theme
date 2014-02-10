/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
              ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
              ' */\n\n',
    jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n',

    // Task configuration.
    clean: {
      dist: ['dist'],
      build: ['build']
    },

    jshint: {
      options: {
        jshintrc: 'bootstrap-3.0.3/js/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['bootstrap-3.0.3/js/*.js']
      },
      test: {
        src: ['bootstrap-3.0.3/js/tests/unit/*.js']
      }
    },

    concat: {
      options: {
        banner: '<%= banner %><%= jqueryCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'bootstrap-3.0.3/js/transition.js',
          'bootstrap-3.0.3/js/alert.js',
          'bootstrap-3.0.3/js/button.js',
          'bootstrap-3.0.3/js/carousel.js',
          'bootstrap-3.0.3/js/collapse.js',
          'bootstrap-3.0.3/js/dropdown.js',
          'bootstrap-3.0.3/js/modal.js',
          'bootstrap-3.0.3/js/tooltip.js',
          'bootstrap-3.0.3/js/popover.js',
          'bootstrap-3.0.3/js/scrollspy.js',
          'bootstrap-3.0.3/js/tab.js',
          'bootstrap-3.0.3/js/affix.js'
        ],
        dest: 'dist/js/bootstrap.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'min'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: 'dist/js/bootstrap.min.js'
      }
    },

    

    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>'
      },
      bootstrap: {
        src: ['build/less/bootstrap.less'],
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      min: {
        options: {
          compress: true
        },
        src: ['build/less/bootstrap.less'],
        dest: 'dist/css/<%= pkg.name %>.min.css'
      },
      theme: {
        src: ['build/less/theme.less'],
        dest: 'dist/css/<%= pkg.name %>-theme.css'
      },
      theme_min: {
        options: {
          compress: true
        },
        src: ['build/less/theme.less'],
        dest: 'dist/css/<%= pkg.name %>-theme.min.css'
      }
    },

    copy: {
      img: {
        expand: true,
        cwd: 'src/img',
        src: ["**"],
        dest: 'dist/img'
      },
      fonts: {
        expand: true,
        cwd: 'bootstrap-3.0.3/fonts',
        src: ["*"],
        dest: 'dist/fonts'
      },
      bs: {
        expand: true,
        cwd: 'bootstrap-3.0.3',
        src: ["less/**"],
        dest: 'build/'
      },
      ma: {
        expand: true,
        cwd: 'src',
        src: ["less/**"],
        dest: 'build/'
      },
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      recess: {
        files: ['src/bootstrap/less/*.less', 'src/bootstrap-ma/less/*.less'],
        tasks: ['copy:bootstrap_ma', 'recess']
      }
    },
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['copy:bs', 'copy:ma', 'recess']);

  // Fonts distribution task.
  grunt.registerTask('dist-fonts', ['copy:fonts']);

  // Images
  grunt.registerTask('dist-img', ['copy:img']);

  // Full distribution task.
  grunt.registerTask('default', ['clean', 'dist-css', 'dist-fonts', 'dist-js', 'dist-img']);
};
