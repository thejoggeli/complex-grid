function Plotter(){}
Plotter.expression = "(x+y*i)^2";
Plotter.bounds = {
	left: -16,
	right: 16,
	bottom: -9,
	top: 9,
};
Plotter.gridStep = 1;
Plotter.gridDetail = 2;
Plotter.transition = 1;
Plotter.positions = {
	before: [],
	inter: [],
	after: [],
};
Plotter.lines = null;
Plotter.plane = null;
Plotter.drawLines = true;
Plotter.drawPlane = true;
Plotter.init = function(){
	
	// line shader
	Plotter.lineShader = new ShaderProgram();
	Plotter.lineShader.create(
		document.querySelector("#vs-grid-line").innerHTML, 
		document.querySelector("#fs-grid-line").innerHTML
	);
	Plotter.lineShader.addAttribute("position");
	Plotter.lineShader.addAttribute("color");
	Plotter.lineShader.addUniform("matrix");
	
	// texture shader
	Plotter.textureShader = new ShaderProgram();
	Plotter.textureShader.create(
		document.querySelector("#vs-grid-texture").innerHTML, 
		document.querySelector("#fs-grid-texture").innerHTML
	);
	Plotter.textureShader.addAttribute("position");
	Plotter.textureShader.addAttribute("texcoords");
	Plotter.textureShader.addUniform("matrix");
	Plotter.textureShader.addChannel("iTexture");
	Plotter.textureShader.use();
	Plotter.textureShader.setChannel("iTexture", Textures.get("raten"));
	
	Plotter.refresh();
	
	// grid
/*	Plotter.gridLines = {v: [], h: []};
	Plotter.allGridLines = [];
	for(var h = 0; h <= hmax; h++){
		Plotter.gridLines.h[h] = Plotter.generateLine(2);
		Plotter.allGridLines.push(Plotter.gridLines.h[h]);
	}	
	for(var v = 0; v <= vmax; v++){
		Plotter.gridLines.v[v] = Plotter.generateLine(2);	
		Plotter.allGridLines.push(Plotter.gridLines.v[v]);
	}
	for(var i = 0; i < Plotter.allGridLines.length; i++){
		var line = Plotter.allGridLines[i];
		for(var j = 0; j < 2; j++){
			line.colors[j*4+0] = 0.75;
			line.colors[j*4+1] = 0.75;
			line.colors[j*4+2] = 0.75;
			line.colors[j*4+3] = 1.0;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, line.colors_vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line.colors), gl.STATIC_DRAW);
	} */
}
Plotter.refresh = function(){
	Plotter.generateLines();
	Plotter.generatePlane();
	Plotter.plot();
	Plotter.apply();
}
Plotter.generateLines = function(){
	if(Plotter.lines !== null){
		for(var i = 0; i < Plotter.allLines; i++){
			var line = Plotter.allLines[i];
			gl.deleteBuffer(line.positions_vbo);
			gl.deleteBuffer(line.colors_vbo);
		}
	}	
	Plotter.lines = {
		h: [],
		v: [],
	};
	Plotter.allLines = [];
	var hrange = Plotter.bounds.top - Plotter.bounds.bottom;
	var vrange = Plotter.bounds.right - Plotter.bounds.left;
	var hpoints = Plotter.gridDetail * hrange;
	var vpoints = Plotter.gridDetail * vrange;
	for(var h = 0; h <= hrange; h++){
		Plotter.lines.h[h] = Plotter.generateLine(vpoints+1);
		Plotter.allLines.push(Plotter.lines.h[h]);
	}	
	for(var v = 0; v <= vrange; v++){
		Plotter.lines.v[v] = Plotter.generateLine(hpoints+1);	
		Plotter.allLines.push(Plotter.lines.v[v]);
	}
	for(var h = 0; h <= hrange; h++){
		var line = Plotter.lines.h[h];
		var c1 = h/hrange;
		for(var x = 0; x < line.numPoints; x++){
			var c2 = x/(line.numPoints-1);
			line.colors[x*4] = 1-c1;
			line.colors[x*4+1] = c1;
			line.colors[x*4+2] = c2;
			line.colors[x*4+3] = 1;
		} 
		gl.bindBuffer(gl.ARRAY_BUFFER, line.colors_vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line.colors), gl.STATIC_DRAW);
	}
	for(var v = 0; v <= vrange; v++){
		var line = Plotter.lines.v[v];
		var c1 = v/vrange;
		for(var y = 0; y < line.numPoints; y++){
			var c2 = y/(line.numPoints-1);
			line.colors[y*4] = 1-c1;
			line.colors[y*4+1] = c2;
			line.colors[y*4+2] = c1;
			line.colors[y*4+3] = 1;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, line.colors_vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line.colors), gl.STATIC_DRAW);
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
Plotter.generateLine = function(numPoints){
	var line = {
		numPoints: numPoints,
		positions: [],
		positions_vbo: null,
		colors: [],
		colors_vbo: null,
	};
	for(var i = 0; i < numPoints; i++){
		line.positions.push(i);
		line.positions.push(0);
		line.positions.push(0);
		line.colors.push(1);
		line.colors.push(0.5);
		line.colors.push(0);
		line.colors.push(1);
	}
	line.positions_vbo = gl.createBuffer();
	line.colors_vbo = gl.createBuffer();
	return line;
}
Plotter.generatePlane = function(){	
	if(Plotter.plane !== null){
		gl.deleteBuffer(Plotter.plane.positions_vbo);
		gl.deleteBuffer(Plotter.plane.texcoords_vbo);
		gl.deleteBuffer(Plotter.plane.indices_vbo);
	}	
	var plane = {
		positions: [],
		positions_vbo: gl.createBuffer(),
		indices: [],
		indices_vbo: gl.createBuffer(),
		texcoords: [],
		texcoords_vbo: gl.createBuffer(),
		texture: null,
	};
	plane.left = 0;
	plane.right = (Plotter.lines.v.length-1)*Plotter.gridDetail;
	plane.bottom = 0;
	plane.top = (Plotter.lines.h.length-1)*Plotter.gridDetail;
	plane.num_x = plane.right - plane.left + 1;
	plane.num_y = plane.top - plane.bottom + 1;
	plane.numPoints = plane.num_x * plane.num_y;
	plane.numTriangles = (plane.num_x-1)*(plane.num_y-1)*2,
	Plotter.plane = plane;
	// positions
	for(var y = plane.num_y-1; y >= 0; y--){
		for(var x = 0; x < plane.num_x; x++){
			plane.positions.push(x);
			plane.positions.push(y);
			plane.positions.push(0);
			plane.texcoords.push(x/(plane.num_x-1));
			plane.texcoords.push(y/(plane.num_y-1));
		}
	}
	// indices
	for(var x = 1; x < plane.num_x; x++){
		for(var y = 1; y < plane.num_y; y++){
			var i1 = y*plane.num_x+x; // bottom right
			var i2 = y*plane.num_x+(x-1); // bottom left
			var i3 = (y-1)*plane.num_x+x; // top right
			var i4 = (y-1)*plane.num_x+(x-1); // top left
			plane.indices.push(i4, i3, i2);
			plane.indices.push(i3, i2, i1);
		}
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.indices_vbo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(plane.indices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.texcoords_vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(plane.texcoords), gl.STATIC_DRAW);	
}
Plotter.setExpression = function(exp){
	Plotter.expression = exp;
	Plotter.expression = Plotter.expression.replace("z", "(x+y*i)");
	Plotter.compiled = math.compile(Plotter.expression);
}
Plotter.plot = function(){
	var compiled = Plotter.compiled;
	var xsteps = (Plotter.lines.v.length-1) * Plotter.gridDetail + 1;
	var ysteps = (Plotter.lines.h.length-1) * Plotter.gridDetail + 1;
	Plotter.positions.before = [];
	Plotter.positions.inter = [];
	Plotter.positions.after = [];
	for(var i = 0; i < xsteps; i++){
		var x = Plotter.bounds.left + i/Plotter.gridDetail;
		Plotter.positions.before[i] = [];
		Plotter.positions.inter[i] = [];
		Plotter.positions.after[i] = [];
		for(var j = 0; j < ysteps; j++){
			var y = Plotter.bounds.bottom + j/Plotter.gridDetail;
			var result = compiled.eval({x: x, y: y});			
			Plotter.positions.before[i][j] = {x: x, y: y};
			Plotter.positions.inter[i][j] = {x: x, y: y};
			Plotter.positions.after[i][j] = {x: result.re, y: result.im};
		}
	}
}
Plotter.apply = function(){
	var before = Plotter.positions.before;
	var inter = Plotter.positions.inter;
	var after = Plotter.positions.after;
	var s = Plotter.transition;
	var lines = Plotter.lines;
	for(var i = 0; i < before.length; i++){
		for(var j = 0; j < before[i].length; j++){
			inter[i][j].x = before[i][j].x + (after[i][j].x - before[i][j].x)*s
			inter[i][j].y = before[i][j].y + (after[i][j].y - before[i][j].y)*s
		}
	}
	for(var h = 0; h < lines.h.length; h++){
		var line = lines.h[h];
		var y = h*Plotter.gridDetail;
		for(var i = 0; i < line.numPoints; i++){
			var x = i;
			line.positions[i*3+0] = inter[x][y].x;
			line.positions[i*3+1] = inter[x][y].y;
		}	
	}
	for(var v = 0; v < lines.v.length; v++){
		var line = lines.v[v];
		var x = v*Plotter.gridDetail;
		for(var i = 0; i < line.numPoints; i++){
			var y = i;
			line.positions[i*3+0] = inter[x][y].x;
			line.positions[i*3+1] = inter[x][y].y;
		}	
	}
	for(var i = 0; i < Plotter.allLines.length; i++){
		var line = Plotter.allLines[i];
		gl.bindBuffer(gl.ARRAY_BUFFER, line.positions_vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line.positions), gl.DYNAMIC_DRAW);
	}
	var plane = Plotter.plane;
	for(var x = 0; x < plane.num_x; x++){		
		for(var y = 0; y < plane.num_y; y++){
			var i = (y*plane.num_x+x)*3;
			plane.positions[i+0] = inter[x+plane.left][y+plane.bottom].x;
			plane.positions[i+1] = inter[x+plane.left][y+plane.bottom].y;
		}
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.positions_vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(plane.positions), gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);	
}
Plotter.render = function(){
	Gfw.getCanvas("main").setActive();
	var shader;
	
	// matrix
	var matrix = vv.mat4[0];
	// scale
	var scale = vv.vec3[1];
	glMatrix.vec3.set(scale, Gfw.height/Gfw.width*(1/Gfw.height), 1/Gfw.height, 1);
	// translation
	var translation = vv.vec3[0];
	glMatrix.vec3.set(translation, Gfw.camera.position.x, Gfw.camera.position.y, 0);
	// zoom
	var zoom = vv.vec3[2];
	glMatrix.vec3.set(zoom, 1/Gfw.camera.zoom, 1/Gfw.camera.zoom, 1);
	// transform
	glMatrix.mat4.identity(matrix);
	glMatrix.mat4.scale(matrix, matrix, scale);
	// camera
	var cameraMatrix = vv.mat4[1];
	glMatrix.mat4.identity(cameraMatrix);
	glMatrix.mat4.translate(cameraMatrix, cameraMatrix, translation);
	glMatrix.mat4.rotateZ(cameraMatrix, cameraMatrix, Gfw.camera.rotation);
	glMatrix.mat4.scale(cameraMatrix, cameraMatrix, zoom);
	glMatrix.mat4.invert(cameraMatrix, cameraMatrix);
	glMatrix.mat4.multiply(matrix, matrix, cameraMatrix);
	
	// texture
	if(Plotter.drawPlane){
		shader = Plotter.textureShader;
		shader.use();
		var plane = Plotter.plane;
		gl.uniformMatrix4fv(shader.uniforms.matrix.location, false, matrix);
		// position
		gl.bindBuffer(gl.ARRAY_BUFFER, plane.positions_vbo);
		gl.vertexAttribPointer(shader.attributes.position.location, 3, gl.FLOAT, false, 0, 0); 
		gl.enableVertexAttribArray(shader.attributes.position.location);
		// texcoords
		gl.bindBuffer(gl.ARRAY_BUFFER, plane.texcoords_vbo);
		gl.vertexAttribPointer(shader.attributes.texcoords.location, 2, gl.FLOAT, false, 0, 0); 
		gl.enableVertexAttribArray(shader.attributes.texcoords.location);
		// indices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.indices_vbo);
		// draw
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_COLOR, gl.ONE_MINUS_DST_COLOR);
		gl.drawElements(gl.TRIANGLES, plane.indices.length, gl.UNSIGNED_SHORT, 0);
		gl.disable(gl.BLEND);
	}
	
	// lines
	if(Plotter.drawLines){
		shader = Plotter.lineShader;
		shader.use();	
		var lines = Plotter.allLines;
		gl.uniformMatrix4fv(shader.uniforms.matrix.location, false, matrix);
		for(var i = 0; i < Plotter.allLines.length; i++){
			var line = lines[i];
			// position
			gl.bindBuffer(gl.ARRAY_BUFFER, line.positions_vbo);
			gl.vertexAttribPointer(shader.attributes.position.location, 3, gl.FLOAT, false, 0, 0); 
			gl.enableVertexAttribArray(shader.attributes.position.location);
			// color
			gl.bindBuffer(gl.ARRAY_BUFFER, line.colors_vbo);
			gl.vertexAttribPointer(shader.attributes.color.location, 4, gl.FLOAT, false, 0, 0); 
			gl.enableVertexAttribArray(shader.attributes.color.location);
			// draw
			gl.drawArrays(gl.LINE_STRIP, 0, line.numPoints);
		}
	}
	
	Gfw.getCanvas("d2").setActive();
	ctx.save();
	ctx.strokeStyle = "#888888";
	ctx.lineWidth = 1/Gfw.camera.zoom/Gfw.scale*1;
	for(var x = Plotter.bounds.left; x <= Plotter.bounds.right; x++){
		ctx.strokeLine(x, Plotter.bounds.bottom, x, Plotter.bounds.top);
	}
	for(var y = Plotter.bounds.bottom; y <= Plotter.bounds.top; y++){
		ctx.strokeLine(Plotter.bounds.left, y, Plotter.bounds.right, y);
	}	
	ctx.restore();
	ctx.strokeStyle = "white";
	ctx.lineWidth = 1/Gfw.camera.zoom/Gfw.scale*1;
	var bounds = Gfw.camera.bounds;
	var top = bounds.position.y;
	var bottom = top + bounds.height;
	var left = bounds.position.x;
	var right = left + bounds.width;
	var w2 = Math.abs(top-bottom)*2;
	ctx.strokeLine(0, top-w2, 0, bottom+w2);
	ctx.strokeLine(left-w2, 0, right+w2, 0);		
	Gfw.getCanvas("main").setActive();
}