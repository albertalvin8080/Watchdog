package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.Location;

public record EntranceRegisterDto(Location location, String email, String passwordHash, Integer condominiumId) {
}
