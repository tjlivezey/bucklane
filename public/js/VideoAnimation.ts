class VideoAnimation {
    public static video: HTMLVideoElement;
    private static canvas: HTMLCanvasElement;
    private static context;
    private static interval;
    private static $ = window["jQuery"];
    private static animationFrame;
    public static ended;
    public static fadeIn: boolean = false;
    public static fadeOut: boolean = false;
    public static isPlaying: boolean = false;
    public static isPaused: boolean = false;
    public static isStopped: boolean = false;
    private static _playbackRate: number = 1.0;
    public static isWaiting = false;

    static initialize(video: string, playRate?: number) {
        VideoAnimation.video = <HTMLVideoElement>document.getElementById(video);
        if (VideoAnimation.video == null) {
            throw new Error("Animation File Not Found");
        }
        VideoAnimation.video.volume = 1.0;
        VideoAnimation.canvas = <HTMLCanvasElement><any>document.getElementsByClassName('video-canvas')[0];
        VideoAnimation.context = VideoAnimation.canvas.getContext('2d');
        VideoAnimation.animationFrame = null;
        VideoAnimation.fadeIn = false;
        VideoAnimation.fadeOut = false;
        VideoAnimation.isPlaying  = false;
        VideoAnimation.isPaused = false;
        VideoAnimation.isStopped = false;
        VideoAnimation.ended = () => {};
        VideoAnimation.video.currentTime = 0;
        VideoAnimation._playbackRate = playRate ? playRate : 1.0;
    }

    static stop() {
        VideoAnimation.isStopped = true;
        VideoAnimation.isPaused = false;
        VideoAnimation.isPlaying = false;
        VideoAnimation.video.pause();
    }

    static play() {
        let elem = VideoAnimation.$(".content");
        let offset = elem.offset();
        let cw = Math.floor(elem.width());
        let ch = Math.floor(elem.height());

        VideoAnimation.canvas.width = cw;
        VideoAnimation.canvas.height = ch;

        VideoAnimation.canvas.style.top = elem.css('top');
        VideoAnimation.canvas.style.left = elem.css('left');
        VideoAnimation.canvas.style.bottom = elem.css('bottom');
        VideoAnimation.canvas.style.right = elem.css('right');
        VideoAnimation.canvas.style.display = 'block';

        VideoAnimation.context.drawImage(VideoAnimation.video, 0, 0, cw, ch)
        
        if (VideoAnimation.fadeIn == true) {
            VideoAnimation.canvas.style.opacity = "0";
            VideoAnimation.$(VideoAnimation.canvas).fadeIn(1000, "linear");
        }
        
        VideoAnimation.isPlaying = true;
        VideoAnimation.video.play();
        VideoAnimation.video.playbackRate = VideoAnimation._playbackRate;
    }

    static onplayended() {
        if (VideoAnimation.fadeOut === true) {
            VideoAnimation.$(VideoAnimation.canvas).fadeOut(1000, "linear", () => {
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
    }

    static onplay() {
        
        VideoAnimation.video.style.display = 'block';
        VideoAnimation.isPlaying = true;
        VideoAnimation.isPaused = false;
        let cw = VideoAnimation.canvas.width;
        let ch = VideoAnimation.canvas.height;

        function step(timestamp) {
            VideoAnimation.context.drawImage(VideoAnimation.video, 0, 0, cw, ch)
            if (VideoAnimation.isPlaying && !VideoAnimation.isPaused) {
                VideoAnimation.animationFrame = window.requestAnimationFrame(step);
            }
        }

        VideoAnimation.animationFrame = window.requestAnimationFrame(step);
    }

    static pause() {
        if (VideoAnimation.isPlaying) {
            VideoAnimation.video.pause();
            VideoAnimation.isPaused = true;
        }
    }

    static resume() {
        if (VideoAnimation.isPlaying) {
            VideoAnimation.video.play();
            VideoAnimation.video.playbackRate = VideoAnimation._playbackRate;
            VideoAnimation.isPlaying = true;
            VideoAnimation.isPaused = false;
        }
    }

    static destroy() {
        try {
            VideoAnimation.video.pause();
            VideoAnimation.video.currentTime = 0;
        }
        catch (e) {

        }

        window.cancelAnimationFrame(VideoAnimation.animationFrame);
        VideoAnimation.animationFrame = null;
        let canvas = document.getElementsByClassName('video-canvas')[0];
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
    }

    static set currentTime(time: number) {
        if (time < 0) {
            VideoAnimation.video.currentTime = 0;
        }
        else if (time > 1) {
            VideoAnimation.video.currentTime = 1.0;
        }
        else {
            VideoAnimation.video.currentTime = time;
        }
    }

    static set volume(level: number) {
        if (level < 0) {
            VideoAnimation.video.volume = 0;
        }
        else if (level > 1) {
            VideoAnimation.video.volume = 1.0;
        }
        else {
            VideoAnimation.video.volume = level;
        }
    }

    static set playbackRate(rate: number) {
        VideoAnimation._playbackRate = rate;
    }

    static get playbackRate() {
        return VideoAnimation._playbackRate;
    }

    static get playing() {
        return VideoAnimation.isPlaying;
    }

    static get paused() {
        return VideoAnimation.isPaused;
    }
}