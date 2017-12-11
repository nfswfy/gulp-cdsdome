
angular.module("MetronicApp").controller('CustomerController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'CustomerService',
        function ($rootScope, $scope, $location, $uibModal, toastr, CustomerService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.flag = false;
            $('#customer a').click(function (e) {
                e.preventDefault();
                if($(this).context.attributes.href.value=='#person'){
                    $scope.flag=false;
                    $scope.columns = CustomerService.getSchema();
                }
                if($(this).context.attributes.href.value=='#company'){
                    $scope.flag=true;
                    $scope.columns = CustomerService.getSchemaView();
                }
                $(this).tab('show');
                $scope.$apply();
            });
            //ng-table about

            $scope.columns = CustomerService.getSchema();
            $scope.sort = CustomerService.getSort();
            $scope.order = CustomerService.getOrder();
            $scope.pageable = CustomerService.getPageable();



            //method of fetch list data
            $scope.list = function () {
                if($scope.flag == false){
                    CustomerService.listWithPost().$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                }else {
                    CustomerService.listWithPostCompany().$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                }
            };
            var gotoFirstPage = function () {
                CustomerService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CustomerService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CustomerService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CustomerService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CustomerService.setOrder(newValue);
                $scope.list();
            });

            //跳转页面并传递参数
            $scope.create = function () {
                $location.path("/demandCustomer/view.html").search({});
            };
            $scope.search = function () {
                CustomerService.putSearchParams(
                    {
                        name: $scope.condition.key
                    }
                );
                gotoFirstPage();
            };
            CustomerService.clearSearchParams();

            $scope.view = function () {
                if($scope.flag == false){
                    $location.path("/customer/view.html").search({});
                }else {
                    $location.path("/company/view.html").search({});
                }
            };
        }
    ]
);