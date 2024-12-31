package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.DangerLevel;

public record AlertRegisterDTO(DangerLevel dangerLevel, byte[] description, Integer entranceId) {
}
