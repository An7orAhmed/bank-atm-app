
export function getUser() {
  const user = localStorage.getItem('user');
  if(!user) return null;
  return JSON.parse(user);
}

export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem('user');
}