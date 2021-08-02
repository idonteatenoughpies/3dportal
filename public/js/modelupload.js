var number = 1;
// ----------- Code to add new upload field if OBJ file detected  ---------------

let modelinput = document.getElementById('modelInput0')
modelinput.onchange = () => {
    let selectedFile = modelinput.files[0];

    let ext = selectedFile.name.slice((Math.max(0, selectedFile.name.lastIndexOf(".")) || Infinity) + 1);
    console.log(ext);
    if (ext.toLowerCase() == "obj") {
        // Container <div> where dynamic content will be placed
        var container = document.getElementById("MTLContainer");
        // Append a node with a random text

        // Create an <input> element, set its type and name attributes
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

    if (
        ext.toLowerCase().trim() != "obj" &&
        ext.toLowerCase().trim() != "mtl" &&
        ext.toLowerCase().trim() !== "gltf" &&
        ext.toLowerCase().trim() != "3ds" &&
        ext.toLowerCase().trim() != "stl" &&
        ext.toLowerCase().trim() != "ply" &&
        ext.toLowerCase().trim() != "glb" &&
        ext.toLowerCase().trim() != "3dm" &&
        ext.toLowerCase().trim() != "off" &&
        ext.toLowerCase().trim() != "mtl"
    ) { document.getElementById("fileWarning").innerHTML = "Unsupported file type"; }
    else {
        document.getElementById("fileWarning").innerHTML = "";
    }

}
