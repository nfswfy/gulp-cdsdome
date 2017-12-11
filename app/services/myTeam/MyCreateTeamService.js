(function (angular) {
    function MyCreateTeamService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'teamName', label: '团队名称', sortable: false},
            {name: 'teamName', label: '名称', sortable: false, align: "text-center"},
            {name: 'teamAccount', label: '额', sortable: false, align: "text-center"},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.system.menu.url, $resource, $q, $http, _schema);
        this._sort = '';
        this._order = '';
        this._schema = _schema;

    }

    MyCreateTeamService.prototype = Object.create(BaseListService.prototype);
    MyCreateTeamService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('MyCreateTeamService', MyCreateTeamService);
})(angular);
