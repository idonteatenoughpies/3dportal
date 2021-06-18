$("#submit").click(handleClick);

      function handleClick() {
          var nametosend = $('#name').val();
          var questtosend = $('#quest').val();

          var url = "./getform?"+"name="+nametosend+"&quest="+questtosend;
          
          $.ajax(
              {url: url,
            success: function(result) {
                $("#result").html(result);
                }
              });
              return false;
      }