var videoLid;
var videoRid;

var file1_loaded;
var file2_loaded;
var file1;
var file2;
var file1_type;
var file2_type;

function youtubeSubmitClick() {
    videoLid = document.getElementById("leftinput").value;
    videoRid = document.getElementById("rightinput").value;
    if (videoLid == "") {
        alert("Please enter a video id for the first video.");
    } else if (videoRid == "") {
        alert("Please enter a video id for the second video.");
    } else {
        sessionStorage.videoLid = videoLid;
        sessionStorage.videoRid = videoRid;
        window.location.href = "./youtube";
    }
}

function uploadSubmitClick() {
    sessionStorage.file1 = file1;
    sessionStorage.file2 = file2;
    sessionStorage.file1_type = file1_type;
    sessionStorage.file2_type = file2_type;
    window.location.href = "./usermedia";
}

function file1_input() {
    file1_loaded = false;
    file1 = document.getElementById("file1").files[0];
    var checked = checkFile(file1);
    if (!checked[0]) {
        alert("Please select a supported audio or video file.");
    } else {
        var label = document.getElementById("file1button");
        label.textContent = file1.name;
        if (file2_loaded) {
            document.getElementById("uploadSubmit").disabled = false;
        }
        file1_loaded = true;
        file1_type = checked[1];
    }
}

function file2_input() {
    file2_loaded = false;
    file2 = document.getElementById("file2").files[0];
    var checked = checkFile(file2);
    if (!checked[0]) {
        alert("Please select a supported audio or video file.");
    } else {
        var label = document.getElementById("file2button");
        label.textContent = file2.name;
        if (file1_loaded) {
            document.getElementById("uploadSubmit").disabled = false;
        }
        file2_loaded = true;
        file2_type = checked[1];
    }
    console.log("yes");
}

var fileTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/ogg",
    "audio/wav",
    "audio/wave",
    "audio/webm",
    "audio/flac",
    "video/mp4",
    "video/webm",
    "video/ogg"
]
function checkFile(file) {
    var type = file.type;
    for (i = 0; i < fileTypes.length; i++) {
        if (type == fileTypes[i]) {
            if (i < 7) {
                return [true, "audio"];
            } else {
                return [true, "video"];
            }
        }
    }
    return [false, null];
}