angular.module("MetronicApp").controller('MyContractListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'MyContractService',
        function ($rootScope, $scope, $location, $uibModal, toastr, MyContractService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            var roles = ["customer", "businessManager", "projectManager", "projectAll", "designer"];

            $scope.currentUserRole = 'customer';
            $scope.currentTabIndex = 0;
            $scope.currentTab = 'executing';

            $scope.columns = MyContractService.getCSchemaExecuting();
            $scope.sort = MyContractService.getSort();
            $scope.order = MyContractService.getOrder();
            $scope.pageable = MyContractService.getPageable();

            //method of fetch list data
            $scope.list = function (contractStatus) {
                MyContractService.list(contractStatus).$promise.then(function (result) {
                    $scope.rows = result.data;
                    $scope.pageable = result.pageable;
                    MyContractService.setStoredPage(result.pageable.number);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            if ($scope.currentUserRole == 'customer') {
                $scope.tabStatus = [
                    {"key": "executing", "text": "执行中"},
                    {"key": "terminated", "text": "已终止"},
                    {"key": "aborted", "text": "已中止"},
                    {"key": "closed", "text": "已关闭"}
                ];
                $scope.list('2');
            }

            if ($scope.currentUserRole == 'businessManager') {
                $scope.tabStatus = [
                    {"key": "executing", "text": "执行中"},
                    {"key": "toBeSubmitted", "text": "待提交"},
                    // {"key": "toBeExecuted", "text": "待执行"},
                    {"key": "terminated", "text": "已终止"},
                    {"key": "aborted", "text": "已中止"},
                    {"key": "closed", "text": "已关闭"}
                ];
            }
            if ($scope.currentUserRole == 'projectManager') {

            }
            if ($scope.currentUserRole == 'projectAll') {

            }
            if ($scope.currentUserRole == 'designer') {

            }


            //tab页切换方法
            $scope.changeTab = function (index) {
                //为了tab页的样式显示
                $scope.currentTabIndex = index;
                if ($scope.currentUserRole == 'customer') {
                    if ($scope.tabStatus[index].key == 'executing') {
                        $scope.currentTab = 'executing';
                        $scope.columns = MyContractService.getCSchemaExecuting();
                        $scope.list('2');
                    }
                    if ($scope.tabStatus[index].key == 'terminated') {
                        $scope.currentTab = 'terminated';
                        $scope.columns = MyContractService.getCSchemaTerminated();
                        $scope.list('3');
                    }
                    if ($scope.tabStatus[index].key == 'aborted') {
                        $scope.currentTab = 'aborted';
                        $scope.columns = MyContractService.getCSchemaAborted();
                        $scope.list('4');
                    }
                    if ($scope.tabStatus[index].key == 'closed') {
                        $scope.currentTab = 'closed';
                        $scope.columns = MyContractService.getCSchemaClosed();
                        $scope.list('5');
                    }
                }

                if ($scope.currentUserRole == 'businessManager') {
                    if ($scope.tabStatus[index].key == 'executing') {
                        $scope.currentTab = 'executing';
                        $scope.columns = MyContractService.getBSchemaExecuting();
                        $scope.list('2');
                    }
                    if ($scope.tabStatus[index].key == 'toBeSubmitted') {
                        $scope.currentTab = 'toBeSubmitted';
                        $scope.columns = MyContractService.getBSchemaToBeSubmitted();
                        $scope.list('1');
                    }
                    // if ($scope.tabStatus[index].key == 'toBeExecuted') {
                    //     $scope.currentTab = 'toBeExecuted';
                    //     $scope.columns = MyContractService.getBSchemaToBeExecuted();
                    // }
                    if ($scope.tabStatus[index].key == 'terminated') {
                        $scope.currentTab = 'terminated';
                        $scope.columns = MyContractService.getBSchemaTerminated();
                        $scope.list('3');
                    }
                    if ($scope.tabStatus[index].key == 'aborted') {
                        $scope.currentTab = 'aborted';
                        $scope.columns = MyContractService.getBSchemaAborted();
                        $scope.list('4');
                    }
                    if ($scope.tabStatus[index].key == 'closed') {
                        $scope.currentTab = 'closed';
                        $scope.columns = MyContractService.getBSchemaClosed();
                        $scope.list('5');
                    }

                }
                if ($scope.currentUserRole == 'projectManager') {
                    $scope.columns = MyContractService.getSchema2();
                }
                if ($scope.currentUserRole == 'projectAll') {
                    $scope.columns = MyContractService.getSchema2();
                }
                if ($scope.currentUserRole == 'designer') {
                    $scope.columns = MyContractService.getSchema2();
                }
            }


            var judgeList = function () {
                if ($scope.currentTab == 'executing') {
                    $scope.list('2');
                }
                if ($scope.currentTab == 'toBeSubmitted') {
                    $scope.list('1');
                }
                if ($scope.currentTab == 'terminated') {
                    $scope.list('3');
                }
                if ($scope.currentTab == 'aborted') {
                    $scope.list('4');
                }
                if ($scope.currentTab == 'closed') {
                    $scope.list('5');
                }
            };

            //start to fetch list data
            // gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                MyContractService.setSize(newVal);
                judgeList();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                MyContractService.setStoredPage(newVal);
                judgeList();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyContractService.setSort(newValue);
                judgeList();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                MyContractService.setOrder(newValue);
                judgeList();
            });

            //跳转页面并传递参数

            $scope.search = function () {
                MyContractService.putSearchParams(
                    {
                        contractName: $scope.condition.contractName
                    }
                );
                judgeList();
            };

            //查看合同详情
            $scope.view = function (contractId) {
                if ($scope.currentUserRole == 'customer') {
                    if ($scope.currentTab == 'executing') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'executing'
                        });
                    }
                    if ($scope.currentTab == 'terminated') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'terminated'
                        });
                    }
                    if ($scope.currentTab == 'aborted') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'aborted'
                        });
                    }
                    if ($scope.currentTab == 'closed') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'closed'
                        });
                    }
                }

                if ($scope.currentUserRole == 'businessManager') {
                    if ($scope.currentTab == 'executing') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'executing'
                        });
                    }
                    if ($scope.currentTab == 'toBeSubmitted') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'toBeSubmitted'
                        });
                    }
                    if ($scope.currentTab == 'toBeExecuted') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'toBeExecuted'
                        });
                    }
                    if ($scope.currentTab == 'terminated') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'terminated'
                        });
                    }
                    if ($scope.currentTab == 'aborted') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'aborted'
                        });
                    }
                    if ($scope.currentTab == 'closed') {
                        $location.path("/myContract/view.html").search({
                            "contractId": contractId,
                            'currentTab': 'closed'
                        });
                    }

                }
                if ($scope.currentUserRole == 'projectManager' || $scope.currentUserRole == 'projectAll' || $scope.currentUserRole == 'designer') {
                    $location.path("/myContract/view.html").search({"contractId": contractId});
                }
            };

            //列表页的新增
            $scope.create = function () {
                $location.path("/myContract/edit.html").search({});
            }


            //列表上的操作方法
            $scope.collect = function (contractId) {
                $location.path("/myContract/edit.html").search({
                    "contractId": contractId,
                    'currentTab': 'executing'
                });
            }
            //编辑
            $scope.edit1 = function (contractId) {
                $location.path("/myContract/edit.html").search({
                    "contractId": contractId,
                    'currentTab': 'executing'
                });
            }
            //立项
            $scope.project = function () {

            }
            //提交
            $scope.submit = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认提交后，该合同将不能在修改，等待执行。";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function () {
                    DemandManagerService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "战败成功");
                            initPage();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "战败失败");
                            }
                        }
                    });
                });
            }

            // $scope.execute = function () {
            //
            // }

            //终止
            $scope.terminate = function (contractId) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'abort.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认终止吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(contractId);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function () {
                    DemandManagerService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "成功");
                            initPage();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "战败失败");
                            }
                        }
                    });
                });
            }
            //中止
            $scope.abort = function (contractId) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'terminate.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认中止吗？";
                        scope.btn_ok = function () {
                            console.log("确定按钮");
                            $uibModalInstance.close(contractId);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function () {
                    DemandManagerService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "成功");
                            initPage();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "战败失败");
                            }
                        }
                    });
                });
            }
            //关闭
            $scope.close = function (contractId) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'close.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认关闭吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(contractId);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function () {
                    DemandManagerService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "成功");
                            initPage();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "战败失败");
                            }
                        }
                    });
                });
            }
            //签约
            $scope.sign = function () {
                console.log('进入签约页');
            }


        }
    ]
).controller('MyContractEditController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', '$uibModal', 'FileStorageService', 'MyContractService', 'MyContractViewService',
        function ($rootScope, $scope, $location, toastr, EnumService, $uibModal, FileStorageService, MyContractService, MyContractViewService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.condition = {};

            $scope.id = $location.search().contractId;
            $scope.notpageable = true;
            $scope.model = {};

            $scope.showContractOne = true;
            $scope.showContractAttach = true;
            // $scope.check = $location.$$url.indexOf("check");

            //MyContractService.getOrganization().$promise.then(function (result) {
            //    if ("success" == result.status) {
            //        $scope.organizationList = result.data;
            //    } else {
            //        toastr.error(result.errors[index].errmsg, "信息获取失败");
            //    }
            //});


            $scope.columnsStageInput = MyContractViewService.getSchemaStageInput();
            $scope.sort = MyContractViewService.getSort();
            $scope.order = MyContractViewService.getOrder();
            $scope.pageable = MyContractViewService.getPageable();

            // $scope.collectionTimes = 4;
            $scope.rowsStageCollect = [];
            $scope.inputRows;


            $scope.$watch('model.collectionTimes', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                // $scope.rowsStageCollect = [];
                // $scope.inputRows = [];
                for (var i = 0; i < newVal; i++) {
                    $scope.rowsStageCollect.push({
                        'collectionStage': '',
                        'collectionStageTime': '',
                        'collectionStageCount': '',
                        'proportion': '',
                        'proposerTime': '',
                        'proposerName': ''
                    });
                }
                // if (!oldVal) {
                //
                //     var modalInstance = $uibModal.open({
                //         templateUrl: 'notice.html',
                //         controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                //             scope.confirmContent = "修改收款次数将会情况您的表格设置信息，确认修改吗？";
                //             scope.btn_ok = function () {
                //                 $uibModalInstance.close();
                //             };
                //             scope.btn_cancel = function () {
                //                 $scope.model.collectionTimes = oldVal;
                //                 $uibModalInstance.dismiss();
                //             };
                //         }]
                //     });
                //     modalInstance.result.then(function () {
                //         $scope.rowsStageCollect = [];
                //         $scope.inputRows = [];
                //         for (var i = 0; i < newVal; i++) {
                //             $scope.rowsStageCollect.push({
                //                 'collectionStage': '',
                //                 'collectionStageTime': '',
                //                 'collectionStageCount': '',
                //                 'proportion': '',
                //                 'collectionStageCount': '',
                //                 'collectionStageCount': ''
                //             });
                //         }
                //     });
                // }


                // MyContractService.setSize(newVal);
                // gotoFirstPage();
            });

            $scope.list = function () {
                MyContractViewService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            if ($scope.id) {
                //编辑
                MyContractService.getOne($scope.id).$promise.then(function (result) {
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

            $scope.save = function (form) {
                alert("AAAAAAAAAAAA");
                form.$submitted = true;
                if (form.$valid) {
                    MyContractService.save($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "信息保存成功");
                            if ($scope.id) {
                                $location.path("/node/view.html").search({"id": $scope.id});
                            } else {
                                $location.path("/node/view.html").search({"id": result.data.id});
                            }
                        } else {
                            toastr.error(result.errors.errmsg, "信息保存失败");
                        }
                    });
                }
            };
            $scope.submit = function (form) {
                alert("BBBBBBBBBBBB");
                form.$submitted = true;
                if (form.$valid) {
                    MyContractService.submit($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            console.log("信息提交成功");
                            toastr.success("", "信息提交成功");
                            if ($scope.id) {
                                $location.path("/myContract/list.html").search({"id": $scope.id});
                            } else {
                                $location.path("/myContract/list.html").search({"id": result.data.id});
                            }
                        } else {
                            toastr.error(result.errors.errmsg, "信息提交失败");
                        }
                    });
                }
            };

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };
            $scope.back = function () {
                $location.path("/myContract/list.html").search({})
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
).controller('MyContractViewController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', '$uibModal', 'MyContractService', 'MyContractViewService',
        function ($rootScope, $scope, $location, toastr, EnumService, $uibModal, MyContractService, MyContractViewService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.contractId = $location.search().contractId;
            $scope.currentTab = $location.search().currentTab;
            var roles = ["customer", "businessManager", "projectManager", "projectAll", "designer"];
            var tabs = ["executing", "toBeSubmitted", "toBeExecuted", "terminated", "aborted", "closed"];
            $scope.notpageable = true;
            $scope.currentUserRole = 'customer';

            //ng-table about
            $scope.columnsStage = MyContractViewService.getSchemaStage();
            $scope.columnsRecord = MyContractViewService.getSchemaRecord();
            $scope.columnsStageWithOperation = MyContractViewService.getSchemaStageWithOperation();
            $scope.sort = MyContractViewService.getSort();
            $scope.order = MyContractViewService.getOrder();
            $scope.pageable = MyContractViewService.getPageable();

            $scope.getCollectStage = function (contractId) {
                MyContractViewService.getCollectStage(contractId).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.rowsStage = result.data;
                    } else {
                        for (var index in result.errors) {
                            toastr.error("信息获取失败，", result.errors[index].errmsg);
                        }
                    }
                });
            };

            if ($scope.contractId) {
                //编辑
                MyContractViewService.get($scope.contractId).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.model = result.data;
                        $scope.copy_model = angular.copy($scope.model);
                    } else {
                        for (var index in result.errors) {
                            toastr.error("信息获取失败，", result.errors[index].errmsg);
                        }
                    }
                });

                $scope.getCollectStage($scope.contractId);
            }


            //是否显示 客户信息
            $scope.showCustomerInfo = false;
            //是否显示 收款阶段
            $scope.showCollectStage = false;
            //是否显示 收款阶段（带收款操作）
            $scope.showCollectStageWithOperation = false;
            //是否显示 收款记录
            $scope.showCollectRecord = false;
            //是否显示 终止原因
            $scope.showTerminatedReason = false;
            //是否显示 中止原因
            $scope.showAbortedReason = false;
            //是否显示 关闭原因
            $scope.showClosedReason = false;

            if ($scope.currentUserRole == 'customer') {
                if ($scope.currentTab == 'executing') {
                    //是否显示 收款阶段
                    $scope.showCollectStage = true;
                    //是否显示 收款记录
                    $scope.showCollectRecord = true;
                }
                if ($scope.currentTab == 'terminated') {

                    //是否显示 收款阶段
                    $scope.showCollectStage = true;
                    //是否显示 收款记录
                    $scope.showCollectRecord = true;
                    //是否显示 终止原因
                    $scope.showTerminatedReason = true;
                }
                if ($scope.currentTab == 'aborted') {

                    //是否显示 收款阶段
                    $scope.showCollectStage = true;
                    //是否显示 收款记录
                    $scope.showCollectRecord = true;
                    //是否显示 中止原因
                    $scope.showAbortedReason = true;
                }
                if ($scope.currentTab == 'closed') {

                    //是否显示 收款阶段
                    $scope.showCollectStage = true;
                    //是否显示 收款记录
                    $scope.showCollectRecord = true;
                    //是否显示 关闭原因
                    $scope.showClosedReason = true;
                }
            }

            if ($scope.currentUserRole == 'businessManager') {
                if ($scope.currentTab == 'executing') {
                    //是否显示 收款阶段（带收款操作）
                    $scope.showCollectStageWithOperation = true;
                    //是否显示 收款记录
                    $scope.showCollectRecord = true;
                }
                if ($scope.currentTab == 'toBeSubmitted') {
                    //是否显示 收款阶段
                    $scope.showCollectStage = true;
                    //是否显示 收款记录
                    $scope.showCollectRecord = true;
                }
                // if ($scope.currentTab == 'toBeExecuted') {
                // }
                if ($scope.currentTab == 'terminated') {
                    //是否显示 收款阶段（带收款操作）
                    $scope.showCollectStageWithOperation = true;
                    //是否显示 收款记录
                    $scope.showCollectRecord = true;
                    //是否显示 终止原因
                    $scope.showTerminatedReason = true;
                }
                if ($scope.currentTab == 'aborted') {

                    //是否显示 收款阶段（带收款操作）
                    $scope.showCollectStageWithOperation = true;
                    //是否显示 收款记录
                    $scope.showCollectRecord = true;
                    //是否显示 中止原因
                    $scope.showAbortedReason = true;
                }
                if ($scope.currentTab == 'closed') {
                    //是否显示 收款阶段（带收款操作）
                    $scope.showCollectStageWithOperation = true;
                    //是否显示 收款记录
                    $scope.showCollectRecord = true;
                    //是否显示 关闭原因
                    $scope.showClosedReason = true;
                }

            }
            if ($scope.currentUserRole == 'projectManager' || $scope.currentUserRole == 'projectAll' || $scope.currentUserRole == 'designer') {
                //是否显示 收款阶段
                $scope.showCollectStage = true;
            }


            $scope.create = function () {
                $location.path("/server/create.html").search({"server": $scope.id});
            };

            $scope.back = function () {
                $location.path("/myContract/list.html").search({});
            }


            //详情页的 ‘收款’ 操作
            $scope.collect = function () {
                console.log('点击了收款');
            }


            //编辑
            $scope.edit = function () {
                $location.path("/node/edit.html").search({"id": $scope.id});
            };


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
                    MyContractViewService.delete(id).$promise.then(function (result) {
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

            //下载合同正文
            $scope.downloadContractOne = function () {

            }

            //下载合同附件
            $scope.downloadContractAttach = function () {

            }
        }
    ]
).filter("DesignerTypeFilter", ["EnumService", function (EnumService) {
    return function (value) {
        var typeData = EnumService.get("designerType");
        var even = _.find(typeData, function (type) {
                return type.key == value;
            }
        );
        return even ? even.text : "";
    };
}]).filter("FenZhuanWanFilter", ["$filter", function ($filter) {
    return function (value) {
        var yuan = value/100;
        var wanYuan = yuan/10000;
        return wanYuan.toString();
    }
}]).filter("ContractStatusFilter", ["EnumService", function (EnumService) {
    return function (value) {
        var typeData = EnumService.get("contractStatus");
        var even = _.find(typeData, function (type) {
                return type.key == value;
            }
        );
        return even ? even.text : "";
    };
}]);
