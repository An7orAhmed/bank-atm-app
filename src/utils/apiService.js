
export const URL = "https://atmapp.000webhostapp.com/api.php";

export async function loginAPI(email, password) {
  const resp = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=login&email=${email}&password=${password}`
  });
  return await resp.json();
}

export async function registerAPI(fullName, email, phone, address, password, fingerId) {
  const resp = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=register&email=${email}&password=${password}&fullName=${fullName}&phone=${phone}&address=${address}&fingerId=${fingerId}`
  });
  return await resp.json();
}

export async function getBalanceAPI(fingerId) {
  const resp = await fetch(`${URL}?balance&fingerId=${fingerId}`);
  return await resp.json();
}

export async function cashInAPI(fingerId, amount) {
  const resp = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=cash_in&fingerId=${fingerId}&amount=${amount}`
  });
  return await resp.json();
}

export async function getTransectionsAPI(fingerId) {
  const resp = await fetch(`${URL}?transactions&fingerId=${fingerId}`);
  const data = await resp.json();
  let newRows = [];
  if (data['transactions']) {
    for (let index = 0; index < data['transactions'].length; index++) {
      const rowData = data['transactions'][index];
      const date = rowData['date'].split(" ")[0];
      const time = rowData['date'].split(" ")[1];
      const amount = parseFloat(rowData['amount']);
      const type = rowData['type'];
      const row = { date, time, type, amount };
      newRows.push(row);
    }
  }
  console.log(newRows);
  return newRows;
}