var addListener = (function() {
	if (window.addEventListener) {
		return function(element, event, func) {
			element.addEventListener(event, func, false);
		};
	} else if (window.attachEvent) {
		return function (element, event, func) {
			element.attachEvent("on" + event, func);
		};
	} else {
		return function (element, event, func) {
			element["on" + element] = func;
		};
	}
})();

var getEventTarget = function(event) {
	var target;
	
	if (!event) {
		event = window.event;
	}
	
	if (event.target) {	// W3C
		target = event.target;
	} else if (event.srcElement) {	// IE
		target = event.target;
	}
	
	// Safari
	if (3 == target.nodeType) target = target.parentNode;
	
	return target;
};