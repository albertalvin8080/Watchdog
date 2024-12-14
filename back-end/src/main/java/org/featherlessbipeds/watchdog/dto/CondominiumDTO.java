package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.Location;

public record CondominiumDTO(String condominium, String trustee, Location location)
{
}
