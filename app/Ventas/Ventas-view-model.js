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

function VentasViewModel() {
	var viewModel = observableModule.fromObject({
		name: "",
		cantidad: "",
		TotalPrice: "",
		accepted: false,

		onReturnTap: function () {
			viewModel.set('name', "")
			viewModel.set('cantidad', "")
			viewModel.set('TotalPrice', "")
			viewModel.set('accepted', false)
			topmost().navigate(navigation)
		},
		totalTap: function () {

			var pro = this.get('name');
			var cant = this.get('cantidad');

			if (this.name.trim() !== "" || this.cantidad.trim() !== "") {

				var xhttp = new XMLHttpRequest();

				xhttp.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						if (this.responseText != "0") {
							viewModel.set('accepted', true);
							viewModel.set('TotalPrice', this.responseText)
						}
						else if (this.responseText == "0") {
							alert({
								title: "Aviso",
								message: "Lo sentimos, el producto no existe en tu almacen" + "\n" + "o no hay suficiente",
								okButtonText: "ok"
							}), then(() => {
								viewModel.set('accepted', false)
								viewModel.set('name', "")
								viewModel.set('cantidad', "")
								viewModel.set('TotalPrice', "")
							})
						}
					}
				};
				xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/calculatotal.php?name=" + pro + "&cantidad=" + cant, true);
				xhttp.send();
			} else {
				alert({
					title: "Aviso",
					message: "Por favor ingresa ambos campos",
					okButtonText: "Ok"
				})
				return;
			}
		},

		onCancelTap: function () {
			viewModel.set('name', "")
			viewModel.set('cantidad', "")
			viewModel.set('TotalPrice', "")
			viewModel.set('accepted', false)
			topmost().navigate(navigation)
		},

		onAcceptedTap: function () {

			var product = this.get('name')
			var cant = this.get('cantidad')
			var total = this.get('TotalPrice')

			var xhttp = new XMLHttpRequest();

			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					console.log(this.responseText)
					if (this.responseText == "1") {
						alert({
							title: "Aviso",
							message: "Se ha restado el producto de tu almacen",
							okButtonText: "ok"
						}).then(() => {
							viewModel.set('accepted', false)
							viewModel.set('name', "")
							viewModel.set('cantidad', "")
							viewModel.set('TotalPrice', "")
							topmost().navigate(navigation)
						})
					}
					else if (this.responseText == "0") {
						alert({
							title: "Alerta",
							message: "Lo sentimos,parece que hay algunos inconvenientes",
							okButtonText: "ok"
						})
							.then(() => {
								viewModel.set('accepted', false)
								viewModel.set('name', "")
								viewModel.set('cantidad', "")
								viewModel.set('TotalPrice', "")
								return;
							})

					}
				}
			};
			xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/venta.php?producto=" + product + "&nventa=" + cant + "&nGanancia=" + total, true);
			xhttp.send();
		},
	});

	return viewModel;
}

module.exports = VentasViewModel;
