var observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");
const topmost = require("tns-core-modules/ui/frame").topmost;

function LoginViewModel() {
	var viewModel = observableModule.fromObject({
		username: "",
		password: "",
		mail: "",		
		isLogginIn: true,

		toggleForm() {
			this.isLogginIn = !this.isLogginIn;
		},

		onButtonTap: function () {
			if (this.username.trim() === "" || this.password.trim() === "") {
				alert("Por favor ingresa los campos");
				return;
			}
			if (this.isLogginIn) {
				this.login();
			}
			else {
				this.registration();
			}
		},

		login: function () {

			var dat = this.get('username');
			var pass = this.get('password');

			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					if (this.responseText == "1") {
						alert({
							title: "¡Hey!",
							message: "Bienvenido, Te extrañamos",
							okButtonText: "Ok"
						}).then(() => {
							topmost().navigate({
								moduleName: "/home/home-page",
								transition: {
									name: "slide"
								}
							});
							viewModel.set('username', "");
							viewModel.set('password', "");
						});

					}
					else if (this.responseText == "0") {
						alert({
							title: "¡Oye!",
							message: "Buscamos por todos lados y no econtramos ese usuario, prueba de nuevo",
							okButtonText: "ok"
						}).then(() => {
							viewModel.set('username', "");
							viewModel.set('password', "");
						})
					}
				}
			};
			xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/validate.php?username=" + dat + "&pass=" + pass, true);
			xhttp.send();
		},

		registration: function () {

			var dat1 = this.get('username');
			var dat2 = this.get('password');
			var dat3 = this.get('mail');

			var xhttp = new XMLHttpRequest();

			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					if (this.responseText == "1") {
						alert({
							title: "Aviso",
							message: "La cuenta se ha creado exitosamente,inicia sesión para continuar",
							okButtonText: "¡Vamos!"
						})
						viewModel.set('isLogginIn', true);
						viewModel.set('username', "");
						viewModel.set('password', "");
						viewModel.set('email', "");
					}
					else if (this.responseText == "0") {
						alert({
							title: "Error",
							message: "Lo sentimos, no se pudo registrar la cuenta",
							okButtonText: "Ok"
						});
						viewModel.set('username', "");
						viewModel.set('password', "");
						viewModel.set('mail', "");
					}
					else if (this.responseText != "0" && this.responseText != "1") {
						alert({
							title: "Aviso",
							message: this.responseText,
							okButtonText: "Ok"
						});
						viewModel.set('username', "");
						viewModel.set('password', "");
						viewModel.set('mail', "");
					}
				}
			};
			xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/registration.php?username=" + dat1 + "&pass=" + dat2 + "&email=" + dat3, true);
			xhttp.send();
		},		
	});
	return viewModel;
}

module.exports = LoginViewModel;
