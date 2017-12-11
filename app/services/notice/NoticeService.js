/**
 * Created by zzz
 */
(function (angular) {
    function NoticeService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: 'id', label: '序号', type: "seq"},
            {name: 'title', label: '标题', sortable: false, type: 'template', templateUrl: 'portal.html'},
            {name: 'text', label: '内容简述', sortable: false},
            {name:'readTime',label:'接收时间',sortable:false}
        ];
        var _schemaReceive = [
            {name: 'id', label: '序号', type: "seq"},
            {name: 'title', label: '标题', sortable: false, type: 'template', templateUrl: 'portal.html'},
            {name: 'text', label: '内容简述', sortable: false},
            {name:'readTime',label:'接收时间',sortable:false},
            {name:'sender',label:'发件人',sortable:false},
            {label: '操作', sortable: false, width: 180, type: 'template', templateUrl: 'operation.html'}
        ];
        var _schemaSend = [
            {name: 'id', label: '序号', type: "seq"},
            {name: 'title', label: '标题', sortable: false, type: 'template', templateUrl: 'portal.html'},
            {name: 'text', label: '内容简述', sortable: false},
            {name:'sendTime',label:'发送时间',sortable:false},
            {name:'receiver',label:'接收人',sortable:false},
            {label: '操作', sortable: false, width: 180, type: 'template', templateUrl: 'operation.html'}
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.notice.url, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._schemaReceive = _schemaReceive;
        this._schemaSend = _schemaSend;
        this._sort = 'createdDate';
        this._order = 'desc';

        this._getSendedMessageListUrl = UrlConfigService.urlConfig.notice.viewSendMessageUrl;
        this._getReceivededMessageListUrl = UrlConfigService.urlConfig.notice.viewReceiveMessageUrl;
        // this._sendMessageUrl = UrlConfigService.urlConfig.notice.sendMessageUrl;
        // this._searchMessageByExampleUrl = UrlConfigService.urlConfig.notice.searchMessageByTitleTimeUrl;
        // this._getMessageDetailByPrimaryKeyUrl = UrlConfigService.urlConfig.notice.getMessageByIdUrl;
        // this._getAllEmailListUrl = UrlConfigService.urlConfig.notice.viewEmailListUrl;
        // this._searchEmailListByExampleUrl = UrlConfigService.urlConfig.notice.searchEmailByTimeTitleUrl;
        // this._getEmailDetailByPrimaryKeyUrl = UrlConfigService.urlConfig.notice.getEmailByIdUrl;




        // this._cancelUrl = UrlConfigService.urlConfig.company.url;
        // this.getSchemaMail = function () {
        //     var addSchema = [
        //         {label: '操作', sortable: false, width: 180, type: 'template', templateUrl: 'operation.html'}
        //     ];
        //     return this._schema.concat(addSchema);
        // };




        this.getSchemaReceive = function () {
            return this._schemaReceive;
        };
        this.getSchemaSend = function () {
            return this._schemaSend;
        };



        this.getSendedMessageListUrl = function () {
            var service = this;
            var resource = this.$resource(this._getSendedMessageListUrl);
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)) {
                        if (this._s_search[k]) {
                            queryMap['s_' + k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };
        this.getReceivededMessageListUrl = function () {
            var service = this;
            var resource = this.$resource(this._getReceivededMessageListUrl);
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)) {
                        if (this._s_search[k]) {
                            queryMap['s_' + k] = this._s_search[k];
                        }
                    }
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };





    }






    NoticeService.prototype = Object.create(BaseListService.prototype);
    NoticeService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('NoticeService', NoticeService);
})(angular);

