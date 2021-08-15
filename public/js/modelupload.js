var number = 1; // DECLARE DOCUMENT COUNT VARIABLE AND INITIALISE TO 1

// ---- ADD NEW UPLOAD FIELD IF OBJ FILE DETECTED (CREATE ELEMENT AND APPEND) ----
let modelinput = document.getElementById('modelInput0')
modelinput.onchange = () => {
    let selectedFile = modelinput.files[0];

    // EXTENTION IDENTIFICATION CODE COURTESY OF VisioN & PedroZorus: https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
    const uid = uuidv4(document.name);
    let ext = selectedFile.name.slice((Math.max(0, selectedFile.name.lastIndexOf(".")) || Infinity) + 1);
    console.log(ext);
    if (ext.toLowerCase() == "obj") {
        var container = document.getElementById("MTLContainer");
        let diva = document.createElement('div');
        diva.className = "p-2";
        container.appendChild(diva);

        let divb = document.createElement('div');
        divb.className = "custom-file";
        diva.appendChild(divb);

        var modelLabel = document.createElement("label");
        modelLabel.for = "modelInput" + number;
        modelLabel.id = "MTLLabel" + number;
        divb.appendChild(modelLabel);
        var modelLabelID = "MTLLabel" + number;
        var modelLabelText = "You have uploaded an OBJ file. Please also upload an MTL file to accompany it";

        document.getElementById(modelLabelID).innerHTML = modelLabelText;

        var modelInput = document.createElement("input");
        modelInput.type = "file";
        modelInput.name = "modelInput" + number;
        modelInput.id = "modelInput" + number;
        divb.appendChild(modelInput);

        number++;
        document.getElementById('count').value = number;
    }
    else { document.getElementById("MTLContainer").innerHTML = ""; }

    if ( //TEST FOR UNSUPPORTED FILE TYPES
        ext.toLowerCase().trim() != "obj" &&
        ext.toLowerCase().trim() != "mtl" &&
        ext.toLowerCase().trim() != "gltf" &&
        ext.toLowerCase().trim() != "3ds" &&
        ext.toLowerCase().trim() != "stl" &&
        ext.toLowerCase().trim() != "ply" &&
        ext.toLowerCase().trim() != "glb" &&
        ext.toLowerCase().trim() != "3dm" &&
        ext.toLowerCase().trim() != "off" &&
        ext.toLowerCase().trim() != "mtl"
    ) {
        document.getElementById("fileWarning").innerHTML = "Unsupported file type";
        document.getElementById("submitButton").disabled = true;
    }
    else {
        document.getElementById("fileWarning").innerHTML = "";
        document.getElementById("submitButton").disabled = false;
    }

}
