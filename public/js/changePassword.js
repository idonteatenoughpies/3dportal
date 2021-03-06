// ---- ADD LISTENER TO UPDATE PASSWORD BUTTON ----
const changepasswordbutton = document.getElementById('updatePasswordConfirmButton')
changepasswordbutton.addEventListener('updatePasswordConfirmButton', changePwd)

// ---- FUNCTION TO SEND CHANGE PASSWORD INSTRUCTION TO CHANGE-PASSWORD ROUTE ----
async function changePwd() {
  const password = document.getElementById('password').value
  const confirmpassword = document.getElementById('confirmpassword').value

  if (password !== confirmpassword) {
    document.getElementById("warning").innerHTML = "passwords do not match.";
  } else {
    const result = await fetch('/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password
      })
    }).then((res) => res.json())

    if (result.status === 'ok') {
      //everything went ok 

      document.getElementById("warning").innerHTML = "Success, your password has been update.";
    } else {
      document.getElementById("warning").innerHTML = "PASSWORD UPDATE FAILED: " + result.error;

    }
    console.log(result)
  }
}

// ---- FUNCTION TO CLEAR WARNINGS (CALLED ON FOCUS)
function clearWarning() {
  document.getElementById("warning").innerHTML = "";
};