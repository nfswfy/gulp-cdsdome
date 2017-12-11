/**
 * Created by zhoujie on 2017/11/8.
 */
(function (angular) {
    function AccountService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: 'id', label: '序号', sortable: false, width:"150px"},
            {name: 'contractName', label: '合同名称', sortable: false,width:"15%",type: 'template', templateUrl: "viewContractName.html"},
            {name: 'contractAccount', label: '合同额（万）', sortable: false,width:"112px",align:"text-center"},
            {name: 'contractStartTime', label: '合同开始', sortable: false,width:"112px",align:"text-center"},
            {name: 'contractEndTime', label: '合同结束', sortable: false,width:"112px",align:"text-center"},
            {name: 'collectionTimes', label: '收款阶段', sortable: false, width:"150px",align:"text-center",templateUrl: 'evaluate.html'},
            {name: 'stageAccount', label: '阶段收款（万）', sortable: false, width:"150px",align:"text-center"},
            {name: 'stageTime', label: '阶段收款时间', sortable: false, width:"150px"},
            {name: 'arrivalStatus', label: '到账状态', sortable: false, width:"150px"}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.account.url, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'id';
        this._order = 'desc';

        this._getAllUrl = UrlConfigService.urlConfig.account.getAllUrl;
        this.get = function (id) {
            return this.$resource(this._getAllUrl).get();
        };


    }

    AccountService.prototype = Object.create(BaseListService.prototype);
    AccountService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('AccountService', AccountService);
})(angular);