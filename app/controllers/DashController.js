/**
 * 系统主页
 * Created by zzz on 2017/10/16.
 */
angular.module("MetronicApp").controller('DashController',
    ['$rootScope', '$scope',
        function ($rootScope, $scope) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
        }
    ]
);