/**
 * Created by zzz
 */
(function (angular) {
    function InformationService($resource, $q, $http, UrlConfigService) {

        BaseListService.call(this, UrlConfigService.urlConfig.information.url, $resource, $q, $http, "");

        this._infoUrl= UrlConfigService.urlConfig.information.infoUrl;
        this._saveDetailUrl = UrlConfigService.urlConfig.information.saveDetailUrl;
        this._saveRealNameUrl = UrlConfigService.urlConfig.information.saveRealNameUrl;
        this._saveQualificationsUrl = UrlConfigService.urlConfig.information.saveQualificationsUrl;
        this._savePhotoUrl = UrlConfigService.urlConfig.information.savePhotoUrl;
        this._qualificationsIdUrl = UrlConfigService.urlConfig.information.qualificationsIdUrl;

        this.getInfo = function (id) {
            return this.$resource(this._infoUrl).get({customerId: id});
        };
        this.get = function (id) {
            return this.$resource(this._qualificationsIdUrl).get({customerId: id});
        };

        this.save = function (model) {
                return this.$resource(this._saveDetailUrl, {id: model.id}, {
                    'update': {method: 'PUT'}
                }).update({id: model.id}, model);
        };
        this.saveRealName = function (model) {
            return this.$resource(this._saveRealNameUrl, {id: model.id}, {
                'update': {method: 'PUT'}
            }).update({id: model.id}, model);
        };
        this.saveQualifications = function (model) {
            return this.$resource(this._saveQualificationsUrl, {id: model.id}, {
                'update': {method: 'PUT'}
            }).update({id: model.id}, model);
        };

        //this.checkListWithPost = function () {
        //    var service = this;
        //    var queryMap = {page: this._storedPage, size: this._pageable.size};
        //    // 带汉字的检索，用post请求，固定加“/s“
        //    var resource = this.$resource(this._checklistUrl + "/s",queryMap);
        //    if (this._s_search) {
        //        for (var k in this._s_search) {
        //            if (this._s_search.hasOwnProperty(k)){
        //                if(this._s_search[k]){
        //                    queryMap['s_' + k] = this._s_search[k];
        //                }
        //            }
        //        }
        //    }
        //    queryMap.sort = service.getSortAndOrder();
        //    return resource.save(queryMap);
        //};
        //
        //
        //this.online = function (id) {
        //    var resource = $resource(this._onlineUrl, {id: id}, {"online": {"method": "PUT"}});
        //    return resource.online();
        //};
        //
        //this.check = function (id) {
        //    var resource = $resource(this._checkUrl, {id: id}, {"check": {"method": "POST"}});
        //    return resource.check();
        //};
        //this.agree = function (id) {
        //    var resource = $resource(this._agreeUrl, {id: id}, {"agree": {"method": "POST"}});
        //    return resource.agree();
        //};
        //
        //this.reject = function (id, rejectDescription) {
        //    return this.$resource(this._rejectUrl, {id: id}, {"reject": {"method": "PUT"}}).reject({id: id}, rejectDescription);
        //};
        //
        //this.offline = function (id) {
        //    var resource = $resource(this._offlineUrl, {id: id}, {"offline": {"method": "PUT"}});
        //    return resource.offline();
        //};
    }

    InformationService.prototype = Object.create(BaseListService.prototype);
    InformationService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('InformationService', InformationService);
})(angular);

