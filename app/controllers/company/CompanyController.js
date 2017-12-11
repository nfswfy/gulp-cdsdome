angular.module("MetronicApp").controller('CompanyListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'CompanyService',
        function ($rootScope, $scope, $location, $uibModal, toastr, CompanyService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.flag = false;

            $scope.columns = CompanyService.getSchema();
            $scope.sort = CompanyService.getSort();
            $scope.order = CompanyService.getOrder();
            $scope.pageable = CompanyService.getPageable();

            $scope.half = false;
            $scope.barConfigCreate = {
                imageUrl: 'imageUrl',
                title: 'name',
                btnTemplateUrl: 'myCreateTeamOperation.html',
                detail: 'detail',
                hoverjump: '/company/view.html'
            };
            $scope.barConfigJoin = {
                imageUrl: 'imageUrl',
                title: 'name',
                btnTemplateUrl: '',
                detail: 'detail',
                hoverjump: '/company/view.html'
            };
            $scope.rowsCreate = [
                {
                    "id": 1,
                    "imageUrl": "../../assets/admin/pages/img/teamlogo.png",
                    "name": "北京团队",
                    "detail": "北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京"
                },
                {
                    "id": 2,
                    "imageUrl": "../../assets/admin/pages/img/teamlogo.png",
                    "name": "上海团队",
                    "detail": "上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海"
                },
                {
                    "id": 3,
                    "imageUrl": "../../assets/admin/pages/img/teamlogo.png",
                    "name": "大连团队",
                    "detail": "大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连"
                }
            ];

            $('#company a').click(function (e) {
                e.preventDefault();
                if ($(this).context.attributes.href.value == '#publiced') {
                    $scope.flag = false;
                    $scope.barConfigCreate = {
                        imageUrl: 'imageUrl',
                        title: 'name',
                        btnTemplateUrl: 'myCreateTeamOperation.html',
                        detail: 'detail',
                        hoverjump: '/company/view.html'
                    };
                    $scope.barConfigJoin = {
                        imageUrl: 'imageUrl',
                        title: 'name',
                        btnTemplateUrl: '',
                        detail: 'detail',
                        hoverjump: '/company/view.html'
                    };

                    $scope.$apply();
                    gotoFirstPage();
                }
                if ($(this).context.attributes.href.value == '#joined') {
                    $scope.flag = true;
                    $scope.barConfigCreate = {
                        imageUrl: 'imageUrl',
                        title: 'name',
                        btnTemplateUrl: 'myJoinTeamOperation.html',
                        detail: 'detail',
                        hoverjump: '/company/view.html'
                    };
                    $scope.barConfigJoin = {
                        imageUrl: 'imageUrl',
                        title: 'name',
                        btnTemplateUrl: '',
                        detail: 'detail',
                        hoverjump: '/company/view.html'
                    };

                    $scope.$apply();

                    gotoFirstPage();
                }

                $(this).tab('show');
            });


            $scope.leaveCompany = [{'key': 'leaveCompany', 'text': 'leaveCompany'}];
            //method of fetch list data
            $scope.list = function () {
                if (!$scope.flag) {
                    CompanyService.listWithPostPublic().$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                    $scope.urlparameters = [{
                        "key": "type",
                        "text": "FOUND"
                    }]
                } else {
                    CompanyService.listWithPostJoin().$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                    $scope.urlparameters = [{
                        "key": "type",
                        "text": "JOIN"
                    }]
                }
            };
            var gotoFirstPage = function () {
                CompanyService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setOrder(newValue);
                $scope.list();
            });

            //跳转页面并传递参数
            $scope.create = function () {
                $location.path("/company/create.html").search({});
            };

            $scope.invite = function () {
                $location.path("/company/joinCompany/inviteHistory.html").search({});
            };
            $scope.invitePeople = function (id) {
                $location.path("/company/createCompany/invitePeopelList.html").search({id: id});
            };
            $scope.inviteHistory = function (id) {
                $location.path("/company/createCompany/inviteHistory.html").search({id: id});
            };
            $scope.applyJoin = function (id) {
                $location.path("/company/createCompany/applyJoinView.html").search({id: id});
            };
            $scope.apply = function () {
                $location.path("/company/joinCompany/applyHistoryView.html").search({});
            };
            $scope.goToApply = function () {
                $location.path("/company/joinCompany/searchJoinCompany.html").search({});
            };
            //退出
            $scope.leave = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认退出企业吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    CompanyService.leave(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "离开成功。");
                            $location.path("/node/list.html").search();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "离开失败。");
                            }
                        }
                    });
                });
            };


        }
    ]
).controller('CompanyEditController',
    ['$rootScope', '$scope', '$location', 'toastr', 'CompanyService', 'EnumService', '$uibModal', 'FileStorageService', 'DictService',
        function ($rootScope, $scope, $location, toastr, CompanyService, EnumService, $uibModal, FileStorageService, DictService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.condition = {};
            $('#company a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
                $scope.$apply();
            });
            $('#editTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
            $('#designTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
            //点编辑进入编辑页面
            $scope.id = $location.search().id;

            CompanyService.getMyCompany($scope.id).$promise.then(function (result) {
                if ("success" == result.status) {
                   $scope.model = result.data;
                   debugger

                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "信息保存失败");
                    }
                }
            });



            /*$scope.submit = function (form) {
                form.$submitted = true;
                if (form.$valid) {
                    CompanyService.createMyCompany($scope.model, $scope.condition).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "信息保存成功");
                            if($scope.id){
                                $location.path("/node/view.html").search({"id":$scope.id});
                            }else {
                                $location.path("/node/view.html").search({"id":result.data.id});
                            }
                        } else {
                            toastr.error(result.errors.errmsg, "信息保存失败");
                        }
                    });
                }
            };*/

            // $scope.model.id = 52;

            //新建的保存
            $scope.submit = function (form) {

                //form.$submitted = true;
                // $scope.id = null;
                // $scope.customerId = 52;
                $scope.model.contactList=[{
                    "id":1,
                    "duties":$scope.duties,
                    "name":$scope.name,
                    "mobile":$scope.mobile,
                    "enterpriseId": null,
                    // "customerId":$scope.customerId
                }];
                debugger
                CompanyService.createMyCompany($scope.model).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $rootScope.$broadcast("initMenuEvent", true);
                        toastr.success("", "信息保存成功");
                        $location.path("/company/list.html").search();
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "信息保存失败");
                        }
                    }
                });

            };




            //
            // CompanyService.save($scope.model).$promise.then(function (result) {
            //     if ("success" == result.status) {
            //         $rootScope.$broadcast("initMenuEvent", true);
            //         toastr.success("", "菜单信息保存成功");
            //         $location.path("/information/list.html").search({"id": $scope.id});
            //     } else {
            //         for (var index in result.errors) {
            //             toastr.error(result.errors[index].errmsg, "菜单信息保存失败");
            //         }
            //     }
            // });


            if ($scope.id) {
                //编辑
                CompanyService.getFoundDetail($scope.id).$promise.then(function (result) {
                    $scope.model = result.data;
                    $scope.copy_model = angular.copy($scope.model);
                });
            } else {
                //新建
                $scope.model = {};

                $scope.nationality = DictService.get("nationality");
                $scope.$watch('nationality', function (newValue, oldValue) {
                    if (oldValue == newValue) return;
                    CompanyService.setSort(newValue);
                    $scope.list();
                });
                $scope.$watch('province', function (newValue, oldValue) {
                    if (oldValue == newValue) return;
                    CompanyService.setSort(newValue);
                    $scope.list();
                });
                $scope.$watch('city', function (newValue, oldValue) {
                    if (oldValue == newValue) return;
                    CompanyService.setSort(newValue);
                    $scope.list();
                });
                $scope.copy_model = angular.copy($scope.model);
            }

            $scope.submit = function (form) {
                form.$submitted = true;
                if (form.$valid) {
                    CompanyService.save($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "信息保存成功");
                            if($scope.id){
                                $location.path("/node/view.html").search({"id":$scope.id});
                            }else {
                                $location.path("/node/view.html").search({"id":result.data.id});
                            }
                        } else {
                            toastr.error(result.errors.errmsg, "信息保存失败");
                        }
                    });
                }
            };


            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };
            $scope.back = function () {
                if (!$scope.id) {
                    $location.path("/company/list.html").search({})
                } else {
                    $location.path("/company/view.html").search({"id": $scope.id})
                }
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
).controller('CompanyViewController',
    ['$rootScope', '$scope', '$location', 'toastr', 'CompanyService', 'EnumService', '$uibModal',
        function ($rootScope, $scope, $location, toastr, CompanyService, EnumService, $uibModal) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.id = $location.search().id;
            $scope.type = $location.search().type;
            $scope.join = $location.search().join;
            $scope.leaveCompany = $location.search().leaveCompany;

            //ng-table about
            if ($scope.type == 'FOUND') {
                $scope.columns = CompanyService.getSchemaMember();
                CompanyService.getFoundDetail($scope.id).$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.model = result.data;
                    }
                });
            } else {
                $scope.columns = CompanyService.getSchemaJoin();
            }
            $scope.sort = CompanyService.getSort();
            $scope.order = CompanyService.getOrder();
            $scope.pageable = CompanyService.getPageable();
            //获取企业基本信息
            CompanyService.getFoundDetail($scope.id).$promise.then(function (result) {
                if('success' == result.status){
                    $scope.model = result.data;
                }
            });
            //获取企业认证信息
            if ($scope.type == 'FOUND'){
                CompanyService.getCertification($scope.id).$promise.then(function (result) {
                    if('success' == result.status){
                        $scope.certification = result.data;
                    }
                });
            }
            //method of fetch list data
            $scope.list  = function () {
                if($scope.type == 'FOUND'||$scope.type == 'JOIN'){
                    //获取成员列表
                    CompanyService.listWithPostMembers($scope.id).$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    })
                } else {

                }
            };

            var gotoFirstPage = function () {
                CompanyService.setStoredPage(0);
                $scope.list();
            };
            //start to fetch list data
            //$scope.condition = {};
            //CompanyService.clearSearchParams();
            gotoFirstPage();
            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setOrder(newValue);
                $scope.list();
            });
            $scope.back = function () {
                $location.path("/company/list.html").search({});
            };
            $scope.edit = function () {
                $location.path("/company/edit.html").search({"id": $scope.id});
            };
            //编辑
            $scope.edit3 = function (form) {
                //form.$submitted = true;
                $scope.id = 1;
               /* $scope.model.contactList=[{
                    "id":1,
                    "duties":$scope.duties,
                    "name":$scope.name,
                    "mobile":$scope.mobile,
                    "enterpriseId": null,
                }];*/
                CompanyService.updateMyCompany($scope.model).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $rootScope.$broadcast("initMenuEvent", true);
                        toastr.success("", "信息保存成功");
                        $location.path("/company/edit.html").search();
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "信息保存失败");
                        }
                    }
                });

            };


            $scope.cancel = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认取消邀请吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    CompanyService.cancel(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "取消成功。");
                            $scope.list();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "取消失败。");
                            }
                        }
                    });
                });
            };

            //删除
            $scope.delete = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认删除此成员吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    CompanyService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "删除成功。");
                            $scope.list();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "删除失败。");
                            }
                        }
                    });
                });
            };




            //退出
            $scope.leave = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认离开吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    CompanyService.leave(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "离开成功。");
                            $location.path("/node/list.html").search();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "离开失败。");
                            }
                        }
                    });
                });
            };

            //注销
            $scope.logout = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认注销企业吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    CompanyService.logout(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "注销企业成功。");
                            $location.path("/company/list.html").search();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "注销企业失败。");
                            }
                        }
                    });
                });
            };

        }
    ]
).controller('InvitePeopelListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'CompanyService',
        function ($rootScope, $scope, $location, $uibModal, toastr, CompanyService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;

            $scope.columns = CompanyService.getSchema();
            $scope.sort = CompanyService.getSort();
            $scope.order = CompanyService.getOrder();
            $scope.pageable = CompanyService.getPageable();


            $scope.half = true;
            $scope.barConfigCreate = {
                imageUrl: 'imageUrl',
                title: 'customerName',
                btnTemplateUrl: 'invitePeopleOperation.html',
                detail: 'detail',
                hoverjump: '/information/list.html'
            };
            // $scope.barConfigJoin = {
            //     imageUrl: 'imageUrl',
            //     title: 'name',
            //     btnTemplateUrl: 'invitePeopleOperation.html',
            //     detail: 'detail',
            //     hoverjump: '/myTeam/view.html'
            // };


            //method of fetch list data
            $scope.list = function () {
                //获取可邀请加入人员列表
                CompanyService.listWithPostInvitePeople($scope.id).$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "离开失败。");
                        }
                    }
                });
            };
            var gotoFirstPage = function () {
                CompanyService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setOrder(newValue);
                $scope.list();
            });

            //跳转页面并传递参数
            $scope.view = function (id) {
                $location.path("/information/view.html").search({"id": id});
            };
            //检索条件
            $scope.search = function () {
                CompanyService.putSearchParams(
                    {
                        query: $scope.condition.query
                    }
                );
                gotoFirstPage();
            };
            //邀请加入本企业，做不做弹窗确定？？？
            $scope.invite = function (id) {
                $scope.model = {
                    actionType: '2',
                    enterpriseId:$scope.id,
                    customerId:id
                };
                CompanyService.invite($scope.model).$promise.then(function (result){
                    if("success" == result.status){
                        toastr.success("邀请成功，等待相关人员审核");
                        $location.path("/company/inviteHistory.html").search({});
                    }else{
                        for(var index in result.errors){
                            toastr.error(result.errors[index].errorMsg, "邀请失败");
                        }
                    }
                });
            };
            $scope.back = function () {
                $location.path("/company/list.html").search({});
            };


        }
    ]
).controller('InviteHistoryListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'CompanyService',
        function ($rootScope, $scope, $location, $uibModal, toastr, CompanyService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            //企业邀请加入控制器--huzz

            $scope.id = $location.search().id;

            $scope.columns = CompanyService.getSchemaInvitePeople();
            $scope.sort = CompanyService.getSort();
            $scope.order = CompanyService.getOrder();
            $scope.pageable = CompanyService.getPageable();



            //method of fetch list data
            $scope.list = function () {
                //获取可邀请加入人员列表
                CompanyService.getInvitePeopleHistory($scope.id).$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.rows = result.data;
                        //storage page state
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "离开失败。");
                        }
                    }
                });
            };
            var gotoFirstPage = function () {
                CompanyService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setOrder(newValue);
                $scope.list();
            });

            //跳转页面并传递参数
            $scope.view = function (id) {
                $location.path("/information/view.html").search({"id": id});
            };
            $scope.back = function () {
                $location.path("/company/list.html").search({});
            };


        }
    ]
).controller('SearchJoinCompanyController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'CompanyService',
        function ($rootScope, $scope, $location, $uibModal, toastr, CompanyService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.customerId=52;
            //推荐

            $scope.pageableSearch = CompanyService.getPageable();
            $scope.urlparameters = [{"key": "type", "text": "APPLY"}]

            $scope.half=true;
            $scope.halfSearch=true;
            $scope.barConfigCreate = {imageUrl: 'imageUrl', title: 'name', btnTemplateUrl:'invitePeopleOperation.html',detail:'detail',hoverjump:'/company/view.html'};
            $scope.barConfigJoin = {imageUrl: 'imageUrl', title: 'name', btnTemplateUrl:'invitePeopleOperation.html',detail:'detail',hoverjump:'/company/view.html'};
            $scope.rowsCreate = [{"id": 1, "imageUrl": "../../assets/admin/pages/img/teamlogo.png", "name": "北京团队", "detail": "北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京"},
                    {"id": 2, "imageUrl": "../../assets/admin/pages/img/teamlogo.png", "name": "上海团队", "detail": "上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海"},
                    {"id": 3, "imageUrl": "../../assets/admin/pages/img/teamlogo.png", "name": "大连团队", "detail": "大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连"}
                ];
            $scope.rowsCreateSearch = [
                    {"id": 1, "imageUrl": "../../assets/admin/pages/img/teamlogo.png", "name": "炫酷团队", "detail": "北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京"},
                    {"id": 2, "imageUrl": "../../assets/admin/pages/img/teamlogo.png", "name": "大侦探团队", "detail": "上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海上海"},
                    {"id": 3, "imageUrl": "../../assets/admin/pages/img/teamlogo.png", "name": "吊炸天团队", "detail": "大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连大连"}
                ];

            $scope.searchList = function () {
                CompanyService.listWithPostApply($scope.customerId).$promise.then(function (result) {
                    $scope.rowsCreateSearch = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });

            };


            $scope.search = function () {
                CompanyService.putSearchParams(
                    {
                        name: $scope.condition.key,
                        approveStep: $scope.condition.approveStep
                    }
                );
                $scope.searchList();
            };

            $scope.recommendList = function () {
                CompanyService.listWithPostPublic($scope.customerId).$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };
            var gotoFirstSearchPage = function () {
                CompanyService.setStoredPage(0);
                $scope.searchList();
            };

            //start to fetch list data
            gotoFirstSearchPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setSize(newVal);
                gotoFirstSearchPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setStoredPage(newVal);
                $scope.searchList();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setSort(newValue);
                $scope.searchList();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setOrder(newValue);
                $scope.searchList();
            });


            //跳转页面并传递参数
            $scope.apply = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认申请加入企业吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    CompanyService.ApplyForMembership(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "申请成功。");
                            $scope.searchList();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "申请失败。");
                            }
                        }
                    });
                });
            };

            $scope.back = function () {
                $location.path("/company/list.html").search({});
            };
        }
    ]
).controller('ApplyHistoryViewController',
    ['$rootScope', '$scope', '$location', 'toastr', 'CompanyService', 'EnumService', '$uibModal',
        function ($rootScope, $scope, $location, toastr, CompanyService, EnumService, $uibModal) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = 52;
            $scope.join = $location.search().join;

            //ng-table about
            $scope.columns = CompanyService.getSchemaApply();
            $scope.sort = CompanyService.getSort();
            $scope.order = CompanyService.getOrder();
            $scope.pageable = CompanyService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                CompanyService.getApplyHistory().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    CompanyService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage = function () {
                CompanyService.setStoredPage(0);
                $scope.list();
            };
            //start to fetch list data
            //$scope.condition = {};
            //CompanyService.clearSearchParams();
            gotoFirstPage();
            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setOrder(newValue);
                $scope.list();
            });
            $scope.back = function () {
                $location.path("/company/list.html").search({});
            };
            $scope.view = function (id) {
                $location.path("/company/view.html").search({id:id,type:"APPLY"});
            };
            //退出
            $scope.leave = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认退出企业吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    CompanyService.leave(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "离开成功。");

                            $scope.list();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "离开失败。");
                            }
                        }
                    });
                });
            };
            //取消
            $scope.cancel = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认取消申请吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    CompanyService.cancel(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "取消成功。");
                            $scope.list();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "取消失败。");
                            }
                        }
                    });
                });
            };
            //删除
            $scope.delete = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认删除此条申请信息吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    CompanyService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "删除成功。");
                            $scope.list();
                        } else {
                            $uibModalInstance.dismiss();
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "删除失败。");
                            }
                        }
                    });
                });
            };

        }
    ]
).controller('InviteHistoryViewController',
    ['$rootScope', '$scope', '$location', 'toastr', 'CompanyService', 'EnumService', '$uibModal',
        function ($rootScope, $scope, $location, toastr, CompanyService, EnumService, $uibModal) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = 52;
            $scope.join = $location.search().join;

            //ng-table about
            $scope.columns = CompanyService.getSchemaInvite();
            $scope.sort = CompanyService.getSort();
            $scope.order = CompanyService.getOrder();
            $scope.pageable = CompanyService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                CompanyService.getInviteHistory().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    CompanyService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage = function () {
                CompanyService.setStoredPage(0);
                $scope.list();
            };
            //start to fetch list data
            //$scope.condition = {};
            //CompanyService.clearSearchParams();
            gotoFirstPage();
            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setOrder(newValue);
                $scope.list();
            });
            $scope.back = function () {
                $location.path("/company/list.html").search({});
            };
            $scope.view = function (id) {
                $location.path("/company/view.html").search({id:id,type:"APPLY"});
            };
            //同意
            $scope.agree = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认同意此条邀请信息吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    CompanyService.agree(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "同意邀请成功。");
                            $scope.list();
                        } else {
                            $uibModalInstance.dismiss();
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "同意邀请失败。");
                            }
                        }
                    });
                });
            };

            //拒绝
            $scope.reject = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认拒绝此条邀请信息吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    CompanyService.reject(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "拒绝邀请成功。");
                            $scope.list();
                        } else {
                            $uibModalInstance.dismiss();
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "拒绝邀请失败。");
                            }
                        }
                    });
                });
            };
            //删除
            $scope.delete = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认删除此条邀请信息吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    CompanyService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "删除成功。");
                            $scope.list();
                        } else {
                            $uibModalInstance.dismiss();
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "删除失败。");
                            }
                        }
                    });
                });
            };

        }
    ]
).controller('ApplyJoinViewController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', '$uibModal', 'CompanyService',
        function ($rootScope, $scope, $location, toastr, EnumService, $uibModal, CompanyService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;

            //ng-table about
            $scope.columns = CompanyService.getSchemaApplyPeople();
            $scope.sort = CompanyService.getSort();
            $scope.order = CompanyService.getOrder();
            $scope.pageable = CompanyService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                CompanyService.getHistoryByEnterpriseId($scope.id).$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    CompanyService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage = function () {
                CompanyService.setStoredPage(0);
                $scope.list();
            };
            //start to fetch list data
            //$scope.condition = {};
            //CompanyService.clearSearchParams();
            gotoFirstPage();
            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CompanyService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                CompanyService.setOrder(newValue);
                $scope.list();
            });
            $scope.back = function () {
                $location.path("/company/list.html").search({});
            };
            //同意
            $scope.agree = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认同意此条申请信息吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    CompanyService.agree(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "同意申请成功。");
                            $scope.list();

                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "同意申请失败。");
                            }
                        }
                    });
                });
            };

            //拒绝
            $scope.reject = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认拒绝此条申请信息吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    CompanyService.reject(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "拒绝申请成功");
                            $scope.list();

                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "拒绝申请失败。");
                            }
                        }
                    });
                });
            };
            //删除
            $scope.delete = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认删除此条申请信息吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
                modalInstance.result.then(function (id) {
                    CompanyService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "删除成功。");
                            $scope.list();
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "删除失败。");
                            }
                        }
                    });
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
        ;
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
}])
    .filter("nationality", ["DictService", function (DictService) {
        return function (value) {
            var data = DictService.get("nationality");
            var even = _.find(data, function (Subject) {
                    return Subject.key == value;
                }
            );
            return even ? even.text : "";
        };
    }]).filter("city", ["DictService", function (DictService) {
    return function (value) {
        var data = DictService.get("city");
        var even = _.find(data, function (Subject) {
                return Subject.key == value;
            }
        );
        return even ? even.text : "";
    };
}]);