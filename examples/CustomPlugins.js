thegoldenmule.particle.FollowMouse = function(radius, emissionRate) {
	this.radius = radius;
	this.emissionRate = emissionRate;
	
	var that = this;
	$(document)
		.mousedown(function() {
			that.mouseDown = true;
		})
		.mouseup(function() {
			that.mouseDown = false;
		})
		.mousemove(function(event) {
			that.mouseEvent = event;
		});
};

thegoldenmule.particle.FollowMouse.prototype = (function() {
	function mouseX(evt) {
		if (evt.pageX) {
			return evt.pageX;
		} else if (evt.clientX) {
			return evt.clientX + (document.documentElement.scrollLeft ?
				document.documentElement.scrollLeft :
				document.body.scrollLeft);
		}
		
		return null;
	}
	function mouseY(evt) {
		if (evt.pageY) {
			return evt.pageY;
		} else if (evt.clientY) {
			return evt.clientY + (document.documentElement.scrollTop ?
				document.documentElement.scrollTop :
				document.body.scrollTop);
		}
		
		return null;
	}
	
	function rand() {
		return 2 * Math.random() - 1;
	}
	
	return {
		updateGlobal:
			function(emitter) {
				if (this.mouseDown) {
					emitter.emissionRate = this.emissionRate;
				} else {
					emitter.emissionRate = 0;
				}
			},
		initialize:
			function(emitter, particle) {
				particle.x = mouseX(this.mouseEvent) + rand() * this.radius - emitter.x;
				particle.y = mouseY(this.mouseEvent) + rand() * this.radius - emitter.y;
			}
	};
})();