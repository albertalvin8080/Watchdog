package org.featherlessbipeds.watchdog.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.featherlessbipeds.watchdog.dto.CondominiumDto;
import org.featherlessbipeds.watchdog.dto.CondominiumRegisterDto;
import org.featherlessbipeds.watchdog.dto.LoginDto;
import org.featherlessbipeds.watchdog.entity.Condominium;
import org.featherlessbipeds.watchdog.service.CondominiumService;
import org.featherlessbipeds.watchdog.util.JsonUtil;
import org.featherlessbipeds.watchdog.util.MapperDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/condom")
@RequiredArgsConstructor
@CrossOrigin("*")
@Slf4j
public class CondominiumController
{
    private final JsonUtil jsonUtil;
    private final CondominiumService service;

    @PostMapping("/register")
    public ResponseEntity<?> registerCondominium(@RequestBody CondominiumRegisterDto condom)
    {
        Condominium condominium = new Condominium();
        condominium.setLocation(condom.location());
        condominium.setName(condom.condomName());
        condominium.setTrusteeName(condom.trusteeName());
        condominium.setEmail(condom.email());
        //A senha ta sem hash, dps v isso
        condominium.setPasswordHash(condom.passwordHash());
        log.info("{}", condom);

        try
        {
            condominium = service.registerCondominium(condominium);
            var condominiumDTO = new CondominiumDto(condominium.getId(), condominium.getName(), condominium.getTrusteeName(), condominium.getLocation(), condominium.getEntranceSet());
            return ResponseEntity.status(HttpStatus.OK).body(condominiumDTO);
        }
        catch (DataIntegrityViolationException e)
        {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT).body(jsonUtil.createMsg("Erro de integridade (Talvez a entidade ja exista): " + e.getMessage()));
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(jsonUtil.createMsg("BOoooM a bomba explodiu: " + e.getMessage()));
        }
    }

    // curl -X POST "http://localhost:8080/condom/login" -H "Content-Type: application/json" -d "{\"email\":\"trustee1@sunrisevillas.com\",\"password\":\"123\"}"
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDTO)
    {
        var condominium = service.loginCondominium(loginDTO.email(), loginDTO.password());

        if (condominium != null)
        {
            var condominiumDTO = MapperDto.convert(condominium);
            return ResponseEntity.status(HttpStatus.OK).body(condominiumDTO);
        }

        String json = jsonUtil.createMsg("Invalid email and/or password.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(json);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Condominium>> getAll()
    {
        return ResponseEntity.ok(service.getAll());
    }
}
