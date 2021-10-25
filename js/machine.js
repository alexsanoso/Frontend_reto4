$(document).ready(function () {
    jQuery.support.cors = true;    

    // Actualizar el menu de selección de categorias
    $.ajax({
        url: "http://localhost:8080/api/Category/all",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,

        success: function (result) {
            var categoriaSelect = "<option hidden value=''>Seleccionar Categoria</option>";  
            $("#Categoria-machine").empty();
            $("#Categoria-machine").append(categoriaSelect);
            for (var i = 0; i < result.length; i++) {
                console.log((result[i]["id"]));
                categoriaSelect += "<option value='"+ result[i]["id"] +"'>"+ result[i]["name"] +"</option>";
                $("#Categoria-machine").empty();
                $("#Categoria-machine").append(categoriaSelect);
            }//Fin del for
        }
    })

    // GET para actualizar la tabla de maquinas
    $("#act-tabla-maquinaria").click(function () {
        var urlServicio = "http://localhost:8080/api/Machine/all";
        $("#tabla-maquinaria tbody").empty();
        console.log(urlServicio);
        $.ajax({
            url: urlServicio,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            
            success: function (result) {
                console.log("Ingreso a invocar el servicio");
                console.log(result);
                var i = 0;
                var nombre = "";
                var marca = "";
                var año = 0;
                var descripcion = "";
                var categoria;
                var mensajes;
                var reservaciones;
                var salidaFila = "";

                $("#tabla-maquinaria tbody").empty();

                salidaFila = "<tr><th>Nombre</th><th>Marca</th><th>Año</th><th>Descripción</th><th>Categoria</th><th>Mensajes</th><th>Reservaciones</th><th>Acciones</th></tr>";
                $("#tabla-maquinaria tbody").append(salidaFila);

                for (i = 0; i < result.length; i++) {
                    nombre = result[i]["name"];
                    marca = result[i]["brand"];
                    año = result[i]["year"];
                    descripcion = result[i]["description"];
                    categoria = result[i]["category"];
                    mensajes = result[i]["messages"];
                    reservaciones = result[i]["reservations"];
                    
                    for (var k = 0;  k<reservaciones.length;  k++){
                        if (JSON.stringify(reservaciones) != "[]"){
                            delete reservaciones[k]["client"]["password"];
                            delete reservaciones[k]["client"]["age"];
                        }else{
                            console.log(JSON.stringify(reservaciones));
                        }
                    }

                    for (var j = 0;  j<mensajes.length;  j++){
                        if (JSON.stringify(mensajes) != "[]"){
                            delete mensajes[j]["idMessage"]
                        }else{
                            console.log(JSON.stringify(mensajes));
                        }
                    }

                    if (JSON.stringify(categoria) != "[]"){
                        delete categoria["id"]
                    }else{
                        console.log(JSON.stringify(categoria));
                    }
                    categoria = JSON.stringify(result[i]["category"]);
                    mensajes = JSON.stringify(result[i]["messages"]);
                    reservaciones = JSON.stringify(result[i]["reservations"]);
                    
                    salidaFila = "<tr><td>" + nombre + "</td><td>" +
                        marca + "</td><td>" + año + "</td><td>" + descripcion + "</td><td>" +
                        categoria + "</td><td>" + mensajes + "</td><td>" + reservaciones + "</td><td>" + "<button onclick='borrarMaquinaria("+result[i]["id"] +")'>Borrar</button>" + 
                        "<button onclick='actualizarMaquinaria("+ result[i]["id"] +")'>Editar</button>" + "</td><tr>";

                    $("#tabla-maquinaria tbody").append(salidaFila);

                }//Fin del ciclo for
            }
        });
    })

    // POST para agregar una maquina
    $("#agregar-maquinaria-boton").click(function() {

        var urlServicio = "http://localhost:8080/api/Machine/save";
        var name = $("#escribir-nombre-maquinaria").val();
        var marca = $("#escribir-marca-maquinaria").val();
        var año = parseInt($("#escribir-año-maquinaria").val());
        var descripcion = $("#escribir-descripcion-maquinaria").val();
        var categoria = parseInt($("#Categoria-machine").val());

        if (name != "" && marca != "" && año != NaN && descripcion != "" && categoria != "") {
            console.log(name)
            console.log(marca)
            console.log(año)
            console.log(descripcion)
            console.log(categoria)
            $.ajax({
                url: urlServicio,
                type: "POST",
                data: JSON.stringify({ "name":name, "brand":marca, "year":año, "description":descripcion, "category":{"id":categoria}}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
            });
            return false;
        } 
    })
})

// Función para actualizar una maquina
function actualizarMaquinaria(id){

    var urlServicio = "http://localhost:8080/api/Machine/update";
    var name = $("#escribir-nombre-maquinaria").val();
    var marca = $("#escribir-marca-maquinaria").val();
    var año = parseInt($("#escribir-año-maquinaria").val());
    var descripcion = $("#escribir-descripcion-maquinaria").val();
    var categoria = parseInt($("#escribir-category-maquinaria").val());

    if (name != "" && marca != "" && año != NaN && descripcion != "" && categoria != NaN) {
           
        $.ajax({
            url: urlServicio,
            type: "PUT",
            data: JSON.stringify({ "id":id, "name":name, "brand":marca, "year":año, "description":descripcion, "category":{"id":categoria} }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
        });
    } 
}

// Función para borrar una maquinaria
function borrarMaquinaria(id){
    var urlServicio = "http://localhost:8080/api/Machine/"+ id;
    $.ajax({
        url: urlServicio,
        type: "DELETE",
    });
}