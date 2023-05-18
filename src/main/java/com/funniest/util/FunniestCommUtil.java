package com.funniest.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.funniest.comm.mapper.CommMapper;
import com.funniest.comm.service.CommService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FunniestCommUtil {
    public static final String JSON_PARAM_NM = "funnJsonParameter";
    public static final String JSON_OBJECT_NM = "jsonObject";
    public static final String FUNN_MESSAGE = "funnMesage";
    public static final String FUNN_RETURN_CODE = "funnRtnCode";
    public static final String FUNN_RETURN_CODE_SUCC = "SUCC";
    public static final String FUNN_RETURN_CODE_ERR = "ERR";

    public static boolean isNullString(Object obj) {
        if (obj == null) {
            return true;
        }

        String str = String.valueOf(obj);

        if (("null".equals(str)) || (str.trim()
                                        .length() < 1)) {
            return true;
        }

        return false;
    }

    public static Map comboMap(Map map, CommService commService) throws Exception {
        List rtnList = null;
        Map rtnMap = new HashMap();

        if (map.get("comboParam") instanceof List) {
            List paramList = (List) map.get("comboParam");
            Map temp = null;
            rtnList = null;

            for (int i = 0; i < paramList.size(); i++) {
                temp = (Map) paramList.get(i);

                rtnMap.put(temp.get("code"), commService.selectComboList(temp));
            }

            return rtnMap;
        }

        return map;
    }

    public static Map getTreeMenuCodeMap(List treeList, String upTreeCodeNm, String treeCodeNm) {
        Map map = new HashMap();
        Map tmpMap = null;
        List list = null;

        String tmpUpTreeCode = "";
        String tmpTreeCode = "";

        for (int i = 0; i < treeList.size(); i++) {
            tmpMap = (Map) treeList.get(i);
            tmpUpTreeCode = String.valueOf(tmpMap.get(upTreeCodeNm));
            tmpTreeCode = String.valueOf(tmpMap.get(treeCodeNm));

            if (map.get(tmpUpTreeCode) == null) {
                list = new ArrayList();
                map.put(tmpUpTreeCode, list);
            } else {
                list = (List) map.get(tmpUpTreeCode);
            }

            list.add(list.size(), tmpTreeCode);
        }

        return map;
    }

    public static Map getTreeMap(List treeList, String treeNm) {
        Map map = new HashMap();
        Map tmpMap = null;

        String tmpTreeCode = "";

        for (int i = 0; i < treeList.size(); i++) {
            tmpMap = (Map) treeList.get(i);
            tmpTreeCode = String.valueOf(tmpMap.get(treeNm));

            map.put(tmpTreeCode, tmpMap);
        }

        return map;
    }

    public static String getLeftMenuDataString(Map map) {

        List list = (List) map.get("menuIdMap");
        StringBuilder rtnString = new StringBuilder();
        rtnString.append("<ul class=\"nav nav-pills nav-sidebar flex-column\" data-widget=\"treeview\" role=\"menu\" data-accordion=\"false\">")
                 .append("<li class=\"nav-item\">")
                 .append("<a href=\"#\" class=\"nav-link active\">")
                 .append("<i class=\"nav-icon fas fa-tachometer-alt\"></i>")
                 .append("<p>");

        return rtnString.toString();
    }
}
