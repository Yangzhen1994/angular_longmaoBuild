/**
 * Created by 73951 on 2017/3/21.
 */
/**
 * Created by 73951 on 2017/3/20.
 */
/**
 *
 */
define(['app', 'storageUtils'], function (app, storageUtils) {
    app.directive('stepModule', [function () {
        return {
            restrict: "EA",

            templateUrl: 'tpls/stepModule.html',
            controller: ['$scope', '$timeout', 'serverService',function ($scope, $timeout, serverService) {
                //console.log($scope.oldSteps);

                /*$scope.stepModules.forEach(function (item) {
                 console.log(item.title)
                 });*/
                $scope.showEditUrlByButton = false;
                $scope.showEditUrl = function (index) {
                    if(!$scope.stepItems[index].oldSteps.url){
                        $scope.stepItems[index].oldSteps.url = '输入url';
                    }
                };
                $scope.middleItems = [];
                $scope.showText = function (index) {
                    var flag = index
                    var tempArr = []
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    serverService.getComponent(taskId)
                        .then(function (data) {
                            //console.log(data)
                            //把凭证信息存入到session
                            storageUtils.session.setItem('_component_', data.result);
                            var componentList = storageUtils.session.getItem('_component_');
                            if (componentList && componentList != null) {
                                componentList.forEach(function (item, index) {
                                    if (item.status == 1 && !item.tips_text) {
                                        tempArr.push({id: item.id, order: item.order})
                                    }
                                })
                            }
                            for (var i = 0; i < $scope.stepItems[index].component.length; i++) {
                                if ((!$scope.stepItems[index].component[i].tips_text || $scope.stepItems[index].component[i].tips_text == ' ') && $scope.stepItems[index].component[i].status == 1) {
                                    //$scope.$emit('isText',true)
                                    //$scope.stepItems[index].component[i].isText = true
                                    $scope.stepItems[index].component[i].tips_text = '点击输入内容';
                                   // document.getElementById('deletetext' + flag +i).style.display = 'block';
                                    for (var j = 0; j < tempArr.length; j++) {
                                        if ($scope.stepItems[index].component[i].order == tempArr[j].order) {
                                            $scope.stepItems[index].component[i].id = tempArr[j].id;
                                            $scope.stepItems[index].component[i].task_id = taskId;
                                            serverService.submitComponent($scope.stepItems[index].component[i])
                                                    .then(function (data) {
                                                        if (data.code == 200) {

                                                            // storageUtils.session.setItem('_DRAG_',true);
                                                            // window.location = '#/reviewList';
                                                        }
                                                    })
                                            continue
                                        }

                                    }

                                }

                            }
                        })
                };
                /*文本凭证*/
                $scope.textProof = function (index) {
                    var saved = storageUtils.session.getItem('_saved_');
                    storageUtils.session.setItem('_comIndex_', index)
                    //console.log($scope.stepItems[index].component)
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        compress:1,
                        options:'',
                        options_other:0,
                        regex: '',
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 1,
                        task_id: taskId,
                        tips_text:'点击输入内容',
                        tips_image:'',
                        isText:true//修改必须全选才编辑
                    };
                    $scope.stepItems[index].component.push(data);
                    $scope.componentItems.push(data);
                    storageUtils.session.setItem('_component_', $scope.componentItems)
                    /*$scope.showText(index)*/
                    /*serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    //storageUtils.session.setItem('_DRAG_',true)
                                    //window.location = '#/reviewList';
                                    serverService.getComponent(taskId)
                                            .then(function (data) {
                                                console.log(data)
                                                //把凭证信息存入到session
                                                storageUtils.session.setItem('_component_', data.result);
                                            })
                                }
                            })*/
                    $timeout(function(){
                        if($('#scroll'+index).height()>406){
                            $('#imgUrl'+index).animate({scrollTop:$('#scroll'+index).height()-406})
                        }
                    },100)
                }
                /*图片凭证*/
                $scope.showOtherType = function () {
                    $scope.typePhoto = !$scope.typePhoto;
                    $scope.typeCamera = !$scope.typeCamera;
                    $scope.typeAll = !$scope.typeAll;
                }
                $scope.imgProof = function (index, type) {
                    var saved = storageUtils.session.getItem('_saved_');

                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        compress:1,
                        options:'',
                        options_other:0,
                        regex: '',
                        regex_name: null,
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 2,
                        task_id: taskId,
                        tips_text:'点击输入内容',
                        tips_image:'',
                        isText:true//修改必须全选才编辑
                    };
                    if (type == 3) {
                        data.type = 3
                    }
                    if (type == 4) {
                        data.type = 4
                    }
                    $scope.stepItems[index].component.push(data);
                    $scope.componentItems.push(data);
                    storageUtils.session.setItem('_component_', $scope.componentItems)
                    /*$scope.showText(index)*/
                    $scope.typePhoto = false;
                    $scope.typeCamera = false;
                    $scope.typeAll = false;
                    /*serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    serverService.getComponent(taskId)
                                            .then(function (data) {
                                                console.log(data)
                                                //把凭证信息存入到session
                                                storageUtils.session.setItem('_component_', data.result);
                                            })
                                }
                            })*/
                    /* $scope.$emit('addImgProof');*/
                    $timeout(function(){
                        if($('#scroll'+index).height()>406){
                            $('#imgUrl'+index).animate({scrollTop:$('#scroll'+index).height()-406})
                        }
                    },100)
                };
                /*位置凭证*/
                $scope.posProof = function (index) {
                    //alert('位置凭证')
                    var saved = storageUtils.session.getItem('_saved_');

                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        compress:1,
                        options:'',
                        options_other:0,
                        regex: '',
                        regex_name: null,
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 5,
                        task_id: taskId,
                        tips_text:'点击输入内容',
                        tips_image:'',
                        isText:true//修改必须全选才编辑
                    }
                    $scope.stepItems[index].component.push(data)
                    $scope.componentItems.push(data);
                    storageUtils.session.setItem('_component_', $scope.componentItems)
                    /*$scope.showText(index)*/
                    // serverService.submitComponent(data)
                    //         .then(function (data) {
                    //             if (data.code == 200) {
                    //                 serverService.getComponent(taskId)
                    //                         .then(function (data) {
                    //                             console.log(data)
                    //                             //把凭证信息存入到session
                    //                             storageUtils.session.setItem('_component_', data.result);
                    //                         })
                    //             }
                    //         })
                    $timeout(function(){
                        if($('#scroll'+index).height()>406){
                            $('#imgUrl'+index).animate({scrollTop:$('#scroll'+index).height()-406})
                        }
                    },100)
                };
                /*录音凭证*/
                $scope.audioProof = function (index) {
                    var saved = storageUtils.session.getItem('_saved_');

                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        compress:1,
                        options:'',
                        options_other:0,
                        regex: '',
                        regex_name: null,
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 6,
                        task_id: taskId,
                        tips_text:'点击输入内容',
                        tips_image:'',
                        isText:true//修改必须全选才编辑
                    }
                    $scope.stepItems[index].component.push(data)
                    $scope.componentItems.push(data);
                    storageUtils.session.setItem('_component_', $scope.componentItems);
                    /*$scope.showText(index)*/
                    /*serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    serverService.getComponent(taskId)
                                            .then(function (data) {
                                                console.log(data)
                                                //把凭证信息存入到session
                                                storageUtils.session.setItem('_component_', data.result);
                                            })
                                }
                            })*/
                    $timeout(function(){
                        if($('#scroll'+index).height()>406){
                            $('#imgUrl'+index).animate({scrollTop:$('#scroll'+index).height()-406})
                        }
                    },100)
                };
                /*显示文本*/

                /*显示图片*/
                /*$scope.showImg = function (index) {
                    $('#stempItem' + index).find('.delCircle').css('display', 'block');
                    var tempArr = []
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    serverService.getComponent(taskId)
                            .then(function (data) {
                                //console.log(data)
                                //把凭证信息存入到session
                                storageUtils.session.setItem('_component_', data.result);
                                var componentList = storageUtils.session.getItem('_component_');
                                if (componentList && componentList != null) {
                                    componentList.forEach(function (item, index) {
                                        if (item.status == 1 && !item.tips_image) {
                                            tempArr.push({id: item.id, order: item.order})
                                        }
                                    })
                                }
                                for (var i = 0; i < $scope.stepItems[index].component.length; i++) {
                                    if ((!$scope.stepItems[index].component[i].tips_image || $scope.stepItems[index].component[i].tips_image == ' ') && $scope.stepItems[index].component[i].status == 1) {
                                        //$scope.$emit('isText',true)
                                        //$scope.stepItems[index].component[i].isText = true
                                        $scope.stepItems[index].component[i].tips_image = true;
                                        $('#delete' + i).css('display', 'block');
                                        for (var j = 0; j < tempArr.length; j++) {
                                            if ($scope.stepItems[index].component[i].order == tempArr[j].order) {
                                                $scope.stepItems[index].component[i].id = tempArr[j].id;
                                                $scope.stepItems[index].component[i].task_id = taskId;
                                                /!*serverService.submitComponent($scope.stepItems[index].component[i])
                                                        .then(function (data) {
                                                            if (data.code == 200) {

                                                                // storageUtils.session.setItem('_DRAG_',true);
                                                                // window.location = '#/reviewList';
                                                            }
                                                        })*!/
                                                continue
                                            }

                                        }

                                    }

                                }
                            })
                    //storageUtils.session.setItem('_DRAG_',true)
                    //window.location = '#/reviewList';
                };*/

                /*
                 $scope.$on('deleteOneShowText', function (data) {
                 //console.log(data)
                 for (var i = 0; i < $scope.middleItems.length; i++) {
                 if ($scope.middleItems[i] == data.targetScope.middleItem) {
                 $scope.middleItems.splice(i, 1)
                 }
                 }
                 });
                 $scope.$on('deleteImg', function (data) {
                 for (var i = 0; i < $scope.middleItems.length; i++) {
                 if ($scope.middleItems[i] == data.targetScope.middleItem) {
                 $scope.middleItems.splice(i, 1)
                 }
                 }
                 $scope.$emit('deleteImgTop')
                 });

                 $scope.$on('addImgProof', function () {
                 console.log($scope.stepItems)
                 })*/
                /*单选凭证*/
                $scope.radioproof = function (index) {
                    var saved = storageUtils.session.getItem('_saved_');

                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        regex: '',
                        regex_name: null,
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 7,
                        task_id: taskId,
                        tips_text:'点击输入内容',
                        tips_image:'',
                        compress:1,
                        options:'点我输入内容',
                        options_other:0,
                        isText:true//修改必须全选才编辑
                    }
                    $scope.stepItems[index].component.push(data)
                    $scope.componentItems.push(data);
                    storageUtils.session.setItem('_component_', $scope.componentItems)
                    /*$scope.showText(index)*/
                    /*serverService.submitComponent(data)
                     .then(function (data) {
                     if (data.code == 200) {
                     serverService.getComponent(taskId)
                     .then(function (data) {
                     console.log(data)
                     //把凭证信息存入到session
                     storageUtils.session.setItem('_component_', data.result);
                     })
                     }
                     })*/
                    $timeout(function(){
                        if($('#scroll'+index).height()>406){
                            $('#imgUrl'+index).animate({scrollTop:$('#scroll'+index).height()-406})
                        }
                    },100)
                }
                /*多选凭证*/
                $scope.checkboxproof = function () {
                    var saved = storageUtils.session.getItem('_saved_');

                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        regex: '',
                        regex_name: null,
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 8,
                        task_id: taskId,
                        tips_text:'点击输入内容',
                        tips_image:'',
                        isText:true//修改必须全选才编辑
                    }
                    $scope.stepItems[index].component.push(data)
                    $scope.componentItems.push(data);
                    storageUtils.session.setItem('_component_', $scope.componentItems)
                    /*$scope.showText(index)*/
                    /*serverService.submitComponent(data)
                     .then(function (data) {
                     if (data.code == 200) {
                     serverService.getComponent(taskId)
                     .then(function (data) {
                     console.log(data)
                     //把凭证信息存入到session
                     storageUtils.session.setItem('_component_', data.result);
                     })
                     }
                     })*/
                    $timeout(function(){
                        if($('#scroll'+index).height()>406){
                            $('#imgUrl'+index).scrollTop($('#scroll'+index).height())
                        }
                    },100)
                }
                /***步骤的模板编辑*/
                $scope.stepItems.forEach(function (item,index) {
                    if(!item.oldSteps.title){
                        item.oldSteps.title=''
                    }
                    if(!item.oldSteps.desc){
                        item.oldSteps.desc=''
                    }
                    if(!item.oldSteps.url){
                        item.oldSteps.url=''
                    }
                });
                var clickShowTitle
                $scope.showTitle = function (index) {
                    //点击之后另外2项css消失
                    clickShowTitle = true;
                    $('#imgUrl'+index+'stepTitle').parent('div').siblings('li').find('.show-text').find('input').not('.radio-input').css('display','none');
                    $('#imgUrl'+index+'stepTitle').parent('div').siblings('li').find('.show-text').find('p').css('background','');
                    $('#imgUrl'+index+'stepTitle').parent('div').siblings('li').find('.show-text').find('span').css('display','none');
                    $('#imgUrl'+index+'stepDesc').children('p').css('width',288);
                    $('#imgUrl'+index+'stepDesc').children('p').css('background-color','');
                    $('#imgUrl'+index+'stepUrl').children('p').css('background-color','');
                    $('#imgUrl'+index+'stepUrl').children('p').css('width',288);
                    $('#imgUrl'+index+'stepDesc').children('textarea').eq('-1').css('display','none');
                    $('#imgUrl'+index+'stepUrl').children('textarea').eq('-1').css('display','none');
                    $('#imgUrl'+index+'stepUrl .step-title-span').css('display','none');
                    $('#imgUrl'+index+'stepDesc .step-title-span').css('display','none');
                    //编辑框显示
                    var parentHeight = $('#imgUrl'+index+'stepTitle .step-title-span').parent('p').height();
                    $('#imgUrl'+index+'stepTitle .step-title-span').css('display','block');

                    $('#imgUrl'+index+'stepTitle').children('input').eq('-1').css('display','block');
                    var inputHeight = $('#imgUrl'+index+'stepTitle').children('input').eq('-1').height();
                    $('#imgUrl'+index+'stepTitle .step-title-span').css('height',parentHeight);
                    $('#imgUrl'+index+'stepTitle').children('input').eq('-1').css('display','block');
                    $('#imgUrl'+index+'stepTitle').children('input').eq('-1').css('border-color','#FFCCBC');
                    $('#imgUrl'+index+'stepTitle').children('p').css('background-color','rgba(255,87,33,0.26);');
                    $('#imgUrl'+index+'stepTitle').children('input').eq('-1').blur(function () {
                        $('#imgUrl'+index+'stepTitle').children('p').css('background-color','');
                        //$('#imgUrl'+index+'stepTitle').children('p').css('width',288);
                        $(this).css('display','none');
                        $('#imgUrl'+index+'stepTitle .step-title-span').css('display','none');
                    })
                }
                $scope.showDesc = function (index) {
                    $('#imgUrl'+index+'stepDesc').parent('div').siblings('li').find('.show-text').find('input').not('.radio-input').css('display','none');
                    $('#imgUrl'+index+'stepDesc').parent('div').siblings('li').find('.show-text').find('p').css('background','');
                    $('#imgUrl'+index+'stepDesc').parent('div').siblings('li').find('.show-text').find('span').css('display','none');
                    $('#imgUrl'+index+'stepTitle').children('p').css('background-color','');

                    $('#imgUrl'+index+'stepUrl').children('p').css('background-color','');

                    $('#imgUrl'+index+'stepUrl .step-title-span').css('display','none');
                    $('#imgUrl'+index+'stepTitle .step-title-span').css('display','none');
                    $('#imgUrl'+index+'stepTitle').children('input').eq('-1').css('display','none');
                    $('#imgUrl'+index+'stepUrl').children('textarea').eq('-1').css('display','none');
                    //编辑框显示
                    var parentHeight = $('#imgUrl'+index+'stepDesc .step-title-span').parent('p').height();
                    $('#imgUrl'+index+'stepDesc .step-title-span').css('display','block');
                    $('#imgUrl'+index+'stepDesc .step-title-span').css('right','-30');
                    if(clickShowTitle){
                        $('#imgUrl'+index+'stepDesc .step-title-span').css('right','-35');
                    }
                    var textHeight = $('#imgUrl'+index+'stepDesc').children('textarea').eq('-1').height();

                    $('#imgUrl'+index+'stepDesc .step-title-span').css('height',parentHeight);
                    $('#imgUrl'+index+'stepDesc').children('textarea').eq('-1').css('display','block');

                    $('#imgUrl'+index+'stepDesc').children('p').css('background-color','rgba(255,87,33,0.26);');
                    $('#imgUrl'+index+'stepDesc').children('textarea').eq('-1').css('height',parentHeight)
                    $('#imgUrl'+index+'stepDesc').children('textarea').eq('-1').blur(function () {
                        //$('#imgUrl'+index+'stepDesc').children('p').css('width',288);
                        $('#imgUrl'+index+'stepDesc').children('p').css('background-color','');
                        $(this).css('display','none');
                        $('#imgUrl'+index+'stepDesc .step-title-span').css('display','none');
                    })
                }
                $scope.showUrl = function (index) {
                    $('#imgUrl'+index+'stepUrl').parent('div').siblings('li').find('.show-text').find('input').not('.radio-input').css('display','none');
                    $('#imgUrl'+index+'stepUrl').parent('div').siblings('li').find('.show-text').find('p').css('background','');
                    $('#imgUrl'+index+'stepUrl').parent('div').siblings('li').find('.show-text').find('span').css('display','none');
                    $('#imgUrl'+index+'stepTitle').children('p').css('background-color','');

                    $('#imgUrl'+index+'stepDesc').children('p').css('background-color','');
                    $('#imgUrl'+index+'stepTitle').children('input').eq('-1').css('display','none');
                    $('#imgUrl'+index+'stepDesc').children('textarea').eq('-1').css('display','none');
                    $('#imgUrl'+index+'stepDesc .step-title-span').css('display','none');
                    $('#imgUrl'+index+'stepTitle .step-title-span').css('display','none');
                    //编辑框显示
                    var parentHeight = $('#imgUrl'+index+'stepUrl .step-title-span').parent('p').height();
                    $('#imgUrl'+index+'stepUrl .step-title-span').css('display','block');
                    $('#imgUrl'+index+'stepUrl .step-title-span').css('right','-30');
                    if(clickShowTitle){
                        $('#imgUrl'+index+'stepUrl .step-title-span').css('right','-35');
                    }
                    $('#imgUrl'+index+'stepUrl').children('textarea').eq('-1').css('display','block');
                    var textHeight = $('#imgUrl'+index+'stepUrl').children('textarea').eq('-1').height();
                    $('#imgUrl'+index+'stepUrl .step-title-span').css('height',parentHeight);
                    $('#imgUrl'+index+'stepUrl').children('textarea').eq('-1').css('top',(parentHeight-textHeight-5)/2);
                    $('#imgUrl'+index+'stepUrl').children('p').css('background-color','rgba(255,87,33,0.26);');
                    $('#imgUrl'+index+'stepUrl').children('textarea').eq('-1').focus(function () {
                        if($(this).val()=='输入url'){
                            $(this).val('')
                        }
                    })
                    $('#imgUrl'+index+'stepUrl').children('textarea').eq('-1').blur(function () {
                        $('#imgUrl'+index+'stepUrl').children('p').css('background-color','');
                        //$('#imgUrl'+index+'stepUrl').children('p').css('width',288);
                        $(this).css('display','none');
                        $('#imgUrl'+index+'stepUrl .step-title-span').css('display','none');
                    })
                }
                /*$scope.showtitle = function (index) {
                    $('#imgUrl'+index+'title').children('input').eq('-1').css('display','block')
                    $('#imgUrl'+index+'title').children('input').eq('-1').blur(function () {
                        $(this).css('display','block')
                    })
                }*/
                /*显示步骤的图片*/
                $scope.showImg = function (index) {
                    $scope.stepItems[index].oldSteps.images_list.push('../img/show_img.png');
                    $timeout(function(){
                        if($('#scroll'+index).height()>406){
                            $('#imgUrl'+index).animate({scrollTop:$('#scroll'+index).height()-406})
                        }
                    },100)
                }
            }]
        }

    }])
})