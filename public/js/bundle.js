var VideoAnimation = /** @class */ (function () {
    function VideoAnimation() {
    }
    VideoAnimation.initialize = function (video, playRate) {
        VideoAnimation.video = document.getElementById(video);
        if (VideoAnimation.video == null) {
            throw new Error("Animation File Not Found");
        }
        VideoAnimation.video.volume = 1.0;
        VideoAnimation.canvas = document.getElementsByClassName('video-canvas')[0];
        VideoAnimation.context = VideoAnimation.canvas.getContext('2d');
        VideoAnimation.animationFrame = null;
        VideoAnimation.fadeIn = false;
        VideoAnimation.fadeOut = false;
        VideoAnimation.isPlaying = false;
        VideoAnimation.isPaused = false;
        VideoAnimation.isStopped = false;
        VideoAnimation.ended = function () { };
        VideoAnimation.video.currentTime = 0;
        VideoAnimation._playbackRate = playRate ? playRate : 1.0;
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
    VideoAnimation.isWaiting = false;
    return VideoAnimation;
}());
var AudioNarration = /** @class */ (function () {
    function AudioNarration() {
    }
    AudioNarration.initialize = function (audio, duration, setDefaultTimeUpdate, onendedCallback) {
        AudioNarration.file = document.getElementById(audio);
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
            AudioNarration.timeupdate = function () {
                if (AudioNarration.currentTime > AudioNarration.duration) {
                    AudioNarration.pause();
                }
            };
        }
        else {
            AudioNarration.timeupdate = function () { };
        }
    };
    AudioNarration.onEnded = function (e) {
        if (AudioNarration.ended) {
            AudioNarration.ended();
        }
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
var Loader = /** @class */ (function () {
    function Loader() {
        // Types that the Loader class can handle
        this.audioExtensions = ["mp3", "ogg", "wav", "webm"];
        this.videoExtensions = ["mp4"];
        this.jsonExtensions = ["json"];
        this.imageExtensions = ["jpg", "png"];
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
            else if (_this.imageExtensions.indexOf(extension) !== -1) {
                _this.loadImage(source, loadHandler);
            }
        });
    };
    Loader.prototype.loadImage = function (source, loadHandler) {
        var image = new Image();
        image.addEventListener('load', function () {
            loadHandler();
        });
        Sim.resources[source] = image;
        image.src = source;
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
        //video.style.top = '0';
        //video.style.left = '0';
        var src = document.createElement("source");
        document.body.appendChild(video);
        src.setAttribute("src", source);
        src.setAttribute("type", "video/mp4");
        video.appendChild(src);
        video.play();
        video.volume = 0;
        var videoEnded = function () {
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
var KnowledgeQuestion = /** @class */ (function () {
    function KnowledgeQuestion() {
        var _this = this;
        this.attempts = 0;
        var button = document.createElement('button');
        button.className = 'btn .btn-primary';
        button.id = 'checkAnswer';
        button.style.background = 'rgb(0, 105, 217)';
        button.type = 'button';
        button.addEventListener('click', function () {
            if (window['$']('#checkAnswer', parent.document).html() == 'Close') {
                if (Sim.hasCompleted(Sim.currentScene)) {
                    _this.hide();
                }
                else {
                    Sim.completedKnowledgeChecks.push(Sim.currentScene);
                    _this.hide();
                    setTimeout(function () {
                        Sim.removeResources();
                        Sim.next();
                    }, 500);
                }
                return true;
            }
            var selectedAnswer = _this.getValueFromRadioButton('answers');
            window['$']('.answerFeedback', parent.document).css('background-image', '');
            if (_this.getValueFromRadioButton('answers') == "") {
                window['$']('.answerFeedback', parent.document).css('background-image', "url('../public/images/red_x.png')");
                return true;
            }
            if (_this.checkAnswer(selectedAnswer)) {
                window['$']('.answerFeedback', parent.document).css('background-image', "url('../public/images/green_check.png')");
                _this.disableAnswers();
                Sim.game.scene.getScene(Sim.currentScene)['correctFeedback'](function () {
                    window['$']('#checkAnswer', parent.document).html('Close');
                    window['$']('#checkAnswer', parent.document).css('background', '#d9534f');
                });
            }
            else {
                window['$']('.answerFeedback', parent.document).css('background-image', "url('../public/images/red_x.png')");
                Sim.game.scene.getScene(Sim.currentScene)['incorrectFeedback']();
            }
        });
        window['$']('#checkAnswer', parent.document).replaceWith(button);
        //parent.document.getElementById('challenge').replaceChild(button, parent.document.getElementById('checkAnswer'));
    }
    KnowledgeQuestion.prototype.getValueFromRadioButton = function (name) {
        //Get all elements with the name
        var buttons = parent.document.getElementsByName(name);
        for (var i = 0; i < buttons.length; i++) {
            //Check if button is checked
            var button = buttons[i];
            if (button['checked']) {
                //Return value
                return button['value'];
            }
        }
        //No radio button is selected. 
        return "";
    };
    KnowledgeQuestion.prototype.disableAnswers = function () {
        var answers = parent.document.forms[0].answers;
        for (var i = 0; i < answers.length; i++) {
            answers[i].setAttribute('disabled', 'disabled');
        }
    };
    KnowledgeQuestion.prototype.enableAnswers = function () {
        var answers = parent.document.forms[0].answers;
        for (var i = 0; i < answers.length; i++) {
            answers[i].removeAttribute('disabled');
        }
    };
    KnowledgeQuestion.prototype.checkAnswer = function (selectedAnswer) {
        var correct = false;
        if (selectedAnswer == this.correctAnswer) {
            correct = true;
        }
        this.attempts++;
        return correct;
    };
    KnowledgeQuestion.prototype.show = function () {
        window['$']('#resetAnswer', parent.document).css('visibility', 'hidden');
        window['$']('#challenge .modal-content', parent.document).css('width', 'auto');
        window['$']('#frmQuestions', parent.document).remove();
        window['$']('.answerFeedback', parent.document).css('background-image', '');
        window['$']('#checkAnswer', parent.document).html('Submit');
        window['$']('#checkAnswer', parent.document).css('background', '#0069d9');
        //this.enableAnswers();
        parent.document.querySelector('.question').innerHTML = this.question;
        var answers = parent.document.querySelector('.answers');
        var charCode = 65;
        var form = parent.document.createElement('form');
        form.setAttribute('id', 'frmQuestions');
        for (var i = 0; i < this.answers.length; i++) {
            var span = parent.document.createElement('span');
            span.className = 'question';
            var option = parent.document.createElement('input');
            option.type = 'radio';
            option.id = i;
            option.name = 'answers';
            option.value = i;
            var label = parent.document.createElement('label');
            label.setAttribute('for', i);
            label.innerText = ' ' + this.answers[i];
            span.appendChild(option);
            span.appendChild(label);
            form.appendChild(span);
            option.addEventListener('click', function (evt) {
                try {
                    evt.stopPropagation();
                    parent.document.querySelector('.answerFeedback')['style'].backgroundImage = '';
                }
                catch (e) {
                }
            });
            charCode++;
        }
        answers.appendChild(form);
        if (Sim.hasCompleted(Sim.currentScene)) {
            this.disableAnswers();
            window['$']('#challenge', parent.document).modal({
                backdrop: true,
                keyboard: true
            });
            window['$']('input:radio[name=answers]', parent.document)[this.correctAnswer].checked = true;
            window['$']('input:radio[name=answers]', parent.document).attr('disabled', 'disabled');
            window['$']('.answerFeedback', parent.document).css('background-image', "url('../public/images/green_check.png')");
            window['$']('#checkAnswer', parent.document).css('background', '#d9534f');
            window['$']('#checkAnswer', parent.document).html('Close');
            window['$']('#challenge', parent.document).modal("show");
            window['$']('.close', parent.document).show();
        }
        else {
            window['$']('#challenge', parent.document).modal({
                backdrop: 'static',
                keyboard: false
            });
            window['$']('#checkAnswer', parent.document).html('Submit');
            window['$']('#challenge', parent.document).modal("show");
            window['$']('.close', parent.document).hide();
        }
    };
    KnowledgeQuestion.prototype.hide = function () {
        window['$']('#challenge', parent.document).modal("hide");
        window['$']('.close', parent.document).show();
    };
    return KnowledgeQuestion;
}());
var SideBar = /** @class */ (function () {
    function SideBar(elem, lessonData) {
        this.$ = window["jQuery"];
        this._lessons = lessonData;
        this._element = elem;
        this._render();
    }
    SideBar.prototype.html = function (value) {
        if (!value) {
            return this._element.innerHTML;
        }
        else {
            this._element.innerHTML = value;
        }
    };
    SideBar.prototype._render = function () {
        var _this = this;
        var html = "";
        var span = null;
        this._lessons.forEach(function (lesson) {
            span = document.createElement('span');
            span.className = 'menu-item';
            span.innerHTML = lesson['title'];
            span.addEventListener('click', function (evt) {
                document.querySelector('.output').innerHTML = '';
                document.querySelector('.mask')['style'].display = 'block';
                var iframe = document.querySelector('#contentFrame');
                var start = null;
                switch (evt.target['innerHTML']) {
                    case 'Introduction to the Power zzSystemzzz':
                        start = 'IntroPowerSystem';
                        break;
                    case 'Normal System Operation':
                        start = 'FullUtilityIntro';
                        break;
                    case '50/60 Hz Single Utility Failure':
                        start = 'SingleUtililtyFailureIntro';
                        break;
                    case '50/60 Hz Dual Utility Failure':
                        start = 'DualUtilityFailureIntro';
                        break;
                    case 'A Side 400 Hz Failure':
                        start = 'IntroASideFailure';
                        break;
                    case 'Chilled Water Normal Systems Operation':
                        start = 'WaterChillerIntro';
                        break;
                    case 'Single System Failure of the Chilled Water System':
                        start = 'SingleSystemFailureIntro';
                        break;
                    case 'Failure of a Chilled Water Return Pump':
                        start = 'FailureChilledWaterPumpIntro';
                        break;
                    case 'Single Failure of Hot Water Pump':
                        start = 'SingleFailureHotWaterPumpIntro';
                        break;
                }
                document.querySelector('#contentFrame')['src'] = 'content.html?lesson=' + start;
                var pauseButton = document.querySelectorAll('.action')[1];
                pauseButton.className = 'action pause';
                pauseButton.setAttribute('title', 'Pause');
                document.querySelector('.forward').removeAttribute('disabled');
                document.querySelector('.highlight')['style'].display = 'none';
                _this.$(".menu-item", document).css("background-color", "transparent");
                evt.target['style'].backgroundColor = "#435058";
                document.querySelector('.lesson-title').innerHTML = evt.target['innerHTML'];
            });
            _this._element.appendChild(span);
        });
    };
    return SideBar;
}());
/// <reference path="../../typings/phaser.d.ts" />
/// <reference path="./Loader.ts" />
/// <reference path="./SideBar.ts" />
/// <reference path="./VideoAnimation.ts" />
var Sim = /** @class */ (function () {
    function Sim() {
    }
    /*
    static initialize() {
        let loader = new Loader();

        loader.load(['/public/data/data.json', '/public/data/glossary.json'], () => {
            Sim.loadGlossary(Sim['glossary'].glossary);

            parent.document.querySelector('.sim-title').innerHTML = Sim['data']['title'];
            
            let sidebar = new SideBar(parent.document.querySelector(".sidebar"), Sim['data']['lessons']);
            
            Sim.loader.style.visibility = 'hidden';
        }, Sim);
    }
    */
    Sim.replay = function () {
        Sim.paused = false;
        VideoAnimation.ended = function () { };
        Sim.removeResources();
        Sim.game.scene.stop(Sim.currentScene);
        Sim.game.scene.start(Sim.currentScene);
        parent.document.querySelectorAll('.action')[1].className = 'action pause';
    };
    Sim.pause = function () {
        if (Sim.currentScene == "") {
            return;
        }
        var pauseButton = parent.document.querySelectorAll('.action')[1];
        if (!Sim.paused) {
            Sim.game.scene.pause(Sim.currentScene);
            Sim.paused = true;
            pauseButton.className = 'action play';
            pauseButton.setAttribute('title', 'Play');
        }
        else {
            Sim.game.scene.resume(Sim.currentScene);
            Sim.paused = false;
            pauseButton.className = 'action pause';
            pauseButton.setAttribute('title', 'Pause');
        }
    };
    Sim.previous = function () {
        parent.document.querySelector('.forward').removeAttribute('disabled');
        if (Sim._currentScene == "") {
            return;
        }
        if (Sim._currentIndex > Sim.threshHold.start) {
            VideoAnimation.ended = function () { };
            parent.document.querySelector('.highlight')['style'].display = 'none';
            var _this = this;
            this.$('.action', parent.document).attr('disabled', 'disabled');
            var pauseButton = parent.document.querySelectorAll('.action')[1];
            Sim.paused = false;
            pauseButton.className = 'action pause';
            pauseButton.setAttribute('title', 'Pause');
            Sim.removeResources();
            var currentScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim._currentIndex = Sim._currentIndex - 1;
            var nextScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim.game.scene.stop(Sim.currentScene);
            Sim.game.scene.start(nextScene.scene.key);
            Sim.currentScene = nextScene.scene.key;
            pauseButton.className = 'action pause';
            setTimeout(function () {
                Sim.enableNavigation(false);
            }, 1250);
        }
    };
    Sim.enableNavigation = function (action) {
        var actions = parent.document.querySelectorAll('.action');
        if (action === true) {
            for (var i = 0; i < actions.length; i++) {
                actions[i]['disabled'] = true;
            }
        }
        else {
            for (var i = 0; i < actions.length; i++) {
                actions[i]['disabled'] = false;
            }
        }
    };
    Sim.next = function () {
        if (Sim._currentScene == "") {
            return;
        }
        if (Sim._currentIndex < Sim.threshHold.end) {
            VideoAnimation.ended = function () { };
            parent.document.querySelector('.highlight')['style'].display = 'none';
            var _this = this;
            Sim.enableNavigation(true);
            var pauseButton = parent.document.querySelectorAll('.action')[1];
            Sim.paused = false;
            pauseButton.className = 'action pause';
            pauseButton.setAttribute('title', 'Pause');
            Sim.removeResources();
            var currentScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim._currentIndex = Sim._currentIndex + 1;
            var nextScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim.game.scene.stop(Sim.currentScene);
            Sim.game.scene.start(nextScene.scene.key);
            Sim.currentScene = nextScene.scene.key;
            pauseButton.className = 'action pause';
            setTimeout(function () {
                Sim.enableNavigation(false);
            }, 1250);
        }
        else if (Sim._currentIndex == Sim.threshHold.end) {
            return true;
        }
        else {
            Sim.removeResources();
            Sim.game.scene.stop(Sim.currentScene);
            Sim.currentScene = "";
        }
    };
    Sim.show = function (scn) {
        Sim.game.scene.start(scn);
    };
    /*
    static loadGlossary(glossary: Array<string>) {
        let glossaryElem = parent.document.querySelector("#glossary .modal-body");
        let div = null;
        let span = null;

        glossary.forEach((item) => {
            div = document.createElement('div');

            span = document.createElement('span');
            span.className = 'acronym';
            span.innerHTML = item['acronym'];

            div.appendChild(span);

            span = document.createElement('span');
            span.className = 'term';
            span.innerHTML = item['term'];

            div.appendChild(span);

            glossaryElem.appendChild(div);
        });
    }
    */
    Sim.removeResources = function () {
        AudioNarration.destroy();
        VideoAnimation.destroy();
        VideoAnimation.onplayended = null;
    };
    Sim.openReference = function (elem) {
        var doc = '../public/references/' + elem.innerHTML + '.' + elem.getAttribute('data-type');
        if (elem.className == "reference abb") {
            doc = '../public/references/ABB 5060 Hertz Converter Operation and Maintenance Manual.pdf';
            if (Sim._currentScene == 'LocateManual') {
                Sim._references[Sim._currentScene] = true;
            }
            else if (Sim._currentScene == 'LocateABBManual') {
                Sim._references[Sim._currentScene] = true;
            }
        }
        else if (elem.className == "reference hobart") {
            if (Sim._currentScene == 'LocateHobartManual') {
                Sim._references[Sim._currentScene] = true;
            }
        }
        var win = window.open(doc, '_blank');
        window.focus();
    };
    Object.defineProperty(Sim, "output", {
        get: function () {
            return Sim._output;
        },
        set: function (newElem) {
            Sim._output = newElem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "loader", {
        get: function () {
            return Sim._loader;
        },
        set: function (newElem) {
            Sim._loader = newElem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "game", {
        get: function () {
            return Sim._game;
        },
        set: function (newGame) {
            Sim._game = newGame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "currentScene", {
        get: function () {
            return Sim._currentScene;
        },
        set: function (newScene) {
            Sim.setBookMark(newScene);
            Sim._currentIndex = Sim.game.scene.getIndex(newScene);
            Sim._currentScene = newScene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "currentFault", {
        get: function () {
            return Sim._currentFault;
        },
        set: function (faultNum) {
            Sim._currentFault = faultNum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "paused", {
        get: function () {
            return Sim._isPaused;
        },
        set: function (newBool) {
            Sim._isPaused = newBool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "playing", {
        get: function () {
            return Sim._isPlaying;
        },
        set: function (newBool) {
            Sim._isPlaying = newBool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "referenceDisplayed", {
        get: function () {
            return Sim._references[Sim.currentScene] || false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "threshHold", {
        get: function () {
            return Sim._threshHold;
        },
        set: function (obj) {
            Sim._threshHold = obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "completedKnowledgeChecks", {
        get: function () {
            return Sim._completedKnowledgeChecks;
        },
        enumerable: true,
        configurable: true
    });
    Sim.showFeedBack = function (correct, obj) {
        var x = (obj.downX + document.querySelector('.content')['offsetLeft']) + 'px';
        var y = (obj.downY) + 'px';
        var $div = this.$('<div>');
        $div.css('width', '40px')
            .css('height', '40px')
            .css('position', 'absolute')
            .css('top', y)
            .css('left', x)
            .css('background-size', 'contain');
        $div.css('background-image', (correct ? "url('../public/images/green_check.png')" : "url('../public/images/red_x.png')"));
        this.$('body').append($div);
        $div.fadeOut(2000, function () {
            $div.remove();
        });
    };
    Sim.hasCompleted = function (knowledgeCheck) {
        var completed = false;
        for (var i = 0; i < Sim.completedKnowledgeChecks.length; i++) {
            if (Sim.completedKnowledgeChecks[i] == knowledgeCheck) {
                completed = true;
                break;
            }
        }
        return completed;
    };
    Sim.setBookMark = function (lesson) {
        parent.parent["doLMSSetValue"]("cmi.location", lesson);
    };
    Sim.setComplete = function () {
        if (parent['App'].isLMS == true) {
            parent.parent['doLMSSetValue']("cmi.success_status", "passed");
            parent.parent['doLMSSetValue']("cmi.completion_status", "completed");
            parent.parent['doLMSSetValue']("cmi.location", "");
            parent.parent['doLMSSetValue']("cmi.score.min", 0);
            parent.parent['doLMSSetValue']("cmi.score.max", 100);
            parent.parent['doLMSSetValue']("cmi.score.raw", 100);
            parent.window['$']('#exit', parent.document).modal({
                backdrop: 'static',
                keyboard: false
            });
        }
        parent.window['$']('#exit', parent.document).modal("show");
        Sim.removeResources();
    };
    Sim._currentScene = "";
    Sim._currentIndex = 0;
    Sim._isPaused = false;
    Sim._isPlaying = false;
    Sim._threshHold = {};
    Sim.$ = window["jQuery"];
    Sim._completedKnowledgeChecks = [];
    Sim._references = {};
    Sim.resources = {};
    Sim.incorrectCount = 0;
    Sim.promptIncorrect = 2;
    Sim._currentFault = 0;
    return Sim;
}());
window.addEventListener('DOMContentLoaded', function () {
    document.title = document.title;
});
/// <reference path="Sim.ts" />
var KnowledgeQuestionMultiple = /** @class */ (function () {
    function KnowledgeQuestionMultiple() {
        var _this = this;
        this.correctAnswers = [false, false, false, false];
        this.attempts = 0;
        var button = document.createElement('button');
        button.className = 'btn .btn-primary';
        button.id = 'checkAnswer';
        button.style.background = 'rgb(0, 105, 217)';
        button.type = 'button';
        button.addEventListener('click', function () {
            if (window['$']('#checkAnswer', parent.document).html() == 'Close') {
                if (Sim.hasCompleted(Sim.currentScene)) {
                    _this.hide();
                }
                else {
                    Sim.completedKnowledgeChecks.push(Sim.currentScene);
                    _this.hide();
                    setTimeout(function () {
                        Sim.removeResources();
                        Sim.next();
                    }, 500);
                }
                return true;
            }
            var buttons = parent.document.getElementsByName('answers');
            window['$']('.answerFeedback', parent.document).css('background-image', '');
            if (_this.checkAnswer(buttons)) {
                window['$']('.answerFeedback', parent.document).css('background-image', "url('../public/images/green_check.png')");
                _this.disableAnswers();
                Sim.game.scene.getScene(Sim.currentScene)['correctFeedback'](function () {
                    window['$']('#checkAnswer', parent.document).html('Close');
                    window['$']('#checkAnswer', parent.document).css('background', '#d9534f');
                });
            }
            else {
                window['$']('.answerFeedback', parent.document).css('background-image', "url('../public/images/red_x.png')");
                Sim.game.scene.getScene(Sim.currentScene)['incorrectFeedback']();
            }
        });
        window['$']('#checkAnswer', parent.document).replaceWith(button);
        //parent.document.getElementById('challenge').replaceChild(button, parent.document.getElementById('checkAnswer'));
    }
    KnowledgeQuestionMultiple.prototype.disableAnswers = function () {
        var answers = parent.document.forms[0].answers;
        for (var i = 0; i < answers.length; i++) {
            answers[i].setAttribute('disabled', 'disabled');
        }
    };
    KnowledgeQuestionMultiple.prototype.enableAnswers = function () {
        var answers = parent.document.forms[0].answers;
        for (var i = 0; i < answers.length; i++) {
            answers[i].removeAttribute('disabled');
        }
    };
    KnowledgeQuestionMultiple.prototype.checkAnswer = function (answerButtons) {
        var correct = true;
        for (var i = 0; i < answerButtons.length; i++) {
            if (answerButtons[i].checked != this.correctAnswers[i]) {
                correct = false;
                break;
            }
        }
        this.attempts++;
        return correct;
    };
    KnowledgeQuestionMultiple.prototype.show = function () {
        window['$']('#resetAnswer', parent.document).css('visibility', 'hidden');
        window['$']('#challenge .modal-content', parent.document).css('width', 'auto');
        window['$']('#frmQuestions', parent.document).remove();
        window['$']('.answerFeedback', parent.document).css('background-image', '');
        window['$']('#checkAnswer', parent.document).html('Submit');
        window['$']('#checkAnswer', parent.document).css('background', '#0069d9');
        //this.enableAnswers();
        parent.document.querySelector('.question').innerHTML = this.question;
        var answers = parent.document.querySelector('.answers');
        var charCode = 65;
        var form = parent.document.createElement('form');
        form.setAttribute('id', 'frmQuestions');
        for (var i = 0; i < this.answers.length; i++) {
            var span = parent.document.createElement('span');
            span.className = 'question';
            var option = parent.document.createElement('input');
            option.type = 'checkbox';
            option.id = i;
            option.name = 'answers';
            option.value = i;
            option.checked = false;
            var label = parent.document.createElement('label');
            label.setAttribute('for', i);
            label.innerText = ' ' + this.answers[i];
            span.appendChild(option);
            span.appendChild(label);
            form.appendChild(span);
            option.addEventListener('click', function (evt) {
                try {
                    evt.stopPropagation();
                    parent.document.querySelector('.answerFeedback')['style'].backgroundImage = '';
                }
                catch (e) {
                }
            });
            charCode++;
        }
        answers.appendChild(form);
        if (Sim.hasCompleted(Sim.currentScene)) {
            this.disableAnswers();
            window['$']('#challenge', parent.document).modal({
                backdrop: true,
                keyboard: true
            });
            for (var c = 0; c < this.answers.length; c++) {
                window['$']('input:checkbox[name=answers]', parent.document)[c].checked = this.correctAnswers[c];
                window['$']('input:checkbox[name=answers]', parent.document).attr('disabled', 'disabled');
            }
            window['$']('.answerFeedback', parent.document).css('background-image', "url('../public/images/green_check.png')");
            window['$']('#checkAnswer', parent.document).css('background', '#d9534f');
            window['$']('#checkAnswer', parent.document).html('Close');
            window['$']('#challenge', parent.document).modal("show");
            window['$']('.close', parent.document).show();
        }
        else {
            window['$']('#challenge', parent.document).modal({
                backdrop: 'static',
                keyboard: false
            });
            window['$']('#checkAnswer', parent.document).html('Submit');
            window['$']('#challenge', parent.document).modal("show");
            window['$']('.close', parent.document).hide();
        }
    };
    KnowledgeQuestionMultiple.prototype.hide = function () {
        window['$']('#challenge', parent.document).modal("hide");
        window['$']('.close', parent.document).show();
    };
    return KnowledgeQuestionMultiple;
}());
var DragAndDropKnowledgeCheck = /** @class */ (function () {
    function DragAndDropKnowledgeCheck() {
        var _this = this;
        this.attempts = 0;
        var button = document.createElement('button');
        button.className = 'btn .btn-primary';
        button.id = 'checkAnswer';
        button.style.background = 'rgb(0, 105, 217)';
        button.type = 'button';
        button.addEventListener('click', function () {
            if (window['$']('#checkAnswer', parent.document).html() == 'Close') {
                if (Sim.hasCompleted(Sim.currentScene)) {
                    _this.hide();
                }
                else {
                    Sim.completedKnowledgeChecks.push(Sim.currentScene);
                    _this.hide();
                    setTimeout(function () {
                        Sim.removeResources();
                        Sim.next();
                    }, 500);
                }
                return true;
            }
            window['$']('.answerFeedback', parent.document).css('background-image', '');
            var items = parent.document.querySelectorAll('#frmQuestions ol li');
            var isFinished = true;
            for (var i = 0; i < items.length; i++) {
                if (items[i]['innerText'] == '') {
                    isFinished = false;
                }
            }
            if (isFinished == false) {
                window['$']('.answerFeedback', parent.document).css('background-image', "url('/public/images/red_x.png')");
                return true;
            }
            if (_this.checkAnswer()) {
                window['$']('.answerFeedback', parent.document).css('background-image', "url('/public/images/green_check.png')");
                //this.disableAnswers();
                Sim.game.scene.getScene(Sim.currentScene)['correctFeedback'](function () {
                    window['$']('#checkAnswer', parent.document).html('Close');
                    window['$']('#checkAnswer', parent.document).css('background', '#d9534f');
                });
            }
            else {
                window['$']('.answerFeedback', parent.document).css('background-image', "url('/public/images/red_x.png')");
                Sim.game.scene.getScene(Sim.currentScene)['incorrectFeedback']();
            }
        });
        window['$']('#checkAnswer', parent.document).replaceWith(button);
        button = document.createElement('button');
        button.className = 'btn .btn-secondary';
        button.id = 'resetAnswer';
        button.style.background = '#6c757d';
        button.type = 'button';
        button.innerText = 'Reset';
        button.addEventListener('click', function () {
            if (window['$']('#checkAnswer', parent.document).html() == 'Close') {
                return true;
            }
            window['$']('.answerFeedback', parent.document).css('background-image', '');
            var items = parent.document.querySelectorAll('#frmQuestions ul li');
            for (var i = 0; i < items.length; i++) {
                items[i]['style']['opacity'] = '1';
            }
            items = parent.document.querySelectorAll('#frmQuestions ol li span');
            for (var i = 0; i < items.length; i++) {
                items[i]['innerHTML'] = '&nbsp;';
            }
        });
        window['$']('#resetAnswer', parent.document).replaceWith(button);
    }
    DragAndDropKnowledgeCheck.prototype.disableAnswers = function () {
        var answers = Sim.game.scene.getScene(Sim.currentScene)['answers'];
        var items = parent.document.querySelectorAll('#frmQuestions ul li');
        for (var i = 0; i < items.length; i++) {
            items[i]['style']['visibility'] = 'hidden';
        }
        items = parent.document.querySelectorAll('#frmQuestions ol li');
        for (var i = 0; i < items.length; i++) {
            items[i]['innerText'] = answers[i];
        }
    };
    DragAndDropKnowledgeCheck.prototype.enableAnswers = function () {
        var answers = parent.document.forms[0].answers;
        for (var i = 0; i < answers.length; i++) {
            answers[i].removeAttribute('disabled');
        }
    };
    DragAndDropKnowledgeCheck.prototype.checkAnswer = function () {
        var correct;
        var answers = Sim.game.scene.getScene(Sim.currentScene)['answers'];
        var items = parent.document.querySelectorAll('#frmQuestions ol li span');
        var userAnswers = [];
        for (var i = 0; i < items.length; i++) {
            userAnswers.push(items[i]['innerText'].trim());
        }
        return this.compareAnswers(answers, userAnswers);
    };
    DragAndDropKnowledgeCheck.prototype.compareAnswers = function (arr1, arr2) {
        for (var y = 0; y < arr1.length; y++) {
            if (arr1[y] != arr2[y]) {
                return false;
            }
        }
        return true;
    };
    DragAndDropKnowledgeCheck.prototype.show = function () {
        window['$']('#resetAnswer', parent.document).css('visibility', 'visible');
        window['$']('#challenge .modal-content', parent.document).css('width', '800px');
        window['$']('#frmQuestions', parent.document).remove();
        window['$']('.answerFeedback', parent.document).css('background-image', '');
        window['$']('#checkAnswer', parent.document).html('Submit');
        window['$']('#checkAnswer', parent.document).css('background', '#0069d9');
        //this.enableAnswers();
        parent.document.querySelector('.question').innerHTML = this.question;
        var answers = parent.document.querySelector('.answers');
        var charCode = 65;
        var form = parent.document.createElement('form');
        form.setAttribute('id', 'frmQuestions');
        var unorderedList = parent.document.createElement('ul');
        unorderedList.style.width = '45%';
        unorderedList.style['float'] = 'left';
        unorderedList.style.marginTop = '50px';
        var draggedList = parent.document.createElement('ol');
        draggedList.style.width = '45%';
        draggedList.style['float'] = 'right';
        draggedList.style.marginTop = '50px';
        draggedList.type = '1';
        var shuffled = this.shuffle(this.answers.slice());
        for (var i = 0; i < shuffled.length; i++) {
            var item = parent.document.createElement('li');
            item.className = 'dragOption';
            item.style.backgroundColor = 'white';
            item.innerHTML = ' ' + shuffled[i];
            item.id = 'i' + i;
            item.style.cursor = 'pointer';
            item.setAttribute('draggable', 'true');
            item.addEventListener('dragstart', this.drag);
            unorderedList.appendChild(item);
            item = parent.document.createElement('li');
            var span = parent.document.createElement('span');
            span.style.width = '300px';
            span.style.display = 'block';
            span.innerHTML = '&nbsp;';
            span.style.height = '24px';
            span.addEventListener('drop', this.drop);
            span.addEventListener('dragover', this.allowDrop);
            item.appendChild(span);
            draggedList.appendChild(item);
        }
        form.appendChild(draggedList);
        form.appendChild(unorderedList);
        answers.appendChild(form);
        if (Sim.hasCompleted(Sim.currentScene)) {
            this.disableAnswers();
            window['$']('#challenge', parent.document).modal({
                backdrop: true,
                keyboard: true
            });
            window['$']('.answerFeedback', parent.document).css('background-image', "url('/public/images/green_check.png')");
            window['$']('#checkAnswer', parent.document).css('background', '#d9534f');
            window['$']('#checkAnswer', parent.document).html('Close');
            window['$']('#challenge', parent.document).modal("show");
            window['$']('.close', parent.document).show();
            window['$']('#resetAnswer', parent.document).prop('disabled', true);
        }
        else {
            window['$']('#challenge', parent.document).modal({
                backdrop: 'static',
                keyboard: false
            });
            window['$']('#checkAnswer', parent.document).html('Submit');
            window['$']('#challenge', parent.document).modal("show");
            window['$']('.close', parent.document).hide();
            window['$']('#resetAnswer', parent.document).prop('disabled', false);
        }
    };
    DragAndDropKnowledgeCheck.prototype.drop = function (ev) {
        ev.preventDefault();
        var id = ev.dataTransfer.getData("text");
        var item = parent.document.getElementById(id);
        if (ev.srcElement.innerHTML != '&nbsp') {
            if (ev.srcElement.innerHTML.length > 1) {
                var items = parent.document.querySelectorAll('#frmQuestions ul li');
                for (var i = 0; i < items.length; i++) {
                    if (items[i]['innerHTML'].trim() == ev.srcElement.innerHTML.trim()) {
                        items[i]['style']['opacity'] = '1';
                    }
                }
            }
        }
        ev.srcElement.innerHTML = item.innerHTML;
        item.style.opacity = '0';
    };
    DragAndDropKnowledgeCheck.prototype.allowDrop = function (ev) {
        ev.preventDefault();
    };
    DragAndDropKnowledgeCheck.prototype.drag = function (ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    };
    DragAndDropKnowledgeCheck.prototype.hide = function () {
        window['$']('#challenge', parent.document).modal("hide");
        window['$']('.close', parent.document).show();
    };
    DragAndDropKnowledgeCheck.prototype.shuffle = function (array) {
        var currentIndex = array.length;
        var temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };
    ;
    return DragAndDropKnowledgeCheck;
}());
var Highlight = /** @class */ (function () {
    function Highlight() {
        this.color = 'yellow';
        this.blink = false;
        this.element = parent.document.querySelector(".highlight");
    }
    Highlight.prototype.show = function () {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.display = 'block';
        if (this.blink === true) {
            this.element.className = this.element.className + ' blink';
        }
    };
    Highlight.prototype.hide = function () {
        this.element.style.display = 'none';
        this.element.className = this.element.className.replace(" blink", "");
    };
    return Highlight;
}());
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.initialize = function (container, width, height) {
        var startTime, endTime;
        Object.prototype['isEmpty'] = function () {
            for (var key in this) {
                if (this.hasOwnProperty(key))
                    return false;
            }
            return true;
        };
        container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
        var point1 = {};
        var point2 = {};
        container.on('pointerup', function (gameObject) {
            if (point1['isEmpty']()) {
                point1['x'] = gameObject.x;
                point1['y'] = gameObject.y;
                start();
            }
            else {
                point2['x'] = gameObject.x;
                point2['y'] = gameObject.y;
                console.log(point1);
                console.log(point2);
                console.log('Width: ' + (point2['x'] - point1['x']));
                console.log('Height: ' + (point2['y'] - point1['y']));
                console.log('Elapsed: ' + end());
                point1 = {};
                point2 = {};
            }
        });
        function start() {
            startTime = new Date();
        }
        ;
        function end() {
            endTime = new Date();
            var timeDiff = endTime - startTime; //in ms
            // strip the ms
            timeDiff /= 1000;
            // get seconds 
            var seconds = Math.round(timeDiff);
            console.log(seconds + " seconds");
        }
    };
    Helper.getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    return Helper;
}());
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../AudioNarration.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IntroPowerSystem = /** @class */ (function (_super) {
    __extends(IntroPowerSystem, _super);
    function IntroPowerSystem() {
        var _this = _super.call(this, { key: "IntroPowerSystem" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    IntroPowerSystem.prototype.preload = function () {
        this.load.image("buildingLandscape", "../public/images/AA_landscape-wide.png");
        this.load.image("sky", "../public/images/sky-background.png");
        this.load.image("aaBuildingCloseup", "../public/images/AA_Building_Landscape-000.png");
        this.load.image("aaBuildingFinal", "../public/images/AA_Building_Landscape-100.png");
    };
    IntroPowerSystem.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    IntroPowerSystem.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n                    <p>The Aegis Ashore Missile Defense System is a sophisticated,\n                    high performance suite of radar, electronics, computers, and\n                    weapons capable of defending against a wide variety of present\n                    and future threats.</p>\n            ";
        Sim.currentScene = "IntroPowerSystem";
        var sc = this;
        var cam = this.cameras.main;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        cam.setBounds(0, 0, width * 1.5, height * 1.77);
        VideoAnimation.initialize('aaBuildingLandscape');
        VideoAnimation.playbackRate = 0.8;
        VideoAnimation.volume = 0;
        VideoAnimation.currentTime = 0.2;
        var sky = this.add.image(0, 0, "sky");
        sky.alpha = .8;
        sky.setOrigin(0, 0);
        sky.setDisplaySize(width * 1.3, height);
        var buildingLandscape = this.add.image(0, 0, "buildingLandscape");
        buildingLandscape.setOrigin(0, 0);
        buildingLandscape.setDisplaySize(width * 1.35, height * 1.48);
        cam.setZoom(1);
        cam.fadeIn(2000);
        cam.zoomTo(1.55, 5500);
        cam.pan(width * 1.49, height * 2.14, 5500, 'Power2');
        this.time.delayedCall(5500, function () {
            cam.fadeOut(300);
            cam.once('camerafadeoutcomplete', function (cam) {
                var _this = this;
                sky.destroy();
                cam.setZoom(1);
                cam.setBounds(0, 0, width, height);
                buildingLandscape.destroy();
                cam.fadeIn(300);
                cam.setOrigin(0, 0);
                var aaBuildingCloseup = this.add.image(0, 0, "aaBuildingCloseup");
                aaBuildingCloseup.setOrigin(0, 0);
                aaBuildingCloseup.setDisplaySize(width, height);
                this.time.delayedCall(2000, function () {
                    var aaBuildingFinal = _this.add.image(0, 0, "aaBuildingFinal");
                    aaBuildingFinal.setOrigin(0, 0);
                    aaBuildingFinal.setDisplaySize(width, height);
                    VideoAnimation.ended = function () {
                        cam.zoomTo(1.5, 1000);
                        cam.pan(2000, 900, 1000);
                        cam.fadeOut(1100);
                        cam.once("camerafadeoutcomplete", function () {
                            cam.setZoom(1);
                            cam.setBounds(0, 0, width, height);
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            sc.scene.stop("IntroPowerSystem");
                            Sim.game.scene.start("BuildingFloorPlan");
                        });
                    };
                    VideoAnimation.play();
                }, [], this);
            }, _this);
        }, [], this);
        AudioNarration.initialize('introAudio');
        AudioNarration.timeupdate = function () {
            if (AudioNarration.currentTime > 16) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 2;
        AudioNarration.play();
    };
    return IntroPowerSystem;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Loader.ts" />
var BuildingFloorPlan = /** @class */ (function (_super) {
    __extends(BuildingFloorPlan, _super);
    function BuildingFloorPlan() {
        var _this = _super.call(this, { key: "BuildingFloorPlan" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    BuildingFloorPlan.prototype.preload = function () {
        this.load.image("aaFacilityFloorPlan", "../public/images/AA_Facility_Romania_floorplan.png");
        this.load.image("aaFacilityElectricalCallout", "../public/images/AA_Facility_Romania_Floorplan_Electrical_Rooms.png");
    };
    BuildingFloorPlan.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    BuildingFloorPlan.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n                <p>The Aegis Ashore Facility itself is comprised of a \n                    sophisticated, automated, high performance and highly \n                    redundant building support ecosystem that is required to \n                    meet the strict tolerances of the \n                    Aegis Combat System.</p>\n            ";
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 18.5;
        AudioNarration.play();
        Sim.currentScene = "BuildingFloorPlan";
        var sc = this;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var cam = this.cameras.main;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 32) {
                AudioNarration.pause();
            }
        };
        var aaFacilityFloorPlan = this.add.image(0, 0, "aaFacilityFloorPlan");
        aaFacilityFloorPlan.setOrigin(0, 0);
        aaFacilityFloorPlan.setDisplaySize(width, height);
        var aaFacilityElectricalCallout = this.add.image(0, 0, "aaFacilityElectricalCallout");
        aaFacilityElectricalCallout.setOrigin(0, 0);
        aaFacilityElectricalCallout.setDisplaySize(width, height);
        this.time.delayedCall(9000, function () {
            cam.zoomTo(1.2, 1500);
            _this.add.tween({
                targets: aaFacilityFloorPlan,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 500,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return .5; }
                },
                onComplete: function () {
                    _this.time.delayedCall(3500, function () {
                        AudioNarration.pause();
                        _this.time.delayedCall(900, function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            sc.scene.stop("BuildingFloorPlan");
                            Sim.game.scene.start("InputModuleAB");
                        }, [], _this);
                    }, [], _this);
                }
            });
        }, [], this);
    };
    return BuildingFloorPlan;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var InputModuleAB = /** @class */ (function (_super) {
    __extends(InputModuleAB, _super);
    function InputModuleAB() {
        var _this = _super.call(this, { key: "InputModuleAB" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    InputModuleAB.prototype.preload = function () {
        this.load.image("uccFinalFrameStart", "../public/images/ucc_final_frame_start.png");
        this.load.image("inputA", "../public/images/input_a.png");
        this.load.image("inputB", "../public/images/input_b.png");
        this.load.image("inputAHighlighted", "../public/images/input_a_highlighted.png");
        this.load.image("inputBHighlighted", "../public/images/input_b_highlighted.png");
    };
    InputModuleAB.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    InputModuleAB.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n                <p>10 Kilovolt, 50 Hertz Commercial Power Lines run \n                    from the USG Commercial Power Substation to Input \n                    Modules A and B in the Mission Critical Power \n                    Enclosure.</p>\n            ";
        Sim.currentScene = "InputModuleAB";
        var sc = this;
        var cam = this.cameras.main;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('uccConsoleZoom');
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 0;
        var uccFinalFrameStart = this.add.image(0, 0, "uccFinalFrameStart");
        VideoAnimation.ended = function () { };
        var timeline = sc.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFinalFrameStart,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 7000,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return .4; }
            }
        });
        var inputA = this.add.image(4.5, 27, "inputA");
        inputA.setOrigin(0, 0);
        inputA.setDisplaySize(188, 60);
        inputA.alpha = 0;
        timeline.add({
            targets: inputA,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 1000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        var inputB = this.add.image(3.46, 402.5, "inputB");
        inputB.setOrigin(0, 0);
        inputB.setDisplaySize(189, 58.5);
        inputB.alpha = 0;
        timeline.add({
            targets: inputB,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 200,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        timeline.add({
            targets: inputA,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 500,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            }
        });
        timeline.add({
            targets: inputB,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 500,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            }
        });
        timeline.add({
            targets: uccFinalFrameStart,
            ease: 'Power2',
            duration: 500,
            delay: 500,
            alpha: {
                getStart: function () { return .4; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                timeline.destroy();
                var inputA_highlighted = _this.add.image(4.5, 27, "inputAHighlighted");
                inputA_highlighted.setOrigin(0, 0);
                inputA_highlighted.setDisplaySize(188, 60);
                inputA_highlighted.alpha = 0;
                var inputB_highlighted = _this.add.image(3.46, 402.5, "inputBHighlighted");
                inputB_highlighted.setOrigin(0, 0);
                inputB_highlighted.setDisplaySize(189, 58.5);
                inputB_highlighted.alpha = 0;
                _this.add.tween({
                    targets: [inputA_highlighted, inputB_highlighted],
                    ease: 'Sine.easeInOut',
                    duration: 500,
                    delay: 500,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
                _this.time.delayedCall(2000, function () {
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("InputTransformers");
                    sc.time.delayedCall(1000, function () {
                        sc.scene.stop("InputModuleAB");
                    }, [], sc);
                }, [], _this);
            }
        });
        timeline.play();
        VideoAnimation.play();
        uccFinalFrameStart.setOrigin(0, 0);
        uccFinalFrameStart.setDisplaySize(width, height);
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 34;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (AudioNarration.currentTime > 46.8) {
                    AudioNarration.destroy();
                }
            };
            AudioNarration.play();
        }, [], sc);
    };
    return InputModuleAB;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var InputTransformers = /** @class */ (function (_super) {
    __extends(InputTransformers, _super);
    function InputTransformers() {
        var _this = _super.call(this, { key: "InputTransformers" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    InputTransformers.prototype.preload = function () {
        this.load.image("uccTransformerFinalFrame", "../public/images/ucc_final_frame_input_transformers.png");
        this.load.image("inputTransformer", "../public/images/input_transformer.png");
        this.load.image("cnv", "../public/images/cnv.png");
    };
    InputTransformers.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    InputTransformers.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            <p>Input Transformers step down the \n                voltage from 10 kilovolts to 1728 volts.</p>\n        ";
        Sim.currentScene = "InputTransformers";
        var sc = this;
        var cam = this.cameras.main;
        cam.alpha = 1;
        cam.visible = true;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccTransformerFinalFrame = this.add.image(0, 0, "uccTransformerFinalFrame");
        uccTransformerFinalFrame.setOrigin(0, 0);
        uccTransformerFinalFrame.setDisplaySize(width, height);
        uccTransformerFinalFrame.alpha = 1;
        uccTransformerFinalFrame.visible = true;
        var inputTransformerA = this.add.image(155, 35, "inputTransformer");
        inputTransformerA.setOrigin(0, 0);
        inputTransformerA.setDisplaySize(30, 34);
        inputTransformerA.alpha = 0;
        var inputTransformerB = this.add.image(155, 409, "inputTransformer");
        inputTransformerB.setOrigin(0, 0);
        inputTransformerB.setDisplaySize(30, 34);
        inputTransformerB.alpha = 0;
        this.add.tween({
            targets: [inputTransformerA, inputTransformerB],
            ease: 'Sine.easeInOut',
            duration: 750,
            delay: 1500,
            yoyo: true,
            loop: 3,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                inputTransformerA.alpha = 1;
                inputTransformerB.alpha = 1;
                var cnvA = _this.add.image(184.4, 48.6, "cnv");
                cnvA.setOrigin(0, 0);
                cnvA.setDisplaySize(62.9, 8);
                cnvA.alpha = 0;
                var cnvB = _this.add.image(184.4, 422.7, "cnv");
                cnvB.setOrigin(0, 0);
                cnvB.setDisplaySize(62.9, 8);
                cnvB.alpha = 0;
                _this.add.tween({
                    targets: [cnvA, cnvB],
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 0,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        _this.time.delayedCall(1000, function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            Sim.game.scene.start("StaticFrequencyConverters");
                            sc.time.delayedCall(1000, function () {
                                sc.scene.stop("InputTransformers");
                            }, [], sc);
                        }, [], _this);
                    }
                });
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 47;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 55) {
                    AudioNarration.destroy();
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return InputTransformers;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var StaticFrequencyConverters = /** @class */ (function (_super) {
    __extends(StaticFrequencyConverters, _super);
    function StaticFrequencyConverters() {
        var _this = _super.call(this, { key: "StaticFrequencyConverters" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    StaticFrequencyConverters.prototype.preload = function () {
        this.load.image("uccStaticConverterFinalFrame", "../public/images/ucc_static_converter_final_frame.png");
        this.load.image("cnv60", "../public/images/cnv_60.png");
    };
    StaticFrequencyConverters.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    StaticFrequencyConverters.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            <p>While passing through the Mission Critical Power Enclosure, \n            the 50/60 Hertz Static Frequency Converters then convert \n            frequency from 50 to 60 Hertz and the voltage from \n            1728 volts to 1463 volts.</p>\n        ";
        Sim.currentScene = "StaticFrequencyConverters";
        var sc = this;
        var cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccStaticConverterFinalFrame = this.add.image(0, 0, "uccStaticConverterFinalFrame");
        uccStaticConverterFinalFrame.setOrigin(0, 0);
        uccStaticConverterFinalFrame.setDisplaySize(width, height);
        var cnv60A = this.add.image(246.5, 35, "cnv60");
        cnv60A.setOrigin(0, 0);
        cnv60A.setDisplaySize(32, 34);
        cnv60A.alpha = 0;
        var cnv60B = this.add.image(246, 409, "cnv60");
        cnv60B.setOrigin(0, 0);
        cnv60B.setDisplaySize(32, 34);
        cnv60B.alpha = 0;
        this.add.tween({
            targets: [cnv60A, cnv60B],
            ease: 'Sine.easeInOut',
            duration: 750,
            delay: 5000,
            yoyo: true,
            loop: 3,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                cnv60A.alpha = 1;
                cnv60B.alpha = 1;
                _this.time.delayedCall(9000, function () {
                    AudioNarration.pause();
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("OutputTransformers");
                    sc.time.delayedCall(1000, function () {
                        sc.scene.stop("StaticFrequencyConverters");
                    }, [], sc);
                }, [], _this);
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 56;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 75) {
                    AudioNarration.pause();
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return StaticFrequencyConverters;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var OutputTransformers = /** @class */ (function (_super) {
    __extends(OutputTransformers, _super);
    function OutputTransformers() {
        var _this = _super.call(this, { key: "OutputTransformers" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    OutputTransformers.prototype.preload = function () {
        this.load.image("uccOutputTransformerFinalFrame", "../public/images/ucc_final_frame_output_transformer.png");
        this.load.image("output_transformer", "../public/images/output_transformer.png");
    };
    OutputTransformers.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    OutputTransformers.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            <p>Then, the Static Frequency Converter output transformer \n            makes the final conversion from 1463 volts to 4160 volts.</p> \n        ";
        Sim.currentScene = "OutputTransformers";
        var sc = this;
        var cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccOutputTransformerFinalFrame = this.add.image(0, 0, "uccOutputTransformerFinalFrame");
        uccOutputTransformerFinalFrame.setOrigin(0, 0);
        uccOutputTransformerFinalFrame.setDisplaySize(width, height);
        var output_transformerA = this.add.image(277, 36, "output_transformer");
        output_transformerA.setOrigin(0, 0);
        output_transformerA.setDisplaySize(32, 34);
        output_transformerA.alpha = 0;
        var output_transformerB = this.add.image(277, 409, "output_transformer");
        output_transformerB.setOrigin(0, 0);
        output_transformerB.setDisplaySize(32, 34);
        output_transformerB.alpha = 0;
        this.add.tween({
            targets: [output_transformerA, output_transformerB],
            ease: 'Sine.easeInOut',
            duration: 750,
            delay: 5000,
            yoyo: true,
            loop: 3,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                output_transformerA.alpha = 1;
                output_transformerB.alpha = 1;
                _this.time.delayedCall(2000, function () {
                    AudioNarration.pause();
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("Deckhouse");
                    _this.time.delayedCall(1000, function () {
                        _this.scene.stop("OutputTransformers");
                    }, [], _this);
                }, [], _this);
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 76;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 88) {
                    AudioNarration.pause();
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return OutputTransformers;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var Deckhouse = /** @class */ (function (_super) {
    __extends(Deckhouse, _super);
    function Deckhouse() {
        var _this = _super.call(this, { key: "Deckhouse" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    Deckhouse.prototype.preload = function () {
        this.load.image("uccFinalFrameDeckhouseFeed", "../public/images/ucc_final_frame_deckhouse_feed.png");
        this.load.image("switchGearsCenter", "../public/images/switch_gears_center.png");
        this.load.image("switchGearsLeft", "../public/images/switch_gears_left.png");
        this.load.image("f13f14", "../public/images/f13_f14.png");
        this.load.image("f21f23", "../public/images/f21_f23.png");
        this.load.image("dhsb_a", "../public/images/dhsb_a.png");
        this.load.image("dhsb_b", "../public/images/dhsb_b.png");
        this.load.image("dhsb_module", "../public/images/dhsb_a_module.png");
        this.load.image("dhsb_low_volt", "../public/images/dhsb_low_volt.png");
        this.load.image("rdh", "../public/images/rdh.png");
    };
    Deckhouse.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    Deckhouse.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            <p>This feeds power to the switchgears which supply \n            redundant 60 Hertz, 4160-volt power to the Deckhouse \n            Support Building.</p>\n        ";
        Sim.currentScene = "Deckhouse";
        var sc = this;
        var cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 1068, 448);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccFinalFrameDeckhouseFeed = this.add.image(0, 0, "uccFinalFrameDeckhouseFeed");
        uccFinalFrameDeckhouseFeed.setOrigin(0, 0);
        uccFinalFrameDeckhouseFeed.setDisplaySize(width, height);
        var switchGearsCenter = this.add.image(307.7, 45.5, "switchGearsCenter");
        switchGearsCenter.setOrigin(0, 0);
        switchGearsCenter.setDisplaySize(177, 402.5);
        switchGearsCenter.alpha = 0;
        var switchGearsLeft = this.add.image(224, 145, "switchGearsLeft");
        switchGearsLeft.setOrigin(0, 0);
        switchGearsLeft.setDisplaySize(84, 252);
        switchGearsLeft.alpha = 0;
        var f13f14 = this.add.image(483, 114, "f13f14");
        f13f14.setOrigin(0, 0);
        f13f14.setDisplaySize(110.1, 52);
        f13f14.alpha = 0;
        var f21f23 = this.add.image(483, 332.5, "f21f23");
        f21f23.setOrigin(0, 0);
        f21f23.setDisplaySize(109.5, 52);
        f21f23.alpha = 0;
        this.add.tween({
            targets: [switchGearsLeft, f13f14, f21f23, switchGearsCenter],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 2000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                f13f14.alpha = 1;
                f21f23.alpha = 1;
                switchGearsCenter.alpha = 1;
                switchGearsLeft.alpha = 1;
                var dhsbA = _this.add.image(484.5, 83, "dhsb_a");
                dhsbA.setOrigin(0, 0);
                dhsbA.setDisplaySize(193.5, 26.5);
                dhsbA.alpha = 0;
                var dhsbB = _this.add.image(484.5, 380, "dhsb_b");
                dhsbB.setOrigin(0, 0);
                dhsbB.setDisplaySize(193.5, 25);
                dhsbB.alpha = 0;
                var dhsbAModule = _this.add.image(657, 109.5, "dhsb_module");
                dhsbAModule.setOrigin(0, 0);
                dhsbAModule.setDisplaySize(39, 27);
                dhsbAModule.alpha = 0;
                var dhsbBModule = _this.add.image(657.4, 353, "dhsb_module");
                dhsbBModule.setOrigin(0, 0);
                dhsbBModule.setDisplaySize(39, 27);
                dhsbBModule.alpha = 0;
                var dhsbLowVolt = _this.add.image(667.6, 136, "dhsb_low_volt");
                dhsbLowVolt.setOrigin(0, 0);
                dhsbLowVolt.setDisplaySize(23, 217);
                dhsbLowVolt.alpha = 0;
                _this.add.tween({
                    targets: [dhsbA, dhsbB, dhsbAModule, dhsbBModule, dhsbLowVolt],
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 6000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        dhsbA.alpha = 1;
                        dhsbB.alpha = 1;
                        dhsbAModule.alpha = 1;
                        dhsbBModule.alpha = 1;
                        dhsbLowVolt.alpha = 1;
                        _this.time.delayedCall(1500, function () {
                            AudioNarration.pause();
                            Sim.output.innerHTML = "";
                            Sim.removeResources();
                            Sim.game.scene.start("RDH");
                            _this.time.delayedCall(1000, function () {
                                _this.scene.stop("Deckhouse");
                            }, [], _this);
                        }, [], _this);
                    }
                });
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 89;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 99) {
                    AudioNarration.pause();
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return Deckhouse;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var RDH = /** @class */ (function (_super) {
    __extends(RDH, _super);
    function RDH() {
        var _this = _super.call(this, { key: "RDH" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    RDH.prototype.preload = function () {
        this.load.image("uccFinalFrameRDH", "../public/images/ucc_final_rdh_frame.png");
        this.load.image("rdh", "../public/images/rdh.png");
        this.load.image("lsue", "../public/images/lsue.png");
        this.load.image("launcher_module_enclosure", "../public/images/launcher_module_enclosure.png");
        this.load.image("lsue_line_fix", "../public/images/lsue_line_fix.png");
    };
    RDH.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    RDH.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            <p>Power then goes from the Deckhouse \n            Support Building to the Reconstitutable Deckhouse as \n            well as to the Launcher System Utility Enclosures.</p><p>Finally, power flows to the Launcher Module Enclosures \n            and their supporting Vertical Launch System Utility Enclosures.</p>\n        ";
        Sim.currentScene = "RDH";
        var sc = this;
        var cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 1071, 451.5);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccFinalFrameRDH = this.add.image(0, -1.75, "uccFinalFrameRDH");
        uccFinalFrameRDH.setOrigin(0, 0);
        uccFinalFrameRDH.setDisplaySize(width + 2, height + 4);
        var rdh = this.add.image(725, 177, "rdh");
        rdh.setOrigin(0, 0);
        rdh.setDisplaySize(37, 133);
        rdh.alpha = 0;
        this.add.tween({
            targets: [rdh],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 5000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                rdh.alpha = 1;
                var lsue = _this.add.image(484, 52, "lsue");
                lsue.setOrigin(0, 0);
                lsue.setDisplaySize(405, 385.4);
                lsue.alpha = 0;
                var lineFix = _this.add.image(580, 421.5, "lsue_line_fix");
                lineFix.setOrigin(0, 0);
                lineFix.setDisplaySize(14, 20);
                lineFix.alpha = 0;
                _this.add.tween({
                    targets: [lsue, lineFix],
                    ease: 'Sine.easeInOut',
                    duration: 2000,
                    delay: 1000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        lsue.alpha = 1;
                        lineFix.alpha = 1;
                        var launcherModuleEnclosure = _this.add.image(859, 154, "launcher_module_enclosure");
                        launcherModuleEnclosure.setOrigin(0, 0);
                        launcherModuleEnclosure.setDisplaySize(205, 189);
                        launcherModuleEnclosure.alpha = 0;
                        _this.add.tween({
                            targets: [launcherModuleEnclosure],
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            delay: 3500,
                            alpha: {
                                getStart: function () { return 0; },
                                getEnd: function () { return 1; }
                            },
                            onComplete: function () {
                                _this.time.delayedCall(28000, function () {
                                    Sim.output.innerHTML = '';
                                    Sim.removeResources();
                                    Sim.output.innerHTML = "";
                                    cam.fadeOut(500);
                                    _this.time.delayedCall(600, function () {
                                        Sim.currentScene = "";
                                        _this.scene.stop("RDH");
                                        Sim.output.innerHTML = "";
                                        Sim.setComplete();
                                    }, [], _this);
                                }, [], _this);
                            }
                        });
                    }
                });
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 100;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 118) {
                    Sim.output.innerHTML = "\n                        <p>Power from the Deckhouse Support Building is distributed \n                        throughout the Building Automated System which controls \n                        subsystems like the Chilled Water, Hot Water, Compressed Air, \n                        Heating Ventilation Air Conditioning, and Makeup Air Units, among \n                        other systems that support the Aegis Combat System.</p>\n                    ";
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return RDH;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var FullUtilityIntro = /** @class */ (function (_super) {
    __extends(FullUtilityIntro, _super);
    function FullUtilityIntro() {
        var _this = _super.call(this, { key: "FullUtilityIntro" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FullUtilityIntro.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
    };
    FullUtilityIntro.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FullUtilityIntro.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FullUtilityIntro";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('UCC_Console_Zoom_Start');
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 0;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 2000
            });
            timeline.play();
            _this.time.delayedCall(4500, function () {
                Sim.removeResources();
                Sim.output.innerHTML = "";
                sc.scene.stop("FullUtilityIntro");
                Sim.game.scene.start("CriticalSystemSupport");
            }, [], _this);
        };
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 2;
        Sim.output.innerHTML = "\n                <p>\n                    During this lesson, you will be able to follow the flow of electric\n                    through a normally operating dual utility power system.\n                </p>\n            ";
        AudioNarration.timeupdate = function () {
            if (AudioNarration.currentTime > 10) {
                AudioNarration.pause();
            }
        };
        this.time.delayedCall(1000, function () {
            AudioNarration.play();
        }, [], sc);
        VideoAnimation.play();
    };
    return FullUtilityIntro;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var CriticalSystemSupport = /** @class */ (function (_super) {
    __extends(CriticalSystemSupport, _super);
    function CriticalSystemSupport() {
        var _this = _super.call(this, { key: "CriticalSystemSupport" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    CriticalSystemSupport.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
    };
    CriticalSystemSupport.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    CriticalSystemSupport.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "CriticalSystemSupport";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        cam.zoomTo(1.3, 2000, 'Sine.easeInOut');
        cam.pan(690, 240, 2000, 'Sine.easeInOut');
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 10;
        AudioNarration.timeupdate = function () {
            if (AudioNarration.currentTime > 19) {
                AudioNarration.pause();
            }
        };
        sc.time.delayedCall(1000, function () {
            Sim.output.innerHTML = "\n                <p>\n                    While the system is in normal dual utility operation, power from the Deckhouse\n                    and the Reconstitutable Deckhouse\n                </p>\n            ";
            AudioNarration.play();
            sc.time.delayedCall(5250, function () {
                var graphics = sc.add.graphics({});
                graphics.lineStyle(4, 0xfaff77, 1.0);
                graphics.setDepth(100);
                var rect1 = new Phaser.Geom.Rectangle();
                var rect2 = new Phaser.Geom.Rectangle();
                graphics.alpha = 0;
                rect1.setSize(134, 396);
                rect1.setPosition(625, 47);
                graphics.strokeRectShape(rect1);
                rect2.setSize(77, 396);
                rect2.setPosition(766, 47);
                graphics.strokeRectShape(rect2);
                sc.add.tween({
                    targets: [graphics],
                    ease: 'Sine.easeInOut',
                    duration: 500,
                    delay: 10,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        sc.time.delayedCall(2580, function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            Sim.game.scene.start("SpyRadar");
                            sc.scene.stop("CriticalSystemSupport");
                        }, [], sc);
                    }
                });
            }, [], sc);
        }, [], sc);
    };
    return CriticalSystemSupport;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../VideoAnimation.ts" />
var SpyRadar = /** @class */ (function (_super) {
    __extends(SpyRadar, _super);
    function SpyRadar() {
        var _this = _super.call(this, { key: "SpyRadar" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SpyRadar.prototype.preload = function () {
    };
    SpyRadar.prototype.create = function () {
        this.events.on('pause', function () {
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SpyRadar.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SpyRadar";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('satSystems');
        VideoAnimation.currentTime = 0;
        Sim.output.innerHTML = "\n            <p>\n                supports critical systems such as Spy Radar, FCS Illuminators,\n                and communications.\n            </p>\n        ";
        VideoAnimation.play();
        sc.time.delayedCall(14500, function () {
            VideoAnimation.pause();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            sc.scene.stop("SpyRadar");
            Sim.game.scene.start("VerticalLaunchingSystem");
        }, [], sc);
    };
    return SpyRadar;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../VideoAnimation.ts" />
var VerticalLaunchingSystem = /** @class */ (function (_super) {
    __extends(VerticalLaunchingSystem, _super);
    function VerticalLaunchingSystem() {
        var _this = _super.call(this, { key: "VerticalLaunchingSystem" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    VerticalLaunchingSystem.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
    };
    VerticalLaunchingSystem.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    VerticalLaunchingSystem.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "VerticalLaunchingSystem";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        cam.zoomTo(1.3, 0, 'Sine.easeInOut');
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 27;
        AudioNarration.play();
        AudioNarration.timeupdate = function () {
            if (AudioNarration.currentTime > 34) {
                AudioNarration.pause();
            }
        };
        sc.time.delayedCall(1000, function () {
            Sim.output.innerHTML = "\n                <p>\n                    Utility power also supports the vertical launching system which is crucial for mission success. \n                </p>\n            ";
            cam.pan(750, 240, 2000, 'Sine.easeInOut', null, function () {
                sc.time.delayedCall(2500, function () {
                    var graphics = sc.add.graphics({});
                    graphics.lineStyle(4, 0xfaff77, 1.0);
                    graphics.setDepth(100);
                    var rect1 = new Phaser.Geom.Rectangle();
                    graphics.lineStyle(4, 0xfaff77, 1.0);
                    graphics.setDepth(100);
                    graphics.alpha = 0;
                    rect1.setSize(194, 118);
                    rect1.setPosition(960, 187);
                    graphics.strokeRectShape(rect1);
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 500,
                        delay: 10,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                    sc.time.delayedCall(4000, function () {
                        Sim.removeResources();
                        Sim.output.innerHTML = "";
                        sc.scene.stop("VerticalLaunchingSystem");
                        Sim.game.scene.start("VLSIntercept");
                    }, [], sc);
                }, [], sc);
            });
        }, [], sc);
    };
    return VerticalLaunchingSystem;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var VLSIntercept = /** @class */ (function (_super) {
    __extends(VLSIntercept, _super);
    function VLSIntercept() {
        var _this = _super.call(this, { key: "VLSIntercept" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    VLSIntercept.prototype.preload = function () {
    };
    VLSIntercept.prototype.create = function () {
        this.events.on('pause', function () {
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    VLSIntercept.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "VLSIntercept";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        Sim.output.innerHTML = "";
        Sim.output.innerHTML = "\n            <p>\n                VLS Intercept Video.\n            </p>\n        ";
        VideoAnimation.initialize('vlsIntercept');
        VideoAnimation.currentTime = 0;
        VideoAnimation.ended = function () {
            sc.time.delayedCall(1000, function () {
                VideoAnimation.pause();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("MVS");
                sc.scene.stop("VLSIntercept");
            }, [], sc);
        };
        VideoAnimation.play();
    };
    return VLSIntercept;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var MVS = /** @class */ (function (_super) {
    __extends(MVS, _super);
    function MVS() {
        var _this = _super.call(this, { key: "MVS" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    MVS.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
        this.load.image("manualAutoFlipped", "../public/images/manual_auto_flipped.png");
    };
    MVS.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    MVS.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "MVS";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        Sim.output.innerHTML = "";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        cam.zoomTo(1.3, 0);
        cam.pan(750, 240, 0);
        sc.time.delayedCall(1000, function () {
            cam.zoomTo(1, 2000, 'Sine.easeInOut');
            cam.pan(0, 0, 2000, 'Sine.easeInOut', false);
            var manualAutoFlipped = _this.add.image(495, 243, "manualAutoFlipped");
            manualAutoFlipped.setOrigin(0, 0);
            manualAutoFlipped.setDisplaySize(38, 20);
            container.add(manualAutoFlipped);
            var graphics = sc.add.graphics({});
            var graphics2 = sc.add.graphics({});
            graphics.lineStyle(4, 0xfaff77, 1.0);
            graphics.setDepth(100);
            graphics2.lineStyle(4, 0xfaff77, 1.0);
            graphics2.setDepth(100);
            var rect1 = new Phaser.Geom.Rectangle();
            var rect2 = new Phaser.Geom.Rectangle();
            sc.time.delayedCall(2000, function () {
                Sim.output.innerHTML = "\n                    <p>\n                    When the system is running on full utility power the Medium Voltage Switchgear, or MVS, Bus Control Switch is set to \"AUTO\". If the MVS Bus Control Switch is not set to \"AUTO\", any attempt to change the Primary Bus will fail. \n                    </p>\n                ";
                AudioNarration.initialize('fullUtilityAudio');
                AudioNarration.currentTime = 35;
                AudioNarration.timeupdate = function () {
                    if (AudioNarration.currentTime > 56.5) {
                        AudioNarration.destroy();
                    }
                };
                AudioNarration.play();
                cam.zoomTo(1.3, 2000, 'Sine.easeInOut');
                sc.time.delayedCall(5000, function () {
                    graphics.lineStyle(4, 0xfaff77, 1.0);
                    graphics.setDepth(100);
                    graphics.alpha = 0;
                    rect1.setSize(126, 53);
                    rect1.setPosition(470, 215);
                    graphics.strokeRectShape(rect1);
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 500,
                        delay: 10,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                }, [], sc);
                sc.time.delayedCall(14500, function () {
                    graphics2.lineStyle(4, 0xfaff77, 1.0);
                    graphics2.setDepth(100);
                    graphics2.alpha = 0;
                    rect2 = new Phaser.Geom.Rectangle();
                    rect2.setSize(84, 53);
                    rect2.setPosition(370, 215);
                    graphics2.strokeRectShape(rect2);
                    sc.add.tween({
                        targets: [graphics2],
                        ease: 'Sine.easeInOut',
                        duration: 500,
                        delay: 1500,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                }, [], sc);
                sc.time.delayedCall(19500, function () {
                    graphics.clear();
                    graphics2.clear();
                    sc.time.delayedCall(1000, function () {
                        Sim.removeResources();
                        Sim.output.innerHTML = "";
                        sc.scene.stop("MVS");
                        Sim.game.scene.start("MVSChallenge");
                    }, [], sc);
                }, [], sc);
            }, [], sc);
        }, [], sc);
    };
    return MVS;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var MVSChallenge = /** @class */ (function (_super) {
    __extends(MVSChallenge, _super);
    function MVSChallenge() {
        var _this = _super.call(this, { key: "MVSChallenge" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    MVSChallenge.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
        this.load.image("manualAutoFlipped", "../public/images/manual_auto_flipped.png");
    };
    MVSChallenge.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    MVSChallenge.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "MVSChallenge";
        Sim.incorrectCount = 0;
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        cam.setZoom(1.3);
        Sim.output.innerHTML = "";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var manualAutoFlipped = this.add.image(495, 243, "manualAutoFlipped");
        manualAutoFlipped.setOrigin(0, 0);
        manualAutoFlipped.setDisplaySize(38, 20);
        container.add(manualAutoFlipped);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        container.add(graphics);
        Sim.output.innerHTML = "\n            <p>\n                Change the MVS Bus Control Switch from Manual to Auto.\n            </p>\n        ";
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 150;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 157) {
                AudioNarration.pause();
            }
        };
        AudioNarration.play();
        container.removeInteractive();
        manualAutoFlipped.removeInteractive();
        sc.time.delayedCall(7000, function () {
            manualAutoFlipped.setInteractive();
            manualAutoFlipped.once('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                graphics.setAlpha(0);
                AudioNarration.currentTime = 140;
                AudioNarration.play();
                container.removeInteractive();
                manualAutoFlipped.removeInteractive();
                sc.time.delayedCall(1000, function () {
                    AudioNarration.pause();
                    sc.add.tween({
                        targets: [manualAutoFlipped],
                        ease: 'Sine.easeInOut',
                        duration: 200,
                        delay: 10,
                        alpha: {
                            getStart: function () { return 1; },
                            getEnd: function () { return 0; }
                        },
                        onComplete: function () {
                            cam.zoomTo(1, 2000, 'Sine.easeInOut');
                            cam.pan(0, 0, 2000, 'Sine.easeInOut', false);
                            sc.time.delayedCall(2000, function () {
                                Sim.removeResources();
                                Sim.output.innerHTML = "";
                                Sim.game.scene.start("MainBus");
                                sc.time.delayedCall(1000, function () {
                                    sc.scene.stop("MVSChallenge");
                                }, [], sc);
                            }, [], sc);
                        }
                    });
                }, [], sc);
            });
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                if (Sim.incorrectCount > Sim.promptIncorrect) {
                    var rect1 = new Phaser.Geom.Rectangle();
                    rect1.setSize(48, 18);
                    rect1.setPosition(482, 246);
                    graphics.strokeRectShape(rect1);
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 0,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                }
                AudioNarration.currentTime = 132;
                AudioNarration.play();
                sc.time.delayedCall(2000, function () {
                    AudioNarration.pause();
                }, [], sc);
            });
        }, [], sc);
    };
    return MVSChallenge;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var MainBus = /** @class */ (function (_super) {
    __extends(MainBus, _super);
    function MainBus() {
        var _this = _super.call(this, { key: "MainBus" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    MainBus.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
        this.load.image("aSideOpen", "../public/images/a_side_open.png");
        this.load.image("bSideOpen", "../public/images/b_side_open.png");
    };
    MainBus.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    MainBus.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "MainBus";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        Sim.output.innerHTML = "";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        var rect1 = new Phaser.Geom.Rectangle();
        var aSideOpen = this.add.image(0, 0, "aSideOpen");
        aSideOpen.setOrigin(0, 0);
        aSideOpen.setDisplaySize(width, height);
        aSideOpen.alpha = 0;
        container.add(aSideOpen);
        var bSideOpen = this.add.image(0, 0, "bSideOpen");
        bSideOpen.setOrigin(0, 0);
        bSideOpen.setDisplaySize(width, height);
        bSideOpen.alpha = 0;
        container.add(bSideOpen);
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 56;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 62) {
                AudioNarration.pause();
            }
        };
        sc.time.delayedCall(1000, function () {
            AudioNarration.play();
            Sim.output.innerHTML = "\n                <p>\n                    Breaker M11 is closed, allowing Utility A power to serve the Main Bus A; while Breaker M21 is closed, allowing Utility B power to serve the Main Bus B.\n                </p>\n            ";
            graphics.lineStyle(4, 0xfaff77, 1.0);
            graphics.setDepth(100);
            graphics.setAlpha(0);
            rect1.setSize(40, 18);
            rect1.setPosition(412, 62);
            graphics.strokeRectShape(rect1);
            sc.add.tween({
                targets: [graphics],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                },
                onComplete: function () {
                    sc.time.delayedCall(4000, function () {
                        sc.add.tween({
                            targets: [aSideOpen],
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            delay: 10,
                            alpha: {
                                getStart: function () { return 0; },
                                getEnd: function () { return 1; }
                            },
                            onComplete: function () {
                                AudioNarration.pause();
                                sc.add.tween({
                                    targets: [aSideOpen],
                                    ease: 'Sine.easeInOut',
                                    duration: 1000,
                                    delay: 10,
                                    alpha: {
                                        getStart: function () { return 1; },
                                        getEnd: function () { return 0; }
                                    },
                                    onComplete: function () {
                                        sc.time.delayedCall(500, function () {
                                            AudioNarration.currentTime = 63;
                                            AudioNarration.timeupdate = function () {
                                                if (Math.floor(AudioNarration.currentTime) > 70) {
                                                    AudioNarration.pause();
                                                }
                                            };
                                            AudioNarration.play();
                                            var rect2 = new Phaser.Geom.Rectangle();
                                            rect2.setSize(40, 18);
                                            rect2.setPosition(412, 437);
                                            graphics.clear();
                                            graphics.lineStyle(4, 0xfaff77, 1.0);
                                            graphics.setDepth(100);
                                            graphics.setAlpha(0);
                                            graphics.strokeRectShape(rect2);
                                            sc.add.tween({
                                                targets: [graphics],
                                                ease: 'Sine.easeInOut',
                                                duration: 1000,
                                                delay: 1000,
                                                alpha: {
                                                    getStart: function () { return 0; },
                                                    getEnd: function () { return 1; }
                                                },
                                                onComplete: function () {
                                                    sc.time.delayedCall(3500, function () {
                                                        sc.add.tween({
                                                            targets: [bSideOpen],
                                                            ease: 'Sine.easeInOut',
                                                            duration: 1000,
                                                            delay: 10,
                                                            alpha: {
                                                                getStart: function () { return 0; },
                                                                getEnd: function () { return 1; }
                                                            },
                                                            onComplete: function () {
                                                                sc.add.tween({
                                                                    targets: [bSideOpen],
                                                                    ease: 'Sine.easeInOut',
                                                                    duration: 1000,
                                                                    delay: 1000,
                                                                    alpha: {
                                                                        getStart: function () { return 1; },
                                                                        getEnd: function () { return 0; }
                                                                    },
                                                                    onComplete: function () {
                                                                        graphics.clear();
                                                                        sc.time.delayedCall(1500, function () {
                                                                            Sim.removeResources();
                                                                            Sim.output.innerHTML = "";
                                                                            Sim.game.scene.start("MainBusChallengeA");
                                                                            sc.time.delayedCall(1000, function () {
                                                                                sc.scene.stop("MainBus");
                                                                            }, [], sc);
                                                                        }, [], sc);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }, [], sc);
                                                }
                                            });
                                        }, [], sc);
                                    }
                                });
                            }
                        });
                    }, [], sc);
                }
            });
        }, [], sc);
    };
    return MainBus;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var MainBusChallengeA = /** @class */ (function (_super) {
    __extends(MainBusChallengeA, _super);
    function MainBusChallengeA() {
        var _this = _super.call(this, { key: "MainBusChallengeA" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    MainBusChallengeA.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
        this.load.image("m11Breaker", "../public/images/m11Breaker.png");
    };
    MainBusChallengeA.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    MainBusChallengeA.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "MainBusChallengeA";
        Sim.incorrectCount = 0;
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        Sim.output.innerHTML = "";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var m11Breaker = sc.add.image(412, 60, "m11Breaker");
        m11Breaker.setOrigin(0, 0);
        m11Breaker.setDisplaySize(42, 20);
        container.add(m11Breaker);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        container.add(graphics);
        Sim.output.innerHTML = "\n            <p>\n            Select the breaker that allows Utility A to serve Main Bus A.\n            </p>\n        ";
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 158;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 164) {
                AudioNarration.pause();
            }
        };
        AudioNarration.play();
        container.removeInteractive();
        m11Breaker.removeInteractive();
        sc.time.delayedCall(6500, function () {
            AudioNarration.pause();
            m11Breaker.setInteractive();
            m11Breaker.once('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                graphics.setAlpha(0);
                AudioNarration.currentTime = 140;
                AudioNarration.timeupdate = function () {
                    if (Math.floor(AudioNarration.currentTime) > 142) {
                        AudioNarration.pause();
                    }
                };
                AudioNarration.play();
                container.removeInteractive();
                m11Breaker.removeInteractive();
                sc.time.delayedCall(1000, function () {
                    AudioNarration.pause();
                    sc.time.delayedCall(1000, function () {
                        Sim.removeResources();
                        Sim.output.innerHTML = "";
                        Sim.game.scene.start("MainBusChallengeB");
                        sc.time.delayedCall(1000, function () {
                            sc.scene.stop("MainBusChallengeA");
                        }, [], sc);
                    }, [], sc);
                }, [], sc);
            });
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                if (Sim.incorrectCount > Sim.promptIncorrect) {
                    var rect1 = new Phaser.Geom.Rectangle();
                    rect1.setSize(44, 26);
                    rect1.setPosition(410, 58);
                    graphics.strokeRectShape(rect1);
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 0,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                }
                AudioNarration.currentTime = 132;
                AudioNarration.timeupdate = function () {
                    if (Math.floor(AudioNarration.currentTime) > 134) {
                        AudioNarration.pause();
                    }
                };
                AudioNarration.play();
                sc.time.delayedCall(2000, function () {
                    AudioNarration.pause();
                }, [], sc);
            });
        }, [], sc);
    };
    return MainBusChallengeA;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var MainBusChallengeB = /** @class */ (function (_super) {
    __extends(MainBusChallengeB, _super);
    function MainBusChallengeB() {
        var _this = _super.call(this, { key: "MainBusChallengeB" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    MainBusChallengeB.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
        this.load.image("m21Breaker", "../public/images/m21Breaker.png");
    };
    MainBusChallengeB.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    MainBusChallengeB.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "MainBusChallengeB";
        Sim.incorrectCount = 0;
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        Sim.output.innerHTML = "";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var m21Breaker = sc.add.image(410, 435, "m21Breaker");
        m21Breaker.setOrigin(0, 0);
        m21Breaker.setDisplaySize(44, 22);
        container.add(m21Breaker);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        container.add(graphics);
        Sim.output.innerHTML = "\n        <p>\n        Select the breaker that allows Utility B to serve Main Bus B.\n        </p>\n        ";
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 165;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 172) {
                AudioNarration.pause();
            }
        };
        AudioNarration.play();
        container.removeInteractive();
        m21Breaker.removeInteractive();
        sc.time.delayedCall(7000, function () {
            AudioNarration.pause();
            m21Breaker.setInteractive();
            m21Breaker.once('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                graphics.setAlpha(0);
                AudioNarration.currentTime = 140;
                AudioNarration.timeupdate = function () {
                    if (Math.floor(AudioNarration.currentTime) > 142) {
                        AudioNarration.pause();
                    }
                };
                AudioNarration.play();
                container.removeInteractive();
                m21Breaker.removeInteractive();
                sc.time.delayedCall(1000, function () {
                    AudioNarration.pause();
                    sc.time.delayedCall(2000, function () {
                        Sim.removeResources();
                        Sim.output.innerHTML = "";
                        Sim.game.scene.start("PrimaryBusBreakers");
                        sc.time.delayedCall(1000, function () {
                            sc.scene.stop("MainBusChallengeB");
                        }, [], sc);
                    }, [], sc);
                }, [], sc);
            });
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                if (Sim.incorrectCount > Sim.promptIncorrect) {
                    var rect1 = new Phaser.Geom.Rectangle();
                    rect1.setSize(44, 26);
                    rect1.setPosition(407, 432);
                    graphics.strokeRectShape(rect1);
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 0,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                }
                AudioNarration.currentTime = 132;
                AudioNarration.timeupdate = function () {
                    if (Math.floor(AudioNarration.currentTime) > 134) {
                        AudioNarration.pause();
                    }
                };
                AudioNarration.play();
                sc.time.delayedCall(2000, function () {
                    AudioNarration.pause();
                }, [], sc);
            });
        }, [], sc);
    };
    return MainBusChallengeB;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var PrimaryBusBreakers = /** @class */ (function (_super) {
    __extends(PrimaryBusBreakers, _super);
    function PrimaryBusBreakers() {
        var _this = _super.call(this, { key: "PrimaryBusBreakers" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    PrimaryBusBreakers.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
        this.load.image("abFlipped", "../public/images/A-B-flipped.png");
        this.load.image("bPrimaryBus", "../public/images/b-primary-bus.png");
    };
    PrimaryBusBreakers.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    PrimaryBusBreakers.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "PrimaryBusBreakers";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        Sim.output.innerHTML = "";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        var graphics2 = sc.add.graphics({});
        graphics2.lineStyle(4, 0xfaff77, 1.0);
        graphics2.setDepth(100);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        var rect3 = new Phaser.Geom.Rectangle();
        var rect4 = new Phaser.Geom.Rectangle();
        cam.zoomTo(1.2, 1000, 'Sine.easeInOut');
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 71;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 102) {
                AudioNarration.pause();
            }
        };
        sc.time.delayedCall(1000, function () {
            AudioNarration.play();
            Sim.output.innerHTML = "\n                <p>\n                Selecting either Bus A or B as the Primary Bus initiates a sequence of circuit breaker operations.\n                </p>\n                <p>\n                Selecting Bus A as Primary ensures that breakers T11 and G1A through G4A are closed, while breakers T21 and G1B through G4B are open. This sequence is reversed if Bus B is selected as the Primary. \n                </p>\n            ";
            sc.time.delayedCall(1500, function () {
                graphics.lineStyle(4, 0xfaff77, 1.0);
                graphics.setDepth(100);
                graphics.alpha = 0;
                rect1.setSize(78, 44);
                rect1.setPosition(382, 224);
                graphics.strokeRectShape(rect1);
                sc.add.tween({
                    targets: [graphics],
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 0,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
            }, [], sc);
            sc.time.delayedCall(8500, function () {
                graphics.clear();
                graphics.lineStyle(4, 0xfaff77, 1.0);
                graphics.setDepth(100);
                graphics2.clear();
                graphics2.lineStyle(4, 0xfaff77, 1.0);
                graphics2.setDepth(100);
                cam.zoomTo(1, 2000, 'Sine.easeInOut');
                sc.time.delayedCall(7000, function () {
                    graphics.lineStyle(4, 0xfaff77, 1.0);
                    graphics.setDepth(100);
                    graphics.alpha = 0;
                    graphics2.lineStyle(4, 0xfaff77, 1.0);
                    graphics2.setDepth(100);
                    graphics2.alpha = 0;
                    rect1.setSize(40, 22);
                    rect1.setPosition(510, 202);
                    graphics.strokeRectShape(rect1);
                    rect2.setSize(43, 115);
                    rect2.setPosition(410, 90);
                    graphics.strokeRectShape(rect2);
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 0,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                    graphics2.alpha = 0;
                    rect3.setSize(40, 22);
                    rect3.setPosition(510, 271);
                    graphics2.strokeRectShape(rect3);
                    rect4.setSize(43, 115);
                    rect4.setPosition(410, 310);
                    graphics2.strokeRectShape(rect4);
                    sc.add.tween({
                        targets: [graphics2],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 5500,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                }, [], sc);
                sc.time.delayedCall(20000, function () {
                    var bPrimaryBus = sc.add.image(0, 0, "bPrimaryBus");
                    bPrimaryBus.setOrigin(0, 0);
                    bPrimaryBus.setDisplaySize(width, height);
                    bPrimaryBus.alpha = 0;
                    container.add(bPrimaryBus);
                    sc.add.tween({
                        targets: [bPrimaryBus],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 100,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        },
                        onComplete: function () {
                            var abFlipped = sc.add.image(412, 245, "abFlipped");
                            abFlipped.setOrigin(0, 0);
                            abFlipped.setDisplaySize(12, 19);
                            abFlipped.alpha = 0;
                            container.add(abFlipped);
                            sc.add.tween({
                                targets: [abFlipped, bPrimaryBus],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 3000,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 0; }
                                },
                                onComplete: function () {
                                    sc.time.delayedCall(1000, function () {
                                        Sim.removeResources();
                                        Sim.output.innerHTML = "";
                                        Sim.game.scene.start("GenTieBreakerChallenge");
                                        sc.time.delayedCall(1000, function () {
                                            sc.scene.stop("PrimaryBusBreakers");
                                        }, [], sc);
                                    }, [], sc);
                                }
                            });
                        }
                    });
                }, [], sc);
            }, [], sc);
        }, [], sc);
    };
    return PrimaryBusBreakers;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var GenTieBreakerChallenge = /** @class */ (function (_super) {
    __extends(GenTieBreakerChallenge, _super);
    function GenTieBreakerChallenge() {
        var _this = _super.call(this, { key: "GenTieBreakerChallenge" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    GenTieBreakerChallenge.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
        this.load.image("abGrayed", "../public/images/A-B-grayed.png");
    };
    GenTieBreakerChallenge.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    GenTieBreakerChallenge.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "GenTieBreakerChallenge";
        Sim.incorrectCount = 0;
        var cam = this.cameras.main;
        var sc = this;
        Sim.output.innerHTML = "";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var abGrayed = sc.add.image(412.3, 245, "abGrayed");
        abGrayed.setOrigin(0, 0);
        abGrayed.setDisplaySize(12.2, 17.7);
        container.add(abGrayed);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        container.add(graphics);
        Sim.output.innerHTML = "\n            <p>\n            Looking at the series of generator tie breakers, what is the primary bus selection set to?\n            </p>\n        ";
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 192;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 199) {
                AudioNarration.pause();
            }
        };
        AudioNarration.play();
        container.removeInteractive();
        sc.time.delayedCall(4000, function () {
            cam.zoomTo(1.2, 2000, 'Sine.easeInOut');
            sc.time.delayedCall(4000, function () {
                AudioNarration.pause();
                container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
                container.on('pointerup', function (gameObject) {
                    if ((gameObject.downX >= 359 && gameObject.downX <= 376) &&
                        (gameObject.downY >= 235 && gameObject.downY <= 245)) {
                        Sim.showFeedBack(true, gameObject);
                        graphics.setAlpha(0);
                        AudioNarration.currentTime = 140;
                        AudioNarration.timeupdate = function () {
                            if (Math.floor(AudioNarration.currentTime) > 142) {
                                AudioNarration.pause();
                            }
                        };
                        AudioNarration.play();
                        container.removeInteractive();
                        sc.time.delayedCall(1000, function () {
                            abGrayed.destroy();
                            AudioNarration.pause();
                            sc.time.delayedCall(1000, function () {
                                cam.zoomTo(1, 2000, 'Sine.easeInOut');
                                Sim.removeResources();
                                Sim.output.innerHTML = "";
                                sc.time.delayedCall(2500, function () {
                                    Sim.output.innerHTML = "";
                                    Sim.game.scene.start("DieselGenerators");
                                }, [], sc);
                                sc.time.delayedCall(3500, function () {
                                    sc.scene.stop("GenTieBreakerChallenge");
                                }, [], sc);
                            }, [], sc);
                        }, [], sc);
                    }
                    else {
                        Sim.showFeedBack(false, gameObject);
                        Sim.incorrectCount++;
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            var rect1 = new Phaser.Geom.Rectangle();
                            rect1.setSize(18, 17);
                            rect1.setPosition(386, 238);
                            graphics.strokeRectShape(rect1);
                            sc.add.tween({
                                targets: [graphics],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 0; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        AudioNarration.currentTime = 132;
                        AudioNarration.timeupdate = function () {
                            if (Math.floor(AudioNarration.currentTime) > 134) {
                                AudioNarration.pause();
                            }
                        };
                        AudioNarration.play();
                    }
                });
            }, [], sc);
        }, [], sc);
    };
    return GenTieBreakerChallenge;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var DieselGenerators = /** @class */ (function (_super) {
    __extends(DieselGenerators, _super);
    function DieselGenerators() {
        var _this = _super.call(this, { key: "DieselGenerators" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    DieselGenerators.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
        this.load.image("abFlipped", "../public/images/A-B-flipped.png");
        this.load.image("bPrimaryBus", "../public/images/b-primary-bus.png");
    };
    DieselGenerators.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    DieselGenerators.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "DieselGenerators";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        Sim.output.innerHTML = "";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        var graphics2 = sc.add.graphics({});
        graphics2.lineStyle(4, 0xfaff77, 1.0);
        graphics2.setDepth(100);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        var rect3 = new Phaser.Geom.Rectangle();
        var rect4 = new Phaser.Geom.Rectangle();
        cam.setZoom(1);
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 105;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 115.5) {
                AudioNarration.pause();
            }
        };
        sc.time.delayedCall(1000, function () {
            AudioNarration.play();
            Sim.output.innerHTML = "\n                <p>\n                    While the system is in Dual Utility Mode, the diesel generators are off, and the Generator Main and Load Bank Breakers are open.\n                </p>\n            ";
            graphics.clear();
            graphics.lineStyle(4, 0xfaff77, 1.0);
            graphics.setDepth(100);
            graphics.alpha = 0;
            graphics2.clear();
            graphics2.lineStyle(4, 0xfaff77, 1.0);
            graphics2.setDepth(100);
            graphics2.alpha = 0;
            rect1.setSize(90, 252);
            rect1.setPosition(76, 142);
            graphics.strokeRectShape(rect1);
            rect2.setSize(32, 230);
            rect2.setPosition(198, 166);
            graphics2.strokeRectShape(rect2);
            rect3.setSize(36, 232);
            rect3.setPosition(234, 138);
            graphics2.strokeRectShape(rect3);
            sc.add.tween({
                targets: [graphics],
                ease: 'Sine.easeInOut',
                duration: 500,
                delay: 4000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            sc.add.tween({
                targets: [graphics2],
                ease: 'Sine.easeInOut',
                duration: 500,
                delay: 7000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                },
                onComplete: function () {
                    sc.time.delayedCall(3000, function () {
                        graphics.clear();
                        graphics2.clear();
                    }, [], sc);
                    sc.time.delayedCall(3000, function () {
                        Sim.removeResources();
                        Sim.output.innerHTML = "";
                        Sim.game.scene.start("FullUtilityEnd");
                        sc.scene.stop("DieselGenerators");
                    }, [], sc);
                }
            });
        }, [], sc);
    };
    return DieselGenerators;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var FullUtilityEnd = /** @class */ (function (_super) {
    __extends(FullUtilityEnd, _super);
    function FullUtilityEnd() {
        var _this = _super.call(this, { key: "FullUtilityEnd" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FullUtilityEnd.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_final_frame.png");
    };
    FullUtilityEnd.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    FullUtilityEnd.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FullUtilityEnd";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 116;
        sc.time.delayedCall(1000, function () {
            Sim.output.innerHTML = "\n                <p>\n                The system is now in Dual Utility Mode, waiting to react to a Utility outage.\n                </p>\n            ";
            AudioNarration.play();
            sc.time.delayedCall(7000, function () {
                Sim.removeResources();
                Sim.output.innerHTML = "";
                cam.fadeOut(500);
                sc.time.delayedCall(600, function () {
                    Sim.currentScene = "";
                    sc.scene.stop("FullUtilityEnd");
                    Sim.output.innerHTML = "";
                    Sim.setComplete();
                }, [], sc);
            }, [], sc);
        }, [], sc);
    };
    return FullUtilityEnd;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var SingleUtililtyFailureIntro = /** @class */ (function (_super) {
    __extends(SingleUtililtyFailureIntro, _super);
    function SingleUtililtyFailureIntro() {
        var _this = _super.call(this, { key: "SingleUtililtyFailureIntro" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleUtililtyFailureIntro.prototype.preload = function () {
        this.load.image("UCC_Console_Zoom_T21_Open_end", "../public/images/UCC_Console_Zoom_T21_Open_end.png");
    };
    SingleUtililtyFailureIntro.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleUtililtyFailureIntro.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            During this lesson, you will be able to recognize an equipment failure of the 50/60 Hertz Static Frequency Converter,\n            which leads to a single loss of utility power. \n        ";
        Sim.currentScene = "SingleUtililtyFailureIntro";
        var cam = this.cameras.main;
        var sc = this;
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('UCC_Console_Zoom_T21_Open');
        VideoAnimation.currentTime = 0;
        VideoAnimation.playbackRate = 1.0;
        var container = this.add.container(0, 0);
        var UCC_Console_Zoom_T21_Open_end = this.add.image(0, 0, "UCC_Console_Zoom_T21_Open_end");
        UCC_Console_Zoom_T21_Open_end.setOrigin(0, 0);
        UCC_Console_Zoom_T21_Open_end.setDisplaySize(width, height);
        container.add(UCC_Console_Zoom_T21_Open_end);
        VideoAnimation.ended = function () {
            VideoAnimation.ended = null;
            var rect1 = new Phaser.Geom.Rectangle();
            graphics.alpha = 0;
            rect1.setSize(30, 38);
            rect1.setPosition(244, 34);
            graphics.strokeRectShape(rect1);
            container.add(graphics);
            sc.time.delayedCall(1000, function () {
                sc.add.tween({
                    targets: [graphics],
                    ease: 'Sine.easeInOut',
                    duration: 500,
                    delay: 500,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        sc.time.delayedCall(6000, function () {
                            graphics.clear();
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            Sim.game.scene.start("UtilityADetail");
                            sc.time.delayedCall(1000, function () {
                                sc.scene.stop("SingleUtilityFailureIntro");
                                UCC_Console_Zoom_T21_Open_end.destroy();
                            }, [], _this);
                        }, [], sc);
                    }
                });
            }, [], sc);
        };
        VideoAnimation.play();
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 10) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 0;
        sc.time.delayedCall(500, function () {
            AudioNarration.play();
            ;
        }, [], sc);
    };
    return SingleUtililtyFailureIntro;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var UtilityADetail = /** @class */ (function (_super) {
    __extends(UtilityADetail, _super);
    function UtilityADetail() {
        var _this = _super.call(this, { key: "UtilityADetail" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    UtilityADetail.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.png");
    };
    UtilityADetail.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    UtilityADetail.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "UtilityADetail";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('UCC_Monitor_Pan_Center_to_Left_T21_Open');
        VideoAnimation.currentTime = 1;
        VideoAnimation.playbackRate = 0.4;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end);
        VideoAnimation.ended = function () {
            VideoAnimation.destroy();
            var graphics = sc.add.graphics({});
            graphics.lineStyle(4, 0xfaff77, 1.0);
            graphics.setDepth(100);
            graphics.alpha = 0;
            container.add(graphics);
            var rect1 = new Phaser.Geom.Rectangle();
            rect1.setSize(38, 62);
            rect1.setPosition(662, 150);
            graphics.strokeRectShape(rect1);
            sc.time.delayedCall(1700, function () {
                cam.zoomTo(1.25, 2000, 'Sine.easeIn', false, function (cam, progress) {
                    if (progress == 1) {
                        sc.add.tween({
                            targets: [graphics],
                            ease: 'Sine.easeInOut',
                            duration: 500,
                            delay: 1000,
                            alpha: {
                                getStart: function () { return 0; },
                                getEnd: function () { return 1; }
                            },
                            onComplete: function () {
                                sc.time.delayedCall(10500, function () {
                                    Sim.removeResources();
                                    Sim.output.innerHTML = "";
                                    Sim.game.scene.start("FiftySixtyConverter");
                                    sc.time.delayedCall(1000, function () {
                                        sc.scene.stop("UtilityADetail");
                                    }, [], sc);
                                }, [], sc);
                            }
                        });
                    }
                });
            }, [], sc);
        };
        VideoAnimation.play();
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 31) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 11;
        sc.time.delayedCall(1000, function () {
            Sim.output.innerHTML = "\n                As power enters the Mission Critical Power Enclosure,\n                the 50/60 Hertz Static Frequency Converters convert frequency from 50 to 60 Hertz \n                and the voltage from 1728 volts to 1463 volts.\n            ";
            AudioNarration.play();
        }, [], sc);
    };
    ;
    return UtilityADetail;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var FiftySixtyConverter = /** @class */ (function (_super) {
    __extends(FiftySixtyConverter, _super);
    function FiftySixtyConverter() {
        var _this = _super.call(this, { key: "FiftySixtyConverter" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FiftySixtyConverter.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.png");
        this.load.image("staticFrequencyConverter", "../public/images/50_60Hz_Static_Frequency_Converter_Large.png");
    };
    FiftySixtyConverter.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    FiftySixtyConverter.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FiftySixtyConverter";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, -50, 2000, 2000);
        cam.setZoom(1.25);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end);
        sc.time.delayedCall(1000, function () {
            cam.zoomTo(1.0, 2000, 'Sine.easeIn', false, function (cam, progress) {
                if (progress == 1) {
                    var UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end_1 = _this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end");
                    UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end_1.setOrigin(0, 0);
                    UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end_1.setDisplaySize(width, height);
                    UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end_1.alpha = 0;
                    sc.add.tween({
                        targets: [UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end_1],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 7000,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                    sc.time.delayedCall(10500, function () {
                        cam.fadeOut(300);
                        cam.once('camerafadeoutcomplete', function (cam) {
                            var staticFrequencyConverter = this.add.image(0, 18, "staticFrequencyConverter");
                            staticFrequencyConverter.setOrigin(0, 0);
                            staticFrequencyConverter.setDisplaySize(width, height);
                            UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.alpha = 0;
                            UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end_1.alpha = 0;
                            cam.fadeIn(300);
                            cam.once('camerafadeincomplete', function (cam) {
                                var _this = this;
                                cam.zoomTo(1.8, 2000);
                                cam.pan(840, -40, 2000);
                                sc.time.delayedCall(4000, function () {
                                    cam.fadeOut(300);
                                    cam.once('camerafadeoutcomplete', function (cam) {
                                        Sim.removeResources();
                                        Sim.output.innerHTML = "";
                                        Sim.game.scene.start("CSOOW");
                                        sc.time.delayedCall(800, function () {
                                            sc.scene.stop("FiftySixtyConverter");
                                        }, [], sc);
                                    }, _this);
                                }, [], sc);
                            }, this);
                        }, _this);
                    }, [], sc);
                }
            });
        }, [], sc);
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 41.5) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 34;
        sc.time.delayedCall(3000, function () {
            Sim.output.innerHTML = "\n                A building alarm has been received, notifying you that there has been a failure \n                in the A side Utility Power.\n            ";
            AudioNarration.play();
            ;
        }, [], sc);
    };
    ;
    return FiftySixtyConverter;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var CSOOW = /** @class */ (function (_super) {
    __extends(CSOOW, _super);
    function CSOOW() {
        var _this = _super.call(this, { key: "CSOOW" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    CSOOW.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png");
        this.load.image("csoow", "../public/images/CSOOW.png");
        this.load.image("operator", "../public/images/Chief_Still.png");
    };
    CSOOW.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    CSOOW.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "CSOOW";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.fadeOut = true;
        VideoAnimation.initialize('UCC_Monitor_Pan_Left_to_Center_60Hz_Unacknowledged');
        VideoAnimation.currentTime = 1;
        VideoAnimation.playbackRate = 0.4;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.alpha = 0;
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end);
        sc.add.tween({
            targets: [UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end],
            ease: 'Sine.easeInOut',
            duration: 800,
            delay: 10,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        sc.time.delayedCall(6000, function () {
            var csoow = _this.add.image(20, 20, "csoow");
            csoow.setOrigin(0, 0);
            csoow.alpha = 0;
            sc.add.tween({
                targets: [csoow],
                ease: 'Sine.easeInOut',
                duration: 1250,
                delay: 1500,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            sc.add.tween({
                targets: [container],
                ease: 'Sine.easeInOut',
                duration: 1250,
                delay: 1500,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return .6; }
                }
            });
            sc.add.tween({
                targets: [container],
                ease: 'Sine.easeInOut',
                duration: 1250,
                delay: 1500,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return .6; }
                }
            });
            var operator = _this.add.image(842, 20, "operator");
            operator.setOrigin(0, 0);
            operator.alpha = 0;
            sc.add.tween({
                targets: [operator],
                ease: 'Sine.easeInOut',
                duration: 1250,
                delay: 5000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            sc.time.delayedCall(11000, function () {
                sc.add.tween({
                    targets: [container],
                    ease: 'Sine.easeInOut',
                    duration: 1250,
                    delay: 10,
                    alpha: {
                        getStart: function () { return .6; },
                        getEnd: function () { return 1; }
                    }
                });
                sc.add.tween({
                    targets: [csoow, operator],
                    ease: 'Sine.easeInOut',
                    duration: 1250,
                    delay: 10,
                    alpha: {
                        getStart: function () { return 1; },
                        getEnd: function () { return 0; }
                    }
                });
                sc.time.delayedCall(2000, function () {
                    var container = _this.add.container(0, 0);
                    var UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start = _this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start");
                    UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setOrigin(0, 0);
                    UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setDisplaySize(width, height);
                    container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start);
                    VideoAnimation.ended = function () {
                        Sim.removeResources();
                        Sim.output.innerHTML = "";
                        Sim.game.scene.start("UCCMainFaulted");
                        sc.scene.stop("CSOOW");
                    };
                    VideoAnimation.play();
                }, [], sc);
            }, [], sc);
        }, [], sc);
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 56) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 42;
        sc.time.delayedCall(1000, function () {
            Sim.output.innerHTML = "\n                As with any anomaly or failure in the Support Building system, your first step is to notify the Combat Systems Officer of the Watch, or CSOOW.\n                \"Sir. There is a building alarm for the A side Utility Power\".\n            ";
            AudioNarration.play();
        }, [], sc);
    };
    ;
    return CSOOW;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var UCCMainFaulted = /** @class */ (function (_super) {
    __extends(UCCMainFaulted, _super);
    function UCCMainFaulted() {
        var _this = _super.call(this, { key: "UCCMainFaulted" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    UCCMainFaulted.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png");
    };
    UCCMainFaulted.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    UCCMainFaulted.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            Back at the Universal Control Console, you verify what component failed \n            and make sure that the proper sequencing steps have taken place. \n            As you follow the A side Utility Power, you notice that the circuit breakers before \n            and after the 50/60 Hertz Static Frequency Converter are now open, and the line is deenergized. \n        ";
        Sim.currentScene = "UCCMainFaulted";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.alpha = 0;
        container.add(graphics);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(342, 62);
        rect1.setPosition(4, 26);
        graphics.strokeRectShape(rect1);
        sc.add.tween({
            targets: [graphics],
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 11000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                sc.time.delayedCall(2000, function () {
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 500,
                        delay: 10,
                        alpha: {
                            getStart: function () { return 1; },
                            getEnd: function () { return 0; }
                        },
                        onComplete: function () {
                            graphics.clear();
                        }
                    });
                    var graphics2 = sc.add.graphics({});
                    graphics2.lineStyle(4, 0xfaff77, 1.0);
                    graphics2.alpha = 0;
                    graphics2.setDepth(100);
                    var rect2 = new Phaser.Geom.Rectangle();
                    rect2.setSize(30, 25);
                    rect2.setPosition(126, 37);
                    graphics2.strokeRectShape(rect2);
                    var rect3 = new Phaser.Geom.Rectangle();
                    rect2.setSize(30, 25);
                    rect2.setPosition(305, 37);
                    graphics2.strokeRectShape(rect2);
                    var rect4 = new Phaser.Geom.Rectangle();
                    rect2.setSize(30, 25);
                    rect2.setPosition(450, 43);
                    graphics2.strokeRectShape(rect2);
                    sc.add.tween({
                        targets: [graphics2],
                        ease: 'Sine.easeInOut',
                        duration: 500,
                        delay: 1000,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        },
                        onComplete: function () {
                            sc.time.delayedCall(10000, function () {
                                sc.add.tween({
                                    targets: [graphics2],
                                    ease: 'Sine.easeInOut',
                                    duration: 500,
                                    delay: 10,
                                    alpha: {
                                        getStart: function () { return 1; },
                                        getEnd: function () { return 0; }
                                    },
                                    onComplete: function () {
                                        graphics2.clear();
                                        Sim.removeResources();
                                        Sim.output.innerHTML = "";
                                        Sim.game.scene.start("KnowledgeQuestion1");
                                        sc.scene.stop("UCCMainFaulted");
                                    }
                                });
                            }, [], sc);
                        }
                    });
                }, [], sc);
            }
        });
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 81) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 58;
        AudioNarration.play();
    };
    return UCCMainFaulted;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
/// <reference path="../../KnowledgeQuestion.ts" />
var KnowledgeQuestion1 = /** @class */ (function (_super) {
    __extends(KnowledgeQuestion1, _super);
    function KnowledgeQuestion1() {
        var _this = _super.call(this, { key: "KnowledgeQuestion1" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'What is the first step you should take after noticing a building alert?';
        _this.answers = [
            'Reset the machine.',
            'Transition to diesel generated power.',
            'Alert the Combat Systems Officer Of the Watch (CSOOW).',
            'Shut down the UCC.'
        ];
        _this.correct = 2;
        return _this;
    }
    KnowledgeQuestion1.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png");
    };
    KnowledgeQuestion1.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    KnowledgeQuestion1.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            What is the first step you should take after noticing a building alert?\n        ";
        Sim.currentScene = "KnowledgeQuestion1";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start);
        AudioNarration.initialize('Challenge_Questions_02');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 4) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestion();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswer = this.correct;
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
    };
    KnowledgeQuestion1.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('fullUtilityAudio');
        audio.currentTime = 139;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    KnowledgeQuestion1.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('fullUtilityAudio');
        audio.currentTime = 145;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
        }, [], this);
    };
    return KnowledgeQuestion1;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var M11T21Verify = /** @class */ (function (_super) {
    __extends(M11T21Verify, _super);
    function M11T21Verify() {
        var _this = _super.call(this, { key: "M11T21Verify" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    M11T21Verify.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png");
    };
    M11T21Verify.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    M11T21Verify.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            As part of the automated sequencing for the system to switch to single utility power,\n            you verify that the M11 circuit breaker is now open and the T21 circuit breaker is now closed.\n            This allows the B side Utility Power to support the entire system.\n        ";
        Sim.currentScene = "M11T21Verify";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.alpha = 0;
        container.add(graphics);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(42, 18);
        rect1.setPosition(410, 62);
        graphics.strokeRectShape(rect1);
        var graphics2 = sc.add.graphics({});
        graphics2.lineStyle(4, 0xfaff77, 1.0);
        graphics2.setDepth(100);
        graphics2.alpha = 0;
        container.add(graphics2);
        var rect2 = new Phaser.Geom.Rectangle();
        rect2.setSize(42, 19);
        rect2.setPosition(510, 274);
        graphics2.strokeRectShape(rect2);
        sc.add.tween({
            targets: [graphics],
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 8000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                sc.add.tween({
                    targets: [graphics2],
                    ease: 'Sine.easeInOut',
                    duration: 500,
                    delay: 2000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        sc.time.delayedCall(10000, function () {
                            graphics.clear();
                            graphics2.clear();
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            Sim.game.scene.start("LocateManual");
                            sc.time.delayedCall(1000, function () {
                                sc.scene.stop("M11T21Verify");
                            }, [], sc);
                        }, [], sc);
                    }
                });
            }
        });
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 102) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 83;
        AudioNarration.play();
    };
    return M11T21Verify;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var LocateManual = /** @class */ (function (_super) {
    __extends(LocateManual, _super);
    function LocateManual() {
        var _this = _super.call(this, { key: "LocateManual" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    LocateManual.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.png");
    };
    LocateManual.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    LocateManual.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            Locate the ABB 50/60 Hertz Converter Operation and Maintenance Manual and notify the maintainer on duty of the component failure.\n        ";
        setTimeout(function () {
            if (Sim.referenceDisplayed == false) {
                parent.document.getElementById('btnReference').setAttribute('disabled', 'disabled');
                parent.document.getElementById('btnForward')['disabled'] = true;
            }
            else {
                parent.document.getElementById('btnForward')['disabled'] = false;
            }
        }, 1500);
        Sim.currentScene = "LocateManual";
        var cam = this.cameras.main;
        var sc = this;
        var highlight;
        var refButton = sc.$('#btnReference', parent.document);
        var refButton_offset = refButton.offset();
        var refButton_PosX = Math.floor(refButton_offset.left);
        var myOffset;
        var sideBarLeft = parseInt(getComputedStyle(parent.document.querySelector(".sidebar")).left);
        if (sideBarLeft < 0) { // LMS version
            myOffset = 0;
        }
        else {
            myOffset = refButton_PosX - 1136;
        }
        cam.setBounds(0, 0, 2000, 2000);
        VideoAnimation.initialize('UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged');
        VideoAnimation.currentTime = 1;
        VideoAnimation.playbackRate = 0.4;
        VideoAnimation.fadeOut;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.alpha = 0;
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end);
        sc.$('.abb', parent.document).click(function () {
            try {
                highlight.hide();
            }
            catch (e) {
            }
            AudioNarration.destroy();
            sc.$(".close", parent.document).click();
            sc.time.delayedCall(2000, function () {
                UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.alpha = 1;
                VideoAnimation.ended = function () {
                    parent.document.getElementById('btnForward')['disabled'] = false;
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("StartSFCDetail");
                    sc.time.delayedCall(1000, function () {
                        sc.scene.stop("LocateManual");
                    }, [], sc);
                };
                VideoAnimation.play();
            }, [], sc);
        });
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 124) {
                AudioNarration.pause();
                Sim.output.innerHTML = "\n                    In the Reference section, open the ABB 50/60 Hertz Converter Operation and Maintenance Manual.\n                ";
                AudioNarration.destroy();
                AudioNarration.initialize('Challenge_Questions_ALT_LINE_01');
                AudioNarration.play();
                AudioNarration.currentTime = 0;
                highlight = new Highlight();
                highlight.width = 104;
                highlight.height = 34;
                //highlight.x = 1136;
                highlight.x = refButton_PosX - myOffset;
                highlight.y = 10;
                highlight.blink = true;
                highlight.show();
                parent.document.getElementById('btnReference').removeAttribute('disabled');
            }
        };
        AudioNarration.currentTime = 114;
        AudioNarration.play();
    };
    return LocateManual;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var Deenergized5060Converter = /** @class */ (function (_super) {
    __extends(Deenergized5060Converter, _super);
    function Deenergized5060Converter() {
        var _this = _super.call(this, { key: "Deenergized5060Converter" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    Deenergized5060Converter.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ucc_console_powered_zoom_end.png");
        this.load.image("uccMainFaulted", "../public/images/uccMainFaulted.png");
    };
    Deenergized5060Converter.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    Deenergized5060Converter.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            By isolating the deenergized portion of the system, you have determined that the fault lies in the A side 50/60 Hertz Static Frequency Converter. \n        ";
        Sim.currentScene = "Deenergized5060Converter";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var uccMainFaulted = this.add.image(130, 29, "uccMainFaulted");
        uccMainFaulted.setOrigin(0, 0);
        uccMainFaulted.setDisplaySize(348, 55);
        container.add(uccMainFaulted);
        sc.time.delayedCall(10500, function () {
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("LocateManual");
            sc.time.delayedCall(1000, function () {
                sc.scene.stop("Deenergized5060Converter");
            }, [], sc);
        }, [], sc);
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 112.5) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 103;
        AudioNarration.play();
    };
    return Deenergized5060Converter;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var StartSFCDetail = /** @class */ (function (_super) {
    __extends(StartSFCDetail, _super);
    function StartSFCDetail() {
        var _this = _super.call(this, { key: "StartSFCDetail" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    StartSFCDetail.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.png");
        this.load.image("startSFC", "../public/images/start_sfc.png");
        this.load.image("startSFCButton", "../public/images/start_sfc_button.png");
    };
    StartSFCDetail.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    StartSFCDetail.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "StartSFCDetail";
        Sim.incorrectCount = 0;
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, -50, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end);
        var startSFC = this.add.image(0, 0, "startSFC");
        startSFC.setOrigin(0, 0);
        startSFC.alpha = 0;
        startSFC.setDisplaySize(107, 152);
        startSFC.x = 271;
        startSFC.y = 65;
        container.add(startSFC);
        var startSFCButton = this.add.image(0, 0, "startSFCButton");
        startSFCButton.setOrigin(0, 0);
        startSFCButton.setAlpha(0);
        startSFCButton.x = 275;
        startSFCButton.y = 170;
        container.add(startSFCButton);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        container.add(graphics);
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        sc.add.tween({
            targets: [startSFC],
            ease: 'Sine.easeInOut',
            duration: 800,
            delay: 22000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                startSFCButton.setAlpha(1);
                startSFCButton.setInteractive();
                startSFCButton.once('pointerup', function (gameObject) {
                    graphics.setAlpha(0);
                    Sim.output.innerHTML = "\n                        The next step is to verify the repair on the console screen and to initiate a transfer to full utility power.\n                    ";
                    var UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end = sc.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end");
                    UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.setOrigin(0, 0);
                    UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.setDisplaySize(width, height);
                    UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.alpha = 0;
                    container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end);
                    sc.add.tween({
                        targets: [UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end],
                        ease: 'Sine.easeInOut',
                        duration: 800,
                        delay: 500,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        },
                        onComplete: function () {
                            UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.destroy();
                        }
                    });
                    AudioNarration.initialize('singleUtilityFiftySixtyAudio');
                    AudioNarration.currentTime = 133;
                    AudioNarration.play();
                    Sim.showFeedBack(true, gameObject);
                    sc.add.tween({
                        targets: [startSFC],
                        ease: 'Sine.easeInOut',
                        duration: 750,
                        delay: 10,
                        alpha: {
                            getStart: function () { return 1; },
                            getEnd: function () { return 0; }
                        }
                    });
                    container.removeInteractive();
                    startSFCButton.removeInteractive();
                    sc.time.delayedCall(7000, function () {
                        sc.time.delayedCall(1000, function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            Sim.game.scene.start("ASideRestarted");
                            sc.time.delayedCall(1000, function () {
                                sc.scene.stop("StartSFCDetail");
                            }, [], sc);
                        }, [], sc);
                    }, [], sc);
                });
                container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
                container.on('pointerup', function (gameObject) {
                    Sim.showFeedBack(false, gameObject);
                    Sim.incorrectCount++;
                    if (Sim.incorrectCount > Sim.promptIncorrect) {
                        var rect1 = new Phaser.Geom.Rectangle();
                        rect1.setSize(50, 34);
                        rect1.setPosition(272, 168);
                        graphics.strokeRectShape(rect1);
                        sc.add.tween({
                            targets: [graphics],
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            delay: 0,
                            alpha: {
                                getStart: function () { return 0; },
                                getEnd: function () { return 1; }
                            }
                        });
                    }
                });
            }
        });
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 132) {
                AudioNarration.pause();
                AudioNarration.destroy();
                playOtherAudio();
            }
        };
        function playOtherAudio() {
            AudioNarration.initialize('Four_Hundred_Hz_Challenge_Questions');
            AudioNarration.currentTime = 21;
            Sim.output.innerHTML = "\n                    At this point, you can either restart the Static Frequency Converter (SFC) manually, \n                    or by using the Universal Control Console (UCC).\n\n\n                    Start the SFC using the dialog box on the UCC.\n            ";
            AudioNarration.timeupdate = function () {
                if (AudioNarration.currentTime > 37) {
                    AudioNarration.destroy();
                }
            };
            AudioNarration.play();
        }
        Sim.output.innerHTML = "\n                The maintainer has notified you that the 50/60 Hertz Static Frequency Converter has been repaired.\n        ";
        AudioNarration.currentTime = 126;
        AudioNarration.play();
    };
    ;
    return StartSFCDetail;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var ASideRestarted = /** @class */ (function (_super) {
    __extends(ASideRestarted, _super);
    function ASideRestarted() {
        var _this = _super.call(this, { key: "ASideRestarted" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    ASideRestarted.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start.png");
    };
    ASideRestarted.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    ASideRestarted.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "ASideRestarted";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('UCC_Monitor_Pan_Left_to_Center_60Hz_Critical_Condition');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 0.4;
        VideoAnimation.currentTime = 1;
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 151) {
                AudioNarration.pause();
            }
        };
        Sim.output.innerHTML = "\n            Looking at the A side Utility Power, you now see that the system is energized,\n            and all breakers are closed except M11. \n        ";
        sc.time.delayedCall(1000, function () {
            AudioNarration.play();
            AudioNarration.audio.currentTime = 141;
        }, [], sc);
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start);
        VideoAnimation.ended = function () {
            var graphics = sc.add.graphics({});
            graphics.lineStyle(4, 0xfaff77, 1.0);
            graphics.setDepth(100);
            graphics.alpha = 0;
            container.add(graphics);
            var rect1 = new Phaser.Geom.Rectangle();
            rect1.setSize(42, 18);
            rect1.setPosition(410, 62);
            graphics.strokeRectShape(rect1);
            sc.add.tween({
                targets: [graphics],
                ease: 'Sine.easeInOut',
                duration: 500,
                delay: 4000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            sc.time.delayedCall(8000, function () {
                graphics.clear();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("TransferSourceConclusion");
                sc.time.delayedCall(1000, function () {
                    sc.scene.stop("ASideRestarted");
                }, [], sc);
            }, [], sc);
        };
        VideoAnimation.play();
    };
    ;
    return ASideRestarted;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var TransferSourceConclusion = /** @class */ (function (_super) {
    __extends(TransferSourceConclusion, _super);
    function TransferSourceConclusion() {
        var _this = _super.call(this, { key: "TransferSourceConclusion" }) || this;
        _this.resources = [
            'singleUtilityFiftySixtyAudio'
        ];
        _this.$ = window["jQuery"];
        return _this;
    }
    TransferSourceConclusion.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start.png");
        this.load.image("UCC_Console_Zoom_T21_Open_end", "../public/images/UCC_Console_Zoom_T21_Open_end.png");
        this.load.image("transferDialog", "../public/images/transfer_dialog.png");
    };
    TransferSourceConclusion.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    TransferSourceConclusion.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "TransferSourceConclusion";
        Sim.incorrectCount = 0;
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start");
        UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start);
        var UCC_Console_Zoom_T21_Open_end = this.add.image(0, 0, "UCC_Console_Zoom_T21_Open_end");
        UCC_Console_Zoom_T21_Open_end.alpha = 0;
        UCC_Console_Zoom_T21_Open_end.setDisplaySize(width, height);
        UCC_Console_Zoom_T21_Open_end.setOrigin(0, 0);
        container.add(UCC_Console_Zoom_T21_Open_end);
        var transferDialog = this.add.image(271, 65, "transferDialog");
        transferDialog.setOrigin(0, 0);
        transferDialog.alpha = 0;
        transferDialog.setDisplaySize(107, 152);
        container.add(transferDialog);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.alpha = 0;
        container.add(graphics);
        var rect2 = new Phaser.Geom.Rectangle();
        rect2.setSize(50, 28);
        rect2.setPosition(272, 183);
        sc.add.tween({
            targets: [transferDialog],
            ease: 'Sine.easeInOut',
            duration: 1250,
            delay: 3000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        AudioNarration.initialize('singleUtilityFiftySixtyAudio');
        sc.time.delayedCall(10000, function () {
            var startSFCButton = _this.add.image(0, 0, "startSFCButton");
            startSFCButton.setOrigin(0, 0);
            startSFCButton.x = 275;
            startSFCButton.y = 170;
            startSFCButton.setInteractive();
            startSFCButton.once('pointerup', function (gameObject) {
                graphics.clear();
                graphics.lineStyle(4, 0xfaff77, 1.0);
                graphics.setDepth(100);
                graphics.alpha = 0;
                Sim.output.innerHTML = "\n                    The M11 circuit breaker will close, and the system is now in full utility mode waiting for a fault to occur.\n                ";
                AudioNarration.currentTime = 162.5;
                AudioNarration.timeupdate = function () {
                    if (Math.floor(AudioNarration.currentTime) >= 172) {
                        AudioNarration.pause();
                    }
                };
                AudioNarration.play();
                var rect1 = new Phaser.Geom.Rectangle();
                rect1.setSize(42, 18);
                rect1.setPosition(410, 62);
                graphics.strokeRectShape(rect1);
                sc.add.tween({
                    targets: [graphics],
                    ease: 'Sine.easeInOut',
                    duration: 500,
                    delay: 1000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
                Sim.showFeedBack(true, gameObject);
                sc.add.tween({
                    targets: [transferDialog],
                    ease: 'Sine.easeInOut',
                    duration: 750,
                    delay: 10,
                    alpha: {
                        getStart: function () { return 1; },
                        getEnd: function () { return 0; }
                    },
                    onComplete: function () {
                    }
                });
                sc.add.tween({
                    targets: [UCC_Console_Zoom_T21_Open_end],
                    ease: 'Sine.easeInOut',
                    duration: 1250,
                    delay: 3000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
                container.removeInteractive();
                startSFCButton.removeInteractive();
                sc.time.delayedCall(9500, function () {
                    sc.time.delayedCall(1000, function () {
                        Sim.removeResources();
                        graphics.clear();
                        Sim.output.innerHTML = "";
                        Sim.currentScene = "";
                        sc.time.delayedCall(1000, function () {
                            sc.scene.stop("TransferSourceConclusion");
                            Sim.setComplete();
                        }, [], sc);
                    }, [], sc);
                }, [], sc);
            });
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                if (Sim.incorrectCount > Sim.promptIncorrect) {
                    graphics.strokeRectShape(rect2);
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 0,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                }
            });
        }, [], sc);
        var timeSlot = 1;
        AudioNarration.timeupdate = function () {
            if (AudioNarration.currentTime >= 162.5) {
                AudioNarration.pause();
            }
        };
        Sim.output.innerHTML = "\n            In the transfer source pop-up box, initiate the change to full utility power by selecting the \u201CTO UTIL\u201D button.\n        ";
        AudioNarration.currentTime = 152;
        AudioNarration.play();
    };
    ;
    return TransferSourceConclusion;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var IntroASideFailure = /** @class */ (function (_super) {
    __extends(IntroASideFailure, _super);
    function IntroASideFailure() {
        var _this = _super.call(this, { key: "IntroASideFailure" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    IntroASideFailure.prototype.preload = function () {
        this.load.image("UCC_Console_Zoom_T21_Open_end", "../public/images/UCC_Console_Zoom_T21_Open_end.png");
        this.load.image("UCC_Console_Zoom_T21_Open_end_rdh_highlighted", "../public/images/UCC_Console_Zoom_T21_Open_end_rdh_highlighted.png");
    };
    IntroASideFailure.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    IntroASideFailure.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            During this lesson, you will be able to recognize a complete loss of \n            400 Hertz Static Frequency Converter A or B Bus and how the redundant \n            systems work.\n        ";
        Sim.currentScene = "IntroASideFailure";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('UCC_Console_Zoom_T21_Open');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 1.0;
        VideoAnimation.currentTime = 0;
        AudioNarration.initialize('Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus');
        AudioNarration.currentTime = 0;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 11) {
                AudioNarration.pause();
            }
        };
        var container = this.add.container(0, 0);
        var UCC_Console_Zoom_T21_Open_end = this.add.image(0, 0, "UCC_Console_Zoom_T21_Open_end");
        UCC_Console_Zoom_T21_Open_end.setOrigin(0, 0);
        UCC_Console_Zoom_T21_Open_end.setDisplaySize(width, height);
        container.add(UCC_Console_Zoom_T21_Open_end);
        var UCC_Console_Zoom_T21_Open_end_rdh_highlighted = this.add.image(0, 0, "UCC_Console_Zoom_T21_Open_end_rdh_highlighted");
        UCC_Console_Zoom_T21_Open_end_rdh_highlighted.setOrigin(0, 0);
        UCC_Console_Zoom_T21_Open_end_rdh_highlighted.setDisplaySize(width, height);
        UCC_Console_Zoom_T21_Open_end_rdh_highlighted.alpha = 0;
        container.add(UCC_Console_Zoom_T21_Open_end_rdh_highlighted);
        sc.time.delayedCall(5000, function () {
            cam.zoomTo(1.25, 2000, 'Sine.easeInOut');
            cam.pan(600, 246, 2000, 'Sine.easeInOut');
        }, [], sc);
        var timeline = sc.tweens.createTimeline({
            ease: 'Sine.easeInOut'
        });
        timeline.add({
            targets: UCC_Console_Zoom_T21_Open_end_rdh_highlighted,
            duration: 500,
            delay: 8500,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        timeline.add({
            targets: UCC_Console_Zoom_T21_Open_end_rdh_highlighted,
            duration: 500,
            delay: 3000,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            },
            onComplete: function () {
                UCC_Console_Zoom_T21_Open_end_rdh_highlighted.destroy();
            }
        });
        sc.time.delayedCall(12500, function () {
            cam.zoomTo(1, 2000, 'Sine.easeInOut');
            cam.pan(-600, -246, 2000, 'Sine.easeInOut');
            sc.time.delayedCall(2500, function () {
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("FourHundredDetailScreen");
                sc.time.delayedCall(1000, function () {
                    UCC_Console_Zoom_T21_Open_end.destroy();
                    sc.scene.stop("IntroASideFailure");
                }, [], sc);
            }, [], sc);
        }, [], sc);
        timeline.play();
        VideoAnimation.ended = function () { };
        VideoAnimation.play();
        sc.time.delayedCall(500, function () {
            AudioNarration.play();
        }, [], sc);
    };
    return IntroASideFailure;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var FourHundredDetailScreen = /** @class */ (function (_super) {
    __extends(FourHundredDetailScreen, _super);
    function FourHundredDetailScreen() {
        var _this = _super.call(this, { key: "FourHundredDetailScreen" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FourHundredDetailScreen.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end", "../public/images/UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.png");
        this.load.image("UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted", "../public/images/UCC_Monitor_Pan-400Hz_Center_to_Left_T21_Open_end_sfc_highlighted.png");
        this.load.image("Four_Hundred_Hz_udp_1_23_2_N", "../public/images/400Hz_udp_1_23_2_N.png");
        this.load.image("Four_Hundred_Hz_udp_1_23_2_A", "../public/images/400Hz_udp_1_23_2_A.png");
        this.load.image("Four_Hundred_Hz_udp_1_43_1_A", "../public/images/400Hz_udp_1_43_1_A.png");
        this.load.image("Four_Hundred_Hz_udp_1_43_1_N", "../public/images/400Hz_udp_1_43_1_N.png");
    };
    FourHundredDetailScreen.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FourHundredDetailScreen.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            The 400 Hertz Static Frequency Converters provide redundant 450-volt, 400 Hertz power to the combat weapons system.\n            The redundancies in the 400 Hertz Converters are such that the entire combat system could be supplied with power from only one of the four converters.\n        ";
        VideoAnimation.destroy();
        VideoAnimation.initialize('UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open', 0.4);
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 1;
        Sim.currentScene = "FourHundredDetailScreen";
        var cam = this.cameras.main;
        var sc = this;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        cam.setBounds(0, 0, 2000, 2000);
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end");
        UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.setOrigin(0, 0);
        UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end);
        var UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted");
        UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted.setOrigin(0, 0);
        UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted.setDisplaySize(width, height);
        UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted.alpha = 0;
        container.add(UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted);
        var timeline = sc.tweens.createTimeline({
            ease: 'Sine.easeInOut'
        });
        timeline.add({
            targets: [UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted],
            duration: 500,
            delay: 5500,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        timeline.add({
            targets: [UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted],
            duration: 500,
            delay: 4500,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            },
            onComplete: function () {
                UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end_sfc_highlighted.destroy();
            }
        });
        var Four_Hundred_Hz_udp_1_23_2_N = this.add.image(0, 0, "Four_Hundred_Hz_udp_1_23_2_N");
        Four_Hundred_Hz_udp_1_23_2_N.setOrigin(0, 0);
        Four_Hundred_Hz_udp_1_23_2_N.setDisplaySize(width, height);
        Four_Hundred_Hz_udp_1_23_2_N.alpha = 0;
        container.add(Four_Hundred_Hz_udp_1_23_2_N);
        var Four_Hundred_Hz_udp_1_23_2_A = this.add.image(0, 0, "Four_Hundred_Hz_udp_1_23_2_A");
        Four_Hundred_Hz_udp_1_23_2_A.setOrigin(0, 0);
        Four_Hundred_Hz_udp_1_23_2_A.setDisplaySize(width, height);
        Four_Hundred_Hz_udp_1_23_2_A.alpha = 0;
        container.add(Four_Hundred_Hz_udp_1_23_2_A);
        var Four_Hundred_Hz_udp_1_43_1_A = this.add.image(0, 0, "Four_Hundred_Hz_udp_1_43_1_A");
        Four_Hundred_Hz_udp_1_43_1_A.setOrigin(0, 0);
        Four_Hundred_Hz_udp_1_43_1_A.setDisplaySize(width, height);
        Four_Hundred_Hz_udp_1_43_1_A.alpha = 0;
        container.add(Four_Hundred_Hz_udp_1_43_1_A);
        var Four_Hundred_Hz_udp_1_43_1_N = this.add.image(0, 0, "Four_Hundred_Hz_udp_1_43_1_N");
        Four_Hundred_Hz_udp_1_43_1_N.setOrigin(0, 0);
        Four_Hundred_Hz_udp_1_43_1_N.setDisplaySize(width, height);
        Four_Hundred_Hz_udp_1_43_1_N.alpha = 0;
        container.add(Four_Hundred_Hz_udp_1_43_1_N);
        timeline.add({
            targets: [Four_Hundred_Hz_udp_1_23_2_N],
            duration: 500,
            delay: 8500,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        timeline.add({
            targets: [Four_Hundred_Hz_udp_1_23_2_N],
            duration: 500,
            delay: 2000,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            },
            onComplete: function () {
                Four_Hundred_Hz_udp_1_23_2_N.destroy();
            }
        });
        timeline.add({
            targets: [Four_Hundred_Hz_udp_1_23_2_A],
            duration: 500,
            delay: 10,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        timeline.add({
            targets: [Four_Hundred_Hz_udp_1_23_2_A],
            duration: 500,
            delay: 2000,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            },
            onComplete: function () {
                Four_Hundred_Hz_udp_1_23_2_A.destroy();
            }
        });
        timeline.add({
            targets: [Four_Hundred_Hz_udp_1_43_1_A],
            duration: 500,
            delay: 10,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        timeline.add({
            targets: [Four_Hundred_Hz_udp_1_43_1_A],
            duration: 500,
            delay: 2000,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            },
            onComplete: function () {
                Four_Hundred_Hz_udp_1_43_1_A.destroy();
            }
        });
        timeline.add({
            targets: [Four_Hundred_Hz_udp_1_43_1_N],
            duration: 500,
            delay: 10,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        timeline.add({
            targets: [Four_Hundred_Hz_udp_1_43_1_N],
            duration: 500,
            delay: 2000,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            },
            onComplete: function () {
                Four_Hundred_Hz_udp_1_43_1_N.destroy();
                cam.zoomTo(1, 2000, 'Sine.easeInOut');
                cam.pan(20, 0, 2000, 'Sine.easeInOut');
                sc.time.delayedCall(2500, function () {
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("FourHundredFaultDetected");
                    sc.time.delayedCall(1000, function () {
                        sc.scene.stop("FourHundredDetailScreen");
                    }, [], sc);
                }, [], sc);
            }
        });
        timeline.play();
        VideoAnimation.ended = function () {
            sc.time.delayedCall(2000, function () {
                cam.zoomTo(1.1, 2000, 'Sine.easeInOut');
                cam.pan(-20, 0, 2000, 'Sine.easeInOut');
            }, [], sc);
        };
        VideoAnimation.play();
        AudioNarration.initialize('Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus');
        AudioNarration.currentTime = 12;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 36) {
                AudioNarration.pause();
            }
        };
        this.time.delayedCall(500, function () {
            AudioNarration.play();
        }, [], this);
    };
    return FourHundredDetailScreen;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var FourHundredFaultDetected = /** @class */ (function (_super) {
    __extends(FourHundredFaultDetected, _super);
    function FourHundredFaultDetected() {
        var _this = _super.call(this, { key: "FourHundredFaultDetected" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FourHundredFaultDetected.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end", "../public/images/UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.png");
        this.load.image("UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start", "../public/images/UCC_Monitor_Pan-400Hz_Left_to_Center_Unacknowledged_start.png");
    };
    FourHundredFaultDetected.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    FourHundredFaultDetected.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            As you are at the watchstander station, you see a building alarm notifying you \n            that the A side 400 Hertz Static Frequency Converters have faulted.\n        ";
        Sim.currentScene = "FourHundredFaultDetected";
        var cam = this.cameras.main;
        var sc = this;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        cam.setBounds(0, 0, 2000, 2000);
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end");
        UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.setOrigin(0, 0);
        UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end);
        var UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start");
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setOrigin(0, 0);
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setDisplaySize(width, height);
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setAlpha(0);
        container.add(UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start);
        sc.time.delayedCall(4500, function () {
            sc.add.tween({
                targets: [UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 500,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                },
                onComplete: function () {
                    var rect1 = new Phaser.Geom.Rectangle();
                    rect1.setSize(150, 62);
                    rect1.setPosition(230, 84);
                    graphics.strokeRectShape(rect1);
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 1500,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        },
                        onComplete: function () {
                            sc.add.tween({
                                targets: [graphics],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 3000,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 0; }
                                },
                                onComplete: function () {
                                    Sim.removeResources();
                                    Sim.output.innerHTML = "";
                                    Sim.game.scene.start("NotifyCSOOW");
                                    sc.time.delayedCall(1000, function () {
                                        sc.scene.stop("FourHundredFaultDetected");
                                    }, [], sc);
                                }
                            });
                        }
                    });
                }
            });
        }, [], sc);
        AudioNarration.initialize('Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus');
        AudioNarration.currentTime = 38;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 48) {
                AudioNarration.pause();
            }
        };
        this.time.delayedCall(500, function () {
            AudioNarration.play();
        }, [], this);
    };
    return FourHundredFaultDetected;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var NotifyCSOOW = /** @class */ (function (_super) {
    __extends(NotifyCSOOW, _super);
    function NotifyCSOOW() {
        var _this = _super.call(this, { key: "NotifyCSOOW" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    NotifyCSOOW.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start", "../public/images/UCC_Monitor_Pan-400Hz_Left_to_Center_Unacknowledged_start.png");
        this.load.image("csoow", "../public/images/CSOOW.png");
        this.load.image("operator", "../public/images/Chief_Still.png");
    };
    NotifyCSOOW.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    NotifyCSOOW.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "NotifyCSOOW";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start");
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setOrigin(0, 0);
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start);
        sc.time.delayedCall(1500, function () {
            var csoow = _this.add.image(20, 20, "csoow");
            csoow.setOrigin(0, 0);
            csoow.alpha = 0;
            sc.add.tween({
                targets: [container],
                ease: 'Sine.easeInOut',
                duration: 1250,
                delay: 500,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return .6; }
                },
                onComplete: function () {
                    sc.add.tween({
                        targets: [csoow],
                        ease: 'Sine.easeInOut',
                        duration: 1250,
                        delay: 500,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        },
                        onComplete: function () {
                            var operator = _this.add.image(842, 20, "operator");
                            operator.setOrigin(0, 0);
                            operator.alpha = 0;
                            sc.add.tween({
                                targets: [operator],
                                ease: 'Sine.easeInOut',
                                duration: 1250,
                                delay: 1000,
                                alpha: {
                                    getStart: function () { return 0; },
                                    getEnd: function () { return 1; }
                                },
                                onComplete: function () {
                                    AudioNarration.destroy();
                                    AudioNarration.initialize('Four_Hundred_Hz_Sir_we_have_a_failure_take2');
                                    AudioNarration.currentTime = 0;
                                    AudioNarration.timeupdate = function () {
                                        if (Math.floor(AudioNarration.currentTime) > 9) {
                                            AudioNarration.pause();
                                        }
                                    };
                                    AudioNarration.play();
                                    sc.add.tween({
                                        targets: [csoow, operator],
                                        ease: 'Sine.easeInOut',
                                        duration: 1250,
                                        delay: 10000,
                                        alpha: {
                                            getStart: function () { return 1; },
                                            getEnd: function () { return 0; }
                                        }
                                    });
                                    sc.add.tween({
                                        targets: [container],
                                        ease: 'Sine.easeInOut',
                                        duration: 1250,
                                        delay: 10000,
                                        alpha: {
                                            getStart: function () { return .6; },
                                            getEnd: function () { return 1; }
                                        },
                                        onComplete: function () {
                                            Sim.removeResources();
                                            Sim.output.innerHTML = "";
                                            Sim.game.scene.start("LocateHobartManual");
                                            sc.time.delayedCall(1000, function () {
                                                sc.scene.stop("NotifyCSOOW");
                                            }, [], sc);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }, [], sc);
        AudioNarration.initialize('Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus');
        AudioNarration.currentTime = 49;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 54) {
                AudioNarration.pause();
            }
        };
        sc.time.delayedCall(1000, function () {
            Sim.output.innerHTML = "\n                You notify the Combat Systems Officer of the Watch of the failure.\n\n\n                \u201CSir. We have a failure in the A side Utility 400 Hertz Static Frequency Converters. Power to the weapons system is running full on Utility B now.\u201D            \n            ";
            AudioNarration.play();
        }, [], sc);
    };
    ;
    return NotifyCSOOW;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
/// <reference path="../../Highlight.ts" />
var LocateHobartManual = /** @class */ (function (_super) {
    __extends(LocateHobartManual, _super);
    function LocateHobartManual() {
        var _this = _super.call(this, { key: "LocateHobartManual" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    LocateHobartManual.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start", "../public/images/UCC_Monitor_Pan-400Hz_Left_to_Center_Unacknowledged_start.png");
    };
    LocateHobartManual.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    LocateHobartManual.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            You bring up the OM-2218 Hobart 400 Hz Converter Operation and Maintenance Manual and notify the maintainer on duty of the issue.\n        ";
        setTimeout(function () {
            if (Sim.referenceDisplayed == false) {
                parent.document.getElementById('btnReference').setAttribute('disabled', 'disabled');
                parent.document.getElementById('btnForward')['disabled'] = true;
            }
            else {
                parent.document.getElementById('btnForward')['disabled'] = false;
            }
        }, 1500);
        Sim.currentScene = "LocateHobartManual";
        var cam = this.cameras.main;
        var sc = this;
        var refButton = sc.$('#btnReference', parent.document);
        var refButton_offset = refButton.offset();
        var refButton_PosX = Math.floor(refButton_offset.left);
        var myOffset;
        var sideBarLeft = parseInt(getComputedStyle(parent.document.querySelector(".sidebar")).left);
        if (sideBarLeft < 0) { // LMS version
            myOffset = 0;
        }
        else {
            myOffset = refButton_PosX - 1136;
        }
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var hightlight = new Highlight();
        hightlight.width = 104;
        hightlight.height = 34;
        hightlight.x = refButton_PosX - myOffset;
        hightlight.y = 10;
        hightlight.blink = true;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start");
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setOrigin(0, 0);
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start);
        sc.$('.hobart', parent.document).click(function () {
            hightlight.hide();
            sc.$(".close", parent.document).click();
            sc.time.delayedCall(2000, function () {
                parent.document.querySelector('.forward')['disabled'] = false;
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("SFCKnowledgeQuestion");
                sc.time.delayedCall(1000, function () {
                    sc.scene.stop("LocateHobartManual");
                }, [], sc);
                setTimeout(function () {
                    parent.document.getElementById('btnForward')['disabled'] = false;
                    sc.$("#btnForward", parent.document).click();
                }, 2000);
            }, [], sc);
        });
        AudioNarration.initialize('Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus');
        AudioNarration.currentTime = 55;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 62) {
                AudioNarration.pause();
                parent.document.getElementById('btnReference').removeAttribute('disabled');
                hightlight.show();
            }
        };
        AudioNarration.play();
    };
    return LocateHobartManual;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
/// <reference path="../../KnowledgeQuestion.ts" />
var SequencingKnowledgeQuestion = /** @class */ (function (_super) {
    __extends(SequencingKnowledgeQuestion, _super);
    function SequencingKnowledgeQuestion() {
        var _this = _super.call(this, { key: "SequencingKnowledgeQuestion" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'Place the following steps in sequential order that occur during a failure of the A side 400 Hz static frequency converters:';
        _this.answers = [
            'Building Alarm',
            'Identify what equipment failed',
            'Notify the CSOOW',
            'Notify the Maintainer',
            'Verify the Fix',
            'Return to Full Power'
        ];
        return _this;
    }
    SequencingKnowledgeQuestion.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start", "../public/images/UCC_Monitor_Pan-400Hz_Left_to_Center_Unacknowledged_start.png");
    };
    SequencingKnowledgeQuestion.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    SequencingKnowledgeQuestion.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n        Place the following steps in sequential order that occur during a failure of the A side 400 Hz static frequency converters.\n        ";
        Sim.currentScene = "SequencingKnowledgeQuestion";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start");
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setOrigin(0, 0);
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start);
        AudioNarration.initialize('Four_Hundred_Hz_Challenge_Questions');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 19) {
                AudioNarration.pause();
            }
        };
        var question = new DragAndDropKnowledgeCheck();
        question.question = this.question;
        question.answers = this.answers;
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 9;
            AudioNarration.play();
        }
        question.show();
    };
    SequencingKnowledgeQuestion.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        AudioNarration.destroy();
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 139;
        AudioNarration.play();
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 141) {
                AudioNarration.pause();
                Sim.output.innerHTML = "";
                callback();
            }
        };
    };
    SequencingKnowledgeQuestion.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        AudioNarration.destroy();
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 145;
        AudioNarration.play();
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) >= 147) {
                AudioNarration.pause();
            }
        };
    };
    return SequencingKnowledgeQuestion;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
/// <reference path="../../KnowledgeQuestion.ts" />
var SFCKnowledgeQuestion = /** @class */ (function (_super) {
    __extends(SFCKnowledgeQuestion, _super);
    function SFCKnowledgeQuestion() {
        var _this = _super.call(this, { key: "SFCKnowledgeQuestion" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'How many 400 hz SFCs need to be operating to support the combat weapon systems?';
        _this.answers = [
            '1',
            '2',
            '3',
            '4'
        ];
        _this.correct = 0;
        return _this;
    }
    SFCKnowledgeQuestion.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start", "../public/images/UCC_Monitor_Pan-400Hz_Left_to_Center_Unacknowledged_start.png");
    };
    SFCKnowledgeQuestion.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    SFCKnowledgeQuestion.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            How many 400 Hertz Static Frequency Converters need to be operating normally to support the combat weapon systems?\n        ";
        Sim.currentScene = "SFCKnowledgeQuestion";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start");
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setOrigin(0, 0);
        UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start);
        AudioNarration.initialize('Four_Hundred_Hz_Challenge_Questions');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 8) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestion();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswer = this.correct;
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
    };
    SFCKnowledgeQuestion.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        AudioNarration.destroy();
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 139;
        AudioNarration.play();
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 141) {
                AudioNarration.pause();
                callback();
            }
        };
    };
    SFCKnowledgeQuestion.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        AudioNarration.destroy();
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 145;
        AudioNarration.play();
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) >= 147) {
                AudioNarration.pause();
            }
        };
    };
    return SFCKnowledgeQuestion;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var HobartFaultReadOut = /** @class */ (function (_super) {
    __extends(HobartFaultReadOut, _super);
    function HobartFaultReadOut() {
        var _this = _super.call(this, { key: "HobartFaultReadOut" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    HobartFaultReadOut.prototype.preload = function () {
        this.load.image("Hobart400Hz_PowerMaster180kVA_Large_Front", "../public/images/Hobart400Hz_PowerMaster180kVA_Large_Front.png");
        this.load.image("error_code_0150", "../public/images/error_code_0150.png");
        this.load.image("Hobart400Hz_red_bulb", "../public/images/Hobart400Hz_red_bulb.png");
    };
    HobartFaultReadOut.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    HobartFaultReadOut.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "HobartFaultReadOut";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, -50, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        cam.fadeOut(0);
        cam.once('camerafadeoutcomplete', function (cam) {
            var Hobart400Hz_PowerMaster180kVA_Large_Front = this.add.image(0, 18, "Hobart400Hz_PowerMaster180kVA_Large_Front");
            Hobart400Hz_PowerMaster180kVA_Large_Front.setOrigin(0, 0);
            Hobart400Hz_PowerMaster180kVA_Large_Front.setDisplaySize(width, height);
            container.add(Hobart400Hz_PowerMaster180kVA_Large_Front);
            var Hobart400Hz_red_bulb = this.add.image(0, 18, "Hobart400Hz_red_bulb");
            Hobart400Hz_red_bulb.setOrigin(0, 0);
            Hobart400Hz_red_bulb.setDisplaySize(width, height);
            container.add(Hobart400Hz_red_bulb);
            var error_code_0150 = this.add.image(0, 18, "error_code_0150");
            error_code_0150.setOrigin(0, 0);
            error_code_0150.setDisplaySize(width, height);
            container.add(error_code_0150);
            cam.fadeIn(300);
            cam.once('camerafadeincomplete', function (cam) {
                sc.time.delayedCall(3000, function () {
                    cam.zoomTo(1.6, 2500);
                    cam.pan(width / 2, 140, 2500);
                    sc.time.delayedCall(24000, function () {
                        //cam.fadeOut(300);
                        Sim.removeResources();
                        Sim.output.innerHTML = "";
                        Sim.game.scene.start("HobartFaultKnowledgeQuestion");
                        sc.time.delayedCall(1000, function () {
                            sc.scene.stop("HobartFaultReadOut");
                        }, [], sc);
                    }, [], sc);
                }, [], sc);
            }, this);
        }, this);
        AudioNarration.initialize('Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus');
        AudioNarration.currentTime = 63;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 88) {
                AudioNarration.pause();
            }
        };
        sc.time.delayedCall(1000, function () {
            Sim.output.innerHTML = "\n                The maintainer records the fault codes on the Static Frequency Converter \n                fault code LED display and consults the service guide of the \n                Maintenance Manual for corrective actions.  Before servicing, follow the \n                electrical one-line diagrams and \u201Clockout-tag out\u201D the input and output \n                disconnect switch associated with the 400 Hz Static Frequency Converters. \n            ";
            AudioNarration.play();
        }, [], sc);
    };
    ;
    return HobartFaultReadOut;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
/// <reference path="../../KnowledgeQuestion.ts" />
var HobartFaultKnowledgeQuestion = /** @class */ (function (_super) {
    __extends(HobartFaultKnowledgeQuestion, _super);
    function HobartFaultKnowledgeQuestion() {
        var _this = _super.call(this, { key: "HobartFaultKnowledgeQuestion" }) || this;
        _this.$ = window["jQuery"];
        _this.question = "Using Table 2-1-1 in the <a href=\"../public/references/Hobart 400 HZ Converter Manual.pdf\" target=\"_blank\">Hobart Users Manual</a>, what is the first step the maintainer should attempt for the Error Code (0150) displayed?";
        _this.answers = [
            'Replace Processor Module A',
            'Check input voltage',
            'Reset/Restart Unit',
            'Replace Inverter Module'
        ];
        _this.correct = 2;
        return _this;
    }
    HobartFaultKnowledgeQuestion.prototype.preload = function () {
        this.load.image("hobart_zoomed_in", "../public/images/hobart_zoomed_in.png");
    };
    HobartFaultKnowledgeQuestion.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    HobartFaultKnowledgeQuestion.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "Using Table 2-1-1 in the Hobart Users Manual, what is the first step the maintainer should attempt for the Error Code (0150) displayed?";
        Sim.currentScene = "HobartFaultKnowledgeQuestion";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var hobart_zoomed_in = this.add.image(0, 0, "hobart_zoomed_in");
        hobart_zoomed_in.setOrigin(0, 0);
        hobart_zoomed_in.setDisplaySize(width, height);
        container.add(hobart_zoomed_in);
        AudioNarration.initialize('Full_Loss_of_Utility_Power_Challenge Questions');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 49) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestion();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswer = this.correct;
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 37;
            AudioNarration.play();
        }
        question.show();
    };
    HobartFaultKnowledgeQuestion.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        AudioNarration.destroy();
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 139;
        AudioNarration.play();
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 141) {
                AudioNarration.pause();
                callback();
            }
        };
    };
    HobartFaultKnowledgeQuestion.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        AudioNarration.destroy();
        AudioNarration.initialize('fullUtilityAudio');
        AudioNarration.currentTime = 145;
        AudioNarration.play();
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) >= 147) {
                AudioNarration.pause();
            }
        };
    };
    return HobartFaultKnowledgeQuestion;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var FourHundredFaultCleared = /** @class */ (function (_super) {
    __extends(FourHundredFaultCleared, _super);
    function FourHundredFaultCleared() {
        var _this = _super.call(this, { key: "FourHundredFaultCleared" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FourHundredFaultCleared.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end", "../public/images/UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.png");
        this.load.image("UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start", "../public/images/UCC_Monitor_Pan-400Hz_Left_to_Center_Unacknowledged_start.png");
    };
    FourHundredFaultCleared.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    FourHundredFaultCleared.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            The maintainer notifies you that the 400 Hertz Static Frequency Converters \n            are repaired, and the system has been reset for full redundant power to combat \n            weapons systems.\n        ";
        Sim.currentScene = "FourHundredFaultCleared";
        var cam = this.cameras.main;
        var sc = this;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        cam.setBounds(0, 0, 2000, 2000);
        var container = this.add.container(0, 0);
        cam.fadeOut(0);
        cam.fadeIn(1000);
        cam.once('camerafadeincomplete', function (cam) {
            var UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start");
            UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setOrigin(0, 0);
            UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start.setDisplaySize(width, height);
            container.add(UCC_Monitor_Pan_400Hz_Left_to_Center_Unacknowledged_start);
            var UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end");
            UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.setOrigin(0, 0);
            UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.setDisplaySize(width, height);
            UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.setAlpha(0);
            container.add(UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end);
            sc.time.delayedCall(5500, function () {
                sc.add.tween({
                    targets: [UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end],
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 500,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        var rect1 = new Phaser.Geom.Rectangle();
                        rect1.setSize(150, 62);
                        rect1.setPosition(230, 84);
                        graphics.strokeRectShape(rect1);
                        sc.add.tween({
                            targets: [graphics],
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            delay: 1500,
                            alpha: {
                                getStart: function () { return 0; },
                                getEnd: function () { return 1; }
                            },
                            onComplete: function () {
                                sc.add.tween({
                                    targets: [graphics],
                                    ease: 'Sine.easeInOut',
                                    duration: 1000,
                                    delay: 3000,
                                    alpha: {
                                        getStart: function () { return 1; },
                                        getEnd: function () { return 0; }
                                    },
                                    onComplete: function () {
                                        Sim.removeResources();
                                        Sim.output.innerHTML = "";
                                        Sim.game.scene.start("FourHundredConclusion");
                                        sc.time.delayedCall(1000, function () {
                                            sc.scene.stop("FourHundredFaultCleared");
                                        }, [], sc);
                                    }
                                });
                            }
                        });
                    }
                });
            }, [], sc);
        }, this);
        AudioNarration.initialize('Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus');
        AudioNarration.currentTime = 89;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 101) {
                AudioNarration.pause();
            }
        };
        this.time.delayedCall(500, function () {
            AudioNarration.play();
            ;
        }, [], this);
    };
    return FourHundredFaultCleared;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var FourHundredConclusion = /** @class */ (function (_super) {
    __extends(FourHundredConclusion, _super);
    function FourHundredConclusion() {
        var _this = _super.call(this, { key: "FourHundredConclusion" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FourHundredConclusion.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end", "../public/images/UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.png");
        this.load.image("UCC_Console_Zoom_T21_Open_end", "../public/images/UCC_Console_Zoom_T21_Open_end.png");
    };
    FourHundredConclusion.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FourHundredConclusion.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            You verify the fix and return to full power on the Control Domains screen. \n        ";
        Sim.currentScene = "FourHundredConclusion";
        var cam = this.cameras.main;
        var sc = this;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        cam.setBounds(0, 0, 2000, 2000);
        VideoAnimation.initialize('UCC_Monitor_Pan_400Hz_Left_to_Center_T21_Open');
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 1;
        VideoAnimation.playbackRate = 0.4;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end = this.add.image(0, 0, "UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end");
        UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.setOrigin(0, 0);
        UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end);
        sc.time.delayedCall(4000, function () {
            var UCC_Console_Zoom_T21_Open_end = _this.add.image(0, 0, "UCC_Console_Zoom_T21_Open_end");
            UCC_Console_Zoom_T21_Open_end.setOrigin(0, 0);
            UCC_Console_Zoom_T21_Open_end.setDisplaySize(width, height);
            container.add(UCC_Console_Zoom_T21_Open_end);
            sc.time.delayedCall(5750, function () {
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.currentScene = "";
                sc.time.delayedCall(1000, function () {
                    sc.scene.stop("FourHundredConclusion");
                    Sim.setComplete();
                }, [], sc);
            }, [], sc);
            VideoAnimation.ended = function () { };
            VideoAnimation.play();
        }, [], sc);
        AudioNarration.initialize('Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus');
        AudioNarration.currentTime = 102;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) == 109) {
                AudioNarration.pause();
            }
        };
        this.time.delayedCall(500, function () {
            AudioNarration.play();
        }, [], this);
    };
    return FourHundredConclusion;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var DualUtilityFailureIntro = /** @class */ (function (_super) {
    __extends(DualUtilityFailureIntro, _super);
    function DualUtilityFailureIntro() {
        var _this = _super.call(this, { key: "DualUtilityFailureIntro" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    DualUtilityFailureIntro.prototype.preload = function () {
        this.load.image("UCC_Console_Zoom_T21_Open_end", "../public/images/UCC_Console_Zoom_T21_Open_end.png");
    };
    DualUtilityFailureIntro.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    DualUtilityFailureIntro.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        VideoAnimation.initialize('UCC_Console_Zoom_T21_Open');
        VideoAnimation.fadeOut = true;
        VideoAnimation.ended = function () {
            sc.time.delayedCall(6000, function () {
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("FiftySixtyConvertersFail");
                sc.time.delayedCall(1000, function () {
                    sc.scene.stop("DualUtilityFailureIntro");
                }, [], sc);
            }, [], sc);
        };
        Sim.output.innerHTML = "\n            During this lesson, you will be able to recognize the complete loss of dual utility \n            power, and the switch to Emergency Power. \n        ";
        Sim.currentScene = "DualUtilityFailureIntro";
        var cam = this.cameras.main;
        var sc = this;
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.play();
        var container = this.add.container(0, 0);
        var UCC_Console_Zoom_T21_Open_end = this.add.image(0, 0, "UCC_Console_Zoom_T21_Open_end");
        UCC_Console_Zoom_T21_Open_end.setOrigin(0, 0);
        UCC_Console_Zoom_T21_Open_end.setDisplaySize(width, height);
        container.add(UCC_Console_Zoom_T21_Open_end);
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 10) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 0;
        sc.time.delayedCall(500, function () {
            AudioNarration.play();
        }, [], sc);
    };
    return DualUtilityFailureIntro;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var FiftySixtyConvertersFail = /** @class */ (function (_super) {
    __extends(FiftySixtyConvertersFail, _super);
    function FiftySixtyConvertersFail() {
        var _this = _super.call(this, { key: "FiftySixtyConvertersFail" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FiftySixtyConvertersFail.prototype.preload = function () {
        this.load.image("UCC_Console_Zoom_T21_Open_end", "../public/images/UCC_Console_Zoom_T21_Open_end.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_open.png");
    };
    FiftySixtyConvertersFail.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FiftySixtyConvertersFail.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            As the system is in dual utility mode, waiting for a failure, \n            both the A side and B side 50/60 Hertz Static Frequency Converters fail. \n            This causes the Multifunction Protective Relays to sense voltage out of tolerance. \n            At this point all non-protected power to the Deckhouse Support Building \n            and the Reconstitutable Deckhouse is lost, which may include the building lights. \n        ";
        VideoAnimation.initialize('UCC_Console_Zoom_Power_Loss_F11_open');
        VideoAnimation.ended = function () {
            sc.time.delayedCall(1000, function () {
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("DualUtilityNotifyCSOOW");
                UCC_Console_Zoom_T21_Open_end.destroy();
                sc.time.delayedCall(1000, function () {
                    sc.scene.stop("FiftySixtyConvertersFail");
                }, [], sc);
            }, [], sc);
        };
        Sim.currentScene = "FiftySixtyConvertersFail";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Console_Zoom_T21_Open_end = this.add.image(0, 0, "UCC_Console_Zoom_T21_Open_end");
        UCC_Console_Zoom_T21_Open_end.setOrigin(0, 0);
        UCC_Console_Zoom_T21_Open_end.setDisplaySize(width, height);
        container.add(UCC_Console_Zoom_T21_Open_end);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setAlpha(0);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        container.add(graphics);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        rect1.setSize(30, 41);
        rect1.setPosition(242, 32);
        graphics.strokeRectShape(rect1);
        rect2.setSize(30, 41);
        rect2.setPosition(242, 406);
        graphics.strokeRectShape(rect2);
        sc.add.tween({
            targets: [graphics],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 7400,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                sc.time.delayedCall(4000, function () {
                    sc.add.tween({
                        targets: [UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 0,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        },
                        onComplete: function () {
                            graphics.clear();
                            graphics.lineStyle(4, 0xfaff77, 1.0);
                            graphics.setDepth(100);
                            graphics.setAlpha(0);
                            rect1.setSize(108, 314);
                            rect1.setPosition(636, 86);
                            graphics.strokeRectShape(rect1);
                            rect2.setSize(66, 314);
                            rect2.setPosition(744, 86);
                            graphics.strokeRectShape(rect2);
                            sc.time.delayedCall(9000, function () {
                                sc.add.tween({
                                    targets: [graphics],
                                    ease: 'Sine.easeInOut',
                                    duration: 1000,
                                    delay: 0,
                                    alpha: {
                                        getStart: function () { return 0; },
                                        getEnd: function () { return 1; }
                                    },
                                    onComplete: function () {
                                        sc.add.tween({
                                            targets: [graphics],
                                            ease: 'Sine.easeInOut',
                                            duration: 1000,
                                            delay: 3000,
                                            alpha: {
                                                getStart: function () { return 1; },
                                                getEnd: function () { return 0; }
                                            },
                                            onComplete: function () {
                                                VideoAnimation.play();
                                            }
                                        });
                                    }
                                });
                            }, [], sc);
                        }
                    });
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 0,
                        alpha: {
                            getStart: function () { return 1; },
                            getEnd: function () { return 0; }
                        },
                        onComplete: function () {
                        }
                    });
                }, [], sc);
            }
        });
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        AudioNarration.timeupdate = function () {
            if (AudioNarration.currentTime > 40.5) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 11;
        sc.time.delayedCall(500, function () {
            AudioNarration.play();
        }, [], sc);
    };
    return FiftySixtyConvertersFail;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var DualUtilityNotifyCSOOW = /** @class */ (function (_super) {
    __extends(DualUtilityNotifyCSOOW, _super);
    function DualUtilityNotifyCSOOW() {
        var _this = _super.call(this, { key: "DualUtilityNotifyCSOOW" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    DualUtilityNotifyCSOOW.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.png");
        this.load.image("csoow", "../public/images/CSOOW.png");
        this.load.image("operator", "../public/images/Chief_Still.png");
    };
    DualUtilityNotifyCSOOW.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    DualUtilityNotifyCSOOW.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "DualUtilityNotifyCSOOW";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start);
        sc.time.delayedCall(3500, function () {
            var csoow = _this.add.image(20, 20, "csoow");
            csoow.setOrigin(0, 0);
            csoow.alpha = 0;
            sc.add.tween({
                targets: [container],
                ease: 'Sine.easeInOut',
                duration: 1150,
                delay: 500,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return .6; }
                },
                onComplete: function () {
                    sc.add.tween({
                        targets: [csoow],
                        ease: 'Sine.easeInOut',
                        duration: 1250,
                        delay: 500,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        },
                        onComplete: function () {
                            var operator = _this.add.image(842, 20, "operator");
                            operator.setOrigin(0, 0);
                            operator.alpha = 0;
                            sc.add.tween({
                                targets: [operator],
                                ease: 'Sine.easeInOut',
                                duration: 1250,
                                delay: 9500,
                                alpha: {
                                    getStart: function () { return 0; },
                                    getEnd: function () { return 1; }
                                },
                                onComplete: function () {
                                    sc.add.tween({
                                        targets: [csoow, operator],
                                        ease: 'Sine.easeInOut',
                                        duration: 1250,
                                        delay: 10000,
                                        alpha: {
                                            getStart: function () { return 1; },
                                            getEnd: function () { return 0; }
                                        }
                                    });
                                    sc.add.tween({
                                        targets: [container],
                                        ease: 'Sine.easeInOut',
                                        duration: 1250,
                                        delay: 11000,
                                        alpha: {
                                            getStart: function () { return .6; },
                                            getEnd: function () { return 1; }
                                        },
                                        onComplete: function () {
                                            Sim.removeResources();
                                            Sim.output.innerHTML = "";
                                            Sim.game.scene.start("DualUtilityKnowledgeQuestion1");
                                            sc.time.delayedCall(1000, function () {
                                                sc.scene.stop("DualUtilityNotifyCSOOW");
                                            }, [], sc);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }, [], sc);
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 55) {
                Sim.output.innerHTML = "\n                    Sir. Both Utility A and B are deenergized due to failures of the \n                    50/60 Hertz Static Frequency Converters. We are switching to \n                    Diesel Generated Emergency Power.\n                ";
                if (Math.floor(AudioNarration.currentTime) > 67) {
                    AudioNarration.pause();
                }
            }
        };
        AudioNarration.currentTime = 40;
        sc.time.delayedCall(500, function () {
            Sim.output.innerHTML = "\n                Now, you need to notify the Combat Systems Officer of the Watch that there \n                has been a dual failure of the 50/60 Hertz Static Frequency Converters \n                and that the support system will be transitioning to \n                Diesel Generated Emergency Power.            \n            ";
            AudioNarration.play();
        }, [], sc);
    };
    ;
    return DualUtilityNotifyCSOOW;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
/// <reference path="../../KnowledgeQuestion.ts" />
var DualUtilityKnowledgeQuestion1 = /** @class */ (function (_super) {
    __extends(DualUtilityKnowledgeQuestion1, _super);
    function DualUtilityKnowledgeQuestion1() {
        var _this = _super.call(this, { key: "DualUtilityKnowledgeQuestion1" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'Besides the UCC screen showing the system as de-energized, what other way can you tell that there has been a full utility loss?';
        _this.answers = [
            'The CSOOW alerts you that there is a failure in the sytem.',
            'The UCC shuts down and loses power.',
            'The klaxon alarms will blare.',
            'Loss of building lights.'
        ];
        _this.correct = 3;
        return _this;
    }
    DualUtilityKnowledgeQuestion1.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.png");
    };
    DualUtilityKnowledgeQuestion1.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    DualUtilityKnowledgeQuestion1.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            Besides the UCC screen showing the system as de-energized, \n            what other way can you tell that there has been a full utility loss?\n        ";
        Sim.currentScene = "DualUtilityKnowledgeQuestion1";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start);
        AudioNarration.initialize('Full_Loss_of_Utility_Power_Challenge Questions');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 9) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestion();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswer = this.correct;
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
    };
    DualUtilityKnowledgeQuestion1.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('fullUtilityAudio');
        this.time.delayedCall(2000, function () {
            audio.pause();
            callback();
        }, [], audio);
        audio.currentTime = 139;
        audio.play();
    };
    DualUtilityKnowledgeQuestion1.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('fullUtilityAudio');
        this.time.delayedCall(2000, function () {
            audio.pause();
        }, [], audio);
        audio.currentTime = 145;
        audio.play();
    };
    return DualUtilityKnowledgeQuestion1;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var OpenBreakerVerification = /** @class */ (function (_super) {
    __extends(OpenBreakerVerification, _super);
    function OpenBreakerVerification() {
        var _this = _super.call(this, { key: "OpenBreakerVerification" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    OpenBreakerVerification.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.png");
    };
    OpenBreakerVerification.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    OpenBreakerVerification.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "DualUtilityNotifyCSOOW";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        var graphics2 = sc.add.graphics({});
        graphics2.lineStyle(4, 0xfaff77, 1.0);
        graphics2.setDepth(100);
        graphics2.setAlpha(0);
        container.add(graphics2);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        var rect3 = new Phaser.Geom.Rectangle();
        var rect4 = new Phaser.Geom.Rectangle();
        rect1.setSize(44, 26);
        rect1.setPosition(410, 58);
        graphics.strokeRectShape(rect1);
        rect2.setSize(44, 27);
        rect2.setPosition(408, 431);
        graphics.strokeRectShape(rect2);
        sc.time.delayedCall(3500, function () {
            sc.add.tween({
                targets: [graphics],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 500,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                },
                onComplete: function () {
                    rect3.setSize(44, 84);
                    rect3.setPosition(508, 58);
                    graphics2.strokeRectShape(rect3);
                    rect4.setSize(44, 84);
                    rect4.setPosition(508, 370);
                    graphics2.strokeRectShape(rect4);
                    sc.add.tween({
                        targets: [graphics2],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 4000,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        },
                        onComplete: function () {
                            sc.time.delayedCall(7000, function () {
                                Sim.removeResources();
                                Sim.output.innerHTML = "";
                                Sim.game.scene.start("AutomaticRunRequest");
                                sc.time.delayedCall(1000, function () {
                                    sc.scene.stop("OpenBreakerVerification");
                                }, [], sc);
                            }, [], sc);
                        }
                    });
                }
            });
        }, [], sc);
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 83) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 68;
        sc.time.delayedCall(500, function () {
            Sim.output.innerHTML = "\n                You should now verify that circuit breakers M11 and M21 have opened,\n                as well as the distribution breakers F11 through F13 and F21 through F23.            \n            ";
            AudioNarration.play();
        }, [], sc);
    };
    ;
    return OpenBreakerVerification;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var AutomaticRunRequest = /** @class */ (function (_super) {
    __extends(AutomaticRunRequest, _super);
    function AutomaticRunRequest() {
        var _this = _super.call(this, { key: "AutomaticRunRequest" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    AutomaticRunRequest.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed.png");
        this.load.image("Catepillar3516C_Diesel_Front_on", "../public/images/Catepillar3516C_Diesel_Front_on.png");
        this.load.image("Catepillar3516C_Diesel_Front_off", "../public/images/Catepillar3516C_Diesel_Front_off.png");
    };
    AutomaticRunRequest.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    AutomaticRunRequest.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "AutomaticRunRequest";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, -50, 2000, 2000);
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed.setAlpha(0);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed);
        var Catepillar3516C_Diesel_Front_on = this.add.image(0, 0, "Catepillar3516C_Diesel_Front_on");
        Catepillar3516C_Diesel_Front_on.setOrigin(0, 0);
        Catepillar3516C_Diesel_Front_on.setDisplaySize(width, height);
        Catepillar3516C_Diesel_Front_on.setAlpha(0);
        container.add(Catepillar3516C_Diesel_Front_on);
        var Catepillar3516C_Diesel_Front_off = this.add.image(0, 0, "Catepillar3516C_Diesel_Front_off");
        Catepillar3516C_Diesel_Front_off.setOrigin(0, 0);
        Catepillar3516C_Diesel_Front_off.setDisplaySize(width, height);
        Catepillar3516C_Diesel_Front_off.setAlpha(0);
        container.add(Catepillar3516C_Diesel_Front_off);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        container.add(graphics);
        sc.time.delayedCall(3500, function () {
            cam.fadeOut(1000);
            cam.once('camerafadeoutcomplete', function (cam) {
                UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setAlpha(0);
                Catepillar3516C_Diesel_Front_off.setAlpha(1);
                cam.fadeIn(1000);
                cam.once('camerafadeincomplete', function (cam) {
                    sc.time.delayedCall(1100, function () {
                        cam.zoomTo(1.35, 1300);
                        cam.pan(530, -40, 1300);
                        sc.time.delayedCall(1000, function () {
                            AudioNarration.pause();
                            AudioNarration.destroy();
                        }, [], sc);
                        sc.time.delayedCall(1500, function () {
                            AudioNarration.initialize('dieselEngine');
                            AudioNarration.currentTime = 0;
                            AudioNarration.play();
                            sc.add.tween({
                                targets: [Catepillar3516C_Diesel_Front_on],
                                ease: 'Sine.easeInOut',
                                duration: 500,
                                delay: 500,
                                alpha: {
                                    getStart: function () { return 0; },
                                    getEnd: function () { return 1; }
                                },
                                onComplete: function () {
                                    sc.time.delayedCall(1000, function () {
                                        Catepillar3516C_Diesel_Front_off.destroy();
                                    }, [], sc);
                                    sc.time.delayedCall(5000, function () {
                                        cam.fadeOut(1000);
                                        AudioNarration.destroy();
                                        cam.once('camerafadeoutcomplete', function (cam) {
                                            Catepillar3516C_Diesel_Front_on.destroy();
                                            UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.setAlpha(1);
                                            cam.fadeIn(1000);
                                            cam.setZoom(1);
                                            cam.setBounds(0, 0, 2000, 2000);
                                            cam.once('camerafadeincomplete', function (cam) {
                                                AudioNarration.initialize('Full_Loss_of_Utility_Power');
                                                AudioNarration.timeupdate = function () {
                                                    if (Math.floor(AudioNarration.currentTime) > 100) {
                                                        AudioNarration.pause();
                                                    }
                                                };
                                                AudioNarration.currentTime = 91;
                                                AudioNarration.play();
                                                sc.time.delayedCall(750, function () {
                                                    var rect1 = new Phaser.Geom.Rectangle();
                                                    rect1.setSize(45, 22);
                                                    rect1.setPosition(508, 272);
                                                    graphics.strokeRectShape(rect1);
                                                    sc.add.tween({
                                                        targets: [graphics],
                                                        ease: 'Sine.easeInOut',
                                                        duration: 1000,
                                                        delay: 500,
                                                        alpha: {
                                                            getStart: function () { return 0; },
                                                            getEnd: function () { return 1; }
                                                        },
                                                        onComplete: function () {
                                                            sc.add.tween({
                                                                targets: [UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed],
                                                                ease: 'Sine.easeInOut',
                                                                duration: 1000,
                                                                delay: 500,
                                                                alpha: {
                                                                    getStart: function () { return 0; },
                                                                    getEnd: function () { return 1; }
                                                                },
                                                                onComplete: function () {
                                                                    sc.time.delayedCall(6000, function () {
                                                                        Sim.removeResources();
                                                                        Sim.output.innerHTML = "";
                                                                        Sim.game.scene.start("GeneratorBreakersClose");
                                                                        sc.time.delayedCall(1000, function () {
                                                                            sc.scene.stop("AutomaticRunRequest");
                                                                        }, [], sc);
                                                                    }, [], sc);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }, [], sc);
                                            });
                                        });
                                        AudioNarration.destroy();
                                    }, [], sc);
                                }
                            });
                        }, [], sc);
                    }, [], sc);
                }, sc);
            }, sc);
        }, [], sc);
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 100) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 83.5;
        sc.time.delayedCall(500, function () {
            Sim.output.innerHTML = "\n                An automatic run request will now be sent to the generators, starting them in \n                sequence. During this time, breaker T21 will close allowing the diesel generators \n                to power both sides A and B.            \n            ";
            AudioNarration.play();
        }, [], sc);
        Helper.initialize(container, width, height);
    };
    ;
    return AutomaticRunRequest;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
/// <reference path="../../Helper.ts" />
var GeneratorBreakersClose = /** @class */ (function (_super) {
    __extends(GeneratorBreakersClose, _super);
    function GeneratorBreakersClose() {
        var _this = _super.call(this, { key: "GeneratorBreakersClose" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    GeneratorBreakersClose.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed.png");
    };
    GeneratorBreakersClose.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    GeneratorBreakersClose.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "GeneratorBreakersClose";
        var sc = this;
        var cam = this.cameras.main;
        cam.setBounds(0, -50, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed.setAlpha(0);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open.setAlpha(0);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed.setAlpha(0);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        container.add(graphics);
        /*
        let graphics2 = sc.add.graphics({});
        graphics2.lineStyle(4, 0xfaff77, 1.0);
        graphics2.setDepth(100);
        graphics2.setAlpha(0);

        container.add(graphics2);
        */
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        /*
        let rect3 = new Phaser.Geom.Rectangle();
        let rect4 = new Phaser.Geom.Rectangle();
        */
        rect1.setSize(46, 118);
        rect1.setPosition(408, 88);
        graphics.strokeRectShape(rect1);
        rect2.setSize(46, 118);
        rect2.setPosition(408, 308);
        graphics.strokeRectShape(rect2);
        sc.add.tween({
            targets: [graphics],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 5500,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                sc.time.delayedCall(4500, function () {
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 3000,
                        alpha: {
                            getStart: function () { return 1; },
                            getEnd: function () { return 0; }
                        },
                        onComplete: function () {
                        }
                    });
                    sc.add.tween({
                        targets: [UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed],
                        ease: 'Sine.easeInOut',
                        duration: 500,
                        delay: 4000,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        },
                        onComplete: function () {
                            graphics.clear();
                            graphics.lineStyle(4, 0xfaff77, 1.0);
                            graphics.setDepth(100);
                            graphics.setAlpha(0);
                            rect1.setSize(338, 62);
                            rect1.setPosition(8, 136);
                            graphics.strokeRectShape(rect1);
                            sc.add.tween({
                                targets: [graphics],
                                ease: 'Sine.easeInOut',
                                duration: 500,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 0; },
                                    getEnd: function () { return 1; }
                                },
                                onComplete: function () {
                                    sc.add.tween({
                                        targets: [graphics],
                                        ease: 'Sine.easeInOut',
                                        duration: 500,
                                        delay: 2000,
                                        alpha: {
                                            getStart: function () { return 1; },
                                            getEnd: function () { return 0; }
                                        }
                                    });
                                }
                            });
                            sc.add.tween({
                                targets: [UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open],
                                ease: 'Sine.easeInOut',
                                duration: 500,
                                delay: 2000,
                                alpha: {
                                    getStart: function () { return 0; },
                                    getEnd: function () { return 1; }
                                },
                                onComplete: function () {
                                    sc.add.tween({
                                        targets: [UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed],
                                        ease: 'Sine.easeInOut',
                                        duration: 1000,
                                        delay: 2750,
                                        alpha: {
                                            getStart: function () { return 0; },
                                            getEnd: function () { return 1; }
                                        },
                                        onComplete: function () {
                                            sc.time.delayedCall(2000, function () {
                                                Sim.removeResources();
                                                Sim.output.innerHTML = "";
                                                Sim.game.scene.start("BreakerF11F21Closes");
                                                sc.time.delayedCall(1000, function () {
                                                    sc.scene.stop("GeneratorBreakersClose");
                                                }, [], sc);
                                            }, [], sc);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }, [], sc);
            }
        });
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 121) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 101;
        Sim.output.innerHTML = "\n                As the run request is being sent and the generators are coming up to speed,\n                breakers G1A through G4A and G1B through G4B close. As the first generator gets \n                up to the correct voltage, its\u2019 associated breaker closes.            \n            ";
        AudioNarration.play();
    };
    ;
    return GeneratorBreakersClose;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
/// <reference path="../../Helper.ts" />
var BreakerF11F21Closes = /** @class */ (function (_super) {
    __extends(BreakerF11F21Closes, _super);
    function BreakerF11F21Closes() {
        var _this = _super.call(this, { key: "BreakerF11F21Closes" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    BreakerF11F21Closes.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered.png");
    };
    BreakerF11F21Closes.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    BreakerF11F21Closes.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "BreakerF11F21Closes";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, -50, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed.setAlpha(0);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered.setAlpha(0);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed.setAlpha(0);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed);
        sc.add.tween({
            targets: [UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 3500,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                sc.add.tween({
                    targets: [UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered],
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 10000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        sc.add.tween({
                            targets: [UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed],
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            delay: 3500,
                            alpha: {
                                getStart: function () { return 0; },
                                getEnd: function () { return 1; }
                            },
                            onComplete: function () {
                                sc.time.delayedCall(2000, function () {
                                    Sim.removeResources();
                                    Sim.output.innerHTML = "";
                                    Sim.game.scene.start("BreakerF12F22Closes");
                                    sc.time.delayedCall(1000, function () {
                                        sc.scene.stop("BreakerF11F21Closes");
                                    }, [], sc);
                                }, [], sc);
                            }
                        });
                    }
                });
            }
        });
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 144) {
                AudioNarration.pause();
            }
        };
        AudioNarration.currentTime = 122;
        sc.time.delayedCall(500, function () {
            Sim.output.innerHTML = "\n                Breaker F11 closes to allow diesel generated power to flow through \n                the A side Deckhouse Support Building and Reconstitutable Deckhouse.\n                When at least two generators are up to voltage, Breaker F21 closes \n                and B side is now energized.            \n            ";
            AudioNarration.play();
        }, [], sc);
        Helper.initialize(container, width, height);
    };
    ;
    return BreakerF11F21Closes;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
/// <reference path="../../Helper.ts" />
var BreakerF12F22Closes = /** @class */ (function (_super) {
    __extends(BreakerF12F22Closes, _super);
    function BreakerF12F22Closes() {
        var _this = _super.call(this, { key: "BreakerF12F22Closes" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    BreakerF12F22Closes.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed.png");
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.png");
    };
    BreakerF12F22Closes.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    BreakerF12F22Closes.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "BreakerF12F22Closes";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, -50, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.setDisplaySize(width, height);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.setAlpha(0);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        container.add(graphics);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        rect1.setSize(46, 24);
        rect1.setPosition(508, 58);
        graphics.strokeRectShape(rect1);
        rect2.setSize(46, 24);
        rect2.setPosition(508, 432);
        graphics.strokeRectShape(rect2);
        sc.add.tween({
            targets: [graphics],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 8000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                sc.time.delayedCall(1250, function () {
                    sc.add.tween({
                        targets: [graphics],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 1000,
                        alpha: {
                            getStart: function () { return 1; },
                            getEnd: function () { return 0; }
                        }
                    });
                }, [], _this);
            }
        });
        sc.add.tween({
            targets: [UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 12500,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                sc.time.delayedCall(16000, function () {
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("LocateABBManual");
                    sc.time.delayedCall(1000, function () {
                        sc.scene.stop("BreakerF12F22Closes");
                    }, [], sc);
                }, [], sc);
            }
        });
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 173) {
                AudioNarration.destroy();
            }
        };
        AudioNarration.currentTime = 145;
        Sim.output.innerHTML = "\n                After breaker F21 closes, and the Deckhouse Support Building has power \n                from both systems, breakers F12 and F22 close to provide power to the rest \n                of the system. When breakers F12 and F22 close, the Power \n                Control Monitoring System will sense this and provide a dry contact \n                allowing automatic restart of mechanical equipment.            \n            ";
        AudioNarration.play();
        Helper.initialize(container, width, height);
    };
    ;
    return BreakerF12F22Closes;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var LocateABBManual = /** @class */ (function (_super) {
    __extends(LocateABBManual, _super);
    function LocateABBManual() {
        var _this = _super.call(this, { key: "LocateABBManual" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    LocateABBManual.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.png");
    };
    LocateABBManual.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    LocateABBManual.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            The system is now in diesel generated emergency power. \n            Locate the ABB 50/60 Hertz Converter Operation and Maintenance Manual \n            and notify the maintainer on duty of the component failure.\n        ";
        setTimeout(function () {
            if (Sim.referenceDisplayed == false) {
                parent.document.getElementById('btnReference').setAttribute('disabled', 'disabled');
                parent.document.getElementById('btnForward')['disabled'] = true;
            }
            else {
                parent.document.getElementById('btnForward')['disabled'] = false;
            }
        }, 1500);
        Sim.currentScene = "LocateABBManual";
        var cam = this.cameras.main;
        var sc = this;
        var highlight;
        var refButton = sc.$('#btnReference', parent.document);
        var refButton_offset = refButton.offset();
        var refButton_PosX = Math.floor(refButton_offset.left);
        var myOffset;
        var sideBarLeft = parseInt(getComputedStyle(parent.document.querySelector(".sidebar")).left);
        if (sideBarLeft < 0) { // LMS version
            myOffset = 0;
        }
        else {
            myOffset = refButton_PosX - 1136;
        }
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed);
        sc.$('.abb', parent.document).click(function () {
            try {
                highlight.hide();
            }
            catch (e) {
            }
            sc.$(".close", parent.document).click();
            setTimeout(function () {
                parent.document.getElementById('btnForward')['disabled'] = false;
                sc.$("#btnForward", parent.document).click();
            }, 2000);
        });
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) >= 190) {
                AudioNarration.destroy();
                Sim.output.innerHTML = "\n                    In the Reference section, open the ABB 50/60 Hertz Converter Operation and Maintenance Manual.\n                ";
                AudioNarration.initialize('Challenge_Questions_ALT_LINE_01');
                AudioNarration.timeupdate = function () {
                    if (Math.floor(AudioNarration.currentTime) > 7) {
                        AudioNarration.pause();
                    }
                };
                AudioNarration.play();
                AudioNarration.currentTime = 0;
                highlight = new Highlight();
                highlight.width = 104;
                highlight.height = 34;
                //highlight.x = 1136;
                highlight.x = refButton_PosX - myOffset;
                highlight.y = 10;
                highlight.blink = true;
                highlight.show();
                parent.document.getElementById('btnReference').removeAttribute('disabled');
            }
        };
        AudioNarration.currentTime = 175;
        AudioNarration.play();
    };
    return LocateABBManual;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var InitiateTransferToFullPower = /** @class */ (function (_super) {
    __extends(InitiateTransferToFullPower, _super);
    function InitiateTransferToFullPower() {
        var _this = _super.call(this, { key: "InitiateTransferToFullPower" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    InitiateTransferToFullPower.prototype.preload = function () {
        this.load.image("UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed", "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.png");
        this.load.image("UCC_Console_Zoom_T21_Open_end", "../public/images/UCC_Console_Zoom_T21_Open_end.png");
        this.load.image("transferDialog", "../public/images/transfer_dialog.png");
        this.load.image("to_util_button", "../public/images/to_util_button.png");
    };
    InitiateTransferToFullPower.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    InitiateTransferToFullPower.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "InitiateTransferToFullPower";
        Sim.incorrectCount = 0;
        var cam = this.cameras.main;
        var sc = this;
        var hightlight;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed = this.add.image(0, 0, "UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed");
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.setOrigin(0, 0);
        UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.setDisplaySize(width, height);
        container.add(UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed);
        var UCC_Console_Zoom_T21_Open_end = this.add.image(0, 0, "UCC_Console_Zoom_T21_Open_end");
        UCC_Console_Zoom_T21_Open_end.alpha = 0;
        UCC_Console_Zoom_T21_Open_end.setDisplaySize(width, height);
        UCC_Console_Zoom_T21_Open_end.setOrigin(0, 0);
        container.add(UCC_Console_Zoom_T21_Open_end);
        var transferDialog = this.add.image(271, 65, "transferDialog");
        transferDialog.setOrigin(0, 0);
        transferDialog.alpha = 0;
        transferDialog.setDisplaySize(107, 152);
        container.add(transferDialog);
        var graphics = sc.add.graphics({});
        graphics.lineStyle(4, 0xfaff77, 1.0);
        graphics.setDepth(100);
        graphics.alpha = 0;
        container.add(graphics);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(50, 28);
        rect1.setPosition(272, 183);
        sc.time.delayedCall(15000, function () {
            AudioNarration.destroy();
            sc.time.delayedCall(1500, function () {
                sc.add.tween({
                    targets: [transferDialog],
                    ease: 'Sine.easeInOut',
                    duration: 750,
                    delay: 10,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
                Sim.output.innerHTML = "\n                    In the transfer source pop-up box, initiate the change to full utility power by selecting the \u201CTO UTIL\u201D button.\n                ";
                AudioNarration.initialize('singleUtilityFiftySixtyAudio');
                AudioNarration.timeupdate = function () {
                    if (AudioNarration.currentTime >= 162.5) {
                        AudioNarration.pause();
                    }
                };
                AudioNarration.currentTime = 152;
                AudioNarration.play();
                var startSFCButton = _this.add.image(0, 0, "to_util_button");
                startSFCButton.setOrigin(0, 0);
                startSFCButton.setDisplaySize(42, 26);
                startSFCButton.x = 277;
                startSFCButton.y = 183;
                startSFCButton.setInteractive();
                startSFCButton.once('pointerup', function (gameObject) {
                    AudioNarration.destroy();
                    graphics.setAlpha(0);
                    Sim.showFeedBack(true, gameObject);
                    sc.add.tween({
                        targets: [transferDialog, startSFCButton],
                        ease: 'Sine.easeInOut',
                        duration: 750,
                        delay: 10,
                        alpha: {
                            getStart: function () { return 1; },
                            getEnd: function () { return 0; }
                        },
                        onComplete: function () {
                        }
                    });
                    sc.add.tween({
                        targets: [UCC_Console_Zoom_T21_Open_end],
                        ease: 'Sine.easeInOut',
                        duration: 1250,
                        delay: 500,
                        alpha: {
                            getStart: function () { return 0; },
                            getEnd: function () { return 1; }
                        }
                    });
                    container.removeInteractive();
                    startSFCButton.removeInteractive();
                    sc.time.delayedCall(2000, function () {
                        Sim.removeResources();
                        Sim.output.innerHTML = "";
                        Sim.game.scene.start("DualUtilityFailureConclusion");
                        sc.time.delayedCall(1000, function () {
                            sc.scene.stop("InitiateTransferToFullPower");
                        }, [], sc);
                    }, [], sc);
                });
                container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
                container.on('pointerup', function (gameObject) {
                    Sim.showFeedBack(false, gameObject);
                    Sim.incorrectCount++;
                    if (Sim.incorrectCount > Sim.promptIncorrect) {
                        graphics.strokeRectShape(rect1);
                        sc.add.tween({
                            targets: [graphics],
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            delay: 0,
                            alpha: {
                                getStart: function () { return 0; },
                                getEnd: function () { return 1; }
                            }
                        });
                    }
                });
            }, [], sc);
        }, [], sc);
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        Sim.output.innerHTML = "\n            The maintainer has notified you that the 50/60 Hertz Static Frequency Converter \n            has been repaired. The next step is to verify the repair on the console screen \n            and to initiate a transfer to full utility power.\n        ";
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 204) {
            }
        };
        AudioNarration.currentTime = 190;
        AudioNarration.play();
    };
    return InitiateTransferToFullPower;
}(Phaser.Scene));
/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var DualUtilityFailureConclusion = /** @class */ (function (_super) {
    __extends(DualUtilityFailureConclusion, _super);
    function DualUtilityFailureConclusion() {
        var _this = _super.call(this, { key: "DualUtilityFailureConclusion" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    DualUtilityFailureConclusion.prototype.preload = function () {
        this.load.image("UCC_Console_Zoom_T21_Open_end", "../public/images/UCC_Console_Zoom_T21_Open_end.png");
    };
    DualUtilityFailureConclusion.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    DualUtilityFailureConclusion.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "DualUtilityFailureConclusion";
        var cam = this.cameras.main;
        var sc = this;
        var hightlight;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Console_Zoom_T21_Open_end = this.add.image(0, 0, "UCC_Console_Zoom_T21_Open_end");
        UCC_Console_Zoom_T21_Open_end.alpha = 1;
        UCC_Console_Zoom_T21_Open_end.setDisplaySize(width, height);
        UCC_Console_Zoom_T21_Open_end.setOrigin(0, 0);
        container.add(UCC_Console_Zoom_T21_Open_end);
        AudioNarration.initialize('Full_Loss_of_Utility_Power');
        Sim.output.innerHTML = "\n            The system executes a Return to Single Utility Failure Mode A or B based upon the position of the Primary Bus Selector Switch.  Once the system is in Single Utility Mode, the system immediately goes to dual utility mode.\n            \n            The system is now in Dual Utility Mode, waiting to react to a Utility outage.       \n        ";
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 228) {
                AudioNarration.destroy();
                sc.time.delayedCall(2000, function () {
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.currentScene = "";
                    sc.time.delayedCall(1000, function () {
                        sc.scene.stop("DualUtilityFailureConclusion");
                        Sim.setComplete();
                    }, [], sc);
                }, [], sc);
            }
        };
        AudioNarration.currentTime = 205;
        AudioNarration.play();
        Helper.initialize(container, width, height);
    };
    return DualUtilityFailureConclusion;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerIntro = /** @class */ (function (_super) {
    __extends(WaterChillerIntro, _super);
    function WaterChillerIntro() {
        var _this = _super.call(this, { key: "WaterChillerIntro" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    WaterChillerIntro.prototype.preload = function () {
        this.load.image("UCC_Console_Zoom_Normal_System_Operations_end", "../public/images/UCC_Console_Zoom_Normal_System_Operations_end.png");
    };
    WaterChillerIntro.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerIntro.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerIntro";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('UCC_Console_Zoom_Normal_System_Operations');
        VideoAnimation.currentTime = 0;
        VideoAnimation.playbackRate = 1.0;
        var container = this.add.container(0, 0);
        var UCC_Console_Zoom_Normal_System_Operations_end = this.add.image(0, 0, "UCC_Console_Zoom_Normal_System_Operations_end");
        UCC_Console_Zoom_Normal_System_Operations_end.setOrigin(0, 0);
        UCC_Console_Zoom_Normal_System_Operations_end.setDisplaySize(width, height);
        container.add(UCC_Console_Zoom_Normal_System_Operations_end);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: UCC_Console_Zoom_Normal_System_Operations_end,
                alpha: 1,
                ease: 'Power1',
                duration: 9500
            });
            timeline.play();
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("CrucialSystemSupport");
                sc.time.delayedCall(2000, function () {
                    sc.scene.stop("WaterChillerIntro");
                }, [], sc);
            });
        };
        VideoAnimation.play();
        //AudioNarration.initialize('Scenario_01-01', 10, true);
        AudioNarration.initialize('Scenario_01-01');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n            During this lesson you will be able to understand the functions and components of the Chilled Water System during both normal and hot weather operations. \n        ";
    };
    WaterChillerIntro.prototype.setupDelayedCall = function (scene, time, callback) {
        return scene.time.delayedCall(time, callback, null, scene);
    };
    return WaterChillerIntro;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var CrucialSystemSupport = /** @class */ (function (_super) {
    __extends(CrucialSystemSupport, _super);
    function CrucialSystemSupport() {
        var _this = _super.call(this, { key: "CrucialSystemSupport" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    CrucialSystemSupport.prototype.preload = function () {
        this.load.image("UCC_Console_Zoom_Return_Sys_Pump_Failure_end", "../public/images/UCC_Console_Zoom_Normal_System_Operations_end.png");
    };
    CrucialSystemSupport.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    CrucialSystemSupport.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "CrucialSystemSupport";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var UCC_Console_Zoom_Return_Sys_Pump_Failure_end = this.add.image(0, 0, "UCC_Console_Zoom_Return_Sys_Pump_Failure_end");
        UCC_Console_Zoom_Return_Sys_Pump_Failure_end.setOrigin(0, 0);
        UCC_Console_Zoom_Return_Sys_Pump_Failure_end.setDisplaySize(width, height);
        container.add(UCC_Console_Zoom_Return_Sys_Pump_Failure_end);
        cam.zoomTo(1.3, 2000, 'Sine.easeInOut');
        cam.pan(715, 200, 2000, 'Sine.easeInOut');
        AudioNarration.initialize('Scenario_01-02');
        AudioNarration.currentTime = 0;
        AudioNarration.timeupdate = function () {
            if (AudioNarration.currentTime > 5) {
                AudioNarration.pause();
            }
        };
        Sim.output.innerHTML = "<p>The Chilled Water System is crucial to the support systems as well as to the combat system.</p>";
        AudioNarration.play();
        this.setupDelayedCall(sc, 5500, function () {
            cam.zoomTo(1, 2000, 'Sine.easeInOut');
            cam.on('camerapancomplete', function () {
                _this.setupDelayedCall(sc, 1000, function () {
                    Sim.game.scene.start("WaterChillerScene2");
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                });
                _this.setupDelayedCall(sc, 2000, function () {
                    sc.scene.stop("CrucialSystemSupport");
                });
            });
            cam.pan(0, 0, 2000, 'Sine.easeInOut', false);
        });
    };
    CrucialSystemSupport.prototype.setupDelayedCall = function (scene, time, callback) {
        return scene.time.delayedCall(time, callback, null, scene);
    };
    return CrucialSystemSupport;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerScene2 = /** @class */ (function (_super) {
    __extends(WaterChillerScene2, _super);
    function WaterChillerScene2() {
        var _this = _super.call(this, { key: "WaterChillerScene2" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    WaterChillerScene2.prototype.preload = function () {
        this.load.image("UCC_Console_Zoom_Normal_System_Operations_end", "../public/images/UCC_Console_Zoom_Normal_System_Operations_end.png");
        this.load.image("Aux_Overview", "../public/images/UCC_Monitor_Pan-Left_to_Right_Normal_System_Operations_start.png");
        this.load.image("Aux_Overview2", "../public/images/UCC_Monitor_Pan-Left_to_Right_Normal_System_Operations_start2.png");
        this.load.image("Thermochiller", "../public/images/Thermochiller_Perspective.png");
    };
    WaterChillerScene2.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerScene2.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerScene2";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        // start image
        this.uccStartFrame = this.add.image(0, 0, "UCC_Console_Zoom_Normal_System_Operations_end");
        this.uccStartFrame.setOrigin(0, 0);
        this.uccStartFrame.setDisplaySize(width, height);
        this.uccStartFrame.setAlpha(1);
        // end Frame image
        this.Aux_Overview = this.add.image(0, 0, "Aux_Overview");
        this.Aux_Overview.setOrigin(0, 0);
        this.Aux_Overview.setDisplaySize(width, height);
        this.Aux_Overview.setAlpha(0);
        // end Frame image without green areas (used for flashing)
        this.Aux_Overview2 = this.add.image(0, 0, "Aux_Overview2");
        this.Aux_Overview2.setOrigin(0, 0);
        this.Aux_Overview2.setDisplaySize(width, height);
        this.Aux_Overview2.setAlpha(0);
        // small image to fade in later
        var thermochiller = this.add.image(550, 0, 'Thermochiller');
        thermochiller.setOrigin(0, 0);
        thermochiller.setAlpha(0);
        thermochiller.disableInteractive();
        thermochiller.setDisplaySize(480, 270);
        thermochiller.setDepth(100);
        this.container.add(this.uccStartFrame);
        AudioNarration.initialize('Scenario_01-03');
        AudioNarration.currentTime = 0;
        VideoAnimation.initialize('UCC_Monitor_Pan-Center_to_Left_Normal_System_Operations');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 0.6;
        VideoAnimation.currentTime = 0;
        Sim.output.innerHTML = "";
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: _this.Aux_Overview,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        VideoAnimation.ended = function () {
            sc.setupDelayedCall(sc, 100, function () {
                Sim.output.innerHTML = "<p>The Chilled Water System cools, circulates, and monitors cooling water for use throughout the Deck House Support Building and Reconstitutable Deck House to various pieces of equipment that produce heat while operating.</p>";
                AudioNarration.play();
                //Show the ThermoChiller.
                sc.add.tween({
                    targets: [thermochiller],
                    ease: 'Sine.easeInOut',
                    duration: 2000,
                    delay: 0,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
                //Zoom and Flash Map Areas
                sc.time.delayedCall(7500, function () {
                    cam.zoomTo(1.5, 2000, 'Sine.easeInOut');
                    cam.pan(1000, 400, 2000, 'Sine.easeInOut', false);
                    thermochiller.setAlpha(0);
                    thermochiller.destroy();
                    _this.Aux_Overview.setAlpha(1);
                    _this.Aux_Overview2.setAlpha(1);
                    _this.container.add(_this.Aux_Overview);
                    _this.container.add(_this.Aux_Overview2);
                    _this.currentImage = "aux1";
                    _this.time.addEvent({ delay: 500, callback: _this.onEvent, callbackScope: _this, loop: true });
                }, [], sc);
                //Zoom Out and Start Next Scene.
                _this.setupDelayedCall(sc, 14500, function () {
                    _this.currentImage = "stop";
                    cam.zoomTo(1, 2000, 'Sine.easeInOut');
                    cam.once('camerapancomplete', function () {
                        _this.setupDelayedCall(sc, 1000, function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            Sim.game.scene.start("WaterChillerScene3");
                        });
                        _this.setupDelayedCall(sc, 2000, function () {
                            sc.scene.stop("WaterChillerScene2");
                            _this.Aux_Overview.destroy();
                            _this.Aux_Overview2.destroy();
                            _this.container.destroy();
                            thermochiller.destroy();
                        });
                    });
                    cam.pan(0, 0, 2000, 'Sine.easeInOut', false);
                });
            });
            //Helper.initialize(container, 1068, 536);
        };
    };
    ;
    WaterChillerScene2.prototype.setupDelayedCall = function (scene, time, callback) {
        return scene.time.delayedCall(time, callback, null, scene);
    };
    WaterChillerScene2.prototype.onEvent = function () {
        if (this.currentImage == "aux1") {
            this.container.bringToTop(this.Aux_Overview2);
            this.currentImage = "aux2";
        }
        else if (this.currentImage == "aux2") {
            this.container.bringToTop(this.Aux_Overview);
            this.currentImage = "aux1";
        }
        else {
            this.container.bringToTop(this.Aux_Overview);
        }
    };
    return WaterChillerScene2;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerScene3 = /** @class */ (function (_super) {
    __extends(WaterChillerScene3, _super);
    function WaterChillerScene3() {
        var _this = _super.call(this, { key: "WaterChillerScene3" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    WaterChillerScene3.prototype.preload = function () {
        this.load.image("Aux_Overview", "../public/images/UCC_Monitor_Pan-Left_to_Right_Normal_System_Operations_start.png");
        this.load.image("Computer_Room_AC", "../public/images/CRAC_Perspective.png");
    };
    WaterChillerScene3.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerScene3.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerScene3";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var Aux_Overview = this.add.image(0, 0, "Aux_Overview");
        Aux_Overview.setOrigin(0, 0);
        Aux_Overview.setDisplaySize(width, height);
        container.add(Aux_Overview);
        var comp_room_ac = this.add.image(0, 0, 'Computer_Room_AC');
        comp_room_ac.setOrigin(0, 0);
        comp_room_ac.setDisplaySize(480, 270);
        comp_room_ac.setAlpha(0);
        container.add(comp_room_ac);
        var graphicsOptions = {
            lineStyle: {
                width: 4,
                color: 0xfaff77,
                alpha: 1
            }
        };
        var graphics = sc.add.graphics(graphicsOptions);
        var graphics2 = sc.add.graphics(graphicsOptions);
        var graphics3 = sc.add.graphics(graphicsOptions);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        graphics2.setDepth(100);
        graphics2.setAlpha(0);
        graphics3.setDepth(100);
        graphics3.setAlpha(0);
        //AHU01 Highlight
        var rect1 = new Phaser.Geom.Rectangle(6, 61, 201, 323);
        graphics.strokeRectShape(rect1);
        //MAU01/MAU02 Highlight
        var rect2 = new Phaser.Geom.Rectangle(7, 384, 201, 72);
        graphics2.strokeRectShape(rect2);
        //CRU 01/ CRU 02 Highlight
        var rect3 = new Phaser.Geom.Rectangle(211, 62, 118, 395);
        graphics3.strokeRectShape(rect3);
        this.setupDelayedCall(sc, 1000, function () {
            _this.setupAlphaTween(sc, [graphics], 500, 750, true);
        });
        this.setupDelayedCall(sc, 2000, function () {
            _this.setupAlphaTween(sc, [graphics2], 500, 750, true);
        });
        this.setupDelayedCall(sc, 4000, function () {
            _this.setupAlphaTween(sc, [graphics3], 1000, 750, true);
        });
        /*
        this.setupDelayedCall(sc, 6000, () => {
            this.setupAlphaTween(sc, [comp_room_ac], 1000, 750, true);
        });
        */
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: Aux_Overview,
            alpha: 1,
            ease: 'Power1',
            duration: 15000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_01-04');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "<p>\n            The Air Handling Units, Make-up Air Units, Computer Room Units, Computer Room Air Conditioners, Command and Decision Systems, and SPY Systems all rely on chilled water to function properly.\n        </p>";
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("ChilledWaterKnowledgeCheckScene3");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("WaterChillerScene3");
            }, [], sc);
        });
    };
    WaterChillerScene3.prototype.setupDelayedCall = function (scene, time, callback) {
        return scene.time.delayedCall(time, callback, null, scene);
    };
    WaterChillerScene3.prototype.setupAlphaTween = function (scene, targets, duration, hold, yoyo, oncomplete) {
        if (duration === void 0) { duration = 1000; }
        if (hold === void 0) { hold = 0; }
        if (yoyo === void 0) { yoyo = false; }
        if (oncomplete === void 0) { oncomplete = null; }
        var options = {
            targets: targets,
            ease: 'Sine.easeInOut',
            duration: duration,
            delay: 10,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; },
                hold: hold,
                yoyo: yoyo,
            },
        };
        if (oncomplete) {
            options['onComplete'] = oncomplete;
        }
        scene.add.tween(options);
    };
    return WaterChillerScene3;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var ChilledWaterKnowledgeCheckScene3 = /** @class */ (function (_super) {
    __extends(ChilledWaterKnowledgeCheckScene3, _super);
    function ChilledWaterKnowledgeCheckScene3() {
        var _this = _super.call(this, { key: "ChilledWaterKnowledgeCheckScene3" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    ChilledWaterKnowledgeCheckScene3.prototype.preload = function () {
        this.load.image("scene3KnowledgeCheckBackground", "../public/images/UCC_Monitor_Pan-Left_to_Right_Normal_System_Operations_start.png");
    };
    ChilledWaterKnowledgeCheckScene3.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    ChilledWaterKnowledgeCheckScene3.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "ChilledWaterKnowledgeCheckScene3";
        Sim.incorrectCount = 0;
        var cam = this.cameras.main;
        var sc = this;
        sc.selectedCorrectAreas = 0;
        Sim.output.innerHTML = "";
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var background = this.add.image(0, 0, "scene3KnowledgeCheckBackground");
        background.setOrigin(0, 0);
        background.setDisplaySize(width, height);
        container.add(background);
        this.AHUGraphics = sc.add.graphics({});
        this.AHUGraphics.setDepth(100);
        container.add(this.AHUGraphics);
        this.MAUGraphics = sc.add.graphics({});
        this.MAUGraphics.setDepth(100);
        container.add(this.MAUGraphics);
        this.CRUGraphics = sc.add.graphics({});
        this.CRUGraphics.setDepth(100);
        container.add(this.CRUGraphics);
        //AHU01 Highlight
        var AHURect = new Phaser.Geom.Rectangle(6, 61, 201, 323);
        this.AHUGraphics.strokeRectShape(AHURect);
        //MAU01/MAU02 Highlight
        var MAURect = new Phaser.Geom.Rectangle(7, 384, 201, 72);
        this.MAUGraphics.strokeRectShape(MAURect);
        //CRU 01/ CRU 02 Highlight
        var CRURect = new Phaser.Geom.Rectangle(211, 62, 118, 395);
        this.CRUGraphics.strokeRectShape(CRURect);
        AudioNarration.initialize('Sco_1_Scene_3_KC');
        Sim.output.innerHTML = 'Select two sub systems that require chilled water.';
        AudioNarration.play();
        container.removeInteractive();
        this.setupDelayedCall(sc, 1000, function () {
            _this.AHUGraphics.setInteractive(AHURect, Phaser.Geom.Rectangle.Contains);
            _this.AHUGraphics.on('pointerup', function (pointerObj) {
                this.setAlpha(0);
                this.removeInteractive();
                var scene = pointerObj.camera.scene;
                Sim.showFeedBack(true, pointerObj);
                sc.correctFeedback_s1s3(function () {
                    sc.selectedCorrectAreas++;
                    if (sc.selectedCorrectAreas == 2) {
                        scene.moveToNextScene();
                    }
                });
            });
            _this.MAUGraphics.setInteractive(MAURect, Phaser.Geom.Rectangle.Contains);
            _this.MAUGraphics.on('pointerup', function (pointerObj) {
                this.setAlpha(0);
                this.removeInteractive();
                var scene = pointerObj.camera.scene;
                Sim.showFeedBack(true, pointerObj);
                sc.correctFeedback_s1s3(function () {
                    sc.selectedCorrectAreas++;
                    if (sc.selectedCorrectAreas == 2) {
                        scene.moveToNextScene();
                    }
                });
            });
            _this.CRUGraphics.setInteractive(CRURect, Phaser.Geom.Rectangle.Contains);
            _this.CRUGraphics.on('pointerup', function (pointerObj) {
                this.setAlpha(0);
                this.removeInteractive();
                var scene = pointerObj.camera.scene;
                Sim.showFeedBack(true, pointerObj);
                sc.correctFeedback_s1s3(function () {
                    sc.selectedCorrectAreas++;
                    if (sc.selectedCorrectAreas == 2) {
                        scene.moveToNextScene();
                    }
                });
            });
            //Wrong Container which spans the full size of the content window.
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (pointerObj) {
                var scene = pointerObj.camera.scene;
                Sim.showFeedBack(false, pointerObj);
                Sim.incorrectCount++;
                sc.incorrectFeedback_s1s3();
                if (Sim.incorrectCount > Sim.promptIncorrect) {
                    sc.MAUGraphics.lineStyle(4, 0xfaff77, 1);
                    sc.MAUGraphics.strokeRectShape(MAURect);
                    sc.AHUGraphics.lineStyle(4, 0xfaff77, 1);
                    sc.AHUGraphics.strokeRectShape(AHURect);
                    sc.CRUGraphics.lineStyle(4, 0xfaff77, 1);
                    sc.CRUGraphics.strokeRectShape(CRURect);
                    sc.MAUGraphics.setAlpha(1);
                    sc.AHUGraphics.setAlpha(1);
                    sc.CRUGraphics.setAlpha(1);
                }
            });
        });
    };
    ChilledWaterKnowledgeCheckScene3.prototype.moveToNextScene = function () {
        var _this = this;
        AudioNarration.stop();
        AudioNarration.destroy();
        Sim.removeResources();
        Sim.output.innerHTML = "";
        Sim.game.scene.start("WaterChillerScene4");
        this.time.delayedCall(2000, function () {
            _this.scene.stop("ChilledWaterKnowledgeCheckScene3");
        }, [], this);
    };
    ChilledWaterKnowledgeCheckScene3.prototype.correctFeedback_s1s3 = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            callback();
        }, [], this);
    };
    ChilledWaterKnowledgeCheckScene3.prototype.incorrectFeedback_s1s3 = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
    };
    ChilledWaterKnowledgeCheckScene3.prototype.setupDelayedCall = function (scene, time, callback) {
        return scene.time.delayedCall(time, callback, null, scene);
    };
    return ChilledWaterKnowledgeCheckScene3;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerScene4 = /** @class */ (function (_super) {
    __extends(WaterChillerScene4, _super);
    function WaterChillerScene4() {
        return _super.call(this, { key: "WaterChillerScene4" }) || this;
    }
    WaterChillerScene4.prototype.preload = function () {
        this.load.image("Scene4_startFrame", "../public/images/UCC_Monitor_Pan-Left_to_Right_Normal_System_Operations_start.png");
        this.load.image("Scene4_endFrame", "../public/images/UCC_Monitor_Pan-Left_to_Right_Normal_System_Operations_end.png");
    };
    WaterChillerScene4.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerScene4.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerScene4";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        VideoAnimation.initialize('UCC_Monitor_Pan-left_to_Right_Normal_System_Operations');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 0.6;
        VideoAnimation.currentTime = 0;
        // start image
        var uccStartFrame = this.add.image(0, 0, "Scene4_startFrame");
        uccStartFrame.setOrigin(0, 0);
        uccStartFrame.setDisplaySize(width, height);
        uccStartFrame.setAlpha(1);
        // last image
        var uccFinalFrame = this.add.image(0, 0, "Scene4_endFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        uccFinalFrame.setAlpha(0);
        container.add(uccStartFrame);
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: uccFinalFrame,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 10000
            });
            timeline.play();
            AudioNarration.initialize('Scenario_01-05');
            AudioNarration.currentTime = 0;
            AudioNarration.play();
            Sim.output.innerHTML = "<p>The Hot Water System, which is an extension of the Chilled Water System, is used to heat the outside air coming in to the building and for dehumidification.</p>";
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("WaterChillerScene5");
                sc.time.delayedCall(2000, function () {
                    sc.scene.stop("WaterChillerScene4");
                }, [], sc);
            });
        };
    };
    return WaterChillerScene4;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerScene5 = /** @class */ (function (_super) {
    __extends(WaterChillerScene5, _super);
    function WaterChillerScene5() {
        return _super.call(this, { key: "WaterChillerScene5" }) || this;
    }
    WaterChillerScene5.prototype.preload = function () {
        this.load.image("Scene5_endFrame", "../public/images/UCC_Console_Zoom_Normal_System_Operations_end.png");
        this.load.image("Scene5_startFrame", "../public/images/UCC_Monitor_Pan-Left_to_Right_Normal_System_Operations_end.png");
    };
    WaterChillerScene5.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerScene5.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerScene5";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        VideoAnimation.initialize('UCC_Monitor_Pan-Right_to_Center_Normal_System_Operations');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 0.6;
        VideoAnimation.currentTime = 0;
        // start image
        var uccStartFrame = this.add.image(0, 0, "Scene5_startFrame");
        uccStartFrame.setOrigin(0, 0);
        uccStartFrame.setDisplaySize(width, height);
        uccStartFrame.setAlpha(1);
        // last image
        var uccFinalFrame = this.add.image(0, 0, "Scene5_endFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        uccFinalFrame.setAlpha(0);
        container.add(uccStartFrame);
        AudioNarration.initialize('Scenario_01-06');
        AudioNarration.currentTime = 0;
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: uccFinalFrame,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 14000
            });
            timeline.play();
            AudioNarration.play();
            Sim.output.innerHTML = "\n                <p>\n                The Chilled Water System is designed with an N plus one capacity.  This means that a maximum of two of the three chillers are required to meet the peak facility cooling load during normal temperature operations. \n                </p>\n            ";
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("ChilledWaterKnowledgeCheckScene5");
                sc.scene.stop("WaterChillerScene5");
            });
        };
    };
    return WaterChillerScene5;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var ChilledWaterKnowledgeCheckScene5 = /** @class */ (function (_super) {
    __extends(ChilledWaterKnowledgeCheckScene5, _super);
    function ChilledWaterKnowledgeCheckScene5() {
        var _this = _super.call(this, { key: "ChilledWaterKnowledgeCheckScene5" }) || this;
        _this.$ = window["jQuery"];
        _this.question = "What is the maximum number of chillers that can be running at once?";
        _this.answers = [
            '0',
            '1',
            '2',
            '3'
        ];
        _this.correct = 2;
        return _this;
    }
    ChilledWaterKnowledgeCheckScene5.prototype.preload = function () {
        this.load.image("KnowledgeCheckScene5Background", "../public/images/UCC_Console_Zoom_Normal_System_Operations_end.png");
    };
    ChilledWaterKnowledgeCheckScene5.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    ChilledWaterKnowledgeCheckScene5.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = this.question;
        Sim.currentScene = "ChilledWaterKnowledgeCheckScene5";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var KQ_BG = this.add.image(0, 0, "KnowledgeCheckScene5Background");
        KQ_BG.setOrigin(0, 0);
        KQ_BG.setDisplaySize(width, height);
        container.add(KQ_BG);
        AudioNarration.initialize('Sco_1_Scene_5_KC');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 6) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestion();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswer = this.correct;
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
    };
    ChilledWaterKnowledgeCheckScene5.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    ChilledWaterKnowledgeCheckScene5.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            audio.pause();
        }, [], this);
    };
    return ChilledWaterKnowledgeCheckScene5;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerScene6 = /** @class */ (function (_super) {
    __extends(WaterChillerScene6, _super);
    function WaterChillerScene6() {
        return _super.call(this, { key: "WaterChillerScene6" }) || this;
    }
    WaterChillerScene6.prototype.preload = function () {
        this.load.image("Scene6Background", "../public/images/ChilledMinimumChillers_PopupBox_InProgress.png");
    };
    WaterChillerScene6.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerScene6.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerScene6";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var Scene6Background = this.add.image(0, 0, "Scene6Background");
        Scene6Background.setOrigin(0, 0);
        Scene6Background.setDisplaySize(width, height);
        container.add(Scene6Background);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: Scene6Background,
            alpha: 1,
            ease: 'Power1',
            duration: 15000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_01-07');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "<p> \n            During warmer temperatures, or during use of the SPY radar system, all three chillers are required to meet the peak facility cooling load. \n            Two units are required for the operation, and the third chiller is to be available for maintenance.</p>";
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("ChilledWaterKnowledgeCheckScene6");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("WaterChillerScene6");
            }, [], sc);
        });
    };
    return WaterChillerScene6;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var ChilledWaterKnowledgeCheckScene6 = /** @class */ (function (_super) {
    __extends(ChilledWaterKnowledgeCheckScene6, _super);
    function ChilledWaterKnowledgeCheckScene6() {
        var _this = _super.call(this, { key: "ChilledWaterKnowledgeCheckScene6" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'Select all the reasons that you would need to run at LEAST two chillers.';
        _this.answers = [
            'Warm Weather Temperatures',
            'Cold Weather Temperatures',
            'Normal Operation',
            'Running SPY radar'
        ];
        _this._correctAnswers = [true, false, false, true];
        return _this;
    }
    ChilledWaterKnowledgeCheckScene6.prototype.preload = function () {
        this.load.image("KnowledgeCheckScene6Background", "../public/images/UCC_Console_Zoom_Normal_System_Operations_end.png");
    };
    ChilledWaterKnowledgeCheckScene6.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    ChilledWaterKnowledgeCheckScene6.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = this.question;
        Sim.currentScene = "ChilledWaterKnowledgeCheckScene6";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var KQ_start = this.add.image(0, 0, "KnowledgeCheckScene6Background");
        KQ_start.setOrigin(0, 0);
        KQ_start.setDisplaySize(width, height);
        container.add(KQ_start);
        AudioNarration.initialize('Sco_1_Scene_6_KC');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 6) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestionMultiple();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswers[0] = this._correctAnswers[0];
        question.correctAnswers[1] = this._correctAnswers[1];
        question.correctAnswers[2] = this._correctAnswers[2];
        question.correctAnswers[3] = this._correctAnswers[3];
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
        sc.scene.stop("WaterChillerScene6");
    };
    ChilledWaterKnowledgeCheckScene6.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    ChilledWaterKnowledgeCheckScene6.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            audio.pause();
        }, [], this);
    };
    return ChilledWaterKnowledgeCheckScene6;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerScene7 = /** @class */ (function (_super) {
    __extends(WaterChillerScene7, _super);
    function WaterChillerScene7() {
        return _super.call(this, { key: "WaterChillerScene7" }) || this;
    }
    WaterChillerScene7.prototype.preload = function () {
        this.load.image("Scene7_startFrame", "../public/images/UCC_Console_Zoom_Normal_System_Operations_end.png");
        this.load.image("Scene7_endFrame", "../public/images/UCC_Monitor_Pan-Center_to_Left_Normal_System_Operations_end.png");
        this.load.image("Thermochiller", "../public/images/Thermochiller_Perspective.png");
    };
    WaterChillerScene7.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerScene7.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerScene7";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        VideoAnimation.initialize('UCC_Monitor_Pan-Center_to_Left_Normal_System_Operations');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 0.6;
        VideoAnimation.currentTime = 0;
        // start image
        var uccStartFrame = this.add.image(0, 0, "Scene7_startFrame");
        uccStartFrame.setOrigin(0, 0);
        uccStartFrame.setDisplaySize(width, height);
        uccStartFrame.setAlpha(1);
        // last image
        var uccFinalFrame = this.add.image(0, 0, "Scene7_endFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        uccFinalFrame.setAlpha(0);
        container.add(uccStartFrame);
        AudioNarration.initialize('Scenario_01-08');
        AudioNarration.currentTime = 0;
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        var thermochiller = this.add.image(550, 0, 'Thermochiller');
        thermochiller.setOrigin(0, 0);
        thermochiller.setAlpha(0);
        thermochiller.disableInteractive();
        thermochiller.setDisplaySize(480, 270);
        thermochiller.setDepth(100);
        var graphicsOptions = {
            lineStyle: {
                width: 4,
                color: 0xfaff77,
                alpha: 1.0
            }
        };
        var graphics = sc.add.graphics(graphicsOptions);
        graphics.setDepth(100);
        graphics.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(267, 263);
        rect1.setPosition(337, 48);
        graphics.strokeRectShape(rect1);
        //container.add(graphics);
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: [uccFinalFrame, graphics],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 11500
            });
            sc.time.delayedCall(4000, function () {
                sc.add.tween({
                    targets: [thermochiller],
                    ease: 'Sine.easeInOut',
                    duration: 2000,
                    delay: 0,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
            }, [], sc);
            timeline.play();
            AudioNarration.play();
            Sim.output.innerHTML = "<p> \n                The Deck House Support Building chilled water-cooling system consists of three Thermocold independent chiller banks, each comprising of eight (70 ton) capacity modules.</p>";
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("WaterChillerScene8");
                sc.time.delayedCall(2000, function () {
                    sc.scene.stop("WaterChillerScene7");
                }, [], sc);
            });
        };
    };
    return WaterChillerScene7;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerScene8 = /** @class */ (function (_super) {
    __extends(WaterChillerScene8, _super);
    function WaterChillerScene8() {
        return _super.call(this, { key: "WaterChillerScene8" }) || this;
    }
    WaterChillerScene8.prototype.preload = function () {
        this.load.image("Scene8_startFrame", "../public/images/UCC_Monitor_Pan-Center_to_Left_Normal_System_Operations_end.png");
        this.load.image("Scene8_endFrame", "../public/images/UCC_Monitor_Pan-Right_to_Center_Normal_System_Operations_end.png");
    };
    WaterChillerScene8.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerScene8.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerScene8";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        VideoAnimation.initialize('UCC_Monitor_Pan-left_to_Center_Normal_System_Operations');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 0.6;
        VideoAnimation.currentTime = 0;
        // start image
        var uccStartFrame = this.add.image(0, 0, "Scene8_startFrame");
        uccStartFrame.setOrigin(0, 0);
        uccStartFrame.setDisplaySize(width, height);
        uccStartFrame.setAlpha(1);
        // last image
        var uccFinalFrame = this.add.image(0, 0, "Scene8_endFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        uccFinalFrame.setAlpha(0);
        container.add(uccStartFrame);
        AudioNarration.initialize('Scenario_01-09');
        AudioNarration.currentTime = 0;
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: uccFinalFrame,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 24500
            });
            timeline.play();
            AudioNarration.play();
            Sim.output.innerHTML = "<p>The Chilled Water System includes several components such as the chillers, condensers, pumps, coils, system balance valves, flow measuring devices, flow indication switches, and flow direction control devices. \n                Flow direction control devices include the Motor Operated and Manual Valves.</p>";
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("WaterChillerScene9");
                sc.time.delayedCall(2000, function () {
                    sc.scene.stop("WaterChillerScene8");
                }, [], sc);
            });
        };
    };
    return WaterChillerScene8;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerScene9 = /** @class */ (function (_super) {
    __extends(WaterChillerScene9, _super);
    function WaterChillerScene9() {
        var _this = _super.call(this, { key: "WaterChillerScene9" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    WaterChillerScene9.prototype.preload = function () {
        this.load.image("chilledWaterSummerStart", "../public/images/ChilledWaterSummerStart.png");
        this.load.image("chilledWaterChillerPriority", "../public/images/ChilledWaterChillerPriority.png");
        this.load.image("chilledWaterSummerFinished", "../public/images/ChilledWaterSummerFinished.png");
    };
    WaterChillerScene9.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerScene9.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerScene9";
        var cam = this.cameras.main;
        var sc = this;
        var currentHotspot;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // create and add initial image to container
        var uccFrameStart = this.add.image(0, 0, "chilledWaterSummerStart");
        uccFrameStart.setOrigin(0, 0);
        uccFrameStart.setDisplaySize(width, height);
        container.add(uccFrameStart);
        container.setDepth(1);
        // create chiller priority image but DO NOT add to container just yet
        var uccChillerPriority = this.add.image(0, 0, "chilledWaterChillerPriority");
        uccChillerPriority.setOrigin(0, 0);
        uccChillerPriority.setDisplaySize(width, height);
        // create chiller priority image but DO NOT add to container just yet
        var uccFrameFinish = this.add.image(0, 0, "chilledWaterSummerFinished");
        uccFrameFinish.setOrigin(0, 0);
        uccFrameFinish.setDisplaySize(width, height);
        // next create our 2 hotspots
        //------------------------------------
        var chillerPriority = sc.add.graphics({});
        chillerPriority.setDepth(100);
        chillerPriority.setAlpha(0);
        var chillerPriorityPopupButton = sc.add.graphics({});
        chillerPriorityPopupButton.setDepth(100);
        chillerPriorityPopupButton.setAlpha(0);
        var rect2 = new Phaser.Geom.Rectangle();
        var rect4 = new Phaser.Geom.Rectangle();
        rect2.setSize(47, 27);
        rect2.setPosition(168, 78);
        rect4.setSize(47, 27);
        rect4.setPosition(167, 116);
        chillerPriority.strokeRectShape(rect2);
        chillerPriorityPopupButton.strokeRectShape(rect4);
        //----------------------------------------------------
        // show initially the rectangle for the chiller priority hotspot
        container.add(chillerPriority);
        container.removeInteractive();
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFrameStart,
            alpha: 1,
            ease: 'Power1',
            duration: 24500
        });
        timeline.play();
        AudioNarration.initialize('Scenario_01-10');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        var audio_correct = document.getElementById('Correct');
        audio_correct.currentTime = 0;
        audio_correct.pause();
        var audio_incorrect = document.getElementById('TryAgain');
        audio_incorrect.currentTime = 0;
        audio_incorrect.pause();
        Sim.output.innerHTML = "<p>Chiller 01 and Chiller 02 are designated as the primary duty banks and the Chiller 03 bank is the redundant Chiller. Chiller 01 and Chiller 02 can each be designated as the lead chiller through the Universal Control Console, or UCC, to balance equipment runtime hours and other needs.</p>";
        sc.time.delayedCall(21500, function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            // set the prompt
            Sim.output.innerHTML = "Set the correct chiller priority.";
            // play second audio
            AudioNarration.initialize('Sco_1_Scene_9_KC');
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }, [], sc);
        timeline.setCallback("onComplete", function () {
            Sim.incorrectCount = 0;
            // stop audio 1
            AudioNarration.stop();
            AudioNarration.destroy();
            // clear the yellow border
            chillerPriority.clear();
            chillerPriority.setAlpha(1);
            // set the chillerPriority as the current hotspot
            currentHotspot = "chillerPriority";
            chillerPriority.setInteractive(rect2, Phaser.Geom.Rectangle.Contains);
            Sim.incorrectCount = 0;
            chillerPriority.on('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                currentHotspot = "chillerPriorityPopupButton";
                container.remove(chillerPriority); // remove the hotspot
                container.add(uccChillerPriority); // show the graphic showing the popup
                container.add(chillerPriorityPopupButton); // bring the next hotspot into the scene
                chillerPriorityPopupButton.clear(); // hide the yellow border
                chillerPriorityPopupButton.setAlpha(1); // be sure hotspot is visible
                audio_correct.play();
                audio_correct.addEventListener("ended", function () {
                    // now set up for fourth and final hotspot, chillerPriorityPopupButton
                    audio_correct.pause();
                    audio_incorrect.pause();
                    chillerPriorityPopupButton.setInteractive(rect4, Phaser.Geom.Rectangle.Contains);
                    Sim.incorrectCount = 0;
                    chillerPriorityPopupButton.on('pointerup', function (gameObject) {
                        Sim.showFeedBack(true, gameObject);
                        container.remove(chillerPriorityPopupButton);
                        container.add(uccFrameFinish);
                        container.remove(uccChillerPriority);
                        audio_correct.play();
                        audio_correct.addEventListener("ended", function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            audio_correct.pause();
                            audio_correct = null;
                            audio_incorrect.pause();
                            audio_incorrect = null;
                            Sim.game.scene.start("WaterChillerScene10");
                            sc.time.delayedCall(2000, function () {
                                sc.scene.stop("WaterChillerScene9");
                            }, [], sc);
                        });
                    });
                });
            });
            // incorrect response area for any incorrect response
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                audio_incorrect.play();
                switch (currentHotspot) {
                    case "chillerPriority":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            chillerPriority.lineStyle(4, 0xfaff77, 1.0);
                            chillerPriority.strokeRectShape(rect2);
                            sc.add.tween({
                                targets: [chillerPriority],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                    case "chillerPriorityPopupButton":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            chillerPriorityPopupButton.lineStyle(4, 0xfaff77, 1.0);
                            chillerPriorityPopupButton.strokeRectShape(rect4);
                            sc.add.tween({
                                targets: [chillerPriorityPopupButton],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                }
            });
        });
    };
    return WaterChillerScene9;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var WaterChillerScene10 = /** @class */ (function (_super) {
    __extends(WaterChillerScene10, _super);
    function WaterChillerScene10() {
        return _super.call(this, { key: "WaterChillerScene10" }) || this;
    }
    WaterChillerScene10.prototype.preload = function () {
        this.load.image("Scene10Background", "../public/images/UCC_Monitor_Pan-Right_to_Center_Normal_System_Operations_end.png");
    };
    WaterChillerScene10.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    WaterChillerScene10.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "WaterChillerScene10";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccFinalFrame = this.add.image(0, 0, "Scene10Background");
        this.uccFinalFrame.setOrigin(0, 0);
        this.uccFinalFrame.setDisplaySize(width, height);
        this.uccFinalFrame.setAlpha(1);
        this.container.add(this.uccFinalFrame);
        var timeline = this.tweens.createTimeline({
            ease: 'Linear',
            duration: 0
        });
        timeline.add({
            targets: this.uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 12500
        });
        timeline.play();
        AudioNarration.initialize('Scenario_01-11');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "<p>The Building Automation Systems, or BAS, will completely control the chilled water system and automatically stage chillers, pumps, and valves with direction from the UCC input.</p>";
        timeline.setCallback("onComplete", function () {
            // **** show Lesson Complete ****
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.currentScene = "";
            AudioNarration.stop();
            AudioNarration.destroy();
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("WaterChillerScene10");
                Sim.setComplete();
            }, [], sc);
        });
    };
    return WaterChillerScene10;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureIntro = /** @class */ (function (_super) {
    __extends(SingleSystemFailureIntro, _super);
    function SingleSystemFailureIntro() {
        var _this = _super.call(this, { key: "SingleSystemFailureIntro" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureIntro.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/UCC_Console_Zoom_Normal_System_Operations_end.png");
    };
    SingleSystemFailureIntro.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureIntro.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleSystemFailureIntro";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('UCC_Console_Zoom_Normal_System_Operations');
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 0;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 10000
            });
            timeline.play();
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("SingleSystemFailureScene1");
                sc.time.delayedCall(2000, function () {
                    sc.scene.stop("SingleSystemFailureIntro");
                }, [], sc);
            });
        };
        AudioNarration.initialize('Scenario_02-01');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        VideoAnimation.play();
        Sim.output.innerHTML = "\n                <p>\n                During this lesson, you will be able to recognize an equipment failure of a chiller unit in the Chilled Water System, which will lead to a loss of redundancy and possibly emergency shut down of equipment.\n                </p>\n            ";
    };
    return SingleSystemFailureIntro;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene1 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene1, _super);
    function SingleSystemFailureScene1() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene1" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene1.prototype.preload = function () {
        this.load.image("chilledWaterWinter_flow1", "../public/images/chiller_animation/CWS_02.png");
        this.load.image("chilledWaterWinter_flow2", "../public/images/chiller_animation/CWS_03.png");
        this.load.image("chilledWaterWinter_flow3", "../public/images/chiller_animation/CWS_04.png");
    };
    SingleSystemFailureScene1.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene1.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleSystemFailureScene1";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccScreenImage1 = this.add.image(0, 0, "chilledWaterWinter_flow1");
        this.uccScreenImage1.setOrigin(0, 0);
        this.uccScreenImage1.setDisplaySize(width, height);
        this.uccScreenImage2 = this.add.image(0, 0, "chilledWaterWinter_flow2");
        this.uccScreenImage2.setOrigin(0, 0);
        this.uccScreenImage2.setDisplaySize(width, height);
        this.uccScreenImage3 = this.add.image(0, 0, "chilledWaterWinter_flow3");
        this.uccScreenImage3.setOrigin(0, 0);
        this.uccScreenImage3.setDisplaySize(width, height);
        this.container.add(this.uccScreenImage3);
        this.container.add(this.uccScreenImage2);
        this.container.add(this.uccScreenImage1);
        this.currentImage = "flow1";
        this.time.addEvent({ delay: 500, callback: this.onEvent, callbackScope: this, loop: true });
        AudioNarration.initialize('Scenario_02-02');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>Chilled water is used throughout the Aegis Ashore plant to keep combat systems and support systems at peak operating temperature.</p>\n            ";
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: [sc.uccScreenImage1, sc.uccScreenImage2],
            alpha: 1,
            ease: 'Power1',
            duration: 9500
        });
        timeline.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            sc.time.removeAllEvents();
            sc.time.clearPendingEvents();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleSystemFailureScene2");
            sc.scene.stop("SingleSystemFailureScene1");
            /*sc.time.delayedCall(2000, () => {
                sc.scene.stop("SingleSystemFailureScene1");
            }, [], sc);
            */
        });
    };
    SingleSystemFailureScene1.prototype.onEvent = function () {
        if (this.currentImage == "flow1") {
            this.container.bringToTop(this.uccScreenImage2);
            this.currentImage = "flow2";
        }
        else if (this.currentImage == "flow2") {
            this.container.bringToTop(this.uccScreenImage3);
            this.currentImage = "flow3";
        }
        else if (this.currentImage == "flow3") {
            this.container.bringToTop(this.uccScreenImage1);
            this.currentImage = "flow1";
        }
    };
    return SingleSystemFailureScene1;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene2 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene2, _super);
    function SingleSystemFailureScene2() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene2" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene2.prototype.preload = function () {
        this.load.image("Thermochiller", "../public/images/Thermochiller_Perspective_noGlow.png");
    };
    SingleSystemFailureScene2.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene2.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            The Chilled Water System supplies chilled water at a rate of one hundred gallons per minute at a temperature of forty-three to forty-seven degrees Fahrenheit.\n        ";
        Sim.currentScene = "SingleSystemFailureScene2";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var Thermochiller = this.add.image(0, 0, "Thermochiller");
        Thermochiller.setOrigin(0, 0);
        Thermochiller.setDisplaySize(width, height);
        Thermochiller.setAlpha(1);
        container.add(Thermochiller);
        AudioNarration.initialize('Scenario_02-03');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: Thermochiller,
            alpha: 1,
            ease: 'Linear',
            duration: 9500
        });
        timeline.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            sc.time.removeAllEvents();
            sc.time.clearPendingEvents();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleSystemFailureScene3");
            sc.scene.stop("SingleSystemFailureScene2");
            /*sc.time.delayedCall(2000, () => {
                sc.scene.stop("SingleSystemFailureScene1");
            }, [], sc);
            */
        });
    };
    return SingleSystemFailureScene2;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene3 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene3, _super);
    function SingleSystemFailureScene3() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene3" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene3.prototype.preload = function () {
        this.load.image("Thermochiller_scene3", "../public/images/Thermochiller_Perspective_noGlow.png");
    };
    SingleSystemFailureScene3.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene3.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            The chillers have environmental operating limits and can operate between thirty-two degrees and one hundred- and twenty-two-degrees Fahrenheit.\n        ";
        Sim.currentScene = "SingleSystemFailureScene3";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var Thermochiller_scene3 = this.add.image(0, 0, "Thermochiller_scene3");
        Thermochiller_scene3.setOrigin(0, 0);
        Thermochiller_scene3.setDisplaySize(width, height);
        container.add(Thermochiller_scene3);
        AudioNarration.initialize('Scenario_02-04');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: Thermochiller_scene3,
            alpha: 1,
            ease: 'Linear',
            duration: 8500
        });
        timeline.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            sc.time.removeAllEvents();
            sc.time.clearPendingEvents();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleSystemFailureScene4");
            sc.scene.stop("SingleSystemFailureScene3");
            /*sc.time.delayedCall(2000, () => {
                sc.scene.stop("SingleSystemFailureScene1");
            }, [], sc);
            */
        });
    };
    return SingleSystemFailureScene3;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene4 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene4, _super);
    function SingleSystemFailureScene4() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene4" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene4.prototype.preload = function () {
        this.load.image("SingleFlow", "../public/images/ChilledWaterWinterB.png");
        this.load.image("DoubleFlow", "../public/images/ChilledWaterSummerB.png");
    };
    SingleSystemFailureScene4.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene4.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleSystemFailureScene4";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccScreenImage1 = this.add.image(0, 0, "SingleFlow");
        this.uccScreenImage1.setOrigin(0, 0);
        this.uccScreenImage1.setDisplaySize(width, height);
        this.uccScreenImage2 = this.add.image(0, 0, "DoubleFlow");
        this.uccScreenImage2.setOrigin(0, 0);
        this.uccScreenImage2.setDisplaySize(width, height);
        this.container.add(this.uccScreenImage2);
        this.container.add(this.uccScreenImage1);
        this.currentImage = "single";
        this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
        AudioNarration.initialize('Scenario_02-05');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                The Chilled Water System is designed with an N plus one capacity, meaning two chillers are needed for peak efficiency with one redundant chiller remaining for system maintenance.\n                </p>\n            ";
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: [sc.uccScreenImage1, sc.uccScreenImage2],
            alpha: 1,
            ease: 'Power1',
            duration: 12000
        });
        timeline.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleSystemFailureScene4KnowledgeCheck");
            sc.scene.stop("SingleSystemFailureScene4");
        });
    };
    SingleSystemFailureScene4.prototype.onEvent = function () {
        if (this.currentImage == "single") {
            this.container.bringToTop(this.uccScreenImage2);
            this.currentImage = "double";
        }
        else {
            this.container.bringToTop(this.uccScreenImage1);
            this.currentImage = "single";
        }
    };
    return SingleSystemFailureScene4;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene4KnowledgeCheck = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene4KnowledgeCheck, _super);
    function SingleSystemFailureScene4KnowledgeCheck() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene4KnowledgeCheck" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene4KnowledgeCheck.prototype.preload = function () {
        this.load.image("SingleFlowKC", "../public/images/ChilledWaterWinterB.png");
    };
    SingleSystemFailureScene4KnowledgeCheck.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene4KnowledgeCheck.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "";
        Sim.currentScene = "SingleSystemFailureScene4KnowledgeCheck";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var SingleFlow = this.add.image(0, 0, "SingleFlowKC");
        SingleFlow.setOrigin(0, 0);
        SingleFlow.setDisplaySize(width, height);
        container.add(SingleFlow);
        var kc = new KnowledgeQuestion();
        kc.question = "What function does the third Chiller serve?";
        kc.answers = ["As a Maintenance Spare", "For Extreme Temperatures", "When Running SPY Radar", "When using VLS"];
        kc.correctAnswer = 0;
        Sim.output.innerHTML = "What function does the third Chiller serve?";
        AudioNarration.initialize('Scene4');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 3) {
                AudioNarration.pause();
                AudioNarration.currentTime = 0;
            }
        };
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        kc.show();
    };
    SingleSystemFailureScene4KnowledgeCheck.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    SingleSystemFailureScene4KnowledgeCheck.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            audio.pause();
        }, [], this);
    };
    return SingleSystemFailureScene4KnowledgeCheck;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene5 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene5, _super);
    function SingleSystemFailureScene5() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene5" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene5.prototype.preload = function () {
        this.load.image("background", "../public/images/ChilledWaterSummerB.png");
        this.load.image("ChilledWaterPriorityWindow", "../public/images/ChilledPriority_PopupBox.png");
        this.load.image("ChilledWaterMinimumWindow", "../public/images/ChilledMinimumChillers_PopupBox.png");
    };
    SingleSystemFailureScene5.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene5.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            From the Chilled Water System screen on the UCC, you can set the chiller priority as well as the minimum number of chillers that you want to actively run.\n        ";
        Sim.currentScene = "SingleSystemFailureScene5";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var background = this.add.image(0, 0, "background");
        background.setOrigin(0, 0);
        background.setDisplaySize(width, height);
        container.add(background);
        var ChilledWaterPriorityWindow = this.add.image(0, 0, "ChilledWaterPriorityWindow");
        ChilledWaterPriorityWindow.setOrigin(0, 0);
        ChilledWaterPriorityWindow.setDisplaySize(width, height);
        ChilledWaterPriorityWindow.setAlpha(0);
        container.add(ChilledWaterPriorityWindow);
        var ChilledWaterMinimumWindow = this.add.image(0, 0, "ChilledWaterMinimumWindow");
        ChilledWaterMinimumWindow.setOrigin(0, 0);
        ChilledWaterMinimumWindow.setDisplaySize(width, height);
        ChilledWaterMinimumWindow.setAlpha(0);
        container.add(ChilledWaterMinimumWindow);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: background,
            alpha: 1,
            ease: 'Linear',
            duration: 10000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_02-06');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleSystemFailureScene5KnowledgeCheck");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("SingleSystemFailureScene5");
            }, [], sc);
        });
        this.setupDelayedCall(sc, 500, function () {
            AudioNarration.play();
            _this.setupDelayedCall(sc, 2500, function () {
                sc.add.tween({
                    targets: [ChilledWaterPriorityWindow],
                    ease: "Sine.easeInOut",
                    duration: 1000,
                    delay: 10,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; },
                    }
                });
            });
            _this.setupDelayedCall(sc, 5000, function () {
                sc.add.tween({
                    targets: [ChilledWaterMinimumWindow],
                    ease: "Sine.easeInOut",
                    duration: 1000,
                    delay: 10,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; },
                    }
                });
                container.remove(ChilledWaterPriorityWindow);
            });
            _this.setupDelayedCall(sc, 7500, function () {
                sc.add.tween({
                    targets: [ChilledWaterPriorityWindow, ChilledWaterMinimumWindow],
                    ease: "Sine.easeInOut",
                    duration: 500,
                    delay: 10,
                    alpha: {
                        getStart: function () { return 1; },
                        getEnd: function () { return 0; },
                    }
                });
            });
        });
    };
    SingleSystemFailureScene5.prototype.setupAlphaTween = function (scene, targets, duration, hold, yoyo, oncomplete) {
        if (duration === void 0) { duration = 1000; }
        if (hold === void 0) { hold = 0; }
        if (yoyo === void 0) { yoyo = false; }
        if (oncomplete === void 0) { oncomplete = null; }
        var options = {
            targets: targets,
            ease: 'Sine.easeInOut',
            duration: duration,
            delay: 10,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; },
                hold: hold,
                yoyo: yoyo,
            },
        };
        if (oncomplete) {
            options['onComplete'] = oncomplete;
        }
        scene.add.tween(options);
    };
    SingleSystemFailureScene5.prototype.setupDelayedCall = function (scene, time, callback) {
        return scene.time.delayedCall(time, callback, null, scene);
    };
    return SingleSystemFailureScene5;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene5KnowledgeCheck = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene5KnowledgeCheck, _super);
    function SingleSystemFailureScene5KnowledgeCheck() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene5KnowledgeCheck" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene5KnowledgeCheck.prototype.preload = function () {
        this.load.image('background', "../public/images/ChilledWaterSummerB.png");
        this.load.image('chillerPriorityWindowA', "../public/images/ChilledPriority_PopupBoxA.png");
        this.load.image('chillerPriorityWindowB', "../public/images/ChilledPriority_PopupBox.png");
    };
    SingleSystemFailureScene5KnowledgeCheck.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene5KnowledgeCheck.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleSystemFailureScene5KnowledgeCheck";
        var cam = this.cameras.main;
        var sc = this;
        var currentHotspot;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // show screen with popup but 1-2-3 NOT selected
        var uccFrameStart = this.add.image(0, 0, "chillerPriorityWindowA");
        uccFrameStart.setOrigin(0, 0);
        uccFrameStart.setDisplaySize(width, height);
        container.add(uccFrameStart);
        container.setDepth(1);
        // show 1-2-3 choice selected
        var uccChillerPriority = this.add.image(0, 0, "chillerPriorityWindowB");
        uccChillerPriority.setOrigin(0, 0);
        uccChillerPriority.setDisplaySize(width, height);
        // screen with popup box closed
        var uccFrameFinish = this.add.image(0, 0, "background");
        uccFrameFinish.setOrigin(0, 0);
        uccFrameFinish.setDisplaySize(width, height);
        /*------------------------------------------------------------------------------------*/
        // next create our 2 hotspots
        //------------------------------------
        var chillerPriority = sc.add.graphics({});
        chillerPriority.setDepth(100);
        chillerPriority.setAlpha(0);
        var chillerPriorityPopupButton = sc.add.graphics({});
        chillerPriorityPopupButton.setDepth(100);
        chillerPriorityPopupButton.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        rect1.setSize(32, 11);
        rect1.setPosition(169, 88);
        rect2.setSize(46, 25);
        rect2.setPosition(168, 117);
        chillerPriority.strokeRectShape(rect1);
        chillerPriorityPopupButton.strokeRectShape(rect2);
        //----------------------------------------------------
        // show initially the rectangle for the chiller priority hotspot
        container.add(chillerPriority);
        container.removeInteractive();
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFrameStart,
            alpha: 1,
            ease: 'Power1',
            duration: 6500
        });
        timeline.play();
        AudioNarration.initialize('Scene5');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = 'At this time, set the chiller priority to the standard setting of one, two, three.';
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        timeline.setCallback("onComplete", function () {
            Sim.incorrectCount = 0;
            // stop audio 1
            AudioNarration.stop();
            // clear the yellow border
            chillerPriority.clear();
            chillerPriority.setAlpha(1);
            // set the chillerPriority as the current hotspot
            currentHotspot = "chillerPriority";
            chillerPriority.setInteractive(rect1, Phaser.Geom.Rectangle.Contains);
            Sim.incorrectCount = 0;
            chillerPriority.on('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                currentHotspot = "chillerPriorityPopupButton";
                container.remove(chillerPriority); // remove the hotspot
                container.add(uccChillerPriority); // show the graphic showing the popup
                container.add(chillerPriorityPopupButton); // bring the next hotspot into the scene
                chillerPriorityPopupButton.clear(); // hide the yellow border
                chillerPriorityPopupButton.setAlpha(1); // be sure hotspot is visible
                sc.correctFeedback_s2s5(function () {
                    // now set up for 2nd hotspot, chillerPriorityPopupButton
                    chillerPriorityPopupButton.setInteractive(rect2, Phaser.Geom.Rectangle.Contains);
                    Sim.incorrectCount = 0;
                    chillerPriorityPopupButton.on('pointerup', function (gameObject) {
                        Sim.showFeedBack(true, gameObject);
                        container.remove(chillerPriorityPopupButton);
                        container.add(uccFrameFinish);
                        container.remove(uccChillerPriority);
                        sc.correctFeedback_s2s5(function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            AudioNarration.destroy();
                            Sim.game.scene.start("SingleSystemFailureScene6");
                            sc.time.delayedCall(2000, function () {
                                sc.scene.stop("SingleSystemFailureScene5KnowledgeCheck");
                            }, [], sc);
                        });
                    });
                });
            });
            // incorrect response area for any incorrect response
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                sc.incorrectFeedback_s2s5();
                switch (currentHotspot) {
                    case "chillerPriority":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            chillerPriority.lineStyle(4, 0xfaff77, 1.0);
                            chillerPriority.strokeRectShape(rect1);
                            sc.add.tween({
                                targets: [chillerPriority],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                    case "chillerPriorityPopupButton":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            chillerPriorityPopupButton.lineStyle(4, 0xfaff77, 1.0);
                            chillerPriorityPopupButton.strokeRectShape(rect2);
                            sc.add.tween({
                                targets: [chillerPriorityPopupButton],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                }
            });
        }); // timeline callback  
    }; // start
    SingleSystemFailureScene5KnowledgeCheck.prototype.correctFeedback_s2s5 = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            callback();
        }, [], this);
    };
    SingleSystemFailureScene5KnowledgeCheck.prototype.incorrectFeedback_s2s5 = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
    };
    return SingleSystemFailureScene5KnowledgeCheck;
}(Phaser.Scene)); // class
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene6 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene6, _super);
    function SingleSystemFailureScene6() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene6" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene6.prototype.preload = function () {
        this.load.image("Hot_Weather_Operations", "../public/images/ChilledWaterSummerStart.png");
        this.load.image("Winter_Weather_Operations", "../public/images/ChilledWaterWinterB.png");
    };
    SingleSystemFailureScene6.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene6.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n            During moderate weather and normal operating conditions, only one chiller is required to meet peak facility efficiency. During hot weather or combat operations, such as running the SPY radar system, two chillers are required to meet peak efficiency.\n        ";
        Sim.currentScene = "SingleSystemFailureScene6";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var Winter_Weather_Operations = this.add.image(0, 0, "Winter_Weather_Operations");
        Winter_Weather_Operations.setOrigin(0, 0);
        Winter_Weather_Operations.setDisplaySize(width, height);
        container.add(Winter_Weather_Operations);
        var Hot_Weather_Operations = this.add.image(0, 0, "Hot_Weather_Operations");
        Hot_Weather_Operations.setOrigin(0, 0);
        Hot_Weather_Operations.setDisplaySize(width, height);
        Hot_Weather_Operations.setAlpha(0);
        container.add(Hot_Weather_Operations);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: Winter_Weather_Operations,
            alpha: 1,
            ease: 'Sine.easeInOut',
            duration: 16500
        });
        timeline.play();
        AudioNarration.initialize('Scenario_02-07');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleSystemFailureScene6KnowledgeCheck");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("SingleSystemFailureScene6");
            }, [], sc);
        });
        // at 5.5 seconds, fade in second image
        sc.time.delayedCall(5500, function () {
            sc.add.tween({
                targets: Hot_Weather_Operations,
                ease: 'Sine.easeInOut',
                duration: 2000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
    };
    return SingleSystemFailureScene6;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene6KnowledgeCheck = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene6KnowledgeCheck, _super);
    function SingleSystemFailureScene6KnowledgeCheck() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene6KnowledgeCheck" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene6KnowledgeCheck.prototype.preload = function () {
        this.load.image("knowledgeCheckBG6", "../public/images/ChilledWaterSummerStart.png");
        this.load.image('chillerMinimumPopupBox', "../public/images/ChilledMinimumChillers_PopupBox_InProgress.png");
    };
    SingleSystemFailureScene6KnowledgeCheck.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene6KnowledgeCheck.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = 'At this time, set the number of chillers as if you were going to run the SPY radar system.';
        Sim.currentScene = "SingleSystemFailureScene6KnowledgeCheck";
        var cam = this.cameras.main;
        var sc = this;
        var currentHotspot;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // show screen without popup 
        var uccFrameStart = this.add.image(0, 0, "knowledgeCheckBG6");
        uccFrameStart.setOrigin(0, 0);
        uccFrameStart.setDisplaySize(width, height);
        container.add(uccFrameStart);
        // show screen with popup
        var uccChillerMinimum = this.add.image(0, 0, "chillerMinimumPopupBox");
        uccChillerMinimum.setOrigin(0, 0);
        uccChillerMinimum.setDisplaySize(width, height);
        uccChillerMinimum.setAlpha(0);
        //container.add(uccChillerMinimum);
        /*------------------------------------------------------------------------------------*/
        // next create our 2 hotspots
        //------------------------------------
        var setMinButton = sc.add.graphics({});
        setMinButton.setDepth(100);
        setMinButton.setAlpha(0);
        var chillerMinimumPopupButton = sc.add.graphics({});
        chillerMinimumPopupButton.setDepth(100);
        chillerMinimumPopupButton.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        rect1.setSize(46, 27);
        rect1.setPosition(339, 56);
        rect2.setSize(49, 28);
        rect2.setPosition(338, 104);
        setMinButton.strokeRectShape(rect1);
        chillerMinimumPopupButton.strokeRectShape(rect2);
        //----------------------------------------------------
        // show initially the rectangle for the chiller priority hotspot
        container.add(setMinButton);
        container.removeInteractive();
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFrameStart,
            alpha: 1,
            ease: 'Power1',
            duration: 6500
        });
        timeline.play();
        AudioNarration.initialize('Scene6');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        timeline.setCallback("onComplete", function () {
            Sim.incorrectCount = 0;
            // stop audio 1
            AudioNarration.stop();
            // clear the yellow border
            setMinButton.clear();
            setMinButton.setAlpha(1);
            // set the chillerPriority as the current hotspot
            currentHotspot = "setMinButton";
            setMinButton.setInteractive(rect1, Phaser.Geom.Rectangle.Contains);
            Sim.incorrectCount = 0;
            setMinButton.on('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                currentHotspot = "chillerMinimumPopupButton";
                container.remove(setMinButton); // remove the hotspot
                uccChillerMinimum.setAlpha(1);
                container.add(uccChillerMinimum); // show the graphic showing the popup
                container.add(chillerMinimumPopupButton); // bring the next hotspot into the scene
                chillerMinimumPopupButton.clear(); // hide the yellow border
                chillerMinimumPopupButton.setAlpha(1); // be sure hotspot is visible
                sc.correctFeedback_s2s6(function () {
                    // now set up for 2nd hotspot, chillerMinimumPopupButton
                    chillerMinimumPopupButton.setInteractive(rect2, Phaser.Geom.Rectangle.Contains);
                    Sim.incorrectCount = 0;
                    chillerMinimumPopupButton.on('pointerup', function (gameObject) {
                        Sim.showFeedBack(true, gameObject);
                        container.remove(chillerMinimumPopupButton);
                        container.remove(uccChillerMinimum);
                        sc.correctFeedback_s2s6(function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            AudioNarration.destroy();
                            Sim.game.scene.start("SingleSystemFailureScene7");
                            sc.time.delayedCall(2000, function () {
                                sc.scene.stop("SingleSystemFailureScene6KnowledgeCheck");
                            }, [], sc);
                        });
                    });
                });
            });
            // incorrect response area for any incorrect response
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                sc.incorrectFeedback_s2s6();
                switch (currentHotspot) {
                    case "setMinButton":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            setMinButton.lineStyle(4, 0xfaff77, 1.0);
                            setMinButton.strokeRectShape(rect1);
                            sc.add.tween({
                                targets: [setMinButton],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                    case "chillerMinimumPopupButton":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            chillerMinimumPopupButton.lineStyle(4, 0xfaff77, 1.0);
                            chillerMinimumPopupButton.strokeRectShape(rect2);
                            sc.add.tween({
                                targets: [chillerMinimumPopupButton],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                }
            });
        });
    };
    SingleSystemFailureScene6KnowledgeCheck.prototype.correctFeedback_s2s6 = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            callback();
        }, [], this);
    };
    SingleSystemFailureScene6KnowledgeCheck.prototype.incorrectFeedback_s2s6 = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
    };
    return SingleSystemFailureScene6KnowledgeCheck;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene7 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene7, _super);
    function SingleSystemFailureScene7() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene7" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene7.prototype.preload = function () {
        this.load.image("Chiller_Normal", "../public/images/ChilledWaterSummerB.png");
        this.load.image("Chiller_Fail_sc7", "../public/images/UCC_Monitor_Pan-Left_to_Center_Single_Sys_Failure_CWS_end.png");
    };
    SingleSystemFailureScene7.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene7.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "\n        While you are standing watch at the UCC, running the Chilled Water System for combat operations, an alarm flashes on the screen alerting you that the primary chiller has failed.\n        ";
        Sim.currentScene = "SingleSystemFailureScene7";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var Chiller_Normal = this.add.image(0, 0, "Chiller_Normal");
        Chiller_Normal.setOrigin(0, 0);
        Chiller_Normal.setDisplaySize(width, height);
        container.add(Chiller_Normal);
        var Chiller_Fail_sc7 = this.add.image(0, 0, "Chiller_Fail_sc7");
        Chiller_Fail_sc7.setOrigin(0, 0);
        Chiller_Fail_sc7.setDisplaySize(width, height);
        Chiller_Fail_sc7.setAlpha(0);
        container.add(Chiller_Fail_sc7);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: Chiller_Normal,
            alpha: 1,
            ease: 'Sine.easeInOut',
            duration: 11500
        });
        timeline.play();
        AudioNarration.initialize('Scenario_02-08');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleSystemFailureScene7KnowledgeCheck");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("SingleSystemFailureScene7");
            }, [], sc);
        });
        // at 5.5 seconds, fade in second image
        sc.time.delayedCall(5500, function () {
            sc.add.tween({
                targets: Chiller_Fail_sc7,
                ease: 'Sine.easeInOut',
                duration: 500,
                delay: 500,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
    };
    return SingleSystemFailureScene7;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene7KnowledgeCheck = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene7KnowledgeCheck, _super);
    function SingleSystemFailureScene7KnowledgeCheck() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene7KnowledgeCheck" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene7KnowledgeCheck.prototype.preload = function () {
        this.load.image("Chiller_Fail_sc7kc", "../public/images/UCC_Monitor_Pan-Left_to_Center_Single_Sys_Failure_CWS_end.png");
    };
    SingleSystemFailureScene7KnowledgeCheck.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene7KnowledgeCheck.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = 'Locate and click on the Chiller 1 General Alarm indicator.';
        Sim.currentScene = "SingleSystemFailureScene7KnowledgeCheck";
        var cam = this.cameras.main;
        var sc = this;
        var currentHotspot = "";
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // show screen
        var uccFrameStart = this.add.image(0, 0, "Chiller_Fail_sc7kc");
        uccFrameStart.setOrigin(0, 0);
        uccFrameStart.setDisplaySize(width, height);
        container.add(uccFrameStart);
        /*------------------------------------------------------------------------------------*/
        // next create our 1 hotspot
        //------------------------------------
        var alarmIndicator = sc.add.graphics({});
        alarmIndicator.setDepth(100);
        alarmIndicator.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(95, 20);
        rect1.setPosition(468, 104);
        alarmIndicator.strokeRectShape(rect1);
        //----------------------------------------------------
        container.add(alarmIndicator);
        container.removeInteractive();
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFrameStart,
            alpha: 1,
            ease: 'Power1',
            duration: 4500
        });
        timeline.play();
        AudioNarration.initialize('Scene7');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        timeline.setCallback("onComplete", function () {
            Sim.incorrectCount = 0;
            // stop audio 1
            AudioNarration.stop();
            // clear the yellow border
            alarmIndicator.clear();
            alarmIndicator.setAlpha(1);
            // set the chillerPriority as the current hotspot
            currentHotspot = "alarmIndicator";
            alarmIndicator.setInteractive(rect1, Phaser.Geom.Rectangle.Contains);
            Sim.incorrectCount = 0;
            alarmIndicator.on('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                container.remove(alarmIndicator);
                sc.correctFeedback_s2s7(function () {
                    timeline.stop();
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    AudioNarration.destroy();
                    Sim.game.scene.start("SingleSystemFailureScene8");
                    sc.time.delayedCall(2000, function () {
                        sc.scene.stop("SingleSystemFailureScene7KnowledgeCheck");
                    }, [], sc);
                });
            });
            // incorrect response area for any incorrect response
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                sc.incorrectFeedback_s2s7();
                switch (currentHotspot) {
                    case "alarmIndicator":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            alarmIndicator.lineStyle(4, 0xfaff77, 1.0);
                            alarmIndicator.strokeRectShape(rect1);
                            sc.add.tween({
                                targets: [alarmIndicator],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                }
            });
        });
    };
    SingleSystemFailureScene7KnowledgeCheck.prototype.correctFeedback_s2s7 = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            callback();
        }, [], this);
    };
    SingleSystemFailureScene7KnowledgeCheck.prototype.incorrectFeedback_s2s7 = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
    };
    return SingleSystemFailureScene7KnowledgeCheck;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene8 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene8, _super);
    function SingleSystemFailureScene8() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene8" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene8.prototype.preload = function () {
        this.load.image("chilledWaterAlarmDisplayed2", "../public/images/UCC_Monitor_Pan-Left_to_Center_Single_Sys_Failure_CWS_end.png");
        this.load.image("csoow", "../public/images/CSOOW.png");
        this.load.image("operator", "../public/images/Chief_Still.png");
    };
    SingleSystemFailureScene8.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene8.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleSystemFailureScene8";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var chilledWaterBackground = this.add.image(0, 0, "chilledWaterAlarmDisplayed2");
        chilledWaterBackground.setOrigin(0, 0);
        chilledWaterBackground.setDisplaySize(width, height);
        container.add(chilledWaterBackground);
        //sc.scene.stop("SingleSystemFailureScene7KnowledgeCheck");  
        // initial Audio to play
        AudioNarration.initialize('Scenario_02-09');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        // initial CC text to show
        Sim.output.innerHTML = "\n        After verifying that the system has activated the redundant chiller, you alert the CSOOW that there has been a failure of the Chilled Water System.\n            ";
        // Global scene timeline created
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: chilledWaterBackground,
            alpha: 1,
            ease: 'Power1',
            duration: 18000
        });
        timeline.play();
        // at 3.5 seconds, fade in the CSOOW image
        sc.time.delayedCall(3500, function () {
            var csoow = _this.add.image(20, 20, "csoow");
            csoow.setOrigin(0, 0);
            csoow.alpha = 0;
            sc.add.tween({
                targets: [csoow],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            sc.add.tween({
                targets: [container],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return .6; }
                }
            });
            var operator = _this.add.image(842, 20, "operator");
            operator.setOrigin(0, 0);
            operator.alpha = 0;
            // fade in the operator
            sc.add.tween({
                targets: [operator],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 4000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            // now that operator is shown, show new CC text and play new audio
            sc.time.delayedCall(6000, function () {
                // change the cc text
                Sim.output.innerHTML = "\"Sir, the number 1 chiller has failed, the system is now using the number 3 redundant chiller to meet the chilled water requirements.\"";
                // play second audio
                AudioNarration.stop();
                AudioNarration.destroy();
                AudioNarration.initialize('Scenario_02-10');
                AudioNarration.currentTime = 0;
                AudioNarration.play();
            }, [], sc);
        }, [], sc);
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleSystemFailureScene10");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("SingleSystemFailureScene8");
            }, [], sc);
        });
    };
    ;
    return SingleSystemFailureScene8;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene10 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene10, _super);
    function SingleSystemFailureScene10() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene10" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene10.prototype.preload = function () {
        this.load.image("Scene10_startFrame", "../public/images/UCC_Monitor_Pan-Left_to_Center_Single_Sys_Failure_CWS_end.png");
        this.load.image("combatSystemAlarms_LowPress", "../public/images/CombatSystemAlarms_LowPress.png");
        this.load.image("combatSystemAlarms_HighTemp", "../public/images/CombatSystemAlarms_HighTemp.png");
    };
    SingleSystemFailureScene10.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene10.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleSystemFailureScene10";
        var cam = this.cameras.main;
        var sc = this;
        var faultChoice = 1;
        var played = false;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // start image
        var uccStartFrame = this.add.image(0, 0, "Scene10_startFrame");
        uccStartFrame.setOrigin(0, 0);
        uccStartFrame.setDisplaySize(width, height);
        uccStartFrame.setAlpha(1);
        // optional end frames
        var uccScreenImage1 = this.add.image(0, 0, "combatSystemAlarms_LowPress");
        uccScreenImage1.setOrigin(0, 0);
        uccScreenImage1.setDisplaySize(width, height);
        uccScreenImage1.setAlpha(0);
        var uccScreenImage2 = this.add.image(0, 0, "combatSystemAlarms_HighTemp");
        uccScreenImage2.setOrigin(0, 0);
        uccScreenImage2.setDisplaySize(width, height);
        uccScreenImage2.setAlpha(0);
        container.add(uccStartFrame);
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        // pick a number between 1 and 2.
        // If 1, we will use the fault: LOW PRESS
        // If 2, we will use the fault: HIGH TEMP
        faultChoice = this.randomInt(1, 20);
        if (faultChoice > 10) {
            faultChoice = 2;
            Sim.currentFault = faultChoice;
            // use this video:
            VideoAnimation.initialize('UCC_Monitor_Pan-Center_to_Left_Single_Sys_Failure_CWS_Hi_Temp');
            VideoAnimation.fadeOut = true;
            VideoAnimation.playbackRate = 0.6;
            VideoAnimation.currentTime = 0;
        }
        else {
            faultChoice = 1;
            Sim.currentFault = faultChoice;
            // use this video:
            VideoAnimation.initialize('UCC_Monitor_Pan-Center_to_Left_Single_Sys_Failure_CWS_Low_Pressure');
            VideoAnimation.fadeOut = false;
            VideoAnimation.playbackRate = 0.6;
            VideoAnimation.currentTime = 0;
        }
        sc.time.delayedCall(2000, function () {
            if (faultChoice == 1) {
                uccScreenImage1.setAlpha(1);
                container.add(uccScreenImage1);
                container.bringToTop(uccScreenImage1);
            }
            else {
                uccScreenImage2.setAlpha(1);
                container.add(uccScreenImage2);
                container.bringToTop(uccScreenImage2);
            }
            container.remove(uccStartFrame);
        }, [], sc);
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        AudioNarration.initialize('Scenario_02-11');
        AudioNarration.currentTime = 0;
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Linear',
                duration: 0
            });
            // if fault 1, create timeline for it and trigger it's second audio after 8 seconds
            if (faultChoice == 1) {
                timeline.add({
                    targets: uccScreenImage1,
                    alpha: 1,
                    ease: 'Linear',
                    duration: 15000
                });
            }
            else {
                timeline.add({
                    targets: uccScreenImage2,
                    alpha: 1,
                    ease: 'Linear',
                    duration: 15000
                });
            }
            if (played == false) {
                played = true;
                AudioNarration.play();
                timeline.play();
                Sim.output.innerHTML = "<p>At the UCC, you open the AEGIS Combat Systems Alarms screen and focus on the Radar System failures.</p>";
            }
            // at 8 seconds, play the next audio
            sc.time.delayedCall(8000, function () {
                var audioFile;
                if (faultChoice == 1) {
                    Sim.output.innerHTML = "<p>You notice that the number one chilled water supply low pressure alarm has been triggered.</p>";
                    audioFile = 'Scenario_02-11b';
                }
                else {
                    Sim.output.innerHTML = "<p>You notice that the number one chilled water supply high temp alarm has been triggered.</p>";
                    audioFile = 'Scenario_02-11a';
                }
                // play second audio
                AudioNarration.stop();
                AudioNarration.destroy();
                AudioNarration.initialize(audioFile);
                AudioNarration.currentTime = 0;
                AudioNarration.play();
            }, [], sc);
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("SingleSystemFailureScene11");
                sc.scene.stop("SingleSystemFailureScene10");
            });
        };
    };
    /**
     * generate a random integer between min and max
     * @param {Number} min
     * @param {Number} max
     * @return {Number} random generated integer
     */
    SingleSystemFailureScene10.prototype.randomInt = function (min, max) {
        var myRandom = Math.random();
        return Math.floor(myRandom * (max - min + 1)) + min;
    };
    return SingleSystemFailureScene10;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene11 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene11, _super);
    function SingleSystemFailureScene11() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene11" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene11.prototype.preload = function () {
        this.load.image("combatSystemAlarms_LowPress2", "../public/images/CombatSystemAlarms_LowPress.png");
        this.load.image("combatSystemAlarms_HighTemp2", "../public/images/CombatSystemAlarms_HighTemp.png");
    };
    SingleSystemFailureScene11.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene11.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "You locate the Thermocold Chiller Maintenance Manual and alert the maintainer on duty about the failure.";
        Sim.currentScene = "SingleSystemFailureScene11";
        var cam = this.cameras.main;
        var sc = this;
        var highlight;
        var refButton = sc.$('#btnReference', parent.document);
        var refButton_offset = refButton.offset();
        var refButton_PosX = Math.floor(refButton_offset.left);
        var myOffset;
        var sideBarLeft = parseInt(getComputedStyle(parent.document.querySelector(".sidebar")).left);
        if (sideBarLeft < 0) { // LMS version
            myOffset = 0;
        }
        else {
            myOffset = refButton_PosX - 1136;
        }
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        // optional end frames
        if (Sim.currentFault == 1) {
            var uccScreenImage1 = this.add.image(0, 0, "combatSystemAlarms_LowPress2");
            uccScreenImage1.setOrigin(0, 0);
            uccScreenImage1.setDisplaySize(width, height);
            uccScreenImage1.setAlpha(1);
            container.add(uccScreenImage1);
            timeline.add({
                targets: uccScreenImage1,
                alpha: 1,
                ease: 'Linear',
                duration: 7500
            });
        }
        else {
            var uccScreenImage2 = this.add.image(0, 0, "combatSystemAlarms_HighTemp2");
            uccScreenImage2.setOrigin(0, 0);
            uccScreenImage2.setDisplaySize(width, height);
            uccScreenImage2.setAlpha(1);
            container.add(uccScreenImage2);
            timeline.add({
                targets: uccScreenImage2,
                alpha: 1,
                ease: 'Linear',
                duration: 7500
            });
        }
        AudioNarration.initialize('Scenario_02-12');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        timeline.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            highlight = new Highlight();
            highlight.width = 104;
            highlight.height = 34;
            //highlight.x = 1136;
            highlight.x = refButton_PosX - myOffset;
            highlight.y = 10;
            highlight.blink = true;
            highlight.show();
            sc.time.delayedCall(500, function () {
                /***************************************************************** */
                /*   CODE FOR SELECTING THE MAINT DOC AND THEN THE CLOSE BUTTON
                /***************************************************************** */
                sc.$('.maint', parent.document).one("click", function () {
                    try {
                        highlight.hide();
                    }
                    catch (e) { }
                    sc.$('.btn-danger, .close', parent.document).one("click", function () {
                        sc.$('#btnForward', parent.document).click();
                    });
                });
            }, [], sc);
        });
    };
    return SingleSystemFailureScene11;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleSystemFailureScene12 = /** @class */ (function (_super) {
    __extends(SingleSystemFailureScene12, _super);
    function SingleSystemFailureScene12() {
        var _this = _super.call(this, { key: "SingleSystemFailureScene12" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleSystemFailureScene12.prototype.preload = function () {
        this.load.image("chilledWaterSummerStart", "../public/images/ChilledWaterSummerStart.png");
        this.load.image("Chiller_Reset", "../public/images/ChilledWaterUnitReset.png");
        this.load.image("Chiller_Priority", "../public/images/ChilledWaterChillerPriority.png");
        this.load.image("chilledWaterSummerFinished", "../public/images/ChilledWaterSummerFinished.png");
    };
    SingleSystemFailureScene12.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleSystemFailureScene12.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleSystemFailureScene12";
        var cam = this.cameras.main;
        var sc = this;
        sc.time.clearPendingEvents();
        sc.time.removeAllEvents();
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var Chiller_Normal = this.add.image(0, 0, "chilledWaterSummerStart");
        Chiller_Normal.setOrigin(0, 0);
        Chiller_Normal.setAlpha(0);
        Chiller_Normal.setDisplaySize(width, height);
        container.add(Chiller_Normal);
        var Chiller_Reset = this.add.image(0, 0, "Chiller_Reset");
        Chiller_Reset.setOrigin(0, 0);
        Chiller_Reset.setDisplaySize(width, height);
        Chiller_Reset.setAlpha(0);
        container.add(Chiller_Reset);
        var Chiller_Priority = this.add.image(0, 0, "Chiller_Priority");
        Chiller_Priority.setOrigin(0, 0);
        Chiller_Priority.setDisplaySize(width, height);
        Chiller_Priority.setAlpha(0);
        container.add(Chiller_Priority);
        var Chiller_Finished = this.add.image(0, 0, "chilledWaterSummerFinished");
        Chiller_Finished.setOrigin(0, 0);
        Chiller_Finished.setDisplaySize(width, height);
        Chiller_Finished.setAlpha(0);
        container.add(Chiller_Finished);
        AudioNarration.initialize('Scenario_02-13');
        AudioNarration.currentTime = 0;
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        sc.time.delayedCall(2000, function () {
            sc.add.tween({
                targets: Chiller_Normal,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            sc.time.paused = true;
        }, [], sc);
        if (Sim.currentFault == 2) {
            VideoAnimation.initialize('UCC_Monitor_Pan-Left_to_Center_Single_Sys_Failure_CWS_High_Temp');
            VideoAnimation.fadeOut = true;
            VideoAnimation.playbackRate = 0.6;
            VideoAnimation.currentTime = 0;
        }
        else {
            VideoAnimation.initialize('UCC_Monitor_Pan-Left_to_Center_Single_Sys_Failure_CWS_Low_Pressure');
            VideoAnimation.fadeOut = true;
            VideoAnimation.playbackRate = 0.6;
            VideoAnimation.currentTime = 0;
        }
        VideoAnimation.play();
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: Chiller_Normal,
                alpha: 1,
                ease: 'Power1',
                duration: 12000
            });
            sc.time.paused = false;
            timeline.play();
            AudioNarration.play();
            Sim.output.innerHTML = "Once the maintainer has notified you that the chiller has been repaired, reset the chiller alarms, switch back to the original chiller priority and verify the fix.";
            // at 3.5 seconds, bring in the first popup
            sc.time.delayedCall(3500, function () {
                sc.add.tween({
                    targets: Chiller_Reset,
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 1000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
            }, [], sc);
            // at 6 seconds, bring in the first popup
            sc.time.delayedCall(6000, function () {
                sc.add.tween({
                    targets: Chiller_Priority,
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 1000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
                container.remove(Chiller_Reset);
            }, [], sc);
            // at 9 seconds, bring in the first popup
            sc.time.delayedCall(9000, function () {
                sc.add.tween({
                    targets: [Chiller_Reset, Chiller_Priority],
                    ease: "Sine.easeInOut",
                    duration: 100,
                    delay: 10,
                    alpha: {
                        getStart: function () { return 1; },
                        getEnd: function () { return 0; },
                    }
                });
                //
                container.add(Chiller_Finished);
                Chiller_Finished.setAlpha(1);
            }, [], sc);
            timeline.setCallback("onComplete", function () {
                // **** show Lesson Complete ****
                timeline.stop();
                Sim.output.innerHTML = '';
                Sim.currentScene = "";
                AudioNarration.stop();
                AudioNarration.destroy();
                sc.time.delayedCall(2000, function () {
                    sc.scene.stop("SingleSystemFailureScene12");
                    Sim.setComplete();
                }, [], sc);
            });
        };
    };
    return SingleSystemFailureScene12;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpIntro = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpIntro, _super);
    function FailureChilledWaterPumpIntro() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpIntro" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpIntro.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/ChilledWaterWinter.png");
    };
    FailureChilledWaterPumpIntro.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpIntro.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpIntro";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('UCC_Console_Zoom_Return_Sys_Pump_Failure');
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 0;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 13000
            });
            timeline.play();
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("FailureChilledWaterPumpStep1");
                sc.time.delayedCall(2000, function () {
                    sc.scene.stop("FailureChilledWaterPumpIntro");
                }, [], sc);
            });
        };
        AudioNarration.initialize('Scenario_03-01');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        VideoAnimation.play();
        Sim.output.innerHTML = "\n                <p>\n                During this lesson, you will be able to analyze a single loss of a Return System Pump in the Chilled Water System, recognize the automated sequence, follow the corrective maintenance sequence, and restore the system to normal operation.\n                </p>\n            ";
    };
    return FailureChilledWaterPumpIntro;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep1 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep1, _super);
    function FailureChilledWaterPumpStep1() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep1" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep1.prototype.preload = function () {
        this.load.image("chilledWaterWinter", "../public/images/ChilledWaterWinter.png");
    };
    FailureChilledWaterPumpStep1.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep1.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep1";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "chilledWaterWinter");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 10000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_03-02');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                Chilled water is supplied to the Reconstitutable Deck House where it serves Heating, Ventilation and Air Conditioning, and the Combat System equipment.\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("FailureChilledWaterPumpStep2");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("FailureChilledWaterPumpStep1");
            }, [], sc);
        });
    };
    return FailureChilledWaterPumpStep1;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep2 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep2, _super);
    function FailureChilledWaterPumpStep2() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep2" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep2.prototype.preload = function () {
        this.load.image("chilledWaterSummer", "../public/images/ChilledWaterSummerB.png");
    };
    FailureChilledWaterPumpStep2.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep2.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep2";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "chilledWaterSummer");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        container.setDepth(1);
        var leftPump = sc.add.graphics({});
        leftPump.lineStyle(4, 0xfaff77, 1.0);
        leftPump.fillStyle(0xffffff, 1);
        leftPump.setDepth(100);
        var rightPump = sc.add.graphics({});
        rightPump.lineStyle(4, 0xfaff77, 1.0);
        rightPump.setDepth(100);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        rect1.setSize(50, 50);
        rect1.setPosition(164, 237);
        rect2.setSize(40, 40);
        rect2.setPosition(865, 103);
        leftPump.strokeRectShape(rect1);
        rightPump.strokeRectShape(rect2);
        container.add(leftPump);
        container.add(rightPump);
        container.removeInteractive();
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 14000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_03-03');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                The Chilled Water System has two booster pumps that maintain pressure to the SPY Water Cooler Skid.  Due to the skid being the last user of cold water, the pumps are necessary to compensate for the pressure drop through the rest of the system.\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            // clear the yellow border
            leftPump.clear();
            // be sure the leftPump is available to click on
            leftPump.setAlpha(1);
            // remove the rightPump; no longer will need this
            rightPump.setAlpha(0);
            container.remove(rightPump);
            // set the leftPump to be the current hotspot
            leftPump.setInteractive(rect1, Phaser.Geom.Rectangle.Contains);
            // correct response area
            leftPump.on('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                leftPump.setAlpha(0);
                leftPump.removeInteractive();
                // play correct response
                sc.correctFeedback2(function () {
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("FailureChilledWaterPumpStep3");
                    sc.time.delayedCall(2000, function () {
                        sc.scene.stop("FailureChilledWaterPumpStep2");
                    }, [], sc);
                });
            });
            // incorrect response area
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                sc.incorrectFeedback2();
                if (Sim.incorrectCount > Sim.promptIncorrect) {
                    leftPump.lineStyle(4, 0xfaff77, 1.0);
                    leftPump.strokeRectShape(rect1);
                    sc.add.tween({
                        targets: [leftPump],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 0,
                        alpha: {
                            getStart: function () { return 1; },
                            getEnd: function () { return 1; }
                        }
                    });
                }
            });
            sc.time.delayedCall(1500, function () {
                // set the prompt
                Sim.output.innerHTML = "Click on the Chilled Water Return System Pump.";
                // play second audio
                AudioNarration.stop();
                timeline.stop();
                AudioNarration.destroy();
                AudioNarration.initialize('Scenario_03_Step2_CQ');
                AudioNarration.currentTime = 0;
                AudioNarration.play();
            }, [], sc);
        });
    };
    FailureChilledWaterPumpStep2.prototype.correctFeedback2 = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            callback();
        }, [], this);
    };
    FailureChilledWaterPumpStep2.prototype.incorrectFeedback2 = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
    };
    return FailureChilledWaterPumpStep2;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep3 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep3, _super);
    function FailureChilledWaterPumpStep3() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep3" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep3.prototype.preload = function () {
        this.load.image("AA_building", "../public/images/AA_Building_Landscape-000.png");
    };
    FailureChilledWaterPumpStep3.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep3.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep3";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "AA_building");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 12000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_03-04-with_AlarmSound');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                Without the correct chilled water flow, the SPY equipment will eventually reach alarm levels....[alarm sounding].\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("FailureChilledWaterPumpStep4");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("FailureChilledWaterPumpStep3");
            }, [], sc);
        });
    };
    return FailureChilledWaterPumpStep3;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep4 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep4, _super);
    function FailureChilledWaterPumpStep4() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep4" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep4.prototype.preload = function () {
        this.load.image("chilledWaterWinter_flow1", "../public/images/ChilledWaterWinterB_flow1.png");
        this.load.image("chilledWaterWinter_flow2", "../public/images/ChilledWaterWinterB_flow2.png");
    };
    FailureChilledWaterPumpStep4.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep4.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep4";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccScreenImage1 = this.add.image(0, 0, "chilledWaterWinter_flow1");
        this.uccScreenImage1.setOrigin(0, 0);
        this.uccScreenImage1.setDisplaySize(width, height);
        this.uccScreenImage2 = this.add.image(0, 0, "chilledWaterWinter_flow2");
        this.uccScreenImage2.setOrigin(0, 0);
        this.uccScreenImage2.setDisplaySize(width, height);
        this.container.add(this.uccScreenImage2);
        this.container.add(this.uccScreenImage1);
        this.currentImage = "flow1";
        this.time.addEvent({ delay: 500, callback: this.onEvent, callbackScope: this, loop: true });
        AudioNarration.initialize('Scenario_03-05');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                The Chilled Water Return Pump transports water with nominal temperatures back to the chiller.\n                </p>\n            ";
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: [sc.uccScreenImage1, sc.uccScreenImage2],
            alpha: 1,
            ease: 'Power1',
            duration: 7500
        });
        timeline.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("FailureChilledWaterPumpStep5");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("FailureChilledWaterPumpStep4");
            }, [], sc);
        });
    };
    FailureChilledWaterPumpStep4.prototype.onEvent = function () {
        if (this.currentImage == "flow1") {
            this.container.bringToTop(this.uccScreenImage2);
            this.currentImage = "flow2";
        }
        else {
            this.container.bringToTop(this.uccScreenImage1);
            this.currentImage = "flow1";
        }
    };
    return FailureChilledWaterPumpStep4;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep5 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep5, _super);
    function FailureChilledWaterPumpStep5() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep5" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep5.prototype.preload = function () {
        this.load.image("chilledWaterWinterB", "../public/images/ChilledWaterWinterB.png");
        this.load.image("chilledWaterRunFail", "../public/images/ChilledWaterWinterB_ReturnPumpFailure.png");
    };
    FailureChilledWaterPumpStep5.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep5.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep5";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccScreenImage1 = this.add.image(0, 0, "chilledWaterWinterB");
        this.uccScreenImage1.setOrigin(0, 0);
        this.uccScreenImage1.setDisplaySize(width, height);
        this.uccScreenImage2 = this.add.image(0, 0, "chilledWaterRunFail");
        this.uccScreenImage2.setOrigin(0, 0);
        this.uccScreenImage2.setDisplaySize(width, height);
        this.container.add(this.uccScreenImage2);
        this.container.add(this.uccScreenImage1);
        this.currentImage = "winter";
        this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
        AudioNarration.initialize('Scenario_03-06');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                The Chilled Water Return Pump is designed with one plus one redundancy. Only one pump is required to meet the peak SPY Water Cooler chilled water flow necessary for proper cooling. The alternate pump provides coverage for maintenance outages and equipment failure.\n                </p>\n            ";
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: [sc.uccScreenImage1, sc.uccScreenImage2],
            alpha: 1,
            ease: 'Power1',
            duration: 18000
        });
        timeline.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("KnowledgeQuestionStep5");
            sc.scene.stop("FailureChilledWaterPumpStep5");
        });
    };
    FailureChilledWaterPumpStep5.prototype.onEvent = function () {
        if (this.currentImage == "winter") {
            this.container.bringToTop(this.uccScreenImage2);
            this.currentImage = "runFail";
        }
        else {
            this.container.bringToTop(this.uccScreenImage1);
            this.currentImage = "winter";
        }
    };
    return FailureChilledWaterPumpStep5;
}(Phaser.Scene));
/// <reference path="../../../KnowledgeQuestion.ts" />
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var KnowledgeQuestionStep5 = /** @class */ (function (_super) {
    __extends(KnowledgeQuestionStep5, _super);
    function KnowledgeQuestionStep5() {
        var _this = _super.call(this, { key: "KnowledgeQuestionStep5" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'If the primary return pump fails, what is the systems automatic response?';
        _this.answers = [
            'Shut down the Chilled Water System.',
            'The Hot Water System Activates.',
            'Chiller 3 is switched on.',
            'The alternate pump automatically covers.'
        ];
        _this.correct = 3;
        return _this;
    }
    KnowledgeQuestionStep5.prototype.preload = function () {
        this.load.image("chilledWaterWinterB", "../public/images/ChilledWaterWinterB.png");
    };
    KnowledgeQuestionStep5.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    KnowledgeQuestionStep5.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "If the primary return pump fails, what is the systems automatic response?";
        Sim.currentScene = "KnowledgeQuestionStep5";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var KQ_BG = this.add.image(0, 0, "chilledWaterWinterB");
        KQ_BG.setOrigin(0, 0);
        KQ_BG.setDisplaySize(width, height);
        container.add(KQ_BG);
        AudioNarration.initialize('Scenario_03_Step5_CQ');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 6) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestion();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswer = this.correct;
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
    };
    KnowledgeQuestionStep5.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    KnowledgeQuestionStep5.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
        }, [], this);
    };
    return KnowledgeQuestionStep5;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep6 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep6, _super);
    function FailureChilledWaterPumpStep6() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep6" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep6.prototype.preload = function () {
        this.load.image("chilledWaterWinter", "../public/images/ChilledWaterWinterB.png");
        this.load.image("chilledWaterWinterPumpFailure", "../public/images/ChilledWaterWinterB_ReturnPumpFailure.png");
        this.load.image("chilledWaterReturnPumpsUnavailable", "../public/images/ChilledWaterReturnPumpsUnavailable2.png");
    };
    FailureChilledWaterPumpStep6.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep6.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep6";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // create first image
        this.uccScreenImage1 = this.add.image(0, 0, "chilledWaterWinter");
        this.uccScreenImage1.setOrigin(0, 0);
        this.uccScreenImage1.setDisplaySize(width, height);
        this.uccScreenImage1.setAlpha(1);
        // create second image
        this.uccScreenImage2 = this.add.image(0, 0, "chilledWaterWinterPumpFailure");
        this.uccScreenImage2.setOrigin(0, 0);
        this.uccScreenImage2.setDisplaySize(width, height);
        this.uccScreenImage2.setAlpha(0);
        // create third image
        this.uccScreenImage3 = this.add.image(0, 0, "chilledWaterReturnPumpsUnavailable");
        this.uccScreenImage3.setOrigin(0, 0);
        this.uccScreenImage3.setDisplaySize(width, height);
        this.uccScreenImage3.setAlpha(0);
        container.add(this.uccScreenImage1);
        this.currentImage = "winter";
        AudioNarration.initialize('Scenario_03-07');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                If the return pumps were unavailable, the SPY radar would eventually reach alarm levels.  The SPY Water Cooler skid would have high temperature and low-pressure alarms that would be shown on the Aegis Combat System Alarms screen.  Electronic Chill Water cooled SPY equipment on the main deck and 03 Levels would have to be shut down to protect it from overheating.\n                </p>\n            ";
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: [sc.uccScreenImage1],
            alpha: 1,
            ease: 'Power1',
            duration: 23000
        });
        timeline.play();
        sc.scene.stop("KnowledgeQuestionStep5");
        // at 3 seconds, fade out the first image
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: sc.uccScreenImage2,
                ease: 'Sine.easeInOut',
                duration: 2000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        // at 8 seconds, fade out the first image
        sc.time.delayedCall(8000, function () {
            sc.add.tween({
                targets: sc.uccScreenImage3,
                ease: 'Sine.easeInOut',
                duration: 3000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("KnowledgeQuestionStep6");
            sc.scene.stop("FailureChilledWaterPumpStep6");
        });
    };
    return FailureChilledWaterPumpStep6;
}(Phaser.Scene));
/// <reference path="../../../KnowledgeQuestionMultiple.ts" />
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var KnowledgeQuestionStep6 = /** @class */ (function (_super) {
    __extends(KnowledgeQuestionStep6, _super);
    function KnowledgeQuestionStep6() {
        var _this = _super.call(this, { key: "KnowledgeQuestionStep6" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'What are some consequences of having no chilled water available to the combat systems?';
        _this.answers = [
            'The Chilled Water System would shut down.',
            'SPY radar equipment will be shut down.',
            'The Fire Suppression System will deactivate.',
            'The Combat System cannot operate.'
        ];
        _this._correctAnswers = [false, true, false, true];
        return _this;
    }
    KnowledgeQuestionStep6.prototype.preload = function () {
        this.load.image("chilledWaterReturnPumpsUnavailable", "../public/images/ChilledWaterReturnPumpsUnavailable.png");
    };
    KnowledgeQuestionStep6.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    KnowledgeQuestionStep6.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "What are some consequences of having no chilled water available to the combat systems?";
        Sim.currentScene = "KnowledgeQuestionStep6";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var KQ_start = this.add.image(0, 0, "chilledWaterReturnPumpsUnavailable");
        KQ_start.setOrigin(0, 0);
        KQ_start.setDisplaySize(width, height);
        container.add(KQ_start);
        AudioNarration.initialize('Scenario_03_Step6_CQ');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 6) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestionMultiple();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswers[0] = this._correctAnswers[0];
        question.correctAnswers[1] = this._correctAnswers[1];
        question.correctAnswers[2] = this._correctAnswers[2];
        question.correctAnswers[3] = this._correctAnswers[3];
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
        sc.scene.stop("FailureChilledWaterPumpStep6");
    };
    KnowledgeQuestionStep6.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    KnowledgeQuestionStep6.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
        }, [], this);
    };
    return KnowledgeQuestionStep6;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep7 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep7, _super);
    function FailureChilledWaterPumpStep7() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep7" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep7.prototype.preload = function () {
        this.load.image("chilledWaterAlarmDisplayed_Red", "../public/images/ChilledWaterReturnPumpAlarmCode.png");
        this.load.image("chilledWaterAlarmDisplayed_noRed", "../public/images/ChilledWaterReturnPumpAlarmCode2.png");
    };
    FailureChilledWaterPumpStep7.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep7.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep7";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccScreenImage1 = this.add.image(0, 0, "chilledWaterAlarmDisplayed_noRed");
        this.uccScreenImage1.setOrigin(0, 0);
        this.uccScreenImage1.setDisplaySize(width, height);
        this.uccScreenImage2 = this.add.image(0, 0, "chilledWaterAlarmDisplayed_Red");
        this.uccScreenImage2.setOrigin(0, 0);
        this.uccScreenImage2.setDisplaySize(width, height);
        this.uccScreenImage2.alpha = 0;
        this.container.add(this.uccScreenImage1);
        this.currentImage = "alarm";
        AudioNarration.initialize('Scenario_03-08');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                As you are standing watch at the Universal Control Console, you notice an alarm on the Chilled Water System display screen.\n                </p>\n            ";
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: [sc.uccScreenImage1],
            alpha: 1,
            ease: 'Power1',
            duration: 8000
        });
        timeline.play();
        sc.scene.stop("KnowledgeQuestionStep6");
        // at 3 seconds, fade in red outline
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: _this.uccScreenImage2,
                ease: 'Sine.easeInOut',
                duration: 1500,
                delay: 100,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        // at 6 seconds, fade it back out
        sc.time.delayedCall(6000, function () {
            sc.add.tween({
                targets: _this.uccScreenImage2,
                ease: 'Sine.easeInOut',
                duration: 1500,
                delay: 100,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return 0; }
                }
            });
        }, [], sc);
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("KnowledgeQuestionStep7");
            sc.scene.stop("FailureChilledWaterPumpStep7");
        });
    };
    return FailureChilledWaterPumpStep7;
}(Phaser.Scene));
/// <reference path="../../../KnowledgeQuestion.ts" />
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var KnowledgeQuestionStep7 = /** @class */ (function (_super) {
    __extends(KnowledgeQuestionStep7, _super);
    function KnowledgeQuestionStep7() {
        var _this = _super.call(this, { key: "KnowledgeQuestionStep7" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'What alarm code do you see that would impact the Chilled Water System?';
        _this.answers = [
            'SPY-1D CHW Sup Hi Temp',
            'SPY-1D CHW Sup Lo Pres',
            'CHW Ret Pump 1 Run Failure Alarm',
            'USE 7A UPS On Battery'
        ];
        _this.correct = 2;
        return _this;
    }
    KnowledgeQuestionStep7.prototype.preload = function () {
        this.load.image("chilledWaterAlarmDisplayed", "../public/images/ChilledWaterReturnPumpAlarmCode2.png");
    };
    KnowledgeQuestionStep7.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    KnowledgeQuestionStep7.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "What alarm code do you see that would impact the Chilled Water System?";
        Sim.currentScene = "KnowledgeQuestionStep7";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var KQ_BG = this.add.image(0, 0, "chilledWaterAlarmDisplayed");
        KQ_BG.setOrigin(0, 0);
        KQ_BG.setDisplaySize(width, height);
        container.add(KQ_BG);
        AudioNarration.initialize('Scenario_03_Step7_CQ');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 6) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestion();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswer = this.correct;
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
    };
    KnowledgeQuestionStep7.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    KnowledgeQuestionStep7.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
        }, [], this);
    };
    return KnowledgeQuestionStep7;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep8 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep8, _super);
    function FailureChilledWaterPumpStep8() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep8" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep8.prototype.preload = function () {
        this.load.image("chilledWaterAlarmDisplayed2", "../public/images/ChilledWaterReturnPumpAlarmCode2.png");
        this.load.image("csoow", "../public/images/CSOOW.png");
        this.load.image("operator", "../public/images/Chief_Still.png");
    };
    FailureChilledWaterPumpStep8.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep8.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep8";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var chilledWaterBackground = this.add.image(0, 0, "chilledWaterAlarmDisplayed2");
        chilledWaterBackground.setOrigin(0, 0);
        chilledWaterBackground.setDisplaySize(width, height);
        container.add(chilledWaterBackground);
        sc.scene.stop("KnowledgeQuestionStep7");
        // initial Audio to play
        AudioNarration.initialize('Scenario_03-10');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        // initial CC text to show
        Sim.output.innerHTML = "\n            After verifying that the system has activated the redundant return pump, you now notify the CSOOW that there has been a failure in the Chilled Water System.\n            ";
        // Global scene timeline created
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: chilledWaterBackground,
            alpha: 1,
            ease: 'Power1',
            duration: 17500
        });
        timeline.play();
        // at 6 seconds, fade in the CSOOW image
        sc.time.delayedCall(4000, function () {
            var csoow = _this.add.image(20, 20, "csoow");
            csoow.setOrigin(0, 0);
            csoow.alpha = 0;
            sc.add.tween({
                targets: [csoow],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            sc.add.tween({
                targets: [container],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return .6; }
                }
            });
            var operator = _this.add.image(842, 20, "operator");
            operator.setOrigin(0, 0);
            operator.alpha = 0;
            // fade in the operator
            sc.add.tween({
                targets: [operator],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 4000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            // now that operator is shown, show new CC text and play new audio
            sc.time.delayedCall(5000, function () {
                // change the cc text
                Sim.output.innerHTML = "\"Sir. The Chilled Water System Return Pump one has failed. The system is now running on Return Pump two\".";
                // play second audio
                AudioNarration.stop();
                AudioNarration.destroy();
                AudioNarration.initialize('Scenario_03-11');
                AudioNarration.currentTime = 0;
                AudioNarration.play();
            }, [], sc);
        }, [], sc);
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("FailureChilledWaterPumpStep10");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("FailureChilledWaterPumpStep8");
            }, [], sc);
        });
    };
    ;
    return FailureChilledWaterPumpStep8;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep10 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep10, _super);
    function FailureChilledWaterPumpStep10() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep10" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep10.prototype.preload = function () {
        this.load.image("chilledWaterAlarmDisplayed3", "../public/images/ChilledWaterReturnPumpAlarmCode2.png");
    };
    FailureChilledWaterPumpStep10.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep10.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "You locate the Grundfos Motor Maintenance Manual and notify the maintainer on duty of the failure of the number one return pump.";
        Sim.currentScene = "FailureChilledWaterPumpStep10";
        var cam = this.cameras.main;
        var sc = this;
        var highlight;
        var refButton = sc.$('#btnReference', parent.document);
        var refButton_offset = refButton.offset();
        var refButton_PosX = Math.floor(refButton_offset.left);
        var myOffset;
        var sideBarLeft = parseInt(getComputedStyle(parent.document.querySelector(".sidebar")).left);
        if (sideBarLeft < 0) { // LMS version
            myOffset = 0;
        }
        else {
            myOffset = refButton_PosX - 1136;
        }
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // optional end frames
        var uccScreenImage1 = this.add.image(0, 0, "chilledWaterAlarmDisplayed3");
        uccScreenImage1.setOrigin(0, 0);
        uccScreenImage1.setDisplaySize(width, height);
        uccScreenImage1.setAlpha(1);
        container.add(uccScreenImage1);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccScreenImage1,
            alpha: 1,
            ease: 'Linear',
            duration: 9000
        });
        AudioNarration.initialize('Scenario_03-12');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        timeline.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            highlight = new Highlight();
            highlight.width = 104;
            highlight.height = 34;
            //highlight.x = 1136;
            highlight.x = refButton_PosX - myOffset;
            highlight.y = 10;
            highlight.blink = true;
            highlight.show();
            sc.time.delayedCall(500, function () {
                /***************************************************************** */
                /*   CODE FOR SELECTING THE MAINT DOC AND THEN THE CLOSE BUTTON
                /***************************************************************** */
                sc.$('.grundfos', parent.document).one("click", function () {
                    try {
                        highlight.hide();
                    }
                    catch (e) { }
                    sc.$('.btn-danger, .close', parent.document).one("click", function () {
                        sc.$('#btnForward', parent.document).click();
                    });
                });
            }, [], sc);
        });
    };
    return FailureChilledWaterPumpStep10;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep11 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep11, _super);
    function FailureChilledWaterPumpStep11() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep11" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep11.prototype.preload = function () {
        this.load.image("chilledWaterReturnPumpsUnavailable", "../public/images/ChilledWaterReturnPumpsUnavailable2.png");
    };
    FailureChilledWaterPumpStep11.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep11.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep11";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "chilledWaterReturnPumpsUnavailable");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 12000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_03-13');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                If the redundant return pump was to fail at this time, the maintainer would have thirty minutes to fix one of the pumps before you would have to start to shut down the SPY radar system.\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("FailureChilledWaterPumpStep12");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("FailureChilledWaterPumpStep11");
            }, [], sc);
        });
    };
    return FailureChilledWaterPumpStep11;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep12 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep12, _super);
    function FailureChilledWaterPumpStep12() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep12" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep12.prototype.preload = function () {
        this.load.image("chilledWaterWinterPump1Fixed", "../public/images/ChilledWaterWinterB_ReturnPumpFailure2.png");
        this.load.image("chilledWaterWinterB", "../public/images/ChilledWaterWinterB.png");
    };
    FailureChilledWaterPumpStep12.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep12.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep12";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // create first image
        this.uccScreenImage1 = this.add.image(0, 0, "chilledWaterWinterPump1Fixed");
        this.uccScreenImage1.setOrigin(0, 0);
        this.uccScreenImage1.setDisplaySize(width, height);
        this.uccScreenImage1.setAlpha(1);
        // create second image
        this.uccScreenImage2 = this.add.image(0, 0, "chilledWaterWinterB");
        this.uccScreenImage2.setOrigin(0, 0);
        this.uccScreenImage2.setDisplaySize(width, height);
        this.uccScreenImage2.setAlpha(1);
        container.add(this.uccScreenImage2);
        container.add(this.uccScreenImage1);
        this.currentImage = "pump1fixed";
        // create rectangle over the reset button
        var unitReset = sc.add.graphics({});
        unitReset.lineStyle(4, 0xfaff77, 1.0);
        unitReset.setDepth(100);
        unitReset.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(50, 28);
        rect1.setPosition(98, 208);
        unitReset.strokeRectShape(rect1);
        container.add(unitReset);
        // create rectangle over the set lead button
        var setLead = sc.add.graphics({});
        setLead.lineStyle(4, 0xfaff77, 1.0);
        setLead.setDepth(100);
        setLead.setAlpha(0);
        var rect2 = new Phaser.Geom.Rectangle();
        rect2.setSize(50, 28);
        rect2.setPosition(98, 184);
        setLead.strokeRectShape(rect2);
        container.add(setLead);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: [sc.uccScreenImage1, sc.uccScreenImage2],
            alpha: 1,
            ease: 'Power1',
            duration: 14000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_03-14');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                The maintainer alerts you that the number one return pump has been fixed. You reset the unit on the Chilled Water System screen on the Universal Control Console, then set the number one pump as the lead pump. \n                </p>\n            ";
        // at 4 seconds, show the rectangle over the unit reset button    
        sc.time.delayedCall(4000, function () {
            unitReset.setAlpha(1);
        }, [], sc);
        // at 8 seconds, fade out the first image
        sc.time.delayedCall(8000, function () {
            unitReset.setAlpha(0);
            setLead.setAlpha(1);
            sc.add.tween({
                targets: sc.uccScreenImage1,
                ease: 'Sine.easeInOut',
                duration: 2000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return 0; }
                }
            });
        }, [], sc);
        sc.time.delayedCall(11000, function () {
            container.bringToTop(_this.uccScreenImage2);
        }, [], sc);
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("FailureChilledWaterPumpStep12B");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("FailureChilledWaterPumpStep12");
            }, [], sc);
        });
    };
    return FailureChilledWaterPumpStep12;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep12B = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep12B, _super);
    function FailureChilledWaterPumpStep12B() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep12B" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep12B.prototype.preload = function () {
        this.load.image("chilledWaterSummerStart", "../public/images/ChilledWaterSummerStart.png");
        this.load.image("chilledWaterUnitReset", "../public/images/ChilledWaterUnitReset.png");
        this.load.image("chilledWaterChillerPriority", "../public/images/ChilledWaterChillerPriority.png");
        this.load.image("chilledWaterSummerFinished", "../public/images/ChilledWaterSummerFinished.png");
    };
    FailureChilledWaterPumpStep12B.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep12B.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep12B";
        var cam = this.cameras.main;
        var sc = this;
        var currentHotspot;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // create and add initial image to container
        var uccFrameStart = this.add.image(0, 0, "chilledWaterSummerStart");
        uccFrameStart.setOrigin(0, 0);
        uccFrameStart.setDisplaySize(width, height);
        container.add(uccFrameStart);
        container.setDepth(1);
        // create unit reset image but DO NOT add to container just yet
        var uccUnitreset = this.add.image(0, 0, "chilledWaterUnitReset");
        uccUnitreset.setOrigin(0, 0);
        uccUnitreset.setDisplaySize(width, height);
        // create chiller priority image but DO NOT add to container just yet
        var uccChillerPriority = this.add.image(0, 0, "chilledWaterChillerPriority");
        uccChillerPriority.setOrigin(0, 0);
        uccChillerPriority.setDisplaySize(width, height);
        // create chiller priority image but DO NOT add to container just yet
        var uccFrameFinish = this.add.image(0, 0, "chilledWaterSummerFinished");
        uccFrameFinish.setOrigin(0, 0);
        uccFrameFinish.setDisplaySize(width, height);
        // next create our 4 hotspots
        //------------------------------------
        var chillerReset = sc.add.graphics({});
        chillerReset.lineStyle(4, 0xfaff77, 1.0);
        chillerReset.fillStyle(0xffffff, 1);
        chillerReset.setDepth(100);
        chillerReset.setAlpha(1);
        var chillerResetPopupButton = sc.add.graphics({});
        //chillerResetPopupButton.lineStyle(4, 0xfaff77, 1.0);
        //chillerResetPopupButton.fillStyle(0xffffff,1);
        chillerResetPopupButton.setDepth(100);
        chillerResetPopupButton.setAlpha(0);
        var chillerPriority = sc.add.graphics({});
        chillerPriority.lineStyle(4, 0xfaff77, 1.0);
        chillerPriority.fillStyle(0xffffff, 1);
        chillerPriority.setDepth(100);
        chillerPriority.setAlpha(1);
        var chillerPriorityPopupButton = sc.add.graphics({});
        //chillerPriorityPopupButton.lineStyle(4, 0xfaff77, 1.0);
        //chillerPriorityPopupButton.fillStyle(0xffffff,1);
        chillerPriorityPopupButton.setDepth(100);
        chillerPriorityPopupButton.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        var rect3 = new Phaser.Geom.Rectangle();
        var rect4 = new Phaser.Geom.Rectangle();
        rect1.setSize(47, 27);
        rect1.setPosition(566, 267);
        rect2.setSize(47, 27);
        rect2.setPosition(168, 78);
        rect3.setSize(47, 27);
        rect3.setPosition(566, 232);
        rect4.setSize(47, 27);
        rect4.setPosition(167, 116);
        chillerReset.strokeRectShape(rect1);
        chillerPriority.strokeRectShape(rect2);
        chillerResetPopupButton.strokeRectShape(rect3);
        chillerPriorityPopupButton.strokeRectShape(rect4);
        //----------------------------------------------------
        // show initially the two rectangles for the unit reset and chiller priority hotspots
        container.add(chillerReset);
        container.add(chillerPriority);
        container.removeInteractive();
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFrameStart,
            alpha: 1,
            ease: 'Power1',
            duration: 6000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_03_Step12_CQ');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                At this time reset the chiller alarms and set the correct chiller priority.\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            Sim.incorrectCount = 0;
            // stop audio 1
            AudioNarration.stop();
            //AudioNarration.destroy();
            // hide the yellow borders and remove the priority hotspot altogether
            // clear the yellow border
            chillerReset.clear();
            // be sure the leftPump is available to click on
            chillerReset.setAlpha(1);
            // remove the rightPump; no longer will need this
            chillerPriority.setAlpha(0);
            container.remove(chillerPriority);
            // set the chillerReset as the current hotspot
            currentHotspot = "chillerReset";
            chillerReset.setInteractive(rect1, Phaser.Geom.Rectangle.Contains);
            // correct response area for 'chillerReset'
            chillerReset.on('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                currentHotspot = "chillerResetPopupButton";
                container.remove(chillerReset); // remove my hotspot over unit reset
                container.add(uccUnitreset); // show the screen image that shows popup box   
                container.add(chillerResetPopupButton); // bring the next hotspot into the scene
                chillerResetPopupButton.clear(); // hide the yellow border
                chillerResetPopupButton.setAlpha(1); // be sure hotspot is visible
                // play correct response
                sc.correctFeedback12(function () {
                    // now set up for second hotspot, chillerResetPopupButton
                    chillerResetPopupButton.setInteractive(rect3, Phaser.Geom.Rectangle.Contains);
                    Sim.incorrectCount = 0;
                    chillerResetPopupButton.on('pointerup', function (gameObject) {
                        Sim.showFeedBack(true, gameObject);
                        currentHotspot = "chillerPriority";
                        container.remove(chillerResetPopupButton); // remove the hotspot
                        container.remove(uccUnitreset); // remove the graphic showing the popup
                        container.add(chillerPriority); // bring the next hotspot into the scene
                        chillerPriority.clear(); // hide the yellow border
                        chillerPriority.setAlpha(1); // be sure hotspot is visible
                        // play correct response
                        sc.correctFeedback12(function () {
                            // now set up for third hotspot, chillerPriority
                            chillerPriority.setInteractive(rect2, Phaser.Geom.Rectangle.Contains);
                            Sim.incorrectCount = 0;
                            chillerPriority.on('pointerup', function (gameObject) {
                                Sim.showFeedBack(true, gameObject);
                                currentHotspot = "chillerPriorityPopupButton";
                                container.remove(chillerPriority); // remove the hotspot
                                container.add(uccChillerPriority); // show the graphic showing the popup
                                container.add(chillerPriorityPopupButton); // bring the next hotspot into the scene
                                chillerPriorityPopupButton.clear(); // hide the yellow border
                                chillerPriorityPopupButton.setAlpha(1); // be sure hotspot is visible
                                sc.correctFeedback12(function () {
                                    // now set up for fourth and final hotspot, chillerPriorityPopupButton
                                    chillerPriorityPopupButton.setInteractive(rect4, Phaser.Geom.Rectangle.Contains);
                                    Sim.incorrectCount = 0;
                                    chillerPriorityPopupButton.on('pointerup', function (gameObject) {
                                        Sim.showFeedBack(true, gameObject);
                                        container.remove(chillerPriorityPopupButton);
                                        container.add(uccFrameFinish);
                                        container.remove(uccChillerPriority);
                                        sc.correctFeedback12(function () {
                                            Sim.removeResources();
                                            Sim.output.innerHTML = "";
                                            AudioNarration.destroy();
                                            Sim.game.scene.start("FailureChilledWaterPumpStep13");
                                            sc.time.delayedCall(2000, function () {
                                                sc.scene.stop("FailureChilledWaterPumpStep12B");
                                            }, [], sc);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
            // incorrect response area for any incorrect response
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                sc.incorrectFeedback12();
                switch (currentHotspot) {
                    case "chillerReset":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            chillerReset.lineStyle(4, 0xfaff77, 1.0);
                            chillerReset.strokeRectShape(rect1);
                            sc.add.tween({
                                targets: [chillerReset],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                    case "chillerResetPopupButton":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            chillerResetPopupButton.lineStyle(4, 0xfaff77, 1.0);
                            chillerResetPopupButton.strokeRectShape(rect3);
                            sc.add.tween({
                                targets: [chillerResetPopupButton],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                    case "chillerPriority":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            chillerPriority.lineStyle(4, 0xfaff77, 1.0);
                            chillerPriority.strokeRectShape(rect2);
                            sc.add.tween({
                                targets: [chillerPriority],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                    case "chillerPriorityPopupButton":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            chillerPriorityPopupButton.lineStyle(4, 0xfaff77, 1.0);
                            chillerPriorityPopupButton.strokeRectShape(rect4);
                            sc.add.tween({
                                targets: [chillerPriorityPopupButton],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                }
            });
        });
    };
    FailureChilledWaterPumpStep12B.prototype.correctFeedback12 = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            callback();
        }, [], this);
    };
    FailureChilledWaterPumpStep12B.prototype.incorrectFeedback12 = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
    };
    return FailureChilledWaterPumpStep12B;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var FailureChilledWaterPumpStep13 = /** @class */ (function (_super) {
    __extends(FailureChilledWaterPumpStep13, _super);
    function FailureChilledWaterPumpStep13() {
        var _this = _super.call(this, { key: "FailureChilledWaterPumpStep13" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    FailureChilledWaterPumpStep13.prototype.preload = function () {
        this.load.image("scenario3_final", "../public/images/ChilledWaterSummerFinished.png");
    };
    FailureChilledWaterPumpStep13.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    FailureChilledWaterPumpStep13.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "FailureChilledWaterPumpStep13";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "scenario3_final");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 11000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_03-15');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "You verify that both pumps are operational and that the alarm has cleared. The system is now in full redundancy awaiting a failure.";
        timeline.setCallback("onComplete", function () {
            // **** show Lesson Complete ****
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.currentScene = "";
            AudioNarration.stop();
            AudioNarration.destroy();
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("FailureChilledWaterPumpStep13");
                Sim.setComplete();
            }, [], sc);
        });
    };
    return FailureChilledWaterPumpStep13;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpIntro = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpIntro, _super);
    function SingleFailureHotWaterPumpIntro() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpIntro" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpIntro.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/UCC_Console_Zoom_Single_Failure_HW_Pump_end.png");
    };
    SingleFailureHotWaterPumpIntro.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpIntro.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpIntro";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('UCC_Console_Zoom_Single_Failure_HW_Pump');
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 0;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 8000
            });
            timeline.play();
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("SingleFailureHotWaterPumpStep1");
                sc.time.delayedCall(2000, function () {
                    sc.scene.stop("SingleFailureHotWaterPumpIntro");
                }, [], sc);
            });
        };
        AudioNarration.initialize('Scenario_04-01');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        VideoAnimation.play();
        Sim.output.innerHTML = "\n                <p>\n                During this lesson, you will be able to analyze a single loss of a Hot Water Pump, follow the corrective maintenance sequence, and restore the system to full utility power.\n                </p>\n            ";
    };
    return SingleFailureHotWaterPumpIntro;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep1 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep1, _super);
    function SingleFailureHotWaterPumpStep1() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep1" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep1.prototype.preload = function () {
        this.load.image("hotWaterSystem", "../public/images/UCC_Console_Zoom_Single_Failure_HW_Pump_end.png");
    };
    SingleFailureHotWaterPumpStep1.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep1.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep1";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "hotWaterSystem");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 9500
        });
        timeline.play();
        AudioNarration.initialize('Scenario_04-02');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                While chilled water is essential to support the combat system, hot water is critical to maintaining nominal temperatures in the occupied zones.\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleFailureHotWaterPumpStep2");
            sc.time.delayedCall(3000, function () {
                sc.scene.stop("SingleFailureHotWaterPumpStep1");
            }, [], sc);
        });
    };
    return SingleFailureHotWaterPumpStep1;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep2 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep2, _super);
    function SingleFailureHotWaterPumpStep2() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep2" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep2.prototype.preload = function () {
        this.load.image("hotWaterSystem2", "../public/images/UCC_Console_Zoom_Single_Failure_HW_Pump_end.png");
        this.load.image("AHU_Normal", "../public/images/UCC_Monitor_Pan-Center_to_Left_Single_Failure_HW_Pump_end3.png");
    };
    SingleFailureHotWaterPumpStep2.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep2.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep2";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        VideoAnimation.initialize('UCC_Monitor_Pan-Center_to_Left_Single_Failure_HW_Pump');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 0.6;
        VideoAnimation.currentTime = 0;
        // start image
        var uccStartFrame = this.add.image(0, 0, "hotWaterSystem2");
        uccStartFrame.setOrigin(0, 0);
        uccStartFrame.setDisplaySize(width, height);
        uccStartFrame.setAlpha(1);
        // last image
        var uccFinalFrame = this.add.image(0, 0, "AHU_Normal");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        uccFinalFrame.setAlpha(0);
        container.add(uccStartFrame);
        AudioNarration.initialize('Scenario_04-03');
        AudioNarration.currentTime = 0;
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: uccFinalFrame,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 9000
            });
            timeline.play();
            AudioNarration.play();
            Sim.output.innerHTML = "\n                <p>\n                The Hot Water System is integrated into the Chilled Water System and is used to heat and dehumidify outside air coming into the building.\n                </p>\n            ";
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("SingleFailureHotWaterPumpStep3");
                sc.time.delayedCall(2000, function () {
                    sc.scene.stop("SingleFailureHotWaterPumpStep2");
                }, [], sc);
            });
        };
    };
    return SingleFailureHotWaterPumpStep2;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep3 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep3, _super);
    function SingleFailureHotWaterPumpStep3() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep3" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep3.prototype.preload = function () {
        this.load.image("hotWaterSystem2", "../public/images/UCC_Console_Zoom_Single_Failure_HW_Pump_end.png");
        this.load.image("AHU_Normal", "../public/images/UCC_Monitor_Pan-Center_to_Left_Single_Failure_HW_Pump_end3.png");
    };
    SingleFailureHotWaterPumpStep3.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep3.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep3";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        VideoAnimation.initialize('UCC_Monitor_Pan-Left_to_Center_Single_Failure_HW_Pump');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 0.6;
        VideoAnimation.currentTime = 0;
        // start image
        var uccStartFrame = this.add.image(0, 0, "AHU_Normal");
        uccStartFrame.setOrigin(0, 0);
        uccStartFrame.setDisplaySize(width, height);
        uccStartFrame.setAlpha(1);
        // last image
        var uccFinalFrame = this.add.image(0, 0, "hotWaterSystem2");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        uccFinalFrame.setAlpha(0);
        container.add(uccStartFrame);
        AudioNarration.initialize('Scenario_04-04');
        AudioNarration.currentTime = 0;
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: uccFinalFrame,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 9000
            });
            timeline.play();
            AudioNarration.play();
            Sim.output.innerHTML = "\n                <p>\n                Water travels from the chiller through the heat exchanger where it is heated and then pumped through to the Make Up Air Units, or MAUs.\n                </p>\n            ";
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("KnowledgeQuestionSFHWP_Step3");
                sc.scene.stop("SingleFailureHotWaterPumpStep3");
            });
        };
    };
    return SingleFailureHotWaterPumpStep3;
}(Phaser.Scene));
/// <reference path="../../../KnowledgeQuestionMultiple.ts" />
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var KnowledgeQuestionSFHWP_Step3 = /** @class */ (function (_super) {
    __extends(KnowledgeQuestionSFHWP_Step3, _super);
    function KnowledgeQuestionSFHWP_Step3() {
        var _this = _super.call(this, { key: "KnowledgeQuestionSFHWP_Step3" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'Why is it important to have heated water, as well as chilled water?';
        _this.answers = [
            'To heat living spaces',
            'To remove humidity from the air',
            'To keep the SPY system warm',
            'To prevent SABC attacks'
        ];
        _this._correctAnswers = [true, true, false, false];
        return _this;
    }
    KnowledgeQuestionSFHWP_Step3.prototype.preload = function () {
        this.load.image("hotWaterSystem3", "../public/images/UCC_Console_Zoom_Single_Failure_HW_Pump_end.png");
    };
    KnowledgeQuestionSFHWP_Step3.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    KnowledgeQuestionSFHWP_Step3.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "Why is it important to have heated water, as well as chilled water?";
        Sim.currentScene = "KnowledgeQuestionSFHWP_Step3";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var KQ_start = this.add.image(0, 0, "hotWaterSystem3");
        KQ_start.setOrigin(0, 0);
        KQ_start.setDisplaySize(width, height);
        container.add(KQ_start);
        AudioNarration.initialize('Scenario_04_Step3_CQ');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 6) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestionMultiple();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswers[0] = this._correctAnswers[0];
        question.correctAnswers[1] = this._correctAnswers[1];
        question.correctAnswers[2] = this._correctAnswers[2];
        question.correctAnswers[3] = this._correctAnswers[3];
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
        sc.scene.stop("SingleFailureHotWaterPumpStep3");
    };
    KnowledgeQuestionSFHWP_Step3.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    KnowledgeQuestionSFHWP_Step3.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
        }, [], this);
    };
    return KnowledgeQuestionSFHWP_Step3;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep4 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep4, _super);
    function SingleFailureHotWaterPumpStep4() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep4" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep4.prototype.preload = function () {
        this.load.image("uccFinalFrame", "../public/images/UCC_Console_Zoom_Single_Failure_HW_Pump_end.png");
    };
    SingleFailureHotWaterPumpStep4.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep4.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep4";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('AA_Facilities_Gas');
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 0;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "uccFinalFrame");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 2000
            });
            timeline.play();
            timeline.setCallback("onComplete", function () {
                AudioNarration.stop();
                AudioNarration.destroy();
                timeline.stop();
                Sim.removeResources();
                Sim.output.innerHTML = "";
                Sim.game.scene.start("KnowledgeQuestionSFHWP_Step4");
                sc.scene.stop("SingleFailureHotWaterPumpStep4");
            });
        };
        AudioNarration.initialize('Scenario_04-05');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        VideoAnimation.play();
        Sim.output.innerHTML = "\n                <p>\n                The MAUs provide nuclear, biological, and chemically protected air and ventilation to the Deck House Support Building and the Rear Deck House.\n                </p>\n            ";
    };
    return SingleFailureHotWaterPumpStep4;
}(Phaser.Scene));
/// <reference path="../../../KnowledgeQuestionMultiple.ts" />
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var KnowledgeQuestionSFHWP_Step4 = /** @class */ (function (_super) {
    __extends(KnowledgeQuestionSFHWP_Step4, _super);
    function KnowledgeQuestionSFHWP_Step4() {
        var _this = _super.call(this, { key: "KnowledgeQuestionSFHWP_Step4" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'What are some of the threats that the Make Up Air Units protect sailors from?';
        _this.answers = [
            'Nuclear',
            'Radioactive',
            'Biological',
            'Chemical'
        ];
        _this._correctAnswers = [true, true, true, true];
        return _this;
    }
    KnowledgeQuestionSFHWP_Step4.prototype.preload = function () {
        this.load.image("hotWaterSystem4", "../public/images/UCC_Console_Zoom_Single_Failure_HW_Pump_end.png");
    };
    KnowledgeQuestionSFHWP_Step4.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    KnowledgeQuestionSFHWP_Step4.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "What are some of the threats that the Make Up Air Units protect sailors from?";
        Sim.currentScene = "KnowledgeQuestionSFHWP_Step4";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var KQ_start = this.add.image(0, 0, "hotWaterSystem4");
        KQ_start.setOrigin(0, 0);
        KQ_start.setDisplaySize(width, height);
        container.add(KQ_start);
        AudioNarration.initialize('Scenario_04_Step4_CQ');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 6) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestionMultiple();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswers[0] = this._correctAnswers[0];
        question.correctAnswers[1] = this._correctAnswers[1];
        question.correctAnswers[2] = this._correctAnswers[2];
        question.correctAnswers[3] = this._correctAnswers[3];
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
        sc.scene.stop("SingleFailureHotWaterPumpStep4");
    };
    KnowledgeQuestionSFHWP_Step4.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    KnowledgeQuestionSFHWP_Step4.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
        }, [], this);
    };
    return KnowledgeQuestionSFHWP_Step4;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep5 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep5, _super);
    function SingleFailureHotWaterPumpStep5() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep5" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep5.prototype.preload = function () {
        this.load.image("hotWaterSystem5", "../public/images/UCC_Console_Zoom_Single_Failure_HW_Pump_end.png");
        this.load.image("MAU_Normal", "../public/images/UCC_Monitor_Pan-Center_to_Right_Single_Failure_HW_Pump_end2.png");
    };
    SingleFailureHotWaterPumpStep5.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep5.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep5";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        VideoAnimation.initialize('UCC_Monitor_Pan-Center_to_Right_Single_Failure_HW_Pump');
        VideoAnimation.fadeOut = false;
        VideoAnimation.playbackRate = 0.6;
        VideoAnimation.currentTime = 0;
        // start image
        this.uccStartFrame = this.add.image(0, 0, "hotWaterSystem5");
        this.uccStartFrame.setOrigin(0, 0);
        this.uccStartFrame.setDisplaySize(width, height);
        this.uccStartFrame.setAlpha(1);
        // last image
        this.uccFinalFrame = this.add.image(0, 0, "MAU_Normal");
        this.uccFinalFrame.setOrigin(0, 0);
        this.uccFinalFrame.setDisplaySize(width, height);
        this.uccFinalFrame.setAlpha(1);
        container.add(this.uccFinalFrame);
        container.add(this.uccStartFrame);
        // create rectangle over right top area
        var rightTop = sc.add.graphics({});
        rightTop.lineStyle(4, 0xfaff77, 1.0);
        rightTop.setDepth(100);
        rightTop.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(462, 53);
        rect1.setPosition(587, 247);
        rightTop.strokeRectShape(rect1);
        container.add(rightTop);
        // create rectangle over right bottom area
        var rightBottom = sc.add.graphics({});
        rightBottom.lineStyle(4, 0xfaff77, 1.0);
        rightBottom.setDepth(100);
        rightBottom.setAlpha(0);
        var rect2 = new Phaser.Geom.Rectangle();
        rect2.setSize(457, 52);
        rect2.setPosition(587, 389);
        rightBottom.strokeRectShape(rect2);
        container.add(rightBottom);
        AudioNarration.initialize('Scenario_04-06');
        AudioNarration.currentTime = 0;
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        var timeline = this.tweens.createTimeline({
            ease: 'Linear',
            duration: 0
        });
        timeline.add({
            targets: [this.uccFinalFrame],
            alpha: 1,
            ease: 'Linear',
            duration: 24500
        });
        timeline.play();
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        sc.time.delayedCall(1000, function () {
            container.bringToTop(_this.uccFinalFrame);
            container.bringToTop(rightBottom);
            container.bringToTop(rightTop);
            rightTop.setAlpha(1);
            rightBottom.setAlpha(1);
        }, [], sc);
        VideoAnimation.ended = function () {
            AudioNarration.play();
            Sim.output.innerHTML = "\n                <p>\n                The MAUs will either cool or heat the Occupied Zone depending on the ambient air temperature. The BAS, will cool the Occupied Zone to seventy-five degrees Fahrenheit and will heat the Occupied Zone to sixty-eight degrees Fahrenheit.\n                </p>\n            ";
        };
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleFailureHotWaterPumpStep6");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("SingleFailureHotWaterPumpStep5");
            }, [], sc);
        });
    };
    return SingleFailureHotWaterPumpStep5;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep6 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep6, _super);
    function SingleFailureHotWaterPumpStep6() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep6" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep6.prototype.preload = function () {
        this.load.image("MAU_Normal2", "../public/images/UCC_Monitor_Pan-Center_to_Right_Single_Failure_HW_Pump_end2.png");
    };
    SingleFailureHotWaterPumpStep6.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep6.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep6";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var uccFinalFrame = this.add.image(0, 0, "MAU_Normal2");
        uccFinalFrame.setOrigin(0, 0);
        uccFinalFrame.setDisplaySize(width, height);
        container.add(uccFinalFrame);
        // create rectangle over left HUM
        var leftImage = sc.add.graphics({});
        leftImage.lineStyle(4, 0xfaff77, 1.0);
        leftImage.setDepth(100);
        leftImage.setAlpha(1);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(47, 31);
        rect1.setPosition(4, 75);
        leftImage.strokeRectShape(rect1);
        container.add(leftImage);
        // create rectangle over right HUM
        var rightImage = sc.add.graphics({});
        rightImage.lineStyle(4, 0xfaff77, 1.0);
        rightImage.setDepth(100);
        rightImage.setAlpha(1);
        var rect2 = new Phaser.Geom.Rectangle();
        rect2.setSize(47, 34);
        rect2.setPosition(466, 64);
        rightImage.strokeRectShape(rect2);
        container.add(rightImage);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 15000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_04-07');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                The MAUs also regulate relative humidity to the optimal value of fifty percent. The two fresh air MAUs are provided with Moisture Transmitters, which sense the humidity of the outdoor air and supplied air. \n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleFailureHotWaterPumpStep7");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("SingleFailureHotWaterPumpStep6");
            }, [], sc);
        });
    };
    return SingleFailureHotWaterPumpStep6;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep7 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep7, _super);
    function SingleFailureHotWaterPumpStep7() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep7" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep7.prototype.preload = function () {
        this.load.image("MAU_RightScreen", "../public/images/UCC_Monitor_Pan-Center_to_Right_Single_Failure_HW_Pump_end2.png");
        this.load.image("HW_Center", "../public/images/HW_EndFrame.png");
        this.load.image("HW_Center_darkTRBL", "../public/images/HW_EndFrame_darkTRBL.png");
    };
    SingleFailureHotWaterPumpStep7.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep7.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep7";
        var cam = this.cameras.main;
        var sc = this;
        var played = false;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        VideoAnimation.initialize('UCC_Monitor_Pan-Right_to_Center_Single_Failure_HW_Pump');
        VideoAnimation.fadeOut = true;
        VideoAnimation.playbackRate = 0.6;
        VideoAnimation.currentTime = 0;
        // start image
        var uccStartFrame = this.add.image(0, 0, "MAU_RightScreen");
        uccStartFrame.setOrigin(0, 0);
        uccStartFrame.setDisplaySize(width, height);
        uccStartFrame.setAlpha(1);
        // last image
        this.uccFinalFrame = this.add.image(0, 0, "HW_Center");
        this.uccFinalFrame.setOrigin(0, 0);
        this.uccFinalFrame.setDisplaySize(width, height);
        this.uccFinalFrame.setAlpha(0);
        // flashing to black TRBL
        this.uccTRBL_black = this.add.image(0, 0, "HW_Center_darkTRBL");
        this.uccTRBL_black.setOrigin(0, 0);
        this.uccTRBL_black.setDisplaySize(width, height);
        this.uccTRBL_black.setAlpha(0);
        // hot spot for faulty heat pump
        this.faultyPump = sc.add.graphics({});
        //faultyPump.lineStyle(4, 0xfaff77, 1.0);
        //faultyPump.fillStyle(0xffffff,1);
        this.faultyPump.setDepth(100);
        this.faultyPump.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(40, 37);
        rect1.setPosition(725, 414);
        this.faultyPump.strokeRectShape(rect1);
        this.container.add(uccStartFrame);
        this.container.removeInteractive();
        this.currentImage = "TRBL_yellow";
        AudioNarration.initialize('Scenario_04-08');
        AudioNarration.currentTime = 0;
        Sim.output.innerHTML = "\n                <p>\n                </p>\n            ";
        sc.time.delayedCall(3000, function () {
            sc.add.tween({
                targets: _this.uccFinalFrame,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
        }, [], sc);
        sc.time.delayedCall(1000, function () {
            VideoAnimation.play();
        }, [], sc);
        VideoAnimation.ended = function () {
            var timeline = _this.tweens.createTimeline({
                ease: 'Sine.easeInOut',
                duration: 0
            });
            timeline.add({
                targets: _this.uccFinalFrame,
                alpha: 1,
                ease: 'Power1',
                duration: 14000
            });
            _this.container.add(_this.uccTRBL_black);
            _this.container.add(_this.uccFinalFrame);
            _this.uccTRBL_black.setAlpha(1);
            if (played == false) {
                played = true;
                AudioNarration.play();
                timeline.play();
                Sim.output.innerHTML = "\n                <p>\n                As you are standing watch at the UCC, you notice an alarm on the Hot Water System screen. The heat exchanger primary pump is flashing yellow and black, and an alert informs you that it is a run failure. \n                </p>\n            ";
            }
            _this.time.addEvent({ delay: 500, callback: _this.onEvent, callbackScope: _this, loop: true });
            timeline.setCallback("onComplete", function () {
                Sim.incorrectCount = 0;
                sc.container.add(sc.faultyPump);
                sc.faultyPump.clear();
                sc.faultyPump.setAlpha(1);
                sc.faultyPump.setInteractive(rect1, Phaser.Geom.Rectangle.Contains);
                // correct response area
                sc.faultyPump.on('pointerup', function (gameObject) {
                    Sim.showFeedBack(true, gameObject);
                    sc.faultyPump.setAlpha(0);
                    sc.faultyPump.removeInteractive();
                    // play correct response
                    sc.correctFeedback_s4s7(function () {
                        Sim.removeResources();
                        Sim.output.innerHTML = "";
                        AudioNarration.destroy();
                        Sim.game.scene.start("SingleFailureHotWaterPumpStep8");
                        sc.scene.stop("SingleFailureHotWaterPumpStep7");
                    });
                });
                // incorrect response area
                sc.container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
                sc.container.on('pointerup', function (gameObject) {
                    Sim.showFeedBack(false, gameObject);
                    Sim.incorrectCount++;
                    sc.incorrectFeedback_s4s7();
                    if (Sim.incorrectCount > Sim.promptIncorrect) {
                        sc.faultyPump.lineStyle(4, 0xfaff77, 1.0);
                        sc.faultyPump.strokeRectShape(rect1);
                        sc.add.tween({
                            targets: [sc.faultyPump],
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            delay: 0,
                            alpha: {
                                getStart: function () { return 1; },
                                getEnd: function () { return 1; }
                            }
                        });
                    }
                });
                sc.time.delayedCall(1500, function () {
                    // set the prompt
                    Sim.output.innerHTML = "Select the faulty heat exchanger pump on the Hot Water System Screen.";
                    // play second audio
                    AudioNarration.stop();
                    timeline.stop();
                    AudioNarration.destroy();
                    AudioNarration.initialize('Scenario_04_Step7_CQ');
                    AudioNarration.currentTime = 0;
                    AudioNarration.play();
                }, [], sc);
            });
        };
    };
    SingleFailureHotWaterPumpStep7.prototype.onEvent = function () {
        if (this.currentImage == "TRBL_yellow") {
            this.container.bringToTop(this.uccTRBL_black);
            this.currentImage = "TRBL_black";
        }
        else {
            this.container.bringToTop(this.uccFinalFrame);
            this.currentImage = "TRBL_yellow";
        }
        this.container.bringToTop(this.faultyPump);
    };
    SingleFailureHotWaterPumpStep7.prototype.correctFeedback_s4s7 = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            callback();
        }, [], this);
    };
    SingleFailureHotWaterPumpStep7.prototype.incorrectFeedback_s4s7 = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
    };
    return SingleFailureHotWaterPumpStep7;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep8 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep8, _super);
    function SingleFailureHotWaterPumpStep8() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep8" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep8.prototype.preload = function () {
        this.load.image("HW_Center", "../public/images/HW_EndFrame.png");
        this.load.image("HW_Center_darkTRBL", "../public/images/HW_EndFrame_darkTRBL.png");
    };
    SingleFailureHotWaterPumpStep8.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep8.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep8";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccFinalFrame = this.add.image(0, 0, "HW_Center");
        this.uccFinalFrame.setOrigin(0, 0);
        this.uccFinalFrame.setDisplaySize(width, height);
        this.uccFinalFrame.setAlpha(1);
        // flashing to black TRBL
        this.uccTRBL_black = this.add.image(0, 0, "HW_Center_darkTRBL");
        this.uccTRBL_black.setOrigin(0, 0);
        this.uccTRBL_black.setDisplaySize(width, height);
        this.uccTRBL_black.setAlpha(1);
        this.container.add(this.uccTRBL_black);
        this.container.add(this.uccFinalFrame);
        var timeline = this.tweens.createTimeline({
            ease: 'Linear',
            duration: 0
        });
        timeline.add({
            targets: this.uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 13000
        });
        timeline.play();
        this.currentImage = "TRBL_yellow";
        AudioNarration.initialize('Scenario_04-09');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        cam.zoomTo(1.3, 3000, 'Sine.easeInOut');
        cam.pan(width * 0.50, 40, 3000, 'Sine.easeInOut');
        this.time.addEvent({ delay: 500, callback: this.onEvent, callbackScope: this, loop: true });
        Sim.output.innerHTML = "\n                <p>\n                In the event of a heat exchanger primary pump failing, the pump will fail over to the boiler automatically. You verify that the pump has failed over to the boiler and the boiler is running correctly.\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("KnowledgeQuestionSFHWP_Step8");
            sc.scene.stop("SingleFailureHotWaterPumpStep8");
        });
    };
    SingleFailureHotWaterPumpStep8.prototype.onEvent = function () {
        if (this.currentImage == "TRBL_yellow") {
            this.container.bringToTop(this.uccTRBL_black);
            this.currentImage = "TRBL_black";
        }
        else {
            this.container.bringToTop(this.uccFinalFrame);
            this.currentImage = "TRBL_yellow";
        }
    };
    return SingleFailureHotWaterPumpStep8;
}(Phaser.Scene));
/// <reference path="../../../KnowledgeQuestion.ts" />
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var KnowledgeQuestionSFHWP_Step8 = /** @class */ (function (_super) {
    __extends(KnowledgeQuestionSFHWP_Step8, _super);
    function KnowledgeQuestionSFHWP_Step8() {
        var _this = _super.call(this, { key: "KnowledgeQuestionSFHWP_Step8" }) || this;
        _this.$ = window["jQuery"];
        _this.question = 'Has the heat exchanger primary pump failed over to the boiler?';
        _this.answers = [
            'Yes',
            'No'
        ];
        _this.correct = 0;
        return _this;
    }
    KnowledgeQuestionSFHWP_Step8.prototype.preload = function () {
        this.load.image("HW_Center2", "../public/images/HW_EndFrame.png");
    };
    KnowledgeQuestionSFHWP_Step8.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    KnowledgeQuestionSFHWP_Step8.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "Has the heat exchanger primary pump failed over to the boiler?";
        Sim.currentScene = "KnowledgeQuestionSFHWP_Step8";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        var KQ_BG = this.add.image(0, 0, "HW_Center2");
        KQ_BG.setOrigin(0, 0);
        KQ_BG.setDisplaySize(width, height);
        container.add(KQ_BG);
        cam.zoomTo(1.3, 1, 'Linear');
        cam.pan(width * 0.50, 40, 1, 'Linear');
        AudioNarration.initialize('Scenario_04_Step8_CQ');
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 6) {
                AudioNarration.pause();
            }
        };
        var question = new KnowledgeQuestion();
        question.question = this.question;
        question.answers = this.answers;
        question.correctAnswer = this.correct;
        if (!Sim.hasCompleted(Sim.currentScene)) {
            AudioNarration.currentTime = 0;
            AudioNarration.play();
        }
        question.show();
    };
    KnowledgeQuestionSFHWP_Step8.prototype.correctFeedback = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
            callback();
        }, [], this);
    };
    KnowledgeQuestionSFHWP_Step8.prototype.incorrectFeedback = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(2000, function () {
            audio.pause();
        }, [], this);
    };
    return KnowledgeQuestionSFHWP_Step8;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep9 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep9, _super);
    function SingleFailureHotWaterPumpStep9() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep9" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep9.prototype.preload = function () {
        this.load.image("HW_Center", "../public/images/HW_EndFrame.png");
        this.load.image("HW_Center_darkTRBL", "../public/images/HW_EndFrame_darkTRBL.png");
    };
    SingleFailureHotWaterPumpStep9.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep9.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep9";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccFinalFrame = this.add.image(0, 0, "HW_Center");
        this.uccFinalFrame.setOrigin(0, 0);
        this.uccFinalFrame.setDisplaySize(width, height);
        this.uccFinalFrame.setAlpha(1);
        // flashing to black TRBL
        this.uccTRBL_black = this.add.image(0, 0, "HW_Center_darkTRBL");
        this.uccTRBL_black.setOrigin(0, 0);
        this.uccTRBL_black.setDisplaySize(width, height);
        this.uccTRBL_black.setAlpha(1);
        this.container.add(this.uccTRBL_black);
        this.container.add(this.uccFinalFrame);
        cam.zoomTo(1.3, 1, 'Linear');
        cam.pan(width * 0.50, 40, 1, 'Linear');
        var timeline = this.tweens.createTimeline({
            ease: 'Linear',
            duration: 0
        });
        timeline.add({
            targets: this.uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 18000
        });
        timeline.play();
        this.currentImage = "TRBL_yellow";
        AudioNarration.initialize('Scenario_04-10');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        sc.time.delayedCall(1500, function () {
            cam.zoomTo(1.0, 3000, 'Sine.easeInOut');
        }, [], sc);
        this.time.addEvent({ delay: 500, callback: this.onEvent, callbackScope: this, loop: true });
        Sim.output.innerHTML = "\n                <p>\n                While the maintainers have the ability to reconfigure manual valves or the entire Hot Water plant, it is not recommended to switch chillers based on a Hot Water System failure unless absolutely necessary.  Maintaining chilled water flow is the priority.\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleFailureHotWaterPumpStep10");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("SingleFailureHotWaterPumpStep9");
            }, [], sc);
        });
    };
    SingleFailureHotWaterPumpStep9.prototype.onEvent = function () {
        if (this.currentImage == "TRBL_yellow") {
            this.container.bringToTop(this.uccTRBL_black);
            this.currentImage = "TRBL_black";
        }
        else {
            this.container.bringToTop(this.uccFinalFrame);
            this.currentImage = "TRBL_yellow";
        }
    };
    return SingleFailureHotWaterPumpStep9;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep10 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep10, _super);
    function SingleFailureHotWaterPumpStep10() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep10" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep10.prototype.preload = function () {
        this.load.image("HW_Center", "../public/images/HW_EndFrame.png");
        this.load.image("HW_Center_darkTRBL", "../public/images/HW_EndFrame_darkTRBL.png");
        this.load.image("csoow", "../public/images/CSOOW.png");
        this.load.image("operator", "../public/images/Chief_Still.png");
    };
    SingleFailureHotWaterPumpStep10.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep10.prototype.start = function () {
        var _this = this;
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep10";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccFinalFrame = this.add.image(0, 0, "HW_Center");
        this.uccFinalFrame.setOrigin(0, 0);
        this.uccFinalFrame.setDisplaySize(width, height);
        this.uccFinalFrame.setAlpha(1);
        // flashing to black TRBL
        this.uccTRBL_black = this.add.image(0, 0, "HW_Center_darkTRBL");
        this.uccTRBL_black.setOrigin(0, 0);
        this.uccTRBL_black.setDisplaySize(width, height);
        this.uccTRBL_black.setAlpha(1);
        this.container.add(this.uccTRBL_black);
        this.container.add(this.uccFinalFrame);
        this.currentImage = "TRBL_yellow";
        // initial Audio to play
        AudioNarration.initialize('Scenario_04-11');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        this.time.addEvent({ delay: 500, callback: this.onEvent, callbackScope: this, loop: true });
        // initial CC text to show
        Sim.output.innerHTML = "You will now alert the Combat Systems Officer of the Watch, or CSOOW.";
        // Global scene timeline created
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: this.uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 16000
        });
        timeline.play();
        // at 6 seconds, fade in the CSOOW image
        sc.time.delayedCall(1500, function () {
            var csoow = _this.add.image(20, 20, "csoow");
            csoow.setOrigin(0, 0);
            csoow.alpha = 0;
            sc.add.tween({
                targets: [csoow],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            sc.add.tween({
                targets: [_this.container],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 1000,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return .5; }
                }
            });
            var operator = _this.add.image(842, 20, "operator");
            operator.setOrigin(0, 0);
            operator.alpha = 0;
            // fade in the operator
            sc.add.tween({
                targets: [operator],
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 4000,
                alpha: {
                    getStart: function () { return 0; },
                    getEnd: function () { return 1; }
                }
            });
            // now that operator is shown, show new CC text and play new audio
            sc.time.delayedCall(5000, function () {
                // change the cc text
                Sim.output.innerHTML = "\"Sir. The heat exchanger primary pump in the Hot Water System has failed. The Hot Water System is now running through the number one boiler.\u201D";
                // play second audio
                AudioNarration.stop();
                AudioNarration.destroy();
                AudioNarration.initialize('Scenario_04-11a');
                AudioNarration.currentTime = 0;
                AudioNarration.play();
            }, [], sc);
        }, [], sc);
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.game.scene.start("SingleFailureHotWaterPumpStep12");
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("SingleFailureHotWaterPumpStep10");
            }, [], sc);
        });
    };
    ;
    SingleFailureHotWaterPumpStep10.prototype.onEvent = function () {
        if (this.currentImage == "TRBL_yellow") {
            this.container.bringToTop(this.uccTRBL_black);
            this.currentImage = "TRBL_black";
        }
        else {
            this.container.bringToTop(this.uccFinalFrame);
            this.currentImage = "TRBL_yellow";
        }
    };
    return SingleFailureHotWaterPumpStep10;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep12 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep12, _super);
    function SingleFailureHotWaterPumpStep12() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep12" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep12.prototype.preload = function () {
        this.load.image("HW_Center", "../public/images/HW_EndFrame.png");
    };
    SingleFailureHotWaterPumpStep12.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep12.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = "You locate the Grundfos Motor Maintenance Manual and notify the maintainer on duty of the failure to the heat exchanger primary pump in the Hot Water System.";
        Sim.currentScene = "SingleFailureHotWaterPumpStep12";
        var cam = this.cameras.main;
        var sc = this;
        var highlight;
        var refButton = sc.$('#btnReference', parent.document);
        var refButton_offset = refButton.offset();
        var refButton_PosX = Math.floor(refButton_offset.left);
        var myOffset;
        var sideBarLeft = parseInt(getComputedStyle(parent.document.querySelector(".sidebar")).left);
        if (sideBarLeft < 0) { // LMS version
            myOffset = 0;
        }
        else {
            myOffset = refButton_PosX - 1136;
        }
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // optional end frames
        var uccScreenImage1 = this.add.image(0, 0, "HW_Center");
        uccScreenImage1.setOrigin(0, 0);
        uccScreenImage1.setDisplaySize(width, height);
        uccScreenImage1.setAlpha(1);
        container.add(uccScreenImage1);
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccScreenImage1,
            alpha: 1,
            ease: 'Linear',
            duration: 11000
        });
        AudioNarration.initialize('Scenario_04-12');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        timeline.play();
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            AudioNarration.destroy();
            timeline.stop();
            highlight = new Highlight();
            highlight.width = 104;
            highlight.height = 34;
            //highlight.x = 1136;
            highlight.x = refButton_PosX - myOffset;
            highlight.y = 10;
            highlight.blink = true;
            highlight.show();
            sc.time.delayedCall(500, function () {
                /***************************************************************** */
                /*   CODE FOR SELECTING THE MAINT DOC AND THEN THE CLOSE BUTTON
                /***************************************************************** */
                sc.$('.grundfos', parent.document).one("click", function () {
                    try {
                        highlight.hide();
                    }
                    catch (e) { }
                    sc.$('.btn-danger, .close', parent.document).one("click", function () {
                        sc.$('#btnForward', parent.document).click();
                    });
                });
            }, [], sc);
        });
    };
    return SingleFailureHotWaterPumpStep12;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep13 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep13, _super);
    function SingleFailureHotWaterPumpStep13() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep13" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep13.prototype.preload = function () {
        this.load.image("HW_Center", "../public/images/HW_EndFrame.png");
        this.load.image("HW_Center_darkTRBL", "../public/images/HW_EndFrame_darkTRBL.png");
        this.load.image("HW_SetLead", "../public/images/HW_Set_Lead.png");
    };
    SingleFailureHotWaterPumpStep13.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep13.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep13";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        cam.zoom = 1;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        // last image
        this.uccFinalFrame = this.add.image(0, 0, "HW_Center");
        this.uccFinalFrame.setOrigin(0, 0);
        this.uccFinalFrame.setDisplaySize(width, height);
        this.uccFinalFrame.setAlpha(1);
        // flashing to black TRBL
        this.uccTRBL_black = this.add.image(0, 0, "HW_Center_darkTRBL");
        this.uccTRBL_black.setOrigin(0, 0);
        this.uccTRBL_black.setDisplaySize(width, height);
        this.uccTRBL_black.setAlpha(1);
        this.uccSetLead = this.add.image(0, 0, "HW_SetLead");
        this.uccSetLead.setOrigin(0, 0);
        this.uccSetLead.setDisplaySize(width, height);
        this.uccSetLead.setAlpha(0);
        // hot spot for faulty heat pump
        this.unitReset = sc.add.graphics({});
        this.unitReset.setDepth(100);
        this.unitReset.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        rect1.setSize(51, 29);
        rect1.setPosition(250, 124);
        this.unitReset.strokeRectShape(rect1);
        // also add a second rectangle to later show the location of the set lead button
        this.setLead = sc.add.graphics({});
        this.setLead.setDepth(100);
        this.setLead.setAlpha(0);
        var rect2 = new Phaser.Geom.Rectangle();
        rect2.setSize(50, 29);
        rect2.setPosition(702, 132);
        this.setLead.strokeRectShape(rect2);
        this.container.removeInteractive();
        this.currentImage = "TRBL_yellow";
        AudioNarration.initialize('Scenario_04-13');
        AudioNarration.currentTime = 0;
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: [this.uccFinalFrame, this.uccTRBL_black],
            alpha: 1,
            ease: 'Linear',
            duration: 13000
        });
        this.container.add(this.uccTRBL_black);
        this.container.add(this.uccFinalFrame);
        timeline.play();
        AudioNarration.play();
        this.time.addEvent({ delay: 500, callback: this.onEvent, callbackScope: this, loop: true });
        Sim.output.innerHTML = "\n            <p>\n            The maintainer alerts you that the heat exchanger primary pump has been fixed. You reset the unit on the Hot Water System screen on the UCC and set the primary pump as the lead pump. \n            </p>\n        ";
        // at this time, show the rectangle/highlight over the unit reset button
        sc.time.delayedCall(4200, function () {
            sc.unitReset.lineStyle(4, 0xfaff77, 1.0);
            sc.unitReset.strokeRectShape(rect1);
            sc.unitReset.setAlpha(1);
        }, [], sc);
        // then at this time, hide the rectangle over the unit reset and show the rectangle over the set lead button
        sc.time.delayedCall(8400, function () {
            sc.unitReset.clear();
            sc.unitReset.setAlpha(0);
            sc.setLead.lineStyle(4, 0xfaff77, 1.0);
            sc.setLead.strokeRectShape(rect2);
            sc.setLead.setAlpha(1);
        }, [], sc);
        // at this time, hide the rectangle/highlight over the set lead button
        sc.time.delayedCall(12400, function () {
            sc.setLead.clear();
            sc.setLead.setAlpha(0);
        }, [], sc);
        timeline.setCallback("onComplete", function () {
            AudioNarration.stop();
            //AudioNarration.destroy();
            timeline.stop();
            Sim.incorrectCount = 0;
            sc.container.add(sc.unitReset);
            sc.unitReset.clear();
            sc.unitReset.setAlpha(1);
            sc.unitReset.setInteractive(rect1, Phaser.Geom.Rectangle.Contains);
            sc.time.delayedCall(1500, function () {
                // set the prompt
                Sim.output.innerHTML = "Reset the unit.";
                // play second audio
                AudioNarration.initialize('Scenario_04_Step13a_CQ');
                AudioNarration.currentTime = 0;
                AudioNarration.play();
            }, [], sc);
            // correct response area
            sc.unitReset.on('pointerup', function (gameObject) {
                this.currentImage = "uccSetLead";
                sc.time.clearPendingEvents();
                sc.time.removeAllEvents();
                Sim.showFeedBack(true, gameObject);
                sc.unitReset.setAlpha(0);
                sc.unitReset.removeInteractive();
                sc.uccSetLead.setAlpha(1);
                sc.container.add(sc.uccSetLead);
                sc.container.bringToTop(sc.uccSetLead);
                // play correct response
                sc.correctFeedback_s4s13(function () {
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    AudioNarration.destroy();
                    Sim.game.scene.start("SingleFailureHotWaterPumpStep13B");
                    sc.time.delayedCall(2000, function () {
                        sc.scene.stop("SingleFailureHotWaterPumpStep13");
                    }, [], sc);
                });
            });
            // incorrect response area
            sc.container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            sc.container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                sc.incorrectFeedback_s4s13();
                if (Sim.incorrectCount > Sim.promptIncorrect) {
                    sc.unitReset.lineStyle(4, 0xfaff77, 1.0);
                    sc.unitReset.strokeRectShape(rect1);
                    sc.add.tween({
                        targets: [sc.unitReset],
                        ease: 'Sine.easeInOut',
                        duration: 1000,
                        delay: 0,
                        alpha: {
                            getStart: function () { return 1; },
                            getEnd: function () { return 1; }
                        }
                    });
                }
            });
        });
    };
    SingleFailureHotWaterPumpStep13.prototype.onEvent = function () {
        if (this.currentImage != "uccSetLead") {
            if (this.currentImage == "TRBL_yellow") {
                this.container.bringToTop(this.uccTRBL_black);
                this.currentImage = "TRBL_black";
            }
            else if (this.currentImage == "TRBL_black") {
                this.container.bringToTop(this.uccFinalFrame);
                this.currentImage = "TRBL_yellow";
            }
            this.container.bringToTop(this.unitReset);
            this.container.bringToTop(this.setLead);
        }
    };
    SingleFailureHotWaterPumpStep13.prototype.correctFeedback_s4s13 = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            callback();
        }, [], this);
    };
    SingleFailureHotWaterPumpStep13.prototype.incorrectFeedback_s4s13 = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
    };
    return SingleFailureHotWaterPumpStep13;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep13B = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep13B, _super);
    function SingleFailureHotWaterPumpStep13B() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep13B" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep13B.prototype.preload = function () {
        this.load.image("HW_SetLead", "../public/images/HW_Set_Lead.png");
        this.load.image("HW_SetLead_Popup", "../public/images/HW_Set_Lead_Lead_Select_Popup.png");
        this.load.image("HW_System", "../public/images/Hot_Water_System.png");
    };
    SingleFailureHotWaterPumpStep13B.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep13B.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep13B";
        var cam = this.cameras.main;
        var sc = this;
        var currentHotspot;
        cam.setBounds(0, 0, 2000, 2000);
        cam.zoom = 1;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var container = this.add.container(0, 0);
        // create and add initial image to container
        var uccFrameStart = this.add.image(0, 0, "HW_SetLead");
        uccFrameStart.setOrigin(0, 0);
        uccFrameStart.setDisplaySize(width, height);
        container.add(uccFrameStart);
        container.setDepth(1);
        // create set lead image but DO NOT add to container just yet
        var uccSetLead = this.add.image(0, 0, "HW_SetLead_Popup");
        uccSetLead.setOrigin(0, 0);
        uccSetLead.setDisplaySize(width, height);
        // create image for end of step but DO NOT add to container just yet
        var uccFrameFinish = this.add.image(0, 0, "HW_System");
        uccFrameFinish.setOrigin(0, 0);
        uccFrameFinish.setDisplaySize(width, height);
        // next create our 2 hotspots
        //------------------------------------
        var setLead = sc.add.graphics({});
        setLead.setDepth(100);
        setLead.setAlpha(0);
        var setLeadPopupButton = sc.add.graphics({});
        setLeadPopupButton.setDepth(100);
        setLeadPopupButton.setAlpha(0);
        var rect1 = new Phaser.Geom.Rectangle();
        var rect2 = new Phaser.Geom.Rectangle();
        rect1.setSize(50, 29);
        rect1.setPosition(702, 132);
        rect2.setSize(50, 29);
        rect2.setPosition(701, 101);
        setLead.strokeRectShape(rect1);
        setLeadPopupButton.strokeRectShape(rect2);
        //----------------------------------------------------
        // show initially the two rectangles for the set lead hotspot
        container.add(setLead);
        container.removeInteractive();
        var timeline = this.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFrameStart,
            alpha: 1,
            ease: 'Power1',
            duration: 3000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_04_Step13b_CQ');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        Sim.output.innerHTML = "\n                <p>\n                Set pump 1 as the lead.\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            Sim.incorrectCount = 0;
            // stop audio 1
            AudioNarration.stop();
            //AudioNarration.destroy();
            // hide the yellow borders and remove the priority hotspot altogether
            // clear the yellow border
            setLead.clear();
            // be sure the leftPump is available to click on
            setLead.setAlpha(1);
            // set the setLead as the current hotspot
            currentHotspot = "setLead";
            setLead.setInteractive(rect1, Phaser.Geom.Rectangle.Contains);
            // correct response area for 'setLead'
            setLead.on('pointerup', function (gameObject) {
                Sim.showFeedBack(true, gameObject);
                currentHotspot = "setLeadPopupButton";
                container.remove(setLead); // remove my hotspot over set lead
                container.add(uccSetLead); // show the screen image that shows popup box   
                container.add(setLeadPopupButton); // bring the next hotspot into the scene
                setLeadPopupButton.clear(); // hide the yellow border
                setLeadPopupButton.setAlpha(1); // be sure hotspot is visible
                // play correct response
                sc.correctFeedback_s4s13b(function () {
                    // now set up for second hotspot, chillerResetPopupButton
                    setLeadPopupButton.setInteractive(rect2, Phaser.Geom.Rectangle.Contains);
                    Sim.incorrectCount = 0;
                    setLeadPopupButton.on('pointerup', function (gameObject) {
                        Sim.showFeedBack(true, gameObject);
                        currentHotspot = "none";
                        container.remove(setLeadPopupButton); // remove the hotspot
                        container.remove(uccSetLead); // remove the graphic showing the popup
                        container.add(uccFrameFinish);
                        // play correct response
                        sc.correctFeedback_s4s13b(function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            AudioNarration.destroy();
                            Sim.game.scene.start("SingleFailureHotWaterPumpStep14");
                            sc.time.delayedCall(2000, function () {
                                sc.scene.stop("SingleFailureHotWaterPumpStep13B");
                            }, [], sc);
                        });
                    });
                });
            });
            // incorrect response area for any incorrect response
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            container.on('pointerup', function (gameObject) {
                Sim.showFeedBack(false, gameObject);
                Sim.incorrectCount++;
                sc.incorrectFeedback_s4s13b();
                switch (currentHotspot) {
                    case "setLead":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            setLead.lineStyle(4, 0xfaff77, 1.0);
                            setLead.strokeRectShape(rect1);
                            sc.add.tween({
                                targets: [setLead],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                    case "setLeadPopupButton":
                        if (Sim.incorrectCount > Sim.promptIncorrect) {
                            setLeadPopupButton.lineStyle(4, 0xfaff77, 1.0);
                            setLeadPopupButton.strokeRectShape(rect2);
                            sc.add.tween({
                                targets: [setLeadPopupButton],
                                ease: 'Sine.easeInOut',
                                duration: 1000,
                                delay: 0,
                                alpha: {
                                    getStart: function () { return 1; },
                                    getEnd: function () { return 1; }
                                }
                            });
                        }
                        break;
                }
            });
        });
    };
    SingleFailureHotWaterPumpStep13B.prototype.correctFeedback_s4s13b = function (callback) {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('Correct');
        audio.currentTime = 0;
        audio.play();
        this.time.delayedCall(1000, function () {
            callback();
        }, [], this);
    };
    SingleFailureHotWaterPumpStep13B.prototype.incorrectFeedback_s4s13b = function () {
        if (!AudioNarration.paused) {
            AudioNarration.pause();
        }
        var audio = document.getElementById('TryAgain');
        audio.currentTime = 0;
        audio.play();
    };
    return SingleFailureHotWaterPumpStep13B;
}(Phaser.Scene));
/// <reference path="../../../../../typings/phaser.d.ts" />
/// <reference path="../../../Controller.ts" />
/// <reference path="../../../Loader.ts" />
/// <reference path="../../../VideoAnimation.ts" />
var SingleFailureHotWaterPumpStep14 = /** @class */ (function (_super) {
    __extends(SingleFailureHotWaterPumpStep14, _super);
    function SingleFailureHotWaterPumpStep14() {
        var _this = _super.call(this, { key: "SingleFailureHotWaterPumpStep14" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    SingleFailureHotWaterPumpStep14.prototype.preload = function () {
        this.load.image("HW_System", "../public/images/Hot_Water_System.png");
    };
    SingleFailureHotWaterPumpStep14.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    SingleFailureHotWaterPumpStep14.prototype.start = function () {
        Sim.loader.style.visibility = 'hidden';
        Sim.currentScene = "SingleFailureHotWaterPumpStep14";
        var cam = this.cameras.main;
        var sc = this;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        this.container = this.add.container(0, 0);
        this.uccFinalFrame = this.add.image(0, 0, "HW_System");
        this.uccFinalFrame.setOrigin(0, 0);
        this.uccFinalFrame.setDisplaySize(width, height);
        this.uccFinalFrame.setAlpha(1);
        this.container.add(this.uccFinalFrame);
        var timeline = this.tweens.createTimeline({
            ease: 'Linear',
            duration: 0
        });
        timeline.add({
            targets: this.uccFinalFrame,
            alpha: 1,
            ease: 'Power1',
            duration: 10000
        });
        timeline.play();
        AudioNarration.initialize('Scenario_04-14');
        AudioNarration.currentTime = 0;
        AudioNarration.play();
        sc.time.delayedCall(1500, function () {
            cam.zoomTo(1.0, 3000, 'Sine.easeInOut');
        }, [], sc);
        Sim.output.innerHTML = "\n                <p>\n                You verify that both pumps are operational and that the alarm has cleared. The system is now in full redundancy awaiting a failure.\n                </p>\n            ";
        timeline.setCallback("onComplete", function () {
            // **** show Lesson Complete ****
            Sim.removeResources();
            Sim.output.innerHTML = "";
            Sim.currentScene = "";
            AudioNarration.stop();
            AudioNarration.destroy();
            sc.time.delayedCall(2000, function () {
                sc.scene.stop("SingleFailureHotWaterPumpStep14");
                Sim.setComplete();
            }, [], sc);
        });
    };
    return SingleFailureHotWaterPumpStep14;
}(Phaser.Scene));
/// <reference path="../../typings/phaser.d.ts" />
/// <reference path="./Config.ts" />
/// <reference path="./Loader.ts" />
/// <reference path="./SideBar.ts" />
/// <reference path="./Sim.ts" />
/// <reference path="./scenes/introToPowerSystem/IntroPowerSystem.ts" />
/// <reference path="./scenes/introToPowerSystem/BuildingFloorPlan.ts" />
/// <reference path="./scenes/introToPowerSystem/InputModuleAB.ts" />
/// <reference path="./scenes/introToPowerSystem/InputTransformers.ts" />
/// <reference path="./scenes/introToPowerSystem/StaticFrequencyConverters.ts" />
/// <reference path="./scenes/introToPowerSystem/OutputTransformers.ts" />
/// <reference path="./scenes/introToPowerSystem/Deckhouse.ts" />
/// <reference path="./scenes/introToPowerSystem/RDH.ts" />
/// <reference path="./scenes/normalSystemOperation/FullUtilityIntro.ts" />
/// <reference path="./scenes/normalSystemOperation/CriticalSystemSupport.ts" />
/// <reference path="./scenes/normalSystemOperation/SpyRadar.ts" />
/// <reference path="./scenes/normalSystemOperation/VerticalLaunchingSystem.ts" />
/// <reference path="./scenes/normalSystemOperation/VLSIntercept.ts" />
/// <reference path="./scenes/normalSystemOperation/MVS.ts" />
/// <reference path="./scenes/normalSystemOperation/MVSChallenge.ts" />
/// <reference path="./scenes/normalSystemOperation/MainBus.ts" />
/// <reference path="./scenes/normalSystemOperation/MainBusChallengeA.ts" />
/// <reference path="./scenes/normalSystemOperation/MainBusChallengeB.ts" />
/// <reference path="./scenes/normalSystemOperation/PrimaryBusBreakers.ts" />
/// <reference path="./scenes/normalSystemOperation/GenTieBreakerChallenge.ts" />
/// <reference path="./scenes/normalSystemOperation/DieselGenerators.ts" />
/// <reference path="./scenes/normalSystemOperation/FullUtilityEnd.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/SingleUtililtyFailureIntro.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/UtilityADetail.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/FiftySixtyConverter.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/CSOOW.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/UCCMainFaulted.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/KnowledgeQuestion1.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/M11T21Verify.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/LocateManual.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/Deenergized5060Converter.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/StartSFCDetail.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/ASideRestarted.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/TransferSourceConclusion.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/TransferSourceConclusion.ts" />
/// <reference path="./scenes/aSide400HzFailure/IntroASideFailure.ts" />
/// <reference path="./scenes/aSide400HzFailure/FourHundredDetailScreen.ts" />
/// <reference path="./scenes/aSide400HzFailure/FourHundredFaultDetected.ts" />
/// <reference path="./scenes/aSide400HzFailure/NotifyCSOOW.ts" />
/// <reference path="./scenes/aSide400HzFailure/LocateHobartManual.ts" />
/// <reference path="./scenes/aSide400HzFailure/SequencingKnowledgeQuestion.ts" />
/// <reference path="./scenes/aSide400HzFailure/SFCKnowledgeQuestion.ts" />
/// <reference path="./scenes/aSide400HzFailure/HobartFaultReadOut.ts" />
/// <reference path="./scenes/aSide400HzFailure/HobartFaultKnowledgeQuestion.ts" />
/// <reference path="./scenes/aSide400HzFailure/FourHundredFaultCleared.ts" />
/// <reference path="./scenes/aSide400HzFailure/FourHundredConclusion.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/DualUtilityFailureIntro.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/FiftySixtyConvertersFail.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/DualUtilityNotifyCSOOW.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/DualUtilityKnowledgeQuestion1.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/OpenBreakerVerification.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/AutomaticRunRequest.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/GeneratorBreakersClose.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/BreakerF11F21Closes.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/BreakerF12F22Closes.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/LocateABBManual.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/InitiateTransferToFullPower.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/DualUtilityFailureConclusion.ts" />
/// CHILLED WATER SYSTEM - NORMAL SYSTEM OPERATION
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerIntro.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/CrucialSystemSupport.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerScene2.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerScene3.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/ChilledWaterKnowledgeCheckScene3.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerScene4.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerScene5.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/ChilledWaterKnowledgeCheckScene5.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerScene6.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/ChilledWaterKnowledgeCheckScene6.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerScene7.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerScene8.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerScene9.ts" />
/// <reference path="./scenes/ChilledWaterSystem/normalSystemOperation/WaterChillerScene10.ts" />
/// CHILLED WATER SYSTEM - SINGLE SYSTEM FAILURE
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureIntro.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene1.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene2.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene3.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene4.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene4KnowledgeCheck.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene5.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene5KnowledgeCheck.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene6.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene6KnowledgeCheck.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene7.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene7KnowledgeCheck.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene8.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene10.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene11.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleSystemFailure/SingleSystemFailureScene12.ts" />
/// CHILLED WATER SYSTEM - RETURN PUMP FAILURE
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpIntro.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep1.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep2.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep3.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep4.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep5.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/KnowledgeQuestionStep5.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep6.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/KnowledgeQuestionStep6.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep7.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/KnowledgeQuestionStep7.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep8.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep10.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep11.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep12.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep12B.ts" />
/// <reference path="./scenes/ChilledWaterSystem/ReturnPumpFailure/FailureChilledWaterPumpStep13.ts" />
/// CHILLED WATER SYSTEM - SINGLE FAILURE HOT WATER PUMP
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpIntro.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep1.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep2.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep3.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/KnowledgeQuestionSFHWP_Step3.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep4.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/KnowledgeQuestionSFHWP_Step4.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep5.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep6.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep7.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep8.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/KnowledgeQuestionSFHWP_Step8.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep9.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep10.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep12.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep13.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep13B.ts" />
/// <reference path="./scenes/ChilledWaterSystem/SingleHotWaterPumpFailure/SingleFailureHotWaterPumpStep14.ts" />
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super.call(this, { key: "Controller" }) || this;
    }
    Controller.prototype.create = function () {
        Sim.loader.style.visibility = 'visible';
    };
    Controller.prototype.preload = function () {
    };
    return Controller;
}(Phaser.Scene));
// Kick-off Sim initialization
window.addEventListener("DOMContentLoaded", function () {
    var elem = document.querySelector(".content");
    var lesson = Helper.getQueryString('lesson', document.location.href) || "";
    var scenes = [];
    var resources = [];
    switch (lesson) {
        case "":
            scenes = [Controller];
            break;
        case "IntroPowerSystem":
            scenes = [
                Controller,
                IntroPowerSystem,
                BuildingFloorPlan,
                InputModuleAB,
                InputTransformers,
                StaticFrequencyConverters,
                OutputTransformers,
                Deckhouse,
                RDH
            ];
            resources = [
                "../public/audio/introAudio.mp3",
                "../public/images/AA_Building_Landscape-000.png",
                "../public/images/AA_Building_Landscape-100.png",
                "../public/images/AA_Facility_Romania_Floorplan_Electrical_Rooms.png",
                "../public/images/AA_Facility_Romania_floorplan.png",
                "../public/images/AA_landscape-wide.png",
                "../public/images/cnv.png",
                "../public/images/cnv_60.png",
                "../public/images/dhsb_a.png",
                "../public/images/dhsb_a_module.png",
                "../public/images/dhsb_b.png",
                "../public/images/dhsb_low_volt.png",
                "../public/images/f13_f14.png",
                "../public/images/f21_f23.png",
                "../public/images/input_a.png",
                "../public/images/input_a_highlighted.png",
                "../public/images/input_b.png",
                "../public/images/input_b_highlighted.png",
                "../public/images/input_transformer.png",
                "../public/images/launcher_module_enclosure.png",
                "../public/images/lsue.png",
                "../public/images/lsue_line_fix.png",
                "../public/images/output_transformer.png",
                "../public/images/rdh.png",
                "../public/images/rdh.png",
                "../public/images/sky-background.png",
                "../public/images/switch_gears_center.png",
                "../public/images/switch_gears_left.png",
                "../public/images/ucc_final_frame_deckhouse_feed.png",
                "../public/images/ucc_final_frame_input_transformers.png",
                "../public/images/ucc_final_frame_output_transformer.png",
                "../public/images/ucc_final_frame_start.png",
                "../public/images/ucc_final_rdh_frame.png",
                "../public/images/ucc_static_converter_final_frame.png",
                "../public/video/aaBuildingLandscape.mp4",
                "../public/video/uccConsoleZoom.mp4"
            ];
            Sim.threshHold = {
                start: 1,
                end: 8
            };
            break;
        case "FullUtilityIntro":
            scenes = [
                Controller,
                FullUtilityIntro,
                CriticalSystemSupport,
                SpyRadar,
                VerticalLaunchingSystem,
                VLSIntercept,
                MVS,
                MVSChallenge,
                MainBus,
                MainBusChallengeA,
                MainBusChallengeB,
                PrimaryBusBreakers,
                GenTieBreakerChallenge,
                DieselGenerators,
                FullUtilityEnd
            ];
            resources = [
                "../public/audio/fullUtilityAudio.mp3",
                "../public/images/A-B-flipped.png",
                "../public/images/A-B-grayed.png",
                "../public/images/a_side_open.png",
                "../public/images/b-primary-bus.png",
                "../public/images/b_side_open.png",
                "../public/images/m11Breaker.png",
                "../public/images/m21Breaker.png",
                "../public/images/manual_auto_flipped.png",
                "../public/images/ucc_final_frame.png",
                "../public/video/UCC_Console_Zoom_Start.mp4",
                "../public/video/satSystems.mp4",
                "../public/video/vlsIntercept.mp4"
            ];
            Sim.threshHold = {
                start: 1,
                end: 14
            };
            break;
        case "SingleUtililtyFailureIntro":
            scenes = [
                Controller,
                SingleUtililtyFailureIntro,
                UtilityADetail,
                FiftySixtyConverter,
                CSOOW,
                UCCMainFaulted,
                KnowledgeQuestion1,
                M11T21Verify,
                Deenergized5060Converter,
                LocateManual,
                StartSFCDetail,
                ASideRestarted,
                TransferSourceConclusion
            ];
            resources = [
                "../public/audio/Challenge_Questions_02.mp3",
                "../public/audio/Challenge_Questions_ALT_LINE_01.mp3",
                "../public/audio/Four_Hundred_Hz_Challenge_Questions.mp3",
                "../public/audio/fullUtilityAudio.mp3",
                "../public/audio/singleUtilityFiftySixtyAudio.mp3",
                "../public/images/50_60Hz_Static_Frequency_Converter_Large.png",
                "../public/images/UCC_Console_Zoom_T21_Open_end.png",
                "../public/images/UCC_Console_Zoom_T21_Open_end.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_end.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Critical_Condition_start.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_end.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged_start.png",
                "../public/images/start_sfc.png", "../public/images/start_sfc_button.png",
                "../public/images/transfer_dialog.png", "../public/images/uccMainFaulted.png",
                "../public/images/ucc_console_powered_zoom_end.png",
                "../public/video/UCC_Console_Zoom_T21_Open.mp4",
                "../public/video/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged.mp4",
                "../public/video/UCC_Monitor_Pan_Center_to_Left_T21_Open.mp4",
                "../public/video/UCC_Monitor_Pan_Left_to_Center_60Hz_Critical_Condition.mp4",
                "../public/video/UCC_Monitor_Pan_Left_to_Center_60Hz_Unacknowledged.mp4"
            ];
            Sim.threshHold = {
                start: 1,
                end: 12
            };
            break;
        case "DualUtilityFailureIntro":
            scenes = [
                Controller,
                DualUtilityFailureIntro,
                FiftySixtyConvertersFail,
                DualUtilityNotifyCSOOW,
                DualUtilityKnowledgeQuestion1,
                OpenBreakerVerification,
                AutomaticRunRequest,
                GeneratorBreakersClose,
                BreakerF11F21Closes,
                BreakerF12F22Closes,
                LocateABBManual,
                InitiateTransferToFullPower,
                DualUtilityFailureConclusion
            ];
            resources = [
                "../public/audio/Challenge_Questions_ALT_LINE_01.mp3",
                "../public/audio/Full_Loss_of_Utility_Power.mp3",
                "../public/audio/Full_Loss_of_Utility_Power_Challenge Questions.mp3",
                "../public/audio/dieselEngine.mp3", "../public/audio/fullUtilityAudio.mp3",
                "../public/audio/singleUtilityFiftySixtyAudio.mp3",
                "../public/images/CSOOW.png",
                "../public/images/Catepillar3516C_Diesel_Front_off.png",
                "../public/images/Catepillar3516C_Diesel_Front_on.png",
                "../public/images/Chief_Still.png",
                "../public/images/UCC_Console_Zoom_T21_Open_end.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_Two_Gens_Powered.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_F12_F22_closed.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_closed.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f11_open.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_f21_closed.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_closed.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_first_gen_open.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_gbreakers_closed.png",
                "../public/images/UCC_Monitor_Pan_Center_to_Left_50Hz_Loss_start_t21_closed.png",
                "../public/images/to_util_button.png", "../public/images/transfer_dialog.png",
                "../public/video/UCC_Console_Zoom_Power_Loss_F11_open.mp4",
                "../public/video/UCC_Console_Zoom_T21_Open.mp4"
            ];
            Sim.threshHold = {
                start: 1,
                end: 12
            };
            break;
        case "IntroASideFailure":
            scenes = [
                Controller,
                IntroASideFailure,
                /* This is the d and d question that gives issues in IE */
                //SequencingKnowledgeQuestion,
                FourHundredDetailScreen,
                FourHundredFaultDetected,
                NotifyCSOOW,
                LocateHobartManual,
                SFCKnowledgeQuestion,
                HobartFaultReadOut,
                HobartFaultKnowledgeQuestion,
                FourHundredFaultCleared,
                FourHundredConclusion
            ];
            resources = [
                "../public/audio/Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus.mp3",
                "../public/audio/Four_Hundred_Hz_Challenge_Questions.mp3",
                "../public/audio/Four_Hundred_Hz_Sir_we_have_a_failure_take2.mp3",
                "../public/audio/Full_Loss_of_Utility_Power_Challenge Questions.mp3",
                "../public/audio/fullUtilityAudio.mp3",
                "../public/images/400Hz_udp_1_23_2_A.png",
                "../public/images/400Hz_udp_1_23_2_N.png",
                "../public/images/400Hz_udp_1_43_1_A.png",
                "../public/images/400Hz_udp_1_43_1_N.png",
                "../public/images/CSOOW.png",
                "../public/images/Chief_Still.png",
                "../public/images/Hobart400Hz_PowerMaster180kVA_Large_Front.png",
                "../public/images/Hobart400Hz_red_bulb.png",
                "../public/images/UCC_Console_Zoom_T21_Open_end.png",
                "../public/images/UCC_Console_Zoom_T21_Open_end_rdh_highlighted.png",
                "../public/images/UCC_Monitor_Pan-400Hz_Center_to_Left_T21_Open_end_sfc_highlighted.png",
                "../public/images/UCC_Monitor_Pan-400Hz_Left_to_Center_Unacknowledged_start.png",
                "../public/images/UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open_end.png",
                "../public/images/error_code_0150.png",
                "../public/images/hobart_zoomed_in.png",
                "../public/video/UCC_Console_Zoom_T21_Open.mp4",
                "../public/video/UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open.mp4",
                "../public/video/UCC_Monitor_Pan_400Hz_Left_to_Center_T21_Open.mp4"
            ];
            Sim.threshHold = {
                start: 1,
                end: 10
            };
            break;
        case "WaterChillerIntro":
            scenes = [
                Controller,
                WaterChillerIntro,
                CrucialSystemSupport,
                WaterChillerScene2,
                WaterChillerScene3,
                ChilledWaterKnowledgeCheckScene3,
                WaterChillerScene4,
                WaterChillerScene5,
                ChilledWaterKnowledgeCheckScene5,
                WaterChillerScene6,
                ChilledWaterKnowledgeCheckScene6,
                WaterChillerScene7,
                WaterChillerScene8,
                WaterChillerScene9,
                WaterChillerScene10,
            ];
            resources = [
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-01.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-02.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-03.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-04.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-05.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-06.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-07.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-08.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-09.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-10.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-11.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Scenario_01-Challenge_Questions.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Sco_1_Scene_3_KC.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Sco_1_Scene_5_KC.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Sco_1_Scene_6_KC.mp3",
                "../public/audio/Chilled_Water_System/Scenario_01/Sco_1_Scene_9_KC.mp3",
                "../public/audio/TryAgain.mp3",
                "../public/audio/Correct.mp3",
                //"../public/images/",
                "../public/video/UCC_Monitor_Pan-Right_to_Center_Normal_System_Operations.mp4",
                "../public/video/UCC_Monitor_Pan-left_to_Right_Normal_System_Operations.mp4",
                "../public/video/UCC_Monitor_Pan-left_to_Center_Normal_System_Operations.mp4",
                "../public/video/UCC_Monitor_Pan-Center_to_Left_Normal_System_Operations.mp4",
                "../public/video/UCC_Console_Zoom_Normal_System_Operations.mp4",
            ];
            Sim.threshHold = {
                start: 1,
                end: scenes.length - 1
            };
            break;
        case "SingleSystemFailureIntro":
            scenes = [
                Controller,
                SingleSystemFailureIntro,
                SingleSystemFailureScene1,
                SingleSystemFailureScene2,
                SingleSystemFailureScene3,
                SingleSystemFailureScene4,
                SingleSystemFailureScene4KnowledgeCheck,
                SingleSystemFailureScene5,
                SingleSystemFailureScene5KnowledgeCheck,
                SingleSystemFailureScene6,
                SingleSystemFailureScene6KnowledgeCheck,
                SingleSystemFailureScene7,
                SingleSystemFailureScene7KnowledgeCheck,
                SingleSystemFailureScene8,
                SingleSystemFailureScene10,
                SingleSystemFailureScene11,
                SingleSystemFailureScene12,
            ];
            resources = [
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-01.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-02.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-03.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-04.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-05.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-06.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-07.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-08.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-09.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-10.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-11.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-11a.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-11b.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-12.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-13.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scenario_02-Challenge_Questions.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scene4.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scene5.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scene6.mp3",
                "../public/audio/Chilled_Water_System/Scenario_02/Scene7.mp3",
                //"../public/images/",
                "../public/audio/TryAgain.mp3",
                "../public/audio/Correct.mp3",
                //Videos
                "../public/video/UCC_Console_Zoom_Normal_System_Operations.mp4",
                "../public/video/UCC_Monitor_Pan-Center_to_Left_Single_Sys_Failure_CWS.mp4",
                "../public/video/UCC_Monitor_Pan-Left_to_Center_Single_Sys_Failure_CWS.mp4",
                "../public/video/UCC_Monitor_Pan-Center_to_Left_Single_Sys_Failure_CWS_Low_Pressure.mp4",
                "../public/video/UCC_Monitor_Pan-Center_to_Left_Single_Sys_Failure_CWS_Hi_Temp.mp4",
                "../public/video/UCC_Monitor_Pan-Left_to_Center_Single_Sys_Failure_CWS_Low_Pressure.mp4",
                "../public/video/UCC_Monitor_Pan-Left_to_Center_Single_Sys_Failure_CWS_High_Temp.mp4",
            ];
            Sim.threshHold = {
                start: 1,
                end: scenes.length - 1
            };
            break;
        case "FailureChilledWaterPumpIntro":
            scenes = [
                Controller,
                FailureChilledWaterPumpIntro,
                FailureChilledWaterPumpStep1,
                FailureChilledWaterPumpStep2,
                FailureChilledWaterPumpStep3,
                FailureChilledWaterPumpStep4,
                FailureChilledWaterPumpStep5,
                KnowledgeQuestionStep5,
                FailureChilledWaterPumpStep6,
                KnowledgeQuestionStep6,
                FailureChilledWaterPumpStep7,
                KnowledgeQuestionStep7,
                FailureChilledWaterPumpStep8,
                FailureChilledWaterPumpStep10,
                FailureChilledWaterPumpStep11,
                FailureChilledWaterPumpStep12,
                FailureChilledWaterPumpStep12B,
                FailureChilledWaterPumpStep13
            ];
            resources = [
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-01.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-02.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-03.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-04-with_AlarmSound.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-05.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-06.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-07.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-08.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-10.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-11.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-12.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-13.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-14.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03-15.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03_Step2_CQ.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03_Step5_CQ.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03_Step6_CQ.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03_Step7_CQ.mp3",
                "../public/audio/Chilled_Water_System/Scenario_03/Scenario_03_Step12_CQ.mp3",
                "../public/audio/TryAgain.mp3",
                "../public/audio/Correct.mp3",
                "../public/images/ChilledWaterSummer.png",
                "../public/images/ChilledWaterWinter.png",
                "../public/images/ChilledWaterWinterB.png",
                "../public/images/ChilledWaterWinterB_flow1.png",
                "../public/images/ChilledWaterWinterB_flow2.png",
                "../public/images/AA_Building_Landscape-000.png",
                "../public/images/Chilled_Water_Return_Pump_Run_Fail_LI.png",
                "../public/images/ChilledWaterWinterB_ReturnPumpFailure.png",
                "../public/images/ChilledWaterReturnPumpsUnavailable.png",
                "../public/images/ChilledWaterReturnPumpsUnavailable2.png",
                "../public/images/ChilledWaterReturnPumpAlarmCode.png",
                "../public/images/ChilledWaterReturnPumpAlarmCode2.png",
                "../public/images/CSOOW.png",
                "../public/images/Chief_Still.png",
                "../public/images/References_Menu_With_GrundfosMotorsPDF_wArrows.png",
                "../public/images/ChilledWaterWinterB_ReturnPumpFailure2.png",
                "../public/images/ChilledWaterSummerStart.png",
                "../public/images/ChilledWaterUnitReset.png",
                "../public/images/ChilledWaterChillerPriority.png",
                "../public/images/ChilledWaterSummerFinished.png",
                "../public/video/UCC_Console_Zoom_Return_Sys_Pump_Failure.mp4",
            ];
            Sim.threshHold = {
                start: 1,
                end: 17
            };
            break;
        case "SingleFailureHotWaterPumpIntro":
            scenes = [
                Controller,
                SingleFailureHotWaterPumpIntro,
                SingleFailureHotWaterPumpStep1,
                SingleFailureHotWaterPumpStep2,
                SingleFailureHotWaterPumpStep3,
                KnowledgeQuestionSFHWP_Step3,
                SingleFailureHotWaterPumpStep4,
                KnowledgeQuestionSFHWP_Step4,
                SingleFailureHotWaterPumpStep5,
                SingleFailureHotWaterPumpStep6,
                SingleFailureHotWaterPumpStep7,
                SingleFailureHotWaterPumpStep8,
                KnowledgeQuestionSFHWP_Step8,
                SingleFailureHotWaterPumpStep9,
                SingleFailureHotWaterPumpStep10,
                SingleFailureHotWaterPumpStep12,
                SingleFailureHotWaterPumpStep13,
                SingleFailureHotWaterPumpStep13B,
                SingleFailureHotWaterPumpStep14,
            ];
            resources = [
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-01.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-02.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-03.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-04.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-05.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-06.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-07.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-08.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-09.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-10.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-11.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-11a.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-12.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-13.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04-14.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04_Step3_CQ.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04_Step4_CQ.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04_Step7_CQ.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04_Step8_CQ.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04_Step13a_CQ.mp3",
                "../public/audio/Chilled_Water_System/Scenario_04/Scenario_04_Step13b_CQ.mp3",
                "../public/audio/TryAgain.mp3",
                "../public/audio/Correct.mp3",
                "../public/images/UCC_Console_Zoom_Single_Failure_HW_Pump_end.png",
                "../public/images/UCC_Monitor_Pan-Center_to_Left_Single_Failure_HW_Pump_end.png",
                "../public/images/UCC_Monitor_Pan-Center_to_Left_Single_Failure_HW_Pump_end3.png",
                "../public/images/UCC_Monitor_Pan-Center_to_Right_Single_Failure_HW_Pump_end.png",
                "../public/images/UCC_Monitor_Pan-Center_to_Right_Single_Failure_HW_Pump_end2.png",
                "../public/images/HW_EndFrame.png",
                "../public/images/HW_EndFrame_darkTRBL.png",
                "../public/images/CSOOW.png",
                "../public/images/Chief_Still.png",
                "../public/images/References_Menu_With_GrundfosMotorsPDF_wArrows.png",
                "../public/images/HW_Set_Lead_Lead_Select_Popup.png",
                "../public/images/HW_Set_Lead_Unit_Reset_Popup.png",
                "../public/images/Hot_Water_System.png",
                "../public/images/HW_Set_Lead.png",
                "../public/video/UCC_Console_Zoom_Single_Failure_HW_Pump.mp4",
                "../public/video/UCC_Monitor_Pan-Center_to_Left_Single_Failure_HW_Pump.mp4",
                "../public/video/UCC_Monitor_Pan-Left_to_Center_Single_Failure_HW_Pump.mp4",
                "../public/video/UCC_Monitor_Pan-Center_to_Right_Single_Failure_HW_Pump.mp4",
                "../public/video/AA_Missile_Attack.mp4",
                "../public/video/AA_Facilities_Gas.mp4",
                "../public/video/UCC_Monitor_Pan-Right_to_Center_Single_Failure_HW_Pump.mp4",
            ];
            Sim.threshHold = {
                start: 1,
                end: 18
            };
            break;
    }
    //WE ONLY NEED TO SETUP SIM.THRESHOLD ONCE here.....
    /* Sim.threshHold = {
        start: 1,
        end: scenes.length - 1
    } */
    // Set Phaser configuration properties based on content div element
    var config = {
        type: Phaser.CANVAS,
        width: elem.offsetWidth,
        height: elem.offsetHeight,
        parent: elem,
        scene: scenes
    };
    Sim.loader = document.querySelector(".loading");
    Sim.output = parent.document.querySelector('.output');
    if (window.location.href.indexOf('localhost') == -1) {
        if (parent.parent["doLMSGetValue"]("cmi.entry") == "ab-initio") {
            parent.parent["doLMSSetValue"]("cmi.location", lesson);
            loadSim();
        }
        else {
            var bookmark_1 = null;
            if (parent.parent["doLMSGetValue"]("cmi.entry") == "") {
                bookmark_1 = lesson;
                loadSim();
            }
            else {
                if (parent.parent["doLMSGetValue"]("cmi.completion_status") != "completed") {
                    setTimeout(function () {
                        bookmark_1 = parent.parent['doLMSGetValue']("cmi.location");
                        if (bookmark_1 != "") {
                            lesson = bookmark_1;
                        }
                        loadSim();
                    }, 1000);
                }
                else {
                    loadSim();
                }
            }
        }
    }
    else {
        loadSim();
    }
    function loadSim() {
        if (resources.length > 0) {
            var loader = new Loader();
            loader.load(resources, function () {
                Sim.game = new Phaser.Game(config);
                Sim.game.scene.start(lesson);
            }, this);
        }
        else {
            Sim.game = new Phaser.Game(config);
        }
    }
});
/// <reference path="./Loader.ts" />
/// <reference path="./SideBar.ts" />
var App = /** @class */ (function () {
    function App() {
    }
    App.initialize = function () {
        var loader = new Loader();
        loader.load(['../public/data/data.json', '../public/data/glossary.json'], function () {
            App.loadGlossary(App['glossary'].glossary);
            document.querySelector('.sim-title').innerHTML = App['data']['title'];
            var sidebar = new SideBar(document.querySelector(".sidebar"), App['data']['lessons']);
            if (App.isLMS == true) {
                var sco = Helper.getQueryString('scoID', document.location.href);
                var menuItem = '';
                switch (sco) {
                    case 'IntroPowerSystem':
                        menuItem = 'Introduction to the Pzower System';
                        break;
                    case 'FullUtilityIntro':
                        menuItem = 'Normal System Operation';
                        break;
                    case 'SingleUtililtyFailureIntro':
                        menuItem = '50/60 Hz Single Utility Failure';
                        break;
                    case 'DualUtilityFailureIntro':
                        menuItem = '50/60 Hz Dual Utility Failure';
                        break;
                    case 'IntroASideFailure':
                        menuItem = 'A Side 400 Hz Failure';
                        break;
                    case 'FailureChilledWaterPumpIntro':
                        menuItem = 'Failure of a Chilled Water Return Pump';
                        break;
                    case 'WaterChillerIntro':
                        menuItem = 'Chilled Water Normal Systems Operation';
                        break;
                    case 'SingleSystemFailureIntro':
                        menuItem = 'Single System Failure of the Chilled Water System';
                        break;
                    case 'FailureChilledWaterPumpIntro':
                        menuItem = 'Failure of a Chilled Water Return Pump';
                        break;
                    case 'SingleFailureHotWaterPumpIntro':
                        menuItem = 'Single Failure of Hot Water Pump';
                        break;
                }
                if (menuItem != '') {
                    App.$(":contains('" + menuItem + "')").click();
                }
            }
        }, App);
        var iframe = document.querySelector('#contentFrame');
        document.querySelector('.pause').addEventListener('click', function () {
            iframe['contentWindow'].Sim.pause();
        });
        document.querySelector('.back').addEventListener('click', function () {
            iframe['contentWindow'].Sim.previous();
        });
        document.querySelector('.restart').addEventListener('click', function () {
            iframe['contentWindow'].Sim.replay();
        });
        document.querySelector('.forward').addEventListener('click', function () {
            iframe['contentWindow'].Sim.next();
        });
        var references = document.getElementsByClassName('reference');
        for (var i = 0; i < references.length; i++) {
            references[i].addEventListener('click', function () {
                try {
                    iframe['contentWindow'].Sim.openReference(this);
                }
                catch (e) {
                    var doc = '/public/references/' + this.innerHTML + '.' + this.getAttribute('data-type');
                    if (this.className == "reference abb") {
                        doc = '/public/references/ABB 5060 Hertz Converter Operation and Maintenance Manual.pdf';
                    }
                    var win = window.open(doc, '_blank');
                    window.focus();
                }
            });
        }
    };
    App.loadGlossary = function (glossary) {
        var glossaryElem = document.querySelector("#glossary .modal-body");
        var div = null;
        var span = null;
        glossary.forEach(function (item) {
            div = document.createElement('div');
            span = document.createElement('span');
            span.className = 'acronym';
            span.innerHTML = item['acronym'];
            div.appendChild(span);
            span = document.createElement('span');
            span.className = 'term';
            span.innerHTML = item['term'];
            div.appendChild(span);
            glossaryElem.appendChild(div);
        });
    };
    App.getSim = function () {
        var iframe = document.querySelector('#contentFrame');
        return iframe['contentWindow'].Sim;
    };
    ;
    App.isLMS = false;
    App.$ = window['jQuery'];
    return App;
}());
//# sourceMappingURL=bundle.js.map