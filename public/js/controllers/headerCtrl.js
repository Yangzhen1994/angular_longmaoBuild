/**
 * Created by 73951 on 2017/3/15.
 */


define(['app'], function (app,storageUtils) {
    return  app.controller('headerCtrl',['$scope',function ($scope) {
        $scope.isBlue = 1
        if( $scope.isBlue == 1){
            window.location ='#/taskList'
        }
        $scope.changeBlue = function (flag) {
            $scope.isBlue = flag;
        }
    }])
})