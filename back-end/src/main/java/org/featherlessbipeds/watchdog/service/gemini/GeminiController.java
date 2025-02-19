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

    @GetMapping("/title")
    public ResponseEntity<String> getTitle(@RequestParam("prompt") String prompt)
    {
        String response = service.generateTitle(prompt);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/level")
    public ResponseEntity<String> getDangerLevel(@RequestParam("prompt") String prompt)
    {
        String response = service.generateDangerLevel(prompt);
        return ResponseEntity.ok(response);
    }
}
