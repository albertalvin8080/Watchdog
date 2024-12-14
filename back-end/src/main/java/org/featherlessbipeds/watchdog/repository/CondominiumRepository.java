package org.featherlessbipeds.watchdog.repository;

import org.featherlessbipeds.watchdog.entity.Condominium;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CondominiumRepository extends JpaRepository<Condominium, Integer>
{
    boolean existsByEmailAndPasswordHash(String email, String passwordHash);
    Condominium findByEmailAndPasswordHash(String email, String passwordHash);
}
