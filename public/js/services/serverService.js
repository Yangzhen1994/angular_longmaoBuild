define(['app'], function (app) {

    app.factory('serverService', ['$http','$q', function($http,$q) {
        function getAllTask(data) {
            var img = $('#indexProgressImage');
            var mask = $('#indexMaskOfProgressImage');
            var defer = $q.defer();
            data.show_nocheck = 1;
            //var url = 'http://manager.test.shandianshua.com/totoro/task/task/list.json';
            var url = 'http://localhost:8088/longmao_build/public/mock/taskList.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
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
                        defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                },
                /*complete:function () {
                    var img = $('#indexProgressImage');
                    var mask = $('#indexMaskOfProgressImage');
                    img.hide();
                    mask.hide();
                }*/
            })
            return defer.promise
        }
        function getDatajson(id) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/data.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:{id:id},
                success: function (data) {
                    defer.resolve(data.result)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        function submitSavePage(obj) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/save.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:obj,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        function getStepById(id) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/steps/list.json?task_id=';
            $.ajax({
                type: "POST",
                url: url+id,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        function getUpdownLine(id) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/status.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:{id:id},
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        function getReviewList(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/check/list.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /*导出*/
        function exportReview(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/expimp/export/check/data.html';
            $.ajax({
                type: "GET",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                params:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /*导入excel*/
        function importReview(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/expimp/import/check/data.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Content-Type":'multipart/form-data',
                },
                //contentType:'multipart/form-data',
                //enctype: 'multipart/form-data',
                //全部data
                data:data,
                //ContentType: 'application/vnd.ms-excel',
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /*审核通过*/
        function check(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/check/check.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /*save step*/
        function saveStep(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/steps/save.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /***凭证***/
        /*
        * id:
         type:1 文本 2图片 5 定位 6 音频
         tips_text:1
         tips_image:
         compress:1
         regex:
         options:
         options_other:0
         order:1
         step_id:3987
         status:1
         task_id:1232
        *
        *
        *
        *
        *
        *
        *
        *
        * */

        function submitComponent(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/component/save.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /**获取凭证*/
        function getComponent(taskId){
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/component/list.json?task_id=';
            $.ajax({
                type: "POST",
                url: url+taskId,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /**获取下拉菜单地区*/

        function getSelectData() {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/sys/dict/options.json?key=DICT.COMMON.REGEXP.IPREGEXP';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        //获取验证的正则
        function getRegex() {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/sys/dict/options.json?key=DICT.TOTORO.TASK.UNIQUEREGEXP';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        //获取历史被拒等
        function getInfoData(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/check/user/info.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                data:data,
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        //复制任务
        function getCopy(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/copy.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                data:data,
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        return {getSelectData:getSelectData,getAllTask:getAllTask,getDatajson:getDatajson,submitSavePage:submitSavePage,getStepById:getStepById,
            getUpdownLine:getUpdownLine,
            getReviewList:getReviewList,
            exportReview:exportReview,
            importReview:importReview,
            check:check,saveStep:saveStep,submitComponent:submitComponent,getComponent:getComponent,
            getInfoData:getInfoData,getRegex:getRegex,getCopy:getCopy};
    }])
})
