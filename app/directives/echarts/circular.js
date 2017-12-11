/**
 * Created by huzz on 2017/10/9.
 * 环形图
 */
'use strict';
angular.module("MetronicApp").directive('echartsCircular', function () {
    return {
        scope: {
            id: "@",
            title: "=",
            data: "=",
            total: "=",
            centerName: "="
        },
        restrict: 'E',
        template: '<div style="height:200px;width: 200px"></div>',
        replace: true,
        link: function ($scope, element, attrs, controller) {
            function getOptioin(data) {
                var legend = _.map($scope.data, function (item) {
                    return item['name'];
                });

                var option = {
                    tooltip: {
                        show:true,
                        trigger: "item",
                        formatter:"{b}: {c} ({d}%)"

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
                            type:'pie',
                            radius: ['80%', '100%'],
                            avoidLabelOverlap: false,
                            hoverAnimation:false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'default'
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: data,
                            selectedMode: "multiple"
                        },
                        {
                            type: 'pie',
                            clockWise: true,
                            hoverAnimation: false,
                            radius: [100, 100],
                            center: [100,100],
                            silent:true,
                            label: {
                                normal: {
                                    position: 'center'
                                }
                            },
                            data: [{
                                label: {
                                    normal: {
                                        formatter: ""+$scope.total,
                                        textStyle: {
                                            fontFamily: "MicrosoftYaHei-Bold",
                                            fontSize: 36,
                                            color: "#1F2D3D",
                                            align:"center"
                                        }
                                    }
                                }
                            }, {
                                tooltip: {
                                    show: false
                                },
                                label: {
                                    normal: {
                                        formatter: '\n'+ $scope.centerName,
                                        textStyle: {
                                            fontFamily: "MicrosoftYaHei",
                                            fontSize: 14,
                                            color: "#909090"
                                        }
                                    }
                                }
                            }]
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
