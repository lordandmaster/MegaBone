var Util = {

	doesModelMatch: function (model, values) {
		for ( var key in values ) {
			if ( model.attributes[key] !== values[key] ) {
				return false;
			}
		}
		return true;
	}

};