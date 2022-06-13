async function listMore(LineID) {
  const response = await fetch(`/api/listDetails/${LineID}`);
  const body = await response.json(); // json allakitas

  if (response.status === 200) {
    document.getElementById(`list-price-${LineID}`).style.display = 'block';
    document.getElementById(`list-type-${LineID}`).style.display = 'block';

    document.getElementById(`list-price-${LineID}`).innerText = `Price: ${body.Price}`;
    document.getElementById(`list-type-${LineID}`).innerText = `Type: ${body.Type}`;
  } else {
    alert(body.message);
  }
}
