package org.featherlessbipeds.watchdog.dto;

import org.featherlessbipeds.watchdog.entity.DangerLevel;

public record AlertReinforceDto(Integer previousEntranceId, Integer entranceId, DangerLevel dangerLevel, byte[] description, String transcript,Integer alertId)
{
}
