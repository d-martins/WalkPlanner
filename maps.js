//<!--Google Maps--> 
	  google.maps.event.addDomListener(window, 'load', initializeMaps);  
	  var G_geocoder;
	  var G_map;
	  var G_directionsResult;
	  var G_result;
	  var G_status;
	  var G_pontos=new Array();
	  var G_markers=new Array();
	  var G_infoWindow = new google.maps.InfoWindow({maxWidth:200});
//Quando o conteudo da pagina acabar de ser carregado, executa initialize
document.addEventListener('DOMContentLoaded',initialize);
function initialize()
      	{
		  try {
		   	 window.localStorage.setItem("mod", "mod");
		   	 window.localStorage.removeItem("mod");
		    
		    } catch(e) {
		      alert("O seu browser não suporta esta aplicação.\nPor favor actualize-o e tente outra vez.");
		    }
      		
     	 	//Cria a comboBox dos utilizadores
     		 	criaComboBoxUsers();
     		//Verifica se as rotas já estão em localStorage e cria a comboBox 
     	 		verificarRotas();
     	 		
     	 		verificaIntermediosXML();
     	 }
	  
//Determina as opções do mapa e qual a div a este associado
function initializeMaps() 
     	 {
     	 	var mapOptions = {
	 	    	center: new google.maps.LatLng(40.655970, -7.912946),
		        zoom: 11,
		        mapTypeId: google.maps.MapTypeId.ROADMAP
		        };
  	      	G_map = new google.maps.Map(document.getElementById("map-canvas"),
  	        mapOptions);
  	        G_geocoder=new google.maps.Geocoder();
  	        G_directionsResult=new google.maps.DirectionsRenderer({map:G_map, suppressMarkers: true});
  	        google.maps.event.addListener(G_map, "click",function(event){ mapClick(event.latLng)});
  	     }
 
function mapClick(location,interesse) 
		{		
			if($("#rotas").val()=='selecione'){
				$("#rotas").val('novo').change();
				G_pontos=new Array();		
			}
			
			if(G_pontos.length<10)
			{
				G_pontos[G_pontos.length]=location;
				if(G_pontos.length==1)
					adicionarCampoRota(interesse);
					
				var waypoints=new Array();
				for(var i=1;i<G_pontos.length-1;i++)
				{
					waypoints[i-1]=G_pontos[i];
				}
				
				desenhaRota(interesse,true);
				
			}	
			
	}	
		
		var directionsService = new google.maps.DirectionsService();
				   
		function desenhaRota(interesse,mapClick)
		{	
			G_map.setOptions({draggableCursor:"progress"});
			$("#map-canvas").css("pointer","progress");
			$("body").css("pointer","progress");
			
			var origem=G_pontos[0];
			var destino=G_pontos[G_pontos.length-1];
			
			var waypoints=new Array();
			for(var i=1;i<G_pontos.length-1;i++)
			{
				waypoints[i-1]=G_pontos[i];
			}			
			
			var pontos=new Array();
            if(waypoints !=null){
				for(var i=0;i<waypoints.length;i++)
				{
					pontos[i]={
						location: waypoints[i],
						stopover:true
					};				
				}
			}
			//waypoints=[{location:"Aveiro",stopover:true}];
			var request={
				origin:origem,
    			destination:destino,    			
    			waypoints:pontos,
    			travelMode: google.maps.TravelMode.WALKING
			}
			var direction= new google.maps.DirectionsService();
			if(G_directionsResult==null)
				G_directionsResult=new google.maps.DirectionsRenderer({map:G_map, suppressMarkers: true});

			route(direction, request, G_pontos.length, interesse,mapClick);
		}   
		
	function route(direction,request, length, interesse, mapClick){
		direction.route(request, function(response, status){
				
			if (status == google.maps.DirectionsStatus.OK) {
				if(mapClick)
					adicionarCampoRota(interesse);
				G_directionsResult.setDirections(response);
				G_result=response;
				G_status=status;
				G_map.setOptions({draggableCursor:null});
				
				var legs=response.routes[0].legs;
				for(var i=0;i<G_markers.length;i++)
					G_markers[i].setMap(null);
				G_markers=new Array();
				for(var i=0; i<= legs.length;i++)
				{	
					var option={
						position: G_pontos[i],
						map: G_map
					}
					var marker=new google.maps.Marker(option);
					if(i==0)
						marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
					 bindInfoWindow(marker, i);
					
					G_markers[i]=marker;
				}
				if($("#users").valid() && G_pontos.length>1)
					 processaResultados();
			}
			else{
				alert ("Caminho não encontrado");
				G_map.setOptions({draggableCursor:null});
				G_pontos.splice(length-1,1);
			}
		});
	}
	
	function bindInfoWindow(marker, i)
	{
		var texto;
		google.maps.event.addListener(marker, 'mouseover',function(){
			if(i==0)
			{
				if($("#origem").attr("interesse")=="true")
				{
					texto=pInt[$("#origem").attr("pos")].descricao;
				}
				else 
					texto=$("#origem").val();
			}
			else if(i==G_pontos.length-1)
			{
				if($("#destino").attr("interesse")=="true")
				{
					texto=pInt[$("#destino").attr("pos")].descricao;
				}
				else 
					texto=$("#destino").val();
					
			}
			else if($("#interesse"+i).attr("interesse")=="true")
			{
				texto=pInt[$("#interesse"+i).attr("pos")].descricao;	
			}
			else
				texto=$("#interesse"+i).val();
				
			G_infoWindow.setContent(texto);
			G_infoWindow.open(G_map,marker);
		});
		google.maps.event.addListener(marker, 'mouseout',function(){
			G_infoWindow.close();			
		});
	}
	
     function processaResultados()
      {	
      		var result=G_result;
      		var dinamicos=$("#dinamicos ul");
      	   	dinamicos.html("");   
      	    $("#estaticos").html("");
      	    	
      		var distanciaTotal =0;
			var duracaoTotal=0;
			
			
			
			var legs=result.routes[0].legs;
			
			var tempoPassado=0;
			var tempoExtra=0;
			
			for(var j=0;j<legs.length;j++){
				
				distanciaTotal+=result.routes[0].legs[j].distance.value;
				duracaoTotal+=result.routes[0].legs[j].duration.value;
				
				if(j==0){
					if($("#origem").attr("interesse")=="true")
					{
						var t=parseInt($("#origem").attr("pos"));
						dinamicos.append("<li class='instrucao ponto'>"+pInt[t].instrucao+"</li>");						
					}
					else
						dinamicos.append("<li class='instrucao ponto'>"+$("#origem").val()+"</li>");
				}
				else if($("#interesse"+j).attr("interesse")=="true")
				{
					var t=parseInt($("#interesse"+j).attr("pos"));
					dinamicos.append("<li class='instrucao ponto'>"+pInt[t].instrucao+"</li>");
				}
				else
					dinamicos.append("<li class='instrucao ponto'>"+$("#interesse"+j).val()+"</li>");
				
				var steps=result.routes[0].legs[j].steps;
				for(var i=0;i<steps.length;i++)
				{
					var intrucao;
					var tempo;
					var distance;
					
					if(tempoPassado>=2700)
					{
						instrucao = "Fa&ccedil;a uma pequena pausa de 10 minutos";
						tempoExtra+=600;
						i--;
						tempoPassado=0;
						distance=0;
						tempo=600;
					}
					else{
						instrucao = steps[i].instructions;
						tempoPassado+=steps[i].duration.value;
						distance=steps[i].distance.value;
						tempo=steps[i].duration.value;
					}
					
					tempo=(tempo/60).toFixed(0);
					distance=distance/1000;
	 				dinamicos.append("<li><div class='instrucao'>"+instrucao+"</div><div class='extra'><div class='tempo'>"
	 					+tempo+"mins</div><div class='duracao'>"+distance+"m</div></div></li>");
	 						
					$("#instrucoes").css("display","block");
				}	
			}
			
			if($("#destino").attr("interesse")=="true")
			{
				var t=parseInt($("#destino").attr("pos"));
				dinamicos.append("<li class='instrucao ponto'>"+pInt[t].instrucao+"</li>");	
			}
			
			dinamicos.append("<li class='instrucao final'>Está terminada a caminhada.</li>");	
			
			var duracaoHoras=duracaoTotal/3600;
			
			var BRM= calculaBRM();
			var MET=2.9 //Valor MET para caminhadas 4km/h
			var calorias= (BRM/24)*MET*duracaoHoras;
			
			var volumeagua=(calorias)/1000;
			//$("#calorias").append(calorias.toFixed(0));
			//$("#agua").append(volumeagua.toFixed(0));
			
			var duracaoReal=secondsToTime(duracaoTotal + tempoExtra);
						
			//alert(duracaoReal+"\n"+duracaoRealMinutos+"\n"+duracaoRealHoras);
			
			$("#estaticos").append("Calorias Gastas: <b>"+ formatCalorias(calorias)+"</b>");
			$("#estaticos").append("<br />Água Recomendada: <b>"+ formatVolume(volumeagua) +"</b>");
			$("#estaticos").append("<br />Duração: <b>"+duracaoReal+"min </b>");
			$("#estaticos").append("<br />Distância: <b>"+formatDistance(distanciaTotal)+"</b>");
	}

function calculaBRM(){
	//equacao de Harris-Benedict
	var BRM;
	var sexo=$("#sexo").val();
	var peso=$("#peso").val();
	var altura=$("#altura").val();
	var idade=$("#idade").val();
	
	if(sexo=="M")		
		BRM=88.362+(13.397*peso)+(4.799*altura)-(5.677*idade);
	else
		BRM=447.593+(9.247*peso)+(3.098*altura)-(4.330*idade);
	return BRM;
}

function secondsToTime(secs)
{
	var s="";
	
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
   
    s+=hours.toFixed(0)+"h:"+minutes.toFixed(0);
  
    return s;
}
function formatDistance(meters)
{
	var s="";
	
	if(meters>=1000)
		s=(meters/1000).toFixed(1)+" km"
	else
		s=meters.tofixed(0)+" m"
	return s;
}
function formatCalorias(calorias)
{
	var s="";
	
	if(calorias>=1000)
		s=(calorias/1000).toFixed(0)+" kcal"
	else
		s=calorias.toFixed(0)+" cal"
	return s;
}
function formatVolume(litros)
{
	var cl=litros/100
	var s="0";
	
	if(litros>=1)
		s=(litros).toFixed(0)+" L"
	else
		s=(litros/100).toFixed(0)+" cL"
	return s;
}
