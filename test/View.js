define([
	'src/View'
], function (
) {
	return function() {
	
		var template = function (data) {
			template.called ++;
			var html = '<span' +
				((data.done) ? ' class="done"' : '') +
				'>' + data.description + '</span>';
			return '<li>' + html + '</li>';
		};
		
		template.called = 0;
		
		var TaskModel = Backbone.Model.extend({});
		
		module('View', {
			setup: function() {
				template.called = 0;
				this.task = new TaskModel({
					description: 'Wash the car',
					done: true
				});
				this.sut = new View({
					model: this.task,
					template: template
				});
			}
		});
		
		test('When I render the template', function() {
			var $el = this.sut.render().$el;
			
			equal($el.find('.done').length > 0, 
				this.task.get('done'), 'the template is passed the data');
			equal($el.find('span').text(),
				this.task.get('description'), 'the template is passed the data');
		});
		
		test('When the data changes', function() {
			var container = $('<div></div>');
			this.task.set('done', true);
			container.append( this.sut.render().$el );
			
			equal(container.find('.done').length, 1);
			
			this.task.set('done', false);
			
			equal(container.find('.done').length, 0, 'the display is updated');
			
			this.task.set('description', 'Hello there');
			ok(container.text().indexOf('Hello there') > -1, 'the display is updated');
			ok(container.text().indexOf('Wash the car') < 0, 'the old display is replaced');
			
			this.task.set('done', true);
			equal(container.find('.done').length, 1, 'again, the display is updated');
		});
		
		test('When I dont want to keep the display updated', function() {
			this.sut.keepDisplayUpdated(false);
			this.task.set('description', 'Nooo');
			
			ok( this.sut.$el.text().indexOf('Nooo') < 0, 'the display is not updated');
			
			this.sut.render();
			ok( this.sut.$el.text().indexOf('Nooo') > -1, 'but explicitly render, the display is updated');
		});
		
		test('Render efficiency', function() {
			this.task.set('new_attr', 2);
			this.task.set('done', false);
			equal(template.called, 0, 'View does not render before explicitly asked');
			
			this.sut.render();
			equal(template.called, 1, 'Render invokes the template once');
			
			this.task.set('done', false);
			equal(template.called, 1, 'Setting an attribute to the value it already has does not re-render');
			
			this.task.set('done', true);
			this.task.set('new_attr', 3);
			ok(template.called == 2 || template.called == 3, 'Changing 2 attributes renders no more than 2x');
		});
		
		test('Render efficiency without keepDisplayUpdated', function() {
			this.sut.keepDisplayUpdated(false);
			
			this.task.set('new_attr2', 4);
			this.task.set('new_attr', 4);
			equal(template.called, 0, 'Changing an attribute does not render');
			
			this.sut.render();
			equal(template.called, 1, 'Render invokes the template once');
		});
	
	}; // end return
}); // end define