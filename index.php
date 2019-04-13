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
	<script src="ui.js"></script>
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
	
	<div id="ui">
		<div class="minimize">-</div>
		<div class="maximize">+</div>		
		<div class="category">
			<div class="title">Settings</div>
			<div class="row input-row-2">
				<div class="label">Display</div>
				<button class="input-1 toggle-button show-grid active" name="show-grid">Grid</button>
				<button class="input-2 toggle-button show-texture active" name="show-texture">Image</button>
			</div>
			<div class="row input-row-3-compact">
				<div class="label range-label">Detail</div>
				<button class="input-1 detail-down">-</button>
				<input class="input-2 detail" type="text" value="4" name="detail" readonly>
				<button class="input-3 detail-up">+</button>
			</div>	
			<div class="row input-row-1">
				<div class="description">Transition: Arrow Keys</div>
			</div>	
		</div>
		<div class="category" style="margin-top:5px">
			<div class="title">Expression</div>
			<div class="row plot-row">
				<input type="text" class="input expression" value="(x+y*i+i*sin(x*2)*0.2+sin(y*2)*0.2)*0.75" name="expression">
			</div>
			<div class="row plotit-row"><button class="plot-it">Apply</button></div>			
		</div>
	</div>
	
</body></html>
