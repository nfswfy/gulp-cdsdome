(function (angular) {
    function MyTeamViewService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'teamName', label: '团队名称', sortable: false},
            {name: 'teamName', label: '名称', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '额', sortable: false, align: "text-center"},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];


        var _schemaInCreateView = [
            {name: '', label: '序号', type: "seq"},
            {name: 'teamName', label: '成员名称', sortable: false},
            {name: 'teamName', label: '手机号码', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '工作经验', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '设计类别', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '邀请时间', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '状态', sortable: false, align: "text-center"},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];

        var _schemaInJoinView = [
            {name: '', label: '序号', type: "seq"},
            {name: 'teamName', label: '成员名称', sortable: false},
            {name: 'teamName', label: '联系方式', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '工作经验', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '设计类别', sortable: false, align: "text-center"},
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.myTeam.url, $resource, $q, $http, '');
        this._listUrl = UrlConfigService.urlConfig.myTeam.listUrl;
        this._saveUrl = UrlConfigService.urlConfig.myTeam.saveUrl;
        this._deleteUrl = UrlConfigService.urlConfig.myTeam.deleteUrl;
        this._getUrl = UrlConfigService.urlConfig.myTeam.getUrl;

        //删除
        this.delete = function (id) {
            var resource = this.$resource(this._deleteUrl, {id: id});
            return resource.delete();
        };

        //新建或更新
        this.save = function (model) {
            if (undefined !== model.id) {
                return this.$resource(this._saveUrl, {id: model.id}, {
                    'update': {method: 'PUT'}
                }).update({id: model.id}, model);
            } else {
                return this.$resource(this._saveUrl).save(model);
            }

        };

        this.list = function (contractStatus) {
            var service = this;
            var resource = this.$resource(this._listUrl+'?createId='+createId);
            var queryMap = {page: this._storedPage, size: this._pageable.size};
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


        this._sort = '';
        this._order = '';
        this._schema = _schema;

        this.getSchemaInCreateView = function () {
            return _schemaInCreateView;
        }

        this.getSchemaInJoinView = function () {
            return _schemaInJoinView;
        }

    }

    MyTeamViewService.prototype = Object.create(BaseListService.prototype);
    MyTeamViewService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('MyTeamViewService', MyTeamViewService);
})(angular);
