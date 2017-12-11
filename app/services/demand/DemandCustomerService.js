/**
 * Created by zzz
 */
(function (angular) {
    function DemandCustomerService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq", width: 20,align:"text-center"},
            {name: 'orderBrief',label: '需求简介', sortable: false, type: 'template', templateUrl: "view.html"},
            {name: 'publishTime', label: '发布日期', sortable: false ,filter:"timestampToDate",align:"text-center"},
            {name: 'orderNumber',label: '需求号', sortable: false},
            {name: 'acceptTime',label: '受理日期', sortable: false ,filter:"timestampToDate",align:"text-center"},
            {name: 'orderStatus', label: '流程', sortable: false,align:"text-center"},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];
        var _schemaView = [
            {label: '序号', type: "seq", width: 20,align:"text-center"},
            {name: 'norm',label: '规格', sortable: false},
            {name: 'specification', label: '说明', sortable: false}
        ];
        this.url = UrlConfigService.urlConfig.demandCustomer.url +"?orderTabType=PENDING&role=CUSTOMER";
        BaseListService.call(this, "", $resource, $q, $http, _schema);
        this._getUrl = UrlConfigService.urlConfig.demandCustomer.getUrl;
        this._closeUrl = UrlConfigService.urlConfig.demandCustomer.closeUrl;
        //需求完善
        this._improveUrl = UrlConfigService.urlConfig.demandCustomer.improveUrl;
        //需求补充列表
        this._complementUrl = UrlConfigService.urlConfig.demandCustomer.complementUrl;
        //需求细化列表
        this._orderRefinement = UrlConfigService.urlConfig.demandCustomer.refinementUrl;
        //发布需求
        this._publishUrl = UrlConfigService.urlConfig.demandCustomer.publishUrl;
        this._schema = _schema;
        this._schemaView = _schemaView;
        this._sort = 'createTime';
        this._order = 'desc';
        this.getSchemaView = function () {
            return this._schemaView;
        };
        //发布操作
        this.savePublish = function (model) {
            if (undefined !== model.orderId) {
                return this.$resource(this._publishUrl, {orderId: model.orderId}, {
                    'update': {method: 'PUT'}
                }).update({orderId: model.orderId}, model);
            } else {
                return this.$resource(this._publishUrl).save(model);
            }

        };

        this.update = function (id, model) {
            return $resource(this._publishUrl, {orderId: id}, {
                'update': {method: 'PUT'}
            }).update({orderId: id}, model);
        };
        //关闭操作
        this.save = function (model) {
            if (undefined !== model.orderId) {
                return this.$resource(this._closeUrl, {orderId: model.orderId}, {
                    'update': {method: 'PUT'}
                }).update({orderId: model.orderId}, model);
            } else {
                return this.$resource(this._closeUrl).save(model);
            }

        };

        this.update = function (id, model) {
            return $resource(this._closeUrl, {orderId: id}, {
                'update': {method: 'PUT'}
            }).update({orderId: id}, model);
        };
        //原始需求
        this.get = function (id) {
            return this.$resource(this._getUrl).get({orderId: id});
        };
        //需求完善
        this.getImprove = function (id) {
            return this.$resource(this._improveUrl).get({orderId: id});
        };
        this.list = function (id) {
            var service = this;
            var resource = this.$resource(this.url);
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)){
                        if(this._s_search[k]){
                            queryMap[k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };
        this.listComplement = function (id) {
            var service = this;
            var resource = this.$resource(this._complementUrl + "?orderId=" + id);
            var queryMap = {page: this._storedPage, size: this._pageable.size};
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
        this.listRefinement = function (id) {
            var service = this;
            var resource = this.$resource(this._orderRefinement + "?orderId=" + id);
            var queryMap = {page: this._storedPage, size: this._pageable.size};
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

    DemandCustomerService.prototype = Object.create(BaseListService.prototype);
    DemandCustomerService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('DemandCustomerService', DemandCustomerService);
})(angular);

