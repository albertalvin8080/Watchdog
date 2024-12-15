package org.featherlessbipeds.watchdog.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.dto.CondominiumDTO;
import org.featherlessbipeds.watchdog.dto.CondominiumRegisterDTO;
import org.featherlessbipeds.watchdog.dto.CondominiumLoginDTO;
import org.featherlessbipeds.watchdog.entity.Condominium;
import org.featherlessbipeds.watchdog.service.CondominiumService;
import org.featherlessbipeds.watchdog.util.JsonUtil;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/condom")
@RequiredArgsConstructor
public class CondominiumController
{
    private final JsonUtil jsonUtil;
    private final CondominiumService service;

    @PostMapping("/register")
    public ResponseEntity<String> registerCondominium(@RequestBody CondominiumRegisterDTO condom)
    {
        Condominium condominium = new Condominium();
        condominium.setLocation(condom.location());
        condominium.setName(condom.name());
        condominium.setEmail(condom.email());
        //A senha ta sem hash, dps v isso
        condominium.setPasswordHash(condom.passwordHash());

        try
        {
            service.registerCondominium(condominium);
            return ResponseEntity.status(HttpStatus.CREATED).body("Condominio criado");
        }
        catch (DataIntegrityViolationException e)
        {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Erro de integridade (Talvez a entidade ja exista): " + e.getMessage());
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("BOoooM a bomba explodiu: " + e.getMessage());
        }
    }

    // curl -X POST "http://localhost:8080/condom/login" -H "Content-Type: application/json" -d "{\"email\":\"trustee1@sunrisevillas.com\",\"password\":\"123\"}"
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CondominiumLoginDTO loginDTO) throws JsonProcessingException
    {
        System.out.println(loginDTO);
        var condominium = service.loginCondominium(loginDTO.email(), loginDTO.password());

        if (condominium != null)
        {
            var condominiumDTO = new CondominiumDTO(condominium.getName(), condominium.getTrusteeName(), condominium.getLocation());
            return ResponseEntity.status(HttpStatus.OK).header("login-success", "true").body(condominiumDTO);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Invalid email and/or password.");
        String json = jsonUtil.asJsonString(response);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).header("login-success", "false").body(json);
    }

}
