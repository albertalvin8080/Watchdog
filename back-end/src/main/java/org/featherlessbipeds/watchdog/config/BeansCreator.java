package org.featherlessbipeds.watchdog.config;

import org.featherlessbipeds.watchdog.sse.EntranceEmitter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class BeansCreator
{
    @Bean
    public List<EntranceEmitter> entranceEmitterList() {
//        return new CopyOnWriteArrayList<>();
        return new ArrayList<>();
    }
}
