$(function () {
    //set up the change handler to populate user details when a user is selected.
    $('#userSelect').change(function () {
        fillBoxesUser();
    });
    $('#appSelect').change(function () {
        fillBoxesApp();
    });
});

let _id;
let originalUsername;
let username

// ----------------------- user code ------------------------------

function fillBoxesUser() {
    //setting variables
    var userSelected = $("#userSelect option:selected").val(); //takes value of the selected user (id)
    if (userSelected == "default") {
        $("#first").val("");
        $("#last").val("");
        $("#username").val("");
        $("#email").val("");
        $("#street1").val("");
        $("#street2").val("");
        $("#town").val("");
        $("#county").val("");
        $("#postcode").val("");
    } else {
        var data = { _id: userSelected }

        $.ajax({
            url: "/admindashboard/getuser",
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (result) {
                let firstName = result[0].first;      //takes variable from returned array and sets to firstnamebox
                $("#first").val([firstName]);
                let lastName = result[0].last;        //takes variable from returned array and sets to lastnamebox
                $("#last").val([lastName]);
                username = result[0].username;        //takes variable from returned array and sets to usernamebox
                $("#username").val([username]);
                let email = result[0].email;              //takes variable from returned array and sets to emailbox
                $("#email").val([email]);
                let street1 = result[0].street1;              //takes variable from returned array and sets to emailbox
                $("#street1").val([street1]);
                let street2 = result[0].street2;              //takes variable from returned array and sets to emailbox
                $("#street2").val([street2]);
                let town = result[0].town;              //takes variable from returned array and sets to emailbox
                $("#town").val([town]);
                let county = result[0].county;              //takes variable from returned array and sets to emailbox
                $("#county").val([county]);
                let postcode = result[0].postcode;              //takes variable from returned array and sets to emailbox
                $("#postcode").val([postcode]);
                _id = result[0]._id;
                $("#idBox").val([_id]);
                originalUsername = result[0].username;
                let admin = result[0].admin;
                let radio;
                if (admin == true) { radio = document.getElementById('adminRadioTrue'); radio.checked = true }
                else { radio = document.getElementById('adminRadioFalse'); radio.checked = true }
            }
        });
    }
}

const updateform = document.getElementById('reg-form')
updateform.addEventListener('submit', updateUser)

async function updateUser(event) {
    event.preventDefault()


    const first = document.getElementById('first').value
    const last = document.getElementById('last').value
    const email = document.getElementById('email').value
    username = document.getElementById('username').value
    const street1 = document.getElementById('street1').value
    const street2 = document.getElementById('street2').value
    const town = document.getElementById('town').value
    const county = document.getElementById('county').value
    const postcode = document.getElementById('postcode').value
    const admin = $('input[name="adminRadio:checked').val();

    const result = await fetch('/admindashboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            first, last, email, username, street1, street2, town, county, postcode, _id, originalUsername, admin
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        //everything went ok 
        document.getElementById("success").innerHTML = "Account details Updated";
    } else {
        document.getElementById("success").innerHTML = "Failed to update account: " + result.error;
    }
}

async function checkUser() {
    const username = document.getElementById('username').value;
    if (username !== originalUsername) {
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
            document.getElementById("updateDetailsConfirmButton").disabled = true;
        }
        if (result.status === 'ok') {
            //everything went ok 
            document.getElementById("uniqUser").innerHTML = "";
            document.getElementById("updateDetailsConfirmButton").disabled = false;
        }
    }
}

async function passwordLength() {
    const password = document.getElementById('password').value
    if (password.length < 8) { document.getElementById("passwordLength").innerHTML = "Password must be a minimum of 8 characters long."; }
    else {
        if (password.includes('password')) {
            document.getElementById("passwordLength").innerHTML = "Password must not include password.";
            document.getElementById("passwordUpdateModalButton").disabled = true
        } else {
            if (password.includes('12345678')) {
                document.getElementById("passwordLength").innerHTML = "Password must not include 12345678.";
                document.getElementById("passwordUpdateModalButton").disabled = true
            } else {
                document.getElementById("passwordLength").innerHTML = "";
                document.getElementById("passwordUpdateModalButton").disabled = false
                if (passwordconfirm = document.getElementById('confirmpassword').value != "") {

                    passwordMatch();
                }
            }
        }
    }
}

async function passwordMatch() {
    const password = document.getElementById('password').value
    let passwordconfirm = document.getElementById('confirmpassword').value
    if (passwordconfirm === "undefined" || password === passwordconfirm) {
        document.getElementById("passwordMatch").innerHTML = "";
        document.getElementById("passwordUpdateModalButton").disabled = false;
    }
    else {
        document.getElementById("passwordMatch").innerHTML = "Passwords do not match.";
        document.getElementById("passwordUpdateModalButton").disabled = true;
    }
}

async function deleteAccount() {
    const username = document.getElementById('username').value;
    const result = await fetch('/admindashboard/deleteuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _id,
            username
        })
    }).then((res) => res.json())

    if (result.status !== 'ok') {
        //everything went ok 
        document.getElementById("deleteError").innerHTML = "Account deletion Failed. Please contact Customer Support.";
    }
    if (result.status === 'ok') {
        //everything went ok 
        document.getElementById("deleteError").innerHTML = "Account deleted.";
        $("#userSelect").empty();
        var html1 = '<option value="default" selected>Choose a user</option>'
        $("#userSelect").append(html1);

        for (var i = 0; i < result.newUserList.length; i++) {
            var htmlCode = "<option value=";
            htmlCode += result.newUserList[i]._id + ">";      //compose HTML for list options
            htmlCode += result.newUserList[i].first + " ";
            htmlCode += result.newUserList[i].last + "</option>";   //complete option line and close select HTML            
            $("#userSelect").append(htmlCode);      //add a child to user list
        }
        fillBoxes();
    }
}

function success() {
    document.getElementById("success").innerHTML = "";
}

// ---------------------- application code -------------------------------

function fillBoxesApp() {
    //setting variables
    var appSelected = $("#appSelect option:selected").val(); //takes value of the selected user (id)
    if (appSelected == "default") {
        $("#planningID").val("");
        $("#title").val("");
        $("#status").val("");
        $("#description").val("");
        $("#submittedBy").val("");
        $("#applicantName").val("");
        $("#applicantAddress").val("");
        $("#applicantPostcode").val("");
        $("#applicantPhone").val("");
        $("#agentName").val("");
        $("#agentAddress").val("");
        $("#agentPostcode").val("");
        $("#agentPhone").val("");
        $("#propertyOwner").val("");
        $("#applicationStreet1").val("");
        $("#applicationStreet2").val("");
        $("#applicationTown").val("");
        $("#applicationCounty").val("");
        $("#applicationPostcode").val("");
        $("#dateCreated").val("");

    } else {
        var data = { _id: appSelected }

        $.ajax({
            url: "/admindashboard/getapp",
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (result) {
                let planningID = result[0].planningID;      //takes variable from returned array and sets to firstnamebox
                $("#planningID").val([planningID]);
                let title = result[0].title;        //takes variable from returned array and sets to lastnamebox
                $("#title").val([title]);
                let status = result[0].status;        //takes variable from returned array and sets to usernamebox
                $("#status").val([status]);
                let description = result[0].description;        //takes variable from returned array and sets to usernamebox
                $("#description").val([description]);
                let submittedBy = result[0].submittedBy;              //takes variable from returned array and sets to emailbox
                $("#submittedBy").val([submittedBy]);
                let applicantName = result[0].applicant.name;              //takes variable from returned array and sets to emailbox
                $("#applicantName").val([applicantName]);
                let applicantAddress = result[0].applicant.address;              //takes variable from returned array and sets to emailbox
                $("#applicantAddress").val([applicantAddress]);
                let applicantPostcode = result[0].applicant.postcode;              //takes variable from returned array and sets to emailbox
                $("#applicantPostcode").val([applicantPostcode]);
                let applicantPhone = result[0].applicant.phone;              //takes variable from returned array and sets to emailbox
                $("#applicantPhone").val([applicantPhone]);
                let agentName = result[0].agent.name;              //takes variable from returned array and sets to emailbox
                $("#agentName").val([agentName]);
                let agentAddress = result[0].agent.address;              //takes variable from returned array and sets to emailbox
                $("#agentAddress").val([agentAddress]);
                let agentPostcode = result[0].agent.postcode;              //takes variable from returned array and sets to emailbox
                $("#agentPostcode").val([agentPostcode]);
                let agentPhone = result[0].agent.phone;              //takes variable from returned array and sets to emailbox
                $("#agentPhone").val([agentPhone]);
                let propertyOwner = result[0].propertyOwner;              //takes variable from returned array and sets to emailbox
                $("#propertyOwner").val([propertyOwner]);
                let applicationStreet1 = result[0].applicationAddress.street1;              //takes variable from returned array and sets to emailbox
                $("#applicationStreet1").val([applicationStreet1]);
                let applicationStreet2 = result[0].applicationAddress.street2;              //takes variable from returned array and sets to emailbox
                $("#applicationStreet2").val([applicationStreet2]);
                let applicationTown = result[0].applicationAddress.town;              //takes variable from returned array and sets to emailbox
                $("#applicationTown").val([applicationTown]);
                let applicationCounty = result[0].applicationAddress.county;              //takes variable from returned array and sets to emailbox
                $("#applicationCounty").val([applicationCounty]);
                let applicationPostcode = result[0].applicationAddress.postcode;              //takes variable from returned array and sets to emailbox
                $("#applicationPostcode").val([applicationPostcode]);
                let dateCreated = result[0].dateCreated;              //takes variable from returned array and sets to emailbox
                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December;"]
                const dateObj = new Date(dateCreated);
                const month = monthNames[dateObj.getMonth()];
                const day = String(dateObj.getDate());
                const year = dateObj.getFullYear();
                dateStr = (day + ' ' + month + ' ' + year).toString();
                $("#dateCreated").val([dateStr]);

                let modelRequired = result[0].modelRequired;
                let modelRadio;
                if (modelRequired == true) { modelRadio = document.getElementById('modelRadioTrue'); modelRadio.checked = true }
                else { modelRadio = document.getElementById('modelRadioFalse'); modelRadio.checked = true }
            }
        });
    }
}



const updateAppform = document.getElementById('apps-form')
updateAppform.addEventListener('submit', updateApp)

async function updateApp(event) {

    event.preventDefault()
        const planningID = document.getElementById("planningID").value;
        const title = document.getElementById("title").value;
        const status = document.getElementById("status").value;
        const description = document.getElementById("description").value;
        const submittedBy = document.getElementById("submittedBy").value;
        const applicantName= document.getElementById("applicantName").value;
        const applicantAddress = document.getElementById("applicantAddress").value;
        const applicantPostcode = document.getElementById("applicantPostcode").value;
        const applicantPhone = document.getElementById("applicantPhone").value;
        const agentName = document.getElementById("agentName").value;
        const agentAddress = document.getElementById("agentAddress").value;
        const agentPostcode = document.getElementById("agentPostcode").value;
        const agentPhone = document.getElementById("agentPhone").value;
        const propertyOwner = document.getElementById("propertyOwner").value;
        const applicationStreet1 = document.getElementById("applicationStreet1").value;
        const applicationStreet2 = document.getElementById("applicationStreet2").value;
        const applicationTown = document.getElementById("applicationTown").value;
        const applicationCounty = document.getElementById("applicationCounty").value;
        const applicationPostcode = document.getElementById("applicationPostcode").value;
        const modelRequired = $('input[name="modelRadio:checked').val();


    const result = await fetch('/admindashboard/updateapp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            planningID, title, status, description, submittedBy, applicantName, applicantAddress, 
            applicantPostcode, applicantPhone, agentName, agentAddress, agentPostcode, agentPhone, 
            propertyOwner, applicationStreet1, applicationStreet2, applicationTown, applicationCounty, 
            applicationPostcode, modelRequired
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        //everything went ok 
        document.getElementById("successApp").innerHTML = "Application details Updated";
    } else {
        document.getElementById("successApp").innerHTML = "Failed to update application: " + result.error;
    }
}

async function deleteApplication() {
    const planningID = document.getElementById('planningID').value;
    const result = await fetch('/admindashboard/deleteapp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            planningID
        })
    }).then((res) => res.json())

    if (result.status !== 'ok') {
        //everything went ok 
        document.getElementById("appDeleteError").innerHTML = "Application deletion Failed. Please contact Customer Support.";
    }
    if (result.status === 'ok') {
        //everything went ok 
        document.getElementById("appDeleteError").innerHTML = "Application deleted.";
        $("#appSelect").empty();
        var html2 = '<option value="default" selected>Choose an application</option>'
        $("#appSelect").append(html2);

        for (var i = 0; i < result.newAppList.length; i++) {
            var htmlCode = "<option value=";
            htmlCode += result.newAppList[i]._id + ">";      //compose HTML for list options
            htmlCode += result.newAppList[i].planningID + "</option>";   //complete option line and close select HTML            
            $("#appSelect").append(htmlCode);      //add a child to user list
        }
        fillBoxesApp();
    }
}

function successApp() {
    document.getElementById("successApp").innerHTML = "";
}