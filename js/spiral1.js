    // forked from tholman's 
    // forked from tyfkda's  http://jsdo.it/tyfkda/rukS

function spiral1Start() {	
    var requestAnimFrame = 
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");

    var cx, cy, maxR;
    var angStep = 0;
    var stepAccel = 0.00015;

    initialize();

    function initialize() {
        window.addEventListener('resize', resize, false);
        canvas.addEventListener('click', click, false);

        window.location.hash = window.location.hash || '0.00025';
        stepAccel = Number(window.location.hash.substr(1)) || 0.00025;

        resize();
        animate();
    }

    function click() {
        angStep = 0;
        stepAccel += 0.00005;
        window.location.hash = stepAccel;
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        cx = canvas.width / 2;
        cy = canvas.height / 2;
        maxR = Math.sqrt(cx*cx + cy*cy);
    }

    function fillCircle(x, y, r) {
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI, true);
        context.fill();
    }

    function animate() {
        requestAnimFrame(animate);

        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        angStep += stepAccel;
        if (angStep >= 2 * Math.PI) {
            angStep -= 2 * Math.PI;
        }

        drawSpiral(angStep);
    }

    function drawSpiral(angStep) {
        context.fillStyle = 'red';

        var ang = 0, r = 0;

        do {
            var x = (r * Math.cos(ang) + cx);
            var y = (r * Math.sin(ang) + cy);
            var R = Math.sqrt(r / 2);
            fillCircle(x, y, R);

            ang += angStep;
            r += 1.3;
        } while (r <= maxR + R);
    }
}
