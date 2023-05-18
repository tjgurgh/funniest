package com.funniest.comm.service;

import com.funniest.comm.mapper.CommMapper;
import com.funniest.util.FunniestCommUtil;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Log4j2
@Service
@AllArgsConstructor
public class CommServiceImpl implements CommService{

    private final CommMapper commMapper;

    @Override
    public List selectMenuList(Map map) throws Exception {
        return commMapper.selectMenuList(map);
    }

    @Override
    public Long selectMenuListCount(Map map) throws Exception {
        return commMapper.selectMenuListCount(map);
    }

    @Override
    public List selectMenuTreeList(Map map) throws Exception {
        return commMapper.selectMenuTreeList(map);
    }

    @Override
    public List selectComboList(Map map) throws Exception {
        return commMapper.selectComboList(map);
    }
}
