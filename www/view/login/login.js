'use strict';
require('./login.styl');
import {ajaxRequest, uuid} from 'js/merge';

module.exports = angular.module('app.login').controller('loginCtrl', function ($scope) {
    var uuids = uuid(32, 16);
    $scope.submit = function () {
        ajaxRequest("/loginRegister/login", {
            'password': 'jks7758258',
            'mobile': '18938403324',
            'imgCode': $scope.imgCode,
            'uuidParam': uuids
        }).then(function (res) {
            if (res.resCode == '00000') {
                $scope.$apply(function () {
                    console.log(res);
                    $.cookie('ifcToken', res.record.ifcToken);
                    $scope.getAccountList();
                });
            }
        });
    };

    $scope.getAccountList = function () {
        alert($.cookie('ifcToken'));
        ajaxRequest('/manageAccount/getAccountList', {
            'ifcToken': $.cookie('ifcToken'),
            'current': '1',
            'pageSize': '5'
        }).then(function (res) {
            console.log(res);

            if (res.resCode == '00000') {
                $scope.$apply(function () {

                    console.log(res);
                });
            }
        });
    };

    $scope.freshImageCode = function () {
        ajaxRequest("/loginRegister/getImageCaptcha", {
            'uuidParam': uuids
        }).then(function (msg) {
            if (msg.resCode === "00000") {
                $scope.$apply(function () {
                    $scope.imageCaptcha = 'data:image/jpg;base64,' + msg.record.imageParam;
                });
            } else {
                $scope.alertModel({
                    text: msg.resMsg, //内容
                    resCode: msg.resCode
                });
            }
        });
    };

    $scope.freshImageCode();
}).name;
