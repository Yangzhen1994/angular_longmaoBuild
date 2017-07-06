/**
 * Created by 73951 on 2017/3/21.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('posProofModule',['serverService',function (serverService) {
        return {
            restrict: "EA",
            templateUrl: 'tpls/posProof.html',
            link:function (scope,el,attr) {
                var slideInput = document.getElementById('slideInput');
                el.find('img').eq(-1).click(function (e) {
                    e.stopPropagation();
                    e.stopPropagation();
                    console.log($(this).parents('li'));
                    if($(this).parents('li')[0].id.length == 16){
                        var comIndex = $(this).parents('li')[0].id.substr(-3, 3);

                    }else
                    if($(this).parents('li')[0].id.length == 15){
                        var comIndex = $(this).parents('li')[0].id.substr(-2, 2);

                    }else{
                        var comIndex = $(this).parents('li')[0].id.substr(-1, 1);
                    }
                    var stepIndex = $(this).parents('li')[1].id.substr(-1, 1);
                    scope.stepItems[stepIndex].component[comIndex].status = 0;
                    if(scope.stepItems[stepIndex].component[comIndex].id){
                        var toDel = scope.stepItems[stepIndex].component[comIndex];
                        toDel.task_id = storageUtils.session.getItem('_TaskId_');
                        if(toDel.tips_text == '点击输入内容'){
                            toDel.tips_text = ' '
                        }
                        serverService.submitComponent(toDel)
                    }
                    scope.stepItems[stepIndex].component.splice(comIndex,1)
                    scope.$apply();
                })

            }
        }

    }])
})
