var videoLid;
var videoRid;

var firstClick = true;
var playing = false;

var leftPlaying = true;

var fadetime = 1000;
var maxVol;
var t = -1.0;

var loading = false;

function buttonClick() {
    if (firstClick) {
        videoLid = document.getElementById("leftinput").value;
        videoRid = document.getElementById("rightinput").value;
        if (videoLid == "") {
            alert("Please enter a video id for the first video.");
        } else if (videoRid == "") {
            alert("Please enter a video id for the second video.");
        } else {
            document.getElementById("input").style.display = "none";
            document.getElementById("mainbtn").textContent = "Loading... Please Wait";
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            firstClick = false;
            loading = true;
        }
    } else if (!loading) {
        if (playing) {
            pause(playerL);
        } else {
            play(playerL);
        }
    }
}

function examplePageStart() {
    videoLid = "ohAy4fJ-fKg"
    videoRid = "lWalw9iV-so"
    document.getElementById("mainbtn").textContent = "Loading... Please Wait";
    document.getElementById("mainbtn").style.visibility = "visible";
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    firstClick = false;
    loading = true;
}

var playerL;
var playerR;
function onYouTubeIframeAPIReady() {
    playerL = new YT.Player('playerL', {
        height: '390',
        width: '640',
        videoId: videoLid,
        events: {
            'onReady': onPlayerLReady,
            'onStateChange': onPlayerLStateChange
        }
    });
    playerR = new YT.Player('playerR', {
        height: '390',
        width: '640',
        videoId: videoRid,
        events: {
            'onReady': onPlayerRReady,
            'onStateChange': onPlayerRStateChange
        }
    });
}

function play(player) {
    player.playVideo();
    document.getElementById("mainbtn").textContent = "Pause";
    playing = true;
}

function pause(player) {
    player.pauseVideo();
    document.getElementById("mainbtn").textContent = "Play";
    playing = false;
}

var loadL = false;
var loadR = false;
function onPlayerLReady(event) {
    loadL = true;
    maxVol = playerL.getVolume();
    document.getElementById("volumeSlider").value = maxVol;
    playerL.mute();
    playerL.seekTo(1);
}
function onPlayerRReady(event) {
    loadR = true;
    playerR.mute();
    playerR.seekTo(1);
}

function onPlayerLStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        if (loading && loadL) {
            playerL.pauseVideo();
            playerL.seekTo(0);
            playerL.unMute();
            document.getElementById("playerL").style.visibility = "visible";
            loadL = false;
            bothReady();
        } else if (!loading) {
            loadL = false;
            play(playerR);
        }
    } else if (event.data == YT.PlayerState.PAUSED) {
        if (!loading) {
            if (!loadR) {
                pause(playerR);
            }
        }
    } else if (event.data == YT.PlayerState.BUFFERING) {
        if (!loading) {
            if (!loadR) {
                loadL = true;
                playerR.seekTo(playerL.getCurrentTime());
            }
        }
    } else if (event.data == YT.PlayerState.CUED) {
        if(!loading) {
            if (!loadR) {
                pause(playerR);
            }
        }

    } else if (event.data == YT.PlayerState.ENDED) {
        loop();
    }
}

function onPlayerRStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        if (loading && loadR) {
            playerR.pauseVideo();
            playerR.seekTo(0);
            playerR.unMute();
            playerR.setVolume(0);
            document.getElementById("playerR").style.visibility = "visible";
            loadR = false;
            bothReady();
        } else if (!loading) {
            loadR = false;
            play(playerL);
        }
    } else if (event.data == YT.PlayerState.PAUSED) {
        if (!loading) {
            if (!loadL) {
                pause(playerL);
            }
        }
    } else if (event.data == YT.PlayerState.BUFFERING) {
        if (!loading) {
            if (!loadL) {
                loadR = true;
                playerL.seekTo(playerR.getCurrentTime());
            }
        }
    } else if (event.data == YT.PlayerState.CUED) {
        if(!loading) {
            if (!loadL) {
                pause(playerL);
            }
        }
    } else if (event.data == YT.PlayerState.ENDED) {
        loop();
    }
}

function loop() {
    playerL.seekTo(0);
    playerR.seekTo(0);
    play(playerL);
}

function bothReady() {
    if (!loadL && !loadR) {
        document.getElementById("mainbtn").textContent = "Play";
        document.getElementById("xfadeButtons").style.display = "block";
        //document.getElementById("progress").style.display = "block";
        document.getElementById("volumeText").style.display = "inline";
        document.getElementById("volumeText").style.visibility = "visible";
        document.getElementById("volumeSlider").style.display = "inline";
        document.getElementById("volumeSlider").style.visibility = "visible";
        startVolumeListener();
        loading = false;
    }
}

var fading = false;
function xfade() {
    if (!fading) {
        fading = true;
        endVolumeListener();
        if (leftPlaying) {
            var changeT = 2/(fadetime/50);
            var interval = setInterval(function() {
                if (t >= 1) {
                    clearInterval(interval);
                    startVolumeListener();
                    fading = false;
                } else {
                    playerL.setVolume(Math.round(maxVol * Math.sqrt(1/2 * (1 - t))));
                    playerR.setVolume(Math.round(maxVol * Math.sqrt(1/2 * (1 + t))));
                    t += changeT;
                }
            }, 50);
            leftPlaying = false;
        } else {
            var changeT = 2/(fadetime/50);
            var interval = setInterval(function() {
                if (t <= -1) {
                    clearInterval(interval);
                    startVolumeListener();
                    fading = false;
                } else {
                    playerL.setVolume(Math.round(maxVol * Math.sqrt(1/2 * (1 - t))));
                    playerR.setVolume(Math.round(maxVol * Math.sqrt(1/2 * (1 + t))));
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
        playerL.setVolume(newVol);
    } else {
        playerR.setVolume(newVol);
    }
}

var volListener;
function startVolumeListener() {
    volListener = setInterval(function() {
        if (leftPlaying) {
            maxVol = playerL.getVolume();
            document.getElementById("volumeSlider").value = maxVol;
        } else {
            maxVol = playerR.getVolume();
            document.getElementById("volumeSlider").value = maxVol;
        }
    }, 100);
}
function endVolumeListener() {
    clearInterval(volListener);
}

var auto;
var autoInterval = 10000;

function autofadeStart() {
    document.getElementById("autoStartBtn").disabled = true;
    document.getElementById("autoStopBtn").disabled = false;
    auto = setInterval(function() {
        xfade();
    }, autoInterval);
}

function autofadeStop() {
    document.getElementById("autoStartBtn").disabled = false;
    document.getElementById("autoStopBtn").disabled = true;
    clearInterval(auto);
}

// function progressClicked(event) {
//     var rect = document.getElementById("progress-border").getClientRects()[0];
//     console.log(event.clientX - Math.ceil(rect.left));
// }

function testClick() {
    alert(maxVol)
}