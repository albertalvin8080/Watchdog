package org.featherlessbipeds.watchdog.util;

import org.featherlessbipeds.watchdog.dto.CondominiumDTO;
import org.featherlessbipeds.watchdog.entity.Condominium;

public class MapperDto {
    public static CondominiumDTO convert(Condominium condominium) {
        return new CondominiumDTO(
            condominium.getId(), 
            condominium.getName(), 
            condominium.getTrusteeName(), 
            condominium.getLocation(), 
            condominium.getEntranceSet());
    }
}
