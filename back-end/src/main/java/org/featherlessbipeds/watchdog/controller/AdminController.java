package org.featherlessbipeds.watchdog.controller;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.dto.LoginDto;
import org.featherlessbipeds.watchdog.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

    private final AdminService service;

    @PostMapping
    public ResponseEntity<String> login(@RequestBody LoginDto admin){

        boolean found = service.login(admin.email(), admin.password());

        if(found){
        return ResponseEntity.status(HttpStatus.OK).body("Logado com sucesso");
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nao possui autorizacao para acessar");

    }

}
