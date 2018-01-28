var file1;
var file2;
var file1_url;
var file2_url;
var file1_type;
var file2_type;
var playerL;
var playerR;

function pageLoad() {
    file1 = sessionStorage.getItem("file1");
    file2 = sessionStorage.getItem("file2");
    console.log(file1);
    file1_url = sessionStorage.getItem("file1_url");
    file2_url = sessionStorage.getItem("file2_url");
    file1_type = sessionStorage.getItem("file1_type");
    file2_type = sessionStorage.getItem("file2_type");

    if (file1_type == "audio") {
        playerL = document.createElement("AUDIO");
    } else {
        playerL = document.createElement("VIDEO");
    }

    if (file2_type == "audio") {
        playerR = document.createElement("AUDIO");
    } else {
        playerR = document.createElement("VIDEO");
    }

    playerL.setAttribute("class", "player");
    //playerL.setAttribute("src", file1_url);
    playerL.setAttribute("src", window.URL.createObjectURL(file1));
    playerL.setAttribute("controls", "controls");
    playerL.setAttribute("display", "inline-block");
    document.getElementById("playerL").appendChild(playerL);

    playerR.setAttribute("class", "player");
    //playerR.setAttribute("src", file2_url);
    playerR.setAttribute("src", window.URL.createObjectURL(file2));
    playerR.setAttribute("controls", "controls");
    playerR.setAttribute("display", "inline-block");
    document.getElementById("playerR").appendChild(playerR);
}

function mainButtonClick() {

}

function xfade() {

}