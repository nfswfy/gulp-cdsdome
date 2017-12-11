/**
 * Created by zhoujie on 2017/11/8.
 */
angular.module("MetronicApp").controller('AccountController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'AccountService',
        function ($rootScope, $scope, $location, $uibModal, toastr, AccountService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            $scope.columns = AccountService.getSchema();


            //获取基本信息，团队信息
            AccountService.get($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.model = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });
            //获取收款记录
            AccountService.list($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.rows = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });

            $scope.presentRecord = function(id){
                $location.path("/account/presentRecord.html").search({id:id});
            };
            $scope.view = function(id){
                $location.path("/myContract/view.html").search({id:id});
            }
            //提现
            $scope.deposit = function(id){
                var modalInstance = $uibModal.open({
                    templateUrl: 'deposit.html',
                    controller: "DepositController",
                    resolve: {
                        depositId: function () {
                            return $scope.id;
                        }
                    }
                });
                //modalInstance.result.then(function (selectnode) {
                //    $scope.model.parentId = selectnode.id;
                //    $scope.model.parentTitle = selectnode.text;
                //});
            };


        }
    ]
).controller('RresentRecordController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'PresentRecordService',
        function ($rootScope, $scope, $location, $uibModal, toastr, PresentRecordService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            $scope.columns = PresentRecordService.getSchema();

            //获取提现记录
            PresentRecordService.list($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.rows = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                    }
                }
            });

            $scope.search = function(id){

            };

            $scope.back = function () {
                $location.path("/account/list.html").search({});
            };

        }
    ]
);angular.module("MetronicApp").controller('DepositController',
    ['$rootScope', '$scope', '$uibModalInstance', '$timeout', "toastr", 'AccountService', 'depositId', '$uibModal',
        function ($rootScope, $scope, $uibModalInstance, $timeout, toastr, AccountService, depositId,$uibModal) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            //添加银行卡
            $scope.addBankCard = function(id){
                var modalInstance = $uibModal.open({
                    templateUrl: 'addBankCard.html',
                    controller: "AddBankCardController",
                    resolve: {
                        addBankCardId: function () {
                            return $scope.id;
                        }
                    }
                });
                //modalInstance.result.then(function (selectnode) {
                //    $scope.model.parentId = selectnode.id;
                //    $scope.model.parentTitle = selectnode.text;
                //});
            };
            //提现确认
            $scope.btn_ok = function () {
                $uibModalInstance.close();
                var modalInstance = $uibModal.open({
                    templateUrl: 'depositConfirm.html',
                    controller: "DepositConfirmController",
                    resolve: {
                        depositId: function () {
                            return $scope.id;
                        }
                    }
                });
            };
            $scope.btn_cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]
);angular.module("MetronicApp").controller('AddBankCardController',
    ['$rootScope', '$scope', '$uibModalInstance', '$timeout', "toastr", 'AccountService', 'addBankCardId',
        function ($rootScope, $scope, $uibModalInstance, $timeout, toastr, AccountService,addBankCardId) {
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
);angular.module("MetronicApp").controller('DepositConfirmController',
    ['$rootScope', '$scope', '$uibModalInstance', '$timeout', "toastr", 'AccountService', 'depositId',
        function ($rootScope, $scope, $uibModalInstance, $timeout, toastr, AccountService,depositId) {
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
);