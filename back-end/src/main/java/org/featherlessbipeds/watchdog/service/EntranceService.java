package org.featherlessbipeds.watchdog.service;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.entity.Entrance;
import org.featherlessbipeds.watchdog.repository.EntranceRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EntranceService {

    private final EntranceRepository repository;

    public Entrance registerEntrance(Entrance entrance) {
        return repository.save(entrance);
    }

    public Entrance login(String email, String password) {
        return repository.findByEmailAndPasswordHash(email, password);
    }

    public Optional<Entrance> findById(Integer id){
        return  repository.findById(id);
    }

}
