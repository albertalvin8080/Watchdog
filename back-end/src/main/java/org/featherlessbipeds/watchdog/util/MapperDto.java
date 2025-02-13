package org.featherlessbipeds.watchdog.util;

import org.featherlessbipeds.watchdog.dto.CondominiumDto;
import org.featherlessbipeds.watchdog.dto.EntranceDto;
import org.featherlessbipeds.watchdog.entity.Condominium;
import org.featherlessbipeds.watchdog.entity.Entrance;

public class MapperDto
{
    public static CondominiumDto convert(Condominium condominium)
    {
        return new CondominiumDto(
                condominium.getId(),
                condominium.getName(),
                condominium.getTrusteeName(),
                condominium.getLocation(),
                condominium.getEntranceSet());
    }

    public static EntranceDto convert(Entrance entrance)
    {
        return new EntranceDto(
                entrance.getId(),
                entrance.getLocation(),
                entrance.getCondominium().getId(),
                entrance.getAlertSet()
        );
    }
}
