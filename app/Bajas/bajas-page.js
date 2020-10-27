var frameModule = require("tns-core-modules/ui/frame");
var BajasViewModel = require("./bajas-view-model");
var bajasViewModel = new BajasViewModel();

function pageLoaded(args) {
	var page = args.object;

	page.bindingContext = bajasViewModel;
}

exports.pageLoaded = pageLoaded;
