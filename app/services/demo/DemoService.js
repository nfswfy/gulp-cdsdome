/**
 * Created by ningyuxue on 2017/10/27.
 */
/**
 * Created by zzzy on 2017/9/6.
 */
(function (angular) {
  function DemoService($resource, $q, $http, UrlConfigService) {
    var _schema = [
      {name: '', label: '', type: "checkbox"},
      {name: 'name', label: '资源名称', sortable: false},
      {name: 'hangye', label: '行业与领域', sortable: false},
      {name: 'type', label: '专业与类型', sortable: false},
      {name: 'contact', label: '联系方式', sortable: false},
      {name: 'match', label: '匹配程度', sortable: false}
    ];
    this.url = UrlConfigService.urlConfig.demo.url;
    this._schema = _schema;
    this._sort = '';
    this._order = '';
    BaseListService.call(this, this.url, $resource, $q, $http, _schema);


  }

  DemoService.prototype = Object.create(BaseListService.prototype);
  DemoService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
  angular.module('MetronicApp').service('DemoService', DemoService);
})(angular);