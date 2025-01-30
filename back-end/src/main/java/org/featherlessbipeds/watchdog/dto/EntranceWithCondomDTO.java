package org.featherlessbipeds.watchdog.dto;

public record EntranceWithCondomDTO(
    Integer id,
    EntranceDTO entrance,
    CondominiumDTO condom) {
}
