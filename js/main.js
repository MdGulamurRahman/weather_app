function getSelect(sel){
    return document.querySelector(sel)
}

const key = "2d7dff3a77396bcdf111e31d25d60031"

let weatherInfo = {}
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
    ({coords})=>{
        const lat = coords.latitude;
        const lon = coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
        fetch(url)
        .then(res => res.json())
        .then(data => {
            const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            const cityCountry = data.name + "," + data.sys.country;
            const condition = data.weather[0].description;
            const celciusTemp = data.main.temp - (273.15);
            const pressure = data.main.pressure;
            const humidity = data.main.humidity;
            weatherInfo = {
                icon,
                cityCountry,
                condition,
                celciusTemp,
                pressure,
                humidity,
            };
        })
        .catch((err)=>console.log(err))
        .finally(()=>{
            displayToUi();
        })
    }, (err)=>{
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Dhaka&appid=${key}`
       fetch(url)
       .then(res => res.json())
       .then(data => {
        const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        const cityCountry = data.name + "," + data.sys.country;
        const condition = data.weather[0].description;
        const celciusTemp = data.main.temp - (273.15);
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        weatherInfo = {
            icon,
            cityCountry,
            condition,
            celciusTemp,
            pressure,
            humidity,
        };
    })
       .catch(err => console.log(err))
       .finally(()=>{
        displayToUi();
       })
       
    })
}

function displayToUi(){
    getSelect("#icon").src = weatherInfo.icon;
    getSelect(".city").innerHTML = weatherInfo.cityCountry;
    getSelect(".condition").innerHTML = weatherInfo.condition;
    getSelect("#temp").innerHTML = weatherInfo.celciusTemp.toFixed(2);
    getSelect("#pressure").innerHTML = weatherInfo.pressure;
    getSelect("#humidity").innerHTML = weatherInfo.humidity;
}
//search by city name
getSelect("#search_btn").addEventListener("click", ()=>{
    const searchCity = getSelect("#search");
    const searchValue = searchCity.value;
    if(searchValue == ""){
        alert("Please provide any value!!!")
    }else{
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${key}`
            fetch(url)
            .then(res => res.json())
            .then(data => {
            const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            const cityCountry = data.name + "," + data.sys.country;
            const condition = data.weather[0].description;
            const celciusTemp = data.main.temp - (273.15);
            const pressure = data.main.pressure;
            const humidity = data.main.humidity;
            weatherInfo = {
             icon,
             cityCountry,
             condition,
             celciusTemp,
             pressure,
             humidity,
         };
         const historyCards = document.querySelectorAll(".history_card")
         //localStorage
         const history = getDataFromLocalStorage();
         if(history.length === 5){
             historyCards[4].remove()
             history.pop();
             history.unshift(weatherInfo);
         }else{
            history.unshift(weatherInfo)
         }

            const div = document.createElement("div");
            div.innerHTML = `
            <div class="history_card">
            <div class="icon">
            <img src="${icon}" alt="">
            </div>
            <div class="details">
            <h4>${cityCountry}</h4>
            <p class="conditions">${condition}</p>
            <p>Temp: ${celciusTemp.toFixed(2)} °C, Pressure: ${pressure} , Humidity: ${humidity}</p>
            </div>
            </div>
            `;

         getSelect("#search_history").insertAdjacentElement("afterbegin", div)
         localStorage.setItem("weather", JSON.stringify(history))
     })
        .catch(err => alert("Please enter a valid city name!!"))
        .finally(()=>{
         displayToUi();
        })
        searchCity.value = ""
    }
    
});

//convert celcius or farenheight
const temp = getSelect(".temp");
const tempUnit = getSelect(".temp_unit");
const convertBtn = getSelect("#convert_btn");
convertBtn.addEventListener("click", function(e){
    if(tempUnit.innerHTML === "°C"){
        let celsius = temp.innerHTML;
        let newCelsius = (celsius * 9/5) + 32;
        temp.innerHTML = newCelsius.toFixed(2);
        tempUnit.innerHTML = "°F"
    }else if(tempUnit.innerHTML === "°F"){
        let fahrenheit = temp.innerHTML;
        let newFahrenheit = (fahrenheit - 32)* 5/9;
        temp.innerHTML = newFahrenheit.toFixed(2);
        tempUnit.innerHTML = "°C";
    }
})
//===========================================
function getDataFromLocalStorage(){
    const data = localStorage.getItem("weather");
    let weather = []
    if(data){
        weather = JSON.parse(data)
    }
    return weather;
}

window.onload = function(){
    const history = getDataFromLocalStorage()
    history.forEach(his =>{
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="history_card">
        <div class="icon">
        <img src="${his.icon}" alt="">
        </div>
        <div class="details">
        <h4>${his.cityCountry}</h4>
        <p class="conditions">${his.condition}</p>
        <p>Temp: ${his.celciusTemp.toFixed(2)} °C, Pressure: ${his.pressure} , Humidity: ${his.humidity}</p>
        </div>
        </div>
        `;
        getSelect("#search_history").appendChild(div)
    })
}


/* <div class="history_card">
<div class="icon">
<img src="" alt="">
</div>
<div class="details">
<h4>Par Naogaon, BD</h4>
<p class="conditions">Clear sky</p>
<p>Temp: 31.97 °C, Pressure: 1004 , Humidity: 26</p>
</div>
</div> */