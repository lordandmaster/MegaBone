/**
 * @require View.js
 * @require Util.js
 */
var CollectionView = View.extend({

	_views: [],
	_sortby: null,
	ModelView: null,

	initialize: function (options) {
		View.prototype.initialize.apply(this, arguments);
		this.ModelView = options.ModelView || this.ModelView;
		this._filter = options.filter;
		this.setCollection(options.collection);
		this.setSort(options._sortby);
	},
	
	setCollection: function (collection) {
		this.stopListening(this.collection);
		
		this.listenTo(collection, 'reset', this._reset);
		this.listenTo(collection, 'add', this._add);
		this.listenTo(collection, 'remove', this._remove);
		
		this._reset(collection, {});
		this.collection = collection;
		return this;
	},
	
	setSort: function (sort_by) {
		if ( sort_by === this.sort_by ) {
			return this;
		}
		
		if ( !sort_by ) {
			this._sortby = null;
		} else if ( typeof sort_by === 'function' ) {
			this._sortby = sort_by;
		} else {
			var order = 1;
			
			if ( sort_by[0] === '-' ) {
				sort_by = sort_by.substr(1);
				order = -1;
			}
			
			this._sortby = function (v1, v2) {
				return (v1.model.get(sort_by) > v2.model.get(sort_by))
					? order : -order;
			};
		}
		
		return this.sort();
	},
	
	sort: function() {
		if ( !this._sortby ) {
			return this;
		}
		
		this._views.sort(this._sortby);
		
		if ( !this._rendered || !this.keepDisplayUpdated() ) {
			return this;
		}
		
		this._tmp = this._tmp || $('<div></div>');
		this.$el.replaceWith(this._tmp);
		
		for ( var ii = 0; ii < this._views.length; ii++ ) {
			this.$el.append( this._views[ii].$el );
		}
		
		this._tmp.replaceWith(this.$el);
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
	
	_getViewIndexForModel: function (model) {
		for ( var ii = 0; ii < this._views.length; ii++ ) {
			if ( this._views[ii].model === model ) {
				return ii;
			}
		}
		
		return -1;
	},
	
	_reset: function (collection, options) {
		var views = [];
		var self = this;
		
		collection.each(function (model) {
			if ( !Util.doesModelMatch(model, self._filter) ) {
				return;
			}
			var view = new self.ModelView({ model: model });
			views[views.length] = view;
		});
		
		this._views = views;
		this.sort();
		
		if ( this._rendered && this.keepDisplayUpdated() ) {
			this.render();
		}
	},
	
	_add: function (model, collection, options) {
		var view = new this.ModelView({ model: model });
		if ( this._rendered && this.keepDisplayUpdated() ) {
			this.$el.append( view.render().$el );
		}
		
		this._views[this._views.length] = view;
		// TODO: Find proper index wrt sort order
	},
	
	_remove: function (model, collection, options) {
		var index = this._getViewIndexForModel(model);
		if ( this._rendered && this.keepDisplayUpdated() ) {
			this._views[index].$el.remove();
		}
		
		this._views.splice(index, 1);
	}
	
}); // end CollectionView