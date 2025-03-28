package ua.mpumnia.dbmigrations.ui;

import java.sql.Date;
import java.util.List;
import java.util.Scanner;

import ua.mpumnia.dbmigrations.domain.Weather;
import ua.mpumnia.dbmigrations.services.WeatherService;

public class ConsoleUI {

  private final WeatherService service;

  public ConsoleUI(WeatherService service) {
    this.service = service;
  }

  public void startUI() {
    try (Scanner scanner = new Scanner(System.in)) {
        String regex = "^\\w+ \\d{1,2}\\.\\d{2}\\.\\d{4}$";
        String s;

        System.out.println("Hello. Enter country and date to get details about the weather. Here is an example \"Ukraine 28.03.2025\"");
        while (scanner.hasNextLine() && !(s = scanner.nextLine()).toLowerCase().equals("exit")) {
            System.out.println("You entered: \"" + s + "\"");

            if (!s.matches(regex)) {
              System.out.println("Incorrent format. Try again:");
              continue;
            }

            String[] contryAndDate = s.split(" ");
            String[] dayMonthAndYear = contryAndDate[1].split("\\.");
            int day = Integer.parseInt(dayMonthAndYear[0]);
            int month = Integer.parseInt(dayMonthAndYear[1]);
            int year = Integer.parseInt(dayMonthAndYear[2]);

            String country = contryAndDate[0];
            Date date = new Date(year - 1900, month - 1, day);

            System.out.println("Country: \"%s\", Date: \"%s\"".formatted(country, date));

            List<Weather> list = service.getByCountryAndDate(country, date);
            if (list.isEmpty()) {
              System.out.println("There is no data matching your input!");
            } else {
              System.out.println("Here are weather details:\n");
              list.forEach(weather -> {
                System.out.println("Location: %s".formatted(weather.getLocationName()));
                System.out.println("Last updated: %s".formatted(weather.getLastUpdated()));
                System.out.println("Temperature (C): %.2f".formatted(weather.getTemperatureCelsius()));
                System.out.println("Sunrise: %s".formatted(weather.getSunrise()));
                System.out.println("Condition: %s".formatted(weather.getConditionText()));
                System.out.println("Wind degree: %d".formatted(weather.getWind().getWindDegree()));
                System.out.println("Wind direction: %s".formatted(weather.getWind().getWindDirection()));
                System.out.println("Wind kph: %.2f".formatted(weather.getWind().getWindKph()));
                System.out.println("Wind mph: %.2f".formatted(weather.getWind().getWindMph()));
                System.out.println("Can go outside: %s\n".formatted(weather.isCanGoOutside()));
              });
            }



            System.out.println("You can try again or enter 'exit' to quit the program");
        }
    }
  }
}
