package com.funniest.comm.controller;

import com.funniest.comm.service.MenuService;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequestMapping("/funniest")
@Controller
@Log4j2
public class MenuController {

    private MenuService menuService;

    @GetMapping("/main/mainMenuList")
    public void mainMenuList() throws Exception{

    }

    @GetMapping("/main/mainTop")
    public void main(@RequestBody Map map) throws Exception {
        log.info("main 실행");

        System.out.println("map = " + map);

    }

    @GetMapping("/main/mainPage")
    public void mainPage() throws Exception {
        log.info("main 실행");
    }

    @GetMapping("/menu/menuLevelList")
    public void menuLevelList() throws Exception {
        log.info("menuLevelTree");
    }

    @PostMapping("/menu/menuLevelList1")
    @ResponseBody
    public void menuLevelList1(@RequestBody Map map) throws Exception {
        log.info("menuLevelTree12312");
        log.info(map);
    }
}
