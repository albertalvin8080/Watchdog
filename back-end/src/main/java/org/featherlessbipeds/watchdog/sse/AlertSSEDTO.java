package org.featherlessbipeds.watchdog.sse;

import org.featherlessbipeds.watchdog.entity.Alert;

public record AlertSSEDTO(double radius, Alert alert)
{
}
