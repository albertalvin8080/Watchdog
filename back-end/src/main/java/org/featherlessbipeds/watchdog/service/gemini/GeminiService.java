package org.featherlessbipeds.watchdog.service.gemini;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GeminiService
{
    private final String apiKey;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiService(@Value("${gemini.api.key}") String apiKey, WebClient.Builder webClientBuilder, ObjectMapper objectMapper)
    {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
    }

    public String generateContent(String prompt)
    {
        GeminiRequest requestBody = new GeminiRequest(prompt);

        return webClient.post()
                .uri("/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(requestBody))
                .retrieve().bodyToMono(String.class)
                .mapNotNull(this::extractTextFromResponse)
                .block();
    }

    public String formatPrompt(String prompt)
    {
        return String.format("Faça um resumo de no máximo 5 palavras do parágrafo a seguir: %s", prompt);
    }

    public String makeRequest(String prompt)
    {
        String fmtd = formatPrompt(prompt);
        return generateContent(fmtd);
    }

    private String extractTextFromResponse(String responseJson)
    {
        try
        {
            JsonNode rootNode = objectMapper.readTree(responseJson);
            JsonNode candidatesNode = rootNode.path("candidates");

            if (!candidatesNode.isArray() || candidatesNode.isEmpty()) return null;

            JsonNode firstCandidate = candidatesNode.get(0);
            JsonNode contentNode = firstCandidate.path("content");
            JsonNode partsNode = contentNode.path("parts");

            if (!partsNode.isArray() || partsNode.isEmpty()) return null;

            JsonNode firstPart = partsNode.get(0);
            JsonNode textNode = firstPart.path("text");
            if (textNode.isTextual()) return textNode.asText();
            else return null;
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return null;
        }
    }

}