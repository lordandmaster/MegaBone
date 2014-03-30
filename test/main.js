define([
	'./modules/Util',
	'./modules/View',
	'./modules/CollectionView',
	'./modules/Router'
], function (
	tests_util,
	tests_view,
	tests_collectionview,
	tests_router
) {

	return function() {
		tests_util();
		tests_view();
		tests_collectionview();
		tests_router();
	}; // end return
	
});