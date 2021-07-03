$("#submit").click(handleClick);

      function handleClick() {
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
          var modelRequired = $('#modelRequired').val();

          const result = await fetch('/newApplication', {
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
            //everything went ok 
            document.getElementById("success").innerHTML = "Congratulations. You have successfully submitted an application";
          } else {
            document.getElementById("success").innerHTML = "REGISTRATION FAILED: " + result.error;
           
          }
        }