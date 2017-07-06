/**
 * Created by 73951 on 2016/11/7.
 */
define(['app'],function (app) {
    return app.factory('mapService',['$http', '$q',
        function ($http, $q) {
            /*
             加载百度地图api
             containterId : 显示地图的容器标签的id
             callback : 回调函数名
             */
            function loadMapAPI(containterId, callback) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "http://api.map.baidu.com/api?v=2.0&ak=VcN7gumC0Wnn475XXWr4FeoyF5YYOVGC&callback=" + callback;
                document.getElementById(containterId).appendChild(script);
            }
            /**得到附近地址**/
            function getAroundAddrs(point){
                var defer = $q.defer();
                var url = 'http://api.map.baidu.com/geocoder/v2/?' +
                    'ak=VcN7gumC0Wnn475XXWr4FeoyF5YYOVGC&callback=JSON_CALLBACK&location='+point.lat+','+point.lng+'&output=json&pois=1'
                $http.jsonp(url)
                    .success(function (data) {
                        //console.log(data)
                        var cityId = data.result.cityCode
                        var mapAdder = []
                        data.result.pois.forEach(function (item) {
                            var address = item.name;
                            var lng = item.point.x;//经度
                            var lat = item.point.y;
                            mapAdder.push({address:address,lng:lng,lat:lat,cityId:cityId})
                        })
                        defer.resolve(mapAdder)
                    })
                    .error(function () {
                        alert('载入地图错误')
                    })
                return defer.promise
            }

            /**搜索 名字*/
            function getPointByAddr(name) {
                var defer = $q.defer();
                var url = 'http://api.map.baidu.com/geocoder/v2/?' +
                    'address=北京' + name + '&output=json&ak=VcN7gumC0Wnn475XXWr4FeoyF5YYOVGC&callback=JSON_CALLBACK'
                $http.jsonp(url)
                    .success(function (data) {
                        console.log(data)

                        var point = new BMap.Point(data.result.location.lng, data.result.location.lat);
                        defer.resolve(point)
                    })
                return defer.promise
            }
            /**获取当前定位信息**/
            function getCurrentAddr() {
                var defer = $q.defer();
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){
                        //alert('您的位置：'+r.point.lng+','+r.point.lat);
                        var point = r.point;

                        var geoc = new BMap.Geocoder();

                        geoc.getLocation(point, function(rs){
                            var addComp = rs.addressComponents;
                           // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                            var name = addComp.city + addComp.district+addComp.street+addComp.streetNumber;
                            defer.resolve({
                                name : name,
                                lng : point.lng,
                                lat : point.lat
                            });
                        });
                    } else {
                        alert('定位失败')
                    }
                },{enableHighAccuracy: true})

                return defer.promise;
            }
            /**location搜索信息**/
            function locationSearch(text) {
                var defer = $q.defer();
                var url = 'http://api.map.baidu.com/place/v2/search?' +
                    'q='+text+'&region=北京&output=json&ak=VcN7gumC0Wnn475XXWr4FeoyF5YYOVGC&callback=JSON_CALLBACK'
                $http.jsonp(url)
                    .success(function (data) {
                        defer.resolve(data)
                    })
                return defer.promise;
            }
            return{loadMapAPI:loadMapAPI
                ,getAroundAddrs:getAroundAddrs
                ,getPointByAddr:getPointByAddr
                ,getCurrentAddr:getCurrentAddr
                ,locationSearch:locationSearch}
        }])

})