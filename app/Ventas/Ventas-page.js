var frameModule = require("tns-core-modules/ui/frame");
var VentasViewModel = require("./Ventas-view-model");
var ventasViewModel = new VentasViewModel();

function pageLoaded(args) {
	var page = args.object;

	page.bindingContext = ventasViewModel;
}

exports.pageLoaded = pageLoaded;
