package com.example.referentiel.controller;


import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloController {

    @RequestMapping("/coco")
    public String index() {
        return "Greetings from smatine !";
    }

}