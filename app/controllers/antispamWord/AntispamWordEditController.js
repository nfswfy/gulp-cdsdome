/**
 * Created by x on 2017/11/23.
 *
 * 敏感词管理控制器
 */
angular.module("MetronicApp").controller('AntispamWordEditController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'AntispamWordService',
    function ($rootScope, $scope, $location, $uibModal, toastr, AntispamWordService) {

        var table = new NgTable();
        init();

        function init(){

            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            table.init($scope, AntispamWordService);
            $scope.submit = submit;
            $scope.reset = reset;

            //新建
            if (!$scope.id) {
                $scope.model = {};
                $scope.copy_model = angular.copy($scope.model);

            //修改
            } else {
                AntispamWordService.get($scope.id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.model = result.data;
                        $scope.copy_model = angular.copy($scope.model);
                    } else {
                        for (var index in result.errors) {
                            toastr.error("信息获取失败，", result.errors[index].errmsg);
                        }
                    }
                });
            }
        }

        function search() {
            table.search($scope.condition || {});
        }

        function submit(form) {
console.log($scope.model)
//             console.log($scope.model)
// console.log($scope.model.word)
//             console.log($scope.model.wordLevel  )
            form.$submitted = true;
            AntispamWordService.save($scope.model).$promise.then(function (result) {
                if ("success" == result.status) {
                    toastr.success("", "信息保存成功");

                    $location.path("/antispamWord/view.html").search({"id": $scope.id || result.data.id});

                } else {
                    toastr.error(result.message, "信息保存失败");
                    //toastr.error(result.errors.errmsg, "信息保存失败");
                }
            });
        }

        //重置
        function reset() {
            $scope.model = angular.copy($scope.copy_model);
        }

        //返回
        function back() {
            $location.path("/CsAgreementList.html").search({"id":$scope.id})
        }
    }
    ]
);
