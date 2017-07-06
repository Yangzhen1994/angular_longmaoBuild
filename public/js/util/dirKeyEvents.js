/**
 * Created by 73951 on 2017/3/23.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('keyEvents',[function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                //debugger;
                element.one('click', function (event) {
                    if(storageUtils.session.getItem('_keyuped_')){
                        //storageUtils.session.removeItem('_keyuped_');
                        return;
                    }
                    if(scope.tabSelected == 0){
                        $('.to-key-area').ready(function(){
                            storageUtils.session.setItem('_keyuped_',true);
                            $(document).unbind("keyup");
                            $(document).bind("keyup", keyUpevents);
                        });
                    }else if(scope.tabSelected == 2){
                        $('.no-key-area').ready(function(){
                            $(document).unbind("keyup");
                            storageUtils.session.setItem('_keyuped_',true);
                            $(document).bind("keyup", keyUpevents);
                        });
                    }

                    function keyUpevents(e) {
                        var kc = window.event?e.keyCode:e.which;
                        console.log(kc);
                        if(kc == 187 || kc == 107){
                            if(scope.tabSelected == 0){
                                $('.tr-right-fallow').trigger('click');
                            }else if(scope.tabSelected == 2){
                                $('.rn-right-fallow').trigger('click');
                            }


                            //$('#rnAllow').trigger('click')
                        }else if(kc == 97 || kc == 49){//小键盘1 或者 大键盘1
                            $('#reasonDetail0').trigger('click')
                        }else if(kc == 98 || kc == 50){//小键盘2 或者 大键盘2
                            $('#reasonDetail1').trigger('click')
                        }else if(kc == 99 || kc == 51){
                            scope.showRejCover = true
                            $('#orderReason').trigger('keyup')
                        }

                    }
                });
            }

        }

    }])
})