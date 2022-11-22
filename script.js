$(document).ready(function(){

    function getWeather(city){
        var APIkey = "96a70732cd84bd1cb493d4a47475c856";
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+APIkey+"&units=metric";
        var icon;
        var lat;
        var long;
        $.ajax({
            url: weatherURL,
            method: "GET",
            success: function(response){
                icon = response.weather[0].icon;
                lat = response.coord.lat;
                long = response.coord.lon;
                // select background based on weather condition
                var weatherType = response.weather[0].id;
                console.log(weatherType,'weathertype')
                if (weatherType < 700){
                    $( 'body' ).css('background', "#dc3545");
                } else if (weatherType === 800){
                    $( 'body' ).css('background', "orange");
                } else {
                    $( 'body' ).css('background', "#2196f3");
                };
                $('#city-name').text(city);
                $('#today-icon').empty();
                $('#today-icon').append("<img src='https://openweathermap.org/img/wn/"+icon+"@2x.png'>");
                $('#today-temp').text(Math.floor(parseInt(response.main.temp))+"°");
                $('#today-weather').text(response.weather[0].description);
                $('#humidity').text(response.main.humidity+"%");
                $('#windspeed').text(Math.floor(parseInt(response.wind.speed))+" m/s");
                var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+long+"&appid="+APIkey;
          $.ajax({
            url: uvURL,
            method: "GET",
            success: function(response){
                
                $('#date').text(new Date(response.date_iso).toLocaleDateString("en-US"))
                $('#uv-rating').text(response.value);
                if (response.value < 4){
                    $('#uv-text').text("Low");
                    $('#uv-container').css('background-color', 'blue');
                } else if (response.value > 3 && response.value < 10){
                    $('#uv-text').text("Moderate");
                    $('#uv-container').css('background-color', 'green');
                } else {
                    $('#uv-text').text("High");
                    $('#uv-container').css('background-color', 'orange');
                }
            },
            error: function(){
                console.log("Api Error");
            }
          });
            },
            error: function(){
                console.log("Api Error");
            }
          });
        //   get 5 day forcast
        var forcastURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+APIkey+"&units=metric";
        $.ajax({
            url: forcastURL,
            method: "GET",
            success: function(response){
                console.log(response.list)
                $('#forcast-container').empty();
            for (var i = 0; i < 5; i++){
                var card = $("<div class='card'></div>");
                var forcastIcon = response.list[i].weather[0].icon;
                var forcastIMG = 'https://openweathermap.org/img/wn/'+forcastIcon+'.png';
                $('#forcast-container').append(`
                <div class="card">
                    <h2 class="day-date">${moment().add((i+1), 'days').format('ddd')}</h2>
                    <h4 class="day">${moment().add((i+1), 'days').format('MM/DD/YYYY')}</h4>
                    <img src="${forcastIMG}">
                    <p class="weather"  style="text-transform:capitalize;">${response.list[i].weather[0].description}</p>
                    <h2 class="forcast-temp">T:${Math.floor(parseInt(response.list[i].main.temp))}°</h2>
                    <h2 class="forcast-wind">W:${Math.floor(parseInt(response.list[i].wind.speed))} m/s</h2>
                    <h2 class="forcast-humidity">H:${Math.floor(parseInt(response.list[i].main.humidity))}</h2>
                </div>`);
                }
            },
            error: function(){
                console.log("Api Error");
            }
            });
        };
    
    // LOCAL STORAGE
    var cities = [];
    var currentCity;
    
    var citystorage = localStorage.getItem("citystorage");
    var currentCitykey = localStorage.getItem("currentCitykey");
    init();
    initCity()
    
    function renderCities(){
        $('#btn-container-div').empty();
        if(cities && cities.length){
        for (var i=0; i < cities.length; i++){
            var buttonDiv = $("<div class='btn-container'></div>");
            var deletebtn = $("<button class='delete'></button>").text("X");
            var cityBTN = $("<button class='city-btn'></button>").text(cities[i]);
            buttonDiv.append(cityBTN, deletebtn);
            $('#btn-container-div').append(buttonDiv);
        }
        }
    };
    
    function init() {
        // check if local storage has been used else get data from local storage
        if(citystorage===null){
            console.log("nothing in storage");
            cities =[]
        } else {
            cities = JSON.parse(localStorage.getItem("citystorage"));
        }
        // Render cities
        renderCities();
    };
    
    function initCity() {
        // check if local storage has been used else get data from local storage
        if(currentCitykey===null){
            currentCity = "Kathmandu";
        } else {
            currentCity = JSON.parse(localStorage.getItem("currentCitykey"));
        }
        getWeather(currentCity);
    
    };
    
    $('#clear-cities').on('click',function(){
        localStorage.removeItem("citystorage");
        localStorage.removeItem("currentCitykey");
        citystorage = localStorage.getItem("citystorage");
        currentCitykey = localStorage.getItem("currentCitykey");
        init();
        initCity();
    });
    function storeCities() {
        // store timeblock objects in local storage
        localStorage.setItem("citystorage", JSON.stringify(cities));
    };
    function storeCurrrentCity() {
        // store timeblock objects in local storage
        localStorage.setItem("currentCitykey", JSON.stringify(currentCity));
    };
    
    // search button
    $('#search-form').on("submit", function(event){
        event.preventDefault();
        cities.push($('#city-search').val());
        storeCities();
        currentCity = $('#city-search').val();
        storeCurrrentCity();
        renderCities();
        getWeather($('#city-search').val());
        
    });
    
    // buttons
    $('body').on("click",".city-btn", function(){
        var thisCity = $( this ).text();
        getWeather(thisCity);
        currentCity = thisCity;
        storeCurrrentCity();
    });
    
    // delete button
    $('body').on("click", ".delete",function(){
        var clickedCity = $( this ).parent();
        var index;
        index = cities.indexOf(clickedCity.children('.city-btn').text())
        console.log(cities,index)
    
        // remove city from array at positon index
        cities.splice(index, 1);
        console.log(cities)
        storeCities();
        renderCities();
    });
    
    
    });