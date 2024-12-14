package org.featherlessbipeds.watchdog.util;

import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonUtil {


    public static String asJsonString(Object obj) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao converter objeto para JSON", e);
        }
    }

}
