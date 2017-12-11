/**
 * Created by zhoujie on 2017/11/9.
 */
/**
 * Created by zhoujie on 2017/11/7.
 */
(function (angular) {
    function WbsViewService($resource, $q, $http, UrlConfigService) {
        var _Schema = [
            {name: 'id', label: '序号', sortable: false, width:"150px"},
            {name: 'name', label: '交付物名称', sortable: false,width:"30%"},
            {name: 'contractDate', label: '交付物格式', sortable: false,width:"112px",align:"text-center"},
            {name: 'projectActualEndTime', label: '说明', sortable: false,width:"112px",align:"text-center"}
        ];
        var _costSchema = [
            {name: 'id', label: '序号', sortable: false, width:"150px"},
            {name: 'name', label: '成本项', sortable: false,width:"30%"},
            {name: 'totalProject', label: '金额（元）', sortable: false, width:"150px",align:"text-center"},
            {name: 'projectStatus', label: '说明', sortable: false, width:"150px"},
        ];
        var _pointSchema = [
            {name: 'id', label: '序号', sortable: false, width:"150px"},
            {name: 'name', label: '审核时间', sortable: false,width:"30%"},
            {name: 'contractDate', label: '审查点', sortable: false,width:"112px",align:"text-center"},
            {name: 'projectActualEndTime', label: '审核要求', sortable: false,width:"112px",align:"text-center"}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.wbs.requestUrl, $resource, $q, $http, _Schema);
        this._schema = _Schema;
        this._sort = 'id';
        this._order = 'desc';

        this.getCostSchema = function(){
            return  _costSchema;
        };
        this.getPointSchema = function(){
            return  _pointSchema;
        };



        this._getAllUrl = UrlConfigService.urlConfig.wbs.getAllUrl;
        this.get = function (id) {
            return this.$resource(this._getAllUrl).get();
        };
        this._costUrl = UrlConfigService.urlConfig.wbs.costUrl;
        this.getCostList = function (id) {
            return $resource(this._costUrl, {id: id}, {getCostList: {method: 'PUT'}}).getCostList();
        };
        this._pointUrl = UrlConfigService.urlConfig.wbs.pointUrl;
        this.getPointList = function (id) {
            return $resource(this._pointUrl, {id: id}, {getPointList: {method: 'PUT'}}).getPointList();
        };

        this.getBusinessList = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this.listUrl);
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)){
                        if(this._s_search[k]){
                            queryMap['s_' + k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };





    }

    WbsViewService.prototype = Object.create(BaseListService.prototype);
    WbsViewService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('WbsViewService', WbsViewService);
})(angular);