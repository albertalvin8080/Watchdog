package org.featherlessbipeds.watchdog.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.featherlessbipeds.watchdog.dto.AlertRegisterDto;
import org.featherlessbipeds.watchdog.dto.AlertReinforceDto;
import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.service.AlertService;
import org.featherlessbipeds.watchdog.sse.AlertSseDto;
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
    private final AlertService alertService;
    private final JsonUtil jsonUtil;

    @GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Alert>> findAll()
    {
        return ResponseEntity.ok(alertService.findAll());
    }

    @PostMapping(path = "/reinforce", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> reinforceAlert(
            @RequestParam("previousEntranceId") Integer previousEntranceId,
            @RequestParam("entranceId") Integer entranceId,
            @RequestParam("description") MultipartFile description,
            @RequestParam("transcript") String transcript
    ) throws IOException
    {
        AlertReinforceDto dto = new AlertReinforceDto(
                previousEntranceId,
                entranceId,
                null,
                description.getBytes(),
                transcript
        );

        return null;
    }

    @PostMapping(path = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createAlert(
            @RequestParam("entranceId") Integer entranceId,
            @RequestParam("description") MultipartFile description,
            @RequestParam("transcript") String transcript
    ) throws IOException
    {
        AlertRegisterDto alert = new AlertRegisterDto(
                entranceId, null, description.getBytes(), transcript
        );

        try
        {
            final Alert a = alertService.createAlert(alert);
            return ResponseEntity.status(HttpStatus.CREATED).body(a);
        }
        catch (Exception e)
        {
            log.error("Error while trying to create alert: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(jsonUtil.createMsg(e.getMessage()));
        }
    }

    @GetMapping("/{radius}/{id}")
    //O valor do raio do alerta , id da entrance e retorna todos os alertas no qual ela esta dentro do raio
    public List<AlertSseDto> findAllWithinRadius(@PathVariable Double radius, @PathVariable int id)
    {
        return alertService.findAllWithinRadius(radius, id);
    }

}
