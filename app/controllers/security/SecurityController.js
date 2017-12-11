
angular.module("MetronicApp").controller('SecurityListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'SecurityService',
        function ($rootScope, $scope, $location, $uibModal, toastr, CompanyService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $('#company a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
                $scope.$apply();
            });
            //ng-table about
            $scope.columns = CompanyService.getSchema();
            $scope.sort = CompanyService.getSort();
            $scope.order = CompanyService.getOrder();
            $scope.pageable = CompanyService.getPageable();


            //method of fetch list data
            $scope.list = function () {
                CompanyService.listWithPost().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
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
            $scope.password = function () {

                $location.path("/security/passwordedit.html").search({});
            };
            $scope.phone = function (id) {
                $location.path("/security/phoneedit.html").search({"id": id});

            };
            $scope.email = function () {

                $location.path("/security/emailedit.html").search({});
            };
            $scope.search = function () {
                CompanyService.putSearchParams(
                    {
                        name: $scope.condition.key,
                        approveStep: $scope.condition.approveStep
                    }
                );
                gotoFirstPage();
            };
        }
    ]
).controller('SecurityEditController',
    ['$rootScope', '$scope', '$location', 'toastr', 'SecurityService', 'EnumService', '$uibModal','FileStorageService',
        function ($rootScope, $scope, $location, toastr, CompanyService, EnumService, $uibModal,FileStorageService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.condition={};
            $('#editTab a').click(function (e) {
                e.preventDefault()
                $(this).tab('show')
            })

            $scope.id = $location.search().id;
            $scope.check=$location.$$url.indexOf("check");



          /*  if ($scope.id) {
                //编辑
                CompanyService.get($scope.id).$promise.then(function (result) {
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
*/
            /*$scope.submit = function (form) {
                form.$submitted = true;
                if (form.$valid) {
                    SecurityService.save($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "信息保存成功");
                            if($scope.id){
                                $location.path("/security/okpassword.html").search({"id":$scope.id});
                            }else {
                                $location.path("/security/okpassword.html").search({"id":result.data.id});
                            }
                        } else {
                            toastr.error(result.errors.errmsg, "信息保存失败");
                        }
                    });
                }
            };        原来是company的               */

            //跳转用的
            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };
            $scope.back = function () {
                $location.path("/security/list.html").search({"id":$scope.id})
            };
            $scope.create = function () {
                $location.path("/security/passwordedit.html").search({});
            };
            $scope.ok = function () {
                $location.path("/security/okpassword.html").search({"id":$scope.id})
            };
            $scope.passwordok = function () {
                $location.path("/security/list.html").search({"id":$scope.id})
            };


            $scope.cancel = function () {
                $location.path("/security/list.html").search({"id":$scope.id})
            };


/*
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
            };*/
          /*  $scope._simpleConfig = {
                toolbars: [[
                    'fullscreen','source', '|', 'undo', 'redo', '|',
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
            };*/
        }
    ]
)
    .controller('SecurityPhoneEditController',
        ['$rootScope', '$scope', '$location', 'toastr', 'SecurityService', 'EnumService', '$uibModal','FileStorageService',
            function ($rootScope, $scope, $location, toastr, CompanyService, EnumService, $uibModal,FileStorageService) {
                $scope.$on('$viewContentLoaded', function () {
                    // initialize core components
                    Metronic.initAjax();
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });
                $scope.condition={};
                $('#editTab a').click(function (e) {
                    e.preventDefault()
                    $(this).tab('show')
                })

                $scope.id = $location.search().id;
                $scope.check=$location.$$url.indexOf("check");



           /*     if ($scope.id) {
                    //编辑
                    CompanyService.get($scope.id).$promise.then(function (result) {
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
                }*/

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
                    $location.path("/security/phoneedit.html").search({"id":$scope.id})
                };
                $scope.back = function () {
                    $location.path("/security/list.html").search({"id":$scope.id})
                };
                $scope.create = function () {
                    $location.path("/security/passwordedit.html").search({});
                };
                $scope.cancel = function () {
                    $location.path("/security/list.html").search({"id":$scope.id})
                };
                $scope.ok = function () {
                    $location.path("/security/okphone.html").search({"id":$scope.id})
                };
                $scope.phoneok = function () {
                    $location.path("/security/list.html").search({"id":$scope.id})
                };



              /*  //活动图片上传
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
                        'fullscreen','source', '|', 'undo', 'redo', '|',
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
                };*/
            }
        ]
    )

    .controller('SecurityEmailEditController',
        ['$rootScope', '$scope', '$location', 'toastr', 'SecurityService', 'EnumService', '$uibModal','FileStorageService',
            function ($rootScope, $scope, $location, toastr, CompanyService, EnumService, $uibModal,FileStorageService) {
                $scope.$on('$viewContentLoaded', function () {
                    // initialize core components
                    Metronic.initAjax();
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });
                $scope.condition={};
                $('#editTab a').click(function (e) {
                    e.preventDefault()
                    $(this).tab('show')
                })

                $scope.id = $location.search().id;
                $scope.check=$location.$$url.indexOf("check");



                /*if ($scope.id) {
                    //编辑
                    CompanyService.get($scope.id).$promise.then(function (result) {
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
                };*/

                $scope.reset = function () {
                    $location.path("/security/phoneedit.html").search({"id":$scope.id})
                };
                $scope.back = function () {
                    $location.path("/security/list.html").search({"id":$scope.id})
                };
                $scope.create = function () {
                    $location.path("/security/passwordedit.html").search({});
                };
                $scope.cancel = function () {
                    $location.path("/security/list.html").search({"id":$scope.id})
                };
                $scope.ok = function () {
                    $location.path("/security/okemail.html").search({});
                };
                $scope.emailok = function () {
                    $location.path("/security/list.html").search({});
                };



               /* //活动图片上传
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
                        'fullscreen','source', '|', 'undo', 'redo', '|',
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
                };*/
            }
        ]
    )

