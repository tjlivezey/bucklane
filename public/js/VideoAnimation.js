var VideoAnimation = /** @class */ (function () {
    function VideoAnimation() {
    }
    VideoAnimation.initialize = function (video, playRate) {
        VideoAnimation.video = document.getElementById(video);
        VideoAnimation.canvas = document.getElementsByClassName('video-canvas')[0];
        VideoAnimation.context = VideoAnimation.canvas.getContext('2d');
        VideoAnimation.animationFrame = null;
        VideoAnimation.fadeIn = false;
        VideoAnimation.fadeOut = false;
        VideoAnimation.isPlaying = false;
        VideoAnimation.isPaused = false;
        VideoAnimation.isStopped = false;
        VideoAnimation.ended = function () { };
        VideoAnimation.currentTime = 0;
        if (playRate) {
            VideoAnimation._playbackRate = playRate;
        }
        else {
            VideoAnimation._playbackRate = 1.0;
        }
    };
    VideoAnimation.stop = function () {
        VideoAnimation.isStopped = true;
        VideoAnimation.isPaused = false;
        VideoAnimation.isPlaying = false;
        VideoAnimation.video.pause();
    };
    VideoAnimation.play = function () {
        var elem = VideoAnimation.$(".content");
        var offset = elem.offset();
        var cw = Math.floor(elem.width());
        var ch = Math.floor(elem.height());
        VideoAnimation.canvas.width = cw;
        VideoAnimation.canvas.height = ch;
        VideoAnimation.canvas.style.top = elem.css('top');
        VideoAnimation.canvas.style.left = elem.css('left');
        VideoAnimation.canvas.style.bottom = elem.css('bottom');
        VideoAnimation.canvas.style.right = elem.css('right');
        VideoAnimation.canvas.style.display = 'block';
        VideoAnimation.context.drawImage(VideoAnimation.video, 0, 0, cw, ch);
        if (VideoAnimation.fadeIn == true) {
            VideoAnimation.canvas.style.opacity = "0";
            VideoAnimation.$(VideoAnimation.canvas).fadeIn(1000, "linear");
        }
        VideoAnimation.isPlaying = true;
        VideoAnimation.video.play();
        VideoAnimation.video.playbackRate = VideoAnimation._playbackRate;
    };
    VideoAnimation.onplayended = function () {
        if (VideoAnimation.fadeOut === true) {
            VideoAnimation.$(VideoAnimation.canvas).fadeOut(1000, "linear", function () {
                try {
                    VideoAnimation.destroy();
                    VideoAnimation.ended();
                }
                catch (e) {
                }
            });
        }
        else {
            try {
                VideoAnimation.destroy();
                VideoAnimation.ended();
            }
            catch (e) {
            }
        }
    };
    VideoAnimation.onplay = function () {
        VideoAnimation.video.style.display = 'block';
        VideoAnimation.isPlaying = true;
        VideoAnimation.isPaused = false;
        var cw = VideoAnimation.canvas.width;
        var ch = VideoAnimation.canvas.height;
        function step(timestamp) {
            VideoAnimation.context.drawImage(VideoAnimation.video, 0, 0, cw, ch);
            if (VideoAnimation.isPlaying && !VideoAnimation.isPaused) {
                VideoAnimation.animationFrame = window.requestAnimationFrame(step);
            }
        }
        VideoAnimation.animationFrame = window.requestAnimationFrame(step);
    };
    VideoAnimation.pause = function () {
        if (VideoAnimation.isPlaying) {
            VideoAnimation.video.pause();
            VideoAnimation.isPaused = true;
        }
    };
    VideoAnimation.resume = function () {
        if (VideoAnimation.isPlaying) {
            VideoAnimation.video.play();
            VideoAnimation.video.playbackRate = VideoAnimation._playbackRate;
            VideoAnimation.isPlaying = true;
            VideoAnimation.isPaused = false;
        }
    };
    VideoAnimation.destroy = function () {
        try {
            VideoAnimation.video.pause();
            VideoAnimation.video.currentTime = 0;
        }
        catch (e) {
        }
        window.cancelAnimationFrame(VideoAnimation.animationFrame);
        VideoAnimation.animationFrame = null;
        var canvas = document.getElementsByClassName('video-canvas')[0];
        VideoAnimation.$(VideoAnimation.canvas).stop();
        canvas['style'].opacity = 1;
        canvas['style'].display = 'none';
        try {
            VideoAnimation.video.pause();
            VideoAnimation.video.playbackRate = VideoAnimation._playbackRate;
            VideoAnimation.video.currentTime = 0;
        }
        catch (e) {
        }
    };
    Object.defineProperty(VideoAnimation, "currentTime", {
        set: function (time) {
            if (time < 0) {
                VideoAnimation.video.currentTime = 0;
            }
            else if (time > 1) {
                VideoAnimation.video.currentTime = 1.0;
            }
            else {
                VideoAnimation.video.currentTime = time;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VideoAnimation, "volume", {
        set: function (level) {
            if (level < 0) {
                VideoAnimation.video.volume = 0;
            }
            else if (level > 1) {
                VideoAnimation.video.volume = 1.0;
            }
            else {
                VideoAnimation.video.volume = level;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VideoAnimation, "playbackRate", {
        get: function () {
            return VideoAnimation._playbackRate;
        },
        set: function (rate) {
            VideoAnimation._playbackRate = rate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VideoAnimation, "playing", {
        get: function () {
            return VideoAnimation.isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VideoAnimation, "paused", {
        get: function () {
            return VideoAnimation.isPaused;
        },
        enumerable: true,
        configurable: true
    });
    VideoAnimation.$ = window["jQuery"];
    VideoAnimation.fadeIn = false;
    VideoAnimation.fadeOut = false;
    VideoAnimation.isPlaying = false;
    VideoAnimation.isPaused = false;
    VideoAnimation.isStopped = false;
    VideoAnimation._playbackRate = 1.0;
    return VideoAnimation;
}());
//# sourceMappingURL=VideoAnimation.js.map