$(document).ready(function(){
  $('.view').click(function()
  {
      const id = this.id;
        const splitid = id.split('_');
        const viewid = splitid[1];
        const encoded = encodeURIComponent(viewid);
        window.location.assign(`/3dmodel?ref=${encoded}`)
  })
  
  $('.goBack').click(function(){
    window.history.back();
  })

})
