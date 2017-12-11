/**
 * 动态数据存储服务
 * Created by zhangsb on 2017/10/18.
 */
angular.module("MetronicApp")
    .service('DictService', ['$rootScope', '$resource', '$window', 'UrlConfigService', 'toastr',
        function ($rootScope, $resource, $window, UrlConfigService, toastr) {

            //定义map
            function Map() {
                this.container = {};
            }

            //将key-value放入map中
            Map.prototype.put = function (key, value) {
                try {
                    if (key != null && key != "") {
                        this.container[key] = value;
                    }
                } catch (e) {
                    return e;
                }
            };

            //根据key从map中取出对应的value
            Map.prototype.get = function (key) {
                try {
                    return this.container[key];
                } catch (e) {
                    return e;
                }
            };

            //判断map中是否包含指定的key
            Map.prototype.containsKey = function (key) {
                try {
                    for (var p in this.container) {
                        if (this.p == key)
                            return true;
                    }
                    return false;

                } catch (e) {
                    return e;
                }

            };

            //判断map中是否包含指定的value
            Map.prototype.containsValue = function (value) {
                try {

                    for (var p in this.container) {
                        if (this.container[p] === value)
                            return true;
                    }

                    return false;

                } catch (e) {
                    return e;
                }
            };


            //删除map中指定的key
            Map.prototype.remove = function (key) {
                try {

                    delete this.container[key];

                } catch (e) {
                    return e;
                }
            };

            //清空map
            Map.prototype.clear = function () {
                try {
                    delete this.container;
                    this.container = {};

                } catch (e) {
                    return e;
                }
            };

            //判断map是否为空
            Map.prototype.isEmpty = function () {

                if (this.keyArray().length == 0)
                    return true;
                else
                    return false;
            };

            //获取map的大小
            Map.prototype.size = function () {

                return this.keyArray().length;
            };

            //返回map中的key值数组
            Map.prototype.keyArray = function () {

                var keys = new Array();
                for (var p in this.container) {
                    keys.push(p);
                }

                return keys;
            };

            //返回map中的value值数组
            Map.prototype.valueArray = function () {

                var values = new Array();
                var keys = this.keyArray();
                for (var i = 0; i < keys.length; i++) {
                    values.push(this.container[keys[i]]);
                }

                return values;
            };

            this._apiUrl = UrlConfigService.urlConfig.dataDictionary.url;

            this._dataDictionaryStorage = new Map();

            this._haveLocalStorage = $window.localStorage;

            this.get = function (key) {
                if (this._dataDictionaryStorage.isEmpty()) {
                    this.loadDataFromCacheOrServer();
                }
                return this._dataDictionaryStorage.get(key);
            };

            this.loadDataFromCacheOrServer = function (serverData) {
                var service = this;
                if (serverData) {
                    for (var name in serverData) {
                        service._dataDictionaryStorage.put(name, serverData[name]);
                    }
                } else {
                    if (service._haveLocalStorage) {
                        var dataDictionaryData = angular.fromJson($window.localStorage.getItem("dataDictionaryData"));
                        if (dataDictionaryData) {
                            for (var name in dataDictionaryData.data) {
                                service._dataDictionaryStorage.put(name, dataDictionaryData.data[name]);
                            }
                        }
                    } else {
                        //不支持localStorage，而且service无数据
                        toastr.error("", "数据丢失，请重新刷新页面！");
                    }
                }
            };

            this.loadDataFromServer = function () {
                var service = this;
                var url = service._apiUrl;
                var param = null;
                if (service._haveLocalStorage) {
                    var data = $window.localStorage.getItem("dataDictionaryData");
                    if (data && data.length != 0) {
                        var timestamp = angular.fromJson(data).timestamp;
                        param = {
                            t: timestamp
                        };
                    }
                }

                var resource = $resource(this._apiUrl);

                resource.get(param).$promise.then(function (result) {
                    if (result.status === 'success') {
                        if (typeof result.data === "object" && !(result.data instanceof Array)) {
                            var hasProp = false;
                            for (var prop in result.data) {
                                hasProp = true;
                                break;
                            }
                            if (hasProp) {
                                var dataDictionaryData = {
                                    "timestamp": result.timestamp,
                                    "data": result.data
                                };
                                if (service._haveLocalStorage) {
                                    $window.localStorage.setItem("dataDictionaryData", JSON.stringify(dataDictionaryData));
                                    service.loadDataFromCacheOrServer();
                                } else {
                                    service.loadDataFromCacheOrServer(result.data);
                                }
                                $rootScope.$broadcast("dictAvailableEvent", true);
                            }
                        } else {
                            toastr.error("", "获取数据字典格式错误！");
                        }
                    } else {
                        var msg = result.errors[0].errmsg;
                        toastr.error("", msg);
                    }
                });
            };
        }]);