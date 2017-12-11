angular.module("MetronicApp").controller('MyCreateTeamController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'MyCreateTeamService',
        function ($rootScope, $scope, $location, $uibModal, toastr, MyCreateTeamService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.columns = MyCreateTeamService.getSchema();
            $scope.sort = MyCreateTeamService.getSort();
            $scope.order = MyCreateTeamService.getOrder();
            $scope.pageable = MyCreateTeamService.getPageable();


            //method of fetch list data
            $scope.list = function () {
                MyCreateTeamService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            var gotoFirstPage = function () {
                MyCreateTeamService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                MyCreateTeamService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                MyCreateTeamService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyCreateTeamService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyCreateTeamService.setOrder(newValue);
                $scope.list();
            });

            //跳转页面并传递参数
            $scope.back = function () {
                $location.path("/myTeam/list.html").search({});
            };
            $scope.view = function (id) {
                $location.path("/team/view.html").search({"id": id});
            };
            $scope.search = function () {
                MyCreateTeamService.putSearchParams(
                    {
                        name: $scope.condition.key,
                        approveStep: $scope.condition.approveStep
                    }
                );
                gotoFirstPage();
            };
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


