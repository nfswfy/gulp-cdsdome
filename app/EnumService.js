/**
 * 基础（枚举）数据存储服务
 * Created by zhangsb on 2017/10/18.
 */
angular.module("MetronicApp").service("EnumService", function () {
    this._data = {
        numberBooleans: [
            {"key": 1, "text": "是"},
            {"key": 0, "text": "否"}
        ],
        commonBoolean: [
            {"key": "true", "text": "是"},
            {"key": "false", "text": "否"}
        ],
        // 项目状态
        ProjectStatus: [
            {"key":"WX", "text": "执行中"},
            {"key":"ALI", "text": "已结束"}
        ],
        //全部发包形式
        WbsType:[
            {"key":"xs", "text": "悬赏"},
            {"key":"invite", "text": "定向邀请"},
            {"key":"assign", "text": "指定"}
        ],
        //工作包状态
        toolStatus:[
            {"key":"fail", "text": "流标"},
            {"key":"hasBid", "text": "已投标"}
        ],
        //项目类型
        ProjectType:[
            {"key":"presaleProject","text":"售前项目"},
            {"key":"actionItem ","text":"执行项目"},
            {"key":"developmentrojects","text":"研发项目"},
        ],
        //有效需求
        EffectiveDemand:[
            {"key":"presaleProject","text":"制造数字机床"},
            {"key":"actionItem ","text":"制造挖掘机"},
            {"key":"developmentrojects","text":"制造电炒锅"}
        ],
        //合同状态
        contractStatus:[
            {"key":"3","text":"已终止"},
            {"key":"4 ","text":"已中止"},
            {"key":"5","text":"已关闭"}
        ],
        //变更类型
        changeType:[
            {"key":1,"text":"时间变更"},
            {"key":2,"text":"合同变更"},
            {"key":3,"text":"技术变更"}
        ]
    };
    this.get = function (key) {
        return this._data[key];
    }
});