/**
 * Created by zhangsb on 2016/6/8.
 */
(function (angular) {
    function RoleService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'name', label: '角色名称', sortable: false},
            {name: 'description', label: '角色描述', sortable: false},
            {label: '操作', sortable: false, width: 180, type: 'template', templateUrl: 'operation.html'}
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.system.role.url, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'lastModifiedDate';
        this._order = 'desc';
        this._menuTreeUrl = UrlConfigService.urlConfig.system.menu.menuTree;
        this._roleMenuUrl = UrlConfigService.urlConfig.system.role.roleMenus;
        
        this.getMenuTree = function () {
            var resource = $resource(this._menuTreeUrl);
            return resource.get();
        };

        this.getRoleMenus = function (roleId) {
            var resource = $resource(this._roleMenuUrl, {roleId: roleId});
            return resource.get(roleId);
        };

        this.updateRoleMenus = function (id,roleMenus) {
            var resource = $resource(this._roleMenuUrl, {roleId:id}, {'updateRoleMenus': {method: 'PUT'}});
            return resource.updateRoleMenus(roleMenus);
        };
    }

    RoleService.prototype = Object.create(BaseListService.prototype);
    RoleService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('RoleService', RoleService);
})(angular);
