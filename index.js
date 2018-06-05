// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $stateInput = document.querySelector("#state");
var $cityInput = document.querySelector("#city");
var $searchBtn = document.querySelector("#search");
var $datetimeInput = document.querySelector("#datetime");
var $countryInput = document.querySelector("#country");
var $shapeInput = document.querySelector("#shape");
var $pageInput = document.querySelector("#page");
var $searchBtn = document.querySelector("#search");

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);

// Set filteredAddresses to data initially
var filteredData = dataSet;
// console.log(data)

// renderTable renders the filteredAddresses to the tbody
function renderTable() {
  $tbody.innerHTML = "";
  for (var i = 0; i < filteredData.length; i++) {
    // Get get the current address object and its fields
    var address = filteredData[i];
    var fields = Object.keys(address);
    // Create a new row in the tbody, set the index to be i + startingIndex
    var $row = $tbody.insertRow(i);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = address[field];
    }
  }
}

function handleSearchButtonClick() {

  filteredData = dataSet.filter(function(address) {
    var addressState = $stateInput.value.trim()===address.state || $stateInput.value.trim()==='';
    return addressState
    // var addressCity = $cityInput.value.trim()===address.city|| $cityInput.value.trim()===''
    // return addressCity;
  });

  renderTable();
}


function handleSearchButtonClick() {
  filteredData = dataSet.filter(function(address) {
    if ($stateInput.value.trim()===address.state || $stateInput.value.trim()==='')
      return false;
    return true;
    // var addressCity = $cityInput.value.trim()===address.city|| $cityInput.value.trim()===''
    // return addressCity;
  });

  renderTable();
}

renderTable();
