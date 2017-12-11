/**
 * Created by zhoujie
 */
angular.module("MetronicApp").controller('ProjectListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'ProjectService','EnumService',
        function ($rootScope, $scope, $location, $uibModal, toastr, ProjectService,EnumService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.columns = ProjectService.getSchema();
            $scope.sort = ProjectService.getSort();
            $scope.order = ProjectService.getOrder();
            $scope.pageable = ProjectService.getPageable();

            // 检索条件中的下拉列表
            $scope.projectTypes= EnumService.get("ProjectStatus");


            //method of fetch list data
            $scope.list = function () {
                    ProjectService.list().$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        console.log(result.data)
                        $scope.pageable = result.pageable;
                        ProjectService.setStoredPage(result.pageable.number);
                        $scope.pageable=result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
            };
            var gotoFirstPage = function () {
                ProjectService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            ProjectService.putSearchParams();
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ProjectService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ProjectService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ProjectService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ProjectService.setOrder(newValue);
                $scope.list();
            });

            //跳转页面并传递参数
            $scope.view = function (id) {
                $location.path("/project/view.html").search({id:id});
            };
            //立项
            //$scope.projectApproval = function (id) {
            //    $location.path("/project/approval.html").search({id:id});
            //};
            //评价
            $scope.evaluate = function(id){
                var modalInstance = $uibModal.open({
                    templateUrl: 'evaluate.html',
                    controller: "evaluateController",
                    resolve: {
                        evaluateId: function () {
                            return $scope.id;
                        }
                    }
                });
                //modalInstance.result.then(function (selectnode) {
                //    $scope.model.parentId = selectnode.id;
                //    $scope.model.parentTitle = selectnode.text;
                //});
            };
            $scope.change = function(id){
               $location.path("/project/change.html").search({id:id});
            };
            $scope.search = function () {
                ProjectService.putSearchParams(
                    {
                        status: $scope.condition.projectStatus,
                        name: $scope.condition.projectName
                    }
                );
                gotoFirstPage();
            };
        }
    ]
).controller('ProjectViewController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'ProjectViewService',
        function ($rootScope, $scope, $location, $uibModal, toastr, ProjectViewService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            $scope.columns = ProjectViewService.getSchema();
            $scope.toolBagColumns = ProjectViewService.getToolBagSchema();
            $scope.costColumns = ProjectViewService.getCostSchema();
            $scope.changeColumns = ProjectViewService.getChangeSchema();
            $scope.pageable = ProjectViewService.getPageable();
            $scope.notpageable = true;

           //获取基本信息，团队信息
            ProjectViewService.get($scope.id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.model = result.data;
                        //$scope.copy_model = angular.copy($scope.model);
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                        }
                    }
                });
            //获取项目费用
            ProjectViewService.getProjectList($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.projectRows = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });
            //获取工作包费用
            ProjectViewService.getToolBagList($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.toolBagRows = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });
            //获取费用总计
            ProjectViewService.getCostList($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.costRows = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });
            //获取变更
            ProjectViewService.getChangeList($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.changeRows = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });
            //查看变更




            $scope.view = function(id){
                //var modalInstance = $uibModal.open({
                //    templateUrl: 'changeModel.html',
                //    controller: "changeModelController",
                //    resolve: {
                //        changeId: function () {
                //            return $scope.id;
                //        }
                //    }
                //});
                //modalInstance.result.then(function (selectnode) {
                //    $scope.model.parentId = selectnode.id;
                //    $scope.model.parentTitle = selectnode.text;
                //});
            };

            $scope.back = function () {
                $location.path("/project/list.html").search({});
            };


        }
    ]
).controller('ProjectChangeController',
    ['$rootScope', '$scope', '$location', '$uibModal','$resource', 'toastr', 'ProjectViewService','EnumService',
        function ($rootScope, $scope, $location, $uibModal,$resource, toastr,ProjectViewService,EnumService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            // alert("--------"+ $scope.id);
            //获取基本信息，团队信息
            ProjectViewService.getOneProject($scope.id).$promise.then(function (result) {
                // alert(111);
                console.log(result)
                if ("success" == result.status) {

                    $scope.model = result.data;
                    // $scope.changeid=result.data.id;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });
            //获取变更类型
            $scope.changeType= EnumService.get("changeType");
            // alert($scope.changeType);

            $scope.back = function () {
                $location.path("/project/list.html").search({});
            };
            //保存变更
            $scope.save = function (a) {



                // $location.path("/project/list.html").search({});
            };
            //提交变更

            $scope.submit = function (a) {
                // ProjectViewService.submit(a,$scope.model);
                var submitUrl=ProjectViewService._saveCdsChangeUrl;
                // var parm={name:$scope.model,
                //     status:a};
                var param=$scope.model;
                $resource(submitUrl, null, {'submit': {method: 'POST'}}).submit(param).$promise.then(function (result) {
                    console.log(result);

                });


            };
            // 重置
            $scope.reset = function () {
                $location.path("/project/list.html").search({});


            };

            // $resource(loginUrl, null, {'login': {method: 'POST'}}).login(param).$promise.then(function (result) {
            //     console.log(result);
            //
            // });

        }
    ]
).controller('evaluateController',
    ['$rootScope', '$scope', '$uibModalInstance', '$timeout', "toastr", 'ProjectService', 'evaluateId',
        function ($rootScope, $scope, $uibModalInstance, $timeout, toastr, ProjectService, evaluateId) {
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
).controller('ProjectApprovalController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'ProjectService','EnumService',
        function ($rootScope, $scope, $location, $uibModal, toastr, ProjectService,EnumService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            // 检索条件中的下拉列表
            $scope.projectTypes= EnumService.get("ProjectType");
            $scope.effectiveDemands= EnumService.get("EffectiveDemand");


            //获取基本信息，团队信息
            ProjectService.get($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.model = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });


            $scope.back = function () {
                $location.path("/project/list.html").search({});
            };

        }
    ]);
//).controller('changeModelController',
//    ['$rootScope', '$scope', '$uibModalInstance', '$timeout', "toastr", 'ProjectViewService', 'changeId',
//        function ($rootScope, $scope, $uibModalInstance, $timeout, toastr, ProjectViewService, changeId) {
//            $scope.$on('$viewContentLoaded', function () {
//                // initialize core components
//                Metronic.initAjax();
//                $rootScope.settings.layout.pageBodySolid = true;
//                $rootScope.settings.layout.pageSidebarClosed = false;
//            });
//
//            $scope.columns = ProjectViewService.getChangeResultSchema();
//            $scope.notpageable = true;
//            //变更结果
//            ProjectViewService.getChangeResultList($scope.id).$promise.then(function (result) {
//                if ("success" == result.status) {
//                    $scope.changeRows = result.data;
//                    $scope.copy_model = angular.copy($scope.model);
//                } else {
//                    for (var index in result.errors) {
//                        toastr.error(result.errors[index].errmsg, "变更结果获取失败");
//                    }
//                }
//            });
//            $scope.btn_ok = function () {
//                //if (!$scope.selectnode) {
//                //    toastr.error("","请选择父菜单");
//                //    return;
//                //}
//                //if (currentMenuId || currentMenuId == 0) {
//                //    if ($scope.selectnode.id == currentMenuId) {
//                //        toastr.error("","你不能选择自己作为父菜单");
//                //    } else {
//                //        $uibModalInstance.close($scope.selectnode);
//                //    }
//                //} else {
//                //    $uibModalInstance.close($scope.selectnode);
//                //}
//                $uibModalInstance.close();
//            };
//            $scope.btn_cancel = function () {
//                $uibModalInstance.dismiss();
//            };
//        }
//    ]
//);