/**
 * Created by 73951 on 2017/3/21.
 */
define(['app', 'storageUtils'], function (app, storageUtils) {
    return app.controller('addStepCtrl', ['$scope', 'Upload', '$timeout', 'serverService', function ($scope, Upload, $timeout, serverService) {
        //$('.left').css('height',846);
        //获取当前任务id
        var taskId = storageUtils.session.getItem('_TaskId_');
        var newTaskId = storageUtils.session.getItem('_newTaskid_');
        //var oldStep = storageUtils.session.getItem('_oldStep_');
        //获取验证的正则表达式
        serverService.getRegex()
            .then(function (data) {
                $scope.regexArr = data.result
            });
        //delete/
        $scope.removeStep = function (index) {
            $scope.stepItems[index].oldSteps.status = 0;
            if (!$scope.stepItems[index].oldSteps.task_id) {
                $scope.stepItems[index].oldSteps.task_id = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_');
            }

            if (!$scope.stepItems[index].oldSteps.order) {
                $scope.stepItems[index].oldSteps.order = $scope.stepItems.length - index;
            }
            var data = $scope.stepItems[index].oldSteps;
            $scope.stepItems.splice(index, 1);
            $scope.stepCount--;
            for (var i = index; i < $scope.stepItems.length; i++) {
                $scope.stepItems[i].index--
            }
            //同步height
            $('.left').css('height', Math.round($('.new-step').innerHeight() / 2) + 432);
            if (0 == $scope.stepCount) {
                $('.left').css('height', 846);
            }
            // console.log($scope.stepItems[index].oldSteps);
            if (data.id) {
                serverService.saveStep(data).then(function (resData) {
                    if (resData.code == 200) {
                        serverService.getComponent(taskId)
                            .then(function (componentData) {
                                componentData.result.forEach(function (item,index) {
                                    if(item.step_id == data.id){
                                        item.status = 0;
                                        serverService.submitComponent(item)
                                    }
                                })

                            })
                    }
                })
            }
        };
        /*添加模板*/
        var usingArr = [];
        $scope.stepItems = []
        $scope.addStepModule = function (old) {
            $scope.stepItems.push({
                showValue: 1,
                index: $scope.stepCount + 1,
                oldSteps: $scope.oldSteps[old],
                component: [],
                addItems: []
            });
            if (!$scope.stepItems[$scope.stepItems.length - 1].oldSteps) {
                $scope.stepItems[$scope.stepItems.length - 1].oldSteps = {}
                $scope.stepItems[$scope.stepItems.length - 1].oldSteps.images_list = []
                $scope.stepItems[$scope.stepItems.length - 1].oldSteps.images = ''
                $scope.stepItems[$scope.stepItems.length - 1].oldSteps.order = 100 - $scope.stepItems.length;
            } else if ($scope.stepItems[$scope.stepItems.length - 1].oldSteps.images_list == null || $scope.stepItems[$scope.stepItems.length - 1].oldSteps.images_list.length == 0) {
                $scope.stepItems[$scope.stepItems.length - 1].oldSteps.images_list = []
                $scope.stepItems[$scope.stepItems.length - 1].oldSteps.order = 100 - $scope.stepItems.length;
                $scope.stepItems[$scope.stepItems.length - 1].oldSteps.images = ''
            }
            //对status为0 的 进行 过滤
            var testStep = $scope.stepItems[old] || $scope.stepItems[$scope.stepItems.length - 1]
            if (testStep.oldSteps.status == 1 || testStep.oldSteps.status == 1) {
                usingArr.push(testStep);
            }
            $scope.stepCount++;//同步步骤编号顺序
            /*if(testStep.oldSteps.status == 0){
             $scope.stepCount --;
             }*/
            $timeout(function () {
                $('.left').css('height', $('.new-step').innerHeight() + 17)
            }, 100)
        };
        /*新建步骤*/
        if (newTaskId && newTaskId != 'undefined') {
            serverService.getStepById(newTaskId)
                    .then(function (data) {
                        console.log(data.result);
                        $scope.stepCount = 0;

                        $scope.oldSteps = [{
                            images_list: []
                        },
                            {
                                images_list: []
                            }];
                        return
                    })
        }
        //ajax getStepById
        if (taskId && taskId != 'undefined') {
            serverService.getStepById(taskId)
                .then(function (data) {
                    console.log(data.result);
                    if (data.result.length == 0) {
                        alert('还没有步骤请添加编辑~');

                        $scope.stepCount = 0;

                        $scope.oldSteps = [{
                            images_list: []
                        },
                            {
                                images_list: []
                            }];
                        $scope.addStepModule($scope.stepCount+1);
                    } else {
                        $scope.oldSteps = data.result;


                        //存入seesion
                        storageUtils.session.setItem('_oldStep_', $scope.oldSteps);
                        var oldStep = storageUtils.session.getItem('_oldStep_');
                        storageUtils.session.setItem('_saved_', true);
                        $scope.stepCount = 0;
                        if (oldStep && oldStep.length > 0) {
                            $scope.stepItems = []
                            for (var i = 0; i < oldStep.length; i++) {
                                $scope.addStepModule(i);
                            }
                            $scope.stepItems = usingArr

                        }
                    }
                        //console.log(data.result);
                    })

        }else{
            alert('这里是无法请求到接口后的模拟');
            alert('还没有步骤请添加编辑~');

            $scope.stepCount = 0;

            $scope.oldSteps = [{
                images_list: []
            },
                {
                    images_list: []
                }];
            $scope.addStepModule($scope.stepCount+1);
        }
        //获取到凭证信息

        $timeout(function () {
            var resultArr = []
            var componentMsg = storageUtils.session.getItem('_component_');
            if (componentMsg && componentMsg != null) {
                $scope.componentItems = componentMsg;
                for (var c = 0; c < $scope.componentItems.length; c++) {
                    for (var step = 0; step < $scope.stepItems.length; step++) {
                        if ($scope.componentItems[c].step_id == $scope.stepItems[step].oldSteps.id) {
                            if ($scope.componentItems[c].type == 7) {
                                if ($scope.componentItems[c].options_other == 1) {
                                    $scope.componentItems[c].options += '\n点我输入内容'
                                }
                            }
                            if($scope.componentItems[c].tips_text==''){
                                $scope.componentItems[c].tips_text = '点击输入内容'
                            }
                            $scope.stepItems[step].component.push(
                                    $scope.componentItems[c]
                            )
                        }

                    }
                }

            } else {
                $scope.componentItems = [];
            }
        }, 300)


        //$scope.flagIndex = 0
        $scope.sortableOptions = {
            // 数据有变化
            start: function (e, ui) {
            },
            change: function (e, ui) {
            },
            update: function (e, ui) {
                console.log("update");
                //需要使用延时方法，否则会输出原始数据的顺序，可能是BUG
            },
            // 完成拖拽动作
            stop: function (e, ui) {
            }
        };
        $scope.step_upload = function (obj) {
            $scope.step_upload = function (obj) {
                //获取到 步骤index
                // event.stopPropagation()
                var stepIndex = obj.parentNode.parentNode.parentNode.parentNode.id.substr(-1, 1)
                var stepImgList = $('#imgUrl' + stepIndex).find('p').eq(0).find('img');
                console.log(stepImgList)
                for (var i = 0; i < stepImgList.length; i++) {
                    stepImgList[i].setAttribute('id', 'step' + stepIndex + 'Img' + i);
                    var div = document.createElement('div');
                    div.id = 'step' + stepIndex + 'ImgContainer' + i
                    $('#imgUrl' + stepIndex).find('p').eq(0).prepend(div);
                    function sys_file_sdk_qiniu_token(file) {
                        var token = $.ajax({
                            url: 'http://manager.test.shandianshua.com/sdk/qiniu/token.json',
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

                    }

                    var hashArr = []
                    var uploader = Qiniu.uploader({
                        runtimes: 'html5,html4',
                        browse_button: 'step' + stepIndex + 'Img' + i,
                        container: 'step' + stepIndex + 'ImgContainer' + i,
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

                                /*// 文件添加进队列后，处理相关的事情
                                 alert('添加了文件');
                                 console.log(files
                                 );
                                 for (var i = 0; i < files.length; i++) {


                                 showPreview (files[i]);
                                 }
                                 $('#sys-file-dialog-upload-btn'+scope.stepIndex+comIndex).attr("src",'../img/moduleImg/ic_add_a_photo_black_24dp.png');*/

                            },
                            'BeforeUpload': function (up, file) {
                                // 每个文件上传前，处理相关的事情

                                alert('准备上传')
                            },
                            'UploadProgress': function (up, file) {
                                // 每个文件上传时，处理相关的事情
                            },
                            'FileUploaded': function (up, file, info) {
                                // 每个文件上传成功后，处理相关的事情
                                // 其中info是文件上传成功后，服务端返回的json，形式如：
                                // {
                                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                //    "key": "gogopher.jpg"
                                //  }
                                // 查看简单反馈
                                var domain = up.getOption('domain');
                                var res = jQuery.parseJSON(info);
                                var str = ''
                                for (var i = 0; i < hashArr.length; i++) {
                                    str += domain + "/" + hashArr[i].key + '\n'
                                }
                                console.log(info)
                                //var sourceLink = domain +"/"+ res.key+'\n'; //获取上传成功后的文件的Url
                                //console.log(sourceLink);
                                //scope.stepItems[stepIndex].component[comIndex].tips_image = str
                                //console.log(scope.stepItems[stepIndex].component[comIndex]);


                            },
                            'Error': function (up, err, errTip) {
                                //上传出错时，处理相关的事情
                                console.log(err)
                            },
                            'UploadComplete': function () {
                                //队列文件处理完毕后，处理相关的事情

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
                }

            }
        }
        /*上一项 保存任务*/
        $scope.asprePage = function () {
            //操作
            window.location = '#/addTask'
        };
        $scope.assaveTask = function () {
            var imagesStr = '';

            for (var i = 0; i < $scope.stepItems.length; i++) {
                console.log($scope.stepItems[i].oldSteps);
                var data = $scope.stepItems[i].oldSteps;
                if (!data.title) {
                    data.title = ' ';
                }
                if (!data.order) {
                    data.order = 100 - i;
                }
                data.task_id = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_');
                if (!data.id) {
                    data.id = ''
                }
                if (!data.url) {
                    data.url = ''
                }
                data.skip = 0;//默认设置成否：可以跳过
                data.status = 1
                console.log(data);

                serverService.saveStep(data)
                    .then(function (data) {
                        if (data.code == 200) {
                            console.log('保存成功');
                            window.save = true;
                        }
                    });
                imagesStr = '';
            }
            $timeout(function () {
                var taskId2 = taskId || newTaskId
                serverService.getStepById(taskId2)
                .then(function (data) {
                    console.log(data.result)
                    storageUtils.session.setItem('_addStep_', data.result);
                    $scope.stepItems.forEach(function (item, index) {
                        for (var i = 0; i < data.result.length; i++) {
                            if (item.oldSteps.title == data.result[i].title) {
                                item.oldSteps.id = data.result[i].id
                            }
                        }

                    })
                    for (var i = 0; i < $scope.stepItems.length; i++) {
                        data.result.forEach(function (item, index) {
                            if (item.id == $scope.stepItems[i].oldSteps.id) {
                                if ($scope.stepItems[i].component && $scope.stepItems[i].component.length > 0) {
                                    $scope.stepItems[i].component.forEach(function (item1, index1) {
                                        item1.step_id = item.id;
                                        item1.task_id = item.task_id;
                                        item1.order = 10000 - index1;
                                        if (item1.tips_text == '点击输入内容') {
                                            item1.tips_text = ' ';
                                        }
                                        if (item1.tips_text.indexOf('手机号') > -1) {
                                                $scope.regexArr.forEach(function (item2, index) {
                                                    if (item2.value == '手机号码') {
                                                        item1.regex = item2.code
                                                    }
                                                })
                                        }
                                        if (item1.tips_text.indexOf('银行卡') > -1) {
                                            $scope.regexArr.forEach(function (item2, index) {
                                                if (item2.value == '银行卡号') {
                                                    item1.regex = item2.code
                                                }
                                            })
                                        }
                                        if (item1.tips_text.indexOf('身份证') > -1) {
                                            $scope.regexArr.forEach(function (item2, index) {
                                                if (item2.value == '身份证') {
                                                    item1.regex = item2.code
                                                }
                                            })
                                        }
                                        $timeout(function () {
                                            serverService.submitComponent(item1)
                                            .then(function (data) {
                                                console.log(data);
                                                if (data.code == 200) {
                                                    //把凭证信息存入到session
                                                    /* serverService.getComponent(taskId2)
                                                     .then(function (data) {
                                                     storageUtils.session.setItem('_component_', data.result);
                                                     })*/
                                                    storageUtils.session.setItem('_component_', data.result);
                                                    window.save = true
                                                } else {
                                                    window.save = false
                                                }
                                            })
                                        }, 300);
                                        if (item1.type == 7) {
                                            console.log(item1.options)
                                            if (item1.options.indexOf('点我输入内容') > -1) {
                                                item1.options_other = 1;
                                                console.log(item1.options)
                                                var optionArr = item1.options.split('\n')
                                                optionArr.forEach(function (optionsItem, index) {
                                                    if (optionsItem == '点我输入内容') {
                                                        optionArr.splice(index, 1)
                                                    }

                                                });
                                                item1.options = optionArr.join('\n')
                                            } else {
                                                item1.options_other = 0;
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }, 2000);
            $timeout(function () {
                if (save) {
                    alert('保存成功');
                    storageUtils.session.setItem('_DOWNLINE_', true)
                    window.location.reload()
                }
            }, 2500)
            // serverService.getStepById(storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_'))
            //window.location.reload()
        }
    }]);
})