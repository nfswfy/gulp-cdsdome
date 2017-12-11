/**
 * Created by x on 2017/11/23.
 *
 * 敏感词管理service
 */
(function (angular) {
    function AntispamWordService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', sortable: false, width:"50px", type:"seq"},
            {name: 'word', label: 'word', sortable: true,width:"150px"},
            {name: 'wordLevel', label: '词等级', sortable: false,  align:"text-left"}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.antispamWord.url, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'id';
        this._order = 'desc';

        this._getAllUrl = UrlConfigService.urlConfig.account.getAllUrl;
        this.get = function (id) {
            return this.$resource(this._getAllUrl).get();
        };


    }

    AntispamWordService.prototype = Object.create(BaseListService.prototype);
    AntispamWordService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('AntispamWordService', AntispamWordService);
})(angular);