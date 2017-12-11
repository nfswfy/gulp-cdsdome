'use strict';
angular.module("MetronicApp").directive('ngCheckbox', function () {
    return {
        templateUrl: 'app/directives/ngCheckbox/template.html',
        restrict: 'EA',
        scope: {
            name: '=',
            englishname: '=',
            rows: '=',
            manual: '=',
            allbtn: '=',
        },
        replace: true,
        link: function ($scope, $element, $attrs) {

        },
        controller: ['$scope', '$location', function ($scope, $location) {

            $scope.allSelected = {};
            $scope.judgeAll = {};
            $scope.cssType = {};
            $scope.allSelected[$scope.englishname] = [];
            $scope.judgeAll[$scope.englishname] = false;
            $scope.cssType[$scope.englishname] = false;

            //点击其他span
            $scope.change = function (index) {
                var judge = false;
                for (var i = 0; i < $scope.allSelected[$scope.englishname].length; i++) {
                    if ($scope.rows[index].key == $scope.allSelected[$scope.englishname][i]) {
                        $scope.allSelected[$scope.englishname].splice(i, 1);
                        $scope.rows[index].cssType = false;
                        judge = true;
                        break;
                    }
                }
                if (judge == false) {
                    $scope.allSelected[$scope.englishname].push($scope.rows[index].key);
                    $scope.rows[index].cssType = true;
                }
                $scope.$parent.allSelected[$scope.englishname] = $scope.allSelected[$scope.englishname];
                if ($scope.rows.length == $scope.allSelected[$scope.englishname].length) {
                    $scope.judgeAll[$scope.englishname] = true;
                    $scope.cssType[$scope.englishname] = true;
                }else {
                    $scope.judgeAll[$scope.englishname] = false;
                    $scope.cssType[$scope.englishname] = false;
                }
            }

            //点击全选span
            $scope.clickAll = function () {
                if ($scope.judgeAll[$scope.englishname] == true) {
                    $scope.allSelected[$scope.englishname] = [];
                    $scope.judgeAll[$scope.englishname] = false;
                    $scope.cssType[$scope.englishname] = false;
                    $scope.$parent.allSelected[$scope.englishname] = $scope.allSelected[$scope.englishname];
                    angular.forEach($scope.rows, function (x) {
                        x.cssType = false;
                    })
                } else {
                    $scope.allSelected[$scope.englishname] = [];
                    angular.forEach($scope.rows, function (x) {
                        $scope.allSelected[$scope.englishname].push(x.key);
                        x.cssType = true;
                    })
                    $scope.judgeAll[$scope.englishname] = true;
                    $scope.cssType[$scope.englishname] = true;
                    $scope.$parent.allSelected[$scope.englishname] = $scope.allSelected[$scope.englishname];
                }

            }

        }]
    };
});

