$(document).ready(function () {
    jQuery.support.cors = true;

    // GET para actualizar la tabla de clientes
    $("#actualizar-tablacliente-boton").click(function () {
        var urlServicio = "http://localhost:8080/api/Client/all";
        $("#tabla-cliente tbody").empty();
        $.ajax({            
            url: urlServicio,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,

            success: function (result) {
                console.log("Entre a invocar el servicio REST");
                console.log(result);
                var i = 0;
                var id = 0;
                var nombre = "";
                var email = "";
                var edad = 0;
                var mensajes;
                var reservaciones;
                var salidaFila = "";
                
                $("#tabla-cliente tbody").empty();

                salidaFila = "<tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Edad</th><th>Mensajes</th><th>Reservaciones</th><th>Acciones</th></tr>";
                $("#tabla-cliente tbody").append(salidaFila);

                for (i = 0; i < result.length; i++) {
                    id = result[i]["idClient"];
                    nombre = result[i]["name"];
                    email = result[i]["email"];
                    edad = result[i]["age"];
                    mensajes = result[i]["messages"];
                    reservaciones = result[i]["reservations"];

                    for (var j = 0; j<reservaciones.length; j++){
                        if (JSON.stringify(reservaciones) != "[]"){
                            delete reservaciones[j]["machine"]["id"];
                            delete reservaciones[j]["machine"]["category"]["id"];
                            
                            for (var k = 0; k<reservaciones[j]["machine"]["messages"].length;  k++){
                                delete reservaciones[j]["machine"]["messages"][k]["idMessage"];
                            }
                        }else{
                            console.log(JSON.stringify(reservaciones));
                        }
                    }
                    for (var j = 0; j<mensajes.length; j++){
                        if (JSON.stringify(mensajes) != "[]"){
                            delete mensajes[j]["idMessage"];
                            delete mensajes[j]["machine"]["id"];
                            delete mensajes[j]["machine"]["category"]["id"];
                        }else{
                            console.log(JSON.stringify(mensajes));
                        }
                    }
                    mensajes = JSON.stringify(result[i]["messages"]);
                    reservaciones = JSON.stringify(result[i]["reservations"]);

                    salidaFila = "<tr><td>" + id + "</td><td>" + nombre + "</td><td>" + email + "</td><td>" + edad + "</td><td>" + mensajes + "</td><td>" + 
                        reservaciones + "</td><td>" + "<button onclick='borrarClient("+ result[i]["idClient"] +")'>Borrar</button>" + 
                        "<button onclick='actualizarClient("+ result[i]["idClient"] +")'>Editar</button>" + "</td><tr>";

                    $("#tabla-cliente tbody").append(salidaFila);

                }//Fin del ciclo for
            }
        });
    })

    // POST para agregar un cliente
    $("#agregar-cliente-boton").click(function () {
        var urlServicio = "http://localhost:8080/api/Client/save";        
        var name = $("#escribir-nombre-cliente").val();
        var email = $("#escribir-correo-cliente").val();
        var password = $("#escribir-contraseña-cliente").val();
        var age = parseInt($("#escribir-edad-cliente").val());
        if (name != "" && email != "" && password != "" && age != NaN){
            $.ajax({
                url: urlServicio,
                type: "POST",
                data: JSON.stringify({ "name":name, "email":email, "password":password, "age":age }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
            });
            return false;
        }
    })
})

//PUT para actualizar un cliente

function actualizarClient(id){
    var urlServicio = "http://localhost:8080/api/Client/update";

    var name = $("#escribir-nombre-cliente").val();
    var password = $("#escribir-contraseña-cliente").val();
    var age = parseInt($("#escribir-edad-cliente").val());

    if (name != "" && password != "" && age != NaN){

        $.ajax({
        url: urlServicio,
        type: "PUT",
        data: JSON.stringify({ "idClient":id, "name":name,"password":password, "age":age }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        });
    }
}

// Funcion para borrar un cliente
function borrarClient(id){

    var urlServicio = "http://localhost:8080/api/Client/"+ id;

    $.ajax({
        url: urlServicio,
        type: "DELETE",
    });
}