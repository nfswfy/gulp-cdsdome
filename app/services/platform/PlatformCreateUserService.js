/**
 * Created by zzzy on 2017/9/6.
 */
(function (angular) {
    function PlatformCreateUserService($resource, $q, $http, UrlConfigService) {

        this._sort = '';
        this._order = '';
        this._listUrl = UrlConfigService.urlConfig.organization.organizationListUrl;
        this._createAdminUrl=UrlConfigService.urlConfig.organization.createAdmin;
        this._allRoleListUrl=UrlConfigService.urlConfig.organization.allRoleListUrl;
        this._orgRoleListUrl=UrlConfigService.urlConfig.organization.orgRoleListUrl;
        this._logUrl=UrlConfigService.urlConfig.organization.logUrl;

        BaseListService.call(this, this._listUrl, $resource, $q, $http);

        this.get = function (id) {
            return $resource(this._listUrl + "/" + id).get();
        };
        this.getOrgList= function (id) {
            return $resource(this._listUrl).get();
        };
        this.getAll = function () {
            return $resource(this._allRoleListUrl).get();
        };
        this.getOrgRole = function () {
            return $resource(this._orgRoleListUrl).get();
        };

        this.saveNew = function (model) {
            if (undefined !== model.id) {
                return this.$resource(this._createAdminUrl, {id: model.id}, {
                    'update': {method: 'PUT'}
                }).update({id: model.id}, model);
            } else {
                return this.$resource(this._createAdminUrl).save(model);
            }

        };
        this.getUser=function (id) {
            return $resource(this._createAdminUrl ,{id: id}).get();
        }


    }

    PlatformCreateUserService.prototype = Object.create(BaseListService.prototype);
    PlatformCreateUserService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('PlatformCreateUserService', PlatformCreateUserService);
})(angular);