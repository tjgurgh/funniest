var FUN_LOG_INFO = 1;
var FUN_LOG_DEBUG = 2;

var FUN_LOG_LEVEL = FUN_LOG_DEBUG;

var FUN_RETURN_CODE = "funRtnCode";

String.prototype.toCamelize = function () {
    return this.toLowerCase().replace(/_+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
    });
};

String.prototype.replaceAll = function (target, replacement) {
    return this.split(target).join(replacement);
};

String.prototype.digits = function () {
    return this.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};

String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

function isEmpty(s) {
    if (s === null || s === undefined || s === "" || ("" + s).trim().length === 0) {
        return true;
    }

    return false;
}

function jsonToString(obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        if (t == "string")
            obj = '"' + obj + '"';

        return String(obj);
    } else {
        var v, json = [], arr = (obj && obj.constructor == Array);
        for (var n in obj) {
            v = obj[n];
            t = typeof (v);
            if (t == "string")
                v = '"' + v + '"';
            else if (t == "object" && v !== null)
                v = jsonToString(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
}

function addCommaStr(str) {
    if (isEmpty(str) == true) {
        str = "0";
    }

    str = "" + str;
    var strArr = str.split('.');
    var str1 = strArr[0];
    var str2 = strArr.length > 1 ? '.' + strArr[1] : '';

    return str1.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + str2;
}

function toDateFormat(str) {
    if (isEmpty(str) == true) {
        return "";
    }

    str = str.replace(/[^a-zA-Z0-9]/g, '');

    if (str.length < 5) {
        return str;
    }

    if (str.length < 7) {
        return str.substring(0, 4) + "-" + str.substring(4, 6);
    }

    return str.substring(0, 4) + "-" + str.substring(4, 6) + "-" + str.substring(6, 8);
};

function beforeFill(str, fillStr, size) {
    str = "" + str;
    if (isEmpty(str) == true) {
        str = "";
    }

    var tempFill = "";
    for (var i = 0; i < size - str.length; i++) {
        if (str.length == 11) {
            alert("i:" + i + "size:" + size);
        }
        tempFill += fillStr;
    }

    return tempFill + str;
}

function beforeZeroFill(str, size) {
    return beforeFill(str, "0", size);
}

function funPrintPage() {
    window.print();
}

function funMovePage(url, type, data) {
    let formId = 'funMovePageForm';

    let form = $('<form action="' + url + '" method="' + type +'" name="' + formId + '" id="' + formId + '"></form>');
    $(form).appendTo('body');

    if (data) {
        for (var i in data) {
            $('<input type="hidden" name="' + i + '" value="' + encodeURIComponent(data[i]) + '" />').appendTo(form);
        }
    }
    form.submit();
}

function funMovePage2(url, data) {

    var formId = 'funMovePageForm';

    var form = $('<form action="' + url + '" method="post" name="' + formId + '" id="' + formId + '"></form>');
    $(form).appendTo('body');

    if (data) {
        for (var i in data) {
            $('<input type="hidden" name="' + i + '" value="' + encodeURIComponent(data[i]) + '" />').appendTo(form);
        }
    }

    form.submit();
}

function getElementValueToString(eleValue) {
    var strValue = "";

    if (eleValue == "[object]") {
        strValue = eleValue.value;
    } else {
        strValue = eleValue;
    }
    return strValue;
}

// ^ : 문자열 시작 , \s : 공백 문자, + : 앞 문자가 하나 이상, | : or를 나타낸다, g : 전역값
function isRequired(eleValue) {
    var strValue = getElementValueToString(eleValue);

    if (strValue.replace(/^(\s+)|(\s+)$/g, "").length == 0) {
        return false;
    } else {
        return true;
    }
}

function fnLimitLength(str, length) {
    str = str + "";
    if (getLengthByteUTF8(str) > length) {
        return false;
    }

    return true;
}

function getLengthByteUTF8(input) {
    var byteLength = 0;

    for (var inx = 0; inx < input.length; inx++) {
        var oneChar = input.charAt(inx);
        byteLength += charByteSize(oneChar);
    }

    return byteLength;
}

function charByteSize(ch) {
    if (ch == null || ch.length == 0) {
        return 0;
    }
    var charCode = ch.charCodeAt(0);
    if (charCode <= 0x00007F) {
        return 1;
    } else if (charCode <= 0x0007FF) {
        return 2;
    } else if (charCode <= 0x00FFFF) {
        return 3;
    } else {
        return 4;
    }
}

function isValidURL(url) {
    var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    if (RegExp.test(url)) {
        return true;
    } else {
        return false;
    }
}

function isFileValid() {

    // 파일목록
    var fileList = document.getElementById("fileElementId").files;

    for (var i = 0; i < fileList.length; i++) {
        // 파일 확장자
        var ext = fileList[i].name.split(".").pop().toLowerCase();

        if (isEmpty(ext) == false && $.inArray(ext, ['hwp', 'ppt', 'xls', 'pptx', 'xlsx', 'pdf']) == -1) {
            $.csAlert({
                msg: "업로드 파일은 '한글오피스(hwp), 파워포인트(ppt), 엑셀(xls), PDF' 만 가능합니다.",
                callBack: function () {
                    $("#fileElementId").focus();
                }
            });

            return false;
        }

        // 파일크기
        var fileSize = Math.round(fileList[i].size);
        var fileMaxSize = 10 * 1024 * 1024;

        if (isEmpty(fileSize) == false && (fileSize) > fileMaxSize) {
            $.csAlert({
                msg: "업로드 파일 크기는 10MB까지만 가능합니다.",
                callBack: function () {
                    $("#fileElementId").focus();
                }
            });

            return false;
        }
    }
}

// phoneFomatter('0100000000');    //010-000-0000, type 0을 입력하면 가운데 자리 가려줌
function phoneFomatter(num, type) {
    var formatNum = '';

    if (num.length == 11) {

        if (type == 0) {
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
        } else {
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }

    } else if (num.length == 8) {
        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else {

        if (num.indexOf('02') == 0) {

            if (type == 0) {
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
            } else {
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
            }

        } else {

            if (type == 0) {
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
            } else {
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }

        }
    }

    return formatNum;
}

/* 리뉴얼 */

//JavaScript Document
//Main   Page
function getContextPath() {
    var offset = location.href.indexOf(location.host) + location.host.length;
    var ctxPath = location.href.substring(offset, location.href.indexOf('/', offset + 1));
    return ctxPath;
}

function dropDownLink(menuUrl) {
    location.href = '"' + menuUrl + '"';
}

function expandAll() {
    let rows = $("#FUN001_GRD").jqGrid('getGridParam', 'data');
    if (rows) {
        for (let i = 0; i < rows.length; i++) {
            $("#FUN001_GRD").jqGrid('expandRow', rows[i]);
            //$("#treegrid").jqGrid('expandNode',rows[i]);
        }
    }
}

function collapseAll() {
    let rows = $("#FUN001_GRD").jqGrid('getGridParam', 'data');
    if (rows) {
        for (let i = 0; i < rows.length; i++) {
            $("#FUN001_GRD").jqGrid('collapseRow', rows[i]);
            //$("#treegrid").jqGrid('collapseNode',rows[i]);
        }
    }
}

function subOff() {
    // m1.style.display="none";m2.style.display="none";m3.style.display="none";m4.style.display="none";/*m5.style.display="none";m6.style.display="none";*/
    $("#m1, #m2, #m3, #m4, #m5, #m6, #m7").css("display", "none");
}

function subOn() {
    // m1.style.display="block";m2.style.display="block";m3.style.display="block";m4.style.display="block";/*m5.style.display="block";m6.style.display="block";*/
    $("#m1, #m2, #m3, #m4, #m5, #m6, #m7").css("display", "block");
}

function bgRestore(menu) {
//menu.style.background="url(image/topmenu_bg.png)";
    menu.style.background = "#ffffff";
}

function bgSwap(menu, bgName) {
    menu.style.background = "url(bgName)";
}

function listOff(list) {
    list.style.display = "none";
}

function listOn(list) {
    list.style.display = "block";
}

function slideSwitch() {
    var $active = $('#slideshow IMG.active');

    if ($active.length == 0) $active = $('#slideshow IMG:last');

    var $next = $active.next().length ? $active.next()
        : $('#slideshow IMG:first');
    $active.addClass('last-active');

    $next.css({opacity: 0.0})
        .addClass('active')
        .animate({opacity: 1.0}, 1000, function () {
            $active.removeClass('active last-active');
        });
}

$(function () {
    setInterval("slideSwitch()", 2000);
});
