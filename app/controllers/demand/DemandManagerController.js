
angular.module("MetronicApp").controller('DemandManagerController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'DemandManagerService',
        function ($rootScope, $scope, $location, $uibModal, toastr, DemandManagerService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.demandStatus = "intimidate";
            $('#manager a').click(function (e) {
                e.preventDefault();
                if($(this).context.attributes.href.value=='#intimidate'){
                    $scope.demandStatus = "intimidate";
                    $scope.columns = DemandManagerService.getSchema();
                }
                if($(this).context.attributes.href.value=='#win'){
                    $scope.demandStatus = "win";
                    $scope.columns = DemandManagerService.getSchemaOther();
                }
                if($(this).context.attributes.href.value=='#defeat'){
                    $scope.demandStatus = "defeat";
                    $scope.columns = DemandManagerService.getSchemaOther();
                }
                $(this).tab('show');
                $scope.$apply();
            });
            //ng-table about
            $scope.columns = DemandManagerService.getSchema();
            $scope.sort = DemandManagerService.getSort();
            $scope.order = DemandManagerService.getOrder();
            $scope.pageable = DemandManagerService.getPageable();


            //method of fetch list data
            $scope.list = function () {
                if($scope.demandStatus == "intimidate"){
                    DemandManagerService.listWithPost().$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                }else if($scope.demandStatus == "win"){
                    DemandManagerService.listWithPostWin().$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                }else {
                    DemandManagerService.listWithPostDefeat().$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                }

            };
            var gotoFirstPage = function () {
                DemandManagerService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                DemandManagerService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                DemandManagerService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                DemandManagerService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                DemandManagerService.setOrder(newValue);
                $scope.list();
            });
            //查看需求详情
            $scope.viewOrderBrief = function (id) {
                $location.path("/company/view.html").search({"id": id});
            };
            //模态框查看客户详情
            $scope.viewCustomer = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'person.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
            };
            //跳转页面并传递参数
            //打单 跳转到项目空间打单计划
            $scope.intimidate = function () {
                $location.path("/company/edit.html").search({});
            };
            //报价
            $scope.offer = function (id) {
                $location.path("/company/view.html").search({"id": id});
            };
            $scope.communicate = function () {
                $location.path("/demandManager/record.html").search({});
            };
            //赢单跳到合同编辑页面
            $scope.win = function () {
                $location.path("/company/edit.html").search({});
            };
            $scope.search = function () {
                DemandManagerService.putSearchParams(
                    {
                        name: $scope.condition.key
                    }
                );
                gotoFirstPage();
            };
            //战败
            $scope.defeat=function(id){
                var modalInstance = $uibModal.open({
                    templateUrl: 'defeat.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function () {
                    //战败 service方法没写
                    //TODO
                    DemandManagerService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "战败成功");
                            initPage();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "战败失败");
                            }
                        }
                    });
                });
            }

        }
    ]
).controller('CommunicationRecordController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', '$uibModal','CommunicationRecordService',
        function ($rootScope, $scope, $location, toastr, EnumService, $uibModal,CommunicationRecordService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.id = $location.search().id;

            $scope.back = function () {
                $location.path("/demandManager/list.html").search({});
            };

            //ng-table about
            $scope.columns = CommunicationRecordService.getSchema();
            $scope.sort = CommunicationRecordService.getSort();
            $scope.order = CommunicationRecordService.getOrder();
            $scope.pageable = CommunicationRecordService.getPageable();
            //获取沟通记录列表
            $scope.list = function () {
                CommunicationRecordService.get($scope.id).$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            //新增
            $scope.communicationCreate = {
                communicationType:$scope.communicationType,
                createTime:$scope.createTime,
                mainContent:$scope.mainContent
            };
            $scope.create=function(){
                var modalInstance = $uibModal.open({
                    templateUrl: 'create.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.btn_ok = function () {
                            $uibModalInstance.close();
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function () {
                    CommunicationRecordService.save($scope.communicationCreate).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "新增成功");
                            gotoFirstPage();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "新增失败");
                            }
                        }
                    });
                });
            }
            var gotoFirstPage = function () {
                CommunicationRecordService.setStoredPage(0);
                $scope.list();
            };
            //start to fetch list data
            gotoFirstPage();
        }
    ]
).controller('OfferController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', '$uibModal','OfferService',
        function ($rootScope, $scope, $location, toastr, EnumService, $uibModal,OfferService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $('#offer a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
                $scope.$apply();
            });
            $scope.id = $location.search().id;

            $scope.back = function () {
                $location.path("/demandManager/list.html").search({});
            };

            //ng-table about
            $scope.columns = OfferService.getSchema();
            $scope.sort = OfferService.getSort();
            $scope.order = OfferService.getOrder();
            $scope.pageable = OfferService.getPageable();
            //获取报价历史
            $scope.list = function () {
                OfferService.get($scope.id).$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            $scope.save = function(){

            };
            $scope.submit = function () {

            };
            var gotoFirstPage = function () {
                OfferService.setStoredPage(0);
                $scope.list();
            };
            //start to fetch list data
            gotoFirstPage();
        }
    ]
).controller('DemandManagerViewController',
    ['$rootScope', '$scope', '$location', 'toastr', 'CommunicationRecordService', '$uibModal','DemandManagerService',
        function ($rootScope, $scope, $location, toastr, CommunicationRecordService, $uibModal,DemandManagerService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $('#view a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
                $scope.$apply();
            });
            $scope.id = $location.search().id;

            $scope.back = function () {
                $location.path("/demandManager/list.html").search({});
            };
            //打单 跳转到项目空间打单计划
            $scope.intimidate = function () {
                $location.path("/company/edit.html").search({});
            };
            //ng-table about
            $scope.columns = CommunicationRecordService.getSchema();
            $scope.sort = CommunicationRecordService.getSort();
            $scope.order = CommunicationRecordService.getOrder();
            $scope.pageable = CommunicationRecordService.getPageable();

            //获取沟通历史列表
            $scope.list = function () {
                CommunicationRecordService.get($scope.id).$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            CommunicationRecordService.get($scope.id).$promise.then(function (result) {
                $scope.model = result.data;
            });
            var gotoFirstPage = function () {
                DemandManagerService.setStoredPage(0);
                $scope.list();
            };
            //start to fetch list data
            gotoFirstPage();
        }
    ]
);