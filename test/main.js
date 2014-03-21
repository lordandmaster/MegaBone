define([
	'./modules/Util',
	'./modules/View',
	'./modules/CollectionView'
], function (
	tests_util,
	tests_view,
	tests_collectionview
) {

	return function() {
		tests_util();
		tests_view();
		tests_collectionview();
	}; // end return
	
});