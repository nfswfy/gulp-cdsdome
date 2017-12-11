/**
 *  折线
 */
'use strict';
angular.module("MetronicApp").directive('echartsLine', function () {
    return {
        scope: {
            id: "@",
            title: "=",
            name: "=",
            data: "="
        },
        restrict: 'A',
        replace: true,
        link: function ($scope, element, attrs, controller) {
            function getOptioin(data) {
                var legend = _.map($scope.data, function (item) {
                    return item['name'];
                });
                var xData = [];
                var yData = [];
                if (data != null) {
                    angular.forEach(data,function (row) {
                        xData.push(row.statisticsDate);
                        yData.push(row.successDataSizeToday);
                    });
                }

                var option = {
                    title: {
                        text:$scope.name
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:$scope.name,
                            type:'line',
                            stack: '总量',
                            data:yData
                        }
                    ]
                };

                return option;
            }

            var myChart = echarts.init(document.getElementById($scope.id), 'macarons');
            // myChart.setOption(getOptioin($scope.data));

            $scope.$watch('data', function (newVal, oldVal) {
                myChart.setOption(getOptioin(newVal));
            });
        }
    };
});

