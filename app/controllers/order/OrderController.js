angular.module("MetronicApp").controller('OrderController',
    ['$rootScope', '$scope', '$location', "toastr", 'OrderService', '$uibModal',
        function ($rootScope, $scope, $location, toastr, OrderService, $uibModal) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            //ng-table about
            $scope.columns = OrderService.getSchema();
            $scope.sort = OrderService.getSort();
            $scope.order = OrderService.getOrder();
            $scope.pageable = OrderService.getPageable();
            $scope.notpageable = false;

            $scope.list = function () {
                // OrderService.list().$promise.then(function (result) {
                //     if("success" == result.status){
                //         $scope.rows = result.data;
                //         $scope.pageable = result.pageable;
                //     }else{
                //         for (var index in result.errors) {
                //             toastr.error(result.errors[index].errmsg, "组织列表获取失败");
                //         }
                //     }
                // })
            };
            $scope.list();
            //假数据
            $scope.industrys = [
                {"key": "source", "text": "能源"},
                {"key": "it", "text": "IT"},
                {"key": "industry", "text": "工业"},
                {"key": "agriculture", "text": "农业"},
                {"key": "environmental", "text": "环保"},
                {"key": "other", "text": "其他"},
            ];

            $scope.orderTypes = [
                {"key": "newProduct", "text": "新产品"},
                {"key": "newCraft", "text": "新工艺"},
                {"key": "newTechnology", "text": "新技术"},
                {"key": "newMaterial", "text": "新材料"},
                {"key": "all", "text": "整体解决方案"},
                {"key": "other", "text": "其他"},
            ];

            $scope.cooperationMethods = [
                {"key": "1", "text": "意向评估"},
                {"key": "2", "text": "委托定向开发"},
                {"key": "3", "text": "合作开发"},
                {"key": "4", "text": "技术引进"},
                {"key": "5", "text": "外购产品"},
                {"key": "6", "text": "其他"},
            ];

            //选中的数组元素  定义
            $scope.selectedTypes = [];
            $scope.selectedMethods = [];
            //多选 初始化未选中状态
            angular.forEach($scope.orderTypes,function (type) {
                type.cssType = false;
            });
            angular.forEach($scope.cooperationMethods,function (method) {
                method.cssType = false;
            })


            //完善需求模态框
            $scope.perfect = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'perfect.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.orderTypes = $scope.orderTypes;
                        scope.cooperationMethods = $scope.cooperationMethods;
                        scope.industrys = $scope.industrys;
                        scope.selectedTypes = [];
                        scope.selectedMethods = [];
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };

                        scope.changeIndustry = function () {
                            console.log("perform the changeIndustry method");
                        }

                        scope.selectType = function (index) {
                            console.log(index);
                            var judge = false;
                            for (var i = 0; i < scope.selectedTypes.length; i++) {
                                if (scope.orderTypes[index].key == scope.selectedTypes[i]) {
                                    scope.selectedTypes.splice(i,1);
                                    scope.orderTypes[index].cssType = false;
                                    judge = true;
                                    break;
                                }
                            }
                            if(judge == false){
                                scope.selectedTypes.push(scope.orderTypes[index].key);
                                scope.orderTypes[index].cssType = true;
                            }
                            console.log(scope.selectedTypes);
                        }

                        scope.selectMethod = function (index) {
                            console.log(index);
                            var judge = false;
                            for (var i = 0; i < scope.selectedMethods.length; i++) {
                                if (scope.cooperationMethods[index].key == scope.selectedMethods[i]) {
                                    scope.selectedMethods.splice(i,1);
                                    scope.cooperationMethods[index].cssType = false;
                                    judge = true;
                                    break;
                                }
                            }
                            if(judge == false){
                                scope.selectedMethods.push(scope.cooperationMethods[index].key);
                                scope.cooperationMethods[index].cssType = true;
                            }
                            console.log(scope.selectedMethods);
                        }
                    }]
                });

                modalInstance.result.then(function (id) {
                    //逻辑删除
                    // OrderService.delete(id).$promise.then(function (result) {
                    //     if ("success" == result.status) {
                    //         toastr.success("", "用户移出成功");
                    //         $scope.list();
                    //     } else {
                    //         for (var index in result.errors) {
                    //             toastr.error(result.errors[index].errmsg, "用户移出失败");
                    //         }
                    //     }
                    // });
                });
            }



            $scope.$watch('sort', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                OrderService.setSort(newValue);
                $scope.list();
            });

            $scope.$watch('order', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                OrderService.setOrder(newValue);
                $scope.list();
            });

            $scope.$watch('pageable.size', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                OrderService.setSize(newValue);
                $scope.list();
            });

            $scope.$watch('pageable.number', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                OrderService.setStoredPage(newValue);
                $scope.list();
            });

            // 查询
            $scope.condition = {};
            $scope.search = function () {
                OrderService.putSearchParams(
                    {
                        name: $scope.condition.name
                    }
                );
                $scope.list();
            };

            $scope.create = function () {
                $location.path("/order/add.html").search();
            };

            $scope.back = function () {
                $location.path("/order/list.html").search({});
            };

            $scope.update = function () {
                $location.path("/order/add.html").search({id: id});
            };


            $scope.delete = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "是否确认从组织中移出该用户？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    //逻辑删除
                    OrderService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "用户移出成功");
                            $scope.list();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "用户移出失败");
                            }
                        }
                    });
                });
            };


            // $scope.selectType = function (index) {
            //     console.log(index);
            //     var judge = false;
            //
            //     for (var i = 0; i < $scope.selectedTypes.length; i++) {
            //         if ($scope.orderTypes[index].key == $scope.selectedTypes[i]) {
            //             $scope.selectedTypes.splice(i,1);
            //             $scope.orderTypes[index].cssType = false;
            //             judge = true;
            //             break;
            //         }
            //     }
            //     if(judge == false){
            //         $scope.selectedTypes.push($scope.orderTypes[index].key);
            //         $scope.orderTypes[index].cssType = true;
            //     }
            //     console.log($scope.selectedTypes);
            // }


        }
    ]
);