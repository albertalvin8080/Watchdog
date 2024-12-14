package org.featherlessbipeds.watchdog.DTO;

import org.featherlessbipeds.watchdog.entity.Location;

public record CondominiumDTO(String condominiumName, String trustee, Location location)
{
}
