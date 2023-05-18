$(function () {
    let _condPage = 1;
    let _condRowNum = 10;

    let colNames = ['번호', '제목', '글쓴이', '작성일', '추천', '비추천', '조회'];

    let colModel = [
        {name: 'brdNo', index: 'brdNo', width: 10, sortable: false, resizable: false, align: 'center'},
        {name: 'brdTit', index: 'brdTit', width: 100, sortable: false, resizable: false, align: 'left'},
        {name: 'brdNknm', index: 'brdNknm', width: 20, sortable: false, resizable: false, align: 'center'},
        {name: 'brdRegiDate', index: 'brdRegiDate', width: 20, sortable: false, resizable: false, align: 'center'},
        {name: 'brdLike', index: 'brdLike', width: 20, sortable: false, resizable: false, align: 'center'},
        {name: 'brdHate', index: 'brdHate', width: 20, sortable: false, resizable: false, align: 'center'},
        {name: 'brdCnt', index: 'brdCnt', width: 20, sortable: false, resizable: false, align: 'center'}
    ];

    let gridParam = {
        id: "FUN001",
        colNames: colNames,
        colModel: colModel,
        rowNum: 10,
        onCellSelect: function (rowId, iCol, cellcontent, e) {
            moveViewPage(rowId, iCol);
        }
    };

    let comboParam = [{
        code: "RN",
        codeNm: "10",
        codeGrp: "ALL"
    }];

    let comboData = $.funComboAjaxCall(comboParam);

    $("#condRowNum").funCreatCombo(comboData, {
        code: "RN",
        codeFul: "ROWNUM",
        codeGrp: "ALL",
        value: "10",
        comboType: "",
        comboTypeValue: ""
    });

    $("#condRowNum").change(function () {
        let params = {
            page: 1,
            rowNum: $("#condRowNum option:selected").val()
        }

        doSearch(params);
    });

    let moveViewPage = function (rowId, iCol) {
        let rowData = funGrid.getRowData(rowId);

        if (isEmpty(rowData) === true || isEmpty(rowData.brdNo) === true) {
            return;
        }

        let params = {
            brdNo: rowData.brdNo,
            rowNum: $("#condRowNum option:selected").val(),
            page: 1
        }

        funMovePage("/funniest/board/view", "GET", params);
    };

    let defaultSearchParam = {
        page: _condPage,
        rowNum: _condRowNum
    }

    let doPageSearch = function (page) {
        _condPage = page;

        doSearch({
            page: page,
            rowNum: $("#condRowNum option:selected").val()
        })
    }

    let funGrid = $.funGrid(gridParam);
    let doSearch = function (params) {
        $.funAjaxCall({
            url: "/funniest/board/list/" + params.page + "/" + params.rowNum,
            async: true,
            type: "GET",
            callBack: doSearchCallBack
        });
    }

    let doSearchCallBack = function (data) {
        funGrid.addFunJsonData(data.dataMap);
        $("#FUN001_PGR").addPagingData(data.dataMap, "doPageSearch");
        $("#FUN001_TOT").html("총건수 : " + addCommaStr(data.count) + "건");

    }

    doSearch(defaultSearchParam);
});