var Index = function() {

  return {

    //main function
    init: function() {
      Metronic.addResizeHandler(function() {});

      var myChart = echarts.init(document.getElementById('site_statistics'));
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            areaStyle: {
              normal: {}
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      };
      myChart.setOption(option);

      var myChart1 = echarts.init(document.getElementById('site_activities'));
      option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['北京', '天津', '上海', '广东', '山西', '山东', '陕西']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      };

      myChart1.setOption(option);

    }
  };

}();
