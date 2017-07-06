/**
 * Created by 73951 on 2017/3/22.
 */
/*位置凭证的scope*/
define(['app','storageUtils','serverService',], function (app,storageUtils,serverService) {
    return  app.controller('posProofCtrl',['$scope','serverService',function ($scope,serverService) {
        $scope.pos ={
            n:{
                one:'21',
                two:'24',
                three:'12.2'
            },
            e:{
                one:'2',
                two:'10',
                three:'26.5'
            }
        }
    }])
})
