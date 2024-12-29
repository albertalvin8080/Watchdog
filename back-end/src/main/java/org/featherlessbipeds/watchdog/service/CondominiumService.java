package org.featherlessbipeds.watchdog.service;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.entity.Condominium;
import org.featherlessbipeds.watchdog.repository.CondominiumRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CondominiumService {
    private final CondominiumRepository repository;

    public Condominium registerCondominium(Condominium condominium) {
        return repository.save(condominium);
    }

    public Condominium loginCondominium(String email, String password) {
        return repository.findByEmailAndPasswordHash(email, password);
    }

    public List<Condominium> getAll() {
        return repository.findAll();
    }

    public Condominium findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Condominium not found"));
    }
}
