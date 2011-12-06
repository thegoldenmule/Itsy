/**
 * Default particle plugins.
 * 
 * @author thegoldenmule
 * MIT license.
 */
if (!thegoldenmule) var thegoldenmule = {};
if (!thegoldenmule.particle) thegoldenmule.particle = {};

/**
 * Position plugin.
 * 
 * Give it x, y, and a radius, and it will provide a random
 * position within the bounding circle.
 */
thegoldenmule.particle.Position = function(xval, yval, radius) {
	this.x = xval;
	this.y = yval;
	this.radius = radius;
};

thegoldenmule.particle.Position.prototype = {
	initialize:
		function(emitter, particle) {
			particle.x = this.x + (Math.random() - 0.5) * Math.random() * this.radius;
			particle.y = this.y + (Math.random() - 0.5) * Math.random() * this.radius;
		}
};

/**
 * Velocity plugin.
 * 
 * Give it an angle range and a magnitude range and it will
 * generate velocities within the ranges.
 */
thegoldenmule.particle.Velocity = function(minAngle, maxAngle, minMagnitude, maxMagnitude) {
	this.minAngle = minAngle;
	this.maxAngle = maxAngle;
	this.minMagnitude = minMagnitude;
	this.maxMagnitude = maxMagnitude;
};

thegoldenmule.particle.Velocity.prototype = {
	initialize:
		function(emitter, particle) {
			// pick a random angle
			var angle = (this.minAngle + Math.random() * (this.maxAngle - this.minAngle));
			var magnitude = (this.minMagnitude + Math.random() * (this.maxMagnitude - this.minMagnitude));
			
			particle.vx = Math.sin(angle) * magnitude;
			particle.vy = Math.cos(angle) * magnitude;
		},
	update:
		function(emitter, particle) {
			particle.x += particle.vx;
			particle.y += particle.vy;
		}
};

/**
 * Acceleration plugin.
 * 
 * Generates constant acceleration within the range
 * provided.
 */
thegoldenmule.particle.Acceleration = function(xval, yval) {
	this.x = xval;
	this.y = yval;
};

thegoldenmule.particle.Acceleration.prototype = {
	update:
		function(emitter, particle) {
			particle.vx += this.x;
			particle.vy += this.y;
		}
};

/**
 * Lifetime plugin.
 * 
 * Generates a particle lifetime within a range.
 */
thegoldenmule.particle.Lifetime = function(min, max) {
	this.min = min;
	this.max = max;
};

thegoldenmule.particle.Lifetime.prototype = {
	initialize:
		function(emitter, particle) {
			particle.lifetime = (this.min + Math.random() * (this.max - this.min));
		}
};

/**
 * ColorTweenRenderer plugin.
 * 
 * This renders each particle as a circle on a 2d drawing context. Call
 * 
 * addColor(time, red, green, blue, alpha)
 * 
 * with several colors and it will linearly tween between the colors, using the
 * values of t assigned to each color.
 */
thegoldenmule.particle.ColorTweenRenderer = function(context) {
	this.context = context;
	this.colors = [];
	this.size = 10;
};

thegoldenmule.particle.ColorTweenRenderer.prototype = (function() {
	var TWOPI = 2 * Math.PI;
	
	function getDefaultColor(time) {
		return {
			color:{
				r:0, g:0, b:0, a:1
			},
			time:time
		};
	}
	
	function getCurrentColor(time, colors) {
		if (colors) {
			for (var i = 0, len = colors.length; i < len; i++) {
				if (colors[i].time > time) {
					if (0 == i) {
						return [colors[i], colors[i]];
					} else {
						return [colors[i - 1], colors[i]]
					}
				}
			}
		}
		
		return [getDefaultColor(0), getDefaultColor(1)];
	}
	
	return {
		withSize:
			function(size) {
				this.size = size;
				
				return this;
			},
		addColor:
			function(t, red, green, blue, alpha) {
				this.colors.push({
					color: {
						r:red, g:green, b:blue, a:alpha
					},
					time:t || 0
				})
				
				return this;
			},
		removeColors:
			function() {
				this.colors = [];
				
				return this;
			},
		render:
			function(emitter, particle) {
				// find colors to tween be*tween* 
				var tweenColors = getCurrentColor(particle.alive / particle.lifetime, this.colors),
					fromColor  = tweenColors[0],
					toColor = tweenColors[1];
				
				// find t_a
				var ta = (particle.alive - (fromColor.time * particle.lifetime)) / ((toColor.time - fromColor.time) * particle.lifetime);
				
				function value(property, t) {
					var delta = toColor.color[property] - fromColor.color[property];
					return fromColor.color[property] + t * delta;
				}
				
				var fillStyle = "rgba("
					+ ~~value("r", ta) + ", "
					+ ~~value("g", ta) + ", "
					+ ~~value("b", ta) + ", "
					+ value("a", ta) + ")";
				
				this.context.fillStyle = fillStyle;
				this.context.beginPath();
				this.context.arc(particle.x, particle.y, this.size, 0, TWOPI);
				this.context.closePath();
				this.context.fill();
			}
	};
})();

/**
 * EmissionRateFade plugin.
 * 
 * This tweens the emitter's emission rate from start to finish in time.
 */
thegoldenmule.particle.EmissionRateFade = function(start, finish, time) {
	this.start = start;
	this.finish = finish;
	this.time = time;
	
	this.elapsed = 0;
};

thegoldenmule.particle.EmissionRateFade.prototype = {
	updateGlobal:
		function(emitter, particle, dt) {
			this.elapsed += dt;
			
			if (this.elapsed >= this.time) {
				emitter.emissionRate = this.finish;
			} else {
				emitter.emissionRate = ~~(this.start + (this.elapsed / this.time) * (this.finish - this.start));
			}
		}
};

/**
 * BasicRenderer plugin.
 * 
 * This plugin simply renders each particle as a circle with the rgba values
 * passed in.
 */
thegoldenmule.particle.BasicRenderer = function(context, r, g, b, a, size) {
	this.r = r ? r : 0;
	this.g = g ? g : 0;
	this.b = b ? b : 0;
	this.a = a ? a : 1;
	this.size = size ? size : 1;
	this.context = context;
}

thegoldenmule.particle.BasicRenderer.prototype = (function(){
	var TWOPI = 2 * Math.PI;
	
	return {
		update:
			function(emitter, particle) {
				this.context.fillStyle = "rgba("
					+ ~~this.r + ", "
					+ ~~this.g + ", "
					+ ~~this.b + ", "
					+ this.a + ")";
				this.context.beginPath();
				this.context.arc(particle.x, particle.y, this.size, 0, TWOPI);
				this.context.closePath();
				this.context.fill();
			}
	};
})();