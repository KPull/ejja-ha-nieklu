/**
 * Defines the additional grunt configuration and build steps for the Ixaris application.
 */
module.exports = function (grunt) {
    grunt.config.merge({
        replace: {
            apiPrefix: {
                src: ['<%= yeoman.dist %>/scripts/*.js'],
                overwrite: true,
                replacements: [{
                        from: 'http://localhost:5000',
                        to: '//staging-ejja-ha-nieklu.herokuapp.com'
                    }]
            },
            titles: {
                src: ['<%= yeoman.dist %>/*.html', '<%= yeoman.dist %>/views/*.html'],
                overwrite: true,
                replacements: [{
                        from: '<!--APP_TITLE-->Ejja Ħa Nieklu',
                        to: 'Ejja Ħa Nieklu'
                    }, {
                        from: '<!--APP_SUBTITLE-->Test App',
                        to: 'Staging App'
                    }]
            },
            logos: {
                src: ['<%= yeoman.dist %>/*.html', '<%= yeoman.dist %>/views/*.html'],
                overwrite: true,
                replacements: [{
                        from: 'images/front-logo.png',
                        to: 'images/ixaris-logo.png'
                    }]
            }
        }
    });

    return [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'replace',
        'rev',
        'usemin',
    ];
};