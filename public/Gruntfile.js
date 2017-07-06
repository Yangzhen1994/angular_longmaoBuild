/**
 * Created by 73951 on 2017/7/6.
 */
module.exports = function (grunt) {
    //初始化插件配置
    grunt.initConfig({


        //clean:["build/css","build/js","build/index.html"],
        //打包requirejs管理的所有模块

        requirejs:{
            compile:{
                options:{
                    name:'main',
                    mainConfigFile:'js/main.js',
                    out:'build/js/main.js'
                }
            }
        },
        imagemin:{
            dist:{
                options:{
                    optimizationLevel:3
                },
                files:[{
                    expand:true,//表示支持cwd等更多配置
                    cwd:'img/',//基本路径
                    src:['*.{png,jpg,gif}'],
                    dest:'build/img/'
                },
                    {
                        expand:true,//表示支持cwd等更多配置
                        cwd:'img/icon',//基本路径
                        src:['*.{png,jpg,gif}'],
                        dest:'build/img/icon'
                    },
                    {
                        expand:true,//表示支持cwd等更多配置
                        cwd:'img/moduleImg',//基本路径
                        src:['*.{png,jpg,gif}'],
                        dest:'build/img/moduleImg'
                    },
                    {
                        expand:true,//表示支持cwd等更多配置
                        cwd:'js/framework/skins/default/',//基本路径
                        src:['*.{png,jpg,gif}'],
                        dest:'build/js/framework/skins/default/'
                    }]
            }
        },
        //js语法检查
        jshint:{
            options:{
                jshintrc:'.jshintrc'
            },
            files:['Gruntfile.js', 'js/**/*.js','!js/require.js','!js/libs/!*.js']
        },
        cssmin:{
            target:{
                files:[{
                    expand:true,//表示支持cwd等更多配置
                    cwd:'css/',//基本路径
                    src:['*.css'],
                    dest:'build/css/'
                },
                    {
                        'build/css/output.min.css' :[
                            'css/base.css'
                        ]
                    }
                ]
            }
        },
        htmlmin:{
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand:true,//表示支持cwd等更多配置
                    cwd:'tpls',//基本路径
                    src:['*.html'],
                    dest:'build/tpls'
                },
                    {
                        expand:true,
                        cwd:'./',
                        src:['index.html'],
                        dest:'build/'
                    }
                ]
            }
        },
        copy:{
            main:{
                files:[
                    {
                        src:['js/require.js'],
                        dest:'build/js/require.js'
                    },
                    {
                        src:['js/framework/jquery-1.9.1.js'],
                        dest:'build/js/framework/jquery-1.9.1.js'
                    },
                    {
                        src:['js/framework/jquery-ui.js'],
                        dest:'build/js/framework/jquery-ui.js'
                    },
                    {
                        src:['js/framework/laydate.js'],
                        dest:'build/js/framework/laydate.js'
                    },
                    {
                        src:['js/framework/qiniu.js'],
                        dest:'build/js/framework/qiniu.js'
                    },
                    {
                        src:['js/framework/plupload.full.min.js'],
                        dest:'build/js/framework/plupload.full.min.js'
                    },
                    {
                        src:['js/framework/need/laydate.css'],
                        dest:'build/js/framework/need/laydate.css'
                    },
                    {
                        src:['js/framework/skins/default/laydate.css'],
                        dest:'build/js/framework/skins/default/laydate.css'
                    },
                ]
            }
        },
        watch : {
            scripts : {
                files : ['js/**/*.js', 'css/*.css', 'tpls/*.html','js/**/**/*.js'],
                tasks : ['requirejs','cssmin','htmlmin'],
                options : {spawn : false}
            },
            foo: {
                files: ['*.html', 'styles/*', 'scripts/*', 'images/**/*'],
                options: {
                    livereload: true
                }
            },
        },

    });
    //2. 加载插件任务
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //3.注册构建默认任务
    grunt.registerTask('live',['requirejs','cssmin','htmlmin','copy','imagemin','watch']);
};