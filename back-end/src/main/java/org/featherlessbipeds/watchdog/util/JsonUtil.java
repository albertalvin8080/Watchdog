package org.featherlessbipeds.watchdog.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class JsonUtil
{
    private final ObjectMapper objectMapper;

    public JsonUtil()
    {
         this.objectMapper = new ObjectMapper();
    }

    public String asJsonString(Object obj)
    {
        try
        {
            return objectMapper.writer().writeValueAsString(obj);
        }
        catch (Exception e)
        {
            throw new RuntimeException("Erro ao converter objeto para JSON", e);
        }
    }

    public String createMsg(String msg)
    {
        Map<String, String> response = new HashMap<>();
        response.put("message", msg);
        return this.asJsonString(response);
    }

}
