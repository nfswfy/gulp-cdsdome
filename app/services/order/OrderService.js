/**
 * Created by ningyuxue on 2017/10/27.
 */
/**
 * Created by zzzy on 2017/9/6.
 */
(function (angular) {
    function OrderService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'orderName', label: '需求名称', sortable: false},
            {name: 'orderSource', label: '需求来源', sortable: false},
            {name: 'orderInfo',filter:'role',label: '需求简述', sortable: false},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];

        this._schema = _schema;
        this._sort = '';
        this._order = '';
        BaseListService.call(this,this._url, $resource, $q, $http, _schema);



    }

    OrderService.prototype = Object.create(BaseListService.prototype);
    OrderService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('OrderService', OrderService);
})(angular);