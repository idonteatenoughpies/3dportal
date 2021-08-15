// ---- ADD LISTENER TO SUBMIT BUTTON ----
const form = document.getElementById('login-form')
form.addEventListener('submit', loginUser)

// ---- LOGIN FUNCTION TO SEND CODE TO LOGIN POST ROUTE ----
async function loginUser(event) {
  event.preventDefault()
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  const result = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username, password
    })
  }).then((res) => res.json())


  if (result.status === 'error') {
    document.getElementById("error").innerHTML = "Username/password did not match.";
  }
  if (result.status === 'ok') {
    window.location = result.redirect;
  }
}
