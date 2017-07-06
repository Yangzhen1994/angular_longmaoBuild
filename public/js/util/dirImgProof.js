/**
 * Created by 73951 on 2017/3/15.
 */
define(['app', 'storageUtils'], function (app, storageUtils) {
    app.directive('imgProofModule', ['serverService', function (serverService) {
        return {
            restrict: "EA",
            templateUrl: 'tpls/imgProof.html',
            link: function (scope, el, attr) {
                var slideInput = document.getElementById('slideInput');
                scope.stepIndex = el.parents('ul')[0].id.substr(-1, 1)
                el.click(function (e) {
                });
                el.find('img').eq(-1).click(function (e) {
                    e.stopPropagation();
                    e.stopPropagation();
                    console.log($(this).parents('li'));
                    if ($(this).parents('li')[0].id.length == 16) {
                        var comIndex = $(this).parents('li')[0].id.substr(-3, 3);

                    } else if ($(this).parents('li')[0].id.length == 15) {
                        var comIndex = $(this).parents('li')[0].id.substr(-2, 2);

                    } else {
                        //alert($(this).parents('li')[0].id)
                        var comIndex = $(this).parents('li')[0].id.substr(-1, 1);
                    }

                    //comIndex = comIndex -1
                    var stepIndex = $(this).parents('li')[1].id.substr(-1, 1);
                    scope.stepItems[stepIndex].component[comIndex].status = 0;
                    if (scope.stepItems[stepIndex].component[comIndex].id) {
                        var toDel = scope.stepItems[stepIndex].component[comIndex];
                        toDel.task_id = storageUtils.session.getItem('_TaskId_');
                        if (toDel.tips_text == '点击输入内容') {
                            toDel.tips_text = ' '
                        }
                        serverService.submitComponent(toDel)
                    }
                    scope.stepItems[stepIndex].component.splice(comIndex, 1)
                    scope.$apply();
                });

                /***上传示意图**/
                var imgProof = true;
                el.find('div').eq(2).on('mouseenter', function (e) {
                    e.stopPropagation();
                    if (imgProof) {
                        console.log($(this).parents('li'))
                        if ($(this).parents('li')[0].id.length == 16) {
                            var comIndex = $(this).parents('li')[0].id.substr(-3, 3);

                        } else if ($(this).parents('li')[0].id.length == 15) {
                            var comIndex = $(this).parents('li')[0].id.substr(-2, 2);

                        } else {
                            //alert($(this).parents('li')[0].id)
                            var comIndex = $(this).parents('li')[0].id.substr(-1, 1);
                        }
                        var stepIndex = $(this).parents('li')[1].id.substr(-1, 1);

                        function sys_file_sdk_qiniu_token(file) {
                            var token = $.ajax({
                                url: 'http://manager.shandianshua.com/sdk/qiniu/token.json',
                                method: 'POST',
                                xhrFields: {
                                    withCredentials: true
                                },
                                data: {bucket: 'totoro-task'},
                                dataType: 'json',
                                async: false,
                            }).responseText;

                            return jQuery.parseJSON(token).result;
                        }

                        function showPreview(file) {

                            var image = new Image();
                            image.style.width = '75px';
                            image.style.height = '110px';

                            var preloader = new mOxie.Image();
                            preloader.onload = function () {
                                preloader.downsize(300, 300);
                                image.setAttribute("src", preloader.getAsDataURL());
                                $('#upImgProofPreview' + stepIndex + comIndex).append(image);
                                $('#upImgProofPreview' + stepIndex + comIndex).css('display', 'block')
                            };
                            preloader.load(file.getSource());
                        }

                        var hashArr = [];
                        var uploader = Qiniu.uploader({
                            runtimes: 'html5,html4',
                            browse_button: 'upImgProof' + scope.stepIndex + comIndex,
                            container: 'upImgProofList' + scope.stepIndex + comIndex,
                            //drop_element: 'sys-file-dialog-list'+comIndex,
                            max_file_size: '100mb',
                            //dragdrop: true,
                            chunk_size: '5mb',
                            multi_selection: true,
                            get_new_uptoken: true,
                            uptoken_func: sys_file_sdk_qiniu_token,
                            domain: ' http://task.totoro.cdn.shandianshua.com',
                            unique_names: true,
                            auto_start: true,
                            init: {
                                'FilesAdded': function (up, files) {

                                    // 文件添加进队列后，处理相关的事情
                                    //alert('添加了文件');
                                    console.log(files
                                    );

                                    //$('#sys-file-dialog-upload-btn'+scope.stepIndex+comIndex).attr("src",'../img/moduleImg/ic_add_a_photo_black_24dp.png');

                                },
                                'BeforeUpload': function (up, file) {
                                    // 每个文件上传前，处理相关的事情
                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时，处理相关的事情
                                },
                                'FileUploaded': function (up, file, info) {
                                    console.log(file)
                                    console.log(info);
                                    //alert('上传成功');
                                    $('#upImgProofPreview' + stepIndex + comIndex).children('img').remove()
                                    showPreview(file);
                                    hashArr.push(jQuery.parseJSON(info));
                                    console.log(hashArr);
                                    // 每个文件上传成功后，处理相关的事情
                                    // 其中info是文件上传成功后，服务端返回的json，形式如：
                                    // {
                                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                    //    "key": "gogopher.jpg"
                                    //  }
                                    // 查看简单反馈
                                    var domain = up.getOption('domain');
                                    var res = jQuery.parseJSON(info);
                                    var str = '';
                                    str += domain + "/" + res.key
                                    /*for(var i=0;i<hashArr.length;i++){
                                     str += domain+"/"+hashArr[i].key+'\n'
                                     }*/
                                    //var sourceLink = domain +"/"+ res.key+'\n'; //获取上传成功后的文件的Url
                                    //console.log(sourceLink);
                                    scope.stepItems[stepIndex].component[comIndex].tips_image = str;
                                    console.log(scope.stepItems[stepIndex].component[comIndex]);


                                },
                                'Error': function (up, err, errTip) {
                                    //上传出错时，处理相关的事情
                                    console.log(err)
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后，处理相关的事情
                                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                                    scope.stepItems[stepIndex].component[comIndex].task_id = taskId
                                    scope.$apply();
                                    //serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                                },
                                'Key': function (up, file) {
                                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                                    // 该配置必须要在unique_names: false，save_key: false时才生效
                                    var key = "";
                                    // do something with key here
                                    return key
                                }
                            }
                        })
                        console.log(uploader)
                        imgProof = false
                    }

                })

            }
        }

    }])
});