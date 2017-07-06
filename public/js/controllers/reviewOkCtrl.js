/**
 * Created by 73951 on 2017/3/17.
 */
define(['app', 'storageUtils'], function (app, storageUtils, serverService) {
    return app.controller('reviewOkCtrl', ['$scope', '$rootScope', '$timeout','serverService', function ($scope, $rootScope,$timeout,serverService) {
        var reviewFlag = storageUtils.session.getItem('_FLAG_');
        var imported = storageUtils.session.getItem('_imported_');
        var toReviewChecked = storageUtils.session.getItem('_toReviewChecked_');
        var reviewNoChecked = storageUtils.session.getItem('_reviewNoChecked_');
        if(imported){
            storageUtils.session.removeItem('_imported_');
            window.location = '#/reviewDetail/reviewDetail/tab3';
            return;
        }
        if (reviewFlag) {
            storageUtils.session.removeItem('_FLAG_');
            window.location = '#/reviewDetail/reviewDetail/tab3';
            return;
        }
        if (toReviewChecked) {
            storageUtils.session.removeItem('_toReviewChecked_');
            window.location = '#/reviewDetail/reviewDetail/tab1';
            return;
        }
        if (reviewNoChecked) {
            storageUtils.session.removeItem('_reviewNoChecked_');
            window.location = '#/reviewDetail/reviewDetail/tab3';
            return;
        }
        var reviewId = storageUtils.session.getItem('_reviewList_');

        var searchCheckBydate = storageUtils.session.getItem('searchCheckBydate');

        if (searchCheckBydate) {
            $rootScope.totalCount = searchCheckBydate.total;
            $rootScope.pageIndex = 1;
            $rootScope.pageTotal = Math.ceil($scope.totalCount / 10);
            if (searchCheckBydate.rows.length > 0 && searchCheckBydate.rows[0].status == 2) {
                window.location = '#/reviewDetail/reviewDetail/tab1';
                return;
            }
            if (searchCheckBydate.rows.length > 0 && searchCheckBydate.rows[0].status == 4) {
                window.location = '#/reviewDetail/reviewDetail/tab3';
                return;
            }
            if (searchCheckBydate.rows.length > 0 && searchCheckBydate.rows[0].status == 3) {
                $scope.reviewOkItems = searchCheckBydate.rows;
                $scope.reviewOk = $scope.reviewOkItems[0].data;
                $scope.changeColor = 0;
                $scope.currentIndex = 0;
                $rootScope.totalCount = searchCheckBydate.total;
                $rootScope.pageIndex = 1;
                $rootScope.pageTotal = Math.ceil($scope.totalCount / 10);
                $rootScope.toPage = function (index) {
                    $('.review-ok-left').animate({scrollTop:0});
                    if (index < 1) {
                        index = 1;
                        return;
                    }
                    if (index > $rootScope.pageTotal) {
                        index--;
                        $rootScope.pageIndex = index;
                        return;
                    }
                    $rootScope.pageIndex = index;
                    if ($scope.reviewUserId && $scope.chooseType == 2) {
                        $scope.reviewUserId = ''
                    }
                    var data = {
                        id: reviewId,
                        uid: $scope.reviewUserId,
                        date: $scope.subTime,
                        status: 3,
                        page: index,
                        rows: 10
                    };
                    serverService.getReviewList(data)
                        .then(function (data) {
                            $scope.reviewOkItems = data.result.rows;
                            if ($scope.reviewOkItems && $scope.reviewOkItems.length > 0) {
                                $scope.reviewOk = $scope.reviewOkItems[0].data;
                                if ($scope.reviewOk.length == 0) {
                                    $scope.reviewOk.push({})
                                }
                                serverService.getInfoData({
                                    uid: $scope.reviewOkItems[0].uid,
                                    tid: $scope.reviewOkItems[0].id
                                })
                                    .then(function (data) {
                                        $scope.currentIndex = 0;
                                        $scope.changeColor = 0;
                                        $scope.reviewOk[0].amount = data.result.amount;
                                        $scope.reviewOk[0].check_fail = data.result.check_fail;
                                        $scope.reviewOk[0].invited = data.result.invited;
                                        $scope.reviewOk[0].regist_time = data.result.regist_time;
                                        $scope.reviewOk[0].task_check_fail = data.result.task_check_fail;
                                    })
                            } else {
                                return
                            }
                            $scope.reviewOk.forEach(function (item, index) {
                                if (item.type == 5) {
                                    window.x = item.x;
                                    window.y = item.y;
                                }
                            })
                        })
                };
                $scope.reviewOk.forEach(function (item, index) {
                    if (item.type == 5) {
                        window.x = item.x;
                        window.y = item.y;
                    }
                });
                window.initOk = function () {
                    map = new BMap.Map("cc_map");            // 创建Map实例
                    var point = new BMap.Point(window.x, window.y); // 创建点坐标
                    map.centerAndZoom(point, 16);
                    map.enableScrollWheelZoom();// 启用滚轮放大缩小
                };
                //$scope.reviewOk = $scope.reviewOkItems[0].data;
                //复选框的初值
                $scope.flag = false;
                $scope.masterItem = false;
                $scope.all = function (master) {
                    $scope.masterItem = master;
                    for (var i = 0; i < $scope.reviewOkItems.length; i++) {
                        $scope.reviewOkItems[i].checkState = master;
                    }
                    //$scope.currentIndex = $scope.reviewOkItems.length
                };
                $scope.cancelOne = function (ev, x, index) {
                    ev = event || window.event;
                    if (ev && ev.stopPropagation) {
                        ev.stopPropagation()
                    }
                    $scope.reviewOkItems[index].checkState = x;
                    for (var i = 0; i < $scope.reviewOkItems.length; i++) {

                        if (!$scope.reviewOkItems[i].checkState) {
                            $scope.masterHeader = false;
                            $scope.flag = false;
                            return false
                        } else {
                            $scope.flag = true;
                        }
                    }
                };

                $scope.changeRight = function (item, index) {
                    if (item && item.data) {
                        serverService.getInfoData({uid: item.uid, tid: item.id})
                            .then(function (data) {
                                $scope.reviewOk = item.data;
                                if ($scope.reviewOk.length == 0) {
                                    $scope.reviewOk.push({})
                                }
                                $scope.reviewOk[0].amount = data.result.amount;
                                $scope.reviewOk[0].check_fail = data.result.check_fail;
                                $scope.reviewOk[0].invited = data.result.invited;
                                $scope.reviewOk[0].regist_time = data.result.regist_time;
                                $scope.reviewOk[0].task_check_fail = data.result.task_check_fail;
                                $scope.reviewOk.forEach(function (item, index) {
                                    if (item.type == 5) {
                                        window.x = item.x;
                                        window.y = item.y;
                                    }
                                })

                            })
                    } else {
                        $scope.reviewOk = {}
                    }
                    $scope.changeColor = index;
                    $scope.currentIndex = index;
                    $('.review-ok-left').animate({scrollTop:72*$scope.currentIndex});
                };
                $scope.changeRight($scope.reviewOkItems[0], 0);
                $scope.okNext = function () {
                    $scope.currentIndex++;
                    if ($scope.currentIndex >= $scope.reviewOkItems.length) {
                        $scope.currentIndex = $scope.reviewOkItems.length - 1
                    }
                    $scope.changeRight($scope.reviewOkItems[$scope.currentIndex], $scope.currentIndex);
                    $('.review-ok-left').animate({scrollTop:72*$scope.currentIndex});
                };
                $scope.okPrev = function () {
                    $scope.currentIndex--;
                    if ($scope.currentIndex < 0) {
                        $scope.currentIndex = 0
                    }
                    $scope.changeRight($scope.reviewOkItems[$scope.currentIndex], $scope.currentIndex);
                    $('.review-ok-left').animate({scrollTop:72*$scope.currentIndex});
                };
                /*排序*/
                $scope.orderByTimes = function (num) {
                    var reviewId = storageUtils.session.getItem('_reviewList_');
                    if ($scope.chooseType == 2 || !$scope.chooseType) {
                        $scope.reviewUserId = ''
                    }
                    if (!$scope.chooseType) {
                        $scope.reviewUserId = ''
                    }
                    var data = {
                        id: reviewId,
                        uid: $scope.reviewUserId,
                        date: $scope.subTime,
                        status: '',
                        page: $rootScope.pageIndex,
                        rows: 10,
                        sort: 'created_time',
                        order: 'desc'
                    };
                    switch (num) {
                        case 0:
                            data.sort = 'created_time';
                            data.order = 'asc';
                            break;
                        case 1:
                            data.sort = 'submit_time';
                            data.order = 'asc';
                            break;
                        case 2:
                            data.sort = 'surplus_check_time';
                            data.order = 'desc';
                            break;
                    }
                    ;
                    if ($scope.orderFlag) {
                        data.order = 'desc';
                        if (num == 3) {
                            data.order = 'asc';
                        }
                    }

                    switch ($scope.tabSelected) {
                        case 0:
                            data.status = 2;
                            break;
                        case 1:
                            data.status = 3;
                            break;
                        case 2:
                            data.status = 4;
                            break;
                    }
                    ;

                    serverService.getReviewList(data)
                        .then(function (resData) {
                            $scope.orderFlag = !$scope.orderFlag;
                            $scope.reviewOkItems = resData.result.rows;
                            $scope.changeRight($scope.reviewOkItems[0], 0);
                            $rootScope.totalCount = resData.result.total;
                            $rootScope.pageIndex = $rootScope.pageIndex;
                            $rootScope.pageTotal = Math.ceil($scope.totalCount / 10);
                            $rootScope.toPage = function (index) {
                                $('.review-ok-left').animate({scrollTop:0});
                                if (index < 1) {
                                    index = 1;
                                    return;
                                }
                                if (index > $rootScope.pageTotal) {
                                    index--;
                                    $rootScope.pageIndex = index;
                                    return;
                                }
                                $rootScope.pageIndex = index;
                                var paginationData = {
                                    id: reviewId,
                                    uid: $scope.reviewUserId,
                                    date: $scope.subTime,
                                    status: 3,
                                    page: index,
                                    rows: 10,
                                    order: data.order,
                                    sort: data.sort
                                };
                                serverService.getReviewList(paginationData)
                                    .then(function (data) {
                                        $scope.reviewOkItems = data.result.rows;
                                        if ($scope.reviewOkItems && $scope.reviewOkItems.length > 0) {
                                            $scope.reviewOk = $scope.reviewOkItems[0].data;
                                            if ($scope.reviewOk.length == 0) {
                                                $scope.reviewOk.push({})
                                            }
                                            serverService.getInfoData(
                                                {
                                                    uid: $scope.reviewOkItems[0].uid,
                                                    tid: $scope.reviewOkItems[0].id
                                                }
                                            )
                                                .then(function (data) {
                                                    $scope.currentIndex = 0;
                                                    $scope.changeColor = 0;
                                                    $scope.reviewOk[0].amount = data.result.amount;
                                                    $scope.reviewOk[0].check_fail = data.result.check_fail;
                                                    $scope.reviewOk[0].invited = data.result.invited;
                                                    $scope.reviewOk[0].regist_time = data.result.regist_time;
                                                    $scope.reviewOk[0].task_check_fail = data.result.task_check_fail;
                                                })
                                        } else {
                                            return
                                        }

                                        $scope.reviewOk.forEach(function (item, index) {
                                            if (item.type == 5) {
                                                window.x = item.x;
                                                window.y = item.y;
                                            }
                                        })

                                    })
                            };
                            storageUtils.session.setItem('_reviewOkSort_', data.sort);
                            storageUtils.session.setItem('_reviewOkOrder_', data.order);
                        })
                };
            }
            storageUtils.session.removeItem('searchCheckBydate');
            return
        }

        /******************/
        var reviewId = storageUtils.session.getItem('_reviewList_');
        if ($scope.reviewUserId && $scope.chooseType == 2) {
            $scope.reviewUserId = ''
        }
        if (!$scope.chooseType) {
            $scope.reviewUserId = ''
        }
        $scope.data = {
            id: reviewId,
            uid: $scope.reviewUserId,
            date: $scope.subTime,
            status: 3,
            page: 1,
            rows: 10
        };

        if (storageUtils.session.getItem('_reviewOkSort_')) {
            $scope.data.sort = storageUtils.session.getItem('_reviewOkSort_');
            //storageUtils.session.removeItem('_reviewOkSort_')
        }
        if (storageUtils.session.getItem('_reviewOkOrder_')) {
            $scope.data.order = storageUtils.session.getItem('_reviewOkOrder_');
            //storageUtils.session.removeItem('_reviewOkOrder_');
        }
        serverService.getReviewList($scope.data).then(function (data) {
            console.log(data);
            $scope.reviewOkItems = data.result.rows;
            $rootScope.totalCount = data.result.total;
            $rootScope.pageIndex = 1;
            $rootScope.pageTotal = Math.ceil($scope.totalCount / 10);
            $rootScope.toPage = function (index) {
                $('.review-ok-left').animate({scrollTop:0});
                if (index < 1) {
                    index = 1;
                    return;
                }
                if (index > $rootScope.pageTotal) {
                    index--;
                    $rootScope.pageIndex = index;
                    return
                }
                $rootScope.pageIndex = index;
                var data = {
                    id: reviewId,
                    uid: $scope.reviewUserId,
                    date: $scope.subTime,
                    status: 3,
                    page: index,
                    rows: 10,
                    sort: $scope.data.sort,
                    order: $scope.data.order
                };
                serverService.getReviewList(data)
                    .then(function (data) {
                        $scope.reviewOkItems = data.result.rows;
                        if ($scope.reviewOkItems && $scope.reviewOkItems.length > 0) {
                            $scope.reviewOk = $scope.reviewOkItems[0].data;
                            if ($scope.reviewOk.length == 0) {
                                $socpe.reviewOk.push({})
                            }
                            serverService.getInfoData({
                                uid: $scope.reviewOkItems[0].uid,
                                tid: $scope.reviewOkItems[0].id
                            })
                                .then(function (data) {
                                    $scope.currentIndex = 0;
                                    $scope.changeColor = 0;
                                    $scope.reviewOk[0].amount = data.result.amount;
                                    $scope.reviewOk[0].check_fail = data.result.check_fail;
                                    $scope.reviewOk[0].invited = data.result.invited;
                                    $scope.reviewOk[0].regist_time = data.result.regist_time;
                                    $scope.reviewOk[0].task_check_fail = data.result.task_check_fail;
                                })
                        } else {
                            return
                        }
                        $scope.reviewOk.forEach(function (item, index) {
                            if (item.type == 5) {
                                window.x = item.x;
                                window.y = item.y;
                            }
                        })

                    })
            };
            if ($scope.reviewOkItems && $scope.reviewOkItems.length > 0) {
                $scope.reviewOk = $scope.reviewOkItems[0].data;
                if ($scope.reviewOk.length == 0) {
                    $scope.reviewOk.push({})
                }
                //$scope.changeRight($scope.reviewOkItems[0].data,0)
                serverService.getInfoData({uid: $scope.reviewOkItems[0].uid, tid: $scope.reviewOkItems[0].id})
                    .then(function (data) {
                        $scope.currentIndex = 0;
                        $scope.changeColor = 0;
                        $scope.reviewOk[0].amount = data.result.amount;
                        $scope.reviewOk[0].check_fail = data.result.check_fail;
                        $scope.reviewOk[0].invited = data.result.invited;
                        $scope.reviewOk[0].regist_time = data.result.regist_time;
                        $scope.reviewOk[0].task_check_fail = data.result.task_check_fail;
                    })
            } else {
                $timeout(function () {
                    alert('此任务的审核成功无');
                },50);
                return
            }
            $scope.reviewOk.forEach(function (item, index) {
                if (item.type == 5) {
                    window.x = item.x;
                    window.y = item.y;
                }
            });
            window.initOk = function () {
                map = new BMap.Map("cc_map");            // 创建Map实例
                var point = new BMap.Point(window.x, window.y); // 创建点坐标
                map.centerAndZoom(point, 16);
                map.enableScrollWheelZoom();// 启用滚轮放大缩小
            };
            $scope.changeColor = 0;
            $scope.currentIndex = 0;
            //$scope.reviewOk = $scope.reviewOkItems[0].data;
            //复选框的初值
            $scope.flag = false;
            $scope.masterItem = false;
            $scope.all = function (master) {
                $scope.masterItem = master;
                for (var i = 0; i < $scope.reviewOkItems.length; i++) {
                    $scope.reviewOkItems[i].checkState = master;
                }
                //$scope.currentIndex = $scope.reviewOkItems.length
            };
            $scope.cancelOne = function (ev, x, index) {
                ev = event || window.event;
                if (ev && ev.stopPropagation) {
                    ev.stopPropagation()
                }
                $scope.reviewOkItems[index].checkState = x;
                for (var i = 0; i < $scope.reviewOkItems.length; i++) {
                    if (!$scope.reviewOkItems[i].checkState) {
                        $scope.masterHeader = false;
                        $scope.flag = false;
                        return false
                    } else {
                        $scope.flag = true;
                    }
                }
            };
            $scope.changeRight = function (item, index) {
                if (item && item.data) {
                    serverService.getInfoData({uid: item.uid, tid: item.id})
                        .then(function (data) {
                            $scope.reviewOk = item.data;
                            if ($scope.reviewOk.length == 0) {
                                $scope.reviewOk.push({})
                            }
                            $scope.reviewOk[0].amount = data.result.amount;
                            $scope.reviewOk[0].check_fail = data.result.check_fail;
                            $scope.reviewOk[0].invited = data.result.invited;
                            $scope.reviewOk[0].regist_time = data.result.regist_time;
                            $scope.reviewOk[0].task_check_fail = data.result.task_check_fail;

                            $scope.reviewOk.forEach(function (item, index) {
                                if (item.type == 5) {
                                    window.x = item.x;
                                    window.y = item.y;
                                }
                            })
                        })
                } else {
                    $scope.reviewOk = {}
                }
                $scope.changeColor = index;
                $scope.currentIndex = index;
                $('.review-ok-left').animate({scrollTop:72*$scope.currentIndex});
            };
            $scope.okNext = function () {
                $scope.currentIndex++;
                if ($scope.currentIndex >= $scope.reviewOkItems.length) {
                    $scope.currentIndex = $scope.reviewOkItems.length - 1
                }
                $scope.changeRight($scope.reviewOkItems[$scope.currentIndex], $scope.currentIndex);
                $('.review-ok-left').animate({scrollTop:72*$scope.currentIndex});
            }
            $scope.okPrev = function () {
                $scope.currentIndex--;
                if ($scope.currentIndex < 0) {
                    $scope.currentIndex = 0
                }
                $scope.changeRight($scope.reviewOkItems[$scope.currentIndex], $scope.currentIndex);
                $('.review-ok-left').animate({scrollTop:72*$scope.currentIndex});
            }
            /*排序*/
            $scope.orderByTimes = function (num) {
                var reviewId = storageUtils.session.getItem('_reviewList_');
                if ($scope.chooseType == 2) {
                    $scope.reviewUserId = ''
                }
                if (!$scope.chooseType) {
                    $scope.reviewUserId = ''
                }
                var data = {
                    id: reviewId,
                    uid: $scope.reviewUserId,
                    date: $scope.subTime,
                    status: '',
                    page: $rootScope.pageIndex,
                    rows: 10,
                    sort: 'created_time',
                    order: 'desc'
                };
                switch (num) {
                    case 0:
                        data.sort = 'created_time';
                        data.order = 'asc';
                        break;
                    case 1:
                        data.sort = 'submit_time';
                        data.order = 'asc';
                        break;
                    case 2:
                        data.sort = 'surplus_check_time';
                        data.order = 'desc';
                        break;
                }
                ;
                if ($scope.orderFlag) {
                    data.order = 'desc';
                    if (num == 2) {
                        data.order = 'asc';
                    }
                }
                switch ($scope.tabSelected) {
                    case 0:
                        data.status = 2;
                        break;
                    case 1:
                        data.status = 3;
                        break;
                    case 2:
                        data.status = 4;
                        break;
                }
                ;

                serverService.getReviewList(data)
                    .then(function (resData) {
                        $scope.orderFlag = !$scope.orderFlag;
                        $scope.reviewOkItems = resData.result.rows;
                        $scope.changeRight($scope.reviewOkItems[0], 0);
                        $rootScope.totalCount = resData.result.total;
                        $rootScope.pageIndex = $rootScope.pageIndex;
                        $rootScope.pageTotal = Math.ceil($scope.totalCount / 10);
                        $rootScope.toPage = function (index) {
                            $('.review-ok-left').animate({scrollTop:0});
                            if (index < 1) {
                                index = 1;
                                return;
                            }
                            if (index > $rootScope.pageTotal) {
                                index--;
                                $rootScope.pageIndex = index;
                                return;
                            }
                            $rootScope.pageIndex = index;
                            var paginationData = {
                                id: reviewId,
                                uid: $scope.reviewUserId,
                                date: $scope.subTime,
                                status: 3,
                                page: index,
                                rows: 10,
                                order: data.order,
                                sort: data.sort
                            };
                            serverService.getReviewList(paginationData)
                                .then(function (data) {
                                    $scope.reviewOkItems = data.result.rows;
                                    if ($scope.reviewOkItems && $scope.reviewOkItems.length > 0) {
                                        $scope.reviewOk = $scope.reviewOkItems[0].data;
                                        if ($scope.reviewOk.length == 0) {
                                            $socpe.reviewOk.push({})
                                        }
                                        serverService.getInfoData(
                                            {
                                                uid: $scope.reviewOkItems[0].uid,
                                                tid: $scope.reviewOkItems[0].id
                                            }
                                        )
                                            .then(function (data) {
                                                $scope.currentIndex = 0;
                                                $scope.changeColor = 0;
                                                $scope.reviewOk[0].amount = data.result.amount;
                                                $scope.reviewOk[0].check_fail = data.result.check_fail;
                                                $scope.reviewOk[0].invited = data.result.invited;
                                                $scope.reviewOk[0].regist_time = data.result.regist_time;
                                                $scope.reviewOk[0].task_check_fail = data.result.task_check_fail;
                                            })
                                    } else {
                                        return
                                    }

                                    $scope.reviewOk.forEach(function (item, index) {
                                        if (item.type == 5) {
                                            window.x = item.x;
                                            window.y = item.y;
                                        }
                                    })

                                })
                        };
                        storageUtils.session.setItem('_reviewOkSort_', data.sort);
                        storageUtils.session.setItem('_reviewOkOrder_', data.order);
                    })
            };
        })
    }])
});