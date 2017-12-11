/**
 * Created by zhoujie on 2017/11/9.
 */
(function (angular) {
    function WbsService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: 'id', label: '序号', sortable: false, width:"150px"},
            {name: 'name', label: '工作包名称', sortable: false,width:"30%",type: 'template', templateUrl: "viewName.html"},
            {name: 'wbsType', label: '发包形式', sortable: false,width:"112px",align:"text-center"},
            {name: 'bidTime', label: '投标时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'bidAmount', label: '投标金额（元）', sortable: false,width:"112px",align:"text-center"},
            {name: 'projectStatus', label: '状态', sortable: false, width:"150px"},
            {label: '操作', sortable: false, width:"60px", type: 'template', templateUrl: 'operation.html'}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.wbs.url, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'id';
        this._order = 'desc';


    }

    WbsService.prototype = Object.create(BaseListService.prototype);
    WbsService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('WbsService', WbsService);
})(angular);