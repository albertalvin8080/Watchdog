package org.featherlessbipeds.watchdog.sse;

import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.entity.Entrance;
import org.featherlessbipeds.watchdog.entity.Location;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;

@Component
public class SSEUtils
{
    public void sendAlertToNearbyEntrances(List<EntranceEmitter> emitters, Alert alert, double radius)
    {
        for (EntranceEmitter entranceEmitter : emitters)
        {
            final Entrance entrance = alert.getEntrance();

//            if (entrance.getId() == entranceEmitter.entranceId())
//                continue;

            final Location location = entrance.getLocation();
            double distance = calculateDistance(
                    location.getLatitude(), location.getLongitude(),
                    entranceEmitter.latitude(), entranceEmitter.longitude()
            );

            if (distance > radius)
                continue;

            try
            {
                entranceEmitter.emitter().send(new AlertSSEDTO(alert.getEntrance().getId(), radius, alert));
            }
            catch (IOException e)
            {
                System.out.println("AlertSSEController exception: " + e.getMessage());
//                entranceEmitter.emitter().complete();
                emitters.remove(entranceEmitter);
            }
        }
    }

    // Haversine formula to calculate distance between two points on Earth
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        final int R = 6371; // Radius of the Earth in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // Convert to meters
    }

    public void sendHeartbeats(List<EntranceEmitter> emitters)
    {
        for (EntranceEmitter entranceEmitter : emitters)
        {
            try
            {
                entranceEmitter.emitter().send(SseEmitter.event().data("{\"type\":\"heartbeat\"}"));
            }
            catch (IOException e)
            {
                System.out.println("AlertSSEController heartbeat exception: " + e.getMessage());
//                entranceEmitter.emitter().complete();
                emitters.remove(entranceEmitter);
            }
        }
    }
}
