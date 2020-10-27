var observableModule = require("tns-core-modules/data/observable");
var frameModule = require("tns-core-modules/ui/frame");
const dialogs = require("ui/dialogs");
const topmost = require("tns-core-modules/ui/frame").topmost;
var fetchModule = require("tns-core-modules/fetch");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

var productos = []
function HomeViewModel() {
  var viewModel = observableModule.fromObject({
    searchPhrase: "",
    isSelected: true,

    onCleanTap: function () {
      this.isSelected = !this.isSelected

      while (productos.length) {
        productos.pop()
      }
      console.log(productos)
      viewModel.set('producto', productos)
    },

    loadProductos: () => {
      var sideDrawer = frameModule.Frame.topmost().getViewById("sideDrawer");
      return fetch('https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/mostrar.php')
        .then(res => res.json())
        .then(data => {
          if (data == "0") {
            alert({
              title: "Aviso",
              message: "No hay productos registrados aún",
              okButtonText: "¡Hay que registrar algunos!"
            }).then(() => {
              sideDrawer.closeDrawer();
            })
          } else {
            viewModel.set('isSelected', false)
            let arreglo = data.split(',')
            for (let i = 0; i < arreglo.length; i += 3) {
              productos.push({
                name: arreglo[i],
                precio: arreglo[i + 1],
                cantidad: arreglo[i + 2]
              })
            }
            viewModel.set('producto', productos)
            sideDrawer.closeDrawer();
          }
        })
        .catch(err => console.log(err))
    },

    showVentasTap: () => {
      viewModel.set('isSelected', true)
      while (productos.length) {
        productos.pop()
      }
      console.log(productos)
      viewModel.set('producto', productos)
      return fetch('https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/showVenta.php')
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data == "0") {
            alert({
              title: "Aviso",
              message: "Aún no tienes ninguna venta registrada",
              okButtonText: "ok"
            })
          }
          else if (data == '') {
            alert({
              title: "Aviso",
              message: "Aún no tienes ninguna venta registrada",
              okButtonText: "ok"
            })
          }
          else {
            let arreglo = data.split(',')
            if (arreglo[0] == '' || arreglo[1] == '') {
              alert({
                title: "Total del día",
                message: "Aún no has registrado nada",
                okButtonText: "Ok"
              })
            } else {
              alert({
                title: "Total del día",
                message: "Total vendido hoy: " + arreglo[0] + "\n" + "Total ganado hoy: " + arreglo[1],
                okButtonText: "Ok"
              })
            }
            if (arreglo[2] == '' || arreglo[3] == '') {
              alert({
                title: "Total del general",
                message: "Aún no has registrado nada",
                okButtonText: "Ok"
              })
            } else {
              alert({
                title: "Total general",
                message: "Total vendido: " + arreglo[3] + "\n" + "Total ganado: " + arreglo[2],
                okButtonText: "Ok"
              })
            }
            var sideDrawer = frameModule.Frame.topmost().getViewById("sideDrawer");
            sideDrawer.closeDrawer();
          }
        })
        .catch(err => console.log(err))
    },

    onSearchSubmit: function () {
      var dat = this.get("searchPhrase")
      if (dat == "") {
        alert("No se han realizado busquedas").then(() => {
          return;
        })
      } else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            if (xhttp.responseText != "0") {
              var cad = this.responseText;
              var arr = cad.split(',');
              var dato = "Nombre: " + arr[0] + "\n" + "precio: " + arr[1] + "\n" + "cantidad: " + arr[2] + ""
              alert({
                title: "Producto",
                message: dato,
                okButtonText: "OK"
              }).then(() => {
                viewModel.set('searchPhrase', "")
              });
            }
            else if (xhttp.responseText == "0") {
              alert({
                title: "Aviso",
                message: "No se logró encontrar el producto",
                okButtonText: "ok"
              }).then(() => {
                viewModel.set('accedpted', false);
                viewModel.set('name', "");
              });
              topmost().navigate(navigation);
            }
          }
        };
        xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/update.php?name=" + dat, true);
        xhttp.send();
      }
    },

    onItemTap: function (args) {
      console.log('Item with index: ' + args.index + ' tapped');
      alert({
        title: "Producto",
        message: "Nombre: " + productos[args.index].name + "\n" + "Precio: " + productos[args.index].precio + "\n" + "Cantidad:" + productos[args.index].cantidad,
        okButtonText: "ok"
      })
    },

    onOpenDrawerTap: function () {
      var sideDrawer = frameModule.Frame.topmost().getViewById("sideDrawer");
      sideDrawer.showDrawer();
    },

    onCloseDrawerTap: function () {
      var sideDrawer = frameModule.Frame.topmost().getViewById("sideDrawer");
      sideDrawer.closeDrawer();
    },

    onLogOutTap: function () {
      dialogs.action({
        message: "Se cerrará la sesión, ¿Desea continuar?",
        actions: ["Si", "No"],
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result == "Si") {
          while (productos.length) {
            productos.pop()
          }
          console.log(productos)
          viewModel.set('producto', productos)
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              if (xhttp.responseText == "1") {
                alert({
                  message: "Gracias por utilizar la aplicación",
                  okButtonText: "Ok"
                }).then(() => {
                  topmost().navigate({
                    moduleName: "/Login/Login-page",
                    clearHistory: true,
                    transition: {
                      name: "fade"
                    }
                  });
                });
              }
              else {
                while (productos.length) {
                  productos.pop()
                }
                console.log(productos)
                viewModel.set('producto', productos)
                alert("No existe ninguna sesión");
              }
            }
          };
          xhttp.open("GET", "https://tetravalent-malfunc.000webhostapp.com/Practicas/GreenSpace/destroy_session.php", true);
          xhttp.send();
        }
        else {
          return;
        }
      })
    },

    onAddNavigate: function () {
      while (productos.length) {
        productos.pop()
      }
      console.log(productos)
      viewModel.set('producto', productos)
      topmost().navigate({
        moduleName: "/Altas-page/Add-page",
        transition: {
          name: "slide"
        }
      })
    },

    onDeleteNavigate: function () {
      while (productos.length) {
        productos.pop()
      }
      console.log(productos)
      viewModel.set('producto', productos)
      topmost().navigate({
        moduleName: "/Bajas/bajas-page",
        transition: {
          name: "slide"
        }
      })
    },

    onEditNavigate: () => {
      while (productos.length) {
        productos.pop()
      }
      console.log(productos)
      viewModel.set('producto', productos)
      topmost().navigate({
        moduleName: "/Cambios/cambios-page",
        transition: {
          name: "slide"
        }
      })
    },

    onVentasTap: () => {
      viewModel.set('isSelected', true)
      while (productos.length) {
        productos.pop()
      }
      console.log(productos)
      viewModel.set('producto', productos)
      topmost().navigate({
        moduleName: "/Ventas/Ventas-page",
        transition: {
          name: "slide"
        }
      })
    }

  });

  return viewModel;
}

module.exports = HomeViewModel;
