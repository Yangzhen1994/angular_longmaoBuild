/**
 * 入口文件
 * 2014-11-30 mon
 */
(function (window) {
    //cl'use strict';

    require.config({

        waitSeconds: 0,
        //基本路径
        //baseUrl: "js/",

        //模块标识名与模块路径映射
        paths: {
            //库
            "angular" : "libs/angular",
            "angularRoute" : "libs/angular-route",
            'angularUiRoute':'libs/angular-ui-router',
            'angularSanitize':'libs/angular-sanitize.min',
            'uiSortable':'libs/sortable',
            'ngFileUpload':'libs/ng-file-upload.min',
            'angularCookie':'libs/angular-cookie.min',
            //服务
            "serverService" : "services/serverService",
            "mapService" : "services/mapService",

            //控制器
            "app" : "controllers/app",
            "headerCtrl":"controllers/headerCtrl",
            "newTaskCtrl":"controllers/newTaskCtrl",
            "taskListCtrl":"controllers/taskListCtrl",
            "reviewCtrl":"controllers/reviewCtrl",
            "reviewDetailCtrl":"controllers/reviewDetailCtrl",
            "toReviewCtrl":"controllers/toReviewCtrl",
            "reviewOkCtrl":"controllers/reviewOkCtrl",
            "reviewNoCtrl":"controllers/reviewNoCtrl",
            "toReviewDetailCtrl":"controllers/toReviewDetailCtrl",
            "addStepCtrl":"controllers/addStepCtrl",
            "textProofCtrl":"controllers/textProofCtrl",
            "imgProofCtrl":"controllers/imgProofCtrl",
            "posProofCtrl":"controllers/posProofCtrl",
            "showImgCtrl":"controllers/showImgCtrl",
            //路由
            "route" : "routes/appRoute",

            //工具
            'storageUtils' : 'util/storageUtils',
            'changeLeftNav' : 'util/changeLeftNav',
            'dirTextProof' : 'util/dirTextProof',
            'dirImgProof' : 'util/dirImgProof',
            'dirLaydate' : 'util/dirLaydate',
            'dirAddStep' : 'util/dirAddStep',
            'dirAudioProof' : 'util/dirAudioProof',
            'dirPosProof' : 'util/dirPosProof',
            'dirShowImg' : 'util/dirShowImg',
            'dirShowText' : 'util/dirShowText',
            'dirKeyEvents' : 'util/dirKeyEvents',
            'dirRadioProof' : 'util/dirRadioProof',
        },

        /*
         配置不兼容AMD的模块
         exports : 指定导出的模块名
         deps  : 指定所有依赖的模块的数组
         */
        shim: {
            'angular': {
                exports: 'angular'
            },
            /*'angular-route':{
                deps: ["angular"],
                exports: 'angular-route'
            },*/
            'angularRoute' : {
                exports : 'angularRoute',
                deps : ['angular']
            },
            'angularUiRoute':{
                deps: ["angular"],
                exports: 'angularUiRoute'
            },

            'uiSortable':{
                deps: ["angular"],
                exports: 'uiSortable'
            },
            'ui-bootstrap':{
                deps: ["angular"],
                exports: 'ui-bootstrap'
            },
            'ngFileUpload':{
                deps: ["angular"],
                exports: 'ngFileUpload'
            },
            'angularCookie':{
                deps: ["angular"],
                exports: 'angularCookie'
            },
            'angularSanitize':{
                deps: ["angular"],
                exports: 'angularSanitize'
            }
        }
    });

    require(['angular','angularRoute','angularUiRoute','angularSanitize','uiSortable','ngFileUpload','app','route','storageUtils',
            'dirTextProof','dirImgProof','dirLaydate','dirAddStep','dirPosProof','dirAudioProof','dirRadioProof','dirShowImg','dirShowText','dirKeyEvents','headerCtrl','newTaskCtrl','taskListCtrl',
            'reviewCtrl','reviewDetailCtrl', "toReviewCtrl", "reviewOkCtrl", "reviewNoCtrl",
                "toReviewDetailCtrl",'addStepCtrl','textProofCtrl','imgProofCtrl','posProofCtrl','showImgCtrl','changeLeftNav','serverService','mapService'],
        function (angular){
            angular.bootstrap(document,["dcApp"]);
        }
    );
})(window)