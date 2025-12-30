package Team.C.Service.Spot.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = "file:.env", ignoreResourceNotFound = true, factory = DotEnvPropertySourceFactory.class)
public class DotEnvConfig {
}
