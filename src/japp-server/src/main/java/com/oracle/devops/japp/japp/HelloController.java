package com.oracle.devops.japp.japp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    Logger logger = LoggerFactory.getLogger(HelloController.class);

    @Autowired
    private BuildProperties buildProperties;

    @GetMapping("/japp")
    VersionDAO getAll() {
        logger.info("GET /japp");
        String version = buildProperties.getVersion();
        VersionDAO dao = new VersionDAO(version, "japp", ServerInfo.id);
        return dao;
    }
}
