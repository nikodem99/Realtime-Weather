/* Fetching Data from OpenWeatherMap API */
let weather = {
    apiKey: "6d055e39ee237af35ca066f35474e9df", // don't f with this api key, it does not belong to me xd
    fetchWeather: function(city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Invalid location");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data))
        .catch((error) => {
          console.log(error);
          alert("Error fetching weather data. Please try again later.");
        });
    },
    displayWeather: function(data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText =
        "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText =
        "Wind speed: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function() {
      let city = document.querySelector(".search-bar").value;
      if (city) {
        this.fetchWeather(city);
      } else {
        alert("Please enter a city name");
      }
    },
  };
  
  /* Fetching Data from OpenCageData Geocoder */
  let geocode = {
    reverseGeocode: function(latitude, longitude) {
      var apikey = "90a096f90b3e4715b6f2e536d934c5af";
  
      var api_url = "https://api.opencagedata.com/geocode/v1/json";
  
      var request_url =
        api_url +
        "?" +
        "key=" +
        apikey +
        "&q=" +
        encodeURIComponent(latitude + "," + longitude) +
        "&pretty=1" +
        "&no_annotations=1";
  
      fetch(request_url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Geocoding failed");
          }
          return response.json();
        })
        .then((data) => {
          weather.fetchWeather(data.results[0].components.city);
          console.log(data.results[0].components.city);
        })
        .catch((error) => {
          console.log(error);
          alert("Error fetching geolocation data. Please try again later.");
        });
    },
    getLocation: function() {
      function success(data) {
        geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, (error) => {
          console.error(error);
          weather.fetchWeather("Manipal");
        });
      } else {
        weather.fetchWeather("Manipal");
      }
    },
  };
  
  document
    .querySelector(".search button")
    .addEventListener("click", function() {
      weather.search();
    });
  
  document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });
  
  geocode.getLocation();
  