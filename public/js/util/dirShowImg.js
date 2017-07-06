/**
 * Created by 73951 on 2017/3/22.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * 浏览器端数据存在的工具模块
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('showImgModule',['serverService',function (serverService) {
        return {
            restrict: "EA",
            templateUrl: 'tpls/showImg.html',
            link:function (scope,el,attr) {
                scope.stepIndex = el.parents('ul')[0].id.substr(-1,1)
                if(scope.images.indexOf('http://')==-1){
                    el.find('img').eq(0).src = './img/show_img.png';//2017-07-06 edited
                    scope.images = './img/show_img.png';//2017-07-06 edited
                }
                //点击是任务标题 描述 url 消失
                el.click(function () {
                    console.log( el.parent('div').siblings().find('textarea'))
                    el.parent('div').siblings().find('p').css('background-color','');
                    el.parent('div').siblings().find('input').css('display','none');
                    el.parent('div').siblings().find('textarea').css('display','none');
                    el.parent('div').siblings().find('.step-title-span').css('display','none');
                    el.parent('div').parent('div').siblings('li').find('input').not('.radio-input').css('display','none');
                    el.parent('div').parent('div').siblings('li').find('p').css('background','');
                    el.parent('div').parent('div').siblings('li').find('span').not('.tips').css('display','none');
                });
                var flag = true;
                el.find('img').eq(0).on('mouseenter',function (e) {
                    e.stopPropagation();
                    if(flag){
                        var imgIndex = $(this).attr('id');
                        imgIndex = imgIndex.substr(-1,1);
                        function sys_file_sdk_qiniu_token(file) {
                            var token = $.ajax({
                                url: 'http://manager.shandianshua.com/sdk/qiniu/token.json',
                                method: 'POST',
                                xhrFields: {
                                    withCredentials: true
                                },
                                data: {bucket: 'totoro-task'},
                                dataType: 'json',
                                async: false,
                            }).responseText;

                            return jQuery.parseJSON(token).result;
                        }

                        function showPreview (file) {

                            var image = new Image();
                            image.style.width = '100%';
                            image.style.height = '100%';

                            var preloader = new mOxie.Image();
                            preloader.onload = function() {
                                preloader.downsize( 300, 300 );
                                image.setAttribute( "src", preloader.getAsDataURL() );
                                $('#preview'+scope.stepIndex+imgIndex).append(image);
                                $('#preview'+scope.stepIndex+imgIndex).css('display','block')
                            };
                            preloader.load( file.getSource() );


                        }
                        var hashArr = []
                        var uploader = Qiniu.uploader({
                            runtimes: 'html5,html4',
                            browse_button: 'step'+scope.stepIndex+'Img'+imgIndex,
                            container: 'stepContainer'+scope.stepIndex+'Img'+imgIndex,
                            //drop_element: 'sys-file-dialog-list'+comIndex,
                            max_file_size: '100mb',
                            //dragdrop: true,
                            chunk_size: '5mb',
                            multi_selection: true,
                            get_new_uptoken: true,
                            uptoken_func: sys_file_sdk_qiniu_token,
                            domain: ' http://task.totoro.cdn.shandianshua.com',
                            unique_names: true,
                            auto_start: true,
                            init: {
                                'FilesAdded': function(up, files) {

                                    // 文件添加进队列后，处理相关的事情
                                    //alert('添加了文件');
                                    console.log(files
                                    );

                                    //$('#sys-file-dialog-upload-btn'+scope.stepIndex+comIndex).attr("src",'../img/moduleImg/ic_add_a_photo_black_24dp.png');

                                },
                                'BeforeUpload': function(up, file) {
                                    // 每个文件上传前，处理相关的事情

                                    //alert('准备上传')
                                },
                                'UploadProgress': function(up, file) {
                                    // 每个文件上传时，处理相关的事情
                                },
                                'FileUploaded': function(up, file, info) {
                                    console.log(file)
                                    console.log(info);
                                    $('#preview'+scope.stepIndex+imgIndex).children('img').remove()



                                        showPreview (file);

                                    hashArr.push(jQuery.parseJSON(info));
                                    console.log(hashArr);
                                    // 查看简单反馈
                                    var domain = up.getOption('domain');
                                    var res = jQuery.parseJSON(info);
                                    var str = '';
                                    str+=domain+"/"+res.key;
                                    //var sourceLink = domain +"/"+ res.key+'\n'; //获取上传成功后的文件的Url
                                    //console.log(sourceLink);
                                    //scope.stepItems[stepIndex].component[comIndex].tips_image = str
                                    //console.log(scope.stepItems[stepIndex].component[comIndex]);
                                    //scope.stepItems[stepIndex].oldSteps.tips_image = str
                                    /*$('step'+scope.stepIndex+'img'+imgIndex).attr('src',str)*/
                                    if(scope.stepItems[scope.stepIndex].oldSteps.images_list[imgIndex]){
                                        scope.stepItems[scope.stepIndex].oldSteps.images_list[imgIndex] = str
                                        var arr =scope.stepItems[scope.stepIndex].oldSteps.images.split('\n')
                                        arr[imgIndex] = str
                                        scope.stepItems[scope.stepIndex].oldSteps.images = arr.join('\n')
                                    }else{
                                        scope.stepItems[scope.stepIndex].oldSteps.images_list[imgIndex] = str
                                        scope.stepItems[scope.stepIndex].oldSteps.images += '\n'+str+'\n'
                                    }
                                },
                                'Error': function(up, err, errTip) {
                                    //上传出错时，处理相关的事情
                                    console.log(err)
                                },
                                'UploadComplete': function() {
                                    //队列文件处理完毕后，处理相关的事情
                                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                                    //scope.stepItems[stepIndex].component[comIndex].task_id = taskId
                                    //serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                                },
                                'Key': function(up, file) {
                                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                                    // 该配置必须要在unique_names: false，save_key: false时才生效
                                    var key = "";
                                    // do something with key here
                                    return key
                                }
                            }
                        })
                        //console.log(uploader)
                        flag = false
                    }


                })



                el.find('img').eq(-1).click(function (e) {
                    /*alert(1);
                    return*/
                    e.stopPropagation()
                    var delimgIndex = $(this).attr('id');
                    delimgIndex = delimgIndex.substr(-1,1)
                    //scope.componentItems[comIndex].tips_text = ' ';
                    //scope.componentItems[comIndex].isText = ' ';
                   // scope.stepItems[stepIndex].component[comIndex].isText = ' ';
                    if(scope.stepItems[scope.stepIndex].oldSteps.images_list.length == 1){
                        scope.stepItems[scope.stepIndex].oldSteps.images_list = [];
                        scope.stepItems[scope.stepIndex].oldSteps.images = ' ';
                        $(this).css('display','none');
                        scope.$apply();
                        return
                    }
                    var arr =scope.stepItems[scope.stepIndex].oldSteps.images.split('\n')
                    arr.splice(delimgIndex,1)
                    scope.stepItems[scope.stepIndex].oldSteps.images = arr.join('\n')
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    scope.stepItems[scope.stepIndex].oldSteps.images_list.splice(delimgIndex,1)
                    /*serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                            .then(function (data) {
                                if(data.code == 200){
                                   //storageUtils.session.setItem('_DRAG_',true);
                                    //window.location = '#/reviewList';
                                    $('#imgWrap'+stepIndex+comIndex).css('display','none')
                                }
                            })*/
                    $(this).css('display','none');
                    scope.$apply();
                })
                //inutfile
                /*el.find('#upFile').eq(0).change(function (e) {
                    e = event || window.event;
                    e.stopPropagation();
                    console.log(this.files)
                    var f = this.files;
                    for(i = 0;i<f.length;i++){

                    }

                })
*/

            }
        }

    }])
})
