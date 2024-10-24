var speed = 0.9;
var WIDTH;
var HEIGHT;
var castleWidth;
var scale;
var control = false;

var progress = 0.0;

var _castleCont = $('.castle-container');
var _castle = $('.castle');

var resize = function() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    scale = WIDTH / 1440;

    castleWidth = _castle.width() * scale;

    TweenLite.set(_castle, {scale: scale * 0.85});
};
resize();
$(window).on('resize', resize);


var draw = function() {
    requestAnimationFrame(draw);

    progress += 0.0012 * speed;
    if (progress > 1) progress = 0;
    if (progress < 0) progress = 1;

    TweenLite.set(_castleCont, {x: (1440 * scale + castleWidth) * -progress + castleWidth / 2, y: 900 * scale * -(0.36 + progress * 0.35)});
};

$(document).on('mousemove', function(e) {
    if (!control) return;

    speed = (1 - (e.clientX / WIDTH) * 2) * 2;
    
    tl.timeScale(speed);
    tl2.timeScale(speed);
    tl3.timeScale(speed);
    tl4.timeScale(speed);
    tl5.timeScale(speed);
});

$('.control-toggle').on('click', function() {
    control = !control;
    $('.container').toggleClass('active');
});

TweenLite.defaultEase = Power1.easeInOut;

var cloudIntro = function() {
    TweenLite.to($('.cloud1'), 20, {x: WIDTH * 2, y: 300 * scale, opacity: 0.3, ease: Linear.easeNone, force3D: true});
    TweenLite.to($('.cloud-shadow1'), 20, {x: WIDTH * 2 + 50 * scale, y: 450 * scale, opacity: 0.2, ease: Linear.easeNone, force3D: true});
    TweenLite.to($('.cloud-shadow2'), 20, {x: WIDTH * 2 + 50 * scale, y: 450 * scale, ease: Linear.easeNone, force3D: true});
    TweenLite.to($('.cloud-shadow3'), 20, {x: WIDTH * 2 + 50 * scale, y: 450 * scale, ease: Linear.easeNone, force3D: true});
    TweenLite.to($('.cloud2'), 20, {x: WIDTH * 2, y: 300 * scale, opacity: 0.5, ease: Linear.easeNone, force3D: true});
    TweenLite.to($('.cloud3'), 20, {x: WIDTH * 2, y: 300 * scale, ease: Linear.easeNone, force3D: true});
    TweenLite.to($('.cloud4'), 20, {x: WIDTH * 2, y: 300 * scale, ease: Linear.easeNone, force3D: true});
    TweenLite.to($('.cloud5'), 20, {x: WIDTH * 2, y: 300 * scale, ease: Linear.easeNone, force3D: true, onComplete: function() {
        $('.clouds').remove();
    }});
};

var init = function() {
    TweenLite.to($('.load-gate'), 0.5, {opacity: 0, onComplete: function() {
        $('.load-gate').remove();
    }});
    requestAnimationFrame(draw);
    cloudIntro();
};
if (document.readyState == 'complete') {
    init();
} else {
    $(window).load(init);
};

TweenMax.to($('.cloud-bg'), 40, {x: WIDTH * 2, y: 200 * scale, ease: Linear.easeNone, repeat: -1, force3D: true, onRepeat: function() {
    TweenLite.set(this.target[0], {y: Math.random() * 200 - 100, rotationZ: Math.round(Math.random() * 60) - 30, scaleX: Math.random() > 0.5 ? 1 : -1});
}});

TweenMax.to($('.cloud-bg2'), 40, {x: WIDTH * 2, y: 200 * scale, ease: Linear.easeNone, delay: 10, repeat: -1, force3D: true, onRepeat: function() {
    TweenLite.set(this.target[0], {y: Math.random() * 200 - 100, rotationZ: Math.round(Math.random() * 60) - 30, scaleX: Math.random() > 0.5 ? 1 : -1});
}});

var tl = new TimelineMax({repeat: -1, onReverseComplete: function() {this.seek(tl.duration())}});

var _flleg = $('.flleg');
var _flbottomGroup = $('.flbottom-group');
var _flfoot = $('.flfoot');

TweenLite.set(_flleg, {rotationZ: 45, x: -5});
TweenLite.set(_flbottomGroup, {rotationZ: 5});
TweenLite.set(_flfoot, {rotationZ: -50});

tl.add([
    TweenLite.to(_flleg, 1.0, {rotationZ: -45, delay: 0.0, force3D: true}),

    TweenLite.to(_flleg, 0.2, {x: 0, delay: 0.0, ease: Power1.easeOut, force3D: true}),

    TweenLite.to(_flleg, 0.55, {scaleY: 0.8, delay: 0.0, force3D: true}),
    TweenLite.to(_flbottomGroup, 0.55, {scaleY: 0.8, delay: 0.0, force3D: true}),
    TweenLite.to(_flbottomGroup, 0.6, {rotationZ: 20, delay: 0.0, ease: Power3.easeIn, force3D: true}),
    TweenLite.to(_flfoot, 0.55, {scaleY: 1.5, delay: 0.0, force3D: true}),
    TweenLite.to(_flfoot, 0.6, {rotationZ: 10, delay: 0.0, ease: Power2.easeIn, force3D: true}),
    
    TweenLite.to(_flleg, 0.4, {scaleY: 1.0, delay: 0.6, force3D: true}),
    TweenLite.to(_flbottomGroup, 0.4, {scaleY: 0.7, delay: 0.6, force3D: true}),
    TweenLite.to(_flbottomGroup, 0.4, {rotationZ: 50, delay: 0.6, force3D: true}),
    TweenLite.to(_flfoot, 0.2, {rotationZ: 10, delay: 0.6, ease: Linear.easeNone, force3D: true}),
    TweenLite.to(_flfoot, 0.2, {rotationZ: -10, delay: 0.8, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_flfoot, 0.4, {scaleY: 1.5, delay: 0.6, force3D: true}),
    
    TweenLite.to(_flleg, 0.6, {x: 20, delay: 0.7, force3D: true}),

    TweenLite.to(_flleg, 0.5, {rotationZ: 0, delay: 1.0, ease: Power1.easeIn, force3D: true}),
    TweenLite.to(_flleg, 0.5, {scaleY: 0.8, delay: 1.0, force3D: true}),
    TweenLite.to(_flbottomGroup, 0.5, {scaleY: 0.5, delay: 1.0, force3D: true}),
    TweenLite.to(_flfoot, 0.5, {scaleX: 1.8, scaleY: 1.7, delay: 1.0, ease: Power1.easeIn, force3D: true}),
    TweenLite.to(_flbottomGroup, 0.5, {rotationZ: 40, delay: 1.0, force3D: true}),
    TweenLite.to(_flfoot, 0.5, {rotationZ: -70, delay: 1.0, force3D: true}),

    TweenLite.to(_flleg, 0.5, {rotationZ: 45, delay: 1.5, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_flleg, 0.5, {scaleY: 1.0, delay: 1.5, force3D: true}),
    TweenLite.to(_flbottomGroup, 0.5, {scaleY: 1.0, delay: 1.5, force3D: true}),
    TweenLite.to(_flbottomGroup, 0.5, {rotationZ: 5, delay: 1.5, force3D: true}),
    TweenLite.to(_flfoot, 0.5, {rotationZ: -50, delay: 1.5, force3D: true}),
    TweenLite.to(_flfoot, 0.5, {scaleX: 1.0, scaleY: 1.0, delay: 1.5, force3D: true}),

    TweenLite.to(_flleg, 0.5, {x: -10, delay: 1.3, force3D: true}),

    TweenLite.to(_flleg, 0.2, {x: -5, delay: 1.8, ease: Power1.easeIn, force3D: true}),
]); 

var tl2 = new TimelineMax({repeat: -1, delay: 0.7, onReverseComplete: function() {this.seek(tl2.duration())}});

var _blleg = $('.blleg');
var _blbottomGroup = $('.blbottom-group');
var _blfoot = $('.blfoot');

TweenLite.set(_blleg, {rotationZ: 45, x: -5});
TweenLite.set(_blbottomGroup, {rotationZ: 5});
TweenLite.set(_blfoot, {rotationZ: -50});

tl2.add([
    TweenLite.to(_blleg, 1.0, {rotationZ: -45, delay: 0.0, force3D: true}),

    TweenLite.to(_blleg, 0.2, {x: 0, delay: 0.0, ease: Power1.easeOut, force3D: true}),

    TweenLite.to(_blleg, 0.55, {scaleY: 0.8, delay: 0.0, force3D: true}),
    TweenLite.to(_blbottomGroup, 0.55, {scaleY: 0.8, delay: 0.0, force3D: true}),
    TweenLite.to(_blbottomGroup, 0.6, {rotationZ: 20, delay: 0.0, ease: Power3.easeIn, force3D: true}),
    TweenLite.to(_blfoot, 0.55, {scaleY: 1.5, delay: 0.0, force3D: true}),
    TweenLite.to(_blfoot, 0.6, {rotationZ: 10, delay: 0.0, ease: Power2.easeIn, force3D: true}),
    
    TweenLite.to(_blleg, 0.4, {scaleY: 1.0, delay: 0.6, force3D: true}),
    TweenLite.to(_blbottomGroup, 0.4, {scaleY: 0.7, delay: 0.6, force3D: true}),
    TweenLite.to(_blbottomGroup, 0.4, {rotationZ: 50, delay: 0.6, force3D: true}),
    TweenLite.to(_blfoot, 0.2, {rotationZ: 10, delay: 0.6, ease: Linear.easeNone, force3D: true}),
    TweenLite.to(_blfoot, 0.2, {rotationZ: -10, delay: 0.8, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_blfoot, 0.4, {scaleY: 1.5, delay: 0.6, force3D: true}),
    
    TweenLite.to(_blleg, 0.6, {x: 20, delay: 0.7, force3D: true}),

    TweenLite.to(_blleg, 0.5, {rotationZ: 0, delay: 1.0, ease: Power1.easeIn, force3D: true}),
    TweenLite.to(_blleg, 0.5, {scaleY: 0.8, delay: 1.0, force3D: true}),
    TweenLite.to(_blbottomGroup, 0.5, {scaleY: 0.5, delay: 1.0, force3D: true}),
    TweenLite.to(_blfoot, 0.5, {scaleX: 1.8, scaleY: 1.7, delay: 1.0, ease: Power1.easeIn, force3D: true}),
    TweenLite.to(_blbottomGroup, 0.5, {rotationZ: 40, delay: 1.0, force3D: true}),
    TweenLite.to(_blfoot, 0.5, {rotationZ: -70, delay: 1.0, force3D: true}),

    TweenLite.to(_blleg, 0.5, {rotationZ: 45, delay: 1.5, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_blleg, 0.5, {scaleY: 1.0, delay: 1.5, force3D: true}),
    TweenLite.to(_blbottomGroup, 0.5, {scaleY: 1.0, delay: 1.5, force3D: true}),
    TweenLite.to(_blbottomGroup, 0.5, {rotationZ: 5, delay: 1.5, force3D: true}),
    TweenLite.to(_blfoot, 0.5, {rotationZ: -50, delay: 1.5, force3D: true}),
    TweenLite.to(_blfoot, 0.5, {scaleX: 1.0, scaleY: 1.0, delay: 1.5, force3D: true}),

    TweenLite.to(_blleg, 0.5, {x: -10, delay: 1.3, force3D: true}),

    TweenLite.to(_blleg, 0.2, {x: -5, delay: 1.8, ease: Power1.easeIn, force3D: true}),
]);



var tl3 = new TimelineMax({repeat: -1, delay: 1.0, onReverseComplete: function() {this.seek(tl3.duration())}});

var _frleg = $('.frleg');
var _frfoot = $('.frfoot');

TweenLite.set(_frleg, {rotationZ: 35, x: -40});
TweenLite.set(_frfoot, {rotationZ: -35});

tl3.add([
    TweenLite.to(_frleg, 0.9, {rotationZ: -35, delay: 0.0, force3D: true}),
    TweenLite.to(_frleg, 1.2, {x: 40, delay: 0.0, ease: Power1.easeOut, force3D: true}),

    TweenLite.to(_frfoot, 0.9, {rotationZ: 35, delay: 0.0, force3D: true}),
    
    TweenLite.to(_frleg, 0.4, {y: -15, delay: 0.0, ease: Power1.easeIn, force3D: true}),
    TweenLite.to(_frleg, 0.4, {y: 0, delay: 0.5, ease: Power1.easeOut, force3D: true}),

    TweenLite.to(_frleg, 1.1, {rotationZ: 35, delay: 0.9, force3D: true}),
    TweenLite.to(_frleg, 0.6, {x: -50, delay: 1.2, force3D: true}),
    
    TweenLite.to(_frfoot, 0.5, {rotationZ: -50, delay: 0.9, force3D: true}),
    TweenLite.to(_frfoot, 0.3, {rotationZ: -35, delay: 1.7, force3D: true}),

    TweenLite.to(_frleg, 0.6, {y: -40, delay: 0.9, force3D: true}),
    TweenLite.to(_frleg, 0.5, {y: 0, delay: 1.5, force3D: true}),
    
    TweenLite.to(_frleg, 0.2, {x: -40, delay: 1.8, ease: Power1.easeIn, force3D: true}),
]);


var tl4 = new TimelineMax({repeat: -1, delay: 1.7, onReverseComplete: function() {this.seek(tl4.duration())}});

var _brleg = $('.brleg');
var _brfoot = $('.brfoot');

TweenLite.set(_brleg, {rotationZ: 35, x: -40});
TweenLite.set(_brfoot, {rotationZ: -35});

tl4.add([
    TweenLite.to(_brleg, 0.9, {rotationZ: -35, delay: 0.0, force3D: true}),
    TweenLite.to(_brleg, 1.2, {x: 40, delay: 0.0, ease: Power1.easeOut, force3D: true}),

    TweenLite.to(_brfoot, 0.9, {rotationZ: 35, delay: 0.0, force3D: true}),
    
    TweenLite.to(_brleg, 0.4, {y: -15, delay: 0.0, ease: Power1.easeIn, force3D: true}),
    TweenLite.to(_brleg, 0.4, {y: 0, delay: 0.5, ease: Power1.easeOut, force3D: true}),

    TweenLite.to(_brleg, 1.1, {rotationZ: 35, delay: 0.9, force3D: true}),
    TweenLite.to(_brleg, 0.6, {x: -50, delay: 1.2, force3D: true}),
    
    TweenLite.to(_brfoot, 0.5, {rotationZ: -50, delay: 0.9, force3D: true}),
    TweenLite.to(_brfoot, 0.3, {rotationZ: -35, delay: 1.7, force3D: true}),

    TweenLite.to(_brleg, 0.6, {y: -40, delay: 0.9, force3D: true}),
    TweenLite.to(_brleg, 0.5, {y: 0, delay: 1.5, force3D: true}),
    
    TweenLite.to(_brleg, 0.2, {x: -40, delay: 1.8, ease: Power1.easeIn, force3D: true}),
]);


var tl5 = new TimelineMax({repeat: -1, delay: 0.0, onReverseComplete: function() {this.seek(tl5.duration())}});
var _castle = $('.castle');
TweenLite.set(_castle, {rotationZ: 9});
tl5.add([
    TweenLite.to(_castle, 1.0, {rotationZ: 7, delay: 0.0, force3D: true}),
    TweenLite.to(_castle, 1.0, {rotationZ: 9, delay: 1.0, force3D: true}),
    
    TweenLite.to(_castle, 0.5, {x: '+=' + 2 * scale, y: '-=' + 4 * scale, delay: 0.0, force3D: true}),
    TweenLite.to(_castle, 0.5, {x: '-=' + 4 * scale, y: '+=' + 4 * scale, delay: 0.5, force3D: true}),
    TweenLite.to(_castle, 0.5, {x: '+=' + 4 * scale, y: '-=' + 5 * scale, delay: 1.0, force3D: true}),
    TweenLite.to(_castle, 0.5, {x: '-=' + 2 * scale, y: '+=' + 5 * scale, delay: 1.5, force3D: true}),
]);

var tl6 = new TimelineMax({repeat: -1, delay: 0.2});
var _mound = $('.mound-group');
TweenLite.set(_mound, {rotationZ: 2});
tl6.add([
    TweenLite.to(_mound, 1.0, {rotationZ: -1, delay: 0.0, force3D: true}),
    TweenLite.to(_mound, 1.0, {rotationZ: 2, delay: 1.0, force3D: true}),
]);

var tl7 = new TimelineMax({repeat: -1, delay: 0.8});
var _wing = $('.wing');
TweenLite.set(_wing, {rotationZ: 2});
tl7.add([
    TweenLite.to(_wing, 1.0, {rotationZ: -1, x: -5, delay: 0.0, force3D: true}),
    TweenLite.to(_wing, 1.0, {rotationZ: 2, x: 0, delay: 1.0, force3D: true}),
]);

var tl8 = new TimelineMax({repeat: -1, delay: 0.0});
var _chimney1 = $('.chimney1');
TweenLite.set(_chimney1, {rotationZ: -10});
tl8.add([
    TweenLite.to(_chimney1, 1.5, {rotationZ: 5, delay: 0.0, force3D: true}),
    
    TweenLite.to(_chimney1, 1.5, {rotationZ: -10, delay: 1.5, force3D: true}),

    TweenLite.to(_chimney1, 0.5, {y: 5, x: 0, delay: 0.1, force3D: true}),
    TweenLite.to(_chimney1, 0.1, {y: -15, x: 4, delay: 0.6, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_chimney1, 0.9, {y: 0, x: 0, delay: 0.7, force3D: true}),

    TweenLite.to(_chimney1, 0.5, {y: 5, x: 0, delay: 1.6, force3D: true}),
    TweenLite.to(_chimney1, 0.1, {y: -15, x: 4, delay: 2.1, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_chimney1, 0.5, {y: 0, x: 0, delay: 2.2, force3D: true}),
]);

var tl9 = new TimelineMax({repeat: -1, delay: 0.5});
var _chimney2 = $('.chimney2');
TweenLite.set(_chimney2, {rotationZ: -10});
tl9.add([
    TweenLite.to(_chimney2, 1.5, {rotationZ: 5, delay: 0.0, force3D: true}),
    
    TweenLite.to(_chimney2, 1.5, {rotationZ: -10, delay: 1.5, force3D: true}),

    TweenLite.to(_chimney2, 0.5, {y: 5, x: 0, delay: 0.1, force3D: true}),
    TweenLite.to(_chimney2, 0.1, {y: -15, x: 4, delay: 0.6, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_chimney2, 0.9, {y: 0, x: 0, delay: 0.7, force3D: true}),

    TweenLite.to(_chimney2, 0.5, {y: 5, x: 0, delay: 1.6, force3D: true}),
    TweenLite.to(_chimney2, 0.1, {y: -15, x: 4, delay: 2.1, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_chimney2, 0.5, {y: 0, x: 0, delay: 2.2, force3D: true}),
]);

var tl10 = new TimelineMax({repeat: -1, delay: 1.1});
var _chimney3 = $('.chimney3');
TweenLite.set(_chimney3, {rotationZ: -10});
tl10.add([
    TweenLite.to(_chimney3, 1.5, {rotationZ: 5, delay: 0.0, force3D: true}),
    
    TweenLite.to(_chimney3, 1.5, {rotationZ: -10, delay: 1.5, force3D: true}),

    TweenLite.to(_chimney3, 0.5, {y: 5, x: 0, delay: 0.1, force3D: true}),
    TweenLite.to(_chimney3, 0.1, {y: -15, x: 4, delay: 0.6, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_chimney3, 0.9, {y: 0, x: 0, delay: 0.7, force3D: true}),

    TweenLite.to(_chimney3, 0.5, {y: 5, x: 0, delay: 1.6, force3D: true}),
    TweenLite.to(_chimney3, 0.1, {y: -15, x: 4, delay: 2.1, ease: Power1.easeOut, force3D: true}),
    TweenLite.to(_chimney3, 0.5, {y: 0, x: 0, delay: 2.2, force3D: true}),
]);

var tl11 = new TimelineMax({repeat: -1, delay: 0.5});
var _houses = $('.houses-group');
var _point1 = $('.point1');
var _point2 = $('.point2');
TweenLite.set(_houses, {rotationZ: 2, x: -4});
TweenLite.set(_point1, {rotationZ: 2, x: -2});
tl11.add([
    TweenLite.to(_houses, 1.0, {rotationZ: -1, y: 5, x: 0, delay: 0.0, force3D: true}),
    TweenLite.to(_houses, 1.0, {rotationZ: 2, y: 0, x: -4, delay: 1.0, force3D: true}),

    TweenLite.to(_point1, 1.0, {rotationZ: -10, y: 2, x: 0, delay: 0.0, force3D: true}),
    TweenLite.to(_point1, 1.0, {rotationZ: 2, y: 0, x: -2, delay: 1.0, force3D: true}),

    TweenLite.to(_point2, 1.0, {rotationZ: -5, y: 5, x: 2, delay: 0.0, force3D: true}),
    TweenLite.to(_point2, 1.0, {rotationZ: 0, y: 0, x: 0, delay: 1.0, force3D: true}),
]);

var tl12 = new TimelineMax({repeat: -1, delay: 0.45});
var _point4 = $('.point4');
var _point5 = $('.point5');
var _point6 = $('.point6');
tl12.add([
    TweenLite.to(_point6, 0.3, {y: 3, delay: 0.0, force3D: true}),
    TweenLite.to(_point6, 0.1, {y: -10, x: 4, delay: 0.3, force3D: true}),
    TweenLite.to(_point6, 0.9, {y: 0, x: 0, delay: 0.4, force3D: true}),

    TweenLite.to(_point5, 0.3, {y: 3, delay: 0.2, force3D: true}),
    TweenLite.to(_point5, 0.1, {y: -7, x: 3, delay: 0.5, force3D: true}),
    TweenLite.to(_point5, 0.7, {y: 0, x: 0, delay: 0.6, force3D: true}),

    TweenLite.to(_point4, 0.3, {y: 3, delay: 0.4, force3D: true}),
    TweenLite.to(_point4, 0.1, {y: -10, x: 4, delay: 0.7, force3D: true}),
    TweenLite.to(_point4, 0.7, {y: 0, x: 0, delay: 0.8, force3D: true}),
]);

var tl13 = new TimelineMax({repeat: -1, delay: 1.4});
var _treehouse = $('.treehouse');
TweenLite.set(_treehouse, {rotationZ: -5, y: 20, x: 4});
tl13.add([
    TweenLite.to(_treehouse, 1.0, {rotationZ: 10, delay: 0.0, force3D: true}),
    TweenLite.to(_treehouse, 1.0, {rotationZ: -5, delay: 1.0, force3D: true}),
    TweenLite.to(_treehouse, 1.0, {rotationZ: 10, delay: 2.0, force3D: true}),
    TweenLite.to(_treehouse, 1.0, {rotationZ: -5, delay: 3.0, force3D: true}),
    
    TweenLite.to(_treehouse, 0.4, {y: -5, x: -2, delay: 0.2, force3D: true}),
    TweenLite.to(_treehouse, 3.2, {y: 20, x: 4, delay: 0.8, force3D: true}),
]);

var tl14 = new TimelineMax({repeat: -1, delay: 0.65});
var _wind = $('.wind');
var _antenna = $('.antenna');
var _cannon = $('.cannon');
var _tele = $('.tele');
var _knob = $('.knob');
TweenLite.set(_antenna, {rotationZ: 10, x: 0});
TweenLite.set(_wind, {rotationZ: -10, x: 0});
TweenLite.set(_knob, {rotationZ: -20, x: 0});
tl14.add([
    TweenLite.to(_antenna, 1.0, {rotationZ: -5, x: 0, delay: 0.0, force3D: true}),
    TweenLite.to(_antenna, 1.0, {rotationZ: 10, x: 5, delay: 1.0, force3D: true}),
    TweenLite.to(_antenna, 1.0, {rotationZ: -10, x: -5, delay: 2.0, force3D: true}),
    TweenLite.to(_antenna, 1.0, {rotationZ: 10, x: 0, delay: 3.0, force3D: true}),

    TweenLite.to(_wind, 1.1, {rotationZ: 5, delay: 0.0, force3D: true}),
    TweenLite.to(_wind, 1.0, {rotationZ: -15, delay: 1.1, force3D: true}),
    TweenLite.to(_wind, 1.0, {rotationZ: 10, delay: 2.1, force3D: true}),
    TweenLite.to(_wind, 0.9, {rotationZ: -10, delay: 3.1, force3D: true}),

    TweenLite.to(_knob, 0.2, {rotationZ: 50, delay: 0.0, force3D: true}),
    TweenLite.to(_knob, 0.2, {rotationZ: -20, delay: 0.3, force3D: true}),
    TweenLite.to(_knob, 0.2, {rotationZ: 45, delay: 0.7, force3D: true}),
    TweenLite.to(_knob, 0.2, {rotationZ: -25, delay: 1.0, force3D: true}),
    TweenLite.to(_knob, 0.2, {rotationZ: 30, delay: 1.5, force3D: true}),
    TweenLite.to(_knob, 0.2, {rotationZ: 0, delay: 1.9, force3D: true}),
    TweenLite.to(_knob, 0.2, {rotationZ: -20, delay: 2.2, force3D: true}),
    TweenLite.to(_knob, 0.3, {rotationZ: 60, delay: 2.6, force3D: true}),
    TweenLite.to(_knob, 0.2, {rotationZ: -10, delay: 3.0, force3D: true}),
    TweenLite.to(_knob, 0.2, {rotationZ: 40, delay: 3.4, force3D: true}),
    TweenLite.to(_knob, 0.2, {rotationZ: -20, delay: 3.7, force3D: true}),
    
    TweenLite.to(_tele, 1.0, {rotationZ: -3, delay: 0.0, force3D: true}),
    TweenLite.to(_tele, 1.0, {rotationZ: 2, delay: 1.0, force3D: true}),
    TweenLite.to(_tele, 1.0, {rotationZ: -3, delay: 2.0, force3D: true}),
    TweenLite.to(_tele, 1.0, {rotationZ: 0, delay: 3.0, force3D: true}),

    TweenLite.to(_tele, 0.25, {x: 25, y: 4, delay: 0.6, force3D: true}),
    TweenLite.to(_tele, 2.5, {x: 0, y: 0, delay: 0.9, force3D: true}),

    TweenLite.to(_cannon, 0.9, {rotationZ: -7, delay: 0.0, force3D: true}),
    TweenLite.to(_cannon, 0.9, {rotationZ: 2, delay: 0.9, force3D: true}),
    TweenLite.to(_cannon, 1.1, {rotationZ: -5, delay: 1.8, force3D: true}),
    TweenLite.to(_cannon, 1.1, {rotationZ: 0, delay: 2.9, force3D: true}),

    TweenLite.to(_cannon, 0.25, {x: 30, y: 4, delay: 0.85, force3D: true}),
    TweenLite.to(_cannon, 2.6, {x: 0, y: 0, delay: 1.4, force3D: true}),
]);