$(document).ready(function(){

getData();

function getData(){
  $("#button2").click(function() {
       event.preventDefault();
        city = document.getElementById("cityInput").value;

//sends city name to server
    $.ajax({
        type: 'get',
        url: "http://localhost:3000/city", 
        dataType: 'json',
        timeout:2000,
        data: {city: city}, 
        success: function (data){
            data = JSON.parse(data);
            result = data.hourly.data;

            createGraph(result, city);
            showStuff(data);
        },
        error: function (error){
            console.log('client error');
        }
   
    });

    });

}

function showStuff(data){

 $('.result-container').empty();         

let dates = [];
for(let i=0; i < 7; i++){
    dates.push(data.daily.data[i].time);
}

let formattedDates = [];
let daysOfWeek = [];
for(let i=0; i<7; i++){
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    d = new Date(dates[i]*1000);
    date = d.getDate();
    dayOfWeek = days[d.getDay()];

    daysOfWeek.push(dayOfWeek);
    formattedDates.push(date);
}

         for(let i=0; i < 7; i++){
            allResults = [];
            d = `<div class="resultBox">
            <h4 class="text-center">${daysOfWeek[i] + " " + formattedDates[i]}</h4>
            <img class="weather-icon text-center" src="DarkSky-icons/SVG/${data.daily.data[i].icon}.svg">
            <p class="shaded">Conditions: ${data.daily.data[i].summary}</p>
            <p>Probability of Precipitation: ${data.daily.data[i].precipProbability}%</p>
            <p class="shaded">Max Temperature: ${((data.daily.data[i].apparentTemperatureMax-32)*5/9).toFixed(2)} °C</p>
            <p>Min Temperature: ${((data.daily.data[i].apparentTemperatureMin-32)*5/9).toFixed(2)} °C</p>
            <p class="shaded">Humidity: ${data.currently.humidity}*100 %</p>
            </div>`;

             allResults.push(d);
            $('.result-container').append(d);

            }
 
  }  

function createGraph(result, city){

        let time = [];
        for (let i=0; i < 24; i++){
            d = new Date(result[i].time*1000);
            hours = d.getHours();
            minutes = d.getMinutes();
            time.push(hours + ":00");
        }

        for (let i = 0; i < 24; i++){
            d = `<div class="bar bar-${i+1}" style="height: ${result[i].temperature*2}px; position:absolute; left:${i*50}px; transition:height 2s;">
            <p class="temperature">${((result[i].temperature-32)*5/9).toFixed(2)} °C</p>
            <p class="time text-center">${time[i]}</p>
            </div>`
            $('.graph-container').append(d);
        }
 
        let title =`<h4>24 hour temperature forecast for ${city}</h4>`
        $('.graph-title').append(title);

    };     
});    


