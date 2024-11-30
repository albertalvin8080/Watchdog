package org.featherlessbipeds.watchdog.service;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService
{
    private final AlertRepository repository;

    public List<Alert> findAll()
    {
        return repository.findAll();
    }
}
