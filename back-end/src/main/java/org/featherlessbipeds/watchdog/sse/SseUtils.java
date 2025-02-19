package org.featherlessbipeds.watchdog.sse;

import lombok.extern.slf4j.Slf4j;
import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.entity.Entrance;
import org.featherlessbipeds.watchdog.entity.Location;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.List;

@Component
@Slf4j
public class SseUtils
{
    public void sendAlertToNearbyEntrances(List<EntranceEmitter> emitters, Alert alert, double radius)
    {
        Iterator<EntranceEmitter> it = emitters.iterator();
        final Entrance entrance = alert.getEntrance();

        while(it.hasNext())
        {
            var entranceEmitter = it.next();
//            if (entrance.getId() == entranceEmitter.entranceId())
//                continue;

            final Location location = entrance.getLocation();
            double distance = calculateDistance(
                    location.getLatitude(), location.getLongitude(),
                    entranceEmitter.latitude(), entranceEmitter.longitude()
            );

//            log.info("Alert id Before: " + entrance.getId());
//            log.info("Before radius: " + entranceEmitter.entranceId());

            if (distance > radius)
                continue;

//            log.info("Alert id After: " + entrance.getId());
//            log.info("After radius: " + entranceEmitter.entranceId());

            try
            {
                entranceEmitter.emitter().send(new AlertSseDto(alert.getEntrance().getId(), radius, alert));
            }
            catch (Exception e)
            {
                log.error("AlertSSEController exception: {}", e.getMessage());
//                entranceEmitter.emitter().complete();
//                emitters.remove(entranceEmitter);
                it.remove();
            }
        }
    }

    // Haversine formula to calculate distance between two points on Earth
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2)
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
}
