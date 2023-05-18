package com.funniest.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BasicResponse {
    private Integer code;
    private HttpStatus httpStatus;
    private String message;
    private Long count;
    private Map dataMap;
    private List dataList;

}
