(function (global) {

    function BaseListService(listUrl, $resource, $q, $http, schema) {
        this.listUrl = listUrl;
        this.$resource = $resource;
        this.$q = $q;
        this.$http = $http;

        this._storedPage = 0;
        this._s_search = {};
        this._sort = 'id';
        this._order = 'asc';
        this._schema = schema;

        this._pageable = {
            "totalElements": 0,
            "numberOfElements": 0,
            "totalPages": 0,
            "first": true,
            "last": true,
            "size": 10,
            "number": 0,
            "fromNumber": 0,
            "toNumber": 0
        };

        //查询Schema定义
        this.getSchema = function () {
            return this._schema;
        };

        this.getStoredPage = function () {
            return this._storedPage;
        };

        this.setStoredPage = function (page) {
            this._storedPage = page;
        };

        this.putSearchParams = function (params) {
            for (var k in params) {
                if (params.hasOwnProperty(k))
                    this._s_search[k] = params[k];
            }
        };

        this.clearSearchParams = function () {
            this._s_search = {};
        };

        this.getSort = function () {
            return this._sort;
        };

        this.setSort = function (sort) {
            this._sort = sort;
        };

        this.getSize = function () {
            return this._pageable.size;
        };

        this.setSize = function (size) {
            this._pageable.size = size;
        };

        this.getOrder = function () {
            return this._order;
        };

        this.setOrder = function (order) {
            this._order = order;
        };

        this.getPageable = function () {
            return this._pageable;
        };

        this.getSortAndOrder = function () {
            return this._sort + "," + this._order;
        };

        this.get = function (id) {
            return this.$resource(this.listUrl).get({id: id});
        };

        this.list = function () {
            var service = this;
            var resource = this.$resource(this.listUrl);
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)){
                        if(this._s_search[k]){
                            //queryMap['s_' + k] = this._s_search[k];
                            queryMap[k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };
        this.listWithPost = function () {
            //console.log(this._storedPage)
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};

            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this.listUrl + "/s",queryMap);
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)){
                        if(this._s_search[k]){
                            //queryMap['s_' + k] = this._s_search[k];
                            queryMap[k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.save(queryMap);
        };

        this.delete = function (id) {
            var resource = this.$resource(this.listUrl, {id: id});
            return resource.delete();
        };

        //新建或更新
        this.save = function (model) {
            if (undefined !== model.id) {
                return this.$resource(this.listUrl, {id: model.id}, {
                    'update': {method: 'PUT'}
                }).update({id: model.id}, model);
            } else {
                return this.$resource(this.listUrl).save(model);
            }

        };

        this.update = function (id, model) {
            return $resource(this.listUrl, {id: id}, {
                'update': {method: 'PUT'}
            }).update({id: id}, model);
        };
    }
    global.BaseListService = BaseListService;
})(window, angular);
