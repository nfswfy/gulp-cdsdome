angular.module("MetronicApp").controller('InformationListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'InformationService',
        function ($rootScope, $scope, $location, $uibModal, toastr, InformationService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $('#information a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
                $scope.$apply();
            });


            $scope.customerId = 52;
            $scope.showButton = true;
            InformationService.getInfo($scope.customerId).$promise.then(function (result) {
                $scope.model = result.data;
                //storage page state
                if ($scope.model.isQualification == true) {
                    $scope.showButton = false;
                }
            });
            InformationService.get($scope.customerId).$promise.then(function (result) {
                $scope.model = result.data;
                //storage page state
            });

            // //ng-table about
            // $scope.columns = InformationService.getSchema();
            // $scope.sort = InformationService.getSort();
            // $scope.order = InformationService.getOrder();
            // $scope.pageable = InformationService.getPageable();
            //
            //
            //method of fetch list data
            $('#myTab a').click(function (e) {
                e.preventDefault();
                if ($(this).context.attributes.href.value == '#password') {
                    $scope.flag = false;
                    $scope.$apply();
                }
                if ($(this).context.attributes.href.value == '#dynamic') {
                    $scope.flag = true;
                    $scope.$apply();
                }
                console.log($scope.flag);
                $(this).tab('show');
            });
            $scope.list = function () {
                InformationService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };


            //跳转页面并传递参数

            $scope.create = function () {
                $location.path("/information/edit.html").search({});
            };
            $scope.up = function (id) {
                $location.path("/information/view.html").search({"id": id});
            };
            $scope.search = function () {
                InformationService.putSearchParams(
                    {
                        name: $scope.condition.key,
                        approveStep: $scope.condition.approveStep
                    }
                );
                gotoFirstPage();
            };
        }
    ]
).controller('InformationEditController',
    ['$rootScope', '$scope', '$location', 'toastr', 'InformationService', 'EnumService', '$uibModal', 'FileStorageService',
        function ($rootScope, $scope, $location, toastr, InformationService, EnumService, $uibModal, FileStorageService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.condition = {};
            $scope.baseInfo = true;
            $scope.certification = false;
            $scope.qualification = false;
            $('#information a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
                if ($(this).context.attributes.href.value == '#base-info') {
                    $scope.qualification = false;
                    $scope.baseInfo = true;
                    $scope.certification = false;
                    $scope.$apply();
                }
                if ($(this).context.attributes.href.value == '#certification') {
                    $scope.certification = true;
                    $scope.baseInfo = false;
                    $scope.qualification = false;
                    $scope.$apply();
                }
                if ($(this).context.attributes.href.value == '#qualification') {
                    $scope.qualification = true;
                    $scope.baseInfo = false;
                    $scope.certification = false;
                    $scope.$apply();
                }
            });
            $('#editTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
            $('#editTab1 a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
            $('#editTab2 a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });

            $scope.id = $location.search().id;
            $scope.check = $location.$$url.indexOf("check");
            $scope.model = {};
            $scope.model.id = 52;
            $scope.showButton = true;


            $scope.submitBaseInfo = function (form) {
                //form.$submitted = true;


                InformationService.save($scope.model).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $rootScope.$broadcast("initMenuEvent", true);
                        toastr.success("", "菜单信息保存成功");
                        $location.path("/information/list.html").search({"id": $scope.id});
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "菜单信息保存失败");
                        }
                    }
                });

            };
            $scope.submitCertification = function (form) {
                // form.$submitted = true;
                $scope.showButton = false;
                // if (form.$valid) {

                InformationService.saveRealName($scope.model).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $rootScope.$broadcast("initMenuEvent", true);
                        toastr.success("", "菜单信息保存成功");
                        $location.path("/information/list.html").search({
                            "id": $scope.id,
                            "showButton": $scope.showButton
                        });
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "菜单信息保存失败");
                        }
                    }
                });

                // }
            };
            $scope.submitQualification = function (form) {
                // form.$submitted = true;
                $scope.showButton = false;
                // if (form.$valid) {
                InformationService.saveQualifications($scope.model).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $rootScope.$broadcast("initMenuEvent", true);
                        toastr.success("", "菜单信息保存成功");
                        $location.path("/information/list.html").search({
                            "id": $scope.id,
                            "showButton": $scope.showButton
                        });
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "菜单信息保存失败");
                        }
                    }
                });
                // }
            };

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };
            $scope.back = function () {
                $location.path("/information/list.html").search({"id": $scope.id})
            };


            //活动图片上传
            $scope.fileSuccess = false;
            $scope.success = false;
            //活动图片上传
            $scope.pictureIdFileAdded = function ($files, $event, $flow) {
                $scope.fileSuccess = true;
                $scope.success = false;
                var typePattern = new RegExp(".+(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$");
                FileStorageService.validatePhoto($files, typePattern);
            };
            $scope.pictureIdFileError = function ($file, $event, $flow) {
                FileStorageService.clearFlowFile($flow);
            };

            $scope.pictureIdFileSuccess = function ($file, $message, $flow) {
                var result = $.parseJSON($message);
                if (result.status === "success") {
                    if (result.data && result.data[0]) {
                        $scope.model.thumbnail = result.data[0].no;
                        var pictureIdModel = {
                            id: result.data[0].id,
                            no: result.data[0].no,
                            name: result.data[0].fileName,
                            url: FileStorageService.getPhotoDownloadUrl(result.data[0].no, "original")
                        };
                        $scope.model.photo = pictureIdModel;
                        $scope.model.pictureUrl = pictureIdModel.url;

                    }
                    $scope.fileSuccess = false;
                    $scope.success = true;
                }
            };
            $scope._simpleConfig = {
                toolbars: [[
                    'fullscreen', 'source', '|', 'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                    'directionalityltr', 'directionalityrtl', 'indent', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                    'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                    'emotion', 'map', 'insertframe', 'insertcode', 'pagebreak', 'template', 'background', '|',
                    'horizontal', 'date', 'time', 'spechars', '|',
                    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                    'print', 'preview', 'searchreplace', 'help', 'drafts'
                ]],
                //输入框高度
                initialFrameHeight: 250,
                //focus时自动清空初始化时的内容
                autoClearinitialContent: true,
                //关闭字数统计
                wordCount: true,
                //关闭elementPath
                elementPathEnabled: false
            };
        }
    ]
).controller('InformationViewController',
    ['$rootScope', '$scope', '$location', 'toastr', 'InformationService', 'EnumService', '$uibModal', 'ModificationLogService', 'ServerService',
        function ($rootScope, $scope, $location, toastr, InformationService, EnumService, $uibModal, ModificationLogService, ServerService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;

            $scope.back = function () {
                if ($location.$$url.indexOf("check") != -1) {
                    $location.path("/node/check/list.html").search({});
                } else {
                    $location.path("/node/list.html").search({});
                }
            };

            //--------------------------------------------查看服务器2---------------------------------------------
            $scope.server = function (id) {
                $location.path("/server/list.html").search({"server": id});
            };

            //ng-table about
            $scope.columns2 = ServerService.getSchema();
            $scope.sort2 = ServerService.getSort();
            $scope.order2 = ServerService.getOrder();
            $scope.pageable2 = ServerService.getPageable();

            //method of fetch list data
            $scope.list2 = function () {
                ServerService.listWithId($scope.id).$promise.then(function (result) {
                    $scope.rows2 = result.data;
                    //storage page state
                    ServerService.setStoredPage(result.pageable.number);
                    $scope.pageable2 = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage2 = function () {
                ServerService.setStoredPage(0);
                $scope.list2();
            };
            //start to fetch list data
            $scope.condition = {};
            ServerService.clearSearchParams();
            gotoFirstPage2();

            //fetch data when the size of page changed

            $scope.create = function () {

                $location.path("/server/create.html").search({"server": $scope.id});
            };
            //search
            $scope.search = function () {
                ServerService.putSearchParams(
                    {
                        name: $scope.condition.key,
                        RunningStatus: $scope.condition.serverRunningStatus
                    }
                );
                gotoFirstPage2();
            };
            $scope.view = function (row) {
                $location.path("/server/view.html").search({"id": row.id, "server": $scope.id});
            };
            //-------------------------------------------------------------------------------------
            //--------------------------------------获取Log信息-------------------------------------
            //ng-table about
            $scope.columns = ModificationLogService.getSchema();
            $scope.sort = ModificationLogService.getSort();
            $scope.order = ModificationLogService.getOrder();
            $scope.pageable = ModificationLogService.getPageable();


            //method of fetch list data
            $scope.list = function () {
                ModificationLogService.putSearchParams(
                    {
                        objectId: $scope.id,
                        type: "NODE"
                    }
                );
                ModificationLogService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    ModificationLogService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage = function () {
                ModificationLogService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            $scope.condition = {};
            ModificationLogService.clearSearchParams();
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ModificationLogService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                ModificationLogService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ModificationLogService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                ModificationLogService.setOrder(newValue);
                $scope.list();
            });


            //--------------------------------------node信息-----------------------------------------------
            if ($scope.id) {
                //编辑
                InformationService.get($scope.id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.model = result.data;
                        $scope.copy_model = angular.copy($scope.model);
                    } else {
                        for (var index in result.errors) {
                            toastr.error("信息获取失败，", result.errors[index].errmsg);
                        }
                    }
                });
            } else {
                //新建
                $scope.model = {};
                $scope.copy_model = angular.copy($scope.model);
            }


            //编辑
            $scope.edit = function () {
                $location.path("/node/edit.html").search({"id": $scope.id});
            };

            //启用
            $scope.online = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认启用吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    InformationService.online(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "启用成功。");
                            $location.path("/node/list.html").search();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "启用失败。");
                            }
                        }
                    });
                });
            };
            //提交审核
            $scope.check = function () {
                InformationService.check($scope.id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        toastr.success("", "提交审核成功。");
                        $location.path("/node/list.html").search();
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "提交失败。");
                        }
                    }
                });
            }
            //禁用
            $scope.offline = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认禁用吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    InformationService.offline(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "禁用成功。");
                            $location.path("/node/list.html").search();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "禁用失败。");
                            }
                        }
                    });
                });
            };
            //同意
            $scope.agree = function () {
                InformationService.agree($scope.id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        toastr.success("", "审核同意。");
                        $location.path("/node/check/list.html").search();
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "提交失败。");
                        }
                    }
                });
            }

            //删除
            $scope.delete = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认删除此条节点信息吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    InformationService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "删除成功。");
                            $location.path("/node/list.html").search();
                            $uibModalInstance.dismiss();
                        } else {
                            $uibModalInstance.dismiss();
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "删除失败。");
                            }
                        }
                    });
                });
            };
            //拒绝
            $scope.reject = function (id) {
                var modalInstanceRj = $uibModal.open({
                    templateUrl: 'reject.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        //$scope.description = id.description;
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                        scope.btn_ok = function (rejectDescription) {
                            if (rejectDescription) {
                                console.log("rejectDescription")
                                var obj = {rejectDescription: rejectDescription};
                                InformationService.reject(id, obj).$promise.then(function (result) {
                                    if ("success" == result.status) {
                                        $uibModalInstance.dismiss();
                                        toastr.success("", "拒绝成功。");
                                        $location.path("/node/check/list.html").search();
                                    } else {
                                        $uibModalInstance.dismiss();
                                        for (var index in result.errors) {
                                            toastr.error(result.errors[index].errmsg, "拒绝失败。");
                                        }
                                    }
                                });
                            } else {
                                toastr.error("", "拒绝原因不能为空。");
                            }
                        };

                    }], resolve: {
                        instance: function () {
                            return id;
                        }
                    }
                });
                modalInstanceRj.result.then(function (rejectReason) {
                    if (data['error']) {
                        growl.error(data['error']);
                    } else {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    }
                });
            };
        }
    ]
).filter('runningStatusFilter', ["$filter", function ($filter) {
    return function (runningStatus) {
        switch (runningStatus) {
            case 'NORMAL':
                return "正常";
                break;
            case 'SHUTDOWN':
                return "关机";
                break;
            case 'ALERT':
                return "报警";
                break;
            case 'LOST':
                return "失联";
                break;
            default:
                return "未知";
                break;
        }
    }
}]).filter("ServerStatusFilter", ["EnumService", function (EnumService) {
    return function (value) {
        var typeData = EnumService.get("ServerStatus");
        var even = _.find(typeData, function (type) {
                return type.key == value;
            }
        );
        return even ? even.text : "";
    };
}]).filter("NodeRunningStatusFilter", ["EnumService", function (EnumService) {
    return function (value) {
        var typeData = EnumService.get("NodeRunningStatus");
        var even = _.find(typeData, function (type) {
                return type.key == value;
            }
        );
        return even ? even.text : "";
    };
}]).filter("ipAddressFilter", function () {
    return function (input, param) {
        var status = "";
        switch (input) {
            case null :
                status = "没有服务器";
                break;
            default:
                status = input;
                break;
        }
        return status;
    }
}).filter("ApproveStatusFilter", ["EnumService", function (EnumService) {
    return function (value) {
        var typeData = EnumService.get("ApproveStatus");
        var even = _.find(typeData, function (type) {
                return type.key == value;
            }
        );
        return even ? even.text : "";
    };
}]);