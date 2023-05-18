package com.funniest.board.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.fasterxml.jackson.databind.util.JSONWrappedObject;
import com.funniest.board.service.BoardService;
import com.funniest.comm.vo.FunCommVO;
import com.funniest.config.BasicResponse;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.swing.text.html.parser.Entity;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;

@Log4j2
@Controller
@RequestMapping("/funniest/board")
@AllArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/list")
    public void selectBoardList(Map map, Model model) throws Exception {

    }

    @GetMapping("/list/{page}/{rowNum}")
    @ResponseBody
    public ResponseEntity<BasicResponse> selectBoardList(@PathVariable Map map) throws Exception {
        FunCommVO vo = new FunCommVO();
        vo.setPage(map.get("page"));
        vo.setRowNum(map.get("rowNum"));

        vo.setPagingData(map);

        Map rtnMap = new HashMap();
        rtnMap.put("dataList", boardService.selectBoardList(map));
        rtnMap.put("rowNum", Integer.valueOf(vo.getRowNum()));
        rtnMap.put("start", Integer.valueOf(vo.getStart()));

        log.info(rtnMap);
        BasicResponse basicResponse = BasicResponse.builder()
                                                   .code(HttpStatus.OK.value())
                                                   .httpStatus(HttpStatus.OK)
                                                   .message("게시판 목록 조회 성공")
                                                   .dataList(boardService.selectBoardList(map))
                                                   .dataMap(rtnMap)
                                                   .count(boardService.selectBoardList(map)
                                                                      .stream()
                                                                      .count())
                                                   .build();


        return new ResponseEntity<>(basicResponse, basicResponse.getHttpStatus());
    }
}
