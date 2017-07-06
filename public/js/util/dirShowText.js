/**
 * Created by 73951 on 2017/3/23.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('showTextModule',[function () {
        return {
            restrict: "EA",
            templateUrl: 'tpls/showText.html',
            link:function (scope,el,attr) {
                scope.textIndex = el.parents('ul')[0].id.substr(-1,1)
                el.click(function () {
                    el.parent('div').parent('li').siblings('div').find('p').css('background-color','');
                    el.parent('div').parent('li').siblings('div').find('input').css('display','none');
                    el.parent('div').parent('li').siblings('div').find('span').css('display','none');
                    el.parent('div').parent('li').siblings('div').find('textarea').css('display','none');
                    el.find('input').eq(0).css('display','block');
                    el.find('p').css('background-color','rgba(255,87,33,0.26);');
                    el.find('span').css('display','block');
                    console.log(el)
                    el.parent('div').parent('li').siblings('li').find('input').not('.radio-input').css('display','none');
                    el.parent('div').parent('li').siblings('li').find('p').css('background-color','');
                    el.parent('div').parent('li').siblings('li').find('span').css('display','none');
                    el.find('input').click(function (event) {
                        event.stopPropagation();
                        if($(this).val()=='点击输入内容'){
                            $(this).val('')
                        }
                    })
                    el.find('input').eq(0).keyup(function () {
                        var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                        //scope.isText = false;
                        if(this.value.length == 1){
                            if($(this).parents('li')[0].id.length == 16){
                                var comIndex = $(this).parents('li')[0].id.substr(-3, 3);

                            }else
                            if($(this).parents('li')[0].id.length == 15){
                                var comIndex = $(this).parents('li')[0].id.substr(-2, 2);

                            }else{
                                //alert($(this).parents('li')[0].id)
                                var comIndex = $(this).parents('li')[0].id.substr(-1, 1);
                            }
                            var stepIndex = $(this).parents('li')[1].id.substr(-1,1);
                            console.log(stepIndex)
                            scope.stepItems[stepIndex].component[comIndex].isText = true
                        }

                        /*serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                         .then(function () {

                         })*/
                        //serverService.submitComponent(scope.componentItems[comIndex])
                    });
                    //scope.isText = true;
                    //console.log(scope.isText)
                });
                /*el.find('input').change(function () {
                    if($(this).val() == ''){
                        el.find('input').eq(0).css('visibility','visible');
                        el.find('input').eq(0).focus();
                    }
                })*/
                el.find('input').eq(0).blur(function () {

                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    //scope.isText = false;
                    $(this).css('display','none');
                    el.find('span').css('display','none');
                    el.find('p').css('background-color','');
                    if($(this).parents('li')[0].id.length == 16){
                        var comIndex = $(this).parents('li')[0].id.substr(-3, 3);

                    }else
                    if($(this).parents('li')[0].id.length == 15){
                        var comIndex = $(this).parents('li')[0].id.substr(-2, 2);

                    }else{
                        //alert($(this).parents('li')[0].id)
                        var comIndex = $(this).parents('li')[0].id.substr(-1, 1);
                    }
                    var stepIndex = $(this).parents('li')[1].id.substr(-1,1);
                    console.log(stepIndex);
                    scope.stepItems[stepIndex].component[comIndex].isText = false;
                    scope.stepItems[stepIndex].component[comIndex].task_id = taskId;
                    if(scope.stepItems[stepIndex].component[comIndex].tips_text == ''){
                        scope.stepItems[stepIndex].component[comIndex].tips_text = '点击输入内容';
                        scope.$apply()
                    }

                    /*serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                            .then(function () {

                            })*/
                    //serverService.submitComponent(scope.componentItems[comIndex])
                });
                el.find('img').click(function (e) {
                   /* var step =el.parents('li')[0].id;
                    scope.textIndex = step.substr(-1,1);*/
                    e.stopPropagation()
                    console.log($(this).parents('li'))
                    if($(this).parents('li')[0].id.length == 16){
                        var comIndex = $(this).parents('li')[0].id.substr(-3, 3);

                    }else
                    if($(this).parents('li')[0].id.length == 15){
                        var comIndex = $(this).parents('li')[0].id.substr(-2, 2);

                    }else{
                        //alert($(this).parents('li')[0].id)
                        var comIndex = $(this).parents('li')[0].id.substr(-1, 1);
                    }
                    var stepIndex = $(this).parents('li')[1].id.substr(-1,1);
                    //scope.componentItems[comIndex].tips_text = ' ';
                    //scope.componentItems[comIndex].isText = ' ';
                    scope.stepItems[stepIndex].component[comIndex].tips_text = ' ';
                    scope.stepItems[stepIndex].component[comIndex].isText = ' ';
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    scope.stepItems[stepIndex].component[comIndex].task_id = taskId
                    //$(this).parents('.showText').eq(0).css('display','none');
                    $(this).css('display','none')
                    scope.$apply();
                    /*serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                            .then(function (data) {
                                if(data.code == 200){

                                }
                            })*/
                    //
                })

            },
            controller:['$scope',function ($scope) {

               /* $scope.deleteOne = function (e,index) {
                    e.stopPropagation()
                    console.log($scope.componentItems)
                    $scope.componentItems[index].tips_text = ' '
                    $scope.componentItems[index].isText = false
                    serverService.submitComponent($scope.componentItems[index])
                            .then(function (data) {
                                /!*if(data.code == 200){
                                    storageUtils.session.setItem('_component_',$scope.componentItems)
                                }*!/
                            })
                    //storageUtils.session.setItem('_DRAG_',true)
                    //window.location = '#/reviewList';
                }*/
            }]
        }

    }])
})