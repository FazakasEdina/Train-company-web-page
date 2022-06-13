let setsubmit;

function validateCityFrom() {
  const reg = new RegExp('^[A-Z][a-z]+(( |-)[A-Z][a-z]+)*$');
  const from = document.getElementById('from').value;
  if (!reg.test(from)) {
    setsubmit = false;
    document.getElementById('error-from').innerText = 'Invalid name or empty field.';
  } else {
    document.getElementById('error-from').innerText = ' ';
  }
}

function validateCityTo() {
  const reg = new RegExp('^[A-Z][a-z]+(( |-)[A-Z][a-z]+)*$');
  const from = document.getElementById('to').value;
  if (!reg.test(from)) {
    setsubmit = false;
    document.getElementById('error-to').innerText = 'Invalid name or empty field.';
  } else {
    document.getElementById('error-to').innerText = ' ';
  }
}

function validatePrice() {
  const price = Number.parseInt(document.getElementById('price').value, 10);

  if (Number.isNaN(price) || price < 0) {
    setsubmit = false;
    document.getElementById('error-price').innerText = 'Invalid price or empty field.';
  } else {
    document.getElementById('error-price').innerText = ' ';
  }
}

function validateClockD() {
  const clock = document.getElementById('d-clock').value;

  if (clock === '') {
    setsubmit = false;
    document.getElementById('error-clock-d').innerText = 'Empty field';
  } else {
    document.getElementById('error-clock-d').innerText = '';
  }
}

function validateClockA() {
  const clock = document.getElementById('a-clock').value;

  if (clock === '') {
    setsubmit = false;
    document.getElementById('error-clock-a').innerText = 'Empty field';
  } else {
    document.getElementById('error-clock-a').innerText = '';
  }
}

function validation(event) {
  setsubmit = true;
  validateCityFrom();
  validateCityTo();
  validatePrice();
  validateClockD();
  validateClockA();

  if (setsubmit === false) {
    event.preventDefault();
  }
}

document.body.onload = () => {
  document.getElementById('submit').addEventListener('click', validation);
};
