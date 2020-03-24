interface ISideBar {
    html: Function;
}

class SideBar implements ISideBar {
    private _element: HTMLDivElement;
    private _lessons: Array<object>;
    private $ = window["jQuery"];

    constructor(elem: HTMLDivElement, lessonData: Array<object>) {
        this._lessons = lessonData;
        this._element = elem;
        this._render();
    }

    html(value?: string) {
        if (!value) {
            return this._element.innerHTML;
        }
        else {
            this._element.innerHTML = value;
        }
    }

    private _render() {
        let html = "";
        let span: HTMLSpanElement = null;
        
        this._lessons.forEach((lesson) => {
            span = document.createElement('span');
            span.className = 'menu-item';
            span.innerHTML = lesson['title'];
            span.addEventListener('click', (evt) => {
                document.querySelector('.output').innerHTML = '';
                document.querySelector('.mask')['style'].display = 'block';
                var iframe = document.querySelector('#contentFrame');
                let start = null;
                switch (evt.target['innerHTML']) {
                    case 'Introduction to the Power System':
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
                let pauseButton = document.querySelectorAll('.action')[1];
                pauseButton.className = 'action pause';
                pauseButton.setAttribute('title', 'Pause');

                document.querySelector('.forward').removeAttribute('disabled');
                document.querySelector('.highlight')['style'].display = 'none';
                
                this.$(".menu-item", document).css("background-color", "transparent");
                evt.target['style'].backgroundColor = "#435058";
                document.querySelector('.lesson-title').innerHTML = evt.target['innerHTML'];
            });
            
            this._element.appendChild(span);
        });
    }
}