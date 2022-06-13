let setsubmit;

function validateCityFrom() {
  const reg = new RegExp('^[A-Z][a-z]+(( |-)[A-Z][a-z]+)*$');
  const from = document.getElementById('from').value;
  if (from === '') {
    document.getElementById('error-from').innerText = ' ';
  } else if (!reg.test(from)) {
    setsubmit = false;
    document.getElementById('error-from').innerText = 'Invalid name or empty field.';
  } else {
    document.getElementById('error-from').innerText = ' ';
  }
}

function validateCityTo() {
  const reg = new RegExp('^[A-Z][a-z]+(( |-)[A-Z][a-z]+)*$');
  const to = document.getElementById('to').value;
  if (to === '') {
    document.getElementById('error-to').innerText = ' ';
  } else if (!reg.test(to)) {
    setsubmit = false;
    document.getElementById('error-to').innerText = 'Invalid name or empty field.';
  } else {
    document.getElementById('error-to').innerText = ' ';
  }
}

function validateMaxPrice() {
  const price = Number.parseInt(document.getElementById('max-price').value, 10);

  if (Number.isNaN(price)) {
    document.getElementById('error-max-price').innerText = ' ';
  } else if (price < 0) {
    setsubmit = false;
    document.getElementById('error-max-price').innerText = 'Invalid price or empty field.';
  } else {
    document.getElementById('error-max-price').innerText = ' ';
  }
}

function validateMinPrice() {
  const price = Number.parseInt(document.getElementById('min-price').value, 10);

  if (Number.isNaN(price)) {
    document.getElementById('error-min-price').innerText = ' ';
  } else if (price < 0) {
    setsubmit = false;
    document.getElementById('error-min-price').innerText = 'Invalid price or empty field.';
  } else {
    document.getElementById('error-min-price').innerText = ' ';
  }
}

function validation(event) {
  setsubmit = true;
  validateCityFrom();
  validateCityTo();
  validateMaxPrice();
  validateMinPrice();

  const maxPrice = Number.parseInt(document.getElementById('max-price').value, 10);
  const minPrice = Number.parseInt(document.getElementById('min-price').value, 10);

  if (!Number.isNaN(maxPrice) && !Number.isNaN(minPrice)) {
    if (parseInt(maxPrice, 10) < parseInt(minPrice, 10)) {
      setsubmit = false;
      document.getElementById('error-min-max').innerText = 'The min price is bigger than max price';
    } else {
      document.getElementById('error-min-max').innerText = ' ';
    }
  }
  if (setsubmit === false) {
    event.preventDefault();
  }
}

function showAdvanced() {
  const element = document.getElementById('show').style;
  if (element.display === 'block') {
    element.display = 'none';
  } else {
    element.display = 'block';
  }
}
document.body.onload = () => {
  document.getElementById('show').style.display = 'block';
  showAdvanced();
  document.getElementById('submit').addEventListener('click', validation);
};
