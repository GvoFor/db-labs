package ua.mpumnia.dbmigrations.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity(name="wind")
@Table(name="wind")
public class Wind {
  
    @Id
    private int id;

    @Column(name="wind_mph", nullable=false)
    private float windMph;

    @Column(name="wind_kph", nullable=false)
    private float windKph;

    @Column(name="wind_degree", nullable=false)
    private int windDegree;

    @Enumerated(value=EnumType.STRING)
    @Column(name="wind_direction", nullable=false)
    private WindDirection windDirection;

    @Override
    public String toString() {
        return String.format(
            "Wind {\n  id=%d,\n  wind_mph=%f,\n  wind_kph=%f,\n  wind_degree=%d,\n  wind_direction=%s\n}",
            id, windMph, windKph, windDegree, windDirection
        );
    }

    public int getId() {
        return id;
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

    public void setWindDegree(int windDegree) {
        this.windDegree = windDegree;
    }

    public void setWindDirection(WindDirection windDirection) {
        this.windDirection = windDirection;
    }

    public void setWindKph(float windKph) {
        this.windKph = windKph;
    }


    public static enum WindDirection {
        NNW,
        NW,
        W,
        SW,
        SSE,
        E,
        N,
        SE,
        ESE,
        NNE,
        S,
        WSW,
        SSW,
        ENE,
        NE,
        WNW
    }
}
