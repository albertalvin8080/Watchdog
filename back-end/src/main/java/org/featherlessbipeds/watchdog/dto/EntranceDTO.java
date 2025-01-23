package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.Alert;
import org.featherlessbipeds.watchdog.entity.Location;

import java.util.Set;

public record EntranceDTO(
    Integer id, 
    Location location, 
    Integer condominiumID, 
    Set<Alert> alertSet) {
}
