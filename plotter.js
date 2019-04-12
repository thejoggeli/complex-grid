function Plotter(){}
Plotter.expression = "";
Plotter.bounds = {
	left: -10,
	right: 10,
	top: 10,
	bottom: -10,
};
Plotter.gridStep = 1;
Plotter.gridDetail = 1;
Plotter.transition = 1;
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
	Plotter.textureShader.addUniform("iTexture");
	// lines
	Plotter.lines = {
		h: [],
		v: [],
	};
	Plotter.allLines = [];
	var hrange = Plotter.bounds.right - Plotter.bounds.left;
	var vrange = Plotter.bounds.top - Plotter.bounds.bottom;
	var hmax = Plotter.gridDetail * hrange;
	var vmax = Plotter.gridDetail * vrange;
	for(var h = 0; h <= hmax; h++){
		Plotter.lines.h[h] = Plotter.generateLine(vmax+1);
		Plotter.allLines.push(Plotter.lines.h[h]);
	}	
	for(var v = 0; v <= vmax; v++){
		Plotter.lines.v[v] = Plotter.generateLine(hmax+1);	
		Plotter.allLines.push(Plotter.lines.v[v]);
	}
	for(var h = 0; h <= hmax; h++){
		var line = Plotter.lines.h[h];
		var c1 = h/hmax;
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
	for(var v = 0; v <= vmax; v++){
		var line = Plotter.lines.v[v];
		var c1 = v/vmax;
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
	// texture
	var num_x = Plotter.lines.v.length;
	var num_y = Plotter.lines.h.length;
	var plane = {
		positions: [],
		positions_vbo: gl.createBuffer(),
		indices: [],
		indices_vbo: gl.createBuffer(),
		texcoords: [],
		texcoords_vbo: gl.createBuffer(),
		texture: null,
		numPoints: num_x * num_y,
		num_x: num_x,
		num_y: num_y,
	};
	Plotter.plane = plane;
	// positions
	for(var y = 0; y < num_y; y++){
		for(var x = 0; x < num_x; x++){	
			plane.positions.push(x);
			plane.positions.push(y);
			plane.positions.push(0);
		}
	}	
	// indices
	for(var x = 1; x < num_x; x++){
		for(var y = 1; y < num_y; y++){
			var i1 = y*num_x+x; // bottom right
			var i2 = y*num_x+(x-1); // bottom left
			var i3 = (y-1)*num_x+x; // top right
			var i4 = (y-1)*num_x+(x-1); // top left
			plane.indices.push(i4, i3, i2);
			plane.indices.push(i3, i2, i1);
		}
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.positions_vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(plane.positions), gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.indices_vbo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(plane.indices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.texcoords_vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(plane.texcoords), gl.STATIC_DRAW);	
	console.log(plane);
	
//	Plotter.setExpression("(x+y*i)^2*0.05");
//	Plotter.setExpression("(x+y*i)^9*0.000000001");
//	Plotter.setExpression("sin(x+y*i)*0.001");
//	Plotter.setExpression("(x+y*i)*(1+1i)");
//	Plotter.setExpression("-1/z^2*50");
//	Plotter.setExpression("(4i*(x+y*i)-12)/(-(x+y*i)*3i)");
//	Plotter.setExpression("(x+y*i)*(1+i)*(1.5)+2+2i");
	Plotter.setExpression("(x+y*i)^2*0.05");
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
Plotter.setExpression = function(exp){
	Plotter.expression = exp;
	Plotter.expression = Plotter.expression.replace("z", "(x+y*i)");
	Plotter.compiled = math.compile(Plotter.expression);
}
Plotter.plot = function(){
	var s = Plotter.transition;
	var compiled = Plotter.compiled;
	var w = Plotter.bounds.right - Plotter.bounds.left;
	var h = Plotter.bounds.top - Plotter.bounds.bottom;
	var lines = Plotter.lines;
	var xsteps = lines.v.length-1;
	var ysteps = lines.h.length-1;
	for(var i = 0; i <= xsteps; i++){
		var x = Plotter.bounds.left + i/Plotter.gridDetail;
		var red = Math.floor(i/xsteps*255);
		for(var j = 0; j <= ysteps; j++){
			var y = Plotter.bounds.bottom + j/Plotter.gridDetail;
			var result = compiled.eval({x: x, y: y});
			var blue = Math.floor(j/ysteps*255);
			var dx = result.re - x;
			var dy = result.im - y;
			var xx = x + dx*s;
			var yy = y + dy*s;
			lines.h[j].positions[i*3] = xx;
			lines.h[j].positions[i*3+1] = yy;
			lines.v[i].positions[j*3] = xx;
			lines.v[i].positions[j*3+1] = yy;
		}
	}
	for(var i = 0; i < Plotter.allLines.length; i++){
		var line = Plotter.allLines[i];
		gl.bindBuffer(gl.ARRAY_BUFFER, line.positions_vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line.positions), gl.DYNAMIC_DRAW);
	}	
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
	shader = Plotter.textureShader;
	shader.use();
	var plane = Plotter.plane;
	gl.uniformMatrix4fv(shader.uniforms.matrix.location, false, matrix);
	// position
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.positions_vbo);
	gl.vertexAttribPointer(shader.attributes.position.location, 3, gl.FLOAT, false, 0, 0); 
	gl.enableVertexAttribArray(shader.attributes.position.location);
	// draw
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.indices_vbo);
	gl.drawElements(gl.TRIANGLES, plane.numPoints, gl.UNSIGNED_SHORT, 0);
	
	// lines
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
	ctx.strokeLine(0, top, 0, bottom);
	ctx.strokeLine(left, 0, right, 0);		
	Gfw.getCanvas("main").setActive();
}