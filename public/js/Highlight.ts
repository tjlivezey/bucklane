class Highlight {
    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public element: HTMLElement;
    public color: string = 'yellow';
    public blink: boolean = false;

    constructor() {
        this.element = parent.document.querySelector(".highlight");
    }

    show() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.display = 'block';

        if (this.blink === true) {
            this.element.className = this.element.className + ' blink';
        }
    }

    hide() {
        this.element.style.display = 'none';
        this.element.className = this.element.className.replace(" blink", "");
    }
}