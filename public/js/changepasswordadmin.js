// ---- ADD LISTENER TO UPDATE PASSWORD BUTTON ----
const changepasswordbutton = document.getElementById('updatePasswordConfirmButton')
changepasswordbutton.addEventListener('updatePasswordConfirmButton', changePwd)

// ---- FUNCTION TO SEND PASSWORD UPDATE INSTRUCTION TO CHANGE-PASSWORD ROUTE----
async function changePwd() {
  const password = document.getElementById('password').value
  const confirmpassword = document.getElementById('confirmpassword').value
  const _id = document.getElementById('idBox').value; // OBTAIN USER ID FROM HIDDEN FIELD TO SEND WITH POST REQUEST

  if (password !== confirmpassword) { //LOGICAL TEST TO ENSURE NEW PASSWORD AND CONFIRM PASSWORD MATCH
    document.getElementById("warning").innerHTML = "passwords do not match.";
  } else {

    const result = await fetch('/change-password/Admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password, _id
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

// ---- FUNCTION TO CLEAR WARNING MESSAGES - CALLED ONFOCUS ----
function clearWarning() {
  document.getElementById("warning").innerHTML = "";
};