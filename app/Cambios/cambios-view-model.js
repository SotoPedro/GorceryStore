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


function CambiosViewModel() {
	var viewModel = observableModule.fromObject({
		name: "",
		nname: "",
		ncantidad: "",
		nprecio: "",
		searched: true,
		accepted: false,

		onSearchTap: function () {
			var dat = this.get("name");

			if (dat == "") {
				alert("No se ha ingresado nada")
			}
			else {
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						if (xhttp.responseText != "0") {
							alert("Se econtró el registro").then(() => {
								var arr = this.responseText.split(',')
								viewModel.set('nname', arr[0]);
								viewModel.set('ncantidad', arr[1]);
								viewModel.set('nprecio', arr[2]);
								viewModel.set('accepted', true);
								viewModel.set('searched', false);
							});
						}
						else if (xhttp.responseText == "0") {
							alert({
								title: "Aviso",
								message: "No se logró encontrar",
								okButtonText: "ok"
							}).then(() => {
								viewModel.set('accedpted', false);
								viewModel.set('searched', true);
								viewModel.set('name', "");
								return;
							});
						}
					}
				};
				xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/update.php?name=" + dat, true);
				xhttp.send();
			}
		},
		onAcceptedTap: function () {
			var name = this.get("name")
			var dat = this.get("nname")
			var dat1 = this.get("ncantidad")
			var dat2 = this.get("nprecio")

			if ((dat == "") || (dat1 == "") || (dat2 == "")) {
				alert("No se han hecho actualizaciones").then(() => {
					topmost().navigate(navigation)
				})
			}
			else {
				dialogsModule.action({
					message: "Se actualizará la información ¿Desea continuar?",
					actions: ["Si", "No"]
				}).then((result) => {
					if (result == "Si") {
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function () {
							if (this.readyState == 4 && this.status == 200) {
								console.log(this.responseText);
								if (xhttp.responseText == "1") {
									alert("Se actualizó el registro").then(() => {
										viewModel.set('nname', "");
										viewModel.set('ncantidad', "");
										viewModel.set('nprecio', "");
										viewModel.set('accedpted', false);
										viewModel.set('searched', true);
										viewModel.set('name', "");
										topmost().navigate(navigation);
									});
								}
								else if (xhttp.responseText == "0") {
									alert({
										title: "Aviso",
										message: "No se logró actualizar",
										okButtonText: "ok"
									}).then(() => {
										viewModel.set('nname', "");
										viewModel.set('ncantidad', "");
										viewModel.set('nprecio', "");
										viewModel.set('accedpted', false);
										viewModel.set('searched', true);
										viewModel.set('name', "");
									});
									topmost().navigate(navigation);
								}
							}
						};
						xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/updateData.php?name=" + name + "&nname=" + dat + "&cant=" + dat1 + "&prec=" + dat2, true);
						xhttp.send();
					} else {
						viewModel.set('nname', "");
						viewModel.set('ncantidad', "");
						viewModel.set('nprecio', "");
						viewModel.set('accedpted', false);
						viewModel.set('searched', true);
						viewModel.set('name', "");
						topmost().navigate(navigation);
					}
				})
			}
		},

		onCancelTap: function () {
			viewModel.set('accedpted', false)
			viewModel.set('searched', true);
			viewModel.set('name', "")
			viewModel.set('nname', "")
			viewModel.set('ncantidad', "")
			viewModel.set('nprecio', "")
			topmost().navigate(navigation)
		},

		onReturnTap: function () {
			viewModel.set('accedpted', false)
			viewModel.set('searched', true)
			viewModel.set('name', "")
			viewModel.set('nname', "")
			viewModel.set('ncantidad', "")
			viewModel.set('nprecio', "")
			topmost().navigate(navigation)
		}
	});

	return viewModel;
}

module.exports = CambiosViewModel;
