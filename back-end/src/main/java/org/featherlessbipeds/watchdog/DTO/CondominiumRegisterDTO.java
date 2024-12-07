package org.featherlessbipeds.watchdog.DTO;

import org.featherlessbipeds.watchdog.entity.Location;

public record CondominiumRegisterDTO(Location location,String name,String email,String passwordHash) {
}
