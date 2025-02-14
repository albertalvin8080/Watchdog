package org.featherlessbipeds.watchdog.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.entity.Location;
import org.featherlessbipeds.watchdog.service.gemini.GeminiService;
import org.featherlessbipeds.watchdog.sse.AlertSSEController;
import org.featherlessbipeds.watchdog.sse.AlertSseDto;
import org.featherlessbipeds.watchdog.dto.AlertRegisterDto;
import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.entity.Entrance;
import org.featherlessbipeds.watchdog.repository.AlertRepository;
import org.featherlessbipeds.watchdog.sse.SseUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlertService
{
    private final GeminiService geminiService;
    private final AlertRepository repository;
    private final EntranceService entranceService;
    private final AlertSSEController alertSSEController;
    private final SseUtils sseUtils;

    public List<Alert> findAll()
    {
        return repository.findAll();
    }

    public Alert createAlert(AlertRegisterDto alert)
    {
        Optional<Entrance> op = entranceService.findById(alert.entranceId());

        if (op.isEmpty())
            throw new EntityNotFoundException("Error while trying to fetch entrance");

        Entrance entrance = op.get();

        String title = geminiService.makeRequest(alert.transcript());
        System.out.println(title);

        Alert newAlert = new Alert();
        newAlert.setDangerLevel(alert.dangerLevel());
        newAlert.setDate(LocalDateTime.now());
        newAlert.setDescription(alert.description());
        newAlert.setEntrance(entrance);
        newAlert.setTitle(title);

        try
        {
            repository.save(newAlert);
        }
        catch (PersistenceException e)
        {
            throw new PersistenceException("Error while creating alert");
        }

        // 200 -> hardcoded radius
        alertSSEController.sendAlertToNearbyEntrances(newAlert, 200);

        return newAlert;
    }

    //Recebe a localizacao da entrance
    public List<AlertSseDto> findAllWithinRadius(Double radius, int entranceId)
    {
        List<AlertSseDto> result = new ArrayList<>();
        List<Alert> allAlerts = this.findAll();

        Optional<Entrance> entranceOp = entranceService.findById(entranceId);
        Entrance entrance = null;

        if(entranceOp.isPresent()){
            entrance = entranceOp.get();
        }

        if(entrance != null) {
            Double lat = entrance.getLocation().getLatitude();
            Double lon = entrance.getLocation().getLongitude();

            for (Alert a : allAlerts) {
                //Verifica se o alerta pertence a entrada
                //A localizacao do alert é a mesma da entrada que criou ele
                Location alertLocation = a.getEntrance().getLocation();
                double distance = sseUtils.calculateDistance(alertLocation.getLatitude(), alertLocation.getLongitude(), lat, lon);

                if (distance <= radius)
                    result.add(new AlertSseDto(a.getEntrance().getId(), radius, a));
            }
        }

        return result;
    }
}

