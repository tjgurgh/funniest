(function ($) {
    jQuery.funAjaxCall = function (params) {
        let rtnData = null;

        let ajaxDefaultParams = {
            type: "POST",
            async: false,
            dataType: "JSON",
            contentType: "application/json; charset=utf-8",
            url: params.url,
            success: function (data) {
                rtnData = data;
            },
            complete: function () {
                if (params.async === true && typeof params.callBack === "function") {
                    params.callBack(rtnData);
                }

                $(window).bind('resize', function () {

                    let newGridWidth = $('.resultArea').width() - 3;

                    $("#FUN001_GRD").setGridWidth(newGridWidth, false);
                    $(".ui-jqgrid-htable").css("width", newGridWidth);
                    $(".ui-jqgrid-btable").css("width", newGridWidth);
                }).trigger('resize');
            },
            error: function (xhr, state, error) {
                $.funAlert({
                    msg: "xhr : " + xhr + "<BR>state" + state + "<BR>error : " + error,
                });
            }
        }

        $.extend(ajaxDefaultParams, params);

        let funLoading = $("#funLoading");

        if (isEmpty(funLoading) === false) {
            funLoading.ajaxStart(function () {
                $(this).show();
                console.log("시작");
            });

            funLoading.ajaxStop(function () {
                $(this).hide();
                console.log("종료");
            });
        }

        $.ajax(ajaxDefaultParams);

        return rtnData;
    };

    jQuery.funComboAjaxCall = function (params) {
        let comboData = $.funAjaxCall({
            url: "/funniest/adm/cm/comboList",
            data: JSON.stringify({
                comboParam: params
            })
        });

        return comboData;
    }

    jQuery.funFileAjaxCall = function (params) {
        let rtnData = null;
        let AjaxDefaultParams = {
            type: "POST",
            async: false,
            dataType: "JSON",
            success: function (data) {
                rtnData = data;
            },
            complete: function () {
                if (typeof params.callBack === "function") {
                    params.callBack(rtnData);
                }
            },
            error: function (xhr, state, error) {
                $.funAlert({
                    msg: "xhr : " + xhr + "<BR> state : " + state + "<BR> error : " + error,
                });
            }
        };
    }

    let funExeclDown = function (url, data) {

        let formId = 'funExcelDownForm';

        if ($("#" + formId) != null && $("#" + formId).attr("id") != null) {
            $("#" + formId).remove();
        }

        let form = $('<form action="' + url + '" method="post" name="' + formId + '" id="' + formId + '"></form>');
        $(form).appendTo('body');

        if (data) {
            for (let i in data) {
                $('<input type="hidden" name="' + i + '" value="' + encodeURIComponent(data[i]) + '" />').appendTo(form);
            }
        }

        form.submit();
    };

    jQuery.funExcelAjaxCall = function (params) {
        let rtnData = null;

        ajaxExcelDefaultParams = {
            async: true,
            success: function (data) {
                rtnData = data;
            },
            complete: function () {
                if (isEmpty(rtnData) || rtnData[FUN_RETURN_CODE] !== "SUCC") {
                    return;
                }

                if (rtnData.fileDeleteYn !== "N") {
                    rtnData["fileDeleteYn"] = "Y";
                }

                funExeclDown(ctx + "/comm/excelFileDownload", rtnData);

                if (typeof params.callBack === "function") {
                    params.callBack(rtnData);
                }
            },
            error: function (xhr, state, error) {
                $.funAlert({
                    msg: "xhr : " + xhr + "<BR> state : " + state + "<BR> error : " + error,
                    logLevel: FUN_LOG_DEBUG
                });
            }
        }

    };

    jQuery.funGrid = function (params) {

        if (isEmpty(params.id) === true) {
            return;
        }

        if (isEmpty(params.divId) === true) {
            params.divId = params.id + "_DIV";
        }

        if (isEmpty(params.tableId) === true) {
            params.tableId = params.id + "_GRD";
        }

        if (isEmpty(params.pagerId) === true) {
            params.pagerId = params.id + "_PGR";
        }

        let datatype = "json";
        if (isEmpty(params.datatype) === false) {
            datatype = params.datatype;
            params.datatype = "";
        }
        let funDefaultGrid = $('#' + params.tableId, '#' + params.divId);

        let imbsDefaultJsonReader = {
            page: "page",
            total: "totalPages",
            root: "dataList",
            id: "id",
            records: "totalCount",
            cell: "cell",
            repeatitems: false
        };

        $.extend(imbsDefaultJsonReader, params.jsonReader);

        let funDefaultGridParams = {
            multiselect: false,
            width: "840",
            height: "auto",
            sortable: false,
            resizable: false,
            viewrecords: true,
            datatype: "local",
            rowNum: 10,
            defaultRows: 10,
            shrinkToFit: false,
            viewsortcols: true,
            minHeight: "250",
            emptyDataText: "조회된 자료가 존재하지 않습니다.",
            loadError: function (xhr, state, err) {
                $.funAlert({
                    msg: "target : funGrid <BR>state :" + state + "<BR>xhr : " + xhr + "<BR>err :" + err
                });
            }
        };

        $.extend(funDefaultGridParams, params);

        funDefaultGridParams.jsonReader = imbsDefaultJsonReader;

        funDefaultGrid.jqGrid(funDefaultGridParams);

        funDefaultGrid.jqGrid('setGridParam', {datatype: datatype});

        let emptyData = {};
        emptyData[imbsDefaultJsonReader.page] = 0;
        emptyData[imbsDefaultJsonReader.total] = 0;
        emptyData[imbsDefaultJsonReader.records] = 0;
        emptyData[imbsDefaultJsonReader.root] = [];

        funDefaultGrid.addFunJsonData(emptyData);

        return funDefaultGrid;
    };

    jQuery.funTreeGrid = function (params) {
        if (isEmpty(params.id) === true) {
            return;
        }

        if (isEmpty(params.divId) === true) {
            params.divId = params.id + "_DIV";
        }

        if (isEmpty(params.tableId) === true) {
            params.tableId = params.id + "_GRD";
        }

        if (isEmpty(params.pagerId) === true) {
            params.pagerId = params.id + "_PGR";
        }

        let datatype = "json";
        if (isEmpty(params.datatype) === false) {
            datatype = params.datatype;
            params.datatype = "";
        }

        let funDefaultGrid = $('#' + params.tableId, '#' + params.divId);

        let imbsDefaultJsonReader = {
            page: "page",
            total: "totalPages",
            root: "dataList",
            id: "menuId",
            records: "totalCount",
            cell: "cell",
            repeatitems: false
        };

        $.extend(imbsDefaultJsonReader, params.jsonReader);

        let funDefaultGridParams = {
            multiselect: true,
            editable: true,
            width: "840",
            height: "auto",
            sortable: false,
            resizable: false,
            viewrecords: true,
            datatype: "text",
            rowNum: 25,
            defaultRows: 25,
            shrinkToFit: false,
            viewsortcols: true,
            minHeight: "250",
            emptyDataText: "조회된 자료가 존재하지 않습니다.",
            caption : "레벨 목록",
            loadui: "disable",
            ExpandColumn: "menuNm",
            ExpandColClick: true,
            treeIcons : {
                "plus": "ui-icon-circlesmall-plus",
                "minus": "ui-icon-circlesmall-minus",
                "leaf" : "ui-icon-document"
            },
            tree_root_level: 0,
            treeGrid: true,
            treeGridModel: "adjacency",
            treeReader: {
                parent_id_field: "upMenuId",
                level_field: "menuLevel",
                leaf_field: "isLeaf",
                expanded_field: "expand"
            },
            editurl: "clientArray",
            gridview: true,
            ondblClickRow: function (rowid) {
                $(this).jqGrid('editRow', rowid, true);
            },
            loadComplete : function() {
                $.funAlert({
                    msg : "완료"
                });
            },
            loadError: function (xhr, state, err) {
                $.funAlert({
                    msg: "target : funTreeGrid <BR>state :" + state + "<BR>xhr : " + xhr + "<BR>err :" + err
                });
            }
        };

        $.extend(funDefaultGridParams, params);

        funDefaultGridParams.jsonReader = imbsDefaultJsonReader;

        funDefaultGrid.jqGrid(funDefaultGridParams);
        funDefaultGrid.jqGrid('setGridParam', {datatype: datatype});

        let emptyData = {};
        emptyData[imbsDefaultJsonReader.page] = 0;
        emptyData[imbsDefaultJsonReader.total] = 0;
        emptyData[imbsDefaultJsonReader.records] = 0;
        emptyData[imbsDefaultJsonReader.root] = [];

        funDefaultGrid.addFunJsonData(emptyData);

        return funDefaultGrid;
    };


    jQuery.fn.insertData = function (pos, data) {
        if (isEmpty(pos) == true || pos == 0) {
            pos = 1;
        }

        try {
            this.jqGrid('addRowData', pos, data);
        } catch (err) {
            $.funAlert({
                msg: err + "",
            });
        }
    };

    jQuery.fn.addFunJsonData = function (data) {
        try {
            if (isEmpty(data.rowNum) === false) {
                this.jqGrid('setGridParam', {rowNum: data.rowNum});
            }
            this.jqGrid('setGridParam', {datatype: "json"});
            this[0].addJSONData(data);

            let dataList = data.dataList;
            let length = dataList.length;
            let defaultRows = this.getGridParam("defaultRows");
            let colModels = this.getGridParam("colModel");
            let colModelCnt = 0;

            for (let i = 0; i < colModels.length; i++) {
                let colModel = colModels[i];
                if (colModels[i].hidden == false) {
                    colModelCnt++;
                }
            }

            let colNameLength = colModelCnt;
            let msg = "&nbsp;";
            for (let i = 0; i < defaultRows - length; i++) {
                if ((i + length + 1) == 1) {
                    msg = this.getGridParam("emptyDataText");
                } else {
                    msg = "&nbsp;";
                }
                this.append('<tr id="' + (i + length + 1) + '" tabindex="-1" role="row" class="ui-widget-content jqgrow ui-row-ltr"><td colspan="' + colNameLength + '" role="gridcell" style="text-align:center;width: 98%;cursor:default;" aria-describedby="fun001_GRD_cb">' + msg + '</td></tr>');
            }

            this.jqGrid('setGridParam', {datatype: "local"});

        } catch (err) {
            console.log("error : addFunJsonData");
            $.funAlert({
                msg: err + ""
            });
        }
    };

    jQuery.fn.addFunJsonTreeData = function (data) {
        try {
            if (isEmpty(data.rowNum) == false) {
                this.jqGrid('setGridParam', {rowNum: data.rowNum});
            }

            this.jqGrid('setGridParam', {datatype: "json"});
            this[0].addJSONData(data);
            let dataList = data.dataList;
            let length = dataList.length;
            let defaultRows = this.getGridParam("defaultRows");
            let colModels = this.getGridParam("colModel");
            let colModelCnt = 0;

            for (let i = 0; i < colModels.length; i++) {
                let colModel = colModels[i];
                if (colModels[i].hidden == false) {
                    colModelCnt++;
                }
            }

            let colNameLength = colModelCnt;
            let msg = "&nbsp;";
            for (let i = 0; i < defaultRows - length; i++) {
                if ((i + length + 1) == 1) {
                    msg = this.getGridParam("emptyDataText");
                } else {
                    msg = "&nbsp;";
                }
                this.append('<tr id="' + (i + length + 1) + '" tabindex="-1" role="row" class="ui-widget-content jqgrow ui-row-ltr"><td colspan="' + colNameLength + '" role="gridcell" style="text-align:center;width:98%;cursor:default;" aria-describedby="fun001_GRD_cb">' + msg + '</td></tr>');
            }

            this.jqGrid('setGridParam', {datatype: "local"});

        } catch (err) {
            console.log("error : addFunJsonTreeData");
            $.funAlert({
                msg: err + ""
            });
        }
    };


    jQuery.fn.setFunParam = function (param) {
        this.jqGrid("setGridParam", param);
    };

    jQuery.fn.getFunParam = function (param) {
        return this.jqGrid("getGridParam", param);
    };

    jQuery.fn.addPagingData = function (data, f) {
        try {
            let page = data.page;
            let totalPages = data.totalPages;
            if (f == null || f == undefined) {
                f = "";
            }

            let prevPage1 = page < 2 ? 1 : page - 1;
            let prevPage2 = page <= 10 ? 1 : (page % 10) == 0 ? page - 19 : page - (page % 10) - 10 + 1;
            let nextPage1 = page + 1 > totalPages ? totalPages : page + 1;
            let nextPage2 = page - (page % 10) + 10 + 1 > totalPages ? totalPages : page - (page % 10) + 10 + 1;

            let sHtml1 = '<a href="javascript:' + f + '(' + prevPage2 + ')" class="pre2"><img src="/image/icon/icon_before2.gif" alt="이전"/></a>'
                + '<a href="javascript:' + f + '(' + prevPage1 + ')" class="pre"><img src="/image/icon/icon_before.gif" alt="이전"/></a>';
            let sHtml = '';

            let startPage = page <= 10 ? 1 : (page % 10) == 0 ? page - 9 : page - (page % 10) + 1;
            let endPage = (page % 10) == 0 ? page : page - (page % 10) + 10 > totalPages ? totalPages : page - (page % 10) + 10;

            for (let i = startPage; i <= endPage; i++) {
                if (i == page) {
                    sHtml += '<strong><span>' + i + '</span></strong>';
                } else {
                    sHtml += '<a href="javascript:' + f + '(' + i + ')"><span>' + i + '</span></a>';
                }
            }

            let sHtml2 = '<a href="javascript:' + f + '(' + nextPage1 + ')" class="next"><img src="/image/icon/icon_after.gif" alt=""/></a>'
                + '<a href="javascript:' + f + '(' + nextPage2 + ')" class="next2"><img src="/image/icon/icon_after2.gif" alt=""/></a>';

            this.html('');
            this.html(sHtml1 + sHtml + sHtml2);
        } catch (err) {
            $.funAlert({
                msg: err + "",
            });
        }
    };

    let getSelectedStr = function (str1, str2) {
        if (str1 == str2) {
            return "selected";
        }

        return "";
    };

    jQuery.fn.funCreatCombo = function (data, options) {
        if (isEmpty(options.code)) {
            return;
        }

        this.empty();

        if (options.comboType == "ALL") {
            this.append("<option value='" + options.comboTypeValue + "' " + getSelectedStr(options.value, options.comboTypeValue) + ">전체</option>");
        } else if (options.comboType == "SEL") {
            this.append("<option value='" + options.comboTypeValue + "' " + getSelectedStr(options.value, options.comboTypeValue) + ">선택</option>");
        }

        let tempData = {};

        let addList = options.beforeAdd;
        if (isEmpty(addList) === false) {
            for (let i = 0; i < addList.length; i++) {
                tempData = addList[i];
                if (options.codeGrp == "ALL" || tempData.codeGrp == options.codeGrp) {
                    this.append("<option value='" + tempData.codeNm + "' " + getSelectedStr(options.value, tempData.code) + ">" + tempData.codeNm + "</option>");
                }
            }
        }

        let tempComboData = data.dataMap[options.code];
        if (isEmpty(tempComboData) === false) {
            for (let i = 0; i < tempComboData.length; i++) {
                tempData = tempComboData[i];
                if (options.codeGrp == "ALL" || tempData.codeGrp == options.codeGrp) {
                    this.append("<option value='" + tempData.codeNm + "' " + getSelectedStr(options.value, tempData.code) + ">" + tempData.codeNm + "</option>");
                }
            }
        }

        addList = options.afterAdd;
        if (isEmpty(addList) === false) {
            for (let i = 0; i < addList.length; i++) {
                tempData = addList[i];
                if (options.groupId == "ALL" || tempData.groupId == options.groupId) {
                    this.append("<option value='" + tempData.codeNm + "' " + getSelectedStr(options.value, tempData.code) + ">" + tempData.codeNm + "</option>");
                }
            }
        }

        try {
            if (isEmpty(options.value)) {
                if (options.defaultSelectedYn != "N") {
                    $("#" + $(this).attr("id")).val($("#" + $(this).attr("id") + " option:first").val());
                }
            }
        } catch (err) {

        }
    };

    jQuery.fn.funDatepicker = function (options) {
        let funDefaultCalendarParams = {
            monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            weekHeader: 'Wk',
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showMonthAfterYear: true,
            buttonImageOnly: true,
            buttonImage: ctx + "/images/btn/btn_calendar.gif",
            showOn: "both",
            yearRange: '2005:c+2?>'
        };

        $.extend(funDefaultCalendarParams, options);

        this.datepicker(funDefaultCalendarParams);

        this.isDate();
    };

    jQuery.fn.isNumberic = function () {
        this.keyup(function () {
            $(this).val($(this).val().replace(/[^\d]+/g, ''));
        });

        this.blur(function () {
            $(this).val($(this).val().replace(/[^\d]+/g, ''));
        });
    };

    jQuery.fn.isNumberic2 = function () {
        this.keyup(function () {
            $(this).val($(this).val().replace(/[^0-9-]/g, ''));
        });

        this.blur(function () {
            $(this).val($(this).val().replace(/[^0-9-]/g, ''));
        });
    };

    jQuery.fn.isNumberic3 = function () {
        this.keyup(function () {
            $(this).val($(this).val().replace(/[^0-9.]/g, ''));
        });

        this.blur(function () {
            $(this).val($(this).val().replace(/[^0-9.]/g, ''));
        });
    };

    jQuery.fn.isAlphaNumberic2 = function () {
        this.keyup(function () {
            $(this).val($(this).val().replace(/[^a-zA-Z0-9_]/g, ''));
        });

        this.blur(function () {
            $(this).val($(this).val().replace(/[^a-zA-Z0-9_]/g, ''));
        });
    };

    jQuery.fn.isEmail = function () {
        this.keyup(function () {
            $(this).val($(this).val().replace(/[^a-zA-Z0-9_@.]/g, ''));
        });

        this.blur(function () {
            $(this).val($(this).val().replace(/[^a-zA-Z0-9_@.]/g, ''));
        });
    };

    jQuery.fn.isDate = function () {
        this.keyup(function () {
            $(this).val(toDateFormat($(this).val()));

        });

        this.blur(function () {
            $(this).val(toDateFormat($(this).val()));
        });
    };

    attchFileDownload = function (atchFileId, fileSn) {
        let url = ctx + "/comm/attchFileDown.do";
        let formId = 'cmiosAttchFileDownForm';

        if ($("#" + formId) != null && $("#" + formId).attr("id") != null) {
            $("#" + formId).remove();
        }

        let form = $('<form action="' + url + '" method="post" name="' + formId + '" id="' + formId + '"></form>');
        $(form).appendTo('body');

        $('<input type="hidden" name="atchFileId" value="' + encodeURIComponent(atchFileId) + '" />').appendTo(form);
        $('<input type="hidden" name="fileSn" value="' + encodeURIComponent(fileSn) + '" />').appendTo(form);

        form.submit();
    };

    getAtchFileHtml = function (fileList) {
        if (isEmpty(fileList) == true || fileList.length < 1) {
            return "";
        }

        let tHtml = "";
        for (let i = 0; i < fileList.length; i++) {
            tHtml += (i == 0 ? '' : '<br/>')
                + '<a id="atchFileDn_' + i + '" href="javascript:attchFileDownload(\'' + fileList[i].atchFileId + '\', \'' + fileList[i].fileSn + '\');">'
                + fileList[i].orignlFileNm + '</a>';
        }

        return tHtml;
    };

    getPopupLinkHtml = function (url, name) {
        if (isEmpty(url) == true) {
            return "";
        }

        if (isEmpty(name) == true) {
            name = "_blank";
        }

        let tHtml = '<a id="popupLinkHtml_0" href="javascript:window.open(\'' + url + '\', \'' + name + '\');void(0)">' + url + '</a>';

        return tHtml;
    };

    // 전체 달력
    jQuery.funFullCalendar = function (params) {
        if (params.id == null || params.id == undefined || params.id == "") {
            return;
        }

        funFullCalendarParams = {
            theme: true,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: false,
            titleFormat: {
                month: "yyyy년 MMMM",
                week: "[yyyy] MMM d일{ [yyyy] MMM d일}",
                day: "yyyy년 MMM d일 dddd"
            },
            monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
            buttonText: {
                today: "오늘",
                month: "월별",
                week: "주별",
                day: "일별"
            }
        };

        $.extend(funFullCalendarParams, params);

        return $('#calendar').fullCalendar(funFullCalendarParams);
    };

    // 확인 알림창
    jQuery.funAlert = function (params) {
        let alertParams = {
            resizable: false,
            height: "auto",
            width: "auto",
            minWidth: 200,
            modal: true,
            title: "확인",
            buttons: {
                "확인": function (event) {
                    $(this).dialog("close");
                    // 확인  버튼 누를시 콜백함수 실행
                    if (isEmpty(params.callBack) === false) {
                        params.callBack(params);
                    }
                }
            }
        };

        $.extend(alertParams, params);

        $("#funDialogMsg").dialog(alertParams);
        $("#funDialogMsgDiv").html(alertParams.msg);

        if ($("#funDialogMsg").width() < alertParams.minWidth) {
            $("#funDialogMsg").width(alertParams.minWidth);
        }
    };

    // 수정(저장)/삭제 에서 확인 취소 창
    jQuery.funConfirm = function (params, callback) {
        confirmParams = {
            resizable: false,
            height: "auto",
            width: "auto",
            minWidth: 200,
            modal: true,
            title: "확인",
            buttons: {
                "확인": function () {
                    $(this).dialog("close");
                    params["confirmData"] = "Y";
                    if (isEmpty(params.callBack) == false) {
                        params.callBack(params);
                    }
                },
                "취소": function () {
                    $(this).dialog("close");
                    params["confirmData"] = "N";
                    if (isEmpty(params.callBack) == false) {
                        params.callBack(params);
                    }
                }
            }
        };

        $.extend(confirmParams, params);

        $("#funDialogMsg").dialog(confirmParams);
        $("#funDialogMsgDiv").html(confirmParams.msg);

        if ($.browser.msie && parseInt($.browser.version, 10) === 7) {
            let w = $("#funDialogMsg #funDialogMsgDiv")[0].clientWidth + 20;
            $("#funDialogMsg").dialog('option', {'width': w});
        }

        if ($("#funDialogMsg").width() < confirmParams.minWidth) {
            $("#funDialogMsg").width(confirmParams.minWidth);
        }

    };

})(jQuery);
