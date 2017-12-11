angular.module("MetronicApp").controller('MyTeamListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'MyTeamService',
        function ($rootScope, $scope, $location, $uibModal, toastr, MyTeamService) {
            $scope.$on('$viewContentLoaded', function () {
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.columns = MyTeamService.getSchema();
            $scope.sort = MyTeamService.getSort();
            $scope.order = MyTeamService.getOrder();
            $scope.pageable = MyTeamService.getPageable();

            $scope.currentTab = 'create';
            $scope.half = false;

            $scope.barConfigCreate = {imageUrl: 'imageUrl', title: 'name', btnTemplateUrl:'myCreateTeamOperation.html',detail:'detail',hoverjump:'/myTeam/view.html'};
            $scope.barConfigJoin = {imageUrl: 'imageUrl', title: 'name', btnTemplateUrl:'myJoinTeamOperation.html',detail:'detail',hoverjump:'/myTeam/view.html'};
            $scope.rowsCreate = [
                {"id":1,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"北京团队","detail":"北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京"},
                {"id":2,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"上海团队","detail":"上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海"},
                {"id":3,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"大连团队","detail":"大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连"}
            ];

            $scope.rowsJoin = [
                {"id":1,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"炫酷团队","detail":"北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京"},
                {"id":2,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"大侦探团队","detail":"上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海"},
                {"id":3,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"吊炸天团队","detail":"大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连"}
            ];


            // $scope.list = function () {
            //     MyTeamService.listWithPost().$promise.then(function (result) {
            //         $scope.rowsCreate = result.data;
            //         $scope.rowsJoin = result.data;
            //         $scope.pageable = result.pageable;
            //         if (!$scope.$$phase) {
            //             $scope.$apply();
            //         }
            //     });
            // };
            // $scope.list();

            var gotoFirstPage = function () {
                MyTeamService.setStoredPage(0);
                // $scope.list();
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
                $location.path("/myTeam/myJoinTeam/applyForJoin.html").search({});
            }



            gotoFirstPage();


            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                MyTeamService.setSize(newVal);
                gotoFirstPage();
            });


            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                MyTeamService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyTeamService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyTeamService.setOrder(newValue);
                $scope.list();
            });

            $scope.search = function () {
                MyTeamService.putSearchParams(
                    {
                        name: $scope.condition.key,
                        approveStep: $scope.condition.approveStep
                    }
                );
                gotoFirstPage();
            };

            //我创建的团队----创建团队
            $scope.createTeam = function () {
                $location.path("/myTeam/myCreateTeam/createTeam.html").search({});
            };

            //我创建的团队----邀请人员加入
            $scope.inviteJoin = function () {
                $location.path("/myTeam/myCreateTeam/inviteJoin.html").search({});
            }

            //我创建的团队----查看所有要加入的人员
            $scope.viewAllJoin = function () {
                $location.path("/myTeam/myCreateTeam/viewAllJoin.html").search({});
            }
            //我创建的团队----查看邀请历程
            $scope.viewMyInvite = function () {
                $location.path("/myTeam/myCreateTeam/viewMyInvite.html").search({});
            }


            //我加入的团队-----申请加入其他团队
            $scope.applyForJoin = function () {
                $location.path("/myTeam/myJoinTeam/applyForJoin.html").search({});
            }
            //我加入的团队-----查看我的所有申请记录
            $scope.viewMyApply = function () {
                $location.path("/myTeam/myJoinTeam/viewMyApply.html").search({});
            }
            //我加入的团队-----查看所有邀请我的团队
            $scope.viewAllInviteMe = function () {
                $location.path("/myTeam/myJoinTeam/viewAllInviteMe.html").search({});
            }
            //我加入的团队-----退出企业
            $scope.quitTeam = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认退出该团队吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    MyTeamService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "退出成功。");
                            $location.path("/myTeam/list.html").search();
                            $uibModalInstance.dismiss();
                        } else {
                            $uibModalInstance.dismiss();
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "退出失败。");
                            }
                        }
                    });
                });
            }
        }
    ]
).controller('MyTeamViewController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'MyTeamService',
        function ($rootScope, $scope, $location, $uibModal, toastr, MyTeamService) {
            $scope.$on('$viewContentLoaded', function () {
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            //获取到是从哪跳转过来的（创建团队列表页/加入团队列表页）
            // $scope.currentTab = $location.search().currentTab;
            $scope.currentTab = 'create';
            $scope.columnsPersonCreate = MyTeamService.getSchemaInCreateView();
            $scope.columnsPersonJoin = MyTeamService.getSchemaInJoinView();
            $scope.sort = MyTeamService.getSort();
            $scope.order = MyTeamService.getOrder();
            $scope.pageable = MyTeamService.getPageable();



            $scope.list = function () {
                MyTeamService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            var gotoFirstPage = function () {
                MyTeamService.setStoredPage(0);
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
                MyTeamService.setSize(newVal);
                gotoFirstPage();
            });


            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                MyTeamService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyTeamService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyTeamService.setOrder(newValue);
                $scope.list();
            });


            $scope.view = function (id) {
                $location.path("/team/view.html").search({"id": id});
            };

            $scope.back = function (id) {
                $location.path("/myTeam/list.html").search({});
            };

            $scope.search = function () {
                MyTeamService.putSearchParams(
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


