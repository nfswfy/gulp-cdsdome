/**
 * Created by zhoujie on 2017/11/7.
 */
(function (angular) {
    function ProjectViewService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {label: '序号', type:"seq", sortable: false, width:"150px"},
            {name: 'name', label: '内容', sortable: false,width:"30%",align:"text-left"},
            {name: 'planStartTime', label: '开始时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'planEndTime', label: '结束时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'forecastCost', label: '金额（万）', sortable: false, width:"150px",align:"text-right"}

        ];
        var _toolBagSchema = [
            {label: '序号', type:"seq", sortable: false, width:"150px"},
            {name: 'name', label: '内容', sortable: false,width:"30%",align:"text-left"},
            {name: 'contractStartTime', label: '开始时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'contractEndTime', label: '结束时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'contractAccount', label: '金额（万）', sortable: false, width:"150px",align:"text-right"}
        ];
        var _costSchema = [
            {label: '序号',type:"seq",  sortable: false, width:"150px"},
            {name: 'name', label: '内容', sortable: false,width:"30%",align:"text-left"},
            {name: 'planStartTime', label: '开始时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'planEndTime', label: '结束时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'forecastCost', label: '金额（万）', sortable: false, width:"150px",align:"text-right"}
        ];
        var _changeSchema = [
            {label: '序号',type:"seq", sortable: false, width:"150px"},
            {name: 'name', label: '变更内容', sortable: false,width:"30%",align:"text-left"},
            {name: 'contractDate', label: '申请人', sortable: false,width:"112px",align:"text-center"},
            {name: 'projectActualEndTime', label: '申请时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'totalProject', label: '批准人', sortable: false, width:"150px",align:"text-center"},
            {name: 'projectStatus', label: '批准时间', sortable: false, width:"150px"},
            {label: '操作', sortable: false, width:"60px", type: 'template', templateUrl: 'operation.html'}
        ];
        //变更结果
        var _changeResultSchema = [
            {name: 'id', label: '序号', sortable: false, width:"150px"},
            {name: 'name', label: '任务名称', sortable: false,width:"30%",align:"text-left"},
            {name: 'projectActualEndTime', label: '计划完成时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'totalProject', label: '进度', sortable: false, width:"150px",align:"text-center"}
        ];
        BaseListService.call(this, "", $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'id';
        this._order = 'desc';

        this.getSchema = function(){
            return  _schema;
        };
        this.getToolBagSchema = function(){
            return  _toolBagSchema;
        };
        this.getCostSchema = function(){
            return  _costSchema;
        };
        this.getChangeSchema = function(){
            return  _changeSchema;
        };
        this.getChangeResultSchema = function(){
            return  _changeResultSchema;
        };


        this._getAllUrl = UrlConfigService.urlConfig.project.getAllUrl;
        this.get = function (id) {
            return this.$resource(this._getAllUrl+ id).get();
        };

        this.projectUrl = UrlConfigService.urlConfig.project.projectUrl;
        this.getProjectList = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this.projectUrl+ id);
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)){
                        if(this._s_search[k]){
                            queryMap['s_' + k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };
        this._toolBagUrl = UrlConfigService.urlConfig.project.toolBagUrl;
        this.getToolBagList = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._toolBagUrl+ id);
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)){
                        if(this._s_search[k]){
                            queryMap['s_' + k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };
        this._costUrl = UrlConfigService.urlConfig.project.costUrl;
        this.getCostList = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._costUrl+ id);
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)){
                        if(this._s_search[k]){
                            queryMap['s_' + k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };
        this._changeUrl = UrlConfigService.urlConfig.project.changeUrl;
        this.getChangeList = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._changeUrl+ id);
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)){
                        if(this._s_search[k]){
                            queryMap['s_' + k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };


        this._saveCdsChangeUrl = UrlConfigService.urlConfig.project.changeProject;
        this.submit = function (a,model) {
            //this.$resource(this._saveCdsChangeUrl).save(a,model);
            console.log(this.$resource)
            console.log($resource)
            console.log(this._saveCdsChangeUrl)

            this.$resource(this._saveCdsChangeUrl, {}, {}).save(model);

            this.$resource(this._saveCdsChangeUrl, {id: 1}, {
                'update': {method: 'PUT'}
            }).update({id: 1}, model);
            // $location.path("/project/list.html").search({});



        };


        //获得单个项目

        this._getOneUrl = UrlConfigService.urlConfig.project.getOneUrl;
        this.getOneProject = function (id) {
            return this.$resource( this._getOneUrl+ id).get();
        };





        //变更结果
        this._changeResultUrl = UrlConfigService.urlConfig.project.changeResultUrl;
        this.getChangeResultList = function (id) {
            return $resource(this._changeResultUrl, {id: id}, {getChangeResultList: {method: 'PUT'}}).getChangeResultList();
        };


    }

    ProjectViewService.prototype = Object.create(BaseListService.prototype);
    ProjectViewService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('ProjectViewService', ProjectViewService);
})(angular);