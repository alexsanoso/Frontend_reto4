$(document).ready(function () {
    jQuery.support.cors = true;

    // Para actualizar el menu de selección del cliente
    $.ajax({
        url: "http://129.151.109.151:8080/api/Client/all",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
    
        success: function (result) {    
            var clientSelect = "<option hidden value=''>Seleccionar Cliente</option>";   
            $("#id-cliente-mensaje").empty();
            $("#id-cliente-mensaje").append(clientSelect);  
            for (var i = 0; i < result.length; i++) {
                console.log(result[i]["name"]);        
                clientSelect += "<option value='"+ result[i]["idClient"] +"'>"+ result[i]["name"] +"</option>";
                $("#id-cliente-mensaje").empty();
                $("#id-cliente-mensaje").append(clientSelect);
                console.log(clientSelect);
    
            }//Fin del for
        }
    })
    // Para actualizar el menu de selección del maquinaria
    $.ajax({
        url: "http://129.151.109.151:8080/api/Machine/all",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        
        success: function (result) {    
            var machineSelect = "<option hidden value=''>Seleccionar Maquinaria</option>";  
            $("#id-maquinaria-mensaje").empty();
            $("#id-maquinaria-mensaje").append(machineSelect);

            for (var i = 0; i < result.length; i++) {
                machineSelect += "<option value='"+ result[i]["id"] +"'>"+ result[i]["name"] +"</option>";
                $("#id-maquinaria-mensaje").empty();
                $("#id-maquinaria-mensaje").append(machineSelect);
    
            }//Fin del for
        }
    })
    // GET para actualizar la tabla de Mensaje
    $("#actualizar-tabla-mensaje").click(function () {
        var urlServicio = "http://129.151.109.151:8080/api/Message/all";
        $("#tabla-mensaje tbody").empty();
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
                var idMensaje = 0;
                var mensaje = "";
                var maquinaria;
                var cliente;
                var salidaFila = "";

                $("#tabla-mensaje tbody").empty();

                salidaFila = "<tr><th>Mensaje</th><th>Maquinaria</th><th>Cliente</th><th>Acciones</th></tr>";
                $("#tabla-mensaje tbody").append(salidaFila);

                for (i = 0; i < result.length; i++) {
                    idMensaje = result[i]["idMessage"];
                    mensaje = result[i]["messageText"];
                    maquinaria = result[i]["machine"];
                    cliente = result[i]["client"];

                    if (JSON.stringify(maquinaria) != "[]"){
                        delete maquinaria["id"];
                        delete maquinaria["category"]["id"];
                    }else{
                        console.log(JSON.stringify(maquinaria));
                    }
                    if (JSON.stringify(cliente) != "[]"){
                        delete cliente["idClient"];
                        delete cliente["password"];
                    }else{
                        console.log(JSON.stringify(cliente));
                    }

                    maquinaria = JSON.stringify(result[i]["machine"]);
                    cliente = JSON.stringify(result[i]["client"]);

                    salidaFila = "<tr><td>" + mensaje + "</td><td>" +
                        maquinaria + "</td><td>" + cliente + "</td> + <td class='celda-accion'>" + "<button class='button btnB' onclick='borrarMensaje("+result[i]["idMessage"] +")'>Borrar</button>" + 
                        "<button class='button btnA' onclick='actualizarMensaje("+ result[i]["idMessage"] +")'>Editar</button>" + "</td></tr>";

                    $("#tabla-mensaje tbody").append(salidaFila);

                }//Fin del ciclo for
            }
        });
    })

    // POST para agregar un mensaje
    $("#agregar-mensaje-boton").click(function () {
        var urlServicio = "http://129.151.109.151:8080/api/Message/save";
        var mensaje = $("#escribir-cuadro-mensaje").val();
        var cliente = parseInt($("#id-cliente-mensaje").val());
        var maquinaria = parseInt($("#id-maquinaria-mensaje").val()); 
        console.log(maquinaria)       
        if (mensaje != "" && cliente != NaN && maquinaria != NaN) {
            $.ajax({
                url: urlServicio,
                type: "POST",
                data: JSON.stringify({ "messageText":mensaje, "client":{"idClient":cliente}, "machine":{"id":maquinaria}}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
            });
            return false;
        }
    })
})

// Función para actualizar un mensaje
function actualizarMensaje(idMensaje){
    var urlServicio = "http://129.151.109.151:8080/api/Message/update";

    var mensaje = $("#escribir-cuadro-mensaje").val();
              
    if (mensaje != "") {
        $.ajax({
            url: urlServicio,
            type: "PUT",
            data: JSON.stringify({ "idMessage": idMensaje, "messageText":mensaje}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            });   
        }
}

// Función para borrar un mensaje
function borrarMensaje(idMensaje){
    var urlServicio = "http://129.151.109.151:8080/api/Message/" + idMensaje;

    $.ajax({
        url: urlServicio,
        type: "DELETE",
    });  
}