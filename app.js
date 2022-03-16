const search = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const countryBox = document.getElementById("countryBox");
const baseURL = "https://countries-cities.p.rapidapi.com/location/country/";
const apiHost = "countries-cities.p.rapidapi.com";
const API_KEY = config.API_KEY;

// Fetch API Data
const countriesList = async () => {
  const response = await fetch(baseURL + "list", {
    method: "GET",
    headers: {
      "x-rapidapi-host": `${apiHost}`,
      "x-rapidapi-key": `${API_KEY}`,
    },
  });
  const data = await response.json();
  const countries = await data.countries;

  return countries;
};

countriesList().then((countries) => {
  searchBtn.addEventListener("click", () => {
    // Match search input with key
    const countryKey = Object.keys(countries);
    let matches = countryKey.find(
      (key) => countries[key].toLowerCase() === search.value.toLowerCase()
    );

    search.value = "";

    // Fetch country Data
    const countryData = async () => {
      const response = await fetch(baseURL + matches, {
        method: "GET",
        headers: {
          "x-rapidapi-host": `${apiHost}`,
          "x-rapidapi-key": `${API_KEY}`,
          "Access-Control-Allow-Origin": "*",
        },
      });
      const country = await response.json();

      outputHtml(country);
    };

    countryData().catch((err) => {
      // Error message
      countryBox.innerHTML = `
        <h1 class="error">Error something went wrong!</h1>
        <button id="closeBtn"><i class="fas fa-times"></i></button>
        `;
      // Close country box
      document.getElementById("closeBtn").addEventListener("click", () => {
        countryBox.classList.remove("display");
        countryBox.innerHTML = "";
      });
    });

    // Display Country data
    countryBox.classList.add("display");
  });
});

function outputHtml(country) {
  // Append (",") to languages and integers
  let languages = Object.values(country.languages).join(", ");
  let popNum = country.population.toLocaleString("en-US");
  // Extract digits from area
  const regex = /\d+/;
  let area = country.area_size.match(regex);
  let areaNum = parseInt(area).toLocaleString("en-US");

  countryBox.innerHTML = `
    <div class="nameFlag">
      <h1 class="country">${country.name} <span class="abbr">(${country.code})</span></h1>
      <img src="${country.flag.file}" alt="flag">
    </div>

    <div class="info">
      <p>Capital: ${country.capital.name}</p>
      <p>Continent: ${country.continent.name}</p>
      <p>Area Size: ${areaNum} sq. km</p>
      <p>Population: ${popNum}</p>
      <p>Languages: ${languages}</p>
      <p>Currency: ${country.currency.name} (${country.currency.code})</p>
      <p>Phone Code: +${country.phone_code}</p>
   </div>

   <button id="closeBtn"><i class="fas fa-times"></i></button>
  `;

  // Close country box
  document.getElementById("closeBtn").addEventListener("click", () => {
    countryBox.classList.remove("display");

    countryBox.innerHTML = "";
  });
}
