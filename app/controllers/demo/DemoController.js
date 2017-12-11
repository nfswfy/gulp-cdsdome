
angular.module("MetronicApp").controller('DemoController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'DemoService',
        function ($rootScope, $scope, $location, $uibModal, toastr, DemoService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

          //ng-table about
          $scope.columns = DemoService.getSchema();
          $scope.sort = DemoService.getSort();
          $scope.order = DemoService.getOrder();
          $scope.pageable = DemoService.getPageable();
          $scope.notpageable = false;

          $scope.list = function () {
            DemoService.list().$promise.then(function (result) {
              $scope.rows = result.data;
              //storage page state
              DemoService.setStoredPage(result.pageable.number);
              $scope.pageable=result.pageable;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
          };

          var gotoFirstPage = function () {
            DemoService.setStoredPage(0);
            $scope.list();
          };

          DemoService.clearSearchParams();
          gotoFirstPage();

          //fetch data when the size of page changed
          $scope.$watch('pageable.size', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            DemoService.setSize(newVal);
            gotoFirstPage();
          });

          //fetch data when the number of pages changed
          $scope.$watch('pageable.number', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            DemoService.setStoredPage(newVal);
            $scope.list();
          });

          $scope.$watch('sort', function (newValue, oldValue) {
            if (oldValue == newValue) return;
            DemoService.setSort(newValue);
            $scope.list();
          });
          $scope.$watch('order', function (newValue, oldValue) {
            if (oldValue == newValue) return;
            DemoService.setOrder(newValue);
            $scope.list();
          });


        }
    ]
);