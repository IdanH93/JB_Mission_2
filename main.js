const DOM = {
	searchInput: null,
	mainStatDiv: null,
	statTable1: null,
	statTable2: null,
	statTable3: null,
};
function init() {
	DOM.searchInput = document.getElementById("searchText");
	DOM.mainStatDiv = document.getElementById("mainStats");
	DOM.statTable1 = document.getElementById("statTable1");
	DOM.statTable2 = document.getElementById("statTable2");
	DOM.statTable3 = document.getElementById("statTable3");
}

async function getAll() {
	const url = "https://restcountries.com/v3.1/all";
	try {
		const response = await fetch(url);
		const json = await response.json();
		getStats(json);
	} catch (error) {
		console.error(error.message);
	}
}

async function getByName(e) {
	e.preventDefault();
	const searchInput = DOM.searchInput.value;

	if (!searchInput) {
		alert("Missing Search Value");
		return;
	}

	const url = `https://restcountries.com/v3.1/name/${searchInput}`;
	try {
		const response = await fetch(url);
		const json = await response.json();

		getStats(json);
	} catch (error) {
		console.error(error.message);
	}
}

function getStats(data) {
	if (!Array.isArray(data) || data.length === 0) {
		alert("No data");
		return;
	}

	let namePop = [];
	let region = {};
	let curr = {};

	const totalPop = data.reduce(
		(accumulator, currentValue) => accumulator + currentValue.population,
		0
	);

	data.forEach((e) => {
		//Get Name + Population
		namePop.push({ name: e.name.official, pop: e.population });

		//Get Region
		if (region[e.region]) {
			region[e.region] += 1;
		} else {
			region[e.region] = 1;
		}

		//Get Currency
		if (e.currencies) {
			tempCurr = Object.keys(e.currencies).join("");
			if (curr[tempCurr]) {
				curr[tempCurr] += 1;
			} else {
				curr[tempCurr] = 1;
			}
		}
	});

	DOM.mainStatDiv.innerHTML = `
      <h4>Total countries result: ${data.length} </h4>
      <h4>Total countries population: ${totalPop} </h4>
      <h4>Average Population: ${parseInt(totalPop / data.length)} </h4>
    `;
	const nameAndPopulation = namePop
		.map((e) => {
			return `<tr><td>${e.name}</td><td>${e.pop}</td></tr>`;
		})
		.join("");

	let regionAndCountries = "";
	for (const [key, value] of Object.entries(region)) {
		regionAndCountries += `<tr><td>${key}</td><td>${value}</td></tr>`;
	}
	let currencyAndCountries = "";
	for (const [key, value] of Object.entries(curr)) {
		currencyAndCountries += `<tr><td>${key}</td><td>${value}</td></tr>`;
	}

	DOM.statTable1.innerHTML = `
    <table class="table table-bordered">
        <tr>
            <th>Country Name</th>
            <th>Number of citizens</th>
        </tr>
        ${nameAndPopulation}
    </table>`;

	DOM.statTable2.innerHTML = `
    <table class="table table-bordered">
        <tr>
            <th>Region</th>
            <th>Number of countries</th>
        </tr>
        ${regionAndCountries}
    </table>`;

	DOM.statTable3.innerHTML = `
    <table class="table table-bordered">
        <tr>
            <th>Currency Symbol</th>
            <th>Number of countries using it</th>
        </tr>
        ${currencyAndCountries}
    </table>`;
}

init();
