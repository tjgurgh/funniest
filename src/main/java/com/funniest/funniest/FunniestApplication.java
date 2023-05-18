package com.funniest.funniest;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.funniest.*"})
@MapperScan(basePackages = {"com.funniest.*"}, annotationClass = Mapper.class)
public class FunniestApplication {

    public static void main(String[] args) {
        SpringApplication.run(FunniestApplication.class, args);
    }

}
