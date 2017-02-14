var videoLid;
var videoRid;

var firstClick = true;
var playing = false;

var toggle = true;

var fadetime = 1000;
var maxVol;
var t = -1.0;

var loading = false;

function buttonClick() {
    if (firstClick) {
        //window.location.assign(window.location.href + "?" + videoLid + "?" + videoRid);
        document.getElementById("leftbutton").style.display = "none";
        document.getElementById("rightbutton").style.display = "none";
        document.getElementById("mainbtn").textContent = "Loading... Please Wait";
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        firstClick = false;
    } else if (!loadL && !loadR) {
        if (playing) {
            document.getElementById("mainbtn").textContent = "Play";
            playerL.pauseVideo();
            playerR.pauseVideo();
            playing = false;
        } else {
            document.getElementById("mainbtn").textContent = "Pause";
            playerL.playVideo();
            playerR.playVideo();
            playing = true;
        }
    }
}

function alight() {
    videoLid = 'Xb3UUVVLl8E';
    videoRid = 'xvOy3sjQUe8';
    document.getElementById("leftbutton").textContent = "Songs set to Alight";
    document.getElementById("leftbutton").disabled = true;
    document.getElementById("rightbutton").textContent = "Dusk Falls";
    document.getElementById("rightbutton").disabled = false;
    document.getElementById("mainbtn").disabled = false;
}

function duskfalls() {
    videoLid = 'BdrtNio7t0Y';
    videoRid = 'Bx_rGx2MKvY';
    document.getElementById("rightbutton").textContent = "Songs set to Dusk Falls";
    document.getElementById("rightbutton").disabled = true;
    document.getElementById("leftbutton").textContent = "Alight";
    document.getElementById("leftbutton").disabled = false;
    document.getElementById("mainbtn").disabled = false;
}

var playerL;
var playerR;
function onYouTubeIframeAPIReady() {
    playerL = new YT.Player('playerL', {
        height: '390',
        width: '640',
        videoId: videoLid,
        playerVars: {
            "playlist": videoLid,
            "loop": 1
        },
        events: {
            'onReady': onPlayerLReady,
            'onStateChange': onPlayerLStateChange
        }
    });
    playerR = new YT.Player('playerR', {
        height: '390',
        width: '640',
        videoId: videoRid,
        playerVars: {
            "playlist": videoRid,
            "loop": 1
        },
        events: {
            'onReady': onPlayerRReady,
            'onStateChange': onPlayerRStateChange
        }
    });
}

var loadL = false;
var loadR = false;
function onPlayerLReady(event) {
    loadL = true;
    maxVol = playerL.getVolume();
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
        if (loadL) {
            playerL.pauseVideo();
            playerL.seekTo(0);
            playerL.unMute();
            document.getElementById("playerL").style.visibility = "visible";
            loadL = false;
            bothReady();
        } else {
            document.getElementById("mainbtn").textContent = "Pause";
            playing = true;
            playerR.playVideo();
        }
    } else if (event.data == YT.PlayerState.PAUSED) {
        if (!loadL && !loadR) {
            document.getElementById("mainbtn").textContent = "Play";
            playing = false;
            playerR.pauseVideo();
        }
    }
    // } else if (event.data == YT.PlayerState.BUFFERING) {
    //     if (!loadL) {
    //         playerR.pauseVideo();
    //     }
    // } else if (event.data == YT.PlayerState.CUED ) {
    //     if(!loadL)
    //         playerR.pauseVideo();
    // } else if (event.data == YT.PlayerState.ENDED ) {
    //     playerR.stopVideo();
    // }
}

function onPlayerRStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        if (loadR) {
            playerR.pauseVideo();
            playerR.seekTo(0);
            playerR.unMute();
            playerR.setVolume(0);
            document.getElementById("playerR").style.visibility = "visible";
            loadR = false;
            bothReady();
        } else {
            document.getElementById("mainbtn").textContent = "Pause";
            playing = true;
            playerL.playVideo();
        }
    } else if (event.data == YT.PlayerState.PAUSED) {
        if (!loadR && !loadL) {
            document.getElementById("mainbtn").textContent = "Play";
            playing = false;
            playerL.pauseVideo();
        }
    }
    // } else if (event.data == YT.PlayerState.BUFFERING) {
    //     if (!loadR) {
    //         playerL.pauseVideo();
    //     }
    // } else if (event.data == YT.PlayerState.CUED ) {
    //     if(!loadR)
    //         playerL.pauseVideo();
    // } else if (event.data == YT.PlayerState.ENDED ) {
    //     playerL.stopVideo();
    // }
}

function bothReady() {
    if (!loadL && !loadR) {
        document.getElementById("mainbtn").textContent = "Play";
        document.getElementById("xfade").style.visibility = "visible";
        document.getElementById("autoStartBtn").style.visibility = "visible";
        document.getElementById("autoStopBtn").style.visibility = "visible";
        document.getElementById("volumeSlider").style.visibility = "visible";
    }
}

function xfade() {
    if (!loading) {
        loading = true;
        if (toggle) {
            var changeT = 2/(fadetime/50);
            var interval = setInterval(function() {
                if (t >= 1) {
                    clearInterval(interval);
                    loading = false;
                } else {
                    t += changeT;
                    playerL.setVolume(maxVol * Math.sqrt(1/2 * (1 - t)));
                    playerR.setVolume(maxVol * Math.sqrt(1/2 * (1 + t)));
                }
            }, 50);
            toggle = false;
        } else {
            var changeT = 2/(fadetime/50);
            var interval = setInterval(function() {
                if (t <= -1) {
                    clearInterval(interval);
                    loading = false;
                } else {
                    t -= changeT;
                    playerL.setVolume(maxVol * Math.sqrt(1/2 * (1 - t)));
                    playerR.setVolume(maxVol * Math.sqrt(1/2 * (1 + t)));
                }
            }, 50);
            toggle = true;
        }
    }
}

function changeVolume(newVol) {
    maxVol = newVol;
    if (toggle) {
        playerL.setVolume(newVol);
    } else {
        playerR.setVolume(newVol);
    }
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
