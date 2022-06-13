async function deleteBooking(event, LineID) {
  const response = await fetch(`/api/deleteBooking/${LineID}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    const parent = event.target.parentNode;
    parent.remove();
  } else {
    const body = await response.json();
    alert(body.message);
  }
}
