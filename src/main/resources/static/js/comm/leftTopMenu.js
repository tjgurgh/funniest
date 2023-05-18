$(document).ready(function () {

    let doSearchCallBack = function (data) {
        if (isEmpty(data.dataMap) === false && data.code === 200 && data.httpStatus === "OK" && isEmpty(data.dataMap.topMenuData) === false) {
            $("#navbar-nav").append(data.dataMap.topMenuData);
            $("#content-header").append(data.dataMap.subTitleData);
        }
    }

    let doSearch = $.funAjaxCall({
        url: "/funniest/adm/cm/commLeftTopMenuList",
        data: JSON.stringify({topMenuYn: "Y"}),
        async: true,
        callBack: doSearchCallBack
    });

    $(document).on("click", ".dropdown-toggle", function() {
        console.log($(this).attr("href"));
        location.href = $(this).attr("href");
    });

    //
    // $(document).on("click", ".dropdown-toggle", function() {
    //     console.log($(this).children("a").attr("href"));
    //     location.href = $(this).children("a").attr("href");
    // });

    // $(document).on("mouseover", ".nav-treeview", function() {
    //     $(this).addClass("menu-is-opening menu-open");
    //     $(this).children(".lowest").css("display", "block");
    //     $(this).children(".lowest").css("position", "absolute");
    //     $(this).children(".lowest").css("backgroundColor", "#d0cece");
    // });
    //
    // $(document).on("mouseout", ".nav-treeview", function() {
    //     $(this).removeClass("menu-is-opening menu-open");
    //     $(this).children(".lowest").css("display", "none");
    // });
});