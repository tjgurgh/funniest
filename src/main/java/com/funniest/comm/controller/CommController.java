package com.funniest.comm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.fasterxml.jackson.databind.util.JSONWrappedObject;
import com.funniest.comm.mapper.CommMapper;
import com.funniest.comm.mapper.MenuMapper;
import com.funniest.comm.service.CommService;
import com.funniest.comm.service.MenuService;
import com.funniest.config.BasicResponse;
import com.funniest.util.FunniestCommUtil;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import java.util.*;

@Log4j2
@Controller
@RequestMapping("/funniest/adm/cm/*")
public class CommController {

    private final CommService commService;
    private Map menuCodeMap = null;
    private Map menuMap = null;

    public CommController(CommService commService) {
        this.commService = commService;
    }

    @GetMapping("/design")
    public void design() throws Exception {

    }

    @GetMapping("/menuLevelList")
    public void menuLevelList() throws Exception {
    }

    @PostMapping("/commLeftTopMenuList")
    @ResponseBody
    public ResponseEntity<BasicResponse> commLeftTopMenuList(@RequestBody Map map) throws Exception {
        Map rtnMap = new HashMap();

        List leftTopMenuList = commService.selectMenuList(map);
        menuCodeMap = FunniestCommUtil.getTreeMenuCodeMap(leftTopMenuList, "upMenuId", "menuId");
        menuMap = FunniestCommUtil.getTreeMap(leftTopMenuList, "menuId");

        if ("Y".equals(String.valueOf(map.get("topMenuYn")))) {
            rtnMap.put("topMenuData", getTopMenuDataString(leftTopMenuList));
        }

        if ("Y".equals(String.valueOf(map.get("leftMenuYn"))) && FunniestCommUtil.isNullString(String.valueOf(map.get("upMenuId"))) == false) {
            rtnMap.put("leftMenuData", "");
        }

        rtnMap.put("subTitleData", getSubTitleString(menuMap, ""));

        BasicResponse basicResponse = BasicResponse.builder()
                                                   .code(HttpStatus.OK.value())
                                                   .httpStatus(HttpStatus.OK)
                                                   .message("메뉴 목록 조회 성공")
                                                   .dataMap(rtnMap)
                                                   .build();

        return new ResponseEntity<>(basicResponse, basicResponse.getHttpStatus());
    }

    @GetMapping("/commMenuLevelList")
    @ResponseBody
    public ResponseEntity<BasicResponse> menuLevelList(Map map) throws Exception {

        BasicResponse basicResponse = BasicResponse.builder()
                                                   .code(HttpStatus.OK.value())
                                                   .httpStatus(HttpStatus.OK)
                                                   .message("메뉴 목록 조회 성공")
                                                   .dataList(commService.selectMenuList(map))
                                                   .count(commService.selectMenuListCount(map))
                                                   .build();

        return new ResponseEntity<>(basicResponse, basicResponse.getHttpStatus());
    }

    @PostMapping("/commMenuLevelTreeList")
    @ResponseBody
    public ResponseEntity<BasicResponse> menuLevelTreeList(@RequestBody Map map) throws Exception {

        BasicResponse basicResponse = BasicResponse.builder()
                                                   .code(HttpStatus.OK.value())
                                                   .httpStatus(HttpStatus.OK)
                                                   .message("메뉴 목록 조회 성공")
                                                   .dataList(commService.selectMenuTreeList(map))
                                                   .dataMap(null)
                                                   .count(commService.selectMenuListCount(map))
                                                   .build();

        return new ResponseEntity<>(basicResponse, basicResponse.getHttpStatus());
    }

    @PostMapping("/comboList")
    @ResponseBody
    public ResponseEntity<BasicResponse> comboList(@RequestBody Map map) throws Exception {
        Map rtnMap = FunniestCommUtil.comboMap(map, commService);
        List rtnList = (List) rtnMap.get("rtnList");


        BasicResponse basicResponse = BasicResponse.builder()
                                                   .code(HttpStatus.OK.value())
                                                   .httpStatus(HttpStatus.OK)
                                                   .message("콤보 목록 조회 성공")
                                                   .dataList(rtnList)
                                                   .dataMap(rtnMap)
                                                   .build();

        return new ResponseEntity<>(basicResponse, basicResponse.getHttpStatus());
    }

    public String getTopMenuDataString(List menuList) {
        List list = (List) menuCodeMap.get("MU00000000");
        StringBuilder rtnString = new StringBuilder();

//        rtnString.append("<li class=\"nav-item d-none d-sm-inline-block\">")
//                 .append("<a href=\"/funniest\" class=\"nav-link\">" + getTopSubMenuDataString(list) + "</a>")
//                 .append("</li>");
        rtnString.append(getTopSubMenuDataString(list));

        return rtnString.toString();
    }

    private String getTopSubMenuDataString(List list) {
        Map dataMap = null;
        List subList = null;
        StringBuilder rtnString = new StringBuilder();
        int j = 0;

        if (list == null || list.size() == 0) {
            return "";
        }
        for (int i = 0; i < list.size(); i++) {
            dataMap = (Map) menuMap.get((String.valueOf(list.get(i))));
            if (dataMap != null) {
                rtnString.append(topMenuDataString(dataMap));

                if ("N".equals(dataMap.get("menuLowestYn")) && menuCodeMap.get(dataMap.get("menuId")) != null) {

                    subList = (List) menuCodeMap.get(dataMap.get("menuId"));

                    if (subList.size() > 0) {
                        j++;
                        rtnString.append("<ul id=\"m" + j + "\" class=\"dropdown-menu border-0 shadow\" aria-labelledby=\"dropdownSubMenu" + dataMap.get("menuId") + "\">" + "\n")
                                 .append(getTopSubMenuDataString((List) menuCodeMap.get(dataMap.get("menuId"))))
                                 .append("</ul>" + "\n");

                    }
                }

                rtnString.append("</li>" + "\n");
            }
        }

        return rtnString.toString();
    }

    private String topMenuDataString(Map map) {
        boolean isMenuLowestYn = "N".equals(map.get("menuLowestYn")) ? false : true;
        String menuUrl = FunniestCommUtil.isNullString(map.get("menuUrl")) == false ? String.valueOf(map.get("menuUrl")) : "";
        String menuId = FunniestCommUtil.isNullString(map.get("menuId")) == false ? String.valueOf(map.get("menuId")) : "";
        String menuNm = FunniestCommUtil.isNullString(map.get("menuNm")) == false ? String.valueOf(map.get("menuNm")) : "";
        String menuLevel = FunniestCommUtil.isNullString(map.get("menuLevel")) == false ? String.valueOf(map.get("menuLevel")) : "";

        String rtnString = "1".equals(menuLevel) ?
                "<li class=\"nav-item dropdown dropdown-hover\">" +
                        "<a id=\"dropdownSubMenu" + menuId + "\" href=\"" + menuUrl + "\" data-menuId=\"" + menuId + "\" data-menuLevel=\"" + menuLevel + "\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"" +
                        " class=\"nav-link dropdown-toggle\">" + menuNm + "</a>" + "\n" :
                "2".equals(menuLevel) == true ?
                        "<li class=\"dropdown-submenu dropdown-hover\">" +
                                "<a id=\"dropdownSubMenu" + menuId + "\" href=\"" + menuUrl + "\" data-menuId =\"" + menuId + "\" data-menuLevel=\"" + menuLevel + "\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"" +
                                " class=\"dropdown-item dropdown-toggle\">" + menuNm + "</a>" + "\n" :
                        "<li ><a id=\"dropdownSubMenu" + menuId + "\" href=\"" + menuUrl + "\" tabindex=\"-1\" data-menuId=\"" + menuId + "\" data-menuLevel=\"" + menuLevel + "\" class=\"dropdown-item\">" + menuNm + "</a>" + "\n";

        return rtnString;
    }

    private String getSubTitleString(Map map, String id) {
        log.info(map);
        boolean isMenuLowestYn = "N".equals(map.get("menuLowestYn")) ? false : true;
        String menuUrl = FunniestCommUtil.isNullString(map.get("menuUrl")) == false ? String.valueOf(map.get("menuUrl")) : "";
        String menuId = FunniestCommUtil.isNullString(map.get("menuId")) == false ? String.valueOf(map.get("menuId")) : "";
        String menuNm = FunniestCommUtil.isNullString(map.get("menuNm")) == false ? String.valueOf(map.get("menuNm")) : "";
        String menuLevel = FunniestCommUtil.isNullString(map.get("menuLevel")) == false ? String.valueOf(map.get("menuLevel")) : "";

        String rtnString = "<div class=\"container-fluid\">" +
                                "<div class=\"row mb-2\">" +
                                    "<div class=\"col-sm-6\">" +
                                        "<h1>" + menuNm + "</h1>" +
                                    "</div>" +
                                 "<div class=\"col-sm-6\">" +
                                    "<ol class=\"breadcrumb float-sm-right\">" +
                                        "<li class=\"breadcrumb-item\"><a href=\"/funniest\">Home</a></li>" +
                                        "<li class=\"breadcrumb-item active\">" + menuNm + "</li>" +
                                    "</ol>" +
                                "</div>" +
                                "</div>" +
                            "</div>";

        return rtnString;
    }
}
