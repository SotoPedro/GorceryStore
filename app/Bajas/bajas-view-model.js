var observableModule = require("tns-core-modules/data/observable");
const topmost = require("tns-core-modules/ui/frame").topmost;
const dialogsModule = require("ui/dialogs");

var navigation = {
	moduleName: "/home/home-page",
	clearHistory: true,
	transition: {
		name: "slide"
	}
};

function BajasViewModel() {
	var viewModel = observableModule.fromObject({
		nname: "",

		onAcceptedTap: function () {
			var dat = this.get("nname")

			if (dat == "") {
				alert("No se ha ingresado nada")
			}
			else {
				dialogsModule.action({
					message: "Se eliminará del producto, ¿Esta seguro?",
					actions: ["Si", "No"]
				}).then((result) => {
					if (result == "Si") {						
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function () {
							if (this.readyState == 4 && this.status == 200) {								
								if (xhttp.responseText == "1") {
									alert("Se Eliminó el registro").then(() => {
										viewModel.set('nname', "");
										topmost().navigate(navigation);
									});
								}
								else if (xhttp.responseText == "0") {
									alert({
										title: "Aviso",
										message: "No se logró eliminar",
										okButtonText: "ok"
									}).then(() => {
										viewModel.set('name', "");
										topmost().navigate(navigation);
									});

								}
							}
						};
						xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/delete.php?name=" + dat, true);
						xhttp.send();

					} else {
						viewModel.set('name', "")
						topmost().navigate(navigation);
					}
				})
			}
		},

		onCancelTap: function () {
			viewModel.set('name', "")
			topmost().navigate(navigation);
		},

		onReturnTap: function () {
			viewModel.set('name', "")
			topmost().navigate(navigation);
		}
	});

	return viewModel;
}

module.exports = BajasViewModel;
