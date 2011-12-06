/**
 * A quick demo showcasing some of the particle system's capabilities.
 */
var Demo = function() {
	var ParticleEmitter = thegoldenmule.particle.ParticleEmitter;
	
	var _that = this,
		_context;
	
	_that.init = function() {
		var canvas = document.createElement("canvas");
		canvas.width = 400;
		canvas.height = 600;
		document.getElementById("graphics").appendChild(canvas);
		context = canvas.getContext("2d");
		
		var accelerationPlugin = new thegoldenmule.particle.Acceleration(0, -0.09),
			velocityPlugin = new thegoldenmule.particle.Velocity(3 * Math.PI / 4, 5 * Math.PI / 4, 1, 1),
			positionPlugin = new thegoldenmule.particle.Position(200, 300, 10),
			lifetimePlugin = new thegoldenmule.particle.Lifetime(1000, 2000),
			rendererPlugin = new thegoldenmule.particle.ColorTweenRenderer(context)
					.addColor(0, 255, 255, 200,0.5)
					.addColor(0.3, 255, 255, 50, 0.3)
					.addColor(1, 255, 70, 0, 0.2);
		
		var emitter = new ParticleEmitter([
			accelerationPlugin,
			velocityPlugin,
			positionPlugin,
			lifetimePlugin,
			rendererPlugin
		]);
		emitter.lifetime = 2000;
		emitter.emissionRate = 30;
		
		var examples = {
			example1:function() {
				
			},
			example2:function() {
				rendererPlugin
					.removeColors()
					.addColor(0, Math.random() * 255, Math.random() * 255, 100, 0.3)
					.addColor(0.1, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.addColor(0.2, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.addColor(0.3, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.addColor(0.4, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.addColor(0.5, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.addColor(0.6, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.addColor(0.7, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.addColor(0.8, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.addColor(0.9, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.addColor(1, Math.random() * 255, 100, Math.random() * 255, 0.5)
					.size = 50;
				emitter.removePlugin(accelerationPlugin);
				
				velocityPlugin.minRange = 0;
				velocityPlugin.maxRange = 2 * Math.PI;
				velocityPlugin.minMagnitude = 0;
				velocityPlugin.maxMagnitude = 0;
				
				lifetimePlugin.min = 1000;
				emitter.lifetime = lifetimePlugin.max = 3000;
				emitter.emissionRate = 0.3;
				
				positionPlugin.radius = 500;
				
			},
			example3:function() {
				
			}
		};
		
		$("a").click(function(event) {
			var id = getEventTarget(event).id;
			
			examples[id]();
		});
		
		$("#slider_emissionRate").slider({
			min:1,
			max:200,
			value:emitter.emissionRate,
			slide:function(event, ui) {
				emitter.emissionRate = ui.value;
			}
		});
		
		$("#slider_lifetime").slider({
			min:10,
			max:5000,
			value:emitter.lifetime,
			slide:function(event, ui) {
				emitter.lifetime = ui.value;
			}
		});
		
		$("#slider_size").slider({
			min:1,
			max:10,
			value:rendererPlugin.size,
			slide:function(event, ui) {
				rendererPlugin.size = ui.value;
			}
		});
		
		$("#slider_velocity_min").slider({
			min:0,
			max:2 * Math.PI,
			step:0.1,
			value:velocityPlugin.minAngle,
			slide:function(event, ui) {
				if (velocityPlugin.maxAngle < ui.value) {
					velocityPlugin.maxAngle = ui.value;
					$(vmax).slider("value", ui.value);
				}
				
				velocityPlugin.minAngle = ui.value;
			}
		});
		
		var vmax = $("#slider_velocity_max").slider({
			min:0,
			max:2 * Math.PI,
			step:0.1,
			value:velocityPlugin.maxAngle,
			slide:function(event, ui) {
				velocityPlugin.maxAngle = ui.value;
			}
		});
		
		$("#slider_velocity_mmin").slider({
			min:0,
			max:10,
			step:0.1,
			value:velocityPlugin.minMagnitude,
			slide:function(event, ui) {
				if (velocityPlugin.maxMagnitude < ui.value) {
					velocityPlugin.maxMagnitude = ui.value;
					$(vmmax).slider("value", ui.value);
				}
				
				velocityPlugin.minMagnitude = ui.value;
			}
		});
		
		var vmmax = $("#slider_velocity_mmax").slider({
			min:0,
			max:10,
			step:0.1,
			value:velocityPlugin.maxMagnitude,
			slide:function(event, ui) {
				velocityPlugin.maxMagnitude = ui.value;
			}
		});
		
		$("#slider_acceleration_x").slider({
			min:-1,
			max:1,
			step:0.01,
			value:accelerationPlugin.x,
			slide:function(event, ui) {
				accelerationPlugin.x = ui.value;
			}
		});
		
		$("#slider_acceleration_y").slider({
			min:-1,
			max:1,
			step:0.01,
			value:accelerationPlugin.y,
			slide:function(event, ui) {
				accelerationPlugin.y = ui.value;
			}
		});
		
		var time = new GameTime();
		$(time).bind("tick", function (gameTime) {
			context.clearRect(0, 0, 800, 600);
			
			emitter.update(time.step);
		});
		time.start();
	};
};