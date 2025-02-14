package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.DangerLevel;

public record AlertRegisterDto(Integer entranceId, DangerLevel dangerLevel, byte[] description, String transcript)
{
}
