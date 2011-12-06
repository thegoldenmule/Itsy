/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			window.setTimeout( callback, 1000 / 60 );
		};
	})();
}

function GameTime() {
	// private
	var _that = this,
		_jQueryThat = jQuery(_that),
		_ticking = false,
		_time = -1,
		_fps = -1;
	
	_that.step = -1;
	
	_that.getFPS = function() {
		return _fps;
	};
	
	function tick() {
		if (!_ticking) return;
		
		var now = new Date().getTime(),
			delta;
		
		if (-1 != _time) {
			delta = now - _time;
		}
		_time = now;
		
		// update fps
		_fps = 1000 / delta;
		_that.step = delta;
		
		// trigger
		_jQueryThat.trigger('tick', _that);
		
		window.requestAnimationFrame(tick);
	}
	
	// privaleged
	_that.start = function() {
		if (_ticking) return false;
		
		_ticking = true;
		
		tick();
	};
	
	// privaleged
	_that.stop = function() {
		_ticking = false;
	};
	
	return _that;
}