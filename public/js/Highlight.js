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
//# sourceMappingURL=Highlight.js.map