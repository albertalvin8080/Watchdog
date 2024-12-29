package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.Location;

public record EntranceRegisterDTO(Location location, String email, String passwordHash, Integer condominiumId) {
}
