const autoCompleteConfig = {
	root: document.querySelector('.autocomplete')
};
function findCountry() {
	return createAutoComplete({
		...autoCompleteConfig,
		async fetchData() {
			const response = await axios.get('https://api.airvisual.com/v2/countries', {
				params: {
					key: '174370fb-92c1-4a86-affc-85223e08fc7a'
				}
			});

			return response.data.data;
		},
		renderOption(country) {
			return `
			 ${country.country} 
			`;
		},
		inputValue(country) {
			return country.country;
		},
		//vyreji

		//vyreji
		searchObj: 'Country',
		onOptionSelect(country) {
			onCountrySelect(country);
		}
	});
}
findCountry();

const onCountrySelect = (country) => {
	const chosenCountry = country.country;
	createAutoComplete({
		...autoCompleteConfig,
		async fetchData(country) {
			const response = await axios.get('https://api.airvisual.com/v2/states', {
				params: {
					key: '174370fb-92c1-4a86-affc-85223e08fc7a',
					country: chosenCountry
				}
			});

			return response.data.data;
		},
		renderOption(state) {
			return `
             ${state.state} 
            `;
		},
		inputValue(state) {
			return state.state;
		},
		searchObj: `Region in ${chosenCountry} `,
		onOptionSelect(state) {
			// onCountrySelect(state);
			onStateSelect(country, state);
		}
	});
};

const onStateSelect = (country, state) => {
	console.log(country);
	const chosenCountry = country.country;
	const chosenState = state.state;
	createAutoComplete({
		...autoCompleteConfig,
		async fetchData(country, state) {
			const response = await axios.get('https://api.airvisual.com/v2/cities', {
				params: {
					key: '174370fb-92c1-4a86-affc-85223e08fc7a',
					country: chosenCountry,
					state: chosenState
				}
			});

			return response.data.data;
		},
		renderOption(city) {
			return `
             ${city.city} 
            `;
		},
		inputValue(city) {
			return city.city;
		},
		searchObj: `City/Station in ${chosenCountry}, ${chosenState}`,
		onOptionSelect(city) {
			onCitySelect(country, state, city, document.querySelector('#aqiData'));
		}
	});
};

const onCitySelect = async (country, state, city, aqiData) => {
	const chosenCountry = country.country;
	const chosenState = state.state;
	const chosenCity = city.city;
	const response = await axios.get('https://api.airvisual.com/v2/city', {
		params: {
			key: '174370fb-92c1-4a86-affc-85223e08fc7a',
			country: chosenCountry,
			state: chosenState,
			city: chosenCity
		}
	});
	autoCompleteConfig.root.classList.add('is-hidden');
	aqiData.innerHTML = movieTemplate(response.data.data);
	const button = aqiData.querySelector('#return');

	button.addEventListener('click', () => {
		autoCompleteConfig.root.classList.remove('is-hidden');
		findCountry();
		document.querySelector('#allData').remove();
	});
};
const dateConvert = (dateString) => {
	return dateString.substring(0, 10);
};

const evaluateAQI = (aqiData) => {
	if (aqiData <= 50) {
		return `
		<div id="index" class = "low">
		<p>AQI</p>
		<p>${aqiData} </p>
	     </div>
	<p class = "explanation explanationLow">A level that will not impact patients suffering from diseases 
	related to air pollution. Enjoy your usual outdoor activities</p>`;
	} else if (aqiData > 50 && aqiData <= 100) {
		return `<div id="index" class = "moderate">
		<p>AQI</p>
		<p>${aqiData} </p>
	     </div>
	<p class = "explanation explanationModerate">A level that may have a meager 
	impact on patients in case of chronic exposure. Enjoy your usual outdoor activities</p>`;
	} else if (aqiData > 100 && aqiData <= 150) {
		return `<div id="index" class = "medium">
		<p>AQI</p>
		<p>${aqiData} </p>
	     </div>
	<p class = "explanation explanationMedium">A level that may have harmful 
	impacts on patients and members of sensitive groups. Adults and children 
	with lung problems, and adults with heart problems, who experience symptoms, 
	should consider reducing strenuous physical activity, particularly outdoors.</p>`;
	} else if (aqiData > 150 && aqiData <= 200) {
		return `<div id="index" class = "high">
		<p>AQI</p>
		<p>${aqiData} </p>
	     </div>
	<p class = "explanation explanationHigh">	A level that may have harmful impacts on patients and members of 
	sensitive groups (children, aged or weak people), and also 
	cause the general public unpleasant feelings.</p>`;
	} else if (aqiData > 200 && aqiData <= 300) {
		return `<div id="index" class = "veryhigh">
		<p>AQI</p>
		<p>${aqiData} </p>
	     </div>
	<p class = "explanation explanationVeryhigh">	A level that may have a serious impact on patients 
	and members of sensitive groups in case of acute exposure. Anyone experiencing discomfort such as sore eyes, cough or sore 
	throat should consider reducing activity, particularly outdoors.</p>`;
	} else {
		return `<div id="index" class = "hazardous">
		<p>AQI</p>
		<p>${aqiData} </p>
	     </div>
	<p class = "explanation explanationHazardous">		A level that may have a serious impact on patients 
	and members of sensitive groups in case of acute exposure. Reduce physical exertion, particularly outdoors, especially 
	if you experience symptoms such as cough or sore throat.</p>`;
	}
};

const movieTemplate = (iqaDetails) => {
	return `
<div id="allData">
	
	<h2>${iqaDetails.city}, ${iqaDetails.state}, ${iqaDetails.country}</h2>
	<h2 id="date">Data for: ${dateConvert(iqaDetails.current.weather.ts)} </h2>
	<div id="aqiTemper">
	<div id="range"><img src="range.png"/></div>
	<div id="information">
	<div id="indexInfo">
	${evaluateAQI(iqaDetails.current.pollution.aqius)}
		
	</div>
	<h3 id="current">Current weather condition in the city.</h3>
	<div id="temper" class="athmosph">
	<h3>Air Temperature: </h3>
	 <p>${iqaDetails.current.weather.tp}°C </p>
	</div>
	<div id="pressure" class="athmosph">
	<h3>Atmospheric Pressure: </h3>
	 <p>${iqaDetails.current.weather.pr}mm </p>
	 </div>
	 <div id="humidity" class="athmosph">
	<h3>Air Humidity: </h3>
	 <p>${iqaDetails.current.weather.hu}% </p>
	</div>
	</div>
	</div>
	<button id="return">Choose Different City</button>
</div>
    
    `;
};
