/**
 * Itsy: A tiny particle system.
 * 
 * @author thegoldenmule
 * MIT license.
 */
if (!thegoldenmule) var thegoldenmule = {};
if (!thegoldenmule.particle) thegoldenmule.particle = {};

thegoldenmule.particle.ParticleEmitter = function (plugins) {
	plugins = plugins ? plugins : [];
	
	var Particle = thegoldenmule.particle.Particle;
	
	var that = this;
	that.emissionRate = 50;
	that.x = 200;
	that.y = 200;
	that.particles = [];
	that.maxParticles = 10000;
	that.lifetime = 1000;
	
	var helper = 0;
	
	function applyPlugins(particle, plugins, method, dt) {
		for (var j = 0, len = plugins.length; j < len; j++) {
			var plugin = plugins[j];
			if ("function" === typeof plugin[method]) {
				plugin[method](that, particle, dt);
			}
		}
	}
	
	that.addPlugin = function(plugin) {
		plugins.push(plugin);
	};
	
	that.removePlugin = function(plugin) {
		var plugs = [];
		for (var i = 0, len = plugins.length; i < len; i++) {
			if (plugins[i] != plugin) {
				plugs.push(plugins[i]);
			}
		}
		plugins = plugs;
	};
	
	that.update = function(dt) {
		applyPlugins(null, plugins, "updateGlobal", dt);
		
		// add new particles
		var rate = that.emissionRate,
			len = that.particles.length;
		for (var i = 0; i < rate; i++) {
			var particle = new Particle();
			
			// apply plugins
			applyPlugins(particle, plugins, "initialize", dt);
			
			// kick out particles over the max
			if (that.maxParticles == len) {
				that.particles[helper++ % that.maxParticles] = particle;
			} else {
				that.particles.push(particle);
			}
		}
		
		// update particles + remove dead ones
		var particles = [];
		for (i = 0, len = that.particles.length; i < len; i++) {
			var particle = that.particles[i];
			
			// apply plugins
			applyPlugins(particle, plugins, "update", dt);
			
			// update age + prune
			particle.alive += dt;
			if (particle.alive < that.lifetime) {
				// apply plugins
				applyPlugins(particle, plugins, "render", dt);
				particles.push(particle);
			}
		}
		that.particles = particles;
	};
};

thegoldenmule.particle.Particle = function () {
	var that = this;
	that.x = 0;
	that.y = 0;
	that.vx = 0;
	that.vy = 0;
	that.alive = 0;
};