package com.funniest.comm.service;

import java.util.List;
import java.util.Map;

public interface CommService {
    List selectMenuList(Map map) throws Exception;
    Long  selectMenuListCount(Map map) throws Exception;

    List selectMenuTreeList(Map map) throws Exception;
    List selectComboList(Map map) throws Exception;
}
