/**
 * Created by zzz
 */
(function (angular) {
    function DemandManagerService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'orderUrgency', label: '紧急', sortable: false},
            {name: 'assignTime', label: '指派日期', sortable: false},
            {name: 'orderBrief',label: '需求简介', sortable: false, type: 'template', templateUrl: "orderBrief.html"},
            {name: 'orderNumber',label: '需求号', sortable: false},
            {name: 'customer',label: '客户', sortable: false, type: 'template', templateUrl: "customer.html"},
            {name: 'projectStart',label: '项目开始', sortable: false},
            {name: 'projectDate', label: '项目周期', sortable: false},
            {name: 'projectTotal', label: '项目总额(万)', sortable: false},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];
        var _schemaOther = [
            {name: '', label: '序号', type: "seq"},
            {name: 'assignTime', label: '指派日期', sortable: false},
            {name: 'orderBrief',label: '需求简介', sortable: false, type: 'template', templateUrl: "menuTitle.html"},
            {name: 'orderNumber',label: '需求号', sortable: false},
            {name: 'customer',label: '客户', sortable: false},
            {name: 'projectStart',label: '项目开始', sortable: false},
            {name: 'projectDate', label: '项目周期', sortable: false},
            {name: 'projectTotal', label: '项目总额(万)', sortable: false}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.demandManager.url, $resource, $q, $http, _schema);
        this._winUrl = UrlConfigService.urlConfig.demandManager.winUrl;
        this._defeatUrl = UrlConfigService.urlConfig.demandManager.defeatUrl;
        this._schema = _schema;
        this._schemaOther = _schemaOther;
        this._sort = 'createdDate';
        this._order = 'desc';
        this.getSchemaOther = function () {
            return this._schemaOther;
        };
        this.listWithPostWin = function () {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._winUrl + "/s",queryMap);
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
            return resource.save(queryMap);
        };
        this.listWithPostDefeat = function () {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._defeatUrl + "/s",queryMap);
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
            return resource.save(queryMap);
        };
    }

    DemandManagerService.prototype = Object.create(BaseListService.prototype);
    DemandManagerService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('DemandManagerService', DemandManagerService);
})(angular);

