package org.featherlessbipeds.watchdog.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.featherlessbipeds.watchdog.entity.Location;

public record CondominiumRegisterDTO(
        @JsonProperty("location") Location location,
        @JsonProperty("condomName") String condomName,
        @JsonProperty("trusteeName") String trusteeName,
        @JsonProperty("email") String email,
        @JsonProperty("passwordHash") String passwordHash
) {
}
