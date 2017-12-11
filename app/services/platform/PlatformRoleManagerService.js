/**
 * Created by zzzy on 2017/9/16.
 */
(function (angular) {
    function PlatformRoleManagerService($resource, $q, $http, UrlConfigService) {

        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'name', label: '用户名称', sortable: false},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];

        this._schema = _schema;
        this._sort = '';
        this._order = '';
        this._url = UrlConfigService.urlConfig.platform.roleManager;
        this._roleIdsurl = UrlConfigService.urlConfig.platform.getRoleIds;
        this._setRoleUrl = UrlConfigService.urlConfig.platform.setRole;
        this._userListUrl = UrlConfigService.urlConfig.platform.userList;

        BaseListService.call(this,this._url, $resource, $q, $http,_schema);
        this.get = function () {
            return this.$resource(this._url).get();
        };
        this.getRoleIds = function () {
            return this.$resource(this._roleIdsurl).get();
        };
        this.delete = function (userId,roleId) {
            var resource = this.$resource(this._setRoleUrl, {userId: userId,roleId:roleId});
            return resource.delete();
        };
        this.chooseUser= function (userId,roleId) {
            var resource = this.$resource(this._setRoleUrl, {userId: userId,roleId:roleId},{
                'create': {method: 'POST'}
            });
            return resource.create();
        };
        this.list = function () {
            var service = this;
            var resource = this.$resource(this._userListUrl);
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

    PlatformRoleManagerService.prototype = Object.create(BaseListService.prototype);
    PlatformRoleManagerService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('PlatformRoleManagerService', PlatformRoleManagerService);
})(angular);