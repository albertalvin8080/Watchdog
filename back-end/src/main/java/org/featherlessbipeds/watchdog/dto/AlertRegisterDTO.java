package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.DangerLevel;

public record AlertRegisterDTO(Integer entranceId, DangerLevel dangerLevel, byte[] description, String descriptionText)
{
}
