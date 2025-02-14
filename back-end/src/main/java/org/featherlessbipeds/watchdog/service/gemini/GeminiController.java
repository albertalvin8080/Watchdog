package org.featherlessbipeds.watchdog.service.gemini;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class GeminiController
{
    private final GeminiService service;

    @GetMapping("/prompt")
    public ResponseEntity<String> getResponse(@RequestParam("prompt") String prompt)
    {
        String response = service.makeRequest(prompt);
        return ResponseEntity.ok(response);
    }
}
