/**
 * 文件上传，下载
 * Created by zhouhm on 2016/6/16.
 */
angular.module("MetronicApp").service('FileStorageService',
    ['$resource', 'UrlConfigService',
        function ($resource, UrlConfigService) {
            this._uploadUrl = UrlConfigService.urlConfig.fileStorage.uploadUrl;
            this._downLoadUrl = UrlConfigService.urlConfig.fileStorage.downloadUrl;

            //this._getUploadUrl = UrlConfigService.urlConfig.uploadModule.getUploadUrl;
            //this._getStorageRecordUrl = UrlConfigService.urlConfig.uploadModule.getStorageRecordUrl;
            //this._getDownLoadUrl = UrlConfigService.urlConfig.uploadModule.getDownLoadUrl;
            //this._getUploadFileNameUrl = UrlConfigService.urlConfig.uploadModule.getUploadFileNameUrl;

            this.getUploadUrl = function () {
                return this._getUploadUrl;
            };
            //上传照片校验
            this.validatePhoto = function (file, typePattern) {
                var fileType = file.file.name;
                var fileSize = file.file.size;
                var size = 512000;
                if (fileSize <= size) {
                    if (!typePattern.test(fileType)) {
                        toastr.error("", "图片格式不正确");
                        submitted = false;
                    } else {
                        submitted = true;
                    }
                } else {
                    toastr.error("", "图片不能超过500k");
                    submitted = false;
                }
                return submitted;
            };

            //判断是否上传图片
            this.getPhotoDownloadUrl = function (fileNo, type) {
                if (submitted) {
                    return this._getDownLoadUrl + "/" + fileNo + (type ? '?type=' + type : '');
                }
            };
            // 取得图片的URL （add by liuw）
            this.getPhotoUrl = function(fileNo, type) {
                return this._getDownLoadUrl + "/" + fileNo + (type ? '?type=' + type : '');
            };

            this.getUploadFileNameUrl = function (id) {
                var resource = $resource(this._getUploadFileNameUrl, {id: id});
                return resource.get({type: 'original '});
            };

            this._storageRecord = function (storageRecordObj) {
                var resource = $resource(this._getStorageRecordUrl);
                return resource.save(storageRecordObj);
            };
            this.storageRecord = function ($file, $message, $flow, type) {
                var service = this;
                var result = $.parseJSON($message);
                if (result.status === "success") {
                    var filePath = result.data.filePath;
                    var fileName = $file.name;
                    var storageRecordObj = {
                        "fileName": fileName,
                        "filePath": filePath,
                        "normalization": type
                    };
                    return service._storageRecord(storageRecordObj);
                }
            };

            this.downLoadFile = function (fileNo, type) {
                return this._getDownLoadUrl + fileNo + (type ? '?type=' + type : '');
            };
            /*  this.downLoadFile = function (fileNo) {
             return this._getDownLoadUrl + fileNo;
             };*/


            this.clearFlowFile = function ($flow) {
                for (var i = $flow.files.length - 1; i >= 0; i--) {
                    $flow.files[i].cancel();
                }
            };


            //
            // this.fileNameNumberLimit = function (fileName, limit) {
            //     if(!limit){
            //         limit = 200;
            //     }
            //     if (fileName.length > limit) {
            //         var index = fileName.lastIndexOf(".");
            //         var prefix = fileName.substr(index);
            //         fileName = fileName.substr(0, limit - 1 - prefix.length) + prefix;
            //     } else {
            //         return fileName;
            //     }
            // }
        }]);