package org.featherlessbipeds.visiwatch.controller;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.visiwatch.entity.Alert;
import org.featherlessbipeds.visiwatch.service.AlertService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/alert")
@RequiredArgsConstructor
public class AlertController
{
    private final AlertService service;

    @GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Alert>> findAll()
    {
        return ResponseEntity.ok(service.findAll());
    }
}
