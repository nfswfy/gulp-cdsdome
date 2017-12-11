/**
 * Created by zhoujie
 */
(function (angular) {
    function ProjectService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {label: '序号',type:"seq", sortable: false, width:"150px"},
            {name: 'project_name', label: '项目名称', sortable: false,width:"30%",type: 'template', templateUrl: "viewProject.html",align:"text-left"},
            {name: 'contract_signing_time', label: '签约时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'project_actual_start_time', label: '项目开始', sortable: false,width:"112px",align:"text-center", filter: "timestampToDate"},
            //{name: 'projectActualEndTime', label: '项目结束', sortable: false,width:"112px",align:"text-center"},
            {name: 'chiefEngineerName', label: '总工', sortable: false, width:"150px",align:"text-center"},
            {name: 'total_project', label: '项目总额（万）', sortable: false, width:"150px",align:"text-right"},
            {name: 'project_status', label: '状态', sortable: false, width:"150px",align:"text-center"},
            {label: '操作', sortable: false, width:"60px", type: 'template', templateUrl: 'operation.html'}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.project.url, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'id';
        this._order = 'desc';
    }

    ProjectService.prototype = Object.create(BaseListService.prototype);
    ProjectService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('ProjectService', ProjectService);
})(angular);

