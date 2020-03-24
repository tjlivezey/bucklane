var Loader = /** @class */ (function () {
    function Loader() {
        // Types that the Loader class can handle
        this.audioExtensions = ["mp3", "ogg", "wav", "webm"];
        this.videoExtensions = ["mp4"];
        this.jsonExtensions = ["json"];
    }
    // Accepts an array of resource paths and a callback when finished downloading
    // Can be called like this:
    // loader.load(['../audio/IntroAudio.mp3'], () => {
    // 
    // });
    Loader.prototype.load = function (sources, callback, _scene) {
        var _this = this;
        this.scene = _scene;
        var toLoad = 0;
        var loaded = 0;
        var loadHandler = function () {
            loaded += 1;
            if (toLoad === loaded) {
                toLoad = 0;
                loaded = 0;
                callback(true);
            }
        };
        toLoad = sources.length;
        // Iterate through each source and call relevant handler
        sources.forEach(function (source) {
            var extension = source.split(".").pop();
            if (_this.audioExtensions.indexOf(extension) !== -1) {
                _this.loadSound(source, loadHandler);
            }
            else if (_this.videoExtensions.indexOf(extension) !== -1) {
                _this.loadVideo(source, loadHandler);
            }
            else if (_this.jsonExtensions.indexOf(extension) !== -1) {
                _this.loadJSON(source, loadHandler);
            }
        });
    };
    Loader.prototype.loadVideo = function (source, loadHandler) {
        var title = this._parseTitle(source);
        var video = document.createElement("video");
        video.id = title;
        video.width = 1068;
        video.height = 448;
        video.style.position = 'absolute';
        video.style.top = '-1000px';
        video.style.left = '-1000px';
        var src = document.createElement("source");
        src.setAttribute("src", source);
        src.setAttribute("type", "video/mp4");
        video.appendChild(src);
        document.body.appendChild(video);
        // Add as global reference
        // Wait until enough content has been downloaded to play
        video.addEventListener('canplaythrough', function () {
            if (video.readyState > 0) {
                video.addEventListener('play', VideoAnimation.onplay);
                video.addEventListener('ended', VideoAnimation.onplayended);
                loadHandler();
            }
        }, false);
    };
    Loader.prototype.loadSound = function (source, loadHandler) {
        var title = this._parseTitle(source);
        var audio = document.createElement("audio");
        var src = document.createElement("source");
        src.setAttribute("src", source);
        src.setAttribute("type", "audio/mpeg");
        audio.appendChild(src);
        audio.id = title;
        document.body.appendChild(audio);
        // Wait until enough content has been downloaded to play
        audio.addEventListener('canplaythrough', function () {
            if (audio.readyState > 0) {
                audio.ontimeupdate = function () {
                    AudioNarration.timeupdate();
                };
                loadHandler();
            }
        }, false);
    };
    Loader.prototype.loadJSON = function (source, loadHandler) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", source, true);
        xhr.responseType = "text";
        xhr.onload = function (event) {
            if (xhr.status === 200) {
                var title = _this._parseTitle(source);
                var file = JSON.parse(xhr.responseText);
                file.name = source;
                _this.scene[title] = file;
                //Sim.resources[title] = file;
                loadHandler();
            }
        };
        xhr.send();
    };
    Loader.prototype._parseTitle = function (fileName) {
        var title = fileName.split("/");
        var strTitle = title[title.length - 1];
        // Title used to reference the audio asset
        return strTitle.split(".")[0];
    };
    return Loader;
}());
//# sourceMappingURL=Loader.js.map