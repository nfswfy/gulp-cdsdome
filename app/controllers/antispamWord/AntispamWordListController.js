/**
 * Created by x on 2017/11/23.
 *
 * 敏感词管理控制器
 */
angular.module("MetronicApp").controller('AntispamWordListController',
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

                //初始化表格
                table.init($scope, AntispamWordService);

                //绑定scope数据
                angular.extend($scope, {
                    search: search,
                    openAdd: openAdd
                });
            }

            function search() {
                table.search($scope.condition || {});
            }

            function openAdd() {
                $location.path("/antispamWord/edit.html").search({});
            }
        }
    ]
);
