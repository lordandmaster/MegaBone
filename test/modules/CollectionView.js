define([], function () {

	function newTask (done, description) {
		return new Backbone.Model({
			done: done,
			description: description
		});
	}
	
	var model_template_called, coll_template_called;
	
	var init = {
		setup: function() {
			model_template_called = 0;
			coll_template_called = 0;
	
			this.assertOrder = function (order, msg) {
				var valid = true;
				var item;
				var expected_count = order.length;
				var items = this.sut.$el.find('span');
				
				items.each(function() {
					item = order.shift();
					if ( this.innerHTML.indexOf(item) < 0 ) {
						valid = false;
						return false;
					}
				});
				
				ok(valid, msg);
				ok(items.length === expected_count, '(all items are present)');
			};
			
			this.tasklist = new Backbone.Collection([
				newTask(false, 'Wash the car'),
				newTask(false, 'Wash the bar'),
				newTask(true, 'Wash the wheel'),
				newTask(true, 'Wash the steel')
			]);
			this.tasklist2 = new Backbone.Collection([
				newTask(false, 'Run around'),
				newTask(true, 'Prance around'),
				newTask(false, 'Walk around'),
				newTask(true, 'Be around'),
				newTask(false, 'Fall around')
			]);
			
			this.View = Backbone.View.extend({
				render: function() {
					model_template_called++;
					var cssclass = this.model.get('done') ? ' class="done"'  : '';
					this.$el.html(
						'<span' + cssclass + '>' + this.model.get('description') + '</span>'
					);
					return this;
				}
			});
			
			this.sut = new CollectionView({
				template: function() { coll_template_called++; return '<div></div>'; },
				collection: this.tasklist,
				ModelView: this.View
			});
		}
	};
	
	return function() {
	
		module('CollectionView', init);
		
		test('When I provide an initial collection', function() {
			equal(this.sut.$el.html(), '', 'nothing is rendered before calling render');
			var $el = this.sut.render().$el;
			equal($el.find('span').length, 4, 'each item is rendered');
			equal($el.find('span').eq(2).text(), 'Wash the wheel', 'items are rendered in the same order');
		});
		
		test('When I change the collection after rendered', function() {
			this.sut.render();
			this.sut.setCollection(this.tasklist2);
			var $el = this.sut.$el;
			
			equal($el.find('span').length, 5, 'each new item is rendered');
			equal($el.text().indexOf('Wash the') < 0, true, 'old items are removed');
			equal($el.find('span').eq(2).text(), 'Walk around', 'new items are in the same order');
			
			this.tasklist.reset([]);
			$el = this.sut.$el;
			equal($el.find('span').length, 5, 'events are unbound from old collection');
		});
		
		test('When I add a new model', function() {
			var container = $('<div></div>');
			container.append( this.sut.render().$el );
			
			this.tasklist.add(newTask(true, 'Test task'));
			ok(container.text().indexOf('Test task') > -1, 'the display is updated');
		});
		
		test('When I remove a model', function() {
			var $el = this.sut.render().$el;
			
			var model = this.tasklist.remove(this.tasklist.models[2]);
			ok($el.text().indexOf(model.attributes.description) < 0, 'the display is updated');
		});
		
		test('When I add/remove several models', function() {
			var $el = this.sut.render().$el;
			var model = this.tasklist.set( this.tasklist2.models );
			
			equal($el.find('span').length, 5, 'the display is updated');
			equal($el.find('span').eq(1).text(), 'Prance around', 'items are in the given order');
		});
		
		test('When I destroy a model', function() {
			this.sut.render();
			var model = this.tasklist.models[1];
			model.destroy();
			
			var $el = this.sut.$el;
			equal($el.text().indexOf(' bar') < 0, true, 'it is not in the display');
		});
		
		test('When I sort by an attribute name', function() {
			this.sut.setSort('description').render();
			this.assertOrder(['bar', 'car', 'steel', 'wheel'], 'items are alphabetical');
			
			this.sut.setSort('-description');
			this.assertOrder(['wheel', 'steel', 'car', 'bar'], 'with negative, items are reversed');
		});
		
		test('When I sort by a custom function', function() {
			this.sut.setSort(function (v1, v2) {
				return (v2.model.get('description').length > v1.model.get('description').length)
					? 1 : -1;
			}).render();
			
			this.assertOrder(['wheel', 'steel', 'car', 'bar'], 'items are in a custom order');
		});
		
		test('When I reset while a sort is defined', function() {
			this.sut.setSort('description').render();
			this.tasklist.reset( this.tasklist2.models );
			this.assertOrder(['Be', 'Fall', 'Prance', 'Run', 'Walk'], 'new items automatically ordered');
		});
		
		test('When I provide a filter', function() {
			var sut = new CollectionView({
				template: function() { return '<div></div>'; },
				collection: this.tasklist,
				ModelView: this.View,
				filter: { done: true }
			});
			var $el = sut.render().$el;
			
			equal($el.find('span').not('.done').length, 0, 'items not matching filter are not shown');
			equal($el.find('span').length, sut.collection.where({ done: true }).length, 'items matching filter are shown');
		});
	
	}; // end return
}); // end define