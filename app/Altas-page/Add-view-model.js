var observableModule = require("tns-core-modules/data/observable");
const topmost = require("tns-core-modules/ui/frame").topmost;

var navigation = {
	moduleName: "/home/home-page",
	clearHistory: true,
	transition: {
		name: "slide"
	}
};

function AddViewModel() {
	var viewModel = observableModule.fromObject({
		name: "",
		cantida: "",
		precio: "",

		onReturnTap: function () {
			viewModel.set('name', "");
			viewModel.set('cantidad', "");
			viewModel.set('precio', "");
			topmost().navigate(navigation);
		},

		onCancelTap: function () {
			viewModel.set('name', "");
			viewModel.set('cantidad', "");
			viewModel.set('precio', "");
			topmost().navigate(navigation);
		},

		onAcceptedTap: function () {

			var dat1 = this.get("name");
			var dat2 = this.get("cantidad");
			var dat3 = this.get("precio");

			if ((dat1 == "") || (dat2 == "") || (dat3 == "")) {
				alert("No se han ingresado datos").then(() => {
					return;
				})
			} else {
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						console.log(this.responseText);
						if (this.responseText == "1") {
							alert({
								title: "Aviso",
								message: "Se ha agregado el producto",
								okButtonText: "Ok"
							}).then(() => {

								viewModel.set('name', "");
								viewModel.set('cantidad', "");
								viewModel.set('precio', "");

								topmost().navigate(navigation);
							});
						}
						else if (this.responseText == "0") {
							alert({
								title: "Aviso",
								message: "No se pudo agregar el producto",
								okButtonText: "ok"
							}).then(() => {
								viewModel.set('name', "");
								viewModel.set('cantidad', "");
								viewModel.set('precio', "");

								return;
							});
						}
					}
				};
				xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/add-element.php?name=" + dat1 + "&cant=" + dat2 + "&pre=" + dat3, true);
				xhttp.send();
			}

		}
	});

	return viewModel;
}

module.exports = AddViewModel;
