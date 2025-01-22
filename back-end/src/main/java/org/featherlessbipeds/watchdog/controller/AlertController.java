package org.featherlessbipeds.watchdog.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.featherlessbipeds.watchdog.dto.AlertRegisterDTO;
import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.entity.DangerLevel;
import org.featherlessbipeds.watchdog.service.AlertService;
import org.featherlessbipeds.watchdog.util.JsonUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/alert")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin("*")
public class AlertController
{
    private final AlertService service;
    private final JsonUtil jsonUtil;

    @GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Alert>> findAll()
    {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping(path = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createAlert(
            @RequestParam("dangerLevel") DangerLevel dangerLevel,
            @RequestParam("entranceId") Integer entranceId,
            @RequestParam("description") MultipartFile description
    ) throws IOException
    {
        AlertRegisterDTO alert = new AlertRegisterDTO(dangerLevel, description.getBytes(), entranceId);

        try
        {
            return ResponseEntity.status(HttpStatus.CREATED).body(service.createAlert(alert));
        }

        catch (Exception e)
        {
            log.error("Error while trying to create alert");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(jsonUtil.createMsg(e.getMessage()));
        }
    }
}
