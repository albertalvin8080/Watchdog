package org.featherlessbipeds.watchdog.sse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.featherlessbipeds.watchdog.entity.Alert;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alerts")
@CrossOrigin("*")
@Slf4j
public class AlertSSEController
{
    private final List<EntranceEmitter> emitters;
    private final SseUtils sseUtils;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAlerts(
            @RequestParam("id") int id,
            @RequestParam("lat") double latitude,
            @RequestParam("lon") double longitude
    )
    {
        SseEmitter emitter = new SseEmitter();
        EntranceEmitter entranceEmitter = new EntranceEmitter(emitter, id, latitude, longitude);
        emitters.add(entranceEmitter);

        emitter.onCompletion(() -> emitters.remove(entranceEmitter));
        emitter.onTimeout(() -> emitters.remove(entranceEmitter));

        log.info("{}", entranceEmitter);

        return emitter;
    }

    public void sendAlertToNearbyEntrances(Alert alert, double radius) {
        sseUtils.sendAlertToNearbyEntrances(emitters, alert, radius);
    }

}