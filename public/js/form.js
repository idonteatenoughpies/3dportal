$("#submit").click(handleClick);

      function handleClick() {
          const name = $('#name').val();
          const quest = $('#quest').val();

          console.log('name:' + name);
          console.log('quest: '+ quest);
        
          const url = '/postform';
          const data= {"name":name, "quest":quest};

          $.ajax(
              {url: url,
                data: data,
              
            success: (result) => {
                $("#result").html(result);
                }
              });
              return false;
      }