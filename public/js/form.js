$("#submit").click(handleClick);

      function handleClick() {
          const name = $('#name').val();
          const quest = $('#quest').val();

          const url = '/postform';
          const data= [name, quest]

          $.ajax(
              {url: url,
                data: data,
            success: (result) => {
                $("#result").html(result);
                }
              });
              return false;
      }