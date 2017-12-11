'use strict';
angular.module("MetronicApp").directive('ngList', function () {
    return {
        templateUrl: 'app/directives/ngList/template.html',
        restrict: 'EA',
        scope: {
            half: '=',
            barconfig: '=',
            urlparameters: '=',
            pageable: '=',
            rows: '=',
            notpageable: '='
        },
        replace: true,
        link: function ($scope, $element, $attrs) {

        },
        controller: ['$scope', '$location', function ($scope, $location) {

            $scope.clickOne = function (row, barconfig) {
                var obj = {"id": row.id};
                if($scope.urlparameters){
                    angular.forEach($scope.urlparameters,function (x) {
                        obj[x.key] = x.text;
                    })
                }
                $location.path(barconfig.hoverjump).search(obj);
            }

            var reg = /^[1-9]\d*$/;
            $scope.getPage = function () {
                if (!reg.test($scope.pageable.number1)) {

                } else if (isNaN($scope.pageable.number1)) {
                    $scope.pageable.number = 0;
                } else if ($scope.pageable.number < 0) {
                    $scope.pageable.number = 0;
                } else if ($scope.pageable.number1 > $scope.pageable.totalPages) {
                    $scope.pageable.number = $scope.pageable.totalPages - 1;
                } else {
                    $scope.pageable.number = $scope.pageable.number1 - 1;
                }
            };


            $scope.onActionClick = function (row, parentMethod) {
                if (angular.isFunction($scope.$parent[parentMethod])) {
                    $scope.$parent[parentMethod](row);
                }
            };

            document.onkeydown = function (event) {
                //noinspection JSAnnotator
                var e = event || window.event || arguments.callee.caller.arguments[0];

                if (e && e.keyCode == 13) {//回车
                    $("#goPage").click();
                }
            };

        }]
    };
});

