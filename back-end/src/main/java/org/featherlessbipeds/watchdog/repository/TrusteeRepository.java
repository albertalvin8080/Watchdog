package org.featherlessbipeds.watchdog.repository;

import org.featherlessbipeds.watchdog.entity.notused.Trustee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrusteeRepository extends JpaRepository<Trustee, Integer>
{
}
