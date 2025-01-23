package org.featherlessbipeds.watchdog.dto;

import java.util.Set;

import org.featherlessbipeds.watchdog.entity.Entrance;
import org.featherlessbipeds.watchdog.entity.Location;

public record CondominiumDTO(Integer id, String condominium, String trustee, Location location,
        Set<Entrance> entranceSet) {
}
