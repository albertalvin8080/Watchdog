package org.featherlessbipeds.watchdog.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.dto.AlertRegisterDTO;
import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.entity.Entrance;
import org.featherlessbipeds.watchdog.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlertService
{
    private final AlertRepository repository;
    private final EntranceService entranceService;

    public List<Alert> findAll()
    {
        return repository.findAll();
    }

    public Alert createAlert(AlertRegisterDTO alert){

        Optional<Entrance> op = entranceService.findById(alert.entranceId());

        if (op.isPresent()) {

            Entrance entrance = op.get();

            Alert newAlert = new Alert();
            newAlert.setDangerLevel(alert.dangerLevel());
            newAlert.setDate(LocalDateTime.now());
            newAlert.setDescription(alert.description());
            newAlert.setEntrance(entrance);

            try {
                repository.save(newAlert);
            }
            catch (PersistenceException e){
                throw new PersistenceException("Error while creating alert");
            }
            return newAlert;

        }

        else {
            throw new EntityNotFoundException("Error while trying to fetch entrance");
        }

    }


}
