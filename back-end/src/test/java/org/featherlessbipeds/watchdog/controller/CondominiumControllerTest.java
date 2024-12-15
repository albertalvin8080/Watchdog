package org.featherlessbipeds.watchdog.controller;

import org.featherlessbipeds.watchdog.dto.CondominiumRegisterDTO;
import org.featherlessbipeds.watchdog.entity.Location;
import org.featherlessbipeds.watchdog.service.CondominiumService;
import org.featherlessbipeds.watchdog.util.JsonUtil;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CondominiumControllerTest
{
    private MockMvc mockMvc;

    @Mock
    private CondominiumService service;

    @InjectMocks
    private CondominiumController controller;

    private CondominiumRegisterDTO condominiumRegisterDTO;

    private JsonUtil jsonUtil;

    @BeforeEach
    void setUp()
    {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        condominiumRegisterDTO = new CondominiumRegisterDTO(new Location(-45.4584, -8.9968), "Casa do baralho", "condom@condom", "senha123");

        jsonUtil = new JsonUtil();
    }

    @Test
    @DisplayName("Pra ver se vai retornar 201 CREATED")
    void onRegister_condominium_success() throws Exception
    {
        when(service.registerCondominium(any())).thenReturn(null);

        mockMvc.perform(post("/condom/register")
                        .contentType("application/json")
                        .content(jsonUtil.asJsonString(condominiumRegisterDTO)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Pra ver se vai retornar 409 CONFLICT")
    void onRegister_condominium_conflict() throws Exception
    {
        when(service.registerCondominium(any())).thenThrow(new DataIntegrityViolationException(""));

        mockMvc.perform(post("/condom/register")
                        .contentType("application/json")
                        .content(jsonUtil.asJsonString(condominiumRegisterDTO)))
                .andExpect(status().isConflict());
    }
}