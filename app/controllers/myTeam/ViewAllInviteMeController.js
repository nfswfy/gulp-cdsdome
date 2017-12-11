angular.module("MetronicApp").controller('ViewAllInviteMeController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'ViewAllInviteMeService',
        function ($rootScope, $scope, $location, $uibModal, toastr, ViewAllInviteMeService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.columns = ViewAllInviteMeService.getSchema();
            $scope.sort = ViewAllInviteMeService.getSort();
            $scope.order = ViewAllInviteMeService.getOrder();
            $scope.pageable = ViewAllInviteMeService.getPageable();


            //method of fetch list data
            $scope.list = function () {
                ViewAllInviteMeService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            var gotoFirstPage = function () {
                ViewAllInviteMeService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ViewAllInviteMeService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ViewAllInviteMeService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ViewAllInviteMeService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ViewAllInviteMeService.setOrder(newValue);
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
                ViewAllInviteMeService.putSearchParams(
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



