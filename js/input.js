var videoLid, videoRid, volumeListener, originalLocation = window.location;
var file1, file1_loaded, file1_type, file2, file2_loaded, file2_type;
var playerL = document.getElementById("playerL");
var playerR = document.getElementById("playerR");
var playing = false, leftPlaying = true;
var fading = false, fadetime = 1000, maxVol = 100, t = -1.0;
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
    for (i = 0; i < fileTypes.length; i++) {
        if (file.type == fileTypes[i]) {
            if (i < 7) {
                return [true, "audio"];
            } else {
                return [true, "video"];
            }
        }
    }
    return [false, null];
}

function file1_input() {
    file1_loaded = false;
    file1 = document.getElementById("file1").files[0];
    var checked = checkFile(file1);
    if (!checked[0]) {
        alert("Please select a supported audio or video file.");
    } else {
        document.getElementById("file1button").textContent = file1.name;
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
        document.getElementById("file2button").textContent = file2.name;
        if (file1_loaded) {
            document.getElementById("uploadSubmit").disabled = false;
        }
        file2_loaded = true;
        file2_type = checked[1];
    }
}

function youtubeSubmitClick() {
    var leftInput = document.getElementById("leftinput").value;
    var rightInput = document.getElementById("rightinput").value;
    if (leftInput == "") {
        alert("Please enter a video url or id for the first video.");
    } else if (rightInput == "") {
        alert("Please enter a video url or id for the second video.");
    } else {
        var isURL = false, alerted = false;
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
    document.getElementById("youtube").style.display = "none";
    document.getElementById("media").style.display = "none";
    playerL.setAttribute("src", window.URL.createObjectURL(file1));
    playerL.style.display = "inline-block";
    playerR.setAttribute("src", window.URL.createObjectURL(file2));
    playerR.style.display = "inline-block";
    document.getElementById("players").style.display = "block";
    document.getElementById("playback").style.display = "inline";
    document.getElementById("xfadeButtons").style.display = "inline";
    document.getElementById("volumeSlider").value = maxVol;
    playerR.volume = 0;
    startVolumeListener();
    history.pushState(true, null, window.location + "/usermedia");
}

window.addEventListener("popstate", function(event) {
    // if (!event.state) {
    //     pause(playerL);
    //     document.getElementById("youtube").style.display = "inline";
    //     document.getElementById("media").style.display = "inline";
    //     document.getElementById("players").style.display = "none";
    //     document.getElementById("xfadeButtons").style.display = "none";
    // } else {
    //     document.getElementById("youtube").style.display = "none";
    //     document.getElementById("media").style.display = "none";
    //     document.getElementById("players").style.display = "inline";
    //     document.getElementById("xfadeButtons").style.display = "inline";
    // }
    location.reload();
});

function mainButtonClick() {
    if (playing) {
        pause(playerL);
    } else {
        play(playerL);
    }
}

function play(player) {
    player.play();
    document.getElementById("mainbtn").textContent = "Pause";
    playing = true;
}

function pause(player) {
    player.pause();
    document.getElementById("mainbtn").textContent = "Play";
    playing = false;
}

playerL.addEventListener("play", function(e) {
    play(playerR);
});

playerR.addEventListener("play", function(e) {
    play(playerL);
});

playerL.addEventListener("pause", function(e) {
    pause(playerR);
});

playerR.addEventListener("pause", function(e) {
    pause(playerL);
});

function xfade() {
    if (!fading) {
        fading = true;
        endVolumeListener();
        if (leftPlaying) {
            $("#back1").animate({opacity: 0}, 1000);
            var changeT = 2/(fadetime/50);
            var interval = setInterval(function() {
                if (t >= 1) {
                    clearInterval(interval);
                    startVolumeListener();
                    fading = false;
                } else {
                    playerL.volume = Math.round(maxVol * Math.sqrt(1/2 * (1 - Math.max(-1,t))))/100;
                    playerR.volume = Math.round(maxVol * Math.sqrt(1/2 * (1 + Math.max(-1,t))))/100;
                    t += changeT;
                }
            }, 50);
            leftPlaying = false;
        } else {
            $("#back1").animate({opacity: 1}, 1000);
            var changeT = 2/(fadetime/50);
            var interval = setInterval(function() {
                if (t <= -1) {
                    clearInterval(interval);
                    startVolumeListener();
                    fading = false;
                } else {
                    playerL.volume = Math.round(maxVol * Math.sqrt(1/2 * (1 - Math.min(1,t))))/100;
                    playerR.volume = Math.round(maxVol * Math.sqrt(1/2 * (1 + Math.min(1,t))))/100;
                    t -= changeT;
                }
            }, 50);
            leftPlaying = true;
        }
    }
}

function changeVolume(newVol) {
    maxVol = newVol;
    if (leftPlaying) {
        playerL.volume = newVol/100;
    } else {
        playerR.volume = newVol/100;
    }
}

function startVolumeListener() {
    volListener = setInterval(function() {
        if (leftPlaying) {
            maxVol = playerL.volume*100;
            document.getElementById("volumeSlider").value = maxVol;
        } else {
            maxVol = playerR.volume*100;
            document.getElementById("volumeSlider").value = maxVol;
        }
    }, 100);
}

function endVolumeListener() {
    clearInterval(volListener);
}