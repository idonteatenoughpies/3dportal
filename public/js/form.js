$("#submit").click(handleClick);

      function handleClick() {
          const name = $('#name').val();
          const quest = $('#quest').val();

          console.log(name);
          console.log('br');
          console.log(quest);
        
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