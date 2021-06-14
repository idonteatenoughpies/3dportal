$("#submit").click(handleClick);

      function handleClick() {
          const nametosend = $('#name').val();
          const questtosend = $('#quest').val();

          const url = '/getform?name='+nametosend+"&quest="+questtosend;

          $.ajax(
              {url: url, 
            success: (result) => {
                $("#result").html(result);
                }
              });
              return false;
      }