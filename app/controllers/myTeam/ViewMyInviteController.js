angular.module("MetronicApp").controller('ViewMyInviteController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'ViewMyInviteService',
        function ($rootScope, $scope, $location, $uibModal, toastr, ViewMyInviteService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.columns = ViewMyInviteService.getSchema();
            $scope.sort = ViewMyInviteService.getSort();
            $scope.order = ViewMyInviteService.getOrder();
            $scope.pageable = ViewMyInviteService.getPageable();


            //method of fetch list data
            $scope.list = function () {
                ViewMyInviteService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            var gotoFirstPage = function () {
                ViewMyInviteService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ViewMyInviteService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ViewMyInviteService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ViewMyInviteService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ViewMyInviteService.setOrder(newValue);
                $scope.list();
            });

            //跳转页面并传递参数
            $scope.create = function () {
                $location.path("/team/edit.html").search({});
            };
            $scope.view = function (id) {
                $location.path("/team/view.html").search({"id": id});
            };
            $scope.search = function () {
                ViewMyInviteService.putSearchParams(
                    {
                        name: $scope.condition.key,
                        approveStep: $scope.condition.approveStep
                    }
                );
                gotoFirstPage();
            };

            $scope.back = function () {
                $location.path("/myTeam/list.html").search({});
            }
        }
    ]
).filter("ServerStatusFilter", ["EnumService", function (EnumService) {
    return function (value) {
        var typeData = EnumService.get("ServerStatus");
        var even = _.find(typeData, function (type) {
                return type.key == value;
            }
        );
        return even ? even.text : "";
    };
}]);



