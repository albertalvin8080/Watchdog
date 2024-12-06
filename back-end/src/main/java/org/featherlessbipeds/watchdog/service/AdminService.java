package org.featherlessbipeds.watchdog.service;

import lombok.RequiredArgsConstructor;
import org.featherlessbipeds.watchdog.repository.AdminRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository repository;

    public boolean login(String email, String password){

        return repository.existsByEmailAndPasswordHash(email,password);

    }

}
