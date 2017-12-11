/**
 * Created by zhangsb on 2016/6/15.
 */
angular.module("LoginApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngCookies",
    "ngMessages",
    "ngResource",
    "ngSanitize",
    "toastr"
]);

//通知消息全局配置
angular.module("LoginApp").config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body',
        closeButton: true
    });
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
angular.module("LoginApp").config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/* Setup global settings */
angular.module("LoginApp").factory('settings', ['$rootScope', function ($rootScope) {
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: true, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };
    $rootScope.settings = settings;
    return settings;
}]);

/* Setup App Main Controller */
angular.module("LoginApp").controller('LoginController', ['$scope', '$rootScope', '$resource', '$window', 'toastr','$location', function ($scope, $rootScope, $resource, $window, toastr,$location) {
    var loginUrl = "/w/login";
    var logindyUrl='/w/logindy';

    var remember = $.cookie("remember");
    if (remember && remember == "true") {
        remember = true;
    } else {
        remember = false;
    }
    $scope.remember = remember || false;
    $scope.username = "";
    if ($scope.remember) {
        $scope.username = $.cookie("username") || "";
    }
    $scope.password = "";

    //uniform处理
    $.uniform.update();

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components
        Layout.init();
    });
    $('#myTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $scope.submitdy = function (logindyForm) {
        logindyForm.$submitted = true;
        if (logindyForm.$valid) {
            var param = {
                key: $scope.key,
                checkWord: $scope.checkWord
            };

            $.uniform.update();
            $resource(logindyUrl, null, {'login': {method: 'POST'}}).login(param).$promise.then(function (result) {
                if ("success" == result.status) {
                    $.cookie("username", $scope.username, {'path': "/"});
                    var nickname = "";
                    if (result.data && result.data.details && result.data.details.username) {
                        nickname = result.data.details.username;
                    }
                    var organizationName = "";
                    if (result.data && result.data.details && result.data.details.organizationName) {
                        organizationName = result.data.details.organizationName;
                    }
                    $.cookie("nickname", nickname, {'path': "/"});
                    $.cookie("organizationName", organizationName, {'path': "/"});
                    $.cookie("role", result.data.details.role, {'path': "/"});
                    $.cookie("remember", $scope.remember, {'path': "/"});
                    $window.location.href = "/index.html";
                } else {
                    $scope.errorMsg = "验证码不正确";
                }
            });
        }
    };

    $scope.submitpw = function (loginpwForm) {
    loginpwForm.$submitted = true;
    if (loginpwForm.$valid) {
        var param = {
            username: $scope.username,
            password: $scope.password
        };

        $.uniform.update();
        $resource(loginUrl, null, {'login': {method: 'POST'}}).login(param).$promise.then(function (result) {
            if ("success" == result.status) {
                $.cookie("username", $scope.username, {'path': "/"});
                var nickname = "";
                if (result.data && result.data.details && result.data.details.username) {
                    nickname = result.data.details.username;
                }
                var organizationName = "";
                if (result.data && result.data.details && result.data.details.organizationName) {
                    organizationName = result.data.details.organizationName;
                }
                $.cookie("nickname", nickname, {'path': "/"});
                $.cookie("organizationName", organizationName, {'path': "/"});
                $.cookie("role", result.data.details.role, {'path': "/"});
                $.cookie("remember", $scope.remember, {'path': "/"});
                $window.location.href = "/index.html";
            } else {
                $scope.errorMsg = result.errors[0].errmsg;
            }
        });
    }
}

}]);