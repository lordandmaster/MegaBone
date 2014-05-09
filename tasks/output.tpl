(function (window, $, _, Backbone) {

	<<body>>

	var MegaBone = _.extend(Backbone, {
		View: View,
		CollectionView: CollectionView,
		Util: Util
	});

	window.<<export_var>> = Megabone;
	
})(window, $, _, Backbone);
