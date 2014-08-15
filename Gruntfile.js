
module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
		connect: {
			server: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		},
		stealPluginify: {
			"standalone": {
				system: {
					config: __dirname + "/stealconfig.js",
					main: 'syn/syn'
				},
				"outputs": {
					"standalone": {
						dest: __dirname + "/build/syn.js",
						minify: false
					}
				}
			},

			"tests": {
				system: {
					config: __dirname + "/stealconfig.js",
					main: "test/qunit/qunit"
				},
				"outputs": {
					"all tests": {
						// Ignore everything without _test in the filename
						ignore: /^((?!_test).)*$/,
						format: "global",
						dest: __dirname + "/build/tests.js",
						minify: false
					}
				}
			}
		},
		concat: {
			options: {
				banner: '/**\n * <%= pkg.title || pkg.name %> - <%= pkg.version %>\n * <%= pkg.homepage %>\n * @copyright <%= new Date().getFullYear() %> <%= pkg.author.name %>\n * <%= new Date().toUTCString() %>\n * @license <%= pkg.licenses[0].type %>\n */\n\n'
			},

			dist: {
				files: [{
					expand: true,
					cwd: 'build/',
					src: ['*'],
					dest: 'dist/'
				}]
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			lib: [
				'src/**/*.js', 'test/**/*.js'
			]
		},
		jsbeautifier: {
			files: '<%= jshint.lib %>',
			options: {
				config: '.jsbeautifyrc'
			}
		},
		uglify: {
			dist: {
				options: {
					preserveComments: 'some'
				},
				files: {
					'dist/syn.min.js': [
						'dist/syn.js'
					]
				}
			}
		},
		testee: {
			src: {
				options: {
					urls: ['http://localhost:8000/test/index.html'],
					browsers: ['phantom']
				}
			},
			built: {
				options: {
					urls: ['http://localhost:8000/test/built.html'],
					browsers: ['phantom']
				}
			},
			both: {
				options: {
					urls: ['http://localhost:8000/test/index.html',
								 'http://localhost:8000/test/built.html'],
					browsers: ['phantom']
				}
			}
    }
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('testee');
	grunt.loadNpmTasks('steal-tools');

	grunt.registerTask('quality', ['jsbeautifier', 'jshint']);
	grunt.registerTask('build', ['stealPluginify:standalone', 'concat', 'uglify']);

	// Test tasks
	grunt.registerTask('test', ['connect:server', 'testee:src']);
	grunt.registerTask('testbuild', ['build', 'stealPluginify:tests',
										 'connect:server', 'testee:built']);
};
