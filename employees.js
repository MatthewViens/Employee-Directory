// Global variables
const body = document.getElementsByTagName('body')[0];
const employeesDiv = document.getElementById('employees');
const modalOverlay = document.getElementById('modal');
const modalDiv = document.getElementById('modal-card');
const searchInput = document.getElementById('search');

// Initialize empty string to hold all employees from API.
let employeesArray = [];
// Initialize selected variable to keep track of which employee the modal
// will display.
let selected;

// Make AJAX request to randomuser.me
let employeeRequest = new XMLHttpRequest();
employeeRequest.onreadystatechange = renderEmployees;
employeeRequest.open('GET', 'https://randomuser.me/api/?results=12&nat=us');
employeeRequest.send();

// Add event listener so that if anywhere is clicked outside the modalDiv,
// hideModal() is invoked.
modalOverlay.addEventListener('click', hideModal);

// Callback function when AJAX reqest is complete:
  // Calls createEmloyeeCard for each employee returned from requests.
  // createEmployeeCard returns an element which is appended to the DOM.
function renderEmployees(){
  if(employeeRequest.readyState === 4){
    let response = JSON.parse(employeeRequest.responseText);
    employeesArray = response.results;
    for(let i = 0; i < employeesArray.length; i++){
      let employeeCard = createEmployeeCard(employeesArray[i]);
      employeeCard.setAttribute('data-number', i);
      employeesDiv.appendChild(employeeCard);
    }
  }
}

// Add keyup event listener to to text input.
searchInput.addEventListener('keyup', filterEmployees);

// Callback function for searchInput event listener:
  // Gets all employee DOM elements.
  // Gets text from text input.
  // Search criteria contains only name and email - removes city.
  // show/hide element if employee name and email include the elements in query.
function filterEmployees(){
  let employeeCards = document.querySelectorAll('.employee');
  let query = search.value.toLowerCase();
  for (let i = 0; i < employeeCards.length; i++){
    let info = employeeCards[i].textContent;
    let searchCriteria = info.slice(0, (info.indexOf('.com') + 3));
    if(searchCriteria.toLowerCase().includes(query)){
      employeeCards[i].style.display = 'block';
    } else {
      employeeCards[i].style.display = 'none';
    }
  }
}

// renderEmployees calls this function to create the employee elements and
// appends to the DOM.
function createEmployeeCard(employee){
  let card = document.createElement('div');
  card.classList.add('employee');
  let picture = document.createElement('div');
  picture.classList.add('image');
  picture.style.backgroundImage = `url(${employee.picture.large})`;
  let info = document.createElement('div');
  info.classList.add('info');
  let name = document.createElement('h2');
  name.classList.add('capitalize');
  name.textContent = `${employee.name.first} ${employee.name.last}`;
  let email = document.createElement('p');
  email.textContent = employee.email;
  let city = document.createElement('p');
  city.classList.add('capitalize');
  city.textContent = employee.location.city;
  card.appendChild(picture);
  card.appendChild(info);
  info.appendChild(name);
  info.appendChild(email);
  info.appendChild(city);

  // Add click event listener to all employee elements to call showModal()
  card.addEventListener('click', showModal);
  return card;
}

// showModal() selects the right employee from the employee array when clicked
// and stores it in the global selected variable. createModal() constructs the
// modal elements.
function createModal(){
  modalDiv.innerHTML = '<p id="prev">< Prev</p><p id="next">Next ></p>';
  let prevButton = document.getElementById('prev');
  let nextButton = document.getElementById('next');

  // Add click event listener to 'prev' to call prev();
  prevButton.addEventListener('click', prev);

  // Add click event listener to 'next' to call next()
  nextButton.addEventListener('click', next);
  modalOverlay.style.display = 'block';
  let picture = document.createElement('div');
  picture.classList.add('modal-image');
  picture.style.background = `url(${selected.picture.large})`;
  let name = document.createElement('h2');
  name.textContent = `${selected.name.first} ${selected.name.last}`;
  name.classList.add('capitalize');
  let username = document.createElement('p');
  username.textContent = selected.login.username;
  let email = document.createElement('p');
  email.textContent = selected.email;
  let city = document.createElement('p');
  city.textContent = selected.location.city;
  city.classList.add('capitalize');
  let cell = document.createElement('p');
  cell.textContent = selected.cell;
  let address = document.createElement('p');
  address.classList.add('capitalize');
  address.textContent = `${selected.location.street}
    ${selected.location.state} ${selected.location.postcode}`;
  let birthdate = document.createElement('p');
  let date = selected.dob.split('-');
  let year = date[0];
  let month = date[1];
  let day = date[2].slice(0, 2);
  birthdate.textContent = `Birthday: ${month}/${day}/${year}`;
  modalDiv.appendChild(picture);
  modalDiv.appendChild(name);
  modalDiv.appendChild(username);
  modalDiv.appendChild(email);
  modalDiv.appendChild(city);
  modalDiv.appendChild(document.createElement('hr'));
  modalDiv.appendChild(cell);
  modalDiv.appendChild(address);
  modalDiv.appendChild(birthdate);
}

// Callback function for employee element click events.
function showModal(){
  selected = employeesArray[this.getAttribute('data-number')];
  createModal();
}

// Callback function so that if the modal is being displayed, clicking anywhere
// except for the modalDiv will hide the modal overlay.
function hideModal(e){
  if(e.target === modalOverlay){
    modalOverlay.style.display = 'none';
  }
}

// Callback function for 'prev' click event.
  // Decrements currently selected employee by 1 and rerenders modal.
function prev(){
  let current = employeesArray.indexOf(selected);
  if(current === 0){
    selected = employeesArray[employees.length - 1];
  } else {
    selected = employeesArray[current - 1];
  }
  createModal();
}

// Callback function for 'next' click event.
  // Increments currently selected employee by 1 and rerenders modal.
function next(){
  let current = employeesArray.indexOf(selected);
  if(current === employeesArray.length - 1){
    selected = employeesArray[0];
  } else {
    selected = employeesArray[current + 1];
  }
  createModal();
}
