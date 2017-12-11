/**
 * Created by x on 2017/11/23.
 *
 * 敏感词管理控制器
 */
angular.module("MetronicApp").controller('AntispamWordViewController',
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
                angular.extend($scope, {
                    search: search
                });
            }

            function search() {
                table.search($scope.condition || {});
            }
        }
    ]
);
