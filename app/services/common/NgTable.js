function NgTable(){

    this.__proto__ = {
        init : init,
        search: search
    };

    /**
     * 组件初始化
     *
     * @param $scope
     * @param baseService
     */
    function init($scope, baseService){

        this.$scope = $scope;
        this.baseService = baseService;

        bind.call(this);
        watch.call(this);

        list.call(this);
    }

    /**
     * $scope值绑定
     */
    function bind(){
        var s = this.$scope,
            bs = this.baseService;

        s.columns = bs.getSchema();
        s.sort = bs.getSort();
        s.order = bs.getOrder();
        s.pageable = bs.getPageable();
        s.notpageable = false;
    }

    /**
     * watch
     */
    function watch(){
        var self = this;
        var s = this.$scope;
        var bs = this.baseService;

        this.$scope.$watch('pageable.number', function (newValue, oldValue) {
            if (newValue == oldValue) {return;}

            bs.setStoredPage(newValue);
            list.call(self);
        });

        this.$scope.$watch('pageable.size', function (newValue, oldValue) {
            if (newValue == oldValue) {return;}

            bs.setSize(newValue);
            bs.setStoredPage(0);
            list.call(self);
        });


        this.$scope.$watch('order', function (newValue, oldValue) {
            if (oldValue == newValue) {return;}

            bs.setOrder(newValue);
            list.call(self);
        });
    }

    /**
     * 查询表格数据
     */
    function list() {
        var s = this.$scope;
        this.baseService.listWithPost().$promise.then(function (result) {
            s.rows = result.data;
            s.pageable = result.pageable;
        });
    }

    /**
     * 跳转到第一页
     */
    function goToFirstPage() {
        this.baseService.setStoredPage(0);
        list.call(this);
    }

    /**
     * 根据条件查询
     * @param params
     */
    function search(params) {
        this.baseService.putSearchParams(params);
        goToFirstPage.call(this);
    }
}