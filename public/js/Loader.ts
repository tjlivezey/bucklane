class Loader {
    // Types that the Loader class can handle
    private audioExtensions: Array<string> = ["mp3", "ogg", "wav", "webm"];
    private videoExtensions: Array<string> = ["mp4"];
    private jsonExtensions: Array<string> = ["json"];
    private imageExtensions: Array<string> = ["jpg", "png"];
    private scene: Object;

    // Accepts an array of resource paths and a callback when finished downloading
    // Can be called like this:
    // loader.load(['../audio/IntroAudio.mp3'], () => {
    // 
    // });
    load(sources: Array<string>, callback: Function, _scene: Object) {
        this.scene = _scene;

        let toLoad: number = 0;
        let loaded: number = 0;

        let loadHandler = () => {
            loaded += 1;

            if (toLoad === loaded) {
                toLoad = 0;
                loaded = 0;
                
                callback(true);
            }
        };

        toLoad = sources.length;

        // Iterate through each source and call relevant handler
        sources.forEach(source => {
            let extension = source.split(".").pop();
            if (this.audioExtensions.indexOf(extension) !== -1) {
                this.loadSound(source, loadHandler);
            }
            else if(this.videoExtensions.indexOf(extension) !== -1) {
                this.loadVideo(source, loadHandler);
            }
            else if(this.jsonExtensions.indexOf(extension) !== -1) {
                this.loadJSON(source, loadHandler);
            }
            else if(this.imageExtensions.indexOf(extension) !== -1) {
                this.loadImage(source, loadHandler);
            }
        });
    }

    private loadImage(source: string, loadHandler: Function) {
        let image = new Image();
        image.addEventListener('load', () => {
            loadHandler();
        });

        Sim.resources[source] = image;
        image.src = source;
    }

    private loadVideo(source: string, loadHandler: Function) {
        let title = this._parseTitle(source);
        let video = document.createElement("video");
        video.id = title;
        video.width = 1068;
        video.height = 448;
        video.style.position = 'absolute';
        video.style.top = '-1000px';
        video.style.left = '-1000px';
        //video.style.top = '0';
        //video.style.left = '0';
        let src = document.createElement("source");

        document.body.appendChild(video);
        src.setAttribute("src", source);
        src.setAttribute("type", "video/mp4");
        video.appendChild(src);
        video.play();
        video.volume = 0;

        let videoEnded = () => {
            video.pause();
            video.addEventListener('play', VideoAnimation.onplay);
            video.addEventListener('ended', VideoAnimation.onplayended);
            video.currentTime = 0;
            video.removeEventListener('ended', videoEnded);
            loadHandler();
        };

        video.addEventListener('ended', videoEnded);

        /*
        video.addEventListener('canplaythrough', () => {
            if(video.readyState > 3) {
                
            }
        }, false);
        */
    }

    private loadSound(source: string, loadHandler: Function) {
        let title = this._parseTitle(source);
        let audio = document.createElement("audio");

        let src = document.createElement("source");
        src.setAttribute("src", source);
        src.setAttribute("type", "audio/mpeg");
        audio.appendChild(src);
        audio.id = title;
        document.body.appendChild(audio);

        // Wait until enough content has been downloaded to play
        audio.addEventListener('canplaythrough', () => {
            if(audio.readyState > 0) {
                audio.ontimeupdate = () => {
                    AudioNarration.timeupdate();
                };
                
                loadHandler();
            }
        }, false);
    }

    private loadJSON(source: string, loadHandler: Function) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", source, true);
        xhr.responseType = "text";

        xhr.onload = event => {
            if (xhr.status === 200) {
                let title = this._parseTitle(source);
                let file = JSON.parse(xhr.responseText);
                file.name = source;
                this.scene[title] = file;
                //Sim.resources[title] = file;
                loadHandler();
            }
        };
        
        xhr.send();
    }

    private _parseTitle(fileName: string) {
        let title = fileName.split("/");
        let strTitle = title[title.length - 1];

        // Title used to reference the audio asset
        return strTitle.split(".")[0];
    }
}