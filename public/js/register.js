const form = document.getElementById('reg-form')
form.addEventListener('submit', registerUser)


async function checkUser() {
  const username = document.getElementById('username').value
  const result = await fetch('/register/checkUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username
    })
  }).then((res) => res.json())

  if (result.status !== 'ok') {
    //everything went ok 
    document.getElementById("uniqUser").innerHTML = "This username is not available.";
    const button = document.getElementById('submitRegistrationButton');
    button.disabled = true
  }
  if (result.status === 'ok') {
    //everything went ok 
    document.getElementById("uniqUser").innerHTML = "";
    const button = document.getElementById('submitRegistrationButton');
    button.disabled = false
  }
}

async function passwordCheck() {
  const button = document.getElementById('submitRegistrationButton');
  const password = document.getElementById('password').value;
  if (password.length < 8) {
    document.getElementById("passwordLength").innerHTML = "Password must be a minimum of 8 characters long.";
    button.disabled = true
  } else {
    if (password.includes('password')) {
      document.getElementById("passwordLength").innerHTML = "Password must not include password.";
      button.disabled = true
    } else {
      if (password.includes('12345678')) {
        document.getElementById("passwordLength").innerHTML = "Password must not include 12345678.";
        button.disabled = true
      } else {
        document.getElementById("passwordLength").innerHTML = "";
        button.disabled = false
        passwordMatch();
      }
    }
  }
}

async function passwordMatch() {
  const password = document.getElementById('password').value
  let passwordconfirm = document.getElementById('confirmPassword').value
  if (passwordconfirm === "") {
    document.getElementById("passwordMatch").innerHTML = "";
    document.getElementById("submitRegistrationButton").disabled = true;
  } else 
  if (password !== passwordconfirm) {
    document.getElementById("passwordMatch").innerHTML = "Passwords do not match.";
    document.getElementById("submitRegistrationButton").disabled = true;
  } 
  else {
    document.getElementById("passwordMatch").innerHTML = "";
    document.getElementById("submitRegistrationButton").disabled = false;
  }
}

async function registerUser(event) {
  event.preventDefault()

  const first = document.getElementById('first').value
  const last = document.getElementById('last').value
  const email = document.getElementById('email').value
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const street1 = document.getElementById('street1').value
  const street2 = document.getElementById('street2').value
  const town = document.getElementById('town').value
  const county = document.getElementById('county').value
  const postcode = document.getElementById('postcode').value
  const confirmpassword = document.getElementById('confirmPassword').value

  if (password !== confirmpassword) {
    document.getElementById("success").innerHTML = "passwords do not match."; return;
  } else {

    const result = await fetch('/register/processregister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first, last, email, username, password, street1, street2, town, county, postcode
      })
    }).then((res) => res.json())

    if (result.status === 'ok') {
      //everything went ok 
      document.getElementById("success").innerHTML = "New Account Created. <a href='/login'>Click here to login</a>";
    } else {
      document.getElementById("success").innerHTML = "Failed to create new account: " + result.error;

    }
  }
}