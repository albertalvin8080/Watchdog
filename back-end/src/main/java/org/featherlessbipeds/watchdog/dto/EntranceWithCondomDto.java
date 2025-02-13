package org.featherlessbipeds.watchdog.dto;

public record EntranceWithCondomDto(
    Integer id,
    EntranceDto entrance,
    CondominiumDto condom) {
}
