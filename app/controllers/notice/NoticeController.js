
angular.module("MetronicApp").controller('NoticeListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'NoticeService',
        function ($rootScope, $scope, $location, $uibModal, toastr, NoticeService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            //ng-table about
            $scope.columns = NoticeService.getSchema();
            // $scope.columns2 = NoticeService.getSchemaMail();
            $scope.columns3 = NoticeService.getSchemaReceive();
            // $scope.columns3 = NoticeService.getSchemaMail();
            $scope.columns4 = NoticeService.getSchemaSend();
            // $scope.columns4 = NoticeService.getSchemaMail();


            $scope.sort = NoticeService.getSort();
            $scope.order = NoticeService.getOrder();
            $scope.pageable = NoticeService.getPageable();
            $scope.currentTab = 'email';
            $scope.checkTab = 'receive';

            $scope.clickMail = function () {
                $scope.currentTab = 'mail';
            }

            $scope.clickEmail = function () {
                $scope.currentTab = 'email';
            }

            $scope.receiveMail = function(){
                $scope.checkTab = 'receive';
            }
            $scope.sendMail = function () {
                $scope.checkTab = 'send';
            }


            //method of fetch list data

            $scope.list = function () {
                NoticeService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            var gotoFirstPage = function () {
                NoticeService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                NoticeService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                NoticeService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                NoticeService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                NoticeService.setOrder(newValue);
                $scope.list();
            });

            //跳转页面并传递参数
            $scope.back = function () {
                $location.path("/notice/list.html").search({});
            };
            $scope.emailCreate = function () {
                $location.path("/notice/emailcreate.html").search({});
            };
            $scope.mailCreate = function () {
                $location.path("/notice/mailcreate.html").search({});
            };

            $scope.view = function (id) {
                if($scope.currentTab=='mail'){
                    if($scope.checkTab=='receive'){
                        $location.path("/notice/view.html").search({'id':id,'currentTab':'mail','checkTab':'receive'});
                    }
                    if($scope.checkTab=='send'){
                        $location.path("/notice/view.html").search({'id':id,'currentTab':'mail','checkTab':'send'});
                    }


                }
                if($scope.currentTab=='email'){
                    $location.path("/notice/view.html").search({'id':id,'currentTab':'email'});
                }
            }

            $scope.reply = function (id) {
                if($scope.currentTab=='mail'){
                    $location.path("/notice/reply.html").search({'id':id,'currentTab':'mail'});
                }
                if($scope.currentTab=='email'){
                    $location.path("/notice/reply.html").search({'id':id,'currentTab':'email'});
                }
            }



            // NoticeService.get($scope.sender).$promise.then(function (result) {
            //     $scope.model = result;
            // });
            // NoticeService.get($scope.receiver).$promise.then(function (result) {
            //     $scope.model = result;
            // });

            $scope.list = function () {
                if ($scope.flag) {
                    //企业客户
                    NoticeService.getSendedMessageListUrl($scope.sender).$promise.then(function (result) {
                        //storage page state
                        $scope.rowsReceive = result.data;
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                } else {
                    //个人客户
                    NoticeService.getReceivededMessageListUrl($scope.receiver).$promise.then(function (result) {
                        $scope.rowsSend = result.data;
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        //storage page state
                    });
                }

            };




            $scope.search = function () {
                NoticeService.putSearchParams(
                    {
                        name: $scope.condition.key,
                        approveStep: $scope.condition.approveStep
                    }
                );
                gotoFirstPage();
            };
        }
    ]
).controller('NoticeEditController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', 'NoticeService',
        function ($rootScope, $scope, $location, toastr, EnumService, NoticeService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.back = function () {
                $location.path("/notice/list.html").search({});
            };


        }
    ]
).controller('NoticeViewController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', 'NoticeService',
        function ($rootScope, $scope, $location, toastr, EnumService, NoticeService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            $scope.currentTab = $location.search().currentTab;
            $scope.checkTab = $location.search().checkTab;
            $scope.replyOne = function () {
                $location.path("/notice/reply.html").search({});
            };

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.back = function () {
                $location.path("/notice/list.html").search({});
            };

        }
    ]
).controller('NoticeReplyController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', 'NoticeService',
        function ($rootScope, $scope, $location, toastr, EnumService, NoticeService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            $scope.currentTab = $location.search().currentTab;

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.back = function () {
                $location.path("/notice/list.html").search({});
            };
        }
    ]
)