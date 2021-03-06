$(document).ready(function () {
  //---- EXTRACT PLANNING ID FROM TABLE AND PASS TO VIEW ROUTE ----
  $('.view').on('click', (function () {
    const id = this.id;
    const splitid = id.split('_');
    const viewid = splitid[1];
    var string = encodeURIComponent(viewid);
    window.location.assign(`/viewapplications/viewportal/?planningID=${string}`)
  }));

  // ---- SEARCH CODE ----
  $('#searchSubmit').click(async function () {
    const search = document.getElementById('applicationSearchBox').value;
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

      if (searchResult.length === 0) { //APPEND SEARCH RESULTS TO TABLE OF PLANNING APPLICATIONS
        $("#tbodyid").empty();
        document.getElementById('noResult').innerHTML = "No results to display";
      } else {
        //everything went ok 
        $("#tbodyid").empty();
        document.getElementById('noResult').innerHTML = "";
        for (var i = 0; i < searchResult.length; i++) {

          let appID = searchResult[i].planningID;
          let referString = encodeURIComponent(appID);
          let row = document.createElement("TR");
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
          date = searchResult[i].dateCreated;
          // FORMAT DISPLAYED DATE
          const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
          const dateObj = new Date(date);
          const month = monthNames[dateObj.getMonth()];
          const day = String(dateObj.getDate());
          const year = dateObj.getFullYear();
          dateStr = (day + ' ' + month + ' ' + year).toString();
          var h = document.createTextNode(dateStr);
          g.appendChild(h);
          document.getElementById("tbodyid").appendChild(g);
          // CREATE DOCUMENT VIEW BUTTON FOR LINE ENTRY
          var j = document.createElement("TD");
          var k = document.createElement("BUTTON")
          k.innerHTML = "View";
          k.className = "view btn btn-primary";
          k.id = "view_" + appID;
          k.onclick = function () { window.location.assign(`/viewapplications/viewportal/?planningID=${referString}`) };
          j.appendChild(k);
          document.getElementById("tbodyid").appendChild(j);
        }
      }
    } else {
      document.getElementById('noResult').innerHTML = "Somethign went wrong. Please contact support for help";
    }
  });
})