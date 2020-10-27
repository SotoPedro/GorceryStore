var frameModule = require("tns-core-modules/ui/frame");
var CambiosViewModel = require("./cambios-view-model");
var cambiosViewModel = new CambiosViewModel();

function pageLoaded(args) {
	var page = args.object;

	page.bindingContext = cambiosViewModel;
}

exports.pageLoaded = pageLoaded;
