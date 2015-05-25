var camposRotasExistem;
var G_origem;
var G_destino;
var G_waypoints=new Array();
//Função executada pelo botão Eliminar Rota
function submitEliminarRota()
		{	
		//Procura o elemento no HTML com o id "rotas" e guarda na variavel comboUser		
			var comboRota=document.getElementById("rotas");
		//Guarda o valor da opção selecionada, na variável valor 			
			var valor = comboRota.value;//este valor é o que está no value="x", não o texto mostrado pela comboBox
			
		//Se o campo selecionado da comboBox não for o "Novo" nem o "Selecione"	
			if(valor.value!="novo" && valor.value!="Selecione")
			{
				//Como o value guarda o id da rota	
				//Executa a função removeRota, com o id da rota selecionada como parametro
					removeRota(valor);
				//Depois de finalizada a operação, faz reload da página	
					window.location.reload();				
			}				
		}

//Remove do XML guardado em localStorage, os dados da rota com o id recebido		
function removeRota(id)
		{
		//Retira da localStorage o ficheiro XML (em string) com as rotas
			var xmlDoc=localStorage.getItem("dadosRotas");
		//Como o xmlDoc está em string, convertemo-lo para XML, para podermos navegá-lo com as funções do DOM
			xmlDoc=new window.DOMParser().parseFromString(xmlDoc,"text/xml");
		
		//Procura no XML, o elemento cujo id corresponde ao recebido e guarda-o em rota	
			var rota=xmlDoc.getElementById(id);
		//getElementById não funciona para XML no IE e Firefox
			if(rota==null)
			{
				var rotas=xmlDoc.getElementsByTagName("Rota");
				for(i=0;i<rotas.length;i++)
				{
					if(rotas[i].attributes["id"].value==id)
					{
						rota=rotas[i];
						break;
					}
				}
			}
			
		//Vai ao elemento pai de rota (dadosRotas) e remove o elemento
			rota.parentNode.removeChild(rota);
		
		//Volta a converter o documento numa string, para poder ser armazenado em localStorage	
			xmlDoc=new XMLSerializer().serializeToString(xmlDoc);
			localStorage.setItem("dadosRotas",xmlDoc);
			
		
		}

       
//Verifica se já existem rotas guardadas na localStorage
function verificarRotas()
    	{
    	//Se ainda não existirem rotas na localStorage
    		if(localStorage.getItem("dadosRotas")==null)
    			criarRotas();//Cria um ficheiro XML com as rotas na localStorage
    	//Cria a comboBox das rotas
    		criaComboBoxRotas();
    	}
    	
//Cria ficheiro de rotas na localStorage
function criarRotas()
    	{
    	//Cria um array com nomes de rotas
    		var nomes=["Passeio Viseu","Passeio Mangualde"];
    	//cria um array com pontos de origem
    		var origens=[{nome:"Montebelo 2, 3510-014 Viseu, Portugal", lat:40.65599686889035,lng:-7.924715280532837},{nome:"Live Beach", lat:40.61173,lng:-7.74837,interesse:2}];
    	//cria um array com pontos de destino
    		var destinos=[{nome:"Fontelo",lat:40.65886,lng:-7.90115,interesse:0},{nome:"Igreja Nossa Senhora do Castelo",lat:40.61227,lng:-7.74411,interesse:7}];
    	
    		var waypoints1=[{nome:"Museu Grao Vasco",lat:40.66016,lng:-7.91078,interesse:1}];
    		var waypoints2=[{nome:"Jardim do Rossio",lat:40.60467,lng:-7.75941,interesse:8}];
    		
    		var waypoints=[waypoints1,waypoints2];
    	
    		for(var i=0;i<2;i++)
    		{
    		//Adiciona as rotas ao ficheiro XML com os dados defenidos anteriormente
    			adicionarRota(nomes[i],origens[i],destinos[i],waypoints[i]);
    		}
    					
    	}
    	
function submitRota(){
	if(G_pontos.length<2)
	{
		return;
	}
	
	var nome=$("#nomeRota").val();
	
	if(!nome.trim()){
		return;
	}
	
	var origem=$("#origem");
	var origem={nome:origem.val(),
				lat:origem.attr("lat"),
				lng:origem.attr("lng")
				}
	if($("#origem").attr("interesse")=="true")
	{
		origem=$.extend(origem,{interesse:$("#origem").attr("pos")});
	}
	
	var destino=$("#destino");

	var destino={nome:destino.val(),
				lat:destino.attr("lat"),
				lng:destino.attr("lng")
		}
	if($("#destino").attr("interesse")=="true")
	{
		destino=$.extend(destino,{interesse:$("#destino").attr("pos")});
	}
	
	//alert(origem.nome+"\n"+origem.lat+"\n"+origem.lng+"\n"+origem.interesse);
	
	var waypoints=new Array();
	
	for(var i=1; i<=8;i++){
		var e=$("#interesse"+i);
		if(e.css("display")!="none" && e.val()!= ''){
			
			var ponto={nome:e.val(),
					lat:e.attr("lat"),
					lng:e.attr("lng")
					}
			if(e.attr("interesse")=="true")
			{
				ponto=$.extend(ponto,{interesse:e.attr("pos")});
			}
			
			waypoints[i-1]=ponto;
		}
	}
	adicionarRota(nome,origem,destino,waypoints);
	
	criaComboBoxRotas();
	$("#rotas option:last").attr("selected","selected");
	$("#rotas").change();
	
}

//adiciona rota ao xml
function adicionarRota(nome, origem, destino,intermedios)
		{
			var xmlDoc;
		//Se o ficheiro das rotas ainda não existir na localStorage
			if(localStorage.getItem("dadosRotas")==null)			
				{
				//cria um novo documento XML com o elemento principlal <dadosRotas /> 
					xmlDoc=document.implementation.createDocument(null,"dadosRotas",null);
		
				}	
		//Se o ficheiro já estiver na localStorage		
			else
				{
				//Retira da localStorage o ficheiro XML (em string) com as rotas e converte-o para XML
					xmlDoc=new window.DOMParser().parseFromString(localStorage.getItem("dadosRotas"),"text/xml");
				}
			
		
			var id=0;
			
			var rotas=xmlDoc.getElementsByTagName("Rota");
			for(i=0;i<rotas.length;i++)
			{	
				if(rotas[i].attributes["id"].value==id)
				{
					id++; i=0;
				}
			}
			
		//Para cada campo da rota, guarda o valor numa variavel
			var nome = xmlDoc.createTextNode(nome);//o textNode é onde o valor do elemento é armazenado
			var iNome = xmlDoc.createTextNode(origem.nome);
			var fNome = xmlDoc.createTextNode(destino.nome);
			var iLatitude = xmlDoc.createTextNode(origem.lat);//<latitude>[isto é a textNode]</latitude>
    		var fLatitude = xmlDoc.createTextNode(destino.lat);
    		var iLongitude = xmlDoc.createTextNode(origem.lng);
    		var fLongitude = xmlDoc.createTextNode(destino.lng);
    		var linguagem=xmlDoc.createTextNode("pt-PT");
    		var sistema=xmlDoc.createTextNode("metric");
    	
    	//Para cada campo da rota cria-se um elemento XML
    		var rotaElement=xmlDoc.createElement("Rota");//<Rota />
    		var nomeElement =xmlDoc.createElement("nome");//<nome />
    		var inomeElement = xmlDoc.createElement("nome");
    		var inicioElement =xmlDoc.createElement("inicio");//<inicio />
    		var iLatitudeElement=xmlDoc.createElement("latitude");//<latitude />
    		var iLongitudeElement=xmlDoc.createElement("longitude");//<longitude />		
    		var fnomeElement = xmlDoc.createElement("nome");
    		var fimElement =xmlDoc.createElement("fim");//<fim />
    		var fLatitudeElement=xmlDoc.createElement("latitude");//<latitude />
    		var fLongitudeElement=xmlDoc.createElement("longitude");//<longitude />
    		var linguagemElement =xmlDoc.createElement("linguagem");//<linguagem />
    		var sistemaElement =xmlDoc.createElement("sistemaUnidade")//<sistemaUnidade />
    	
    	//Colocam-se as textNodes (os valores) dentro dos elementos respectivos
    		nomeElement.appendChild(nome);//<nome>[nome]</nome>
    		
    		inomeElement.appendChild(iNome);	
    		iLatitudeElement.appendChild(iLatitude);//<latitude>[iLatitude]</latitude>
    		iLongitudeElement.appendChild(iLongitude);//<longitude>[iLongitude]</longitude>
    		
    		//											<inicio>
    		
    		inicioElement.appendChild(inomeElement);
    		inicioElement.appendChild(iLatitudeElement);//	<latitude>[iLatitude]</latitude>
    		inicioElement.appendChild(iLongitudeElement);//	<longitude>[iLongitude]</longitude>
    		//											</inicio>
    		if(origem.interesse!==undefined)
    			inicioElement.setAttribute("idPonto",origem.interesse);
    		
    		
    		fnomeElement.appendChild(fNome);
    		fLatitudeElement.appendChild(fLatitude);//<latitude>[fLatitude]</latitude>
    		fLongitudeElement.appendChild(fLongitude);//<longitude>[fLongitude]</longitude>
    		
    		//										<inicio>
    		fimElement.appendChild(fnomeElement);
    		fimElement.appendChild(fLatitudeElement);//	<latitude>[fLatitude]</latitude>
    		fimElement.appendChild(fLongitudeElement);//<longitude>[fLongitude]</longitude>
    		//										</inicio>	
   			if(destino.interesse!==undefined)
    			fimElement.setAttribute("idPonto",destino.interesse);
    			
   			linguagemElement.appendChild(linguagem);//<linguagem>[linguagem]</linguagem>
   			sistemaElement.appendChild(sistema);//<sistemaUnidade>[sistema]</sistemaUnidade>
   			
   			rotaElement.setAttribute("id",id)//<Rota id=[id] />
   			
   		//Colocam-se todos os elementos criados anteriormente, dentro do elmento Rota
    		rotaElement.appendChild(nomeElement);
    		rotaElement.appendChild(inicioElement);
    		for(i=0;i<intermedios.length;i++)
   			{
   				var intermedio=intermedios[i];
   				var intermedioElement=xmlDoc.createElement("intermedio");
   				
   				var nome=xmlDoc.createTextNode(intermedio.nome);
   				var latitude=xmlDoc.createTextNode(intermedio.lat);
   				var longitude=xmlDoc.createTextNode(intermedio.lng);
   				
   				var nomeElement=xmlDoc.createElement("nome");
   				var latitudeElement=xmlDoc.createElement("latitude");
   				var longitudeElement=xmlDoc.createElement("longitude");
   				
   				nomeElement.appendChild(nome);
   				latitudeElement.appendChild(latitude);
   				longitudeElement.appendChild(longitude);
   				
   				intermedioElement.appendChild(nomeElement);
   				intermedioElement.appendChild(latitudeElement);
   				intermedioElement.appendChild(longitudeElement);
   				if(intermedio.interesse!==undefined)
    				intermedioElement.setAttribute("idPonto",intermedio.interesse);
   				
   				rotaElement.appendChild(intermedioElement);   				
   			}
    		rotaElement.appendChild(fimElement);
    		rotaElement.appendChild(linguagemElement);
    		rotaElement.appendChild(sistemaElement);
    		
    	//Adiciona-se o elemento Rota ao elemento base do ficheiro XML (dadosRotas)
    		xmlDoc.documentElement.appendChild(rotaElement);
   			
   		//Volta a converter o documento numa string, para poder ser armazenado em localStorage
   			var xmlDoc=new XMLSerializer().serializeToString(xmlDoc);	
			localStorage.setItem("dadosRotas",xmlDoc);    		
			
		}  
		
//Coloca rotas na comboBox
function criaComboBoxRotas()
		{
			var xmlDoc= localStorage.getItem("dadosRotas");
            xmlDoc= new window.DOMParser().parseFromString(xmlDoc, "text/xml");
			
			$("#rotas").html("");
			$("#rotas").append("<option value='selecione'>-- Selecione --</option>");
			$("#rotas").append("<option value='novo'>-- Novo --</option>");
			
			var rotas=xmlDoc.getElementsByTagName("Rota");	
			
			for(var i=0;i<rotas.length;i++)
			{
					var rota = rotas[i];
					var nomeRota = rota.getElementsByTagName("nome")[0];
					var idRota = rota.attributes["id"].value
					
					$("#rotas").append('<option value='+idRota+'>'+nomeRota.firstChild.nodeValue+'</option>');
			}
		}
		
function checkComboBoxRotas()
		{
		//Procura o elemento cujo id="comboRota", no HTML e guarda-o numa variavel
			var comboBox=document.getElementById("rotas");
			
		//Se a opção selecionada tiver o valor "selecione"
			if(comboBox.value=="selecione" )
			{
				$("#camposRota").hide();
			}
		//Se a opção selecionada tiver o valor "novo"
			else if(comboBox.value=="novo" )
    		{
    		//se já existirem os campos, não os vai duplicar
    			$("#camposRota").show();
    			$("#botaoAdicionarRota").show();
    			$("#botaoActualizarRota").hide();    			
    			$("#botaoEliminarRota").hide();
    			//Limpa os valores dos campos da rota
    			limpaCamposRotas();
    			G_directionsResult.setMap(null);
    			G_directionsResult=null;
    			for(var i=0;i<G_markers.length;i++)
					G_markers[i].setMap(null);
    			G_pontos=new Array();
    			
    		}
    	//Se não (o valor é o id de uma Rota)
    		else
    		{
    		//se já existirem os campos, não os vai duplicar
    			$("#camposRota").show();    			
    			//Chama a funcção  preencheCamposRotas enviando o valor da comboBox (o id da rota)
    				$("#botaoAdicionarRota").hide();
    				$("#botaoActualizarRota").show();
    				$("#botaoEliminarRota").show();
    				limpaCamposRotas();
    				preencheCamposRotas(comboBox.value);
    				desenhaRota();
    		}
		}
		
		
//Preenche os campos do formulário, de acordo com os dados de uma Rota
function preencheCamposRotas(id)
		{
		//Retira da localStorage o ficheiro XML (em string) com as Rotas
			var xmlDoc=localStorage.getItem("dadosRotas");
		//Como o xmlDoc está em string, convertemo-lo para XML, para podermos navegá-lo com as funções do DOM
			xmlDoc=new window.DOMParser().parseFromString(xmlDoc,"text/xml");
		
		//Guarda o elemento correspondente à rota na variavel rotas
			var rota=xmlDoc.getElementById(id);
		//getElementById não funciona para XML no IE e Firefox
			if(rota==null)
			{
				var rotas=xmlDoc.getElementsByTagName("Rota");
				for(i=0;i<rotas.length;i++)
				{
					if(rotas[i].attributes["id"].value==id)
					{
						rota=rotas[i];
						break;
					}
				}
			}
			
		//Procura os valores de cada elemento da rota e guarda-o numa variavel 	
			var nomeRota=rota.getElementsByTagName("nome")[0].firstChild.nodeValue;//<NomeRota>[guarda este conteúdo]</NomeRota>
			var origem=rota.getElementsByTagName("inicio")[0];//<origem>[guarda este conteúdo]</origem>
			var destino=rota.getElementsByTagName("fim")[0];//<destino>[guarda este conteúdo]</destino>
			
			var NomeOrigem=origem.getElementsByTagName("nome")[0].firstChild.nodeValue;//<destino>[guarda este conteúdo]</destino>
			var LatitudeOrigem=origem.getElementsByTagName("latitude")[0].firstChild.nodeValue;//<destino>[guarda este conteúdo]</destino>
			var LongitudeOrigem=origem.getElementsByTagName("longitude")[0].firstChild.nodeValue;//<destino>[guarda este conteúdo]</destino>
			var iPnt=origem.getAttribute("idPonto");
			
			var NomeDestino=destino.getElementsByTagName("nome")[0].firstChild.nodeValue;//<destino>[guarda este conteúdo]</destino>
			var LatitudeDestino=destino.getElementsByTagName("latitude")[0].firstChild.nodeValue;//<destino>[guarda este conteúdo]</destino>
			var LongitudeDestino=destino.getElementsByTagName("longitude")[0].firstChild.nodeValue;//<destino>[guarda este conteúdo]</destino>
			var fPnt=destino.getAttribute("idPonto");
		
		//Em cada campo do formulário coloca os valores retirados anteriormente do XML	
			$("#nomeRota").val(nomeRota);
			
			$("#origem").val(NomeOrigem);
			$("#origem").attr("lat",LatitudeOrigem);
			$("#origem").attr("lng",LongitudeOrigem);
			if(iPnt!=null){
				$("#origem").attr("interesse",true);
				$("#origem").attr("pos",iPnt);
			}
			
			$("#destino").val(NomeDestino);
			$("#destino").attr("lat",LatitudeDestino);
			$("#destino").attr("lng",LongitudeDestino);
			if(fPnt!=null){
				$("#destino").attr("interesse",true);
				$("#destino").attr("pos",fPnt);
			}
			
			G_pontos=new Array();
			var waypoints=rota.getElementsByTagName("intermedio");
			for (var i=0;i<waypoints.length;i++)
			{
				var waypoint=waypoints[i]
				var id="interesse"+(i+1);
				var elemento=$("#"+id);
				var nome=waypoint.getElementsByTagName("nome")[0].firstChild.nodeValue;
				var lat=waypoint.getElementsByTagName("latitude")[0].firstChild.nodeValue;
				var lng=waypoint.getElementsByTagName("longitude")[0].firstChild.nodeValue;
				var pnt=waypoint.getAttribute("idPonto");
				
				// elemento.val(Number(lat).toFixed(5) + " / " + Number(lng).toFixed(5));
				elemento.val(nome);
				elemento.attr("lat",lat);
				elemento.attr("lng",lng);
				if(pnt!=null){
					elemento.attr("interesse",true);
					elemento.attr("pos",pnt);
				}
				
				$("."+id).css("display","block");				
				
				G_waypoints[i]=new google.maps.LatLng(lat,lng,true);
				G_pontos[i+1]=G_waypoints[i];
			}
			
			G_origem=new google.maps.LatLng(LatitudeOrigem,LongitudeOrigem);
			G_destino=new google.maps.LatLng(LatitudeDestino,LongitudeDestino);
			
			G_pontos[0]=G_origem;
			G_pontos[G_pontos.length]=G_destino;
		}

//Limpa do formulário os dados da Rota
function limpaCamposRotas () 
		{	
		//Procura o campo por id e coloca-lhe um valor por defeito
			document.getElementById("nomeRota").value="";
			document.getElementById("origem").value="";
			document.getElementById("destino").value=""; 
			for(var i=0;i<=9;i++){
				var id="interesse"+i;
				$("#"+id).val("");
				$("."+id).css("display","none");
			}
		}
		

function adicionarCampoRota(iPos){
	
	if(G_pontos.length==1){
			if(iPos){
				$("#origem").val(pInt[iPos].nome);	
				$("#origem").attr("lat",pInt[iPos].lat);
				$("#origem").attr("lng",pInt[iPos].lng);
				$("#origem").attr("interesse",true);
				$("#origem").attr("pos",iPos);
			}
			else
			  geocode("#origem",0);
	}
	else{
		for(var i=0;i<G_pontos.length;i++){		
			if(i==G_pontos.length-1){
				if(iPos){
					//alert(iPos);
					$("#destino").val(pInt[iPos].nome);
					$("#destino").attr("lat",pInt[iPos].lat);
					$("#destino").attr("lng",pInt[iPos].lng);
					$("#destino").attr("interesse",true);
					$("#destino").attr("pos",iPos);
				}
				else
				 	geocode("#destino",i);
			}
			else if(i==G_pontos.length-2){
				$(".interesse"+i).css("display","block");
				//$("#interesse"+i).val(G_pontos[i].lat().toFixed(5)+" / "+G_pontos[i].lng().toFixed(5))
				trocaCamposRotas("#interesse"+i,"#destino");
			}
		}
	}
		
}

function removerCampoRota(pos){	
	var l=G_pontos.length-1;
	
	if(pos==9){
		G_markers[l].setMap(null);
		G_pontos.splice(l,1);		
		G_markers.splice(l,1);
		if(l>1)
		{
			G_pontos.splice(l,1);
			trocaCamposRotas("#destino","#interesse"+(l-1));
			$("#interesse"+(l-1)).val("");
			$(".interesse"+(l-1)).css("display","none");
		}
		else if(l==1)
			$("#destino").val("");
	}
	else if(pos==0){
		G_markers[0].setMap(null);
		G_pontos.splice(0,1);
		G_markers.splice(0,1);
		if(l==0){
			$("#origem").val("");
		}
		else if(l==1){
			trocaCamposRotas("#origem","#destino");
			$("#destino").val("");
		}
		else{
			trocaCamposRotas("#origem","#interesse1");
			for(var i=1;i<l-1;i++){
				trocaCamposRotas("#interesse"+i,"#interesse"+(i+1));
			}
			$("#interesse"+(l-1)).val("");
			$(".interesse"+(l-1)).css("display","none");
		}
	}
	else if(pos==(l-1)){
		G_markers[l-1].setMap(null);
		G_pontos.splice(l-1,1);
		G_markers.splice(l-1,1);
		
		$("#interesse"+pos).val("");
		$(".interesse"+pos).css("display","none");
	}
	else{
		G_markers[pos].setMap(null);
		G_pontos.splice(pos,1);
		G_markers.splice(pos,1);
		
		for(var i=parseInt(pos);i<l-1;i++){
			trocaCamposRotas("#interesse"+i,"#interesse"+(i+1));
		}		
		$("#interesse"+(l-1)).val("");
		$(".interesse"+(l-1)).css("display","none");
	}		
}


function trocaCamposRotas(id1,id2){
	var el1=$(id1);
	var el2=$(id2);
	el1.val(el2.val());
	el1.attr("lat",el2.attr("lat"));
	el1.attr("lng",el2.attr("lng"));
	el1.attr("interesse",el2.attr("interesse"));
	el1.attr("pos",el2.attr("pos"));
}

function geocode(id,i){
	G_geocoder.geocode({'latLng': G_pontos[i]}, function(results, status){			
			if(status == google.maps.GeocoderStatus.OK) {
				$(id).val(results[1].formatted_address);
			}
			else{
			 	$(id).val(G_pontos[i].lat().toFixed(5)+" / "+G_pontos[i].lng().toFixed(5));
			}
			$(id).attr("lat",G_pontos[i].lat());
			$(id).attr("lng",G_pontos[i].lng());
			$(id).attr("interesse",false);
		});
}

function actualizaCampoRota(value, ponto,pos){
	var e;
	
	if(value==0)
		e=$("#origem");
	else if(value==9)
		e=$("#destino");
	else
		e=$("#interesse"+value);
		
	if(e.attr("interesse")!="true")
		var novo=true;
	
	e.val(ponto.nome);
	e.attr("interesse","true");
	e.attr("pos",pos)
	
	if($("#rotas").val()!="novo")
		{
			if(novo)
				actualizarRota($("#rotas").val());
			else
				actualizarPontoRotas(pos);
		}
}

function actualizarPontoRotas(pos)
{
	var xmlDoc=localStorage.getItem("dadosRotas");
	xmlDoc=new window.DOMParser().parseFromString(xmlDoc,"text/xml");
	
	var origens=xmlDoc.getElementsByTagName("inicio");
	var destinos=xmlDoc.getElementsByTagName("fim");
	var intermedios=xmlDoc.getElementsByTagName("intermedio");
	
	for(var i=0;i<origens.length;i++)
	{
		var origem = origens[i];
		if(origem.getAttribute("idPonto")==pos)
			origem.getElementsByTagName("nome")[0].firstChild.nodeValue=pInt[pos].nome;
	}
	
	for(var i=0;i<destinos.length;i++)
	{
		var destino = destinos[i];
		if(destino.getAttribute("idPonto")==pos)
			destino.getElementsByTagName("nome")[0].firstChild.nodeValue=pInt[pos].nome;
	}
	
	for(var i=0;i<intermedios.length;i++)
	{
		var intermedio = intermedios[i];
		if(intermedio.getAttribute("idPonto")==pos)
			intermedio.getElementsByTagName("nome")[0].firstChild.nodeValue=pInt[pos].nome;
	}
	
	var xmlDoc=new XMLSerializer().serializeToString(xmlDoc);	
	localStorage.setItem("dadosRotas",xmlDoc); 
	
}

function actualizarRota(id)
{
	var xmlDoc=localStorage.getItem("dadosRotas");
	xmlDoc=new window.DOMParser().parseFromString(xmlDoc,"text/xml");
	
	var rota=xmlDoc.getElementById(id);
//getElementById não funciona para XML no IE e Firefox
	if(rota==null)
	{
		var rotas=xmlDoc.getElementsByTagName("Rota");
		for(i=0;i<rotas.length;i++)
		{
			if(rotas[i].attributes["id"].value==id)
			{
				rota=rotas[i];
				break;
			}
		}
	}
	
	var nameRotaValue=$("#nomeRota").val();
	rota.getElementsByTagName("nome")[0].firstChild.nodeValue=nameRotaValue;
	
	var inicio=rota.getElementsByTagName("inicio")[0];
	
	inicio.getElementsByTagName("nome")[0].firstChild.nodeValue=$("#origem").val();
	inicio.getElementsByTagName("latitude")[0].firstChild.nodeValue=$("#origem").attr("lat");
	inicio.getElementsByTagName("longitude")[0].firstChild.nodeValue=$("#origem").attr("lng");
	if($("#origem").attr("interesse")=="true")
	{
		inicio.setAttribute("idPonto",$("#origem").attr("pos"));
	}
	
	var fim=rota.getElementsByTagName("fim")[0];
	fim.getElementsByTagName("nome")[0].firstChild.nodeValue=$("#destino").val();
	fim.getElementsByTagName("latitude")[0].firstChild.nodeValue=$("#destino").attr("lat");
	fim.getElementsByTagName("longitude")[0].firstChild.nodeValue=$("#destino").attr("lng");
	if($("#destino").attr("interesse")=="true")
	{
		fim.setAttribute("idPonto",$("#destino").attr("pos"));
	}
	
	while(ponto=rota.getElementsByTagName("intermedio")[0])
		rota.removeChild(ponto);	
	
	for(i=1;i<G_pontos.length-1;i++)
	{
		var campo=$("#interesse"+i);
		
		var pontoElement=xmlDoc.createElement("intermedio");
		var nomeElement=xmlDoc.createElement("nome");
		var latElement=xmlDoc.createElement("latitude");
		var lngElement=xmlDoc.createElement("longitude");
		
		var nomeValue=xmlDoc.createTextNode(campo.val());
		var latValue=xmlDoc.createTextNode(campo.attr("lat"));
		var lngValue=xmlDoc.createTextNode(campo.attr("lng"));
		
		nomeElement.appendChild(nomeValue);
		latElement.appendChild(latValue);
		lngElement.appendChild(lngValue);
		
		if(campo.attr("interesse")=="true")
			pontoElement.setAttribute("idPonto",campo.attr("pos"));
		
		pontoElement.appendChild(nomeElement);
		pontoElement.appendChild(latElement);
		pontoElement.appendChild(lngElement);
		
		rota.insertBefore(pontoElement, fim);
	}
	
	var xmlDoc=new XMLSerializer().serializeToString(xmlDoc);	
	localStorage.setItem("dadosRotas",xmlDoc); 	
}
