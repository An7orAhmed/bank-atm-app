
export const URL = "https://atmapp.000webhostapp.com/api.php";

export async function loginAPI(email, password) {
  const resp = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=login&email=${email}&password=${password}`
  });
  return await resp.json();
}