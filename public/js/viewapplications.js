$(document).ready(function(){
  $('.view').click(function()
  {
      const id = this.id;
        const splitid = id.split('_');
        const viewid = splitid[1];
      window.location.assign(`viewapplications/viewportal/_id/${viewid}`)
  })
})