package ua.mpumnia.dbmigrations.domain;

import java.sql.Time;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity(name="weather")
@Table(name="weather")
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

    @OneToOne @JoinColumn(name="wind_id", nullable=false)
    private Wind wind;

    @Column(name="sunrise", nullable=false)
    private Time sunrise;

    @Column(name="can_go_outside", nullable=false)
    private boolean canGoOutside;

    @Override
    public String toString() {
        return String.format(
            "Weather {\n  id=%d,\n  country=%s,\n  location=%s,\n  condition=%s,\n  wind=%s,\n  sunrise=%s,\n  updatedAt=%s,\n  canGoOutside=%s\n}",
            id, country, locationName, conditionText, wind, sunrise, lastUpdated, canGoOutside
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

    public Wind getWind() {
        return wind;
    }

    public boolean isCanGoOutside() {
        return canGoOutside;
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

    public void setWind(Wind wind) {
        this.wind = wind;
    }

    public void setCanGoOutside(boolean canGoOutside) {
        this.canGoOutside = canGoOutside;
    }
}
