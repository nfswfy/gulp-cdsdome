/**
 * Created by zhangsb on 2016/6/7.
 */
(function (angular) {
    function DictionaryCategoryService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'key', label: '代码类型', sortable: false},
            {name: 'description', label: '描述', sortable: false},
            {name: 'discarded', label: '状态', sortable: false, filter: "discardedFilter"},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.system.dictionary.category.url, $resource, $q, $http, _schema);

        this._schema = _schema;
        this._sort = 'discarded';
        this._order = 'asc';
        this._discardUrl = UrlConfigService.urlConfig.system.dictionary.category.discardUrl;

        this.discard = function (id) {
            var resource = $resource(this._discardUrl, {id: id}, {discard: {method: 'PUT'}});
            return resource.discard();
        };
    }

    DictionaryCategoryService.prototype = Object.create(BaseListService.prototype);
    DictionaryCategoryService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('DictionaryCategoryService', DictionaryCategoryService);
})(angular);
