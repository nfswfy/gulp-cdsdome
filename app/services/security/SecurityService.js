/**
 * Created by zzz
 */
(function (angular) {
    function SecurityService($resource, $q, $http, UrlConfigService) {
        var _schema = [
           /* {name: 'name', label: '节点名称', sortable: false,width:"20%"},
            {name: 'status', label: '启用状态', sortable: false,width:"112px",align:"text-center", filter: "ServerStatusFilter"},
            {name: 'ipAddress', label: '服务器IP地址', sortable: false,width:"112px",align:"text-center", filter: "ipAddressFilter"},
            {name: 'approveStep', label: '审核状态', sortable: false, filter: "ApproveStatusFilter",width:"112px",align:"text-center"},
            {label: '操作', sortable: false, width:"60px", type: 'template', templateUrl: 'operation.html'}*/
        ];
        var _schemaCheck = [
            /*{name: 'name', label: '节点名称', sortable: false,width:"20%"},
            {name: 'applicantOrg', label: '提交组织', sortable: false,width:"20%"},
            {name: 'status', label: '状态', sortable: false,width:"112px",align:"text-center", filter: "ServerStatusFilter"},
            {name: 'commitTime', label: '提交时间',filter: "timestampToMinutes", sortable: false,width:"130px",align:"text-center"},
            {name: 'approveStep', label: '审核状态', sortable: false, filter: "ApproveStatusFilter",width:"112px",align:"text-center"},
            {name: 'approval', label: '审核人', sortable: false,width:"112px",align:"text-center"},
            {label: '操作', sortable: false, width:"60px", type: 'template', templateUrl: 'operation.html'}*/
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.company.url, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._schemaCheck = _schemaCheck;
        this._sort = 'createdDate';
        this._order = 'desc';
        //this._getOrganizationUrl = UrlConfigService.urlConfig.node.getOrganizationUrl;
        //this._checkUrl = UrlConfigService.urlConfig.node.checkUrl;
        //this._agreeUrl = UrlConfigService.urlConfig.node.agreeUrl;
        //this._deleteUrl = UrlConfigService.urlConfig.node.deleteUrl;
        //this._rejectUrl = UrlConfigService.urlConfig.node.rejectUrl;
        //this._getServerUrl = UrlConfigService.urlConfig.node.getServerUrl;
        //this._onlineUrl = UrlConfigService.urlConfig.node.onlineUrl;
        //this._offlineUrl = UrlConfigService.urlConfig.node.offlineUrl;
        //this._checklistUrl = UrlConfigService.urlConfig.node.checkListUrl;
        //
        //this.getServer = function () {
        //    var resource = $resource(this._getServerUrl);
        //    return resource.get();
        //};
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

    SecurityService.prototype = Object.create(BaseListService.prototype);
    SecurityService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('SecurityService', SecurityService);
})(angular);

