package com.funniest.config;

import lombok.Data;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Data
public class Criteria {
    private final Map map;

    public Criteria(Map map) {
        this.map = map;
    }

    public String[] getTypeArr() {
        return map.get("type") == null ? new String[]{} : ((String) map.get("type")).split("");
    }

    public String getListUriLink() {
        UriComponentsBuilder builder = UriComponentsBuilder.fromPath("")
                                                           .queryParam("page", this.getMap().get("page"))
                                                           .queryParam("amount", this.getMap().get("amount"))
                                                           .queryParam("type", this.getMap().get("type"))
                                                           .queryParam("keyword", this.getMap().get("keyword"));

        return builder.toUriString();
    }
}
