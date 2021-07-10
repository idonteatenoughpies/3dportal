const form = document.getElementById('app-form')
      form.addEventListener('submit', newApp)

      async function newApp(event) {
        event.preventDefault()
          var title = $('#title').val();
          var description = $('#description').val();
          var applicantName = $('#applicantName').val();
          var applicantAddress = $('#applicantAddress').val();
          var applicantPostcode = $('#applicantPostcode').val();
          var applicantPhone = $('#applicantPhone').val();
          var agentName = $('#agentName').val();
          var agentAddress = $('#agentAddress').val();
          var agentPostcode = $('#agentPostcode').val();
          var agentPhone = $('#agentPhone').val();
          var propertyOwner = $('#propertyOwner').val();
          var applicationStreet1 = $('#applicationStreet1').val();
          var applicationStreet2 = $('#applicationStreet2').val();
          var applicationTown = $('#applicationTown').val();
          var applicationCounty = $('#applicationCounty').val();
          var applicationPostcode = $('#applicationPostcode').val();
          var modelRequired = $('input[name="modelRequired"]:checked').val();
          

          const result = await fetch('/application/newApplication', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title, 
              description, 
              applicantName, 
              applicantAddress, 
              applicantPostcode, 
              applicantPhone, 
              agentName, 
              agentAddress, 
              agentPostcode, 
              agentPhone, 
              propertyOwner,
              applicationStreet1,
              applicationStreet2,
              applicationTown,
              applicationCounty,
              applicationPostcode,
              modelRequired
            })
          }).then((res) => res.json())
  
          if (result.status === 'ok') {
            ref=result.ref;
            //everything went ok 
            document.getElementById("success").innerHTML = `A new application has been successfully created <a href='/application/applicationupload?ref=${ref}'>Click here to go to document uploads</a>`;
          } else {
            document.getElementById("success").innerHTML = "New Application Failed: " + result.error;
           
          }
        }