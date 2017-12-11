/**
 * Created by zzz
 */
(function (angular) {
    function CompanyService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: 'name', label: '节点名称', sortable: false,width:"20%"},
            {name: 'status', label: '启用状态', sortable: false,width:"112px",align:"text-center", filter: "ServerStatusFilter"},
            {name: 'ipAddress', label: '服务器IP地址', sortable: false,width:"112px",align:"text-center", filter: "ipAddressFilter"},
            {name: 'approveStep', label: '审核状态', sortable: false, filter: "ApproveStatusFilter",width:"112px",align:"text-center"},
            {label: '操作', sortable: false, width:"60px", type: 'template', templateUrl: 'operation.html'}
        ];
        var _schemaApply = [
            {name: '', label: '序号', sortable: false,width:"10%",type: "seq"},
            {name: 'enterpriseName', label: '企业名称', sortable: false,width:"112px",align:"text-center", type: 'template',templateUrl: 'menuTitle.html'},
            {name: 'enterpriseIndustryField', label: '行业领域', sortable: false,width:"112px",align:"text-center"},
            {name: 'enterpriseTel', label: '联系方式', sortable: false, width:"112px",align:"text-center"},
            {name: 'actionTime', label: '申请时间', sortable: false, width:"112px",align:"text-center"},
            {name: 'result', label: '状态', sortable: false, width:"112px",align:"text-center"},
            {label: '操作', sortable: false, width:"60px", type: 'template', templateUrl: 'operationApply.html'}
        ];
        var _schemaApplyPeople = [
            {name: '', label: '序号', sortable: false,width:"20%", type:'seq'},
            {name: 'customerName', label: '姓名', sortable: false,width:"112px",align:"text-center"},
            {name: 'customerPhone', label: '联系方式', sortable: false,width:"112px",align:"text-center"},
            {name: 'customerEMail', label: '邮箱', sortable: false,width:"112px",align:"text-center"},
            {name: 'customerIndustryField', label: '行业领域', sortable: false, width:"112px",align:"text-center"},
            {name: 'actionTime', label: '申请时间', sortable: false,width:"112px",align:"text-center"},
            {name: 'result', label: '状态', sortable: false, width:"112px",align:"text-center"},
            {label: '操作', sortable: false, width:120, type: 'template', templateUrl: 'operationApplyJoin.html'}
        ];
        var _schemaInvite = [
            {name: 'enterpriseName', label: '企业名称', sortable: false,width:"112px",align:"text-center", type: 'template',templateUrl: 'menuTitle.html'},
            {name: 'enterpriseIndustryField', label: '行业领域', sortable: false,width:"112px",align:"text-center"},
            {name: 'enterpriseTel', label: '联系方式', sortable: false, width:"112px",align:"text-center"},
            {name: 'actionTime', label: '邀请时间', sortable: false, width:"112px",align:"text-center"},
            {name: 'result', label: '状态', sortable: false,width:"112px",align:"text-center"},
            {label: '操作', sortable: false, width:"60px", type: 'template', templateUrl: 'operationInviteHistory.html'}

        ];
        var _schemaCheck = [
            {name: '', label: '序号', sortable: false,width:"10%",type: "seq"},
            {name: 'customerName', label: '成员名称', sortable: false,width:"20%"},
            {name: 'customerPhone', label: '手机号码', sortable: false,width:"112px",align:"text-center"},
            {name: 'experience', label: '工作经验', sortable: false,width:"130px",align:"text-center"},
            {name: 'designType', label: '设计类别', sortable: false, width:"112px",align:"text-center"},
            {name: 'joiningTime', label: '加入时间', sortable: false,width:"112px",align:"text-center", filter: 'timestampToDate'},
            {name: 'status', label: '状态', sortable: false,width:"112px",align:"text-center"},
            {label: '操作', sortable: false, width:"60px", type: 'template', templateUrl: 'operation.html'}
        ];
        var _schemaJoin = [
            {name: '', label: '序号', sortable: false,width:"10%",type: "seq"},
            {name: 'customerName', label: '成员名称', sortable: false,width:"20%"},
            {name: 'customerPhone', label: '手机号码', sortable: false,width:"112px",align:"text-center", filter: "ServerStatusFilter"},
            {name: 'experience', label: '工作经验',filter: "timestampToMinutes", sortable: false,width:"130px",align:"text-center"},
            {name: 'industryField', label: '设计类别', sortable: false, filter: "ApproveStatusFilter",width:"112px",align:"text-center"},
            {name: 'commitTime', label: '加入时间',filter: "timestampToMinutes", sortable: false,width:"130px",align:"text-center"},
            {name: 'commitTime', label: '退出时间',filter: "timestampToMinutes", sortable: false,width:"130px",align:"text-center"},
            {name: 'status', label: '状态', sortable: false, filter: "ApproveStatusFilter",width:"112px",align:"text-center"},
            {name: 'operation', label: '操作', sortable: false, filter: "ApproveStatusFilter",width:"112px",align:"text-center"},
        ];
        var _schemaInvitePeople = [
            {name: '', label: '序号', sortable: false,width:"10%",type: "seq"},
            {name: 'customerName', label: '企业名称', sortable: false,width:"112px",align:"text-center"},
            {name: 'industryField', label: '行业领域', sortable: false,width:"112px",align:"text-center"},
            {name: 'customerPhone', label: '联系方式', sortable: false, width:"112px",align:"text-center"},
            {name: 'actionTime', label: '邀请时间', sortable: false, width:"112px",align:"text-center"},
            {name: 'result', label: '状态', sortable: false,width:"112px",align:"text-center"}
        ];
        BaseListService.call(this, UrlConfigService.urlConfig.company.url, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._schemaMember = _schemaCheck;
        this._schemaJoin=_schemaJoin;
        this._schemaApply=_schemaApply;
        this._schemaInvite=_schemaInvite;
        this._schemaApplyPeople=_schemaApplyPeople;
        this._schemaInvitePeople = _schemaInvitePeople;
        this._sort = 'createdDate';
        this._order = 'desc';
        this._cancelUrl = UrlConfigService.urlConfig.company.cancelApplication;
        this._leaveUrl = UrlConfigService.urlConfig.company.leave;
        this._publicUrl=UrlConfigService.urlConfig.company.url;
        this._agreeUrl = UrlConfigService.urlConfig.company.agreeUrl;
        this._rejectUrl = UrlConfigService.urlConfig.company.rejectUrl;
        this._logoutUrl = UrlConfigService.urlConfig.company.url;
        this._createUrl =UrlConfigService.urlConfig.company.createEditCompanyInfoUrl;
        this._getUrl =UrlConfigService.urlConfig.company.getCompanyInfoUrl;
        this._applyHistory=UrlConfigService.urlConfig.company.applyHistory;
        this._applyForMember=UrlConfigService.urlConfig.company.applyForMember;
        this._joinUrl=UrlConfigService.urlConfig.company.joinUrl;
        this._deleteUrl=UrlConfigService.urlConfig.company.deleteApplication;
        this._applyList=UrlConfigService.urlConfig.company.applyList;
        this._baseInfoUrl = UrlConfigService.urlConfig.company.baseInfoUrl; //企业基本信息
        this._qualificationsInfoUrl = UrlConfigService.urlConfig.company.qualificationsInfoUrl; //企业资质信息
        this._canInvitePeopleUrl = UrlConfigService.urlConfig.company.canInvitePeopleUrl; //可邀请加入本企业的人员列表
        this._invitePeopleUrl = UrlConfigService.urlConfig.company.invitePeopleUrl; //邀请加入本企业
        this._memberUrl=UrlConfigService.urlConfig.company.memberUrl;  //创建企业的成员列表
        this._getHistoryByEnterpriseIdUrl=UrlConfigService.urlConfig.company.getHistoryByEnterpriseIdUrl;  //个人申请加入企业列表
        this._invitePeopleHistoryUrl=UrlConfigService.urlConfig.company.invitePeopleHistoryUrl;  //企业邀请人员历史列表
        this.getFoundDetail = function (id) {
            return this.$resource(this._baseInfoUrl).get({enterpriseId: id});
        };

        //个人申请加入企业列表
        this.getHistoryByEnterpriseId = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._getHistoryByEnterpriseIdUrl + '?enterpriseId=' + id + '&actionType=1',queryMap);
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
            return resource.save(queryMap);
        };

        //企业邀请加入历史列表
        this.getInvitePeopleHistory = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._invitePeopleHistoryUrl + '?enterpriseId=' + id + '&actionType=2',queryMap);
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
            return resource.save(queryMap);
        };
        this.getCertification = function (id) {
            return this.$resource(this._qualificationsInfoUrl).get({enterpriseId: id});
        };
        this.getJoinList=function () {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._joinList,queryMap);
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
            return resource.save(queryMap);
        };
        this.ApplyForMembership=function (id) {
            return this.$resource(this._applyForMember,{enterpriseId:id,actionType:1},{"apply":{"method": "POST"}}).apply();
        };
        this.getApplyHistory=function () {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._applyHistory+"?actionType="+"1");
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
        this.getInviteHistory=function () {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._applyHistory+"?actionType="+"2",queryMap);
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
            return resource.save(queryMap);
        };

        this.getSchemaApply = function () {
            return this._schemaApply;
        };
        this.getSchemaApplyPeople = function () {
            return this._schemaApplyPeople;
        };
        this.getSchemaMember = function () {
            return this._schemaMember;
        };
        this.getSchemaJoin = function () {
            return this._schemaJoin;
        };
        this.getSchemaInvite = function () {
            return this._schemaInvite;
        };
        this.getSchemaInvitePeople = function () {
            return this._schemaInvitePeople;
        };
        this.listWithPostPublic = function () {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._publicUrl,queryMap);
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
            return resource.save(queryMap);
        };
        this.listWithPostJoin = function () {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._joinUrl,queryMap);
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
            return resource.save(queryMap);
        };
        this.listWithPostApply = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};

            var resource = this.$resource(this._applyList,queryMap);
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
            return resource.save(queryMap);
        };
        this.listWithId = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._publicUrl + '?id=' + id,queryMap);
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
            return resource.save(queryMap);
        };
        //获取可邀请人员列表
        this.listWithPostInvitePeople = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._canInvitePeopleUrl + '?enterpriseId=' + id,queryMap);
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
            return resource.save(queryMap);
        };

        //邀请人员加入本企业
        this.invite = function ( model) {
            return this.$resource(this._invitePeopleUrl+ '?customerId=' + model.customerId+'&enterpriseId='+ model.enterpriseId+'&actionType='+model.actionType).save();
            // return this.$resource(this._invitePeopleUrl, {"invite": {"method": "PUT"}}).invite(model.customerId, model.enterpriseId, model.actiontype);
        };

        this.listWithPostMembers = function (id) {
            var service = this;
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            // 带汉字的检索，用post请求，固定加“/s“
            var resource = this.$resource(this._memberUrl + '?enterpriseId=' + id,queryMap);
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
            return resource.save(queryMap);
        };

        this.agree = function (id) {
            var resource = $resource(this._agreeUrl, {enterpriseMemberHistoryId: id}, {"agree": {"method": "POST"}});
            return resource.agree();
        };
        //
        this.cancel = function (id, rejectDescription) {
            return this.$resource(this._cancelUrl, {enterpriseMemberHistoryId: id}, {"cancel": {"method": "PUT"}}).cancel();
        };
        this.reject = function (id) {
            return this.$resource(this._cancelUrl, {enterpriseMemberHistoryId: id}, {"reject": {"method": "PUT"}}).reject();
        };
        this.leave = function (id) {
            var resource = $resource(this._leaveUrl, {memberId: id}, {"leave": {"method": "PUT"}});
            return resource.leave();
        };
        this.logout = function (id) {
            var resource = $resource(this._logoutUrl, {id: id}, {"logout": {"method": "PUT"}});
            return resource.logout();
        };

        //新建或更新 我创建的企业
        this.createMyCompany = function (model) {
            if (undefined !== model.id) {
                return this.$resource(this._createUrl, {enterpriseId: model.id}, {
                    'update': {method: 'PUT'}
                }).update({enterpriseId: model.id}, model);
            } else {
                return this.$resource(this._createUrl).save(model);
            }

        };
        //查看
        this.getMyCompany = function (id) {
            return $resource(this._getUrl, {enterpriseId: id}).get();
        };

        //编辑
        this.updateMyCompany = function (id, model) {
            return $resource(this._createUrl, {enterpriseId: id}, {
                'update': {method: 'PUT'}
            }).update({enterpriseId: id}, model);
        };

        this.delete = function (id) {
            var resource = this.$resource(this._deleteUrl, {enterpriseMemberHistoryId: id},{"delete":{"method":"PUT"}});
            return resource.delete();
        };
    }

    CompanyService.prototype = Object.create(BaseListService.prototype);
    CompanyService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('CompanyService', CompanyService);
})(angular);

