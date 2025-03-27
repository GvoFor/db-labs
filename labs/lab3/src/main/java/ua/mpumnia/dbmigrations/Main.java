package ua.mpumnia.dbmigrations;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import static org.hibernate.cfg.JdbcSettings.PASS;
import static org.hibernate.cfg.JdbcSettings.URL;
import static org.hibernate.cfg.JdbcSettings.USER;

import io.github.cdimascio.dotenv.Dotenv;

public class Main {

    private static final String DB_URL = "jdbc:postgresql://localhost:5432/db_lab3";

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().load();

        try {
            SessionFactory sessionFactory = new Configuration()
                .addAnnotatedClass(Weather.class)
                .setProperty(URL, DB_URL)
                .setProperty(USER, dotenv.get("DB_USER"))
                .setProperty(PASS, dotenv.get("DB_PASS"))
                .buildSessionFactory();
            
            sessionFactory.inSession(session -> {
                System.out.println(
                    session.createSelectionQuery("from weather").setMaxResults(3).list()
                );
            });
        } catch (HibernateException e) {
            System.out.println("ERROR: " + e.getMessage());
        }
    }
}
