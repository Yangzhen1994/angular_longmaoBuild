/**
 * Created by 73951 on 2017/3/17.
 */

define(['app','storageUtils',], function (app,storageUtils,serverService) {
    return  app.controller('reviewDetailCtrl',['$scope','$rootScope','$timeout','$state','serverService',function ($scope,$rootScope,$timeout,$state,serverService) {
        $timeout(function () {
            $('.left').height($('.right').height())
        },100)
        var reviewId = storageUtils.session.getItem('_reviewList_');

        $scope.reviewId = reviewId;
        //默认选中任务编号？
        $scope.chooseType = 2;
        $scope.tabSelected = 0;
        $scope.subTime = '';
        $scope.setChoose = function (type) {
            $scope.chooseType = type
        };
        $scope.reviewDetailInputStop = function (e) {
            e.stopPropagation();
        }
        var aTab1 = $('.tabs-header-1');
        aTab1.click(function () {
            window.location = '#/reviewDetail/reviewDetail/tab1'
        });
        aTab1.trigger('click');
        aTab1.off('click');
        $scope.changeTabBorder = function (index) {
            $scope.tabSelected = index
        };
        $scope.clearTime = function () {
            $scope.subTime = ''
        };
        //导出 导入
        $scope.reviewDetailExport = function () {
            var currentUid = '';
            if($scope.reviewUserId){
                currentUid = $scope.reviewUserId;
            }
            if($scope.chooseType == 2 && $scope.reviewUserId){
                currentUid = ''
            }
            if($scope.tabSelected == 0){
                var currentStatus = 2
            }else if($scope.tabSelected == 1){
                var currentStatus = 3
            }else if($scope.tabSelected == 2){
                var currentStatus = 4
            }
            var data = {
                uid: currentUid,
                tid: storageUtils.session.getItem('_reviewList_'),
                date: $scope.subTime,
                status: currentStatus,
                tip: 1
            };
            if (!data.date) {
                alert('请选择时间');
            } else {
                var url = 'http://manager.shandianshua.com/totoro/task/expimp/export/check/data.html?id=' + data.tid + '&uid=' + data.uid + '&date=' + data.date + '&status=' + data.status + '&tip=1'
                window.open(url)
            }

        };
        $scope.reviewDetailUpload = function (obj) {
            var img = $("#reviewDetailProgressImage");
            var mask = $("#reviewDetailMaskOfProgressImage");
            //var index = obj.id.substr(-1, 1) || obj.id.substr(-2, 2);
            var str = '#reviewDetailImportForm';
            console.log(str);
            console.log(new FormData($(str)[0]));
            $.ajax({
                url: 'http://manager.shandianshua.com/totoro/task/expimp/import/check/data.json',
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                data: new FormData($(str)[0]),
                contentType: false,
                processData: false,
                beforeSend:function(xhr){
                    img.show().css({
                        "position": "fixed",
                        "top": "40%",
                        "left": "45%",
                        "margin-top": function () { return -1 * img.height() / 2; },
                        "margin-left": function () { return -1 * img.width() / 2; }
                    });
                    mask.show().css("opacity", "0.1");
                },
                success: function (data) {
                    if (data.code === '200') {
                        var str =
                        '提交成功\n'+'审核通过:'+data.result.pass+'条\n'+'审核失败:'+data.result.fail+'条\n'+'未处理:'+data.result.nocheck+'条\n';
                        alert(str);
                        if($scope.tabSelected == 0){
                            storageUtils.session.setItem('_imported_',true);
                            window.location = '#/reviewDetail/reviewDetail/tab3'
                        }else if($scope.tabSelected == 1){
                            storageUtils.session.setItem('_imported__',true);
                            window.location = '#/reviewDetail/reviewDetail/tab1'
                        }else if($scope.tabSelected == 2){
                            storageUtils.session.setItem('_imported__',true);
                            window.location = '#/reviewDetail/reviewDetail/tab2'
                        }
                    }
                },
                complete:function(xhr){
                    img.hide();
                    mask.hide();
                }
            });
        };
        $scope.searchCheckBydate = function () {
            if(!$scope.chooseType){
                alert('请选择搜索类别');
                return
            }
            if(!$scope.reviewUserId && $scope.chooseType!=2){
                alert('输入不能为空');
                return
            }
            var data0 = {
                id:storageUtils.session.getItem('_reviewList_'),
                uid:'',
                date:$scope.subTime,
                status:'',
                page:1,
                rows:10
            };
            if($scope.chooseType == 1){
                data0.uid = $scope.reviewUserId
            }
            if($scope.chooseType == 2 && $scope.reviewUserId){
                data0.id = $scope.reviewUserId;
                storageUtils.session.setItem('_reviewList_',data0.id);
                if(storageUtils.session.getItem('_otherReason_') && storageUtils.session.getItem('_otherReason_').taskId != reviewId){
                    storageUtils.session.removeItem('_otherReason_');
                }
                $scope.reviewId = data0.id
            }
            if($scope.tabSelected == 0){
                data0.status = 2;//待审核
                data0.sort = storageUtils.session.getItem('_toReviewSort_');
                data0.order = storageUtils.session.getItem('_toReviewOrder_');
                $scope.resMsg = '此任务的待审核'
            }
            if($scope.tabSelected == 1){
                data0.status = 3;//审核成功
                data0.sort = storageUtils.session.getItem('_reviewOkSort_');
                data0.order = storageUtils.session.getItem('_reviewOkOrder_');
                $scope.resMsg = '此任务的审核成功'
            }
            if($scope.tabSelected == 2){
                data0.status = 4;//审核失败
                data0.sort = storageUtils.session.getItem('_reviewNoSort_');
                data0.order = storageUtils.session.getItem('_reviewNoOrder_');
                $scope.resMsg = '此任务的审核失败'
            }
            console.log(data0);

            serverService.getReviewList(data0).then(function (data) {
                console.log(data)
                if(data.result.rows && data.result.rows.length>0){
                   storageUtils.session.setItem('searchCheckBydate',data.result);
                   //$scope.$broadcast('searchCheckBydate',data)
                    if(data.result.rows[0].status == 3){
                        window.location = '#/reviewDetail/reviewDetail/tab1';
                        return
                    }
                   window.location = '#/reviewDetail/reviewDetail/tab2'
                }else{
                    alert($scope.resMsg+'无');
                    //$scope.subTime = '';
                    //$scope.reviewUserId = '';
                    storageUtils.session.setItem('searchCheckBydate',data.result);
                    if($scope.tabSelected == 0){
                        storageUtils.session.setItem('_FLAG_',true);
                        window.location = '#/reviewDetail/reviewDetail/tab3'
                    }
                    if($scope.tabSelected == 1){
                        storageUtils.session.setItem('_FLAG_',true);
                        window.location = '#/reviewDetail/reviewDetail/tab1'
                    }
                    if($scope.tabSelected == 2){
                        storageUtils.session.setItem('_FLAG_',true);
                        window.location = '#/reviewDetail/reviewDetail/tab2'

                    }
                }
                $scope.subTime = ''
            })
        }
    }]);
});