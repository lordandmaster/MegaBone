var View = Backbone.View.extend({

	template: null,
	
	_rendered: false,
	_keep_display_updated: true,
	
	initialize: function (options) {
		var self = this.constructor;
		this.template = options.template || self.default_template;
		this.model.on('change', this._onChange.bind(this));
	},
	
	getTemplateData: function() {
		return this.model.attributes;
	},
	
	render: function() {
		var template_html = this.template(this.getTemplateData());
		var $el_new = $($.trim(template_html));
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
	
	_onChange: function (model) {
		if ( this._rendered && this.keepDisplayUpdated() ) {
			this.render();
		}
	}

}, {

	default_template: function(data) {
		return '<div>' + JSON.stringify(data) + '</div>';
	}

});