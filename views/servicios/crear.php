<h1 class="nombre-pagina">Nuevo Servicio</h1>
<p class="descripcion-pagina">Llena todos los campos para crear el servicio</p>

<?php include_once __DIR__ . '/../templates/barra.php'; ?>
<?php include_once __DIR__ . '/../templates/alertas.php'; ?>

<form action="/servicios/crear" method="POST" class="formulario">
    <?php include_once __DIR__ . '/formulario.php'; ?>
<input type="submit" value="Guardar Servicios" class="boton">
</form>