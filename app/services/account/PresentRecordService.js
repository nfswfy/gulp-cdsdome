/**
 * Created by zhoujie on 2017/11/8.
 */
/**
 * Created by zhoujie on 2017/11/8.
 */
(function (angular) {
    function PresentRecordService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: 'id', label: '序号', sortable: false, width:"150px"},
            {name: 'contractName', label: '提现日期', sortable: false,width:"15%"},
            {name: 'contractAccount', label: '提现编号', sortable: false,width:"112px",align:"text-center"},
            {name: 'contractStartTime', label: '提现银行', sortable: false,width:"112px",align:"text-center"},
            {name: 'contractEndTime', label: '开户行', sortable: false,width:"112px",align:"text-center"},
            {name: 'collectionTimes', label: '卡号', sortable: false, width:"150px",align:"text-center",templateUrl: 'evaluate.html'},
            {name: 'stageAccount', label: '提现金额（万）', sortable: false, width:"150px",align:"text-center"},
            {name: 'stageTime', label: '余额（万）', sortable: false, width:"150px"},
            {name: 'arrivalStatus', label: '提现状态', sortable: false, width:"150px"}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.account.recordUrl, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'id';
        this._order = 'desc';



    }

    PresentRecordService.prototype = Object.create(BaseListService.prototype);
    PresentRecordService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('PresentRecordService', PresentRecordService);
})(angular);