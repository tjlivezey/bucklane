var Helper = /** @class */ (function () {
    function Helper() {
    }

    Helper.initializeMouseMover = function () {
        var header = window.parent.document.querySelector('.header-commands');
        let span = document.createElement('span');
        header.insertAdjacentElement('afterbegin', span);

        let pointPos1 = { x: null, y: null };
        let pointPos2 = { x: 0, y: 0 };

        var iframe = window.document.querySelector('iframe');
        var canvasEl = iframe.contentWindow.document.querySelector('canvas');

        canvasEl.addEventListener('mouseup', function () {
            var sim = App.getSim();
            let mousePos = sim.game.input.activePointer.position;

            if (pointPos1.x === null && pointPos1.y === null) {
                pointPos1.x = mousePos.x;
                pointPos1.y = mousePos.y;
            } else {
                pointPos2.x = mousePos.x;
                pointPos2.y = mousePos.y;

                console.info('Point 1:'.concat(pointPos1.x, ',', pointPos1.y));
                console.info('Point 2:'.concat(pointPos2.x, ',', pointPos2.y));

                console.info('width:'.concat((pointPos2.x - pointPos1.x)));
                console.info('Height:'.concat((pointPos2.y - pointPos1.y)));

                //Clear the Point position so we can start again.
                pointPos1.x = pointPos1.y = null;
            }
        });

        canvasEl.addEventListener('mousemove', function () {
            var sim = App.getSim();
            let mousePosition = sim.game.input.activePointer.position;
            span.textContent = `Mouse Position: [${mousePosition.x},${mousePosition.y}]`;
        });
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
//# sourceMappingURL=Helper.js.map