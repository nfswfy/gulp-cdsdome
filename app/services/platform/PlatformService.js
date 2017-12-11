/**
 * Created by zzzy on 2017/9/6.
 */
(function (angular) {
    function PlatformService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'userName', label: '用户名称', sortable: false},
            {name: 'userDescription', label: '用户描述', sortable: false},
            {name: 'roleName',filter:'role',label: '管理员', sortable: false},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];

        this._schema = _schema;
        this._sort = '';
        this._order = '';
        this._url = UrlConfigService.urlConfig.organization.userListUrl;
        this._organizationUrl=UrlConfigService.urlConfig.organization.organizationUrl;
        BaseListService.call(this,this._url, $resource, $q, $http, _schema);
        this.get = function (id) {
            return this.$resource(this._organizationUrl).get({id: id});
        };


    }

    PlatformService.prototype = Object.create(BaseListService.prototype);
    PlatformService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('PlatformService', PlatformService);
})(angular);