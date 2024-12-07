package org.featherlessbipeds.watchdog.controller;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.DTO.CondominiumRegisterDTO;
import org.featherlessbipeds.watchdog.DTO.LoginDTO;
import org.featherlessbipeds.watchdog.entity.Condominium;
import org.featherlessbipeds.watchdog.service.CondominiumService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("condom")
@RequiredArgsConstructor
public class CondominiumController {

    private final CondominiumService service;

    @PostMapping("register")
    public ResponseEntity<String> registerComdominium(@RequestBody CondominiumRegisterDTO condom){

        Condominium condominium = new Condominium();
        condominium.setLocation(condom.location());
        condominium.setName(condom.name());
        condominium.setEmail(condom.email());
        //A senha ta sem hash, dps v isso
        condominium.setPasswordHash(condom.passwordHash());

        try{
            service.registerCondominium(condominium);
            return ResponseEntity.status(HttpStatus.CREATED).body("Condominio criado");
        }
        catch (DataIntegrityViolationException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Erro de integridade (Talvez a entidade ja exista): "+e.getMessage());
        }
        catch ( Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("BOoooM a bomba explodiu: "+e.getMessage());
        }
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody LoginDTO condom){

        boolean found = service.loginCondominium(condom.email(),condom.password());

        if(found){
            return ResponseEntity.status(HttpStatus.OK).body("Logado com sucesso");
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nao possui autorizacao para acessar");

    }



}
