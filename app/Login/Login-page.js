var frameModule = require("tns-core-modules/ui/frame");
var LoginViewModel = require("./Login-view-model");
var loginViewModel = new LoginViewModel();

function pageLoaded(args) {
	var page = args.object;

	page.bindingContext = loginViewModel;
}

exports.pageLoaded = pageLoaded;
