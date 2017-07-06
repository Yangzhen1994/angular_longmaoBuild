/**
 * Created by 73951 on 2017/3/17.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
define(['app', 'storageUtils',], function (app, storageUtils, serverService) {
    return app.controller('reviewCtrl', ['$rootScope', '$scope', '$timeout', 'serverService', function ($rootScope, $scope, $timeout, serverService) {
        storageUtils.session.removeItem('_toReviewSort_');
        storageUtils.session.removeItem('_toReviewOrder_');
        storageUtils.session.removeItem('_reviewOkSort_');
        storageUtils.session.removeItem('_reviewOkOrder_');
        storageUtils.session.removeItem('_reviewNoSort_');
        storageUtils.session.removeItem('_reviewNoOrder_');
        $timeout(function () {
            $('.left').height($('.right').height())
        }, 100)
        storageUtils.session.removeItem('_reviewList_');
        var drag = storageUtils.session.getItem('_DRAG_');
        storageUtils.session.removeItem('searchCheckBydate');
        if (drag) {
            //storageUtils.session.removeItem('_component_');
            storageUtils.session.removeItem('_DRAG_');
            var oldTaskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_');
            serverService.getComponent(oldTaskId)
                    .then(function (data) {
                        console.log(data);
                        //把凭证信息存入到session
                        storageUtils.session.setItem('_component_', data.result);
                        window.location = '#/addStep';
                    })
        }
        /*显示审核*/
        $scope.chooseType = 1;//默认选中任务id
        $scope.reviewSearchByTaskId = true;
        $scope.reviewSearchByTaskName = false;
        $scope.reviewSearchByPoiId = false;
        serverService.getAllTask({
            id: '',
            title: '',
            pid: '',
            poi_id: '',
            status: '',
            device: 0,
            user: 1,
            page: 1,
           rows: 10,
            show_nocheck: 1
        })
                .then(function (data) {
                    var img = $('#indexProgressImage');
                    var mask = $('#indexMaskOfProgressImage');
                    img.hide();
                    mask.hide();
                    var checkArr = [];
                    data.result.rows.forEach(function (item, index) {
                        /*if(item.nocheck_nums>0){*/
                        checkArr.push(item);
                        /* }*/
                    })
                    $scope.items = checkArr;
                    $scope.items.forEach(function (item, index) {
                        item.title = item.title.replace(/&nbsp;/g, '')
                        $scope.oneAchieve = item.num.split('>')[1];
                    });
                    $rootScope.totalCount = data.result.total;
                    $rootScope.pageIndex = 1;
                    $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                    $rootScope.toPage = function (index) {
                        if (index < 1) {
                            index = 1
                        }
                        if (index > $rootScope.pageTotal) {
                            index--;
                            $rootScope.pageIndex = index;
                        }
                        $rootScope.pageIndex = index;
                        var data = {
                            id: '',
                            title: '',
                            pid: '',
                            poi_id: '',
                            status: '',
                            device: 0,
                            user: 1,
                            page: index,
                           rows: 10,
                            show_nocheck: 1
                        };
                        serverService.getAllTask(data)
                            .then(function (data) {
                                var img = $('#indexProgressImage');
                                var mask = $('#indexMaskOfProgressImage');
                                img.hide();
                                mask.hide();
                                $rootScope.taskLists = data.result.rows
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '');
                                    $scope.oneAchieve = item.num.split('>')[1];
                                });
                                $scope.items.forEach(function (item, index) {
                                    if (item.status == 1) {
                                        //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                        item.endTime = item.end_time;
                                        item.line = '上线'
                                    } else if (item.status == 2) {
                                        item.endTime = item.end_time;
                                        item.line = '下线'
                                    } else if (item.status == 3) {
                                        item.endTime = item.end_time.split('>')[1].substr(0, 19)
                                        item.line = '上线'
                                    }

                                });
                            })
                    };
                    $scope.setChoose = function (type) {
                        $scope.chooseType = type;
                        /**绑定id name 或者 poiid**/
                        switch (type) {
                            case 1: {
                                //alert('renwuID');
                                $scope.reviewSearchByTaskId = true;
                                $scope.reviewSearchByTaskName = false;
                                $scope.reviewSearchByPoiId = false;
                                break;
                            }
                            case 2: {
                                //alert('renwuName');
                                $scope.reviewSearchByTaskId = false;
                                $scope.reviewSearchByTaskName = true;
                                $scope.reviewSearchByPoiId = false;
                                break;
                            }
                            case 3: {
                                //alert('poiID');
                                $scope.reviewSearchByTaskId = false;
                                $scope.reviewSearchByTaskName = false;
                                $scope.reviewSearchByPoiId = true;
                                break;
                            }
                        }
                    };
                    $scope.items.forEach(function (item, index) {
                        if (item.status == 1) {
                            //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                            item.endTime = item.end_time;
                            //alert(item.endTime)
                            item.line = '上线'
                        } else if (item.status == 2) {
                            //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                            item.endTime = item.end_time;
                            item.line = '下线'
                        } else if (item.status == 3) {
                            item.endTime = item.end_time.split('>')[1].substr(0, 19)
                            item.line = '上线'
                        }

                    });
                    var reviewArr = [];
                    $scope.turnToReviewDetail = function (index) {
                        storageUtils.session.setItem('_reviewList_', $scope.items[index].id);
                        window.location = '#/reviewDetail'
                    };
                    /**导出**/
                    $scope.exportStates = [
                        {exportState: '待审核'},//2
                        {exportState: '未提交'},//1
                        {exportState: '审核成功'},//3
                        {exportState: '审核失败'},//4
                    ];
                    $scope.export = function (item, index) {
                        var num = 1;
                        item.exportShow = !item.exportShow;
                        var data0 = {
                            id: item.id,
                            uid: '',
                            date: '',
                            status: 2,
                            page: 1,
                            rows: 100
                        }
                        $scope.chooseState = function (item) {
                            console.log($scope.exportItem);

                            if (item.exportItem.exportState == '待审核') {
                                //alert(1)
                                data0.status = 2
                            }
                            if (item.exportItem.exportState == '未提交') {
                                //alert(1)
                                data0.status = 1
                            }
                            if (item.exportItem.exportState == '审核成功') {
                                //alert(1)
                                data0.status = 3
                            }
                            if (item.exportItem.exportState == '审核失败') {
                                //alert(1)
                                data0.status = 4
                            }
                            serverService.getReviewList(data0)
                                .then(function (data) {
                                    item.exportShow = false;
                                    item.exportItem = {};
                                    var data = {
                                        uid: '',
                                        tid: item.id,
                                        date: $scope.exportSubmitTime,
                                        status: data0.status,
                                        tip: 1
                                    };
                                    if (!data.date) {
                                        alert('请选择时间');
                                    } else {
                                        var url = 'http://manager.shandianshua.com/totoro/task/expimp/export/check/data.html?id=' + data.tid + '&uid=' + data.uid + '&date=' + data.date + '&status=' + data.status + '&tip=1'
                                        window.open(url)
                                    }
                                })
                        }
                    };
                    /*导入*/
                    $scope.file_upload = function (obj) {
                        var img = $("#progressImage");
                        var mask = $("#maskOfProgressImage");
                        var index = obj.id.substr(-1, 1) || obj.id.substr(-2, 2);
                        var str = '#totoroTaskCheckFileForm' + index;
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
                                }
                            },
                            complete:function(xhr){
                                img.hide();
                                mask.hide();
                            }
                        });
                    };
                    /***reveiewSearch**/
                    $scope.reveiewSearch = function () {
                        if (!$scope.reviewSearchByTaskId && !$scope.reviewSearchByTaskName && !$scope.reviewSearchByPoiId) {
                            alert('请选择搜索类别');
                            return
                        }
                        /*任务Id*/
                        if ($scope.reviewSearchByTaskId == true && $scope.searchReviewContent) {
                            serverService.getAllTask({
                                id: $scope.searchReviewContent * 1,
                                title: '',
                                pid: '',
                                poi_id: '',
                                status: '',
                                device: 0,
                                user: 0,
                                page: 1,
                               rows: 10
                            }).then(function (data) {
                                var img = $('#indexProgressImage');
                                var mask = $('#indexMaskOfProgressImage');
                                img.hide();
                                mask.hide();
                                $scope.searchReviewContent = '';
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '');
                                    $scope.oneAchieve = item.num.split('>')[1];
                                })
                                $rootScope.totalCount = data.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                $rootScope.toPage = function (index) {
                                    if (!$scope.searchReviewContent) {
                                        return
                                    }
                                    $scope.statusLate = true;
                                    if (index < 1) {
                                        index = 1
                                    }
                                    if (index > $rootScope.pageTotal) {
                                        index--;
                                        $rootScope.pageIndex = index;
                                    }
                                    $rootScope.pageIndex = index;
                                    var data = {
                                        id: $scope.searchReviewContent * 1,
                                        title: '',
                                        pid: '',
                                        poi_id: '',
                                        status: '',
                                        device: 0,
                                        user: 1,
                                        page: index,
                                       rows: 10
                                    };
                                    serverService.getAllTask(data)
                                        .then(function (data) {
                                            var img = $('#indexProgressImage');
                                            var mask = $('#indexMaskOfProgressImage');
                                            img.hide();
                                            mask.hide();
                                            $scope.items = data.result.rows;
                                            $scope.items.forEach(function (item, index) {
                                                item.title = item.title.replace(/&nbsp;/g, '');
                                                $scope.oneAchieve = item.num.split('>')[1];
                                            });
                                            $scope.items.forEach(function (item, index) {
                                                if (item.status == 1) {
                                                    //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                                    item.endTime = item.end_time;
                                                    //alert(item.endTime)
                                                    item.line = '上线'
                                                } else if (item.status == 2) {
                                                    //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                                    item.endTime = item.end_time;
                                                    item.line = '下线'
                                                } else if (item.status == 3) {
                                                    item.endTime = item.end_time.split('>')[1].substr(0, 19)
                                                    item.line = '上线'
                                                }

                                            });
                                            $scope.searchReviewContent = ''
                                        })
                                };
                                $scope.items.forEach(function (item, index) {
                                    if (item.status == 1) {
                                        item.line = '上线'
                                    } else if (item.status == 2) {

                                        item.line = '下线'
                                    } else if (item.status == 3) {
                                        item.line = '上线'
                                    }

                                });
                                $scope.items.forEach(function (item, index) {
                                    if (item.status == 1) {
                                        //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                        item.endTime = item.end_time;
                                        //alert(item.endTime)
                                        item.line = '上线'
                                    } else if (item.status == 2) {
                                        //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                        item.endTime = item.end_time;
                                        item.line = '下线'
                                    } else if (item.status == 3) {
                                        item.endTime = item.end_time.split('>')[1].substr(0, 19)
                                        item.line = '上线'
                                    }

                                });
                            })
                        }
                        /**任务名字**/
                        if ($scope.reviewSearchByTaskName == true && $scope.searchReviewContent) {
                            serverService.getAllTask({
                                id: '',
                                title: $scope.searchReviewContent,
                                pid: '',
                                poi_id: '',
                                status: '',
                                device: 0,
                                user: 1,
                                page: 1,
                               rows: 10
                            }).then(function (data) {
                                var img = $('#indexProgressImage');
                                var mask = $('#indexMaskOfProgressImage');
                                img.hide();
                                mask.hide();
                                $scope.searchReviewContent = '';
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '');
                                    $scope.oneAchieve = item.num.split('>')[1].split('<')[0];
                                })
                                $rootScope.totalCount = data.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                $rootScope.toPage = function (index) {
                                    /*if(!$scope.searchReviewContent){
                                     return
                                     }*/
                                    $scope.statusLate = true;
                                    if (index < 1) {
                                        index = 1
                                    }
                                    if (index > $rootScope.pageTotal) {
                                        index--;
                                        $rootScope.pageIndex = index;
                                    }
                                    $rootScope.pageIndex = index;
                                    var data = {
                                        id: '',
                                        title: $scope.searchReviewContent,
                                        pid: '',
                                        poi_id: '',
                                        status: '',
                                        device: 0,
                                        user: 1,
                                        page: index,
                                       rows: 10
                                    };
                                    serverService.getAllTask(data)
                                        .then(function (data) {
                                            var img = $('#indexProgressImage');
                                            var mask = $('#indexMaskOfProgressImage');
                                            img.hide();
                                            mask.hide();
                                            $scope.items = data.result.rows;
                                            $scope.items.forEach(function (item, index) {
                                                item.title = item.title.replace(/&nbsp;/g, '');
                                                $scope.oneAchieve = item.num.split('>')[1];
                                            });
                                            $scope.items.forEach(function (item, index) {
                                                if (item.status == 1) {
                                                    //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                                    item.endTime = item.end_time;
                                                    //alert(item.endTime)
                                                    item.line = '上线'
                                                } else if (item.status == 2) {
                                                    //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                                    item.endTime = item.end_time;
                                                    item.line = '下线'
                                                } else if (item.status == 3) {
                                                    item.endTime = item.end_time.split('>')[1].substr(0, 19)
                                                    item.line = '上线'
                                                }

                                            });
                                            $scope.stateItems = [
                                                {state: '未上线'},
                                                {state: '已上线'},
                                                {state: '已过期'}
                                            ];
                                            $scope.deviceItems = [
                                                {deviceType: 'Android'},
                                                {deviceType: 'IOS'},
                                            ];
                                            $scope.belongToUserItems = [
                                                {belongTo: '归属用户'},
                                            ];
                                            $scope.searchReviewContent = ''
                                        })
                                };
                                $scope.items.forEach(function (item, index) {
                                    if (item.status == 1) {
                                        //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                        item.endTime = item.end_time;
                                        //alert(item.endTime)
                                        item.line = '上线'
                                    } else if (item.status == 2) {
                                        //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                        item.endTime = item.end_time;
                                        item.line = '下线'
                                    } else if (item.status == 3) {
                                        item.endTime = item.end_time.split('>')[1].substr(0, 19)
                                        item.line = '上线'
                                    }

                                });

                            })
                        }
                        /**poi_id**/
                        if ($scope.reviewSearchByPoiId == true && $scope.searchReviewContent) {
                            serverService.getAllTask({
                                id: '',
                                title: '',
                                pid: '',
                                poi_id: $scope.searchReviewContent,
                                status: '',
                                device: 0,
                                user: 1,
                                page: 1,
                               rows: 10
                            }).then(function (data) {
                                var img = $('#indexProgressImage');
                                var mask = $('#indexMaskOfProgressImage');
                                img.hide();
                                mask.hide();
                                $scope.searchReviewContent = '';
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '');
                                    $scope.oneAchieve = item.num.split('>')[1];
                                })
                                $rootScope.totalCount = data.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                $rootScope.toPage = function (index) {
                                    if (!$scope.searchReviewContent) {
                                        return
                                    }
                                    $scope.statusLate = true;
                                    if (index < 1) {
                                        index = 1
                                    }
                                    if (index > $rootScope.pageTotal) {
                                        index--;
                                        $rootScope.pageIndex = index;
                                    }
                                    $rootScope.pageIndex = index;
                                    var data = {
                                        id: '',
                                        title: $scope.searchReviewContent,
                                        pid: '',
                                        poi_id: '',
                                        status: '',
                                        device: 0,
                                        user: 1,
                                        page: index,
                                       rows: 10
                                    };
                                    serverService.getAllTask(data)
                                        .then(function (data) {
                                            var img = $('#indexProgressImage');
                                            var mask = $('#indexMaskOfProgressImage');
                                            img.hide();
                                            mask.hide();
                                            $scope.items = data.result.rows;
                                            $scope.items.forEach(function (item, index) {
                                                item.title = item.title.replace(/&nbsp;/g, '');
                                                $scope.oneAchieve = item.num.split('>')[1];
                                            })
                                            $scope.items.forEach(function (item, index) {
                                                if (item.status == 1) {
                                                    //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                                    item.endTime = item.end_time;
                                                    //alert(item.endTime)
                                                    item.line = '上线'
                                                } else if (item.status == 2) {
                                                    //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                                    item.endTime = item.end_time;
                                                    item.line = '下线'
                                                } else if (item.status == 3) {
                                                    item.endTime = item.end_time.split('>')[1].substr(0, 19)
                                                    item.line = '上线'
                                                }

                                            });
                                            $scope.stateItems = [
                                                {state: '未上线'},
                                                {state: '已上线'},
                                                {state: '已过期'}
                                            ];
                                            $scope.deviceItems = [
                                                {deviceType: 'Android'},
                                                {deviceType: 'IOS'},
                                            ];
                                            $scope.belongToUserItems = [
                                                {belongTo: '归属用户'},
                                            ];
                                            $scope.searchReviewContent = ''
                                        })
                                };
                                $scope.items.forEach(function (item, index) {
                                    if (item.status == 1) {
                                        //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                        item.endTime = item.end_time;
                                        //alert(item.endTime)
                                        item.line = '上线'
                                    } else if (item.status == 2) {
                                        //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                        item.endTime = item.end_time;
                                        item.line = '下线'
                                    } else if (item.status == 3) {
                                        item.endTime = item.end_time.split('>')[1].substr(0, 19)
                                        item.line = '上线'
                                    }

                                });
                            })
                        }
                        console.log($scope.searchReviewContent)
                    };

                    $scope.returnToSelf = function () {
                        serverService.getAllTask({
                            id: '',
                            title: '',
                            pid: '',
                            poi_id: '',
                            status: '',
                            device: 0,
                            user: 1,
                            page: 1,
                           rows: 10
                        }).then(function (data) {
                            var img = $('#indexProgressImage');
                            var mask = $('#indexMaskOfProgressImage');
                            img.hide();
                            mask.hide();
                            $scope.items = data.result.rows;
                            $scope.items.forEach(function (item, index) {
                                item.title = item.title.replace(/&nbsp;/g, '');
                                $scope.oneAchieve = item.num.split('>')[1];
                            })
                            $rootScope.totalCount = data.result.total;
                            $rootScope.pageIndex = 1;
                            $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                            $rootScope.toPage = function (index) {
                                if (index < 1) {
                                    index = 1
                                }
                                if (index > $rootScope.pageTotal) {
                                    index--;
                                    $rootScope.pageIndex = index;
                                }
                                $rootScope.pageIndex = index;
                                var data = {
                                    id: '',
                                    title: '',
                                    pid: '',
                                    poi_id: '',
                                    status: '',
                                    device: 0,
                                    user: 1,
                                    page: index,
                                   rows: 10
                                };
                                serverService.getAllTask(data)
                                    .then(function (data) {
                                        var img = $('#indexProgressImage');
                                        var mask = $('#indexMaskOfProgressImage');
                                        img.hide();
                                        mask.hide();
                                        $scope.items = data.result.rows;
                                        $scope.items.forEach(function (item, index) {
                                            item.title = item.title.replace(/&nbsp;/g, '');
                                            $scope.oneAchieve = item.num.split('>')[1];
                                        })
                                        $scope.items.forEach(function (item, index) {
                                            if (item.status == 1) {
                                                //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                                item.endTime = item.end_time;
                                                //alert(item.endTime)
                                                item.line = '上线'
                                            } else if (item.status == 2) {
                                                //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                                item.endTime = item.end_time;
                                                item.line = '下线'
                                            } else if (item.status == 3) {
                                                item.endTime = item.end_time.split('>')[1].substr(0, 19)
                                                item.line = '上线'
                                            }

                                        });
                                    })
                            };
                            $scope.items.forEach(function (item, index) {
                                if (item.status == 1) {
                                    //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                    item.endTime = item.end_time;
                                    //alert(item.endTime)
                                    item.line = '上线'
                                } else if (item.status == 2) {
                                    //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                    item.endTime = item.end_time;
                                    item.line = '下线'
                                } else if (item.status == 3) {
                                    item.endTime = item.end_time.split('>')[1].substr(0, 19)
                                    item.line = '上线'
                                }

                            });
                        })
                    }
                })
    }]);
});