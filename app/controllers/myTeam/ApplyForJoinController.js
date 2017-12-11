angular.module("MetronicApp").controller('ApplyForJoinController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'ApplyForJoinService',
        function ($rootScope, $scope, $location, $uibModal, toastr, ApplyForJoinService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.columns = ApplyForJoinService.getSchema();
            $scope.sort = ApplyForJoinService.getSort();
            $scope.order = ApplyForJoinService.getOrder();
            $scope.pageable = ApplyForJoinService.getPageable();


            $scope.barConfig = {imageUrl: 'imageUrl', title: 'name', btnTemplateUrl:'applyForJoinOperation.html',detail:'detail',hoverjump:'/myTeam/view.html'};
            $scope.rows = [
                {"id":1,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"北京团队","detail":"北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京"},
                {"id":2,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"上海团队","detail":"上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海"},
                {"id":3,"imageUrl":"../../assets/admin/pages/img/teamlogo.png","name":"大连团队","detail":"大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连"}
            ];

            //method of fetch list data
            // $scope.list = function () {
            //     ApplyForJoinService.listWithPost().$promise.then(function (result) {
            //         $scope.rows = result.data;
            //         //storage page state
            //         $scope.pageable = result.pageable;
            //         if (!$scope.$$phase) {
            //             $scope.$apply();
            //         }
            //     });
            // };
            var gotoFirstPage = function () {
                ApplyForJoinService.setStoredPage(0);
                // $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ApplyForJoinService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ApplyForJoinService.setStoredPage(newVal);
                gotoFirstPage();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ApplyForJoinService.setSort(newValue);
                gotoFirstPage();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ApplyForJoinService.setOrder(newValue);
                gotoFirstPage();
            });
            
            $scope.applyForJoin = function () {
                console.log("申请加入团队");
            }

            //跳转页面并传递参数
            $scope.create = function () {
                $location.path("/team/edit.html").search({});
            };
            $scope.view = function (id) {
                $location.path("/team/view.html").search({"id": id});
            };
            $scope.search = function () {
                ApplyForJoinService.putSearchParams(
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


            $scope.manual = false;


             //高级筛选
            $scope.establishYear = [
                {"key": "threeYears", "text": "3年"},
                {"key": "fiveYears", "text": "5年"},
                {"key": "tenYears", "text": "10年"},
            ];
            $scope.establishYearName = '团队成立年限';
            $scope.establishYearEnglishName = 'establishYear';

            $scope.addresss = [
                {"key": "BEIJING", "text": "北京"},
                {"key": "SHANGHAI", "text": "上海"},
                {"key": "SHENZHEN", "text": "深圳"},
                {"key": "GUANGZHOU", "text": "广州"},
                {"key": "TIANJIN", "text": "天津"}
            ];
            $scope.addresssName = '团队地址';
            $scope.addresssEnglishName = 'addresss';

            $scope.teamSize = [
                {"key": "twenty", "text": "20人以上"},
                {"key": "thirty", "text": "30人以上"},
                {"key": "forty", "text": "40人以上"},
                {"key": "fifty", "text": "50人以上"}
            ];
            $scope.teamSizeName = '团队规模';
            $scope.teamSizeEnglishName = 'teamSize';

            $scope.designerSize = [
                {"key": "twenty", "text": "20人以上"},
                {"key": "thirty", "text": "30人以上"},
                {"key": "forty", "text": "40人以上"},
                {"key": "fifty", "text": "50人以上"}
            ];
            $scope.designerSizeName = '设计师规模';
            $scope.designerSizeEnglishName = 'designerSize';


            $scope.allSelected = {};
            $scope.allbtn = true;


            $scope.advance = false;
            $scope.showAdvance = function () {
                $scope.advance = true;
            }

            $scope.hideAdvance = function () {
                $scope.advance = false;
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



