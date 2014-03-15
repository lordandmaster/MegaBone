var View = Backbone.View.extend(function() {

	template: null,
	
	_rendered: false,
	_keep_display_updated: true,
	
	initialize: function() {
		this.model.on('change', this._onChange.bind(this));
	},
	
	getTemplateData: function() {
		return this.model.attributes;
	},
	
	render: function() {
		this._rendered = true;
		
		var $el_new = $($.trim(this.template(this.getTemplateData())));
		var $el_old = this.$el;
		
		this.setElement($el);
		
		if ( $el_old.parent().length ) {
			$el_old.replaceWith( $el_new );
		}
		
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

});