(function (angular) {
    function ViewAllJoinService($resource, $q, $http, UrlConfigService) {
        //
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'teamName', label: '姓名', sortable: false},
            {name: 'teamName', label: '联系方式', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '邮箱', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '行业领域', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '申请时间', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '状态', sortable: false, align: "text-center"},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.system.menu.url, $resource, $q, $http, _schema);
        this._sort = '';
        this._order = '';
        this._schema = _schema;

    }

    ViewAllJoinService.prototype = Object.create(BaseListService.prototype);
    ViewAllJoinService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('ViewAllJoinService', ViewAllJoinService);
})(angular);
