$(document).ready(function(){
  $('.view').click(function()
  {
      const id = this.id;
        const splitid = id.split('_');
        const viewid = splitid[1];
        window.location.assign(`/3dmodel`)
        //window.location.assign(`viewapplications/viewmodel/_id/${viewid}`)
  })
  
  $('.goBack').click(function(){
    window.history.back();
  })

})
