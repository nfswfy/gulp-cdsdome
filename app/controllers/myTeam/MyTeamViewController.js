angular.module("MetronicApp").controller('MyTeamViewController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'MyTeamViewService',
        function ($rootScope, $scope, $location, $uibModal, toastr, MyTeamViewService) {
            $scope.$on('$viewContentLoaded', function () {
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            //获取到是从哪跳转过来的（创建团队列表页/加入团队列表页）
            // $scope.currentTab = $location.search().currentTab;
            $scope.currentTab = 'create';
            $scope.columnsPersonCreate = MyTeamViewService.getSchemaInCreateView();
            $scope.columnsPersonJoin = MyTeamViewService.getSchemaInJoinView();
            $scope.sort = MyTeamViewService.getSort();
            $scope.order = MyTeamViewService.getOrder();
            $scope.pageable = MyTeamViewService.getPageable();



            $scope.list = function () {
                MyTeamViewService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            var gotoFirstPage = function () {
                MyTeamViewService.setStoredPage(0);
                $scope.list();
            };

            //点击  “我加入的团队”  Tab页
            $scope.myJoinTeam = function () {
                $scope.currentTab = 'join';
            }

            //点击  “我创建的团队”  Tab页
            $scope.myCreateTeam = function () {
                $scope.currentTab = 'create';
            }

            //去创建
            $scope.gotoCreate = function () {
                $location.path("/myTeam/myCreateTeam/createTeam.html").search({});
            }

            //去加入
            $scope.gotoJoin = function () {

            }



            gotoFirstPage();


            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                MyTeamViewService.setSize(newVal);
                gotoFirstPage();
            });

            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                MyTeamViewService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyTeamViewService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyTeamViewService.setOrder(newValue);
                $scope.list();
            });


            $scope.view = function (id) {
                $location.path("/team/view.html").search({"id": id});
            };

            $scope.back = function (id) {
                $location.path("/myTeam/list.html").search({});
            };

            $scope.search = function () {
                MyTeamViewService.putSearchParams(
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


