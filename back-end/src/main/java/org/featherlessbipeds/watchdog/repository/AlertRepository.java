package org.featherlessbipeds.watchdog.repository;

import org.featherlessbipeds.watchdog.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Integer>
{
}
