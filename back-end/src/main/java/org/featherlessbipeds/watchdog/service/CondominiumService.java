package org.featherlessbipeds.watchdog.service;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.entity.Condominium;
import org.featherlessbipeds.watchdog.repository.CondominiumRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CondominiumService
{
    private final CondominiumRepository repository;

    public Condominium registerCondominium(Condominium condominium)
    {
        return repository.save(condominium);
    }

    public Condominium loginCondominium(String email, String password)
    {
        return repository.findByEmailAndPasswordHash(email, password);
    }

}
