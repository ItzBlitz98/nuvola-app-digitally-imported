(function(Nuvola) {

  "use strict";

  // Create media player component
  var player = Nuvola.$object(Nuvola.MediaPlayer);

  // Handy aliases
  var PlaybackState = Nuvola.PlaybackState;
  var PlayerAction = Nuvola.PlayerAction;

  // Create new WebApp prototype
  var WebApp = Nuvola.$WebApp();

  // Initialization routines
  WebApp._onInitWebWorker = function(emitter) {
    Nuvola.WebApp._onInitWebWorker.call(this, emitter);

    var state = document.readyState;
    if (state === "interactive" || state === "complete")
      this._onPageReady();
    else
      document.addEventListener("DOMContentLoaded",
        this._onPageReady.bind(this));
  };

  // Page is ready for magic
  WebApp._onPageReady = function() {
    // Connect handler for signal ActionActivated
    Nuvola.actions.connect("ActionActivated", this);

    // Set default action states
    player.setCanPlay(true);
    player.setCanPause(true);
    //player.setCanStop(false);
    player.setCanGoPrev(false);
    player.setCanGoNext(false);

    // Configure API hooks
    this.startApi();
  };

  // Loads the KEXP flowplayer API
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

    try{
      status = document.getElementsByClassName('track-name')[0].innerHTML;
    } catch (e){
  		status = "stopped";
  	}

    if (status !== "stopped" && status !== "connecting...")	{

      state = PlaybackState.PLAYING;

      try{
        artist = document.getElementsByClassName('track-name')[0].getAttribute("title");
            artist = artist.split("-")[0].trim();
            //console.log(artist);

        song = document.getElementsByClassName('track-name')[0].getAttribute("title");
            song = song.split("-")[1].trim();
            //console.log(song);

        album = document.getElementsByClassName('title')[0].innerText;

        album_art = document.getElementsByClassName('artwork')[1].getElementsByTagName("img")[0].src;

      } catch (e){
        artist = null;
        song = null;
        album = null;
        album_art = null;
      }

        track = {
          title: song,
          artist: artist,
          album: album,
          artLocation: album_art
        };

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
