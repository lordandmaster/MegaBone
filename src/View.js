var View = Backbone.View.extend({

	template: null,
	
	_rendered: false,
	_keep_display_updated: true,
	
	initialize: function (options) {
		var self = this.constructor;
		this.template = options.template || this.template
			|| self.default_template;
		
		if ( this.model ) {
			this.listenTo(this.model, 'change', this._onChange);
		}
	},
	
	getTemplateData: function() {
		return (this.model) ? this.model.attributes : {};
	},
	
	render: function() {
		var $el_new = this._renderNewEl();
		var $el_old = this.$el;
		
		this.setElement($el_new);
		
		if ( $el_old && $el_old.parent().length ) {
			$el_old.replaceWith( $el_new );
		}
		
		this._rendered = true;
		return this;
	},
	
	keepDisplayUpdated: function (new_value) {
		if ( new_value !== undefined ) {
			this._keep_display_updated = new_value;
		}
		return this._keep_display_updated;
	},
	
	_renderNewEl: function() {
		var template_html = this.template(this.getTemplateData());
		return $($.trim(template_html));
	},
	
	_onChange: function (model) {
		if ( this._rendered && this.keepDisplayUpdated() ) {
			this.render();
		}
	}

}, {

	default_template: function(data) {
		return '<div>' + JSON.stringify(data) + '</div>';
	}

}); // end View