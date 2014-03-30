define([], function() {
	return function() {
	
		module('Router');
		
		test('Initialize with routes', function() {
			var router = new Router({
				'index': ['', 'test/IndexView'],
				'book': ['book/:id', 'test/BooksView']
			});
			
			// TODO: Make view fixtures and test
			ok(true);
		});
	
	}; // end return
}); // end define