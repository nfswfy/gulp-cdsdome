/**
 * 时间日期转换
 * @param date
 * string number date moment
 * @returns {*}
 */
function translateDateToLong(date) {
    if (typeof date == "string") {
        if(date.indexOf("-") == -1 && date.indexOf("/") == -1){
            return null;
        }else{
            return Date.parse(date.replace(/-/g,"/"));
        }
    } else if (typeof date == "object") {
        if ((moment.isMoment(date))) {
            return new Date(date).getTime();
        } else {
            if (date instanceof Date) {
                return date.getTime();
            } else {
                return null;
            }
        }
    } else if (typeof date == "number") {
        return date;
    } else {
        return date;
    }
}

/**
 * 时间日期转换 TO 一天的开始
 * @param date
 * string number date moment
 * @returns {*}
 */
function translateDateToStartOfDayLong(date) {
    var translateDate = new Date(translateDateToLong(date));
    translateDate.setHours(0);
    translateDate.setMinutes(0);
    translateDate.setSeconds(0);
    translateDate.setMilliseconds(0);
    return translateDate.getTime();
}

/**
 * 时间日期转换 TO 一天的结束
 * @param date
 * string number date moment
 * @returns {*}
 */
function translateDateToEndOfDayLong(date){
    var translateDate = new Date(translateDateToLong(date));
    translateDate.setHours(23);
    translateDate.setMinutes(59);
    translateDate.setSeconds(59);
    translateDate.setMilliseconds(999);
    return translateDate.getTime();
}