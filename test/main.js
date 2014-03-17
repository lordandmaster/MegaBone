define([
	'test/View',
	'test/CollectionView'
], function (
	tests_view,
	tests_collectionview
) {

	return function() {
		tests_view();
		tests_collectionview();
	}; // end return
	
});