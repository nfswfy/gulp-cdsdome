/*** 共通指令
 *  GLobal Directives
 * Created by zhangsb on 2017/10/18.
 */
// Route State Load Spinner(used on page or content load)
angular.module("MetronicApp").directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        //Metronic.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                $rootScope.$on('dataRequestStart', function() {
                    element.removeClass('hide'); // show spinner bar
                    $('body').css("overflow","hidden");
                    $("#cover").show();
                });
                $rootScope.$on('dataRequestEnd', function() {
                    element.addClass('hide'); // show spinner bar
                    $('body').css("overflow","auto");
                    $("#cover").hide();
                });
            }
        };
    }
]);

// Handle global LINK click
angular.module("MetronicApp").directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
angular.module("MetronicApp").directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});

// custom jstree directive
angular.module("MetronicApp").directive('jsTree', ['$http', function($http) {

    var treeDir = {
        restrict: 'EA',
        fetchResource: function(url, cb) {
            return $http.get(url).then(function(data) {
                if (cb) cb(data.data);
            });
        },

        managePlugins: function(s, e, a, config) {
            if (a.treePlugins) {
                config.plugins = a.treePlugins.split(',');
                config.core = config.core || {};
                config.core.check_callback = config.core.check_callback || true;

                if (config.plugins.indexOf('state') >= 0) {
                    config.state = config.state || {};
                    config.state.key = a.treeStateKey;
                }

                if (config.plugins.indexOf('search') >= 0) {
                    var to = false;
                    if (e.next().attr('class') !== 'ng-tree-search') {
                        e.after('<input type="text" placeholder="Search Tree" class="ng-tree-search"/>')
                            .next()
                            .on('keyup', function(ev) {
                                if (to) {
                                    clearTimeout(to);
                                }
                                to = setTimeout(function() {
                                    treeDir.tree.jstree(true).search(ev.target.value);
                                }, 250);
                            });
                    }
                }

                if (config.plugins.indexOf('checkbox') >= 0) {
                    if (a.treeCheckbox) {
                        config.checkbox = s[a.treeCheckbox];
                    }
                    config.checkbox = config.checkbox || {};
                    config.checkbox.keep_selected_style = false;
                }

                if (config.plugins.indexOf('contextmenu') >= 0) {
                    if (a.treeContextmenu) {
                        config.contextmenu = config.contextmenu || {};

                        if (a.treeContextmenuaction != undefined) {
                            config.contextmenu.items = function(e) {
                                return s.$eval(a.treeContextmenuaction)(e);
                            }
                        } else {
                            config.contextmenu.items = function() {
                                return s[a.treeContextmenu];
                            }
                        }
                    }
                }

                if (config.plugins.indexOf('types') >= 0) {
                    if (a.treeTypes) {
                        config.types = s[a.treeTypes];
                    }
                }

                if (config.plugins.indexOf('dnd') >= 0) {
                    if (a.treeDnd) {
                        config.dnd = s[a.treeDnd];
                    }
                }
                if (config.plugins.indexOf('sort') >= 0) {
                    if (a.treeSort) {
                        config.sort = s[a.treeSort];
                    }
                }
            }
            return config;
        },
        manageEvents: function(s, e, a) {
            if (a.treeEvents) {
                var evMap = a.treeEvents.split(';');
                for (var i = 0; i < evMap.length; i++) {
                    if (evMap[i].length > 0) {
                        // plugins could have events with suffixes other than '.jstree'
                        var evt = evMap[i].split(':')[0];
                        if (evt.indexOf('.') < 0) {
                            evt = evt + '.jstree';
                        }
                        var cb = evMap[i].split(':')[1];
                        treeDir.tree.on(evt, s[cb]);
                    }
                }
            }
        },
        link: function(s, e, a) { // scope, element, attribute \O/
            $(function() {
                var config = {};

                // users can define 'core'
                config.core = {};
                if (a.treeCore) {
                    config.core = $.extend(config.core, s[a.treeCore]);
                }

                // clean Case
                a.treeData = a.treeData ? a.treeData.toLowerCase() : '';
                a.treeSrc = a.treeSrc ? a.treeSrc.toLowerCase() : '';

                if (a.treeData == 'html') {
                    treeDir.fetchResource(a.treeSrc, function(data) {
                        e.html(data);
                        treeDir.init(s, e, a, config);
                    });
                } else if (a.treeData == 'json') {
                    treeDir.fetchResource(a.treeSrc, function(data) {
                        config.core.data = data;
                        treeDir.init(s, e, a, config);
                    });
                } else if (a.treeData == 'scope') {
                    s.$watch(a.treeModel, function(n, o) {
                        if (n) {
                            config.core.data = s[a.treeModel];
                            $(e).jstree('destroy');
                            treeDir.init(s, e, a, config);
                        }
                    }, true);
                    // Trigger it initally
                    // Fix issue #13
                    config.core.data = s[a.treeModel];
                    treeDir.init(s, e, a, config);
                } else if (a.treeAjax) {
                    config.core.data = {
                        'url': a.treeAjax,
                        'data': function(node) {
                            return {
                                'id': node.id != '#' ? node.id : 1
                            };
                        }
                    };
                    treeDir.init(s, e, a, config);
                }
            });

        },
        init: function(s, e, a, config) {
            treeDir.managePlugins(s, e, a, config);
            this.tree = $(e).jstree(config);
            treeDir.manageEvents(s, e, a);
        }
    };

    return treeDir;

}]).directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
        }
    };
});
angular.module("MetronicApp").directive('enterSearch', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            elem.bind('keypress', function (event) {
                if (event.keyCode == "13") {
                    scope[attr.enterSearch]();
                }
            });
        }
    };
});

angular.module("MetronicApp").directive('changeSearch', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            elem.bind('change', function () {
                scope[attr.changeSearch]();
            });
        }
    };
});




