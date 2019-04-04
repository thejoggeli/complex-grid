$(document).ready(function(){
	Monitor.setup({showTitle: false});	// setup Gfw 
	Gfw.setup({scaling:true, height:100});
	Gfw.createCanvas("main", {"renderMode": RenderMode.Canvas2d});
	Gfw.getCanvas("main").setActive();
	Gfw.onUpdate = onUpdate;
	Gfw.onRender = onRender;
	Gfw.onResize = onResize;
	Gfw.setBackgroundColor("#000000");
	// init
	onInit();
	Gfw.start();
});

function onInit(){
	Gfw.camera.zoom = 3.5;
	Plotter.init();
	Plotter.transition = 1;
	Plotter.plot();
}

function onResize(){
	
}

function onUpdate(){
	if(Input.isKeyDown(37)){
		Plotter.transition = Numbers.clamp(Plotter.transition-Time.deltaTime, 0, 1);
		Plotter.plot();
	} else if(Input.isKeyDown(39)){
		Plotter.transition = Numbers.clamp(Plotter.transition+Time.deltaTime, 0, 1);
		Plotter.plot();	
	}
	if(Input.keyDown(48+1)){
		Plotter.transition = 0;
		Plotter.plot();
	} else if(Input.keyDown(48+2)){
		Plotter.transition = 1;
		Plotter.plot();
	}
	if(Input.keyDown(48+3)){
		Plotter.gridDetail = Numbers.clamp(Plotter.gridDetail-1, 1, 1000);
		Plotter.plot();
	} else if(Input.keyDown(48+4)){
		Plotter.gridDetail = Numbers.clamp(Plotter.gridDetail+1, 1, 1000);
		Plotter.plot();
	}
	Gfw.cameraMovement(50);
	Gfw.camera.recalcBounds();
	// monitor stuffs
	Monitor.set("FPS", Time.fps);
	Monitor.set("Expression", Plotter.expression);
	Monitor.set("Transition", roundToFixed(Plotter.transition, 3));
	Monitor.set("Detail", Plotter.gridDetail);
}

function onRender(){
	Plotter.render();
}















