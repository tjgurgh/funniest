package com.funniest.comm.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
@Mapper
public interface CommMapper {
    List selectMenuList(Map map) throws Exception;

    List selectMenuTreeList(Map map) throws Exception;
    Long selectMenuListCount(Map map) throws Exception;
    List selectComboList(Map map) throws Exception;
}
