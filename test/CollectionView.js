define([
	'src/View',
	'src/CollectionView'
], function (
) {

	function newTask (done, description) {
		return new Backbone.Model({
			done: done,
			description: description
		});
	}
	
	var init = {
		setup: function() {
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
					this.$el.html(
						'<span>' + this.model.get('description') + '</span>'
					);
					return this;
				}
			});
			
			this.sut = new CollectionView({
				template: function() { return '<div></div>'; },
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
	
	}; // end return
}); // end define