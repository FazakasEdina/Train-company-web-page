async function deleteTrainLine(event, LineID) {
  const response = await fetch(`/api/delete/${LineID}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    const parent = event.target.parentNode.parentNode;
    parent.remove();
  } else {
    const body = await response.json();
    alert(body.message);
  }
}
