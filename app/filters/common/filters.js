/**
 * 共通过滤器
 * Created by zhangsb on 2017/10/18.
 */
angular.module("MetronicApp").filter("timestampToDate",["$filter",function ($filter) {
    return function (value) {
        var time = new Date(value);
        var filter = $filter("date");
        return filter(time,"yyyy-MM-dd");
    }
}]).filter("timestampToTime",["$filter",function ($filter) {
    return function (value) {
        var filter = $filter("date");
        return filter(value,"yyyy-MM-dd HH:mm:ss");
    }
}]).filter("timestampToMinutes",["$filter",function ($filter) {
    return function (value) {
        var filter = $filter("date");
        return filter(value,"yyyy-MM-dd HH:mm");
    }
}]).filter("numberToRMB",["$filter",function ($filter) {
    return function (value) {
        var filter = $filter("currency");
        return filter(value,"￥");
    }
}]).filter("number2Decimal",["$filter",function ($filter) {
    return function (value) {
        var filter = $filter("number");
        return filter(value,"2");
    }
}]).filter("number4Decimal",["$filter",function ($filter) {
    return function (value) {
        var filter = $filter("number");
        return filter(value,"4");
    }
}]).filter("number4Decimal",["$filter",function ($filter) {
    return function (value) {
        var filter = $filter("number");
        return filter(value,"4");
    }
}]).filter("percentFormat",function () {
    return function (value) {
        if(angular.isNumber(value))
            value = value + "%";
        return value;
    }
}).filter('ModelChargingRules', ['$filter', function ($filter) {
    return function (number) {
        var number = number/100;
        number = $filter("number")(number);
        return number;
    }
}]).filter('MinChargingRules', ['$filter', function ($filter) {
    return function (number) {
        var number = number/100;
        number = $filter("number")(number);
        return number + "元" ;
    }
}]).filter('commonYesNo', ['$filter', function ($filter) {
    return function (val) {
        if(val){
            return "是";
        } else {
            return "否";
        }
    }
}]).filter('role', ['$filter', function ($filter) {
    return function (val) {
        var role="";
        for(var i=0;i<val.length;i++){
            role+=val[i]+" ";
        }
        return role;
    }
}]).filter('listToStringFilter', ['$filter', function ($filter) {
    return function (val) {
        var str="";
        for(var i=0;i<val.length;i++){
            str+=val[i].organizationName+" ";
        }
        return str;
    }
}]);
