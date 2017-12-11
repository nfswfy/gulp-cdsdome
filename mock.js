/**
 * Mock请求数据
 */
var responses = {
    
};

exports.getResponse = function (request) {

    var path = request.url;
    var method = request.method;

    var key = "";
    for (var k in responses) {
        var p = new RegExp(k);
        if (p.test(path)) {
            key = k;
            break;
        }
    }
    if (!method) method = 'GET';
    var results = responses[key];
    if (undefined == results) return false;

    var resp = results[method];
    if (undefined == results) return false;
    return resp;
};
