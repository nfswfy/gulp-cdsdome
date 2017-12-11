/**
 * 应用相关配置
 * Metronic AngularJS App Main Script
 * Created by zhangsb on 2017/10/18.
 */
angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "ui.validate",
    "oc.lazyLoad",
    "ngCookies",
    "ngMessages",
    "ngResource",
    "ngSanitize",
    "ngTouch",
    "toastr",
    "ldDatePicker",
    "flow",
    "ngJsTree",
    // "ng.ueditor",
    "number-input"
]);

angular.module("MetronicApp").config(['flowFactoryProvider', function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
        target: '/upload',
        permanentErrors: [404, 500, 501],
        uploadMethod: 'POST',
        method: "multipart",
        allowDuplicateUploads: false,
        successStatuses: [200, 201, 202],
        throttleProgressCallbacks: 1,
        testChunks: false
    };
}]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
angular.module("MetronicApp").config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/* Setup global settings */
angular.module("MetronicApp").factory('settings', ['$rootScope', function ($rootScope) {
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: true, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: Metronic.getAssetsPath(),
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;
    return settings;
}]);
/* Setup App Main Controller */
angular.module("MetronicApp").controller('AppController', ['$scope', '$rootScope', 'AppCommonService', 'DictService', function ($scope, $rootScope, AppCommonService, DictService) {
    //检验登录
    // AppCommonService.checkLogin();

    //加载动态码表数据
    DictService.loadDataFromServer();

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            $rootScope.$broadcast("changeUrlEvent", true);
        })
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
angular.module("MetronicApp").controller('HeaderController', ['$scope', '$window','$location','$interval', 'toastr','AppCommonService', function ($scope, $window,$location,$interval, toastr,AppCommonService) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });

    $scope.list = function () {
        AppCommonService.list1().$promise.then(function (result) {
            $scope.menus = result.data;
            $scope.length = result.data.length;
            //storage page state
            $scope.pageable=result.pageable;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };
    // $scope.list();

    $scope.delete = function (id) {
        AppCommonService.delete(id).$promise.then(function (result) {
            if ("success" == result.status) {
                $scope.list();
            } else {
                for (var index in result.errors) {
                    toastr.error(result.errors[index].errmsg, "查看失败");
                }
            }
        });
    };
    // var interval = $interval(function(){
    //     $scope.list();
    // },300000);

    $scope.pending = function (row) {
        $scope.delete(row.id);
        $location.path("/vehicle/vehicleCondition/blank.html").search({"objectId": row.objectId,"todoType":row.todoType,"enrolleeState":row.enrolleeState});

    };



    if($.cookie("organizationName")){
        $scope.organizationName = $.cookie("organizationName");
    }else {
        $scope.organizationName = "--"
    }
    $scope.nickname = $.cookie("nickname")+"（"+$scope.organizationName+")"+"（"+$.cookie("role")+")";
    $scope.username=$.cookie("username");
    $scope.organizationId=$.cookie("organizationId");




    $scope.logout = function () {
        AppCommonService.logout().$promise.then(function (result) {
            if ("success" == result.status) {
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() - 1);
                $.cookie("nickname", "", {'path': "/", 'expires': expireDate});
                $.cookie("organizationId", "", {'path': "/", 'expires': expireDate});
                $window.location.href = "/login.html";
            }
        });
    };
    $scope.passwordChange=function(){
        $location.path("/user/rePassword.html").search({"username":$scope.username});
    };
    $scope.informationChange=function(){
        $location.path("/user/userInfo.html").search({"username":$scope.username});
    }

}]).filter('todoTypeFilter',["EnumService",function(EnumService){
    return function(value){
        var usageData=EnumService.get("todoType");
        var even=_.find(usageData,function(UserType){
            return UserType.key == value;
        });
        return even ? even.text :"";
    }
}]).filter('timeFilter', ['$filter', function ($filter) {
    return function (number) {
        if(number<60000){
            return '1分钟内';
        }else if(number>60000&&number<3600000){
            var number = number/60000;
            number = $filter("number")(number, "0");
            return number + '分钟前';
        }else if(number>3600000&&number<86400000){
            var number = number/3600000;
            number = $filter("number")(number, "0");
            return number + '小时前';
        }else  if(number>86400000){
            var number = number/86400000;
            number = $filter("number")(number, "0");
            return number + '天前';
        }
    }
}]);


/* Setup Layout Part - Sidebar */
angular.module("MetronicApp").controller('SidebarController', ['$rootScope', '$scope', '$resource', 'AppCommonService', function ($rootScope, $scope, $resource, AppCommonService) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
    $scope.isEmptySubMenus = function (subMenus) {
        if (subMenus) {
            if (subMenus.length) {
                return true;
            }
        }
        return false;
    };
    $scope.initMenus = function () {
        AppCommonService.getMyAuthorizedMenus().$promise.then(function (result) {
            $scope.menus = result.data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };

    $rootScope.$on("initMenuEvent", function (event, data) {
        $scope.initMenus();
    });
    $rootScope.$broadcast("initMenuEvent", true);
}]);

/* Setup Layout Part - Quick Sidebar */
angular.module("MetronicApp").controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
angular.module("MetronicApp").controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
angular.module("MetronicApp").controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
angular.module("MetronicApp").config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dash.html");

    $stateProvider
        .state('dash', {
            url: "/dash.html",
            templateUrl: "views/dash.html",
            data: {pageTitle: "系统主页"},
            controller: "DashController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/DashController.js',
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCategoryList', {
            url: "/system/dictionary/category/list.html",
            templateUrl: "views/system/dictionary/category/list.html",
            data: {
                pageTitle: "码表管理",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "", class: "", title: "码表管理"}
                ]
            },
            controller: "DictionaryCategoryListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCategoryController.js',
                            'app/services/system/dictionary/DictionaryCategoryService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCategoryCreate', {
            url: "/system/dictionary/category/create.html",
            templateUrl: "views/system/dictionary/category/edit.html",
            data: {
                pageTitle: "新增码表",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表管理"},
                    {href: "", class: "", title: "新增码表"}
                ]
            },
            controller: "DictionaryCategoryEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/dictionary/DictionaryCategoryController.js',
                            'app/services/system/dictionary/DictionaryCategoryService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCategoryEdit', {
            url: "/system/dictionary/category/edit.html",
            templateUrl: "views/system/dictionary/category/edit.html",
            data: {
                pageTitle: "编辑码表",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表管理"},
                    {href: "", class: "", title: "编辑码表"}
                ]
            },
            controller: "DictionaryCategoryEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/dictionary/DictionaryCategoryController.js',
                            'app/services/system/dictionary/DictionaryCategoryService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCategoryView', {
            url: "/system/dictionary/category/view.html",
            templateUrl: "views/system/dictionary/category/view.html",
            data: {
                pageTitle: "查看码表类型信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表类型管理"},
                    {href: "", class: "", title: "查看码表类型信息"}
                ]
            },
            controller: "DictionaryCategoryViewController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/dictionary/DictionaryCategoryController.js',
                            'app/services/system/dictionary/DictionaryCategoryService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCodeList', {
            url: "/system/dictionary/code/list.html",
            templateUrl: "views/system/dictionary/code/list.html",
            data: {
                pageTitle: "码表代码管理",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表管理"},
                    {href: "", class: "", title: "查看代码"}
                ]
            },
            controller: "DictionaryCodeListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCodeController.js',
                            'app/services/system/dictionary/DictionaryCodeService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCodeCreate', {
            url: "/system/dictionary/code/create.html",
            templateUrl: "views/system/dictionary/code/edit.html",
            data: {
                pageTitle: "新增码表代码",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表管理"},
                    {href: "#/system/dictionary/code/list.html", class: "", title: "查看代码"},
                    {href: "", class: "", title: "新增码表代码"}
                ]
            },
            controller: "DictionaryCodeEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCodeController.js',
                            'app/services/system/dictionary/DictionaryCodeService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCodeEdit', {
            url: "/system/dictionary/code/edit.html",
            templateUrl: "views/system/dictionary/code/edit.html",
            data: {
                pageTitle: "编辑码表代码",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表管理"},
                    {href: "#/system/dictionary/code/list.html", class: "", title: "查看代码"},
                    {href: "", class: "", title: "编辑码表代码"}
                ]
            },
            controller: "DictionaryCodeEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCodeController.js',
                            'app/services/system/dictionary/DictionaryCodeService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCodeView', {
            url: "/system/dictionary/code/view.html",
            templateUrl: "views/system/dictionary/code/view.html",
            data: {
                pageTitle: "查看码表代码",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表管理"},
                    {href: "#/system/dictionary/code/list.html", class: "", title: "查看代码"},
                    {href: "", class: "", title: "查看码表代码"}
                ]
            },
            controller: "DictionaryCodeEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCodeController.js',
                            'app/services/system/dictionary/DictionaryCodeService.js'
                        ]
                    });
                }]
            }
        })
        .state('menuList', {
            url: "/system/menu/list.html",
            templateUrl: "views/system/menu/list.html",
            data: {
                pageTitle: "菜单管理",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "", class: "", title: "菜单管理"}
                ]
            },
            controller: "MenuListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/menu/MenuController.js',
                            'app/services/system/menu/MenuService.js'
                        ]
                    });
                }]
            }
        })
        .state('menuCreate', {
            url: "/system/menu/create.html",
            templateUrl: "views/system/menu/edit.html",
            data: {
                pageTitle: "新增菜单",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/menu/list.html", class: "", title: "菜单管理"},
                    {href: "", class: "", title: "新增菜单"}
                ]
            },
            controller: "MenuEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/menu/MenuController.js',
                            'app/services/system/menu/MenuService.js'
                        ]
                    });
                }]
            }
        })
        .state('menuEdit', {
            url: "/system/menu/edit.html",
            templateUrl: "views/system/menu/edit.html",
            data: {
                pageTitle: "编辑菜单",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/menu/list.html", class: "", title: "菜单管理"},
                    {href: "", class: "", title: "编辑菜单"}
                ]
            },
            controller: "MenuEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/menu/MenuController.js',
                            'app/services/system/menu/MenuService.js'
                        ]
                    });
                }]
            }
        })
        .state('menuView', {
            url: "/system/menu/view.html",
            templateUrl: "views/system/menu/view.html",
            data: {
                pageTitle: "查看菜单",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/menu/list.html", class: "", title: "菜单管理"},
                    {href: "", class: "", title: "查看菜单"}
                ]
            },
            controller: "MenuEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/menu/MenuController.js',
                            'app/services/system/menu/MenuService.js'
                        ]
                    });
                }]
            }
        })




        .state('roleList', {
            url: "/system/role/list.html",
            templateUrl: "views/system/role/list.html",
            data: {
                pageTitle: "角色管理",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "", class: "", title: "角色管理"}
                ]
            },
            controller: "RoleListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/role/RoleController.js',
                            'app/services/system/role/RoleService.js'
                        ]
                    });
                }]
            }
        })
        .state('roleCreate', {
            url: "/system/role/create.html",
            templateUrl: "views/system/role/edit.html",
            data: {
                pageTitle: "新增角色",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/role/list.html", class: "", title: "角色管理"},
                    {href: "", class: "", title: "新增角色"}
                ]
            },
            controller: "RoleEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/role/RoleController.js',
                            'app/services/system/role/RoleService.js'
                        ]
                    });
                }]
            }
        })
        .state('roleEdit', {
            url: "/system/role/edit.html",
            templateUrl: "views/system/role/edit.html",
            data: {
                pageTitle: "编辑角色",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/role/list.html", class: "", title: "角色管理"},
                    {href: "", class: "", title: "编辑角色"}
                ]
            },
            controller: "RoleEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/role/RoleController.js',
                            'app/services/system/role/RoleService.js'
                        ]
                    });
                }]
            }
        })
        .state('roleView', {
            url: "/system/role/view.html",
            templateUrl: "views/system/role/view.html",
            data: {
                pageTitle: "查看角色",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/role/list.html", class: "", title: "角色管理"},
                    {href: "", class: "", title: "查看角色"}
                ]
            },
            controller: "RoleEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/role/RoleController.js',
                            'app/services/system/role/RoleService.js'
                        ]
                    });
                }]
            }
        })




        .state('platformOrgUserList', {
            url: "/platform/userList.html",
            templateUrl: "views/platform/userList.html",
            data: {
                pageTitle: "用户管理",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "平台组织管理"},
                    {href: "", class: "", title: "用户列表"}
                ]
            },
            controller: "PlatformController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/platform/PlatformController.js',
                            'app/services/platform/PlatformService.js'
                        ]
                    });
                }]
            }
        })

        //账户安全
        .state('securityList', {
            url: "/security/list.html",
            templateUrl: "views/security/list.html",
            data: {
                pageTitle: "账户安全",
                pageBar: [
                    {href: "", class: "", title: "账户安全"}
                ]
            },
            controller: "SecurityListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/security/SecurityController.js',
                            'app/services/security/SecurityService.js'
                        ]
                    });
                }]
            }
        })
        .state('securityEdit', {
            url: "/security/passwordedit.html",
            templateUrl: "views/security/passwordedit.html",
            data: {
                pageTitle: "密码修改",
                pageBar: [
                    {href: "", class: "", title: "密码修改"},
                ]
            },
            controller: "SecurityEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/security/SecurityController.js',
                            'app/services/security/SecurityService.js'
                        ]
                    });
                }]
            }
        })
        .state('securityPhoneEdit', {
            url: "/security/phoneedit.html",
            templateUrl: "views/security/phoneedit.html",
            data: {
                pageTitle: "手机绑定",
                pageBar: [
                    {href: "", class: "", title: "手机绑定"},
                ]
            },
            controller: "SecurityPhoneEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/security/SecurityController.js',
                            'app/services/security/SecurityService.js'
                        ]
                    });
                }]
            }
        })
        .state('securityEmailEdit', {
            url: "/security/emailedit.html",
            templateUrl: "views/security/emailedit.html",
            data: {
                pageTitle: "邮箱绑定",
                pageBar: [
                    {href: "", class: "", title: "邮箱绑定"},
                ]
            },
            controller: "SecurityEmailEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/security/SecurityController.js',
                            'app/services/security/SecurityService.js'
                        ]
                    });
                }]
            }
        })
        .state('securityOkPassword', {
            url: "/security/okpassword.html",
            templateUrl: "views/security/okpassword.html",
            data: {
                pageTitle: "密码修改",
                pageBar: [
                    {href: "", class: "", title: "密码修改"}
                ]
            },
            controller: "SecurityEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/security/SecurityController.js',
                            'app/services/security/SecurityService.js'
                        ]
                    });
                }]
            }
        })
        .state('securityOkPhone', {
            url: "/security/okphone.html",
            templateUrl: "views/security/okphone.html",
            data: {
                pageTitle: "手机号修改",
                pageBar: [
                    {href: "", class: "", title: "手机号修改"}
                ]
            },
            controller: "SecurityPhoneEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/security/SecurityController.js',
                            'app/services/security/SecurityService.js'
                        ]
                    });
                }]
            }
        })
        .state('securityOkEmail', {
            url: "/security/okemail.html",
            templateUrl: "views/security/okemail.html",
            data: {
                pageTitle: "邮箱修改",
                pageBar: [
                    {href: "", class: "", title: "邮箱修改"}
                ]
            },
            controller: "SecurityEmailEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/security/SecurityController.js',
                            'app/services/security/SecurityService.js'
                        ]
                    });
                }]
            }
        })

        //over

        //我的企业
        .state('companyList', {
                url: "/company/list.html",
                templateUrl: "views/company/list.html",
                data: {
                    pageTitle: "我的企业",
                    pageBar: [
                        {href: "", class: "", title: "我的企业"}
                    ]
                },
                controller: "CompanyListController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/directives/ngList/directive.js',
                                'app/directives/ngTable/directive.js',
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })
            .state('companyCreate', {
                url: "/company/create.html",
                templateUrl: "views/company/edit.html",
                data: {
                    pageTitle: "新增我的企业",
                    pageBar: [
                        {href: "", class: "", title: "新增我的企业"},
                    ]
                },
                controller: "CompanyEditController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })
            .state('companyEdit', {
                url: "/company/edit.html",
                templateUrl: "views/company/edit.html",
                data: {
                    pageTitle: "编辑我的企业",
                    pageBar: [
                        {href: "", class: "", title: "编辑我的企业"},
                    ]
                },
                controller: "CompanyEditController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })
            .state('companyView', {
                url: "/company/view.html",
                templateUrl: "views/company/view.html",
                data: {
                    pageTitle: "查看我的企业",
                    pageBar: [
                        {href: "", class: "", title: "菜单管理"},
                    ]
                },
                controller: "CompanyViewController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/directives/ngTable/directive.js',
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })
            .state('companyApplyHistoryView', {
                url: "/company/joinCompany/applyHistoryView.html",
                templateUrl: "views/company/joinCompany/applyHistoryView.html",
                data: {
                    pageTitle: "查看申请历程",
                    pageBar: [
                        {href: "", class: "", title: "查看申请历程"},
                    ]
                },
                controller: "ApplyHistoryViewController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/directives/ngTable/directive.js',
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })
            .state('companyInviteHistoryView', {
                url: "/company/joinCompany/inviteHistory.html",
                templateUrl: "views/company/joinCompany/inviteHistory.html",
                data: {
                    pageTitle: "查看邀请历程",
                    pageBar: [
                        {href: "", class: "", title: "查看邀请历程"},
                    ]
                },
                controller: "InviteHistoryViewController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/directives/ngTable/directive.js',
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })
        .state('invitePeopelList', {
                url: "/company/createCompany/invitePeopelList.html",
                templateUrl: "views/company/createCompany/invitePeopelList.html",
                data: {
                    pageTitle: "邀请人员加入",
                    pageBar: [
                        {href: "", class: "", title: "邀请人员加入"},
                    ]
                },
                controller: "InvitePeopelListController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/directives/ngList/directive.js',
                                'app/directives/ngTable/directive.js',
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })
        .state('applyJoinView', {
                url: "/company/createCompany/applyJoinView.html",
                templateUrl: "views/company/createCompany/applyJoinView.html",
                data: {
                    pageTitle: "查看加入申请",
                    pageBar: [
                        {href: "", class: "", title: "查看加入申请"},
                    ]
                },
                controller: "ApplyJoinViewController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/directives/ngTable/directive.js',
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })
        .state('invitePeopleHistoryView', {
                url: "/company/createCompany/inviteHistory.html",
                templateUrl: "views/company/createCompany/inviteHistoryList.html",
                data: {
                    pageTitle: "查看邀请记录",
                    pageBar: [
                        {href: "", class: "", title: "查看邀请记录"},
                    ]
                },
                controller: "InviteHistoryListController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/directives/ngTable/directive.js',
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })
        .state('searchJoinCompany', {
                url: "/company/joinCompany/searchJoinCompany.html",
                templateUrl: "views/company/joinCompany/searchJoinCompany.html",
                data: {
                    pageTitle: "申请加入企业",
                    pageBar: [
                        {href: "", class: "", title: "申请加入企业"},
                    ]
                },
                controller: "SearchJoinCompanyController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/directives/ngTable/directive.js',
                                'app/directives/ngList/directive.js',
                                'app/controllers/company/CompanyController.js',
                                'app/services/company/CompanyService.js'
                            ]
                        });
                    }]
                }
            })

            //我的个人资料
            .state('informationList', {
                url: "/information/list.html",
                templateUrl: "views/information/list.html",
                data: {
                    pageTitle: "个人中心",
                    pageBar: [
                        {href: "", class: "", title: "个人资料"}
                    ]
                },
                controller: "InformationListController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/directives/ngTable/directive.js',
                                'app/controllers/information/InformationController.js',
                                'app/services/information/InformationService.js'
                            ]
                        });
                    }]
                }
            })
            .state('informationCreate', {
                url: "/information/create.html",
                templateUrl: "views/information/edit.html",
                data: {
                    pageTitle: "新增我的资料",
                    pageBar: [
                        {href: "", class: "", title: "新增我的资料"},
                    ]
                },
                controller: "InformationEditController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/controllers/information/InformationController.js',
                                'app/services/information/InformationService.js'
                            ]
                        });
                    }]
                }
            })
            .state('informationEdit', {
                url: "/information/edit.html",
                templateUrl: "views/information/edit.html",
                data: {
                    pageTitle: "编辑我的资料",
                    pageBar: [
                        {href: "", class: "", title: "个人信息编辑"},
                    ]
                },
                controller: "InformationEditController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/controllers/information/InformationController.js',
                                'app/services/information/InformationService.js'
                            ]
                        });
                    }]
                }
            })
            .state('informationView', {
                url: "/information/view.html",
                templateUrl: "views/information/view.html",
                data: {
                    pageTitle: "查看我的资料",
                    pageBar: [
                        {href: "", class: "", title: "菜单管理"},
                    ]
                },
                controller: "InformationEditController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                'app/controllers/information/InformationController.js',
                                'app/services/information/InformationService.js'
                            ]
                        });
                    }]
                }
            })


        //我的合同
        .state('myContractList', {
            url: "/myContract/list.html",
            templateUrl: "views/myContract/list.html",
            data: {
                pageTitle: "我的合同",
                pageBar: [
                    {href: "", class: "", title: "我的合同"}
                ]
            },
            controller: "MyContractListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myContract/MyContractController.js',
                            'app/services/myContract/MyContractService.js'
                        ]
                    });
                }]
            }
        })
        .state('myContractEdit', {
            url: "/myContract/edit.html",
            templateUrl: "views/myContract/edit.html",
            data: {
                pageTitle: "我的合同",
                pageBar: [
                    {href: "", class: "", title: "我的合同"}
                ]
            },
            controller: "MyContractEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/directives/ngTableInput/directive.js',
                            'app/controllers/myContract/MyContractController.js',
                            'app/services/myContract/MyContractService.js'
                        ]
                    });
                }]
            }
        })
        .state('myContractView', {
            url: "/myContract/view.html",
            templateUrl: "views/myContract/view.html",
            data: {
                pageTitle: "我的合同",
                pageBar: [
                    {href: "", class: "", title: "我的合同"}
                ]
            },
            controller: "MyContractViewController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myContract/MyContractController.js',
                            'app/services/myContract/MyContractService.js'
                        ]
                    });
                }]
            }
        })
        //我的团队列表页（包含创建/加入）
        .state('myTeamList', {
            url: "/myTeam/list.html",
            templateUrl: "views/myTeam/list.html",
            data: {
                pageTitle: "我的团队",
                pageBar: [
                    {href: "", class: "", title: "我的团队"}
                ]
            },
            controller: "MyTeamListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/directives/ngList/directive.js',
                            'app/controllers/myTeam/MyTeamController.js',
                            'app/services/myTeam/MyTeamService.js'
                        ]
                    });
                }]
            }
        })
        //我的团队详情（包含创建/加入）
        .state('myTeamView', {
            url: "/myTeam/view.html",
            templateUrl: "views/myTeam/view.html",
            data: {
                pageTitle: "我的团队",
                pageBar: [
                    {href: "", class: "", title: "团队详情"}
                ]
            },
            controller: "MyTeamViewController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myTeam/MyTeamViewController.js',
                            'app/services/myTeam/MyTeamViewService.js'
                        ]
                    });
                }]
            }
        })
        //我创建的团队---创建团队
        .state('createTeam', {
            url: "/myTeam/myCreateTeam/createTeam.html",
            templateUrl: "views/myTeam/myCreateTeam/createTeam.html",
            data: {
                pageTitle: "我的团队",
                pageBar: [
                    {href: "", class: "", title: "创建团队"}
                ]
            },
            controller: "CreateTeamController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myTeam/CreateTeamController.js',
                            'app/services/myTeam/CreateTeamService.js'
                        ]
                    });
                }]
            }
        })
        //我创建的团队---邀请人员加入
        .state('inviteJoin', {
            url: "/myTeam/myCreateTeam/inviteJoin.html",
            templateUrl: "views/myTeam/myCreateTeam/inviteJoin.html",
            data: {
                pageTitle: "我的团队",
                pageBar: [
                    {href: "", class: "", title: "邀请人员加入"}
                ]
            },
            controller: "InviteJoinController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngList/directive.js',
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myTeam/InviteJoinController.js',
                            'app/services/myTeam/InviteJoinService.js'
                        ]
                    });
                }]
            }
        })
        //我创建的团队---查看所有申请人员
        .state('viewAllJoin', {
            url: "/myTeam/myCreateTeam/viewAllJoin.html",
            templateUrl: "views/myTeam/myCreateTeam/viewAllJoin.html",
            data: {
                pageTitle: "我的团队",
                pageBar: [
                    {href: "", class: "", title: "创建团队"}
                ]
            },
            controller: "ViewAllJoinController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myTeam/ViewAllJoinController.js',
                            'app/services/myTeam/ViewAllJoinService.js'
                        ]
                    });
                }]
            }
        })
        //我创建的团队---查看申请人员信息
        .state('viewJoinPersonInfo', {
            url: "/myTeam/myCreateTeam/viewJoinPersonInfo.html",
            templateUrl: "views/myTeam/myCreateTeam/viewJoinPersonInfo.html",
            data: {
                pageTitle: "申请加入我的团队的人员信息",
                pageBar: [
                    {href: "", class: "", title: "申请加入我的团队的人员信息"}
                ]
            },
            controller: "ViewJoinPersonInfoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myTeam/ViewAllJoinController.js',
                            'app/services/myTeam/ViewAllJoinService.js'
                        ]
                    });
                }]
            }
        })
        //我创建的团队---查看我的邀请请历程
        .state('viewMyInvite', {
            url: "/myTeam/myCreateTeam/viewMyInvite.html",
            templateUrl: "views/myTeam/myCreateTeam/viewMyInvite.html",
            data: {
                pageTitle: "我的团队",
                pageBar: [
                    {href: "", class: "", title: "创建团队"}
                ]
            },
            controller: "ViewMyInviteController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myTeam/ViewMyInviteController.js',
                            'app/services/myTeam/ViewMyInviteService.js'
                        ]
                    });
                }]
            }
        })
        //我加入的团队---申请加入其他团队
        .state('applyForJoin', {
            url: "/myTeam/myJoinTeam/applyForJoin.html",
            templateUrl: "views/myTeam/myJoinTeam/applyForJoin.html",
            data: {
                pageTitle: "我的团队",
                pageBar: [
                    {href: "", class: "", title: "创建团队"}
                ]
            },
            controller: "ApplyForJoinController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/directives/ngCheckbox/directive.js',
                            'app/directives/ngList/directive.js',
                            'app/controllers/myTeam/ApplyForJoinController.js',
                            'app/services/myTeam/ApplyForJoinService.js'
                        ]
                    });
                }]
            }
        })
        //我加入的团队---查看我的申请历程
        .state('viewMyApply', {
            url: "/myTeam/myJoinTeam/viewMyApply.html",
            templateUrl: "views/myTeam/myJoinTeam/viewMyApply.html",
            data: {
                pageTitle: "我的团队",
                pageBar: [
                    {href: "", class: "", title: "创建团队"}
                ]
            },
            controller: "ViewMyApplyController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myTeam/ViewMyApplyController.js',
                            'app/services/myTeam/ViewMyApplyService.js'
                        ]
                    });
                }]
            }
        })
        //我加入的团队---查看邀请我的团队
        .state('viewAllInviteMe', {
            url: "/myTeam/myJoinTeam/viewAllInviteMe.html",
            templateUrl: "views/myTeam/myJoinTeam/viewAllInviteMe.html",
            data: {
                pageTitle: "我的团队",
                pageBar: [
                    {href: "", class: "", title: "创建团队"}
                ]
            },
            controller: "ViewAllInviteMeController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/myTeam/ViewAllInviteMeController.js',
                            'app/services/myTeam/ViewAllInviteMeService.js'
                        ]
                    });
                }]
            }
        })
        //我的项目
        .state('projectList', {
            url: "/project/list.html",
            templateUrl: "views/project/list.html",
            data: {
                pageTitle: "我的项目",
                pageBar: [
                    {href: "", class: "", title: "我的项目"}
                ]
            },
            controller: "ProjectListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/EnumService.js',
                            'app/controllers/project/ProjectController.js',
                            'app/services/project/ProjectService.js'
                        ]
                    });
                }]
            }
        })
        //我的项目--立项
        .state('projectApproval', {
            url: "/project/approval.html",
            templateUrl: "views/project/approval.html",
            data: {
                pageTitle: "我的项目",
                pageBar: [
                    {href: "", class: "", title: "我的项目"}
                ]
            },
            controller: "ProjectApprovalController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/EnumService.js',
                            'app/controllers/project/ProjectController.js',
                            'app/services/project/ProjectService.js'
                        ]
                    });
                }]
            }
        })
        //项目变更
        .state('projectCreate', {
            url: "/project/change.html",
            templateUrl: "views/project/change.html",
            data: {
                pageTitle: "变更",
                pageBar: [
                    {href: "", class: "", title: "变更"},
                ]
            },
            controller: "ProjectChangeController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/project/ProjectController.js',
                            'app/services/project/ProjectViewService.js',
                            'app/EnumService.js'
                        ]
                    });
                }]
            }
        })
        .state('projectView', {
            url: "/project/view.html",
            templateUrl: "views/project/view.html",
            data: {
                pageTitle: "查看我的项目",
                pageBar: [
                    {href: "", class: "", title: "查看我的项目"},
                ]
            },
            controller: "ProjectViewController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/project/ProjectController.js',
                            'app/services/project/ProjectViewService.js'
                        ]
                    });
                }]
            }
        })
        .state('orderList', {
            url: "/order/list.html",
            templateUrl: "views/order/list.html",
            data: {
                pageTitle: "我的需求",
                pageBar: [
                    {href: "", class: "", title: "需求管理"},
                ]
            },
            controller: "OrderController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/order/OrderController.js',
                            'app/services/order/OrderService.js'
                        ]
                    });
                }]
            }
        })
        .state('chiefEngineer', {
            url: "/chiefEngineer/edit.html",
            templateUrl: "views/chiefEngineer/edit.html",
            data: {
                pageTitle: "编辑工作包",
                pageBar: [
                    {href: "", class: "", title: "编辑工作包"}
                ]
            },
            controller: "ChiefEngineerController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/chiefEngineer/ChiefEngineerController.js',
                            'app/services/chiefEngineer/ChiefEngineerService.js'
                        ]
                    });
                }]
            }
        })
        //我的消息开始
        .state('noticeList', {
            url: "/notice/list.html",
            templateUrl: "views/notice/list.html",
            data: {
                pageTitle: "我的消息",
                pageBar: [
                    {href: "", class: "", title: "我的消息"}
                ]
            },
            controller: "NoticeListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/notice/NoticeController.js',
                            'app/services/notice/NoticeService.js'
                        ]
                    });
                }]
            }
        }).state('emailCreate', {
        url: "/notice/emailcreate.html",
        templateUrl: "views/notice/emailEdit.html",
        data: {
            pageTitle: "新增邮件",
            pageBar: [
                {href: "", class: "", title: "新增邮件"},
            ]
        },
        controller: "NoticeEditController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'app/controllers/notice/NoticeController.js',
                        'app/services/notice/NoticeService.js'
                    ]
                });
            }]
        }
    }).state('mailCreate', {
        url: "/notice/mailcreate.html",
        templateUrl: "views/notice/mailEdit.html",
        data: {
            pageTitle: "新增站内信",
            pageBar: [
                {href: "", class: "", title: "新增站内信"},
            ]
        },
        controller: "NoticeEditController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'app/controllers/notice/NoticeController.js',
                        'app/services/notice/NoticeService.js'
                    ]
                });
            }]
        }
    }).state('noticeView', {
        url: "/notice/view.html",
        templateUrl: "views/notice/view.html",
        data: {
            pageTitle: "站内信详情",
            pageBar: [
                {href: "", class: "", title: "站内信详情"},
            ]
        },
        controller: "NoticeViewController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'app/controllers/notice/NoticeController.js',
                        'app/services/notice/NoticeService.js'
                    ]
                });
            }]
        }
    }).state('noticeReply', {
        url: "/notice/reply.html",
        templateUrl: "views/notice/reply.html",
        data: {
            pageTitle: "站内信回复",
            pageBar: [
                {href: "", class: "", title: "站内信回复"},
            ]
        },
        controller: "NoticeReplyController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'app/controllers/notice/NoticeController.js',
                        'app/services/notice/NoticeService.js'
                    ]
                });
            }]
        }
    })
    //我的消息结束

        .state('demo', {
        url: "/demo/demo.html",
        templateUrl: "views/demo/demo.html",
        data: {
            pageTitle: "demo",
            pageBar: [
                {href: "", class: "", title: "demo"}
            ]
        },
        controller: "DemoController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                      'app/directives/ngTable/directive.js',
                      'app/controllers/demo/DemoController.js',
                        'app/services/demo/DemoService.js'
                    ]
                });
            }]
        }
    })
        .state('demandCustomer', {
            url: "/demandCustomer/list.html",
            templateUrl: "views/demandCustomer/list.html",
            data: {
                pageTitle: "我的需求-客户",
                pageBar: [
                    {href: "", class: "", title: "我的需求-客户"}
                ]
            },
            controller: "DemandCustomerController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/demand/DemandCustomerController.js',
                            'app/services/demand/DemandCustomerService.js'
                        ]
                    });
                }]
            }
        })
        .state('demandCustomerView', {
            url: "/demandCustomer/view.html",
            templateUrl: "views/demandCustomer/view.html",
            data: {
                pageTitle: "需求详情",
                pageBar: [
                    {href: "", class: "", title: "需求详情"}
                ]
            },
            controller: "DemandCustomerViewController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/demand/DemandCustomerController.js',
                            'app/services/demand/DemandCustomerService.js'
                        ]
                    });
                }]
            }
        })
        .state('customer', {
            url: "/customer/list.html",
            templateUrl: "views/customer/list.html",
            data: {
                pageTitle: "我的客户",
                pageBar: [
                    {href: "", class: "", title: "我的客户"}
                ]
            },
            controller: "CustomerController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/customer/CustomerController.js',
                            'app/services/customer/CustomerService.js'
                        ]
                    });
                }]
            }
        })
        .state('demandManager', {
            url: "/demandManager/list.html",
            templateUrl: "views/demandManager/list.html",
            data: {
                pageTitle: "我的需求-商务经理",
                pageBar: [
                    {href: "", class: "", title: "我的需求-商务经理"}
                ]
            },
            controller: "DemandManagerController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/demand/DemandManagerController.js',
                            'app/services/demand/DemandManagerService.js'
                        ]
                    });
                }]
            }
        })
        .state('communicationRecord', {
            url: "/demandManager/record.html",
            templateUrl: "views/demandManager/record.html",
            data: {
                pageTitle: "沟通记录",
                pageBar: [
                    {href: "", class: "", title: "沟通记录"}
                ]
            },
            controller: "CommunicationRecordController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/demand/DemandManagerController.js',
                            'app/services/demand/CommunicationRecordService.js'
                        ]
                    });
                }]
            }
        })
        .state('offer', {
            url: "/demandManager/offer.html",
            templateUrl: "views/demandManager/offer.html",
            data: {
                pageTitle: "报价",
                pageBar: [
                    {href: "", class: "", title: "报价"}
                ]
            },
            controller: "OfferController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/demand/DemandManagerController.js',
                            'app/services/demand/OfferService.js'
                        ]
                    });
                }]
            }
        })
        .state('demandView', {
            url: "/demandManager/view.html",
            templateUrl: "views/demandManager/view.html",
            data: {
                pageTitle: "需求简介",
                pageBar: [
                    {href: "", class: "", title: "需求简介"}
                ]
            },
            controller: "DemandManagerViewController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/demand/DemandManagerController.js',
                            'app/services/demand/DemandManagerService.js',
                            'app/services/demand/CommunicationRecordService.js'
                        ]
                    });
                }]
            }
        })
        .state('account', {
            url: "/account/list.html",
            templateUrl: "views/account/list.html",
            data: {
                pageTitle: "我的账户",
                pageBar: [
                    {href: "", class: "", title: "我的账户"}
                ]
            },
            controller: "AccountController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/account/AccountController.js',
                            'app/services/account/AccountService.js'
                        ]
                    });
                }]
            }
        })
        //我的账户-提现记录
        .state('accountRecord', {
            url: "/account/presentRecord.html",
            templateUrl: "views/account/presentRecord.html",
            data: {
                pageTitle: "我的账户-提现记录",
                pageBar: [
                    {href: "", class: "", title: "提现记录"}
                ]
            },
            controller: "RresentRecordController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/account/AccountController.js',
                            'app/services/account/PresentRecordService.js'
                        ]
                    });
                }]
            }
        })
        //我的工作包
        .state('wbsList', {
            url: "/wbs/list.html",
            templateUrl: "views/wbs/list.html",
            data: {
                pageTitle: "我的工作包",
                pageBar: [
                    {href: "", class: "", title: "我的工作包"}
                ]
            },
            controller: "WbsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/wbs/WbsController.js',
                            'app/services/wbs/WbsService.js'
                        ]
                    });
                }]
            }
        })
        //我的工作包-查看
        .state('wbsViewList', {
            url: "/wbs/view.html",
            templateUrl: "views/wbs/view.html",
            data: {
                pageTitle: "我的工作包-查看",
                pageBar: [
                    {href: "", class: "", title: "我的投标"}
                ]
            },
            controller: "WbsViewController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/wbs/WbsController.js',
                            'app/services/wbs/WbsViewService.js'
                        ]
                    });
                }]
            }
        })

        //敏感词列表
        .state('antispamWordList', {
            url: "/antispamWord/list.html",
            templateUrl: "views/antispamWord/list.html",
            data: {
                pageTitle: "敏感词管理",
                pageBar: [
                    {href: "", class: "", title: "敏感词管理"}
                ]
            },
            controller: "AntispamWordListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/antispamWord/AntispamWordListController.js',
                            'app/services/antispamWord/AntispamWordService.js'
                        ]
                    });
                }]
            }
        })

        //敏感词查看
        .state('antispamWordView', {
            url: "/antispamWord/view.html",
            templateUrl: "views/antispamWord/view.html",
            data: {
                pageTitle: "敏感词管理",
                pageBar: [
                    {href: "", class: "", title: "敏感词查看"}
                ]
            },
            controller: "AntispamWordViewController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/antispamWord/AntispamWordViewController.js',
                            'app/services/antispamWord/AntispamWordService.js'
                        ]
                    });
                }]
            }
        })

        //敏感词添加、修改
        .state('antispamWordEdit', {
            url: "/antispamWord/edit.html",
            templateUrl: "views/antispamWord/edit.html",
            data: {
                pageTitle: "敏感词编辑",
                pageBar: [
                    {href: "", class: "", title: "敏感词编辑"}
                ]
            },
            controller: "AntispamWordEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/antispamWord/AntispamWordEditController.js',
                            'app/services/antispamWord/AntispamWordService.js'
                        ]
                    });
                }]
            }
        })
}]);

/* Init global settings and run the app */
angular.module("MetronicApp").run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);