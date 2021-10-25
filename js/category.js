$(document).ready(function () {
    jQuery.support.cors = true; 
    
    // GET para actualizar la tabla de Gamas
    $("#actualizar-tabla-categoria").click(function (){
        var urlServicio = "http://localhost:8080/api/Category/all";

        $("#tabla-categoria tbody").empty();
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
                var nombre = "";
                var descripcion = "";
                var maquinaria;
                var salidaFila = "";

                $("#tabla-categoria tbody").empty();

                salidaFila = "<tr><th>Nombre</th><th>Descripción</th><th>Maquinaria</th><th>Acciones</th></tr>";
                $("#tabla-categoria tbody").append(salidaFila);

                for (i = 0; i < result.length; i++) {
                    nombre = result[i]["name"];                    
                    descripcion = result[i]["description"];
                    maquinaria = result[i]["machines"];

                    for (var j = 0; j<maquinaria.length;  j++){
                        if (JSON.stringify(maquinaria) != "[]"){
                            delete maquinaria[j]["id"];
                            
                            for (var k = 0; k < maquinaria[j]["reservations"].length;  k++){

                                delete maquinaria[j]["reservations"][k]["client"]["password"];
                                delete maquinaria[j]["reservations"][k]["client"]["age"];
                            }
                            for (var k = 0; k<maquinaria[j]["messages"].length;  k++){
                                delete maquinaria[j]["messages"][k]["idMessage"];
                            }
                        }
                    }
                    
                    maquinaria = JSON.stringify(maquinaria);

                    salidaFila = "<tr><td>" + nombre + "</td><td>" + descripcion + "</td><td>" +
                        maquinaria + "</td><td>" + "<button onclick='borrarCategory("+result[i]["id"] +")'>Borrar</button>" + 
                        "<button onclick='actualizarCategory("+ result[i]["id"] +")'>Editar</button>" + "</td><tr>";


                    $("#tabla-categoria tbody").append(salidaFila);

                }//Fin del cilco for
            }
        })
    })

    // POST para agregar una categoria
    $("#agregar-categoria-boton").click(function (){
        
        var urlServicio = "http://localhost:8080/api/Category/save";
        var name = $("#escribir-nombre-categoria").val();
        var descripcion = $("#escribir-descripcion-categoria").val();

        if (name != "" && descripcion != ""){
            $.ajax({
                url: urlServicio,
                type: "POST",
                data: JSON.stringify({ "name":name, "description":descripcion}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
            });
            return false; 
        }
    })

})

// Función para actualizar una categoria
function actualizarCategory(id){
    var urlServicio = "http://localhost:8080/api/Category/update";
    var name = $("#escribir-nombre-categoria").val();
    var descripcion = $("#escribir-descripcion-categoria").val();

    if (name != "" && descripcion != ""){
        $.ajax({
            url: urlServicio,
            type: "PUT",
            data: JSON.stringify({ "id":id, "name":name, "description":descripcion}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
        });
    } 
}

// Función para borrar una categoria
function borrarCategory(id){
    var urlServicio = "http://localhost:8080/api/Category/"+ id;

    $.ajax({
        url: urlServicio,
        type: "DELETE",
    });
}