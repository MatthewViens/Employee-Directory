const body = document.getElementsByTagName('body')[0];
const employeesDiv = document.getElementById('employees');
const modalOverlay = document.getElementById('modal');
const modalDiv = document.getElementById('modal-card');
const searchInput = document.getElementById('search');
let employees = [];
let selected;
let employeeRequest = new XMLHttpRequest();
employeeRequest.onreadystatechange = renderEmployees;
employeeRequest.open('GET', 'https://randomuser.me/api/?results=12&nat=us');
employeeRequest.send();
modalOverlay.addEventListener('click', hideModal);

function renderEmployees(){
  if(employeeRequest.readyState === 4){
    let response = JSON.parse(employeeRequest.responseText);
    employees = response.results;
    for(let i = 0; i < employees.length; i++){
      let employeeCard = createEmployeeCard(employees[i]);
      employeeCard.setAttribute('data-number', i);
      employeesDiv.appendChild(employeeCard);
    }
  }
}

searchInput.addEventListener('keyup', filterEmployees);

function filterEmployees(){
  let employeeCards = document.querySelectorAll('.employee');
  let query = search.value.toLowerCase();
  for (let i = 0; i < employeeCards.length; i++){
    if(employeeCards[i].textContent.toLowerCase().includes(query)){
      employeeCards[i].style.display = 'block';
    } else {
      employeeCards[i].style.display = 'none';
    }
  }
}

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
  card.addEventListener('click', showModal);
  return card;
}

function createModal(){
  modalDiv.innerHTML = '<p id="prev">< Prev</p><p id="next">Next ></p>';
  let prevButton = document.getElementById('prev');
  let nextButton = document.getElementById('next');
  prevButton.addEventListener('click', prev);
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

function showModal(e){
  selected = employees[this.getAttribute('data-number')];
  createModal();
}

function hideModal(e){
  if(e.target === modalOverlay){
    modalOverlay.style.display = 'none';
  }
}

function prev(){
  let current = employees.indexOf(selected);
  if(current === 0){
    selected = employees[employees.length - 1];
  } else {
    selected = employees[current - 1];
  }
  createModal();
}

function next(){
  let current = employees.indexOf(selected);
  if(current === employees.length - 1){
    selected = employees[0];
  } else {
    selected = employees[current + 1];
  }
  createModal();
}
