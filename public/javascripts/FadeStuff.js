"use strict";

class FadeStuff {
    constructor(direction, fadeWhat) {
        this.direction = direction;
        this.fadeWhat = fadeWhat;
    }

    doFade() {
        //http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
        let div = document.getElementById(this.fadeWhat);
        if (this.direction == "in") {
            div.style.opacity = 0;
            div.style.visibility = 'visible';
            (function fade() {
                let val = parseFloat(div.style.opacity);
                if (!((val += .01) >= 1)) {
                    div.style.opacity = val;
                    requestAnimationFrame(fade);
                }
            })();
        } else if (this.direction == "out") {
            div.style.opacity = 1;
            (function fade() {
                if ((div.style.opacity -= .01) <= 0) {
                    div.style.visibility = 'hidden';
                } else {
                    requestAnimationFrame(fade);
                }
            })();
        }
    }
}

module.exports = FadeStuff;