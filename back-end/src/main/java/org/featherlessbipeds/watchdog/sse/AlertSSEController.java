package org.featherlessbipeds.watchdog.sse;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.entity.Entrance;
import org.featherlessbipeds.watchdog.entity.Location;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alerts")
@CrossOrigin("*")
public class AlertSSEController
{
    private final List<EntranceEmitter> emitters;
    private final SSEUtils sseUtils;

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

        System.out.println(entranceEmitter);

        return emitter;
    }

    public void sendAlertToNearbyEntrances(Alert alert, double radius) {
        sseUtils.sendAlertToNearbyEntrances(emitters, alert, radius);
    }

}