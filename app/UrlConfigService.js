/**
 * URL统一管理服务
 * Created by zhangsb on 2017/10/18.
 */
angular.module("MetronicApp").service("UrlConfigService", function () {
    var ldxpHost = "";
    var ldxpRootPath = "";
    var TFileStorageRootPath = "";

    this.urlConfig = {
        //码表
        dataDictionary: {
            url: ldxpHost + ldxpRootPath + "/w/dicts/sync"
        },
        appCommon: {
            authorizations:{
                 myMenus:ldxpHost + ldxpRootPath + "data/w/authorizations/myAuthorizedMenus.json"
            },
            login:{
                login:ldxpHost + ldxpRootPath + "/w/login",
                checkLogin: ldxpHost + ldxpRootPath + "/w/checkLogin",
                logout:ldxpHost + ldxpRootPath + "/logout"
            },
            pending:{
                listUrl:ldxpHost + ldxpRootPath + "/w/todoReminders",
                deleteUrl:ldxpHost + ldxpRootPath + "/w/todoReminders/:id/cancel"
            }
        },
        fileStorage: {
            uploadUrl: TFileStorageRootPath + "/w/enrollees/import", // 真正起作用的是leadingConfig中的flow的target起作用的
            downloadUrl: TFileStorageRootPath + "/download"
        },
        system: {
            dictionary: {
                category: {
                    url: ldxpHost + ldxpRootPath + "/w/dicts/categories/:id",
                    discardUrl: ldxpHost + ldxpRootPath + "/w/dicts/categories/:id/discard"
                },
                code: {
                    listUrl: ldxpHost + ldxpRootPath + "/w/dicts/categories/:categoryId/codes/:id",
                    url: ldxpHost + ldxpRootPath + "/w/dicts/:id",
                    discardUrl: ldxpHost + ldxpRootPath + "/w/dicts/:id/discard",
                    moveup: ldxpHost + ldxpRootPath + "/w/dicts/:id/moveup",
                    movedown: ldxpHost + ldxpRootPath + "/w/dicts/:id/movedown"
                }
            },
            menu: {
                url: ldxpHost + ldxpRootPath + "/w/sys/menus/:id",
                rootMenus: ldxpHost + ldxpRootPath + "/w/sys/menus/baseMenus",
                subMenus: ldxpHost + ldxpRootPath + "/w/sys/menus/:parentId/subMenus",
                menuTree: ldxpHost + ldxpRootPath + "/w/sys/menus/nodes"
            },
            role: {
                url: ldxpHost + ldxpRootPath + "/w/roles/:id",
                roleMenus:ldxpHost + ldxpRootPath + "/w/authorizations/roleMenus/:roleId"
            }
        },
        company:{
            url: ldxpHost + ldxpRootPath + "/cds/w/enterprise/getFoundedEnterpriseList.do",  //我创建的企业列表
            createEditCompanyInfoUrl:ldxpHost + ldxpRootPath + "/cds/w/enterprise/saveEnterpriseDetail.do",
            getCompanyInfoUrl:ldxpHost + ldxpRootPath + "/cds/w/enterprise/getEnterpriseDetailById.do",
            memberUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/getEnterpriseMembers.do",  //我创建的企业详情--成员列表
            baseInfoUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/getEnterpriseDetailById.do",  //我创建的企业详情---基本信息
            qualificationsInfoUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/getEnterpriseQualificationsById.do",  //我创建的企业详情---资质信息
            canInvitePeopleUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/getInviteCustomerList.do",  //我创建的企业---可邀请加入的人员列表
            invitePeopleUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/createMemberHistory.do",  //我创建的企业---邀请加入（动作）
            invitePeopleHistoryUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/getHistoryByEnterpriseId.do",  //我创建的企业---邀请加入历史纪录
            getHistoryByEnterpriseIdUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/getHistoryByEnterpriseId.do",  //人员申请加入企业（申请列表）
            applyHistory: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/getHistoryByCustomerId.do",  //申请历程
            applyForMember: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/createMemberHistory.do",  //申请加入企业
            agreeUrl: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/agree.do",  //同意邀请
            rejectUrl: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/refuse.do",  //拒绝邀请
            joinUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/getJoinedEnterpriseList.do",  //我加入的企业列表
            leave: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/removeEnterpriseMember.do",  //退出企业
            cancelApplication: ldxpHost+ldxpRootPath+"/cds/w/enterprise/member/history/cancel.do",  //取消加入企业申请
            deleteApplication: ldxpHost+ldxpRootPath+"/cds/w/enterprise/member/history/delete.do",  //删除申请
            applyList: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/getJoinEnterpriseList.do"
        },
        information:{
            infoUrl:ldxpHost + ldxpRootPath + "/cds/w/customer/getCustomerById.do",
            qualificationsIdUrl:ldxpHost + ldxpRootPath + "/cds/w/customer/getCustomerQualificationsById.do",
            saveDetailUrl:ldxpHost + ldxpRootPath + "/cds/w/customer/saveCustomerDetail.do",
            saveRealNameUrl:ldxpHost + ldxpRootPath + "/cds/w/customer/saveCustomerRealName.do",
            saveQualificationsUrl:ldxpHost + ldxpRootPath + "/cds/w/customer/saveCustomerQualifications.do",
            savePhotoUrl:ldxpHost + ldxpRootPath + "/cds/w/customer/saveCustomerAvatarPhotos.do",
        },
        myContract:{
            // listUrl: ldxpHost + ldxpRootPath + "/w/contract/getContractListByExample.do",
            // listUrl: ldxpHost + ldxpRootPath + "/w/csAgreementController/page",
            // getUrl:ldxpHost + ldxpRootPath + "/w/contract/getContractDetailByContractId.do",
            // saveUrl:ldxpHost + ldxpRootPath + "/w/contract/saveContract.do",
            // deleteUrl:ldxpHost + ldxpRootPath + "/w/contract/deleteContract.do",
            // getCollectStageUrl:ldxpHost + ldxpRootPath + "/w/receipt/getReceiptsByContractId.do"
            listUrl: ldxpHost + ldxpRootPath + "/w/csAgreementController/page",//合同了列表
            getUrl:ldxpHost + ldxpRootPath + "/w/csAgreementController/:contractId",//合同详情
            saveUrl:ldxpHost + ldxpRootPath + "/w/csAgreementController/createContractDetail",//保存合同
            deleteUrl:ldxpHost + ldxpRootPath + "/w/csAgreementController/updateContract",//修改合同
            getCollectStageUrl:ldxpHost + ldxpRootPath + "/w/receipt/getReceiptsByContractId.do"//点击合同名称超链接

        },
        myTeam:{
            //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^我创建的团队（create）^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            createListUrl: ldxpHost + ldxpRootPath + "/cds/w/team/getFoundedTeamList.do",//我创建的团队列表---------------------------------------
            createUrl:ldxpHost + ldxpRootPath + "/cds/w/team/saveTeam.do",//"新建"团队---------------------------------------
            getUrl:ldxpHost + ldxpRootPath + "/cds/w/team/getTeamDetailById.do",//获取团队详情信息--------------------------------------------
            logoutUrl:ldxpHost + ldxpRootPath + "/cds/w/team/getTeamDetailById.do",//"注销"
            getMembersUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/getEnterpriseMembers.do",//获取团队成员列表
            zanwuUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/getEnterpriseMembers.do",//"申请移出"（暂无）
            canInvitePeopleUrl: ldxpHost + ldxpRootPath + "/cds/w/team/member/getInviteCustomerList.do",//可邀请加入的人员列表（可搜索）------------------------
            inviteJoinUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/createMemberHistory.do",//"邀请加入"
            invitePeopleHistoryUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/getHistoryByEnterpriseId.do",//查看申请加入的人员--------------
            invitePeopleHistoryUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/getHistoryByEnterpriseId.do",//"同意"
            invitePeopleHistoryUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/getHistoryByEnterpriseId.do",//"拒绝"
            invitePeopleHistoryUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/getHistoryByEnterpriseId.do",//"删除"
            invitePeopleHistoryUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/getHistoryByEnterpriseId.do",//查看我的所有邀请--------------
            invitePeopleHistoryUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/getHistoryByEnterpriseId.do",//"取消邀请"
            invitePeopleHistoryUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/history/getHistoryByEnterpriseId.do",//"删除"
            //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^我加入的团队（join）^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            joinListUrl: ldxpHost + ldxpRootPath + "/cds/w/team/getFoundedTeamList.do",//我加入的团队列表-------------------------------------
            getUrl:ldxpHost + ldxpRootPath + "/cds/w/team/getTeamDetailById.do",//获取团队详情信息--------------------------------
            leave: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/removeEnterpriseMember.do",  //"退出"团队
            memberUrl: ldxpHost + ldxpRootPath + "/cds/w/enterprise/member/getEnterpriseMembers.do",//获取团队成员列表
            joinListUrl: ldxpHost + ldxpRootPath + "/cds/w/team/getFoundedTeamList.do",//可以加入的团队列表（可搜索）-----------------------------------------
            applyForMember: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/createMemberHistory.do",  //"申请加入"
            applyHistory: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/getHistoryByCustomerId.do",  //我的申请历程列表------------------------
            applyHistory: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/getHistoryByCustomerId.do",  //"退出"
            applyHistory: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/getHistoryByCustomerId.do",  //"取消申请"
            applyHistory: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/getHistoryByCustomerId.do",  //"删除"
            applyHistory: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/getHistoryByCustomerId.do",  //邀请我的团队列表------------------------
            agreeUrl: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/agree.do",  //"同意"
            rejectUrl: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/refuse.do",  //"拒绝"
            rejectUrl: ldxpHost + ldxpRootPath +"/cds/w/enterprise/member/history/refuse.do",  //"删除"
        },
        project:{
            // url: ldxpHost + ldxpRootPath + "/ww//cdsProjects/getCdsProjectList.do",
            url: ldxpHost + ldxpRootPath + "/w/project/page",
            getOneUrl: ldxpHost + ldxpRootPath + "/w/project/",
            changeProject: ldxpHost + ldxpRootPath + "/w/project/",
            getAllUrl: ldxpHost + ldxpRootPath + "/w/cdsProjects/getCustomerById.do?id=",
            projectUrl:ldxpHost + ldxpRootPath + "w/workItem/getProjectPersonalCost.do?projectId=",
            toolBagUrl:ldxpHost + ldxpRootPath + "/w/workpackageCost/getWorkpackagesPersonalCost.do?projectId=",
            costUrl:ldxpHost + ldxpRootPath + "/w/cdsProjects/getProjectCostById.do?id=",
            changeUrl:ldxpHost + ldxpRootPath + "/w/cdsChange/getCdsChangeList.do?projectId=",
            changeResultUrl:ldxpHost + ldxpRootPath + "/w/project/projectList"
        },
        demandCustomer:{
            url: ldxpHost + ldxpRootPath + "/cds/w/order/selectOrderList.do",
            closeUrl: ldxpHost + ldxpRootPath + "/cds/w/order/closeOrder.do",
            getUrl: ldxpHost + ldxpRootPath + "/cds/w/order/selectOrderByPrimaryKey.do",
            improveUrl: ldxpHost + ldxpRootPath + "/cds/w/improveOrder/getImproveOrderByOrderId.do",
            complementUrl: ldxpHost + ldxpRootPath + "/cds/w/orderComplement/selectOrderComplementList.do",
            refinementUrl:ldxpHost + ldxpRootPath + "/cds/w/orderRefinement/getOrderRefinementList.do",
            publishUrl:ldxpHost + ldxpRootPath + "/cds/w/order/insertOrder.do"
        },
        demandManager:{
            url:  ldxpHost + ldxpRootPath + "/w/demand/intimidate",
            winUrl:ldxpHost + ldxpRootPath + "/w/demand/win",
            defeatUrl:ldxpHost + ldxpRootPath + "/w/demand/defeat",
            recordUrl:ldxpHost + ldxpRootPath + "/w/demand/intimidate/:id/communicationRecord",
            offerUrl:ldxpHost + ldxpRootPath + "/w/demand/offer"
        },
        customer:{
            customerUrl: ldxpHost + ldxpRootPath + "/w/customer/person",
            companyUrl: ldxpHost + ldxpRootPath + "/w/customer/company"
        },
        notice:{
            url: ldxpHost + ldxpRootPath + "/w/notice/:id",
            viewSendMessageUrl:ldxpHost + ldxpRootPath + "/w/message/getSendedMessageList.do",
            viewReceiveMessageUrl:ldxpHost + ldxpRootPath + "/w/message/getReceivededMessageList.do",
            sendMessageUrl:ldxpHost + ldxpRootPath + "/w/message/sendMessage.do",
            searchMessageByTitleTimeUrl:ldxpHost + ldxpRootPath + "/w/message/searchMessageByExample.do",
            getMessageByIdUrl:ldxpHost + ldxpRootPath + "/w/message/getMessageDetailByPrimaryKey.do",
            viewEmailListUrl:ldxpHost + ldxpRootPath + "/w/email/getAllEmailList.do",
            searchEmailByTimeTitleUrl:ldxpHost + ldxpRootPath + "/w/email/searchEmailListByExample.do",
            getEmailByIdUrl:ldxpHost + ldxpRootPath + "/w/email/getEmailDetailByPrimaryKey.do"


        },
        account:{
            url:ldxpHost + ldxpRootPath + "/w/account/accountList",
            getAllUrl:ldxpHost + ldxpRootPath + "/w/account/:id",
            recordUrl:ldxpHost + ldxpRootPath + "/w/account/:id"
        },
        wbs:{
            url:ldxpHost + ldxpRootPath + "/w/account/wbs",
            getAllUrl:ldxpHost + ldxpRootPath + "/w/account/:id",
            requestUrl:ldxpHost + ldxpRootPath + "/w/account/:id",
            costUrl:ldxpHost + ldxpRootPath + "/w/account/:id",
            pointUrl:ldxpHost + ldxpRootPath + "/w/account/:id"
        },
        antispamWord: {
            url:ldxpHost + ldxpRootPath + "/w/antispamWord"
        }
    };
});


