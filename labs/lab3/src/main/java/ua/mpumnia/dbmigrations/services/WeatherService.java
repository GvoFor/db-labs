package ua.mpumnia.dbmigrations.services;

import java.sql.Date;
import java.util.List;

import ua.mpumnia.dbmigrations.domain.Weather;
import ua.mpumnia.dbmigrations.repositories.WeatherRepository;

public class WeatherService {

  private final WeatherRepository repository;

  public WeatherService(WeatherRepository repository) {
    this.repository = repository;
  }

  public List<Weather> getByCountryAndDate(String country, Date date) {
    return repository.getByCountryAndDate(country, date);
  }
  
}