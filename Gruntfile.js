
module.exports = function(grunt) {

	grunt.initConfig({

		responsive_images: {
			dev: {
				options: {
					engine: 'im',
					sizes: [{
						name: '',
						width: 350,
						suffix: 'small',
						quality: 60
					},
					{
						name: '',
						width: 800,
						suffix: 'medium',
						quality: 60
					}]
				},

				files: [{
					expand: true,
					src: ['*.{gif,jpg,png}'],
					cwd: 'img/',
					dest: 'images/'
				}]
			}
		},

		clean: {
			dev: {
				src: ['images']
			}
		},

		mkdir: {
			dev: {
				options: {
					create: ['images']
				}
			}
		}
	})

	grunt.loadNpmTasks('grunt-responsive-images');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mkdir')
	grunt.registerTask('default', ['clean', 'mkdir', 'responsive_images']);
}