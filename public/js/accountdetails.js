const updateform = document.getElementById('reg-form')
updateform.addEventListener('submit', updateUser)

async function updateUser(event) {
    event.preventDefault()

    const first = document.getElementById('first').value
    const last = document.getElementById('last').value
    const email = document.getElementById('email').value
    const username = document.getElementById('username').value
    const street1 = document.getElementById('street1').value
    const street2 = document.getElementById('street2').value
    const town = document.getElementById('town').value
    const county = document.getElementById('county').value
    const postcode = document.getElementById('postcode').value

    const result = await fetch('/accountdetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first, last, email, username, street1, street2, town, county, postcode
      })
    }).then((res) => res.json())

    if (result.status === 'ok') {
      //everything went ok 
      document.getElementById("success").innerHTML = "Account details Updated";
    } else {
      document.getElementById("success").innerHTML = "Failed to update account: " + result.error;
     
    }
  
}

async function checkUser(){
    const username = document.getElementById('username').value;
    if (username !== checkusername){
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
      document.getElementById("updateDetailsConfirmButton").disabled=true;
    }
    if (result.status === 'ok') {
      //everything went ok 
      document.getElementById("uniqUser").innerHTML = "";
      document.getElementById("updateDetailsConfirmButton").disabled=false;
    }
  }}

  async function passwordLength() {
    const password = document.getElementById('password').value
    if (password.length < 8) { document.getElementById("passwordLength").innerHTML = "Password must be a minimum of 8 characters long.";}
    else{
      if (password.includes ('password')) {
        document.getElementById("passwordLength").innerHTML = "Password must not include password.";
        document.getElementById("passwordUpdateModalButton").disabled = true
      } else {
        if (password.includes ('12345678')) {
          document.getElementById("passwordLength").innerHTML = "Password must not include 12345678.";
          document.getElementById("passwordUpdateModalButton").disabled = true
        } else {
          document.getElementById("passwordLength").innerHTML = "";
          document.getElementById("passwordUpdateModalButton").disabled = false
          if(passwordconfirm = document.getElementById('confirmpassword').value != ""){
            passwordMatch();
          }
        }
  }
}
  }

  async function passwordMatch() {
    const password = document.getElementById('password').value
    let passwordconfirm = document.getElementById('confirmpassword').value
    if (passwordconfirm ==="undefined" || password === passwordconfirm) 
    {document.getElementById("passwordMatch").innerHTML = "";
    document.getElementById("passwordUpdateModalButton").disabled=false;}
    else{ document.getElementById("passwordMatch").innerHTML = "Passwords do not match.";
    document.getElementById("passwordUpdateModalButton").disabled=true;}
  }

  async function deleteAccount(){
    const _id= '<%= user._id %>' ;
    const result = await fetch('/accountdetails/deleteuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id
      })
    }).then((res) => res.json())

    if (result.status !== 'ok') {
      //everything went ok 
      document.getElementById("deleteError").innerHTML = "Account deletion Failed. Please contact Customer Support.";
    }
    if (result.status === 'ok') {
      //everything went ok 
      window.location = result.redirect; 
    }
  }
  
  function success() {
    document.getElementById("success").innerHTML = "";
  }