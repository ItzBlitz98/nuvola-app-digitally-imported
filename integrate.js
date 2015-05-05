(function(Nuvola) {

    "use strict";

    var player = Nuvola.$object(Nuvola.MediaPlayer);

    var PlaybackState = Nuvola.PlaybackState;
    var PlayerAction = Nuvola.PlayerAction;

    var WebApp = Nuvola.$WebApp();

    WebApp._onInitWebWorker = function(emitter) {
        Nuvola.WebApp._onInitWebWorker.call(this, emitter);

        var state = document.readyState;
        if (state === "interactive" || state === "complete")
            this._onPageReady();
        else
            document.addEventListener("DOMContentLoaded",
                this._onPageReady.bind(this));
    };

    WebApp._onPageReady = function() {
        Nuvola.actions.connect("ActionActivated", this);

        player.setCanPlay(true);
        player.setCanPause(true);
        player.setCanGoPrev(false);
        player.setCanGoNext(false);

        this.startApi();
    };

    WebApp.startApi = function() {

        this.update();

    };


    // Extract data from the web page
    WebApp.update = function() {
        var status,
            artist,
            song,
            album,
            album_art,
            state,
            track;

        //the player on di takes a second to show up so wait for it if its not there
        try {
            status = document.getElementsByClassName('track-name')[0].innerHTML;
        } catch (e) {
            status = "stopped";
        }

        if (status !== "stopped" && status !== "connecting..." && status !== "choose premium for the best audio experience" && status !== "Sponsored Message") {

            state = PlaybackState.PLAYING;

            //try has to be here or when song changes this will throw an error.
            try {
                artist = document.getElementsByClassName('track-name')[0].getAttribute("title");
                artist = artist.split("-")[0].trim();

                song = document.getElementsByClassName('track-name')[0].getAttribute("title");
                song = song.split("-")[1].trim();

                album = document.getElementsByClassName('title')[0].innerText;

                album_art = document.getElementsByClassName('artwork')[1].getElementsByTagName("img")[0].src;
                album_art = album_art.replace("?size=46x46", "");

                track = {
                    title: song,
                    artist: artist,
                    album: album,
                    artLocation: album_art
                };

            } catch (e) {

            }

        } else {

            state = Nuvola.STATE_NONE;
            track = {
                title: null,
                artist: null,
                album: null,
                artLocation: null
            };
        }

        player.setPlaybackState(state);
        player.setTrack(track);


        setTimeout(this.update.bind(this), 500);
    };

    // Handler of playback actions
    WebApp._onActionActivated = function(emitter, name, param) {

        switch (name) {
            case PlayerAction.TOGGLE_PLAY:
                document.getElementsByClassName('controls')[0].getElementsByTagName('a')[0].click();
                break;
            case PlayerAction.PLAY:
                document.getElementsByClassName('controls')[0].getElementsByTagName('a')[0].click();
                break;
            case PlayerAction.PAUSE:
                document.getElementsByClassName('controls')[0].getElementsByTagName('a')[0].click();
                console.log("pause");
                break;
            case PlayerAction.STOP:
                document.getElementsByClassName('controls')[0].getElementsByTagName('a')[0].click();
                //not suported
                break;
            case PlayerAction.PREV_SONG:
                //not supported
                break;
            case PlayerAction.NEXT_SONG:
                //not supported
                break;
            default:
                throw {
                    "message": "Not supported."
                };
        }
    };

    WebApp.start();
})(this);
