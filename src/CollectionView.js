/**
 * @require View.js
 */
var CollectionView = View.extend({

	_views: [],
	ModelView: null,

	initialize: function (options) {
		View.prototype.initialize.apply(this, arguments);
		this.ModelView = options.ModelView || this.ModelView;
		this.setCollection(options.collection);
	},
	
	setCollection: function (collection) {
		this.collection.off(null, null, this);
		
		collection.on('reset', this._reset, this);
		collection.on('add', this._add, this);
		collection.on('remove', this._remove, this);
		
		this._reset(collection, {});
		this.collection = collection;
		return this;
	},
	
	_renderNewEl: function() {
		var $el, $view_el, ii;
		
		$el = View.prototype._renderNewEl.apply(this, arguments);
		
		for ( ii = 0; ii < this._views.length; ++ii ) {
			$view_el = this._views[ii].render().$el;
			$el.append($view_el);
		}
		
		return $el;
	},
	
	_reset: function (collection, options) {
		var views = [];
		var self = this;
		
		collection.each(function (model) {
			var view = new self.ModelView({ model: model });
			views[views.length] = view;
		});
		
		this._views = views;
		
		if ( this._rendered && this.keepDisplayUpdated() ) {
			this.render();
		}
	},
	
	_add: function (model, collection, options) {
		console.log('add', model);
	},
	
	_remove: function (model, collection, options) {
		console.log('remove', model);
	}
	
}); // end CollectionView