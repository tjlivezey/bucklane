var SideBar = /** @class */ (function () {
    function SideBar (elem, lessonData) {
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

    SideBar.prototype.createLessonHeader = function (title) {
        var container = document.createElement('div');
        var button = document.createElement('button');
        button.classList.add('subSectionHeader');
        button.textContent = title;

        var div = document.createElement('div');
        div.classList.add('panel');

        container.appendChild(button);
        container.appendChild(div);

        button.addEventListener('click', function (evt) {
            //1st Close any other Open active Panels 
            var elems = document.querySelectorAll('.subSectionHeader.active');
            Array.from(elems).forEach(function closeAccordian(elemHeader) {
                elemHeader.classList.toggle('active');
                elemHeader.nextElementSibling.style.maxHeight = null;
            });

            //2nd set the clicked on panel to active.
            let elem = (evt.currentTarget);
            elem.classList.toggle("active");
            var panel = elem.nextElementSibling;
            panel.style.maxHeight = (panel.style.maxHeight) ? null : panel.scrollHeight + "px";
        });

        return container;
    }

    SideBar.prototype.clearPreviousScenarioSelection = function clearSelection () {
        var scenarios = document.querySelectorAll('.menu-item');
        Array.from(scenarios).forEach(function resetBGColor(elem) {
            elem.style.backgroundColor = "";
        });
    };

    SideBar.prototype._render = function () {
        var _this = this;
        var html = "";
        var span = null;

        /**
         * : { items: Array<{ title: string, start: string }>, subsystemTitle: string }
         */
        this._lessons.forEach(function drawLessonGroup (lessonGroup) {
            var lessonPanel = this.createLessonHeader(lessonGroup.subsystemTitle);
            var panel = lessonPanel.querySelector('.panel');
            lessonGroup.items.forEach(function drawLesson(lesson) {
                span = document.createElement('span');
                span.className = 'menu-item';
                span.innerHTML = lesson.title;
                span.dataset['start'] = lesson.start;
                span.addEventListener('click', function (evt) {
                    var elem = evt.currentTarget;
                    var start = elem.dataset.start;
                    
                    _this.clearPreviousScenarioSelection();
                    document.querySelector('#contentFrame')['src'] = 'content.html?lesson=' + start;
                    var pauseButton = document.querySelectorAll('.action')[1];
                    pauseButton.className = 'action pause';
                    pauseButton.setAttribute('title', 'Pause');

                    document.querySelector('.forward').removeAttribute('disabled');
                    document.querySelector('.highlight')['style'].display = 'none';

                    evt.target['style'].backgroundColor = "#435058";
                    document.querySelector('.lesson-title').innerHTML = evt.target['innerHTML'];
                });
                panel.appendChild(span);
            }, this);
            this._element.appendChild(lessonPanel);
        }, this);
    };
    return SideBar;
}());
//# sourceMappingURL=SideBar.js.map