package org.featherlessbipeds.watchdog.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.featherlessbipeds.watchdog.dto.EntranceRegisterDto;
import org.featherlessbipeds.watchdog.dto.EntranceWithCondomDto;
import org.featherlessbipeds.watchdog.dto.LoginDto;
import org.featherlessbipeds.watchdog.entity.Condominium;
import org.featherlessbipeds.watchdog.entity.Entrance;
import org.featherlessbipeds.watchdog.service.CondominiumService;
import org.featherlessbipeds.watchdog.service.EntranceService;
import org.featherlessbipeds.watchdog.util.JsonUtil;
import org.featherlessbipeds.watchdog.util.MapperDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/entrance")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin("*")
public class EntranceController
{
    private final JsonUtil jsonUtil;
    private final EntranceService service;
    private final CondominiumService condominiumService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDTO)
    {
        try
        {
            var entrance = service.login(loginDTO.email(), loginDTO.password());

            if (entrance != null)
            {
                log.info("Login com: {}", loginDTO.email());
                // EntranceDTO entranceDTO = new EntranceDTO(
                //     entrance.getId(), 
                //     entrance.getLocation(), 
                //     entrance.getCondominium().getId(), 
                //     entrance.getAlertSet(),
                //     MapperDto.convert(entrance.getCondominium())
                // );
                EntranceWithCondomDto dto = new EntranceWithCondomDto(
                        entrance.getId(),
                        MapperDto.convert(entrance),
                        MapperDto.convert(entrance.getCondominium())
                );
                return ResponseEntity.status(HttpStatus.OK).body(dto);
            }

            log.warn("Falha ao logar com: {}", loginDTO.email());
            String json = jsonUtil.createMsg("Invalid email and/or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(json);
        }
        catch (Exception e)
        {
            log.error("Erro inesperado ao fazer login com: {}", loginDTO.email(), e);
            String json = jsonUtil.createMsg("Erro inesperado");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(json);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerEntrance(@RequestBody EntranceRegisterDto entrance)
    {
        Condominium condominium = condominiumService.findById(entrance.condominiumId());
        Entrance ent = new Entrance();
        ent.setLocation(entrance.location());
        ent.setEmail(entrance.email());
        //A senha ta sem hash, dps v isso
        ent.setPasswordHash(entrance.passwordHash());
        ent.setCondominium(condominium);

        try
        {
            service.registerEntrance(ent);
            return ResponseEntity.status(HttpStatus.CREATED).body(jsonUtil.createMsg("Entrance criada"));
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
}
