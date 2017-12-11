/**
 * Created by zzz
 */
(function (angular) {
    function CustomerService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'customerName',label: '客户名称', sortable: false, type: 'template', templateUrl: "menuTitle.html"},
            {name: 'field', label: '行业领域', sortable: false},
            {name: 'orderNumber',label: '需求数量', sortable: false},
            {name: 'contactWay',label: '联系方式', sortable: false},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];
        var _schemaCompany = [
            {name: '', label: '序号', type: "seq"},
            {name: 'companyName',label: '企业名称', sortable: false, type: 'template', templateUrl: "menuTitle.html"},
            {name: 'field', label: '行业领域', sortable: false},
            {name: 'orderNumber',label: '需求数量', sortable: false},
            {name: 'contactWay',label: '联系方式', sortable: false},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.customer.customerUrl, $resource, $q, $http, _schema);
        this._companyUrl = UrlConfigService.urlConfig.customer.companyUrl;
        this._schema = _schema;
        this._schemaCompany = _schemaCompany;
        this._sort = 'createdDate';
        this._order = 'desc';
        this.getSchemaView = function () {
            return this._schemaCompany;
        };
        this.listWithPostCompany = function () {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._companyUrl + "/s",queryMap);
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

    CustomerService.prototype = Object.create(BaseListService.prototype);
    CustomerService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('CustomerService', CustomerService);
})(angular);

