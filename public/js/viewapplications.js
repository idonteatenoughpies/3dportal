$(document).ready(function () {

  $('.view').on('click', (function () {
    const id = this.id;
    const splitid = id.split('_');
    const viewid = splitid[1];
    window.location.assign(`/viewapplications/viewportal/_id/${viewid}`)
  }));

  $('#searchSubmit').click(async function () {
    const search = document.getElementById('applicationSearchBox').value;
    console.log(search);

    const result = await fetch('/viewApplications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search
      })
    }).then((res) => res.json())

    if (result.status === 'ok') {
      const searchResult = result.apps
      console.log(searchResult);
      //everything went ok 
      $("#tbodyid").empty();

      for (var i = 0; i < searchResult.length; i++) {

        let appID = searchResult[i]._id;
        let row = document.createElement("TR");
        row.setAttribute("id", "myTr");
        document.getElementById("tbodyid").appendChild(row);
        var a = document.createElement("TD");
        var b = document.createTextNode(searchResult[i].planningID);
        a.appendChild(b);
        document.getElementById("tbodyid").appendChild(a);
        var c = document.createElement("TD");
        var d = document.createTextNode(searchResult[i].title);
        c.appendChild(d);
        document.getElementById("tbodyid").appendChild(c);
        var e = document.createElement("TD");
        var f = document.createTextNode(searchResult[i].description);
        e.appendChild(f);
        document.getElementById("tbodyid").appendChild(e);
        var g = document.createElement("TD");
        var h = document.createTextNode(searchResult[i].dateCreated);
        g.appendChild(h);
        document.getElementById("tbodyid").appendChild(g);
        var j = document.createElement("TD");
        var k = document.createElement("BUTTON")
        k.innerHTML = "View";
        k.class = "view";
        k.id = "view_" + appID;
        k.onclick=function () {window.location.assign(`/viewapplications/viewportal/_id/${appID}`)};
        j.appendChild(k);
        document.getElementById("tbodyid").appendChild(j);
      }
    } else {
      console.log("whoops");
    }
  });
})