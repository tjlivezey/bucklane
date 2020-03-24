var AudioNarration = /** @class */ (function () {
    function AudioNarration() {
    }
    AudioNarration.initialize = function (audio) {
        AudioNarration.file = document.getElementById(audio);
        AudioNarration.isPlaying = false;
        AudioNarration.isPaused = false;
        AudioNarration.isStopped = true;
        AudioNarration.playBackRate = 1.0;
        AudioNarration.secondaryAudio = null;
        AudioNarration.timeupdate = function () { };
    };
    AudioNarration.stop = function () {
        AudioNarration.file.pause();
        AudioNarration.file = null;
        AudioNarration.isStopped = true;
        AudioNarration.isPlaying = false;
        AudioNarration.isPaused = false;
    };
    AudioNarration.play = function () {
        AudioNarration.file.play();
        AudioNarration.isStopped = false;
        AudioNarration.isPlaying = true;
        AudioNarration.isPaused = false;
    };
    AudioNarration.pause = function () {
        if (AudioNarration.isStopped == false) {
            AudioNarration.file.pause();
            AudioNarration.isStopped = false;
            AudioNarration.isPlaying = false;
            AudioNarration.isPaused = true;
        }
    };
    AudioNarration.destroy = function () {
        try {
            AudioNarration.file.pause();
        }
        catch (e) {
        }
        AudioNarration.isPlaying = false;
        AudioNarration.isPaused = false;
        AudioNarration.isStopped = false;
        try {
            AudioNarration.secondaryAudio.pause();
            AudioNarration.secondaryAudio = null;
        }
        catch (e) {
        }
    };
    Object.defineProperty(AudioNarration, "audio", {
        get: function () {
            return AudioNarration.file;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioNarration, "currentTime", {
        get: function () {
            return AudioNarration.file.currentTime;
        },
        set: function (time) {
            if (time < 0) {
                AudioNarration.file.currentTime = 0;
            }
            else {
                AudioNarration.file.currentTime = time;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioNarration, "playbackRate", {
        set: function (rate) {
            if (rate < 0) {
                AudioNarration.file.playbackRate = 0.1;
            }
            else if (rate > 1) {
                AudioNarration.file.playbackRate = 1.0;
            }
            else {
                AudioNarration.file.playbackRate = rate;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioNarration, "playing", {
        get: function () {
            return AudioNarration.isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioNarration, "paused", {
        get: function () {
            return AudioNarration.isPaused;
        },
        enumerable: true,
        configurable: true
    });
    AudioNarration.isPlaying = false;
    AudioNarration.isPaused = false;
    AudioNarration.isStopped = true;
    AudioNarration.$ = window["jQuery"];
    AudioNarration.playBackRate = 1.0;
    return AudioNarration;
}());
//# sourceMappingURL=AudioNarration.js.map