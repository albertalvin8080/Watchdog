package org.featherlessbipeds.visiwatch.repository;

import org.featherlessbipeds.visiwatch.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Integer>
{
}
