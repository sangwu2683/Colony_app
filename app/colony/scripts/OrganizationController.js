angular.module('colony')
    .controller('organizationController', function ($scope, supersonic, localStorageService, $http) {
        var map = new BMap.Map("dituContent");          // 创建地图实例
        map.addControl(new BMap.NavigationControl());   //左上角，添加默认缩放平移控件
        map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));  // 左上角，添加比例尺
        map.addControl(new BMap.OverviewMapControl());    
        map.addControl(new BMap.MapTypeControl());    
        map.setCurrentCity("杭州"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
        map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

        var point = new BMap.Point(120.2, 30.3);      // 创建点坐标
        var baseLng = 120.2;
        var baseLat = 30.3;
        supersonic.device.ready.then(function(){
            supersonic.device.geolocation.getPosition().then(function (position) {
                $http.jsonp("http://api.map.baidu.com/geoconv/v1/?callback=JSON_CALLBACK&ak=CZ9hDU2G8MGfXFxU9r9j5G1L&coords="
                    + position.coords.longitude + "," + position.coords.latitude).success(function(data, status, headers, config) {
                        localStorageService.set("baseLng", position.coords.longitude);
                        localStorageService.set("baseLat", position.coords.latitude);
                        point = new BMap.Point(localStorageService.get("baseLng"), localStorageService.get("baseLat"));
                        map.centerAndZoom(point, 14);                 // 初始化地图，设置中心点坐标和地图级别

                        function ranLng() {
                            return localStorageService.get("baseLng")-0.02+Math.random()*0.04;
                        }

                        function ranLat() {
                            return localStorageService.get("baseLat")-0.06+Math.random()*0.12;
                        }

                        // addMarker(120.208, 30.265, "玩游戏", "2016.5.26");
                        var activities = [{
                            "name" : "约篮球",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.20",
                            "address" : "篮球场",
                            "username" : "admin"
                        }, {
                            "name" : "约ktv",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.21",
                            "address" : "银乐迪ktv",
                            "username" : "admin"
                        }, {
                            "name" : "约骑行",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.28",
                            "address" : "钱塘江沿路",
                            "username" : "admin"
                        }, {
                            "name" : "约电影",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.24",
                            "address" : "奥斯卡电影大世界",
                            "username" : "admin"
                        }, {
                            "name" : "代上课",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.19",
                            "address" : "教学楼C308",
                            "username" : "admin"
                        }, {
                            "name" : "拿快递",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.29",
                            "address" : "菜鸟驿站",
                            "username" : "admin"
                        }, {
                            "name" : "洗衣服",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.19",
                            "username" : "admin"
                        }, {
                            "name" : "接小孩",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.24",
                            "address" : "下沙幼儿园",
                            "username" : "admin"
                        }, {
                            "name" : "辅导作业",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.19",
                            "address" : "下沙希望小学",
                            "username" : "admin"
                        }, {
                            "name" : "请吃饭",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.15",
                            "address" : "湖滨银泰-新白鹿",
                            "username" : "admin"
                        }, {
                            "name" : "玩游戏",
                            "lng" : ranLng(),
                            "lat" : ranLat(),
                            "date" : "2016.5.26",
                            "address" : "杰拉网咖",
                            "username" : "admin"
                        }];

                        localStorageService.set("activities", activities);
                    }).error(function(data, status, headers, config) {
                    supersonic.ui.dialog.alert("定位失败!");
                });
            })
        });

        // 添加定位控件
        var geolocationControl = new BMap.GeolocationControl();
        geolocationControl.addEventListener("locationSuccess", function(e){
            // 定位成功事件
            var address = '';
            address += e.addressComponent.province;
            address += e.addressComponent.city;
            address += e.addressComponent.district;
            address += e.addressComponent.street;
            address += e.addressComponent.streetNumber;
            alert("当前定位地址为：" + address);
        });
        geolocationControl.addEventListener("locationError",function(e){
            // 定位失败事件
            alert(e.message);
        });
        map.addControl(geolocationControl);

        function show() {
            activities = localStorageService.get("activities");
            for (var i = 0; i < activities.length; i ++) {
                (function() {
                    var activity = activities[i];

                    var point = new BMap.Point(activity.lng, activity.lat);
                    // 标注
                    var marker = new BMap.Marker(point);                    // 创建标注
                    marker.setIcon(new BMap.Icon("/image/marker.png", new BMap.Size(25, 30)));
                    map.addOverlay(marker);                                 // 将标注添加到地图中
                    var labelOpts = {
                        position : point,    // 指定文本标注所在的地理位置
                        offset   : new BMap.Size(16, -10)    //设置文本偏移量
                    }
                    // 标签
                    var label = new BMap.Label(activity.name, labelOpts);  // 创建文本标注对象
                    label.setStyle({
                        borderRadius : "8px",
                        color : "red",
                        fontSize : "12px",
                        height : "20px",
                        lineHeight : "20px",
                        fontFamily:"微软雅黑"
                    });
                    map.addOverlay(label);
                    // 信息窗口
                    var sContent =
                        "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>" + (activity.name ? activity.name : "") + "</h4>" + 
                        "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>时间：" + (activity.date ? activity.date : "") + "</p>" +
                        "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>地点：" + (activity.address ? activity.address : "") + "</p>" +
                        "<p style='margin:0;line-height:1.5;font-size:10px;text-align:right'>发布人：" + (activity.username ? activity.username : "") + "</p>" +
                        "</div>";
                    var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                    marker.addEventListener("click", function(){          
                        this.openInfoWindow(infoWindow);
                    });
                })();
            }
        }

        show();
        

        supersonic.ui.views.current.whenVisible(function () {
            supersonic.data.channel('public_announcements').subscribe( function(activity) {
                var point = new BMap.Point(activity.lng, activity.lat);
                // 标注
                var marker = new BMap.Marker(point);                    // 创建标注
                marker.setIcon(new BMap.Icon("/image/marker.png", new BMap.Size(25, 30)));
                map.addOverlay(marker);                                 // 将标注添加到地图中
                var labelOpts = {
                    position : point,    // 指定文本标注所在的地理位置
                    offset   : new BMap.Size(16, -10)    //设置文本偏移量
                }
                // 标签
                var label = new BMap.Label(activity.name, labelOpts);  // 创建文本标注对象
                label.setStyle({
                    borderRadius : "8px",
                    color : "red",
                    fontSize : "12px",
                    height : "20px",
                    lineHeight : "20px",
                    fontFamily:"微软雅黑"
                });
                map.addOverlay(label);
                // 信息窗口
                var sContent =
                    "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>" + (activity.name ? activity.name : "") + "</h4>" + 
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>时间：" + (activity.date ? activity.date : "") + "</p>" +
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>地点：" + (activity.address ? activity.address : "") + "</p>" +
                    "<p style='margin:0;line-height:1.5;font-size:10px;text-align:right'>发布人：" + (activity.username ? activity.username : "") + "</p>" +
                    "</div>";
                var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                marker.addEventListener("click", function(){          
                    this.openInfoWindow(infoWindow);
                });
            });
        });

    });

