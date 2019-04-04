function Plotter(){}
Plotter.expression = "";
Plotter.bounds = {
	left: -10,
	right: 10,
	top: 10,
	bottom: -10,
};
Plotter.gridStep = 1;
Plotter.gridDetail = 2;
Plotter.transition = 1;
Plotter.init = function(){
	Plotter.setExpression("(x+y*i)^2*0.05");
//	Plotter.setExpression("sin(x+y*i)*0.001");
//	Plotter.setExpression("(x+y*i)*(1+1i)");
//	Plotter.setExpression("-1/z^2*50");
}
Plotter.setExpression = function(exp){
	Plotter.expression = exp;
	Plotter.expression = Plotter.expression.replace("z", "(x+y*i)");
	Plotter.compiled = math.compile(Plotter.expression);
}
Plotter.plot = function(){	
	Plotter.grid = [];
	var s = Plotter.transition;
	var compiled = Plotter.compiled;
	var w = Plotter.bounds.right - Plotter.bounds.left;
	var h = Plotter.bounds.top - Plotter.bounds.bottom;
	var xsteps = w*Plotter.gridDetail;
	var ysteps = h*Plotter.gridDetail;
	for(var i = 0; i <= xsteps; i++){
		var x = Plotter.bounds.left + i/Plotter.gridDetail;
		Plotter.grid[i] = [];
		var red = Math.floor(i/xsteps*255);
		for(var j = 0; j <= ysteps; j++){
			var y = Plotter.bounds.bottom + j/Plotter.gridDetail;
			var result = compiled.eval({x: x, y: y});
			var blue = Math.floor(j/ysteps*255);
			var dx = result.re - x;
			var dy = result.im - y;
			Plotter.grid[i][j] = {
				x: x + dx*s,
				y: y + dy*s,
			//	color: Colors.rgbToHex(red, 255-blue, blue),
			};
		}		
	}
}
Plotter.render = function(){
	
	ctx.save();
	ctx.scale(1,-1);
	ctx.strokeStyle = "#888888";
	ctx.lineWidth = 1/Gfw.camera.zoom*0.5;
	for(var x = Plotter.bounds.left; x <= Plotter.bounds.right; x++){
		ctx.strokeLine(x, Plotter.bounds.bottom, x, Plotter.bounds.top);
	}
	for(var y = Plotter.bounds.bottom; y <= Plotter.bounds.top; y++){
		ctx.strokeLine(Plotter.bounds.left, y, Plotter.bounds.right, y);
	}	
	ctx.restore();
	
	
	ctx.strokeStyle = "white";
	ctx.lineWidth = 1/Gfw.camera.zoom*0.5;
	var bounds = Gfw.camera.bounds;
	var top = bounds.position.y;
	var bottom = top + bounds.height;
	var left = bounds.position.x;
	var right = left + bounds.width;
	ctx.strokeLine(0, top, 0, bottom);
	ctx.strokeLine(left, 0, right, 0);		
	
	ctx.save();
	ctx.scale(1,-1);	
	ctx.lineWidth = 1/Gfw.camera.zoom*0.5;
	var grid = Plotter.grid;
	if(false){	
		for(var x = 0; x < grid.length; x+=Plotter.gridDetail){	
			for(var y = 0; y < grid[0].length-1; y++){
				ctx.beginPath();
				ctx.lineTo(grid[x][y].x, grid[x][y].y);
				ctx.lineTo(grid[x][y+1].x, grid[x][y+1].y);
				ctx.strokeStyle = grid[x][y].color;
				ctx.stroke();
			}
		}	
		for(var y = 0; y < grid[0].length; y+=Plotter.gridDetail){	
			for(var x = 0; x < grid.length-1; x++){
				ctx.beginPath();
				ctx.lineTo(grid[x][y].x, grid[x][y].y);
				ctx.lineTo(grid[x+1][y].x, grid[x+1][y].y);
				ctx.strokeStyle = grid[x][y].color;
				ctx.stroke();
			}
		}		
	} else {
		ctx.strokeStyle = "cyan";
		for(var x = 0; x < grid.length; x+=Plotter.gridDetail){	
			ctx.beginPath();
			for(var y = 0; y < grid[0].length; y++){
				ctx.lineTo(grid[x][y].x, grid[x][y].y);
			}
			ctx.stroke();
		}	
		for(var y = 0; y < grid[0].length; y+=Plotter.gridDetail){	
			ctx.beginPath();
			for(var x = 0; x < grid.length; x++){
				ctx.lineTo(grid[x][y].x, grid[x][y].y);
			}
			ctx.stroke();
		}		
	}
	ctx.restore();
}