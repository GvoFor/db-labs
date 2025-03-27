package ua.mpumnia.dbmigrations;

import java.sql.Time;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;

@Entity(name="weather")
public class Weather {
  
    @Id
    private int id;

    @Column(name="country", nullable=false)
    private String country;

    @Column(name="location_name", nullable=false)
    private String locationName;

    @Column(name="last_updated", nullable=false)
    private Timestamp lastUpdated;

    @Column(name="temperature_celsius", nullable=false)
    private float temperatureCelsius;

    @Column(name="condition_text", nullable=false)
    private String conditionText;

    @Column(name="wind_mph", nullable=false)
    private float windMph;

    @Column(name="wind_kph", nullable=false)
    private float windKph;

    @Column(name="wind_degree", nullable=false)
    private int windDegree;

    @Enumerated(value=EnumType.STRING)
    @Column(name="wind_direction", nullable=false)
    private WindDirection windDirection;

    @Column(name="sunrise", nullable=false)
    private Time sunrise;

    @Override
    public String toString() {
        return String.format(
            "Weather {\n  id=%d,\n  country=%s,\n  location=%s,\n  condition=%s,\n  wind_dir=%s,\n  sunrise=%s,\n  updatedAt=%s\n}",
            id, country, locationName, conditionText, windDirection, sunrise, lastUpdated
        );
    }

    public int getId() {
        return id;
    }

    public String getConditionText() {
        return conditionText;
    }

    public String getCountry() {
        return country;
    }

    public Timestamp getLastUpdated() {
        return lastUpdated;
    }

    public String getLocationName() {
        return locationName;
    }

    public Time getSunrise() {
        return sunrise;
    }

    public float getTemperatureCelsius() {
        return temperatureCelsius;
    }

    public int getWindDegree() {
        return windDegree;
    }

    public WindDirection getWindDirection() {
        return windDirection;
    }

    public float getWindKph() {
        return windKph;
    }

    public float getWindMph() {
        return windMph;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setConditionText(String conditionText) {
        this.conditionText = conditionText;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setLastUpdated(Timestamp lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public void setSunrise(Time sunrise) {
        this.sunrise = sunrise;
    }

    public void setTemperatureCelsius(float temperatureCelsius) {
        this.temperatureCelsius = temperatureCelsius;
    }

    public void setWindDegree(int windDegree) {
        this.windDegree = windDegree;
    }

    public void setWindDirection(WindDirection windDirection) {
        this.windDirection = windDirection;
    }

    public void setWindKph(float windKph) {
        this.windKph = windKph;
    }
}
