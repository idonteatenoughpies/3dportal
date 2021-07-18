var number = 1;

function addFields() {
    // Container <div> where dynamic content will be placed
    var container = document.getElementById("newDocumentContainer");
    // Append a node with a random text

    // Create an <input> element, set its type and name attributes
    let div1 = document.createElement('div');
    div1.classList.add("p-2");
    div1.classList.add("bd-highlight");
    container.appendChild(div1);

    let div2 = document.createElement('div');
    div2.classList.add("custom-file");
    div1.appendChild(div2);


    var label = document.createElement("label");
    label.for = name;
    label.id = "documentLabel" + number;
    div2.appendChild(label);
    var label = "documentLabel" + number;
    var labelText = "Additional Document " + number;

    document.getElementById(label).innerHTML = labelText;

    var input = document.createElement("input");
    input.type = "file";
    input.name = "documentinput" + number;
    input.id = "documentinput" + number;
    var name = "documentinput" + number;
    div2.appendChild(input);



    let text = document.createElement('input');
    var textlabel = "documenttext" + number;
    text.type = "text";
    text.name = textlabel;
    text.id = textlabel;
    text.placeholder = "Document description";
    div2.appendChild(text);

    number++;
    document.getElementById('count').value = number;

    
}

