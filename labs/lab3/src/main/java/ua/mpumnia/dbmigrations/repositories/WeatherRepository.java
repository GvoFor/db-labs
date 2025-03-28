package ua.mpumnia.dbmigrations.repositories;

import java.sql.Date;
import java.util.List;

import org.hibernate.Session;

import ua.mpumnia.dbmigrations.domain.Weather;

public class WeatherRepository {

  private final Session session;

  public WeatherRepository(Session session) {
    this.session = session;
  }

  public List<Weather> getByCountryAndDate(String country, Date date) {
    return session
      .createSelectionQuery("from weather where country = :country and date(lastUpdated) = :date", Weather.class)
      .setParameter("country", country)
      .setParameter("date", date)
      .list();
  }
  
}