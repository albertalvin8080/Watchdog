package org.featherlessbipeds.watchdog.config;

import org.featherlessbipeds.watchdog.ws.WSHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WSHandler WSHandler;

    public WebSocketConfig(WSHandler WSHandler) {
        this.WSHandler = WSHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(WSHandler, "/ws").setAllowedOrigins("*");
    }
}