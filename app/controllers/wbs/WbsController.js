/**
 * Created by zhoujie on 2017/11/9.
 */
angular.module("MetronicApp").controller('WbsController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'WbsService','EnumService',
        function ($rootScope, $scope, $location, $uibModal, toastr, WbsService,EnumService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.columns = WbsService.getSchema();
            $scope.sort = WbsService.getSort();
            $scope.order = WbsService.getOrder();
            $scope.pageable = WbsService.getPageable();

            // 全部发包形式
            $scope.wbsTypes= EnumService.get("WbsType");
            // 全部状态
            $scope.status= EnumService.get("toolStatus");


            //method of fetch list data
            $scope.list = function () {
                WbsService.list().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    WbsService.setStoredPage(result.pageable.number);
                    $scope.pageable=result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            var gotoFirstPage = function () {
                WbsService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            WbsService.putSearchParams();
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                WbsService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                WbsService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                WbsService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                WbsService.setOrder(newValue);
                $scope.list();
            });

            //跳转页面并传递参数
            $scope.view = function (id) {
                $location.path("/wbs/view.html").search({id:id});
            };
            //竞包
            $scope.competitivePackage = function(id){
                var modalInstance = $uibModal.open({
                    templateUrl: 'competitivePackage.html',
                    controller: "CompetitivePackageController",
                    resolve: {
                        competitiveId: function () {
                            return $scope.id;
                        }
                    }
                });
                //modalInstance.result.then(function (selectnode) {
                //    $scope.model.parentId = selectnode.id;
                //    $scope.model.parentTitle = selectnode.text;
                //});
            };
            $scope.search = function () {
                WbsService.putSearchParams(
                    {
                        status: $scope.condition.projectStatus,
                        name: $scope.condition.name
                    }
                );
                gotoFirstPage();
            };
        }
    ]
).controller('CompetitivePackageController',
    ['$rootScope', '$scope', '$uibModalInstance', '$timeout', "toastr", 'WbsService', 'competitiveId',
        function ($rootScope, $scope, $uibModalInstance, $timeout, toastr, WbsService,competitiveId) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.btn_ok = function () {
                //if (!$scope.selectnode) {
                //    toastr.error("","请选择父菜单");
                //    return;
                //}
                //if (currentMenuId || currentMenuId == 0) {
                //    if ($scope.selectnode.id == currentMenuId) {
                //        toastr.error("","你不能选择自己作为父菜单");
                //    } else {
                //        $uibModalInstance.close($scope.selectnode);
                //    }
                //} else {
                //    $uibModalInstance.close($scope.selectnode);
                //}
                $uibModalInstance.close();
            };
            $scope.btn_cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]
).controller('WbsViewController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'WbsViewService',
        function ($rootScope, $scope, $location, $uibModal, toastr, WbsViewService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            $scope.columns = WbsViewService.getSchema();
            $scope.costColumns = WbsViewService.getCostSchema();
            $scope.pointColumns = WbsViewService.getPointSchema();

            $scope.notpageable = true;

            //获取基本信息，团队信息
            WbsViewService.get($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.model = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });
            //获取交付物要求
            WbsViewService.getBusinessList($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.rows = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });
            //获取成本要求
            WbsViewService.getCostList($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.costRows = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });
            //获取中间审查点
            WbsViewService.getPointList($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.pointRows = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });


            $scope.back = function () {
                $location.path("/wbs/list.html").search({});
            };

        }
    ]
);