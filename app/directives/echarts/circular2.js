/**
 * Created by 胡状状 on 2017/10/10.
 */
/**
 * Created by huzz on 2017/10/9.
 * 环形图
 */
'use strict';
angular.module("MetronicApp").directive('echartsCircular2', function () {
    return {
        scope: {
            id: "@",
            title: "=",
            data: "=",
            total: "=",
            centerName: "="
        },
        restrict: 'E',
        template: '<div style="height:200px;width: 500px;"></div>',
        replace: true,
        link: function ($scope, element, attrs, controller) {
            function getOptioin(data) {
                var legend = _.map($scope.data, function (item) {
                    return item['name'];
                });
                $scope.arr = {};
                var legends = _.map($scope.data, function (item)  {
                    var percent = (100*item['value']/$scope.total).toFixed(2); //保留两位小数
                    $scope.arr = {
                        "percent":percent + '%',
                        "value": item['value'],
                        "name": item['name']
                    };
                    return $scope.arr;
                });

                var option = {
                    tooltip: {
                        trigger: "item",
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: "vertical",
                        right: 10,
                        bottom: 20,
                        x:280,
                        y:40,
                        formatter: function (params) {
                            var temps = legends;
                            var num;
                            for(var i = 0; i<temps.length; i++){
                                if(temps[i].name == params){
                                    num = i;
                                    break;
                                }
                            }
                            return  temps[num].percent + "(" + temps[num].value + ")  " + params;
                        },
                        data:legend,
                        icon:'circle'
                    },
                    series: [
                        {
                            type:'pie',
                            radius: ['80%', '100%'],
                            center:[100,100], //设置圆心的位置,即改变图的位置
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
