angular.module("MetronicApp").controller('InviteJoinController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'InviteJoinService',
        function ($rootScope, $scope, $location, $uibModal, toastr, InviteJoinService) {
            $scope.$on('$viewContentLoaded', function () {
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.columns = InviteJoinService.getSchema();
            $scope.sort = InviteJoinService.getSort();
            $scope.order = InviteJoinService.getOrder();
            $scope.pageable = InviteJoinService.getPageable();

            $scope.half = true;

            $scope.barConfig = {imageUrl: 'imageUrl', title: 'name', btnTemplateUrl:'inviteJoin.html',detail:'detail',hoverjump:'/myTeam/view.html'};
            $scope.rows = [
                {"id":1,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"王小丫","detail":"高级设计师  能源/海工装备"},
                {"id":2,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"李大嘴","detail":"高级设计师  能源/海工装备"},
                {"id":3,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"张大头","detail":"高级设计师  能源/海工装备"}
            ];


            // $scope.list = function () {
            //     InviteJoinService.listWithPost().$promise.then(function (result) {
            //         $scope.rows = result.data;
            //         $scope.pageable = result.pageable;
            //         if (!$scope.$$phase) {
            //             $scope.$apply();
            //         }
            //     });
            // };
            var gotoFirstPage = function () {
                InviteJoinService.setStoredPage(0);
                // $scope.list();
            };

            //点击  “我加入的团队”  Tab页
            $scope.myJoinTeam = function () {
                $scope.currentTab = 'join';
            }

            //去加入
            $scope.gotoJoin = function () {

            }



            gotoFirstPage();


            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                InviteJoinService.setSize(newVal);
                gotoFirstPage();
            });


            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                InviteJoinService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                InviteJoinService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                InviteJoinService.setOrder(newValue);
                $scope.list();
            });


            $scope.create = function () {
                $location.path("/team/edit.html").search({});
            };
            $scope.view = function () {
                $location.path("/myTeam/view.html").search({"currentTab": $scope.currentTab});
            };
            $scope.search = function () {
                InviteJoinService.putSearchParams(
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

            //邀请人员加入
            $scope.inviteJoin = function (id) {

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


