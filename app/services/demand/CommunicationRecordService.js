/**
 * Created by zzz
 */
(function (angular) {
    function CommunicationRecordService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'mainContent',label: '沟通内容', sortable: false, type: 'template', templateUrl: "menuTitle.html"},
            {name: 'communicationPerson', label: '沟通人', sortable: false},
            {name: 'communicationType',label: '沟通方式', sortable: false},
            {name: 'createTime',label: '沟通时间', sortable: false}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.demandManager.recordUrl, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'createdDate';
        this._order = 'desc';
    }

    CommunicationRecordService.prototype = Object.create(BaseListService.prototype);
    CommunicationRecordService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('CommunicationRecordService', CommunicationRecordService);
})(angular);

