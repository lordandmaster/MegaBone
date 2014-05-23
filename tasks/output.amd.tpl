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

	var Megabone = _.extend(Backbone, {
		View: View,
		CollectionView: CollectionView,
		Util: Util
	});
	
	return Megabone;
	
});
