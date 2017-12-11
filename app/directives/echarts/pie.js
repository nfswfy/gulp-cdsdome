/**
 *  折线图
 */
'use strict';
angular.module("MetronicApp").directive('echartsPie', function () {
    return {
        scope: {
            id: "@",
            title: "=",
            data: "="
        },
        restrict: 'E',
        template: '<div style="height:400px;"></div>',
        replace: true,
        link: function ($scope, element, attrs, controller) {
            function getOptioin(data) {
                var legend = _.map($scope.data, function (item) {
                    return item['name'];
                });

                var option = {
                    title: {
                        x: "center",
                        y: "top",
                        text: $scope.title
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: "horizontal",
                        x: "center",
                        data: legend,
                        y: "bottom"
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {
                                show: true
                            },
                            dataView: {
                                show: true,
                                readOnly: true
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    calculable: true,
                    series: [
                        {
                            name: "数量",
                            type: "pie",
                            radius: "50%",
                            center: ["50%", "50%"],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: "{b}"
                                    },
                                    borderWidth: 0
                                }
                            },
                            data: data,
                            selectedMode: "multiple"
                        }
                    ]
                };

                return option;
            }

            var myChart = echarts.init(document.getElementById($scope.id), 'macarons');
            myChart.setOption(getOptioin($scope.data));

            $scope.$watch('data', function (newVal, oldVal) {
                myChart.setOption(getOptioin(newVal));
            });
        }
    };
});

