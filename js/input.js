var leftInput;
var rightInput;
var videoLid;
var videoRid;

var file1_loaded;
var file2_loaded;
var file1;
var file2;
var file1_type;
var file2_type;

function youtubeSubmitClick() {
    leftInput = document.getElementById("leftinput").value;
    rightInput = document.getElementById("rightinput").value;
    var alerted = false;
    if (leftInput == "") {
        alert("Please enter a video url or id for the first video.");
    } else if (rightInput == "") {
        alert("Please enter a video url or id for the second video.");
    } else {
        var isURL = false;
        if (leftInput.length != 11) {
            isURL = true;
        } else {
            videoLid = leftInput;
        }
        if (isURL) {
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = leftInput.match(regExp);
            if (!match || match[2].length != 11) {
                alert("Invalid first url or id.");
                alerted = true;
            } else {
                videoLid = match[2];
            }
        }

        isURL = false;
        if (!alerted && rightInput.length != 11) {
            isURL = true;
        } else {
            videoRid = rightInput;
        }
        if (!alerted && isURL) {
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = rightInput.match(regExp);
            if (!match || match[2].length != 11) {
                alert("Invalid second url or id.");
                alerted = true;
            } else {
                videoRid = match[2];
            }
        }

        if (videoLid && videoRid) {
            sessionStorage.videoLid = videoLid;
            sessionStorage.videoRid = videoRid;
            window.location.href = "./youtube";
        } else if (!alerted) {
            alert("Something went wrong.");
        }
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