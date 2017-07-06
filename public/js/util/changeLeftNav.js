/**
 * Created by 73951 on 2017/3/17.
 */
define(['app'], function (app) {
    return  app.service('chLnavService',function ($rootScope) {
        $rootScope.changeBlue = function (flag) {
            $rootScope.isBlue = flag;
        }
    })
})