<?php
	require_once("shaders.php");
?>
<!DOCTYPE html>
<html><head>
	<title>Complex Grid</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<link rel="stylesheet" type="text/css" href="gfw.css">
	<link rel="stylesheet" type="text/css" href="game.css">
	<script src="jquery-3.2.1.min.js"></script>
	<script src="jquery.cookie.js"></script>
	<script src="gl-matrix/dist/gl-matrix.js"></script>
	<script src="math.js"></script>
	<script src="storage.js"></script>
	<script src="gfw.js"></script>
	<script src="game.js"></script>
	<script src="shader.js"></script>
	<script src="textures.js"></script>
	<script src="plotter.js"></script>
	<script type="x-shader/x-vertex" id="vs-grid-line">
		<?= get_shader_src("grid-line.vert") ?>
	</script>
	<script type="x-shader/x-fragment" id="fs-grid-line">
		<?= get_shader_src("grid-line.frag") ?>
	</script>	
	<script type="x-shader/x-vertex" id="vs-grid-texture">
		<?= get_shader_src("grid-texture.vert") ?>
	</script>
	<script type="x-shader/x-fragment" id="fs-grid-texture">
		<?= get_shader_src("grid-texture.frag") ?>
	</script>
</head><body>
	<div id="left-anchor" class="noselect">
		<div id="monitor-box">
			<div class="monitor-header">Monitor</div>
		</div>
		<div id="controls-box">
			<div class="controls-header">Controls</div>
		</div>
		<button class="save-state" style="display:none">Save state</button>
	</div>
	<div class="toast">
		<div class="inner">
			<span class="toast-text">Toast</div>
		</div>
	</div>
</body></html>
