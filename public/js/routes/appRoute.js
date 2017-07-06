/**
 * 路由
 */
define(['app'], function(app){
   return app.config(["$stateProvider","$urlRouterProvider" ,function ($stateProvider,$urlRouterProvider) {
       $urlRouterProvider.otherwise('/parent');
       $stateProvider
       .state("taskList", {//父路由
                   url: '/taskList',
                   templateUrl: 'tpls/taskList.html',
                    controller:'taskListCtrl'
               })
               .state("reviewList", {
                   url: '/reviewList',
                   templateUrl:'tpls/review.html',
                   controller:'reviewCtrl'
               })
               .state("addTask", {
                   url: '/addTask',
                   templateUrl:'tpls/newTask.html',
                   controller:'newTaskCtrl'
               })
               .state("addStep", {
                   url: '/addStep',
                   templateUrl:'tpls/addStep.html',
                   controller:'addStepCtrl'
               })
               .state("reviewDetail", {
                   url: '/reviewDetail',
                   templateUrl:'tpls/reviewDetail.html',
                   controller:'reviewDetailCtrl'
               })
               .state('reviewDetail.tab1',{
                   url:'/reviewDetail/tab1',
                   templateUrl: 'tpls/toReview.html',
                   controller:'toReviewCtrl',

               })
               .state('reviewDetail.tab2',{
                   url:'/reviewDetail/tab2',
                   templateUrl: 'tpls/reviewOk.html',
                   controller:'reviewOkCtrl',
               })
               .state('reviewDetail.tab3',{
                   url:'/reviewDetail/tab3',
                   templateUrl: 'tpls/reviewNo.html',
                   controller:'reviewNoCtrl',
               })

   }]);
})