package Team.C.Service.Spot;

import Team.C.Service.Spot.services.AdminService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;  // <-- ADD THIS

@SpringBootApplication
@EnableScheduling
public class ServiceSpotApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceSpotApplication.class, args);
	}
	
	@Bean
	CommandLineRunner initDatabase(AdminService adminService) {
		return args -> {
			// Create default admin on application startup
			adminService.createDefaultAdmin();
			System.out.println("Default admin initialized: admin@servicespot.com / admin123");
		};
	}
}