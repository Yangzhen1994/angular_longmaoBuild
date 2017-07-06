
/**
 * Created by 73951 on 2017/4/1.
 */
/**
 * Created by 73951 on 2017/3/22.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('imgProofCtrl',['$scope','serverService',function ($scope,serverService) {
        $scope.deleteImgProof = function (e,index) {

            var length = $scope.componentItems.length;
            $scope.componentItems[index].status = 0;

            serverService.submitComponent($scope.componentItems[index])
                    .then(function (data) {
                        if (data.code == 200) {
                            storageUtils.session.setItem('_component_', $scope.componentItems)
                        }
                    })

            $scope.componentItems.splice(index, 1);

            storageUtils.session.setItem('_DRAG_', true)
            window.location = '#/reviewList';
        }
    }])
})