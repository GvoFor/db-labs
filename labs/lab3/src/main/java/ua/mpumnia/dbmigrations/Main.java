package ua.mpumnia.dbmigrations;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import static org.hibernate.cfg.JdbcSettings.PASS;
import static org.hibernate.cfg.JdbcSettings.URL;
import static org.hibernate.cfg.JdbcSettings.USER;

import io.github.cdimascio.dotenv.Dotenv;
import ua.mpumnia.dbmigrations.domain.Weather;
import ua.mpumnia.dbmigrations.domain.Wind;
import ua.mpumnia.dbmigrations.repositories.WeatherRepository;
import ua.mpumnia.dbmigrations.services.WeatherService;
import ua.mpumnia.dbmigrations.ui.ConsoleUI;

public class Main {

    private static final String DB_URL = "jdbc:postgresql://localhost:5432/db_lab3";

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().load();
        SessionFactory sessionFactory = new Configuration()
            .addAnnotatedClass(Weather.class)
            .addAnnotatedClass(Wind.class)
            .setProperty(URL, DB_URL)
            .setProperty(USER, dotenv.get("DB_USER"))
            .setProperty(PASS, dotenv.get("DB_PASS"))
            .buildSessionFactory();
        Session session = sessionFactory.openSession();
        WeatherRepository repository = new WeatherRepository(session);
        WeatherService service = new WeatherService(repository);
        ConsoleUI ui = new ConsoleUI(service);
        ui.startUI();
    }
}
