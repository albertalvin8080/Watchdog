package org.featherlessbipeds.watchdog.repository;

import org.featherlessbipeds.watchdog.entity.Entrance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntranceRepository extends JpaRepository<Entrance, Integer>
{
    Entrance findByEmailAndPasswordHash(String email, String passwordHash);
}
