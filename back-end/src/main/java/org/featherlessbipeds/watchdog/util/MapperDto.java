package org.featherlessbipeds.watchdog.util;

import org.featherlessbipeds.watchdog.dto.CondominiumDTO;
import org.featherlessbipeds.watchdog.dto.EntranceDTO;
import org.featherlessbipeds.watchdog.entity.Condominium;
import org.featherlessbipeds.watchdog.entity.Entrance;

public class MapperDto
{
    public static CondominiumDTO convert(Condominium condominium)
    {
        return new CondominiumDTO(
                condominium.getId(),
                condominium.getName(),
                condominium.getTrusteeName(),
                condominium.getLocation(),
                condominium.getEntranceSet());
    }

    public static EntranceDTO convert(Entrance entrance)
    {
        return new EntranceDTO(
                entrance.getId(),
                entrance.getLocation(),
                entrance.getCondominium().getId(),
                entrance.getAlertSet()
        );
    }
}
