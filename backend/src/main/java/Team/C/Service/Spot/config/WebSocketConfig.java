package Team.C.Service.Spot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.http.server.ServletServerHttpRequest;

import java.security.Principal;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker to send messages to clients
        // Prefix for messages FROM server TO client
        config.enableSimpleBroker("/topic", "/queue", "/user");

        // Prefix for messages FROM client TO server
        config.setApplicationDestinationPrefixes("/app");

        // Prefix for user-specific messages
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register WebSocket endpoint that clients will connect to
        registry.addEndpoint("/ws-notifications")
                .setAllowedOrigins("http://localhost:5173") // React frontend
                .setHandshakeHandler(new UserHandshakeHandler())
                .withSockJS(); // Fallback for browsers that don't support WebSocket
    }

    /**
     * Custom handshake handler to extract user principal from query parameters
     */
    private static class UserHandshakeHandler extends DefaultHandshakeHandler {
        @Override
        protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
            // Extract email from query parameters
            if (request instanceof ServletServerHttpRequest) {
                ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
                String email = servletRequest.getServletRequest().getParameter("email");

                if (email != null && !email.isEmpty()) {
                    return new Principal() {
                        @Override
                        public String getName() {
                            return email;
                        }
                    };
                }
            }

            // Fallback to default behavior
            return super.determineUser(request, wsHandler, attributes);
        }
    }
}

