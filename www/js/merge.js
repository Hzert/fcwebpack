import {hex_md5} from './md5.js';
import {DES3} from './DES3.js';
// import cookie from 'jquery.cookie'
//隐藏数字中间, 调用：numHide(13888888888)或numHide('13888888888');
export const numHide = function (m) {
    if (m.length <= 11) {
        return m.substr(0, 3) + '****' + m.substr(7);
    } else {
        return m.substr(0, 4) + ' **** **** ' + m.substr(13);
    }
};


//字符串转日期格式，strDate要转为日期格式的字符串
export const getDate = function (strDate) {
    //strDate为需要转换成日期格式的字符串
    if (strDate.replace("/")) {
        strDate = strDate.replace("/", "-").replace("/", "-");
    }
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
        function (a) {
            return parseInt(a, 10) - 1;
        }).match(/\d+/g) + ')');
    return date;
};

//报错
export const errorMessage = function (str) {
    if ($("body .errorMessage").length > 0) {
        return false;
    }

    function hideError() {
        $("body .errorMessage").fadeOut("normal", function () {
            $(this).remove();
        });
    }

    var html = '<div class="errorMessage MT20" style="bottom: 100px; position: fixed; text-align: center; width: 100%; display:none; z-index:1111;"><font style="background-color: rgba(0, 0, 0, 0.7); border-radius: 5px; color: #fff; z-index:1000; display: inline-table; line-height: 170%; max-width: 80%; padding: 5px 10px;">' + str + '</font></div>';
    $("body").append(html);
    $("body .errorMessage").fadeIn("normal", function () {
        setTimeout(hideError, 3000);
    });
};

export const ajaxRequest = function (url, params, method) {
    $.ajaxSetup({
        beforeSend: function (XMLHttpRequest) {
            var ifcToken=$.cookie("ifcToken");
            XMLHttpRequest.setRequestHeader("ifcToken",ifcToken );
        },

    });
    var PD = new Array;
    var PD2 = new Array;
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    var request_param = function () {
        var clientName = 'nuojfApp';
        var clientVersion = '1.0.0';
        var os = 'ios';
        var osVersion = '7.0';
        var brand = 'Xiaomi';
        var model = 'RedmiNote4';
        var uuid = 'abcdefg';
        var networkType = 'wifi';
        var resolution = '1920*1080';
        var st = new Date().getTime();
        var key = 'key=82q*ngZzt7BoMMcUq%NvEUBdTnrw*DZ$';
        var paramStr = key + '&brand=' + brand + '&clientName=' + clientName + '&clientVersion=' + clientVersion + '&model=' + model + '&networkType=' + networkType + '&os=' + os + '&osVersion=' + osVersion + '&resolution=' + resolution + '&st=' + st + '&uuid=' + uuid;
        var sign = hex_md5(paramStr);
        return '?clientName=' + clientName + '&clientVersion=' + clientVersion + '&os=' + os + '&osVersion=' + osVersion + '&brand=' + brand + '&model=' + model + '&uuid=' + uuid + '&networkType=' + networkType + '&resolution=' + resolution + '&st=' + st + '&sign=' + sign;
    };

    function loadingMessage(str) {
        var html = '<div class="loadingMessage" style="bottom: 100px; position: fixed; text-align: center; width: 100%; display:none; z-index:1000;"><font style="background-color: rgba(0, 0, 0, 0.7); border-radius: 5px; color: #fff; z-index:1000; display: inline-table; line-height: 170%; max-width: 80%; padding: 5px 10px;font-size:14px">' + str + '</font></div>';
        $("body").append(html);
        $("body .loadingMessage").fadeIn("normal");
    }

    function hideLoading() {
        $("body .loadingMessage").fadeOut("normal", function () {
            $(this).remove();
        });
    }

    var dtd = $.Deferred(); // 新建一个Deferred对象
    var dtd2 = $.Deferred();
    for (var i = 0; i < PD.length; i++) {
        if (PD[i] == url) {
            //  console.log(params)
            return dtd2.promise();

        }
    }
    PD.push(url);
    PD2.push(params);
    // var ifcToken= $.cookie('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDAwNTM2IiwiZXhwI…xMjd9.6JoSU9XEpdf9q27Lk4ppy-Gm6h3fxClUlhBYuxeq2C0');
    url = "/iFengChao-App-Web"+url + request_param();
    if (method == undefined || method == "" || method == "undefined") {
        var method = 'POST';
    }
    var secret = '7$T5rcaOjA35bKoy&*dBbQS^ZPUsMDJj';
    params = JSON.stringify(params);
    var requestStr = DES3.encrypt(secret, params);

    function ajax() {
        hideLoading();
        loadingMessage("数据加载中...");
        $.ajax({
            url: url,
            type: method,
            data: {'data': requestStr},
            // headers:{'ifcToken':'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDAwNTM2IiwiZXhwIjoxNDk2OTI1ODEyLCJpYXQiOjE0OTY5MTk4MTJ9.T2VRpIiPG7fV-8RKntG_ncLuNR9m1UnBTpdUqk71TEA','Content-Type':'application/x-www-form-urlencoded','Access-Control-Allow-Methods':'POST,GET,OPTIONS,DELETE','Access-Control-Allow-Headers':'x-requested-with,content-type','Access-Control-Allow-Origin':'*'}
        }).then(function (result) {
            // console.log(result)
            hideLoading();
            if (result) {
                var decResult = DES3.decrypt(secret, result);
                var msg = JSON.parse(decResult);
                msg = JSON.parse(decResult);
                dtd.resolve(msg);
            }

            PD = [];
            PD2 = [];
        }, function (result) {
            hideLoading();
            if (result) {
                var decResult = DES3.decrypt(secret, result);
                msg = JSON.parse(decResult);
                dtd.reject(msg);
            }
            PD = [];
            PD2 = [];
        });
        return dtd.promise();
    }

    return $.when(ajax());
};
//分页函数
//data格式如下：pageObject":{"end":5,"pageNum":2,"pageSize":178,"start":1,"totlePages":18,"totleSize":0};
export const pagingMobile = function (data, method) {

    var nextbutton = ""; //设置更多
    var txtNextPage = "";
    //设置更多
    if (data.pageObject['pageNum'] < data.pageObject['totlePages']) {
        nextbutton = "<li><a id=\"moreBtn\" onclick=\"" + method + "(" + (data.pageObject['pageNum'] + 1) + ");\">" + txtNextPage + "</a></li>";
    } else {
        nextbutton = "<li><a id=\"moreBtn\" onclick=\"errorMessage('没有更多了')\">" + txtNextPage + "</a></li>";
    }
    $(window).scroll(function () {
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
            $("#moreBtn").click();
        }
    });
    return "<div class=\"pagingDiv MT20\">" + "<ul class=\"paging\">"
        + nextbutton //设置下一页
        + "</ul>" + "</div>";
};

//弹框 alertBox("提示文字","method"); type = 1 有取消按钮; type = 2 没有取消按钮;
export const alertBox = function (tips, method, type) {
    var html = '';
    html += '<div class="width100 height100P positionF" id="alertBox" style="background:rgba(0,0,0,0.3);left:0;top:0;z-index: 1001;">';
    html += '<div class="radius5 whiteBkg width80 positionA textC" style="height:190px;left:10%;top:50%;margin-top: -95px; box-shadow: 0px 0px 3px #666;">';
    html += '<h3 class="font20 PT15 redTex">提&nbsp;示</h3>';
    html += '<p class="font16 blackTex lineHeight1_5x" style="height:75px;padding:15px 5% 0;">' + tips + '</p>';
    if (type == 1) {
        html += '<a class="inlineB grayBkg width35 ML10 MR10 grayTex PT5 PB5 font16" onclick="$(\'#alertBox\').remove();">取消</a>';
    }
    html += '<a class="inlineB redBkg width35 ML10 MR10 whiteTex PT5 PB5 font16" onclick="' + method + '();">确 定</a>';
    html += '</div></div>';
    $("body").append(html);
};

//获取url中的参数   传入参数名name
export const getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
};

export function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}
