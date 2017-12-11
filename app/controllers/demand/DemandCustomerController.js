
angular.module("MetronicApp").controller('DemandCustomerController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'DemandCustomerService',
        function ($rootScope, $scope, $location, $uibModal, toastr, DemandCustomerService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            //ng-table about
            $scope.columns = DemandCustomerService.getSchema();
            $scope.sort = DemandCustomerService.getSort();
            $scope.order = DemandCustomerService.getOrder();
            $scope.pageable = DemandCustomerService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                DemandCustomerService.list().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            var gotoFirstPage = function () {
                DemandCustomerService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                DemandCustomerService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                DemandCustomerService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                DemandCustomerService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                DemandCustomerService.setOrder(newValue);
                $scope.list();
            });
            //关闭
            $scope.close = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认关闭吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(row);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (row) {
                    DemandCustomerService.save(row).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "关闭成功");
                            gotoFirstPage();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "关闭失败");
                            }
                        }
                    });
                });
            };
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
            $scope.create = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'perfect.html',
                    size:'lg',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.orderTypes = $scope.orderTypes;
                        scope.cooperationMethods = $scope.cooperationMethods;
                        scope.industrys = $scope.industrys;
                        scope.selectedTypes = [];
                        scope.selectedMethods = [];
                        $('#editTab a').click(function (e) {
                            e.preventDefault();
                            $(this).tab('show');
                            scope.$apply();
                        });
                        scope.$watch('industrySelectTag', function (newVal, oldVal) {
                            if (newVal === oldVal) return;
                            for (var i = 0; i < industrys.length; i++) {
                                if (newVal === industrys[i].industryId) {
                                    scope.industryDataDetails = industrys[i].fieldList;
                                    // scope.model.fieldId = [];
                                    // scope.model.fieldId = industryDatas[i].fieldList;
                                    break;
                                }
                            }
                        });
                        scope.model = {};
                        scope.btn_ok = function () {
                            $uibModalInstance.close(scope.model);
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

                modalInstance.result.then(function (model) {
                    model.orderType = 1;
                    model.directionOfCooperation = 1;
                    model.expectedStartTime = model.expectedStartTime._i;
                    model.expectedEndTime = model.expectedEndTime._i;
                    DemandCustomerService.savePublish(model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "需求发布成功");
                            $scope.list();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "需求发布失败");
                            }
                        }
                    });
                });
            };
            //跳转页面并传递参数
            $scope.view = function (id) {
                $location.path("/demandCustomer/view.html").search({"orderId":id});
            };
            $scope.condition={};
            $scope.search = function () {
                DemandCustomerService.putSearchParams(
                    {
                        searchStr: $scope.condition.searchStr,
                        orderStatus: $scope.condition.orderStatus
                    }
                );
                gotoFirstPage();
            };
            DemandCustomerService.clearSearchParams();
        }
    ]
).controller('DemandCustomerViewController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', '$uibModal','DemandCustomerService',
        function ($rootScope, $scope, $location, toastr, EnumService, $uibModal,DemandCustomerService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $('#demandView a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
                $scope.$apply();
            });
            $scope.id = $location.search().orderId;

            $scope.back = function () {
                $location.path("/demandCustomer/list.html").search({});
            };

            //ng-table about
            $scope.columns = DemandCustomerService.getSchemaView();
            $scope.sort = DemandCustomerService.getSort();
            $scope.order = DemandCustomerService.getOrder();
            $scope.pageable = DemandCustomerService.getPageable();
            $scope.notpageable = true;

            //原始需求详情
            DemandCustomerService.get($scope.id).$promise.then(function (result) {
                $scope.model = result.data;
                //storage page state
            });
            //需求完善
            DemandCustomerService.getImprove($scope.id).$promise.then(function (result) {
                $scope.modelImprove = result.data;
                //storage page state
            });
            //获取需求细化列表
            DemandCustomerService.listRefinement($scope.id).$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });

            //获取需求补充列表
            DemandCustomerService.listComplement($scope.id).$promise.then(function (result) {
                    $scope.complementList = result.data;
                    //storage page state
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
        }
    ]
);