var number = 1; // DECALRE VARIABLE TO COUNT DOCUMENTS AND INITIALISE AT 1

// ---- FUNCTION TO ADD NEW DOCUMENT UPLOAD FIELD (CREATE ELEMENT AND APPEND) ----
function addFields() {
  var container = document.getElementById("newDocumentContainer");

  //CREATE A NEW DIV
  let div1 = document.createElement('div');
  div1.classList.add("p-2");
  container.appendChild(div1);

  //CREATE CHILD DIV OF CUSTOM FILE TYPE AND APPEND TO PARENT DIV
  let div2 = document.createElement('div');
  div2.classList.add("custom-file");
  div1.appendChild(div2);

  // CREATE LABEL FOR FILE INPUT AND APPEND TO CHILD DIV
  var label = document.createElement("label");
  label.for = "documentinput" + number; // CREATES UNIQUE INCREMENTED ID FOR THE INPUT AND ASSOCIATED ELEMENTS
  label.id = "documentLabel" + number;
  div2.appendChild(label);

  // ADD TEXT TO THE DOCUMENT LABEL ELEMENT CREATED ABOVE
  var labelID = "documentLabel" + number;
  var labelText = "Additional Document " + number;
  document.getElementById(labelID).innerHTML = labelText;

  // CREATE FILE INPUT AND APPEND TO CHILD DIV
  var input = document.createElement("input");
  input.type = "file";
  input.name = "documentinput" + number;
  input.id = "documentinput" + number;
  input.onchange = validate; //CALL VALIDATE() ON CHANGE
  div2.appendChild(input);

  // CREATE TEXT INPUT FOR FILE DESCRIPTION AND APPEND TO CHILD DIV
  let text = document.createElement('input');
  var textlabel = "documenttext" + number;
  text.type = "text";
  text.name = textlabel;
  text.id = textlabel;
  text.placeholder = "Document description";
  div2.appendChild(text);

  number++; //INCREMENT THE NUMBER OF DOCUMENTS
  document.getElementById('count').value = number; // UPDATE THE COUNT ON THE PAGE
}

// ---- ADD ONCHANGE LISTENER TO FIRST DOCUMENT UPLOAD ----
let doc1 = document.getElementById('documentinput0');
doc1.onchange = validate;

// ---- FUNCTION TO CHECK FOR PDF EXTENSION ----
function validate() {
  let filetype = this.value;
  let ext = filetype.slice((Math.max(0, filetype.lastIndexOf(".")) || Infinity) + 1);
  if (ext.toLowerCase() !== "pdf") {
    document.getElementById('fileWarning').innerHTML = "<h2 style= 'color:red'>Files must be PDF documents</h2><p>Please convert your file to pdf before uploading</p"
    document.getElementById('submitButton').disabled = true;
  } else {
    document.getElementById('fileWarning').innerHTML = "";
    document.getElementById('submitButton').disabled = false;
  }
}