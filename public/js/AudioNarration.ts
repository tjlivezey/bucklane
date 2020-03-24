class AudioNarration {
    public static file: HTMLAudioElement;
    public static isPlaying: boolean = false;
    public static isPaused: boolean = false;
    public static isStopped: boolean = true;
    public static timeupdate: (this: AudioNarration) => any;
    public static ended;
    private static $ = window["jQuery"];
    public static secondaryAudio: HTMLAudioElement;
    private static playBackRate: number = 1.0;
    public static duration:number;

    static initialize(audio: string, duration?: number, setDefaultTimeUpdate?: boolean, onendedCallback?: (e: Event) => void) {
        AudioNarration.file = <HTMLAudioElement>document.getElementById(audio);
        AudioNarration.isPlaying = false;
        AudioNarration.isPaused = false;
        AudioNarration.isStopped = true;
        AudioNarration.playBackRate = 1.0;
        AudioNarration.secondaryAudio = null;
        AudioNarration.duration = duration;

        AudioNarration.file.addEventListener('ended', this.onEnded);

        if (onendedCallback) {
            AudioNarration.ended = onendedCallback;
        }
        
        if (setDefaultTimeUpdate && duration) {
            AudioNarration.timeupdate = () => {
                if (AudioNarration.currentTime > AudioNarration.duration) {
                    AudioNarration.pause();
                }
            }
        } else {
            AudioNarration.timeupdate = () => {}
        }
    }

    static onEnded (e) {
        if (AudioNarration.ended) {
            AudioNarration.ended();
        }
    }

    static stop() {
        AudioNarration.file.pause();
        AudioNarration.file = null;
        AudioNarration.isStopped = true;
        AudioNarration.isPlaying = false;
        AudioNarration.isPaused = false;
    }

    static play() {
        AudioNarration.file.play();
        AudioNarration.isStopped = false
        AudioNarration.isPlaying = true;
        AudioNarration.isPaused = false;
    }

    static pause() {
        if (AudioNarration.isStopped == false) {
            AudioNarration.file.pause();
            AudioNarration.isStopped = false
            AudioNarration.isPlaying = false;
            AudioNarration.isPaused = true;
        }
    }

    static destroy() {
        try {
            AudioNarration.file.pause();
            AudioNarration.currentTime = 0;
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
    }

    static get audio() {
        return AudioNarration.file;
    }
    
    static set currentTime(time: number) {
        if (time < 0) {
            AudioNarration.file.currentTime = 0;
        }
        else {
            AudioNarration.file.currentTime = time;
        }
    }

    static get currentTime() {
        return AudioNarration.file.currentTime;
    }

    static set playbackRate(rate: number) {
        if (rate < 0) {
            AudioNarration.file.playbackRate = 0.1;
        }
        else if (rate > 1) {
            AudioNarration.file.playbackRate = 1.0;
        }
        else {
            AudioNarration.file.playbackRate = rate;
        }
    }

    static get playing() {
        return AudioNarration.isPlaying;
    }

    static get paused() {
        return AudioNarration.isPaused;
    }
}