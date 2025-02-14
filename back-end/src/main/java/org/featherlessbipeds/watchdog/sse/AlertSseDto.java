package org.featherlessbipeds.watchdog.sse;

import org.featherlessbipeds.watchdog.entity.Alert;

public record AlertSseDto(int entranceId, double radius, Alert alert)
{
}
