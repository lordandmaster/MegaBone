var Router = Backbone.Router.extend({

	initialize: function (options) {
		var routes = options.routes || {};
		var name, route;
		
		for ( name in routes ) {
			route = options.routes[name];
			this.route(route[0], name, function() {
				var args = arguments;
				requirejs([route[1]], function (controller) {
					controller.apply(self, args);
				});
			});
		}
	}
	
});