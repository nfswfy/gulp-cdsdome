/**
 * Created by zzz
 */
(function (angular) {
    function OfferService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: 'offerDate', label: '报价时间', sortable: false},
            {name: 'offerName',label: '报价单名称', sortable: false, type: 'template', templateUrl: "menuTitle.html"},
            {name: 'communicationPerson', label: '报价单来源', sortable: false},
            {name: 'communicationType',label: '报价金额', sortable: false},
            {name: 'createTime',label: '报价人', sortable: false},
            {name: 'createTime',label: '报价方式', sortable: false}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.demandManager.offerUrl, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'createdDate';
        this._order = 'desc';
    }

    OfferService.prototype = Object.create(BaseListService.prototype);
    OfferService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('OfferService', OfferService);
})(angular);

