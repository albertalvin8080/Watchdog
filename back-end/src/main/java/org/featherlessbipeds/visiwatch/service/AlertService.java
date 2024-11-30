package org.featherlessbipeds.visiwatch.service;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.visiwatch.entity.Alert;
import org.featherlessbipeds.visiwatch.repository.AlertRepository;
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
