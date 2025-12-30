package Team.C.Service.Spot.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.core.env.EnumerablePropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertySourceFactory;
import java.io.IOException;

public class DotEnvPropertySourceFactory implements PropertySourceFactory {

    @Override
    public PropertySource<?> createPropertySource(String name, EncodedResource resource) throws IOException {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();
        
        return new EnumerablePropertySource<Dotenv>(name != null ? name : resource.getResource().getFilename(), dotenv) {
            @Override
            public Object getProperty(String key) {
                return source.get(key);
            }

            @Override
            public String[] getPropertyNames() {
                return source.entries().stream()
                        .map(entry -> entry.getKey())
                        .toArray(String[]::new);
            }
        };
    }
}
