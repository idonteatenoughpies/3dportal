$(document).ready(function(){
  $('.view').click(function()
  //EXTRACT MODEL ID FROM TABLE AND PASS TO VIEW ROUTE
  {
      const id = this.id;
        const splitid = id.split('_');
        const viewid = splitid[1];
        const encoded = encodeURIComponent(viewid);
        window.location.assign(`/3dmodel?ref=${encoded}`)
  })

  // RETURN BUTTON  
  $('.goBack').click(function(){
    window.history.back();
  })

})
