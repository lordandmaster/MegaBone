define([], function () {
	return function() {
	
		module('Util');
		
		test('doesModelMatch', function() {
			var model = new Backbone.Model({
				attr1: true,
				attr2: 3,
				attr3: 'hello'
			});
			
			_.each([
				{ values: { attr1: true }, expected: true, msg: 'Basic match' },
				{ values: { attr1: false }, expected: false, msg: 'Basic non-match' },
				{ values: { attr3: 'hello', attr1: true }, expected: true, msg: 'Matches multiple keys' },
				{ values: { attr3: 'hello', attr1: false }, expected: false, msg: 'Each key must be equal to match' },
				{ values: {}, expected: true, msg: 'Always matches empty hash' },
				{ values: null, expected: true, msg: 'Always matches null' },
			], function (testcase) {
				var result = Util.doesModelMatch(model, testcase.values);
				equal(result, testcase.expected, testcase.msg);
			});
		});
	
	};
});