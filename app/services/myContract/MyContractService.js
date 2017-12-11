(function (angular) {
    function MyContractService($resource, $q, $http, UrlConfigService) {
        //客户，商务经理，
        var _schema = [
            {label: '序号', type: 'seq', sortable: false, width: "20px"},
            {label: '合同名称', sortable: false, type: 'template', templateUrl: 'contractName.html'},
            {name: 'contractName', label: '客户名称', sortable: false, align: "text-center"},
            {name: 'contractAccount', label: '合同额(万)', sortable: false, align: "text-center",filter:'FenZhuanWanFilter'},
            {name: 'contractStartTime', label: '合同开始', sortable: false, align: "text-center"},
            {name: 'contractEndTime', label: '合同结束', sortable: false, align: "text-center"},
        ];

        var _schema2 = [
            {label: '序号', type: 'seq', sortable: false, width: "20px"},
            {name: 'contractNumber', label: '合同编号', sortable: false},
            {name: 'contractName', label: '合同名称', sortable: false},
            {name: 'contractAccount', label: '合同金额(万)', sortable: false, align: "text-center",filter:'FenZhuanWanFilter'},
            {name: 'contractStartTime', label: '合同开始', sortable: false, align: "text-center"},
            {name: 'contractEndTime', label: '合同结束', sortable: false, align: "text-center"},
            {name: 'contractStatus', label: '状态', sortable: false, align: "text-center",filter:'ContractStatusFilter'},
            {label: '操作', sortable: false, width: "60px", type: 'template', templateUrl: 'operation.html'}
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.myContract.listUrl, $resource, $q, $http, _schema);
        this._listUrl = UrlConfigService.urlConfig.myContract.listUrl;
        this._saveUrl = UrlConfigService.urlConfig.myContract.saveUrl;
        this._deleteUrl = UrlConfigService.urlConfig.myContract.deleteUrl;
        this._getUrl = UrlConfigService.urlConfig.myContract.getUrl;
        this._schema = _schema;
        this._schema2 = _schema2;
        this._sort = 'contractStatus';
        this._order = 'desc';
        //编辑按钮查询详情
        this.getOne = function (contractId) {
            return this.$resource(this._getUrl).get({contractId: contractId});
        };
        //删除
        this.delete = function (id) {
            var resource = this.$resource(this._deleteUrl, {id: id});
            return resource.delete();
        };

        //新建或更新
        this.save = function (model) {
            if (undefined !== model.id) {
                return this.$resource(this._saveUrl, {id: model.id}, {
                    'update': {method: 'POST'}
                }).update({id: model.id}, model);
            } else {
                return this.$resource(this._saveUrl).save(model);
            }

        };
        //提交
        this.submit = function (model) {
            if (undefined !== model.id) {
                return this.$resource(this._saveUrl, {id: model.id}, {
                    'update': {method: 'POST'}
                }).update({id: model.id}, model);
            } else {
                return this.$resource(this._saveUrl).save(model);
            }
        };

        this.list = function (contractStatus) {
            var service = this;
            var resource = this.$resource(this._listUrl+'?contractStatus='+contractStatus);
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            console.log(queryMap);
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)){
                        if(this._s_search[k]){
                            queryMap[k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };




        //***********************************客户角色的列表项改变****************************
        //执行中
        this.getCSchemaExecuting = function () {
            var addSchema = [
                {name: 'contractReceipt', label: '已收款(万)', sortable: false, align: "text-center",filter:'FenZhuanWanFilter'},
                {name: 'latestReceiptTime', label: '近期收款日期', sortable: false, align: "text-center"},
                {label: '操作', sortable: false, width: "200px", type: 'template', templateUrl: 'operationB1.html'}
            ];
            return this._schema.concat(addSchema);
        }
        //已终止
        this.getCSchemaTerminated = function () {
            var addSchema = [
                {name: 'contractTerminationTime', label: '终止日期', sortable: false, align: "text-center"},
                {name: 'contractStatus', label: '状态', sortable: false, align: "text-center",filter:'ContractStatusFilter'},
            ];
            return this._schema.concat(addSchema);
        }
        //已中止
        this.getCSchemaAborted = function () {
            var addSchema = [
                {name: 'contractSuspendTime', label: '中止日期', sortable: false, align: "text-center"},
                {name: 'contractStatus', label: '状态', sortable: false, align: "text-center",filter:'ContractStatusFilter'},
            ];
            return this._schema.concat(addSchema);
        }
        //已关闭
        this.getCSchemaClosed = function () {
            var addSchema = [
                {name: 'contractCloseTime', label: '关闭日期', sortable: false, align: "text-center"},
                {name: 'contractStatus', label: '状态', sortable: false, align: "text-center",filter:'ContractStatusFilter'},
            ];
            return this._schema.concat(addSchema);
        }


        //*************************商务经理角色的列表项改变**************************************
        //执行中
        this.getBSchemaExecuting = function () {
            var addSchema = [
                {name: 'contractReceipt', label: '已收款', sortable: false, align: "text-center",filter:'FenZhuanWanFilter'},
                {name: 'latestReceiptTime', label: '近次收款日期', sortable: false, align: "text-center"},
                {label: '操作', sortable: false, width: "200px", type: 'template', templateUrl: 'operationB1.html'}
            ];
            return this._schema.concat(addSchema);
        }
        //待提交
        this.getBSchemaToBeSubmitted = function () {
            var addSchema = [
                {label: '操作', sortable: false, width: "140px", type: 'template', templateUrl: 'operationB2.html'}
            ];
            return this._schema.concat(addSchema);
        }
        //待执行
        this.getBSchemaToBeExecuted = function () {
            var addSchema = [
                {label: '操作', sortable: false, width: "60px", type: 'template', templateUrl: 'operationB3.html'}
            ];
            return this._schema.concat(addSchema);
        }
        //已终止
        this.getBSchemaTerminated = function () {
            var addSchema = [
                {name: 'contractTerminationTime', label: '终止日期', sortable: false, align: "text-center"},
                {name: 'contractStatus', label: '状态', sortable: false, align: "text-center"},
                {label: '操作', sortable: false, width: "60px", type: 'template', templateUrl: 'operationB4.html'}
            ];
            return this._schema.concat(addSchema);
        }
        //已中止
        this.getBSchemaAborted = function () {
            var addSchema = [
                {name: 'contractSuspendTime', label: '中止日期', sortable: false, align: "text-center"},
                {name: 'contractStatus', label: '状态', sortable: false, align: "text-center"},
                {label: '操作', sortable: false, width: "60px", type: 'template', templateUrl: 'operationB5.html'}
            ];
            return this._schema.concat(addSchema);
        }
        //已关闭
        this.getBSchemaClosed = function () {
            var addSchema = [
                {name: 'contractCloseTime', label: '关闭日期', sortable: false, align: "text-center"},
                {name: 'contractStatus', label: '状态', sortable: false, align: "text-center"},
            ];
            return this._schema.concat(addSchema);
        }

        //*********************项目经理、总工、设计师合同列表项************************************
        this.getSchema2 = function () {
            return this._schema2;
        }

    }

    MyContractService.prototype = Object.create(BaseListService.prototype);
    MyContractService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('MyContractService', MyContractService);
})(angular);


(function (angular) {
    function MyContractViewService($resource, $q, $http, UrlConfigService) {
        var _schemaStage = [
            {name: 'receiptNumberName', label: '收款阶段', sortable: false},
            {name: 'plannedCollectionTime', label: '收款日期',sortable: false, align: "text-center"},
            {name: 'plannedCollectionAccount', label: '金额(万)',sortable: false, align: "text-center",filter:'FenZhuanWanFilter'},
            {name: 'receiptPercent', label: '比例(%)', sortable: false, align: "text-center",filter:'percentFormat'},
            {name: 'proposerTime', label: '申请收款日期',sortable: false, align: "text-center"},
            {name: 'receiptProposerName', label: '申请收款人', sortable: false, align: "text-center"}
        ];

        var _schemaStageWithOperation = [
            {name: 'receiptNumberName', label: '收款阶段', sortable: false},
            {name: 'plannedCollectionTime', label: '收款日期', sortable: false, align: "text-center"},
            {name: 'plannedCollectionAccount', label: '金额(万)', sortable: false, align: "text-center",filter:'FenZhuanWanFilter'},
            {name: 'receiptPercent', label: '比例(%)', sortable: false, align: "text-center",filter:'percentFormat'},
            {name: 'proposerTime', label: '申请收款日期', sortable: false, align: "text-center"},
            {name: 'receiptProposerName', label: '申请收款人', sortable: false, align: "text-center"},
            {label: '操作', sortable: false, width: "60px", type: 'template', templateUrl: 'operation.html'}
        ];

        //暂无对应
        var _schemaRecord = [
            {name: 'receiptNumberName', label: '收款阶段', sortable: false},
            {name: 'collectionStageTime', label: '开票日期', sortable: false, align: "text-center"},
            {name: 'collectionStageCount', label: '发票总金额(万)', sortable: false, align: "text-center",filter:'FenZhuanWanFilter'},
            {name: 'collectionStageCount', label: '到账日期', sortable: false, align: "text-center"},
            {name: 'collectionStageCount', label: '到账金额(万)', sortable: false, align: "text-center",filter:'FenZhuanWanFilter'},
        ];

        var _schemaStageInput = [
            {name: 'receiptNumberName', label: '收款阶段',type: 'input', sortable: false},
            {name: 'plannedCollectionTime', label: '收款日期', type: 'input',sortable: false, align: "text-center"},
            {name: 'plannedCollectionAccount', label: '金额(万)', type: 'input',sortable: false, align: "text-center",filter:'FenZhuanWanFilter'},
            {name: 'receiptPercent', label: '比例(%)',type: 'input', sortable: false, align: "text-center",filter:'percentFormat'},
            {name: 'proposerTime', label: '申请收款日期', type: 'input',sortable: false, align: "text-center"},
            {name: 'receiptProposerName', label: '申请收款人', type: 'input',sortable: false, align: "text-center"}
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.myContract.listUrl, $resource, $q, $http, '');
        this._schemaStage = _schemaStage;
        this._schemaStageWithOperation = _schemaStageWithOperation;
        this._schemaRecord = _schemaRecord;
        this._schemaStageInput = _schemaStageInput;
        this._getUrl = UrlConfigService.urlConfig.myContract.getUrl;
        this._getCollectStageUrl = UrlConfigService.urlConfig.myContract.getCollectStageUrl;

        this.getCollectStage = function (contractId) {
            return this.$resource(this._getCollectStageUrl).get({contractId: contractId});
            // return this.$resource(this._getUrl).get({contractId: contractId});
        };

        this._sort = 'createdDate';
        this._order = 'desc';

        //获取下载
        // this.getDownloadUrl = function (appId) {
        //     return this.$resource(this._getDownloadUrl).get({appId:appId});
        // };





        //获取详情
        this.get = function (contractId) {
            return this.$resource(this._getUrl).get({contractId: contractId});
        };

        this.getSchemaStage = function () {
            return this._schemaStage;
        }

        this.getSchemaRecord = function () {
            return this._schemaRecord;
        }

        this.getSchemaStageWithOperation = function () {
            return this._schemaStageWithOperation;
        }

        this.getSchemaStageInput = function () {
            return this._schemaStageInput;
        }
    }


    MyContractViewService.prototype = Object.create(BaseListService.prototype);
    MyContractViewService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('MyContractViewService', MyContractViewService);
})(angular);