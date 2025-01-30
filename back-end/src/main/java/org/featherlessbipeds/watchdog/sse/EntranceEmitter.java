package org.featherlessbipeds.watchdog.sse;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public record EntranceEmitter(SseEmitter emitter, int entranceId, double latitude, double longitude) {
}