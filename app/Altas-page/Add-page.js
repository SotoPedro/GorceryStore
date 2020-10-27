var frameModule = require("tns-core-modules/ui/frame");
var AddViewModel = require("./Add-view-model");
var addViewModel = new AddViewModel();

function pageLoaded(args) {
	var page = args.object;

	page.bindingContext = addViewModel;
}

exports.pageLoaded = pageLoaded;
