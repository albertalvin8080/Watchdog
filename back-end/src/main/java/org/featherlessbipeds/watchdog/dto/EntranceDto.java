package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.entity.Location;

import java.util.Set;

public record EntranceDto(
    Integer id, 
    Location location, 
    Integer condominiumID, 
    Set<Alert> alertSet) {
}
