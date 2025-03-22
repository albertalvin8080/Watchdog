package org.featherlessbipeds.watchdog.repository;

import org.featherlessbipeds.watchdog.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin,Integer> {
    boolean existsByEmailAndPassword(String email, String password);
}
