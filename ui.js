function Ui(){
	
}
Ui.init = function(){
	$("#ui input[type=text]").on("keyup", function(e){
		if(e.keyCode == 13){
			$(".plot-it").trigger("click");
		}
	});		
	$("#ui .minimize").on("click", function(){
		$("#ui .maximize").show();
		$("#ui .minimize").hide();
		$("#ui .category").hide();
	});
	$("#ui .maximize").on("click", function(){
		$("#ui .maximize").hide();
		$("#ui .minimize").show();
		$("#ui .category").show();		
	});
	$(".plot-it").on("click", function(){
		Plotter.setExpression($(".expression").val());
		Plotter.refresh();
		Ui.toCookie();
	});	
	$(".show-grid").on("click", function(){
		$(this).toggleClass("active");
		Plotter.drawLines = !Plotter.drawLines;
		Ui.toCookie();
	});
	$(".show-texture").on("click", function(){
		$(this).toggleClass("active");
		Plotter.drawPlane = !Plotter.drawPlane;
		Ui.toCookie();
	});	
	$(".detail-down").on("click", function(){
		Ui.setDetail(parseInt($(".detail").val())-1);
	});
	$(".detail-up").on("click", function(){
		Ui.setDetail(parseInt($(".detail").val())+1);
	});
	Ui.fromCookie();
}
Ui.setDetail = function(v){
	if(v < 1) v = 1;
	if(v > 8) v = 8;
	$(".detail").val(v);
	Plotter.gridDetail = v;
	Plotter.refresh();
	Ui.toCookie();	
}
Ui.apply = function(){
	Plotter.gridDetail = parseInt($(".detail").val());
	Plotter.drawLines = $(".show-grid").hasClass("active");
	Plotter.drawPlane = $(".show-texture").hasClass("active");
	Plotter.setExpression($(".expression").val());
}
Ui.toggles = [
	"show-grid",
	"show-texture",
];
Ui.fromCookie = function(){
	$("#ui input[type=text], #ui input[type=range]").each(function(){
		var name = "ui-" + $(this).attr("name");
		var val = Storage.window.get(name, null);
		if(val !== null){
			$(this).val(val);
		}
	});
	for(var t in Ui.toggles){
		var name = "ui-" + Ui.toggles[t];
		var val = Storage.window.get(name, null);
		if(val !== null){
			if(val){
				$("."+Ui.toggles[t]).addClass("active");
			} else {
				$("."+Ui.toggles[t]).removeClass("active");
			}
		}
	}
}
Ui.toCookie = function(){
	$("#ui input[type=text], #ui input[type=range]").each(function(){
		var name = "ui-" + $(this).attr("name");
		var val = $(this).val();
		Storage.window.set(name, $(this).val());
	});
	for(var t in Ui.toggles){
		var name = "ui-" + Ui.toggles[t];
		var val = $("."+Ui.toggles[t]).hasClass("active");
		Storage.window.set(name, val);
	}
}