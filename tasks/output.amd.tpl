define([
	'jquery',
	'underscore',
	'backbone'
], function (
	$,
	_,
	Backbone
) {

	<<body>>

	var MegaBone = _.extend(Backbone, {
		View: View,
		CollectionView: CollectionView,
		Router: Router
	});
	
	return MegaBone;
	
});