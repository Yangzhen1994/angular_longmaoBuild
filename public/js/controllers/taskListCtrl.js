/**
 * Created by 73951 on 2017/3/16.
 */

/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
define(['app', 'storageUtils'], function (app, storageUtils) {
    return app.controller('taskListCtrl', ['$rootScope', '$scope', '$timeout', 'serverService',
        function ($rootScope, $scope, $timeout, serverService) {
            $timeout(function () {
                $('.left').css('height', 'calc(100% - 72px)');
            }, 100);
            storageUtils.session.removeItem('editData');
            storageUtils.session.removeItem('_TaskId_');
            storageUtils.session.removeItem('_newTaskid_');
            storageUtils.session.removeItem('_oldStep_');
            storageUtils.session.removeItem('_component_');
            storageUtils.session.removeItem('_comIndex_');
            storageUtils.session.removeItem('_componentId_');
            storageUtils.session.removeItem('_toReviewSort_');
            storageUtils.session.removeItem('_toReviewOrder_');
            storageUtils.session.removeItem('_reviewOkSort_');
            storageUtils.session.removeItem('_reviewOkOrder_');
            storageUtils.session.removeItem('_reviewNoSort_');
            storageUtils.session.removeItem('_reviewNoOrder_');
            storageUtils.session.removeItem('_otherReason_');

            $scope.chooseType = 1;
            $scope.searchByTaskId = true;
            $scope.searchByTaskName = false;
            $scope.searchByPoiId = false;
            $scope.state = '';
            $scope.selected = '';
            $scope.loadingState = '任务状态';
            $scope.loadingDevice = '设备类型';
            $scope.loadingUser = '全部用户';
            $scope.nowUser = '全部用户';
            $scope.data = {
                id: '',
                title: '',
                pid: '',
                poi_id: '',
                status: '',
                device: 0,
                user: 0,
                page: 1,
                rows: 20,
                show_nocheck: 1
            };
            if (storageUtils.session.getItem('_DOWNLINE_')) {
                $scope.data.user = 1;
                //$scope.isDownLine = true
                $timeout(function () {
                    $('#belongUser>option').eq(0).attr('selected', false);
                    $('#belongUser>option').eq(-1).attr('selected', true);
                }, 300);
                storageUtils.session.removeItem('_DOWNLINE_');
                $scope.nowUserFlag = true;
                $scope.userLate = true;
            }
            /*上来显示任务*/
            serverService.getAllTask($scope.data)
                .then(function (data) {
                    var img = $('#indexProgressImage');
                    var mask = $('#indexMaskOfProgressImage');
                    img.hide();
                    mask.hide();
                    $rootScope.taskLists = data.result.rows;
                    $scope.items = data.result.rows;
                    $scope.items.forEach(function (item, index) {
                            item.title = item.title.replace(/&nbsp;/g, '');
                            $scope.oneAcheive = item.num.split('>')[1].split('<')[0];
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
                            user: 0,
                            page: index,
                            rows: 20,
                            show_nocheck: 1
                        };
                        if ($scope.nowUserFlag) {
                            data.user = 1;
                            $scope.loadingUser = '仅自己的';
                            $scope.userLate = true;
                        }
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
                                    $scope.oneAcheive = item.num.split('>')[1].split('<')[0];
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
                                    {deviceType: 'IOS'}
                                ];
                                $scope.belongToUserItems = [
                                    {belongTo: '仅自己的'}
                                ];
                            })
                    };
                    console.log($scope.items)
                    $scope.setChoose = function (type) {
                        $scope.chooseType = type;
                        /**绑定id name 或者 poiid**/
                        switch (type) {
                            case 1: {
                                //alert('renwuID');
                                $scope.searchByTaskId = true;
                                $scope.searchByTaskName = false;
                                $scope.searchByPoiId = false;
                                break;
                            }
                            case 2: {
                                //alert('renwuName');
                                $scope.searchByTaskId = false;
                                $scope.searchByTaskName = true;
                                $scope.searchByPoiId = false;
                                break;
                            }
                            case 3: {
                                //alert('poiID');
                                $scope.searchByTaskId = false;
                                $scope.searchByTaskName = false;
                                $scope.searchByPoiId = true;
                                break;
                            }
                        }
                    };
                    $scope.items.forEach(function (item, index) {
                        if (item.status == 1) {
                            item.endTime = item.end_time;
                            item.line = '上线'
                        } else if (item.status == 2) {
                            //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                            item.endTime = item.end_time;
                            item.line = '下线'
                        } else if (item.status == 3) {
                            item.endTime = item.end_time.split('>')[1].substr(0, 19);
                            item.line = '上线'
                        }
                    });
                    /*正则匹配数字*/
                    $scope.testNum = new RegExp("/d");
                    /***changeSelect**/
                    $scope.stateItems = [
                        {state: '未上线'},
                        {state: '已上线'},
                        {state: '已过期'}
                    ];
                    $scope.deviceItems = [
                        {deviceType: 'Android'},
                        {deviceType: 'IOS'}
                    ];
                    $scope.belongToUserItems = [
                        {belongTo: '仅自己的'}
                    ];
                    /**状态筛选*/
                    $scope.upStateShow = function () {
                        storageUtils.session.setItem('_state_', $scope.taskState)
                        //console.log($scope.taskState.state)//正在进行
                        if ($scope.taskState == null) {
                            $scope.nowUserFlag = false;
                            //window.location.reload();
                            //没有点击下一页之后走这里
                            if (!$scope.statusLate) {
                                serverService.getAllTask({
                                    id: '',
                                    title: '',
                                    pid: '',
                                    poi_id: '',
                                    status: '',
                                    device: 0,
                                    user: 0,
                                    page: 1,
                                    rows: 20
                                }).then(function (data) {
                                    var img = $('#indexProgressImage');
                                    var mask = $('#indexMaskOfProgressImage');
                                    img.hide();
                                    mask.hide();
                                    $rootScope.taskLists = data.result.rows;
                                    $scope.items = data.result.rows;
                                    $scope.items.forEach(function (item, index) {
                                        item.title = item.title.replace(/&nbsp;/g, '')
                                    });
                                    $rootScope.totalCount = data.result.total;
                                    $rootScope.pageIndex = 1;
                                    $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                    $rootScope.toPage = function (index) {
                                        if (index < 1) {
                                            index = 1;
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
                                            user: 0,
                                            page: index,
                                            rows: 20,
                                            show_nocheck: 1
                                        };
                                        serverService.getAllTask(data)
                                            .then(function (data) {
                                                var img = $('#indexProgressImage');
                                                var mask = $('#indexMaskOfProgressImage');
                                                img.hide();
                                                mask.hide();
                                                $rootScope.taskLists = data.result.rows;
                                                $scope.items = data.result.rows;
                                                $scope.items.forEach(function (item, index) {
                                                    item.title = item.title.replace(/&nbsp;/g, '')
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
                                                    {belongTo: '仅自己的'},
                                                ];
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
                                });
                            } else {
                                $scope.stateItems.forEach(function (item, index) {
                                    if (item.state == $scope.loadingState) {
                                        $scope.taskState = item;
                                        $scope.statusLate = false;
                                    }
                                })
                            }
                            return
                        } else if ($scope.taskState.state == '未上线') {
                            serverService.getAllTask({
                                id: '',
                                title: '',
                                pid: '',
                                poi_id: '',
                                status: 1,
                                device: 0,
                                user: 0,
                                page: 1,
                                rows: 20
                            }).then(function (data) {
                                var img = $('#indexProgressImage');
                                var mask = $('#indexMaskOfProgressImage');
                                img.hide();
                                mask.hide();
                                $rootScope.taskLists = data.result.rows;
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '')
                                })
                                $rootScope.totalCount = data.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);

                                $rootScope.toPage = function (index) {

                                    $scope.statusLate = true;
                                    $scope.loadingState = '未上线'
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
                                        status: 1,
                                        device: 0,
                                        user: 0,
                                        page: index,
                                        rows: 20,
                                        show_nocheck: 1
                                    };
                                    serverService.getAllTask(data)
                                        .then(function (data) {
                                            var img = $('#indexProgressImage');
                                            var mask = $('#indexMaskOfProgressImage');
                                            img.hide();
                                            mask.hide();
                                            $rootScope.taskLists = data.result.rows;
                                            $scope.items = data.result.rows;
                                            $scope.items.forEach(function (item, index) {
                                                item.title = item.title.replace(/&nbsp;/g, '')
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
                                                {belongTo: '仅自己的'},
                                            ];
                                        })
                                }
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
                        } else if ($scope.taskState.state == '已上线') {
                            serverService.getAllTask({
                                id: '',
                                title: '',
                                pid: '',
                                poi_id: '',
                                status: 2,
                                device: 0,
                                user: 0,
                                page: 1,
                                rows: 20
                            }).then(function (data) {
                                var img = $('#indexProgressImage');
                                var mask = $('#indexMaskOfProgressImage');
                                img.hide();
                                mask.hide();
                                $rootScope.taskLists = data.result.rows;
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '')
                                })
                                $rootScope.totalCount = data.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                $rootScope.toPage = function (index) {

                                    $scope.statusLate = true;
                                    $scope.loadingState = '已上线'
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
                                        status: 2,
                                        device: 0,
                                        user: 0,
                                        page: index,
                                        rows: 20,
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
                                                item.title = item.title.replace(/&nbsp;/g, '')
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
                                                {belongTo: '仅自己的'},
                                            ];
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
                        } else if ($scope.taskState.state == '已过期') {
                            serverService.getAllTask({
                                id: '',
                                title: '',
                                pid: '',
                                poi_id: '',
                                status: 3,
                                device: 0,
                                user: 0,
                                page: 1,
                                rows: 20
                            }).then(function (data) {
                                var img = $('#indexProgressImage');
                                var mask = $('#indexMaskOfProgressImage');
                                img.hide();
                                mask.hide();
                                $rootScope.taskLists = data.result.rows;
                                //$scope.taskState.state = '已过期'
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '')
                                });
                                $rootScope.totalCount = data.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);

                                $rootScope.toPage = function (index, ev) {
                                    $scope.statusLate = true;
                                    //$scope.taskState.state = '已过期'
                                    $scope.loadingState = '已过期';

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
                                        status: 3,
                                        device: 0,
                                        user: 0,
                                        page: index,
                                        rows: 20,
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
                                                    item.title = item.title.replace(/&nbsp;/g, '')
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
                                                    {deviceType: 'IOS'}
                                                ];
                                                $scope.belongToUserItems = [
                                                    {belongTo: '仅自己的'}
                                                ];
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
                        //console.log($scope.items)
                    };
                    /**设备筛选*/
                    $scope.upDeviceShow = function () {
                        if ($scope.deviceType == null) {
                            //window.location.reload();
                            if (!$scope.deviceLate) {
                                serverService.getAllTask({
                                    id: '',
                                    title: '',
                                    pid: '',
                                    poi_id: '',
                                    status: '',
                                    device: 0,
                                    user: 0,
                                    page: 1,
                                    rows: 20
                                }).then(function (data) {
                                    var img = $('#indexProgressImage');
                                    var mask = $('#indexMaskOfProgressImage');
                                    img.hide();
                                    mask.hide();
                                    $rootScope.taskLists = data.result.rows;
                                    $scope.items = data.result.rows;
                                    $scope.items.forEach(function (item, index) {
                                        item.title = item.title.replace(/&nbsp;/g, '')
                                    });
                                    $rootScope.totalCount = data.result.total;
                                    $rootScope.pageIndex = 1;
                                    $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                    $rootScope.toPage = function (index) {
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
                                            title: '',
                                            pid: '',
                                            poi_id: '',
                                            status: '',
                                            device: 0,
                                            user: 0,
                                            page: index,
                                            rows: 20
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
                                                    item.title = item.title.replace(/&nbsp;/g, '')
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
                                                    {belongTo: '仅自己的'},
                                                ];
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
                            } else {
                                $scope.deviceItems.forEach(function (item) {
                                    if (item.deviceType == $scope.loadingDevice) {
                                        $scope.deviceType = item;
                                        $scope.deviceLate = false;
                                    }
                                })
                            }
                            return
                        } else {
                            if ($scope.deviceType.deviceType == 'Android') {
                                serverService.getAllTask({
                                    id: '',
                                    title: '',
                                    pid: '',
                                    poi_id: '',
                                    status: '',
                                    device: 1,
                                    user: 0,
                                    page: 1,
                                    rows: 20
                                }).then(function (data) {
                                    var img = $('#indexProgressImage');
                                    var mask = $('#indexMaskOfProgressImage');
                                    img.hide();
                                    mask.hide();
                                    $rootScope.taskLists = data.result.rows;
                                    $scope.items = data.result.rows;
                                    $scope.items.forEach(function (item, index) {
                                        item.title = item.title.replace(/&nbsp;/g, '')
                                    })
                                    $rootScope.totalCount = data.result.total;
                                    $rootScope.pageIndex = 1;
                                    $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                    $rootScope.toPage = function (index) {
                                        $scope.loadingDevice = 'Android';
                                        // $scope.statusLate = true;
                                        $scope.deviceLate = true;
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
                                            device: 1,
                                            user: 0,
                                            page: index,
                                            rows: 20
                                        };
                                        serverService.getAllTask(data)
                                            .then(function (data) {
                                                var img = $('#indexProgressImage');
                                                var mask = $('#indexMaskOfProgressImage');
                                                img.hide();
                                                mask.hide();
                                                $rootScope.taskLists = data.result.rows;
                                                $scope.items = data.result.rows;
                                                $scope.items.forEach(function (item, index) {
                                                    item.title = item.title.replace(/&nbsp;/g, '')
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
                                                    {belongTo: '仅自己的'},
                                                ];
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
                            if ($scope.deviceType.deviceType == 'IOS') {
                                serverService.getAllTask({
                                    id: '',
                                    title: '',
                                    pid: '',
                                    poi_id: '',
                                    status: '',
                                    device: 2,
                                    user: 0,
                                    page: 1,
                                    rows: 10
                                }).then(function (data) {
                                    var img = $('#indexProgressImage');
                                    var mask = $('#indexMaskOfProgressImage');
                                    img.hide();
                                    mask.hide();
                                    $rootScope.taskLists = data.result.rows;
                                    $scope.items = data.result.rows;
                                    $scope.items.forEach(function (item, index) {
                                        item.title = item.title.replace(/&nbsp;/g, '')
                                    });
                                    $rootScope.totalCount = data.result.total;
                                    $rootScope.pageIndex = 1;
                                    $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                    $rootScope.toPage = function (index) {
                                        //$scope.statusLate = true;
                                        $scope.deviceLate = true;
                                        $scope.loadingDevice = 'IOS';
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
                                            device: 2,
                                            user: 0,
                                            page: 1,
                                            rows: 20
                                        };
                                        serverService.getAllTask(data)
                                            .then(function (data) {
                                                var img = $('#indexProgressImage');
                                                var mask = $('#indexMaskOfProgressImage');
                                                img.hide();
                                                mask.hide();
                                                $rootScope.taskLists = data.result.rows;
                                                $scope.items = data.result.rows;
                                                $scope.items.forEach(function (item, index) {
                                                    item.title = item.title.replace(/&nbsp;/g, '')
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
                                                    {deviceType: 'IOS'}
                                                ];
                                                $scope.belongToUserItems = [
                                                    {belongTo: '仅自己的'}
                                                ];
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
                        }
                    };
                    $scope.upUserShow = function () {
                        if ($scope.belongUser == null) {
                            if (!$scope.userLate || $scope.loadingUser == '全部用户') {
                                serverService.getAllTask({
                                    id: '',
                                    title: '',
                                    pid: '',
                                    poi_id: '',
                                    status: '',
                                    device: 0,
                                    user: 0,
                                    page: 1,
                                    rows: 20
                                }).then(function (data) {
                                    var img = $('#indexProgressImage');
                                    var mask = $('#indexMaskOfProgressImage');
                                    img.hide();
                                    mask.hide();
                                    $rootScope.taskLists = data.result.rows;
                                    $scope.items = data.result.rows;
                                    $scope.items.forEach(function (item, index) {
                                        item.title = item.title.replace(/&nbsp;/g, '')
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
                                            user: 0,
                                            page: index,
                                            rows: 20
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
                                                    item.title = item.title.replace(/&nbsp;/g, '')
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
                                                    {deviceType: 'IOS'}
                                                ];
                                                $scope.belongToUserItems = [
                                                    {belongTo: '仅自己的'}
                                                ];
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
                            } else {
                                $scope.belongToUserItems.forEach(function (item, index) {
                                    if (item.belongTo == $scope.loadingUser) {
                                        $scope.belongUser = item;
                                        $scope.userLate = false;
                                    }
                                })
                            }

                            return
                        }
                        serverService.getAllTask({
                            id: '',
                            title: '',
                            pid: '',
                            poi_id: '',
                            status: '',
                            device: 0,
                            user: 1,
                            page: 1,
                            rows: 20,
                            show_nocheck: 1
                        }).then(function (data) {
                            var img = $('#indexProgressImage');
                            var mask = $('#indexMaskOfProgressImage');
                            img.hide();
                            mask.hide();
                            $rootScope.taskLists = data.result.rows;
                            $scope.items = data.result.rows;
                            $scope.items.forEach(function (item, index) {
                                item.title = item.title.replace(/&nbsp;/g, '')
                            })
                            $rootScope.totalCount = data.result.total;
                            $rootScope.pageIndex = 1;
                            $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                            $rootScope.toPage = function (index) {

                                $scope.loadingUser = '仅自己的';
                                //$scope.statusLate = true;
                                // $scope.deviceLate = true;
                                $scope.userLate = true;
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
                                    rows: 20
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
                                                item.title = item.title.replace(/&nbsp;/g, '')
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
                                                {deviceType: 'IOS'}
                                            ];
                                            $scope.belongToUserItems = [
                                                {belongTo: '仅自己的'}
                                            ];
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
                        });
                        //console.log($scope.items)
                    };
                    $scope.turnToSelf = function () {
                        //window.location.reload();
                        $scope.nowUserFlag = false;
                        $scope.taskState = null;
                        $scope.deviceType = null;
                        $scope.belongUser = null;
                        $scope.statusLate = false;
                        $scope.deviceLate = false;
                        $scope.userLate = false;
                        serverService.getAllTask({
                            id: '',
                            title: '',
                            pid: '',
                            poi_id: '',
                            status: '',
                            device: 0,
                            user: 0,
                            page: 1,
                            rows: 20
                        }).then(function (data) {
                            var img = $('#indexProgressImage');
                            var mask = $('#indexMaskOfProgressImage');
                            img.hide();
                            mask.hide();
                            $rootScope.taskLists = data.result.rows;
                            $scope.items = data.result.rows;
                            $scope.items.forEach(function (item, index) {
                                item.title = item.title.replace(/&nbsp;/g, '')
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
                                    user: 0,
                                    page: index,
                                    rows: 20
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
                                                item.title = item.title.replace(/&nbsp;/g, '')
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
                                                {belongTo: '仅自己的'},
                                            ];
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
                        //$scope.searhContent = ''
                    }
                    /**search**/
                    $scope.taskSearch = function () {
                        if (!$scope.searchByTaskId && !$scope.searchByTaskName && !$scope.searchByPoiId) {
                            alert('请选择搜索类别');
                            return
                        }
                        /*任务Id*/
                        if ($scope.searchByTaskId == true && $scope.searhContent) {
                            serverService.getAllTask({
                                id: $scope.searhContent * 1,
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
                                $scope.searhContent = ''
                                $rootScope.taskLists = data.result.rows;
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '');
                                    $scope.oneAcheive = item.num.split('>')[1].split('<')[0];
                                })
                                $rootScope.totalCount = data.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                $rootScope.toPage = function (index) {
                                    if (!$scope.searhContent) {
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
                                        id: $scope.searhContent * 1,
                                        title: '',
                                        pid: '',
                                        poi_id: '',
                                        status: '',
                                        device: 0,
                                        user: 0,
                                        page: index,
                                        rows: 20
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
                                                    $scope.oneAcheive = item.num.split('>')[1].split('<')[0];
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
                                                    {belongTo: '仅自己的'},
                                                ];
                                                $scope.searhContent = ''
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
                        if ($scope.searchByTaskName == true && $scope.searhContent) {
                            serverService.getAllTask({
                                id: '',
                                title: $scope.searhContent,
                                pid: '',
                                poi_id: '',
                                status: '',
                                device: 0,
                                user: 0,
                                page: 1,
                                rows: 20
                            }).then(function (data) {
                                var img = $('#indexProgressImage');
                                var mask = $('#indexMaskOfProgressImage');
                                img.hide();
                                mask.hide();
                                $scope.searhContent = ''
                                $rootScope.taskLists = data.result.rows;
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '');
                                    $scope.oneAcheive = item.num.split('>')[1].split('<')[0];
                                })
                                $rootScope.totalCount = data.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                $rootScope.toPage = function (index) {
                                    /*if(!$scope.searhContent){
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
                                        title: $scope.searhContent,
                                        pid: '',
                                        poi_id: '',
                                        status: '',
                                        device: 0,
                                        user: 0,
                                        page: index,
                                        rows: 20
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
                                                    $scope.oneAcheive = item.num.split('>')[1].split('<')[0];
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
                                                    {belongTo: '仅自己的'},
                                                ];
                                                $scope.searhContent = ''
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
                        /**poi_id**/
                        if ($scope.searchByPoiId == true && $scope.searhContent) {
                            serverService.getAllTask({
                                id: '',
                                title: '',
                                pid: '',
                                poi_id: $scope.searhContent,
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
                                $scope.searhContent = '';
                                $rootScope.taskLists = data.result.rows;
                                $scope.items = data.result.rows;
                                $scope.items.forEach(function (item, index) {
                                    item.title = item.title.replace(/&nbsp;/g, '');
                                    $scope.oneAcheive = item.num.split('>')[1].split('<')[0];
                                })
                                $rootScope.totalCount = data.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 20);
                                $rootScope.toPage = function (index) {
                                    if (!$scope.searhContent) {
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
                                        title: $scope.searhContent,
                                        pid: '',
                                        poi_id: '',
                                        status: '',
                                        device: 0,
                                        user: 0,
                                        page: index,
                                        rows: 10
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
                                                    $scope.oneAcheive = item.num.split('>')[1].split('<')[0];
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
                                                    {belongTo: '仅自己的'},
                                                ];
                                                $scope.searhContent = ''
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
                        console.log($scope.searhContent)
                    }

                    /***上下线 编辑*/
                    $scope.downLine = function (index) {
                        serverService.getUpdownLine($scope.items[index].id)
                                .then(function (result) {
                                    if (result.code == 200) {
                                        alert('操作成功');
                                        storageUtils.session.setItem('_DOWNLINE_', true);
                                        window.location.reload();
                                    } else {
                                        alert('操作失败请查看余额是否充足或者任务是否已过期');
                                        storageUtils.session.setItem('_DOWNLINE_', true);
                                        window.location.reload();
                                    }
                                })
                    };
                    $scope.editTask = function (index) {
                        console.log($scope.items[index].id)
                        serverService.getDatajson($scope.items[index].id)
                            .then(function (result) {
                                console.log(result)
                                storageUtils.session.setItem('editData', result);
                                window.location = '#/addTask'
                            })
                    };
                    /*复制任务*/
                    $scope.copyTask = function (index) {
                        var data = {id:$scope.items[index].id};
                        if(confirm("确定要复制吗")){
                            serverService.getCopy(data)
                                .then(function (data) {
                                    if(data.code == 200){
                                        alert('复制成功');
                                        storageUtils.session.setItem('_DOWNLINE_',true);
                                        window.location.reload();
                                    }
                                })
                        }

                    }
                })
        }]);
});