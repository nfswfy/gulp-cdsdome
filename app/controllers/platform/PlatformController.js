/**
 * Created by zzzy on 2017/9/6.
 */
angular.module("MetronicApp").controller('PlatformController',
    ['$rootScope', '$scope', '$location', "toastr",'PlatformService','$uibModal',
        function ($rootScope, $scope, $location, toastr, PlatformService,$uibModal) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });


            //ng-table about
            $scope.columns =PlatformService.getSchema();
            $scope.sort =PlatformService.getSort();
            $scope.order = PlatformService.getOrder();
            $scope.pageable =PlatformService.getPageable();
            $scope.notpageable = false;

            $scope.$watch('sort', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                PlatformService.setSort(newValue);
                initPage();
            });

            $scope.$watch('order', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                PlatformService.setOrder(newValue);
                initPage();
            });

            $scope.$watch('pageable.size', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                PlatformService.setSize(newValue);
                initPage();
            });

            $scope.$watch('pageable.number', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                PlatformService.setStoredPage(newValue);
                initPage();
            });

            var initPage = function () {
                PlatformService.list().$promise.then(function (result) {
                    if("success" == result.status){
                        $scope.rows = result.data;
                        $scope.pageable = result.pageable;
                    }else{
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "组织列表获取失败");
                        }
                    }
                })
            };
            $scope.create = function () {
                $location.path("/platform/createUser.html").search();
            };
            $scope.admin = function (id) {
                $location.path("/platform/createUser.html").search({id:id});
            };
            // search
            $scope.condition = {};
            $scope.search = function () {
                PlatformService.putSearchParams(
                    {
                        name: $scope.condition.name
                    }
                );
                initPage();
            };
            initPage();

            $scope.back = function () {
                $location.path("/organization/list.html").search({});
            };

            $scope.update = function () {
                $location.path("/organization/add.html").search({id:id});
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
                    OrganizationUserService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "用户移出成功");
                            initPage();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "用户移出失败");
                            }
                        }
                    });
                });
            };


        }
    ]
).controller('PlatformCreateUserController',
    ['$rootScope', '$scope', '$location', "toastr", 'PlatformCreateUserService',
        function ($rootScope, $scope, $location, toastr, PlatformCreateUserService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.id=$location.search().id;
            //获取组织
            PlatformCreateUserService.getOrgList().$promise.then(function (result){
                if("success" == result.status){
                    $scope.organizationList = result.data;
                }else{
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "组织获取失败");
                    }
                }
            });
                PlatformCreateUserService.getAll().$promise.then(function (result) {
                    if (result.status == "success") {
                        $scope.rolesData = result.data;
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "角色信息获取失败")
                        }
                    }
                });

            if ($scope.id) {
                PlatformCreateUserService.getUser($scope.id).$promise.then(function (result) {
                    if (result.status == "success") {
                        $scope.model = result.data;
                        $scope.copy_model = angular.copy($scope.model);
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "用户信息获取失败")
                        }
                    }
                })
            } else {
                $scope.model = {};
                $scope.copy_model = angular.copy($scope.model);
            }

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.submit = function (form) {
                form.$submitted = true;
                if (form.$valid) {
                    PlatformCreateUserService.saveNew($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "用户信息保存成功");
                                $location.path("/platform/userList.html").search();

                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "用户信息提交失败")
                            }
                        }
                    })
                }
            };


            $scope.back = function () {
                    $location.path("/platform/userList.html").search({});

        }
}
    ]
).controller('PlatformRoleManagerController',
    ['$rootScope', '$scope', '$location', "toastr",'$uibModal','PlatformRoleManagerService',
        function ($rootScope, $scope, $location, toastr,$uibModal,PlatformRoleManagerService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            var model={};
            $scope.getUserPage = function (roleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'userPage.html',
                    controller: "PlatformUserListController",
                    size: "md",
                    resolve: {
                        parameters: function () {
                        },
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'app/directives/ngTable/directive.js',
                                    'app/controllers/platform/PlatformController.js',
                                    'app/services/platform/PlatformRoleManagerService.js'
                                ]
                            });
                        }]
                    }
                });
                modalInstance.result.then(function (row) {
                    chooseUser( row.id,roleId);
                });
            };
            var chooseUser=function (userId,roleId) {
                PlatformRoleManagerService.chooseUser(userId,roleId).$promise.then(function (result) {
                    if (result.status == "success") {
                        toastr.success("", "角色添加成功");
                        initPage();
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "角色添加失败")
                        }
                    }
                })
            };

            var initPage = function () {
                PlatformRoleManagerService.getRoleIds().$promise.then(function (result) {
                    if (result.status == "success") {
                        $scope.roleIdList = result.data;
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "角色Id获取失败")
                        }
                    }
                });

                PlatformRoleManagerService.get().$promise.then(function (result) {
                    if (result.status == "success") {
                        $scope.rolesData = result.data;
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "角色信息获取失败")
                        }
                    }
                })
            };

            initPage();
            $scope.delete=function(userId,roleId){
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "是否确认删除用户的该角色？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(userId);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function () {
                    //逻辑删除
                    PlatformRoleManagerService.delete(userId,roleId).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "角色删除成功");
                            initPage();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "用户移出失败");
                            }
                        }
                    });
                });
            }

        }
    ]
).controller('PlatformUserListController',
    ['$rootScope', '$scope', '$location', "toastr", '$uibModalInstance','PlatformRoleManagerService',
        function ($rootScope, $scope, $location, toastr, $uibModalInstance,PlatformRoleManagerService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.columns =PlatformRoleManagerService.getSchema();
            $scope.sort =PlatformRoleManagerService.getSort();
            $scope.order = PlatformRoleManagerService.getOrder();
            $scope.pageable =PlatformRoleManagerService.getPageable();
            $scope.notpageable = false;

            $scope.$watch('sort', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                PlatformRoleManagerService.setSort(newValue);
                initPage();
            });

            $scope.$watch('order', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                PlatformRoleManagerService.setOrder(newValue);
                initPage();
            });

            $scope.$watch('pageable.size', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                PlatformRoleManagerService.setSize(newValue);
                initPage();
            });

            $scope.$watch('pageable.number', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                PlatformRoleManagerService.setStoredPage(newValue);
                initPage();
            });
            var initPage=function () {
                PlatformRoleManagerService.list().$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.rows = result.data;
                        $scope.pageable = result.pageable;
                    } else {
                        for (var index in result.errors) {
                            toastr.error("信息获取失败，", result.errors[index].errmsg);
                        }
                    }
                });
            };
            $scope.search = function () {
                PlatformRoleManagerService.putSearchParams(
                    {
                        name: $scope.condition.name
                    }
                );
                initPage();
            };
            initPage();
            $scope.choose = function (row) {
                $uibModalInstance.close(row);
            };
            $scope.btn_ok = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]
);