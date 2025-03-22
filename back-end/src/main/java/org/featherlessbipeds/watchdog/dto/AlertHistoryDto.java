package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.DangerLevel;
import org.featherlessbipeds.watchdog.entity.Location;

import java.time.LocalDateTime;

public record AlertHistoryDto(
        Integer alertId,
        DangerLevel dangerLevel,
        LocalDateTime date,
        byte[] description,
        String title,
        Integer reinforcedAlertId,
        Integer entranceId,
        Location location,
        String email,
        Integer condominiumId
) {}