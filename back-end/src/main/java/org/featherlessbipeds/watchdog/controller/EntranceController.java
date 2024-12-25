package org.featherlessbipeds.watchdog.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.featherlessbipeds.watchdog.dto.EntranceDTO;
import org.featherlessbipeds.watchdog.dto.LoginDTO;
import org.featherlessbipeds.watchdog.service.EntranceService;
import org.featherlessbipeds.watchdog.util.JsonUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("entrance")
@RequiredArgsConstructor
@Slf4j
public class EntranceController {
    private final JsonUtil jsonUtil;
    private final EntranceService service;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO){
        try {
            var entrance = service.login(loginDTO.email(), loginDTO.password());

            if (entrance != null) {
                log.info("Login com: {}",loginDTO.email());
                EntranceDTO entranceDTO = new EntranceDTO(entrance.getId(), entrance.getLocation(), entrance.getCondominium().getId(), entrance.getAlertSet());
                return ResponseEntity.status(HttpStatus.OK).body(entranceDTO);
            }
            log.warn("Falha ao logar com: {}",loginDTO.email());
            String json = jsonUtil.createMsg("Invalid email and/or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(json);
        }
        catch (Exception e){
            log.error("Erro inesperado ao fazer login com: {}", loginDTO.email(), e);
            String json = jsonUtil.createMsg("Erro inesperado");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(json);
        }


    }



}
