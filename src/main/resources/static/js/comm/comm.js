$(function () {
    let colNames = ['메뉴명', '메뉴ID', '상위메뉴ID', 'URL', '레벨', '최하위여부'];

    let colModel = [
        {name: 'menuNm', index: 'menuNm', width: 60, sortable: false, resizable: false, align: 'left'},
        {name: 'menuId', index: 'menuId', width: 100, sortable: false, resizable: false, align: 'left'},
        {name: 'upMenuId', index: 'upMenuId', width: 100, sortable: false, resizable: false, align: 'left'},
        {name: 'menuUrl', index: 'menuUrl', width: 200, sortable: false, resizable: false, align: 'left'},
        {name: 'menuLevel', index: 'menuLevel', width: 30, sortable: false, resizable: false, align: 'center'},
        {name: 'menuLowestYn', index: 'menuLowestYn', width: 30, sortable: false, resizable: false, align: 'center'}

    ];

    let cellSelect = {
        url : "/funniest/comm/commMenuLevelList",
        obj : {

        }
    }

    let gridParam = {
        id: "FUN001",
        colNames: colNames,
        colModel: colModel,
        rowNum: 10
    };

    let funTreeGrid = $.funTreeGrid(gridParam);

    let comboParam = [{
        code: "RN",
        codeNm: "10",
        codeGrp: "ALL"
    }];

    let comboData = $.funComboAjaxCall(comboParam);

    $("#condRowNum").funCreatCombo(comboData, {
        code : "RN",
        codeFul: "ROWNUM",
        codeGrp: "ALL",
        value: "10",
        comboType: "ALL",
        comboTypeValue: ""
    });

    let moveViewPage = function (rowId, iCol, cellcontent, e) {
        let rowData = funTreeGrid.getRowData(rowId);

        if (isEmpty(rowData) === true) {
            return;
        }
    };


    let datas = {};
    let doSearch = function (params) {
        $.funAjaxCall({
            url: "/funniest/adm/cm/commMenuLevelTreeList",
            data: JSON.stringify(datas),
            async: true,
            type: "POST",
            callBack: doSearchCallBack
        });
    }

    let doSearchCallBack = function (data) {
        if (isEmpty(data) === true || data.code !== 200 || data.httpStatus !== "OK") {
            return;
        }

        funTreeGrid.addFunJsonData(data);
        // $("#FUN001_PGR").addPagingData(data, "doPageSearch");
        $("#FUN001_TOT").html("총건수 : " + addCommaStr(data.count) + "건");
    }

    doSearch();

});