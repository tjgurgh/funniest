package com.funniest.comm.service;

import com.funniest.comm.mapper.MenuMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MenuServiceImpl implements MenuService {

    private MenuMapper menuMapper;

    @Override
    public List selectMenuList(Map map) throws Exception {
        return menuMapper.selectMenuList(map);
    }
}
