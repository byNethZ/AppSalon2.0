<h1 class="nombre-pagina">Recuperar password</h1>
<p class="descripcion-pagina">Coloca tu nuevo password a continuación</p>

<?php include_once __DIR__ . '/../templates/alertas.php'; ?>

<?php if($error) return; ?>
<form class="formulario" method="POST">
    <div class="campo">
        <label for="password">Password</label>
        <input 
        type="password" 
        name="password" 
        id="password"
        placeholder="Tu Nuevo Password">
    </div>
    <input type="submit" value="Guardar Nuevo Password" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes cuenta? Iniciar sesión</a>
    <a href="/crear-cuenta">¿No tienes cuenta? Crea una</a>
</div>