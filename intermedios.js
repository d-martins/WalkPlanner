var pInt=new Array();


function verificaIntermediosXML()
{
	if(localStorage.getItem("intermedios")==null)
    	criarIntermedios();
    carregarIntermedios();
}

function criarListaIntermedios(){
	$("#locais").html("<h6>Locais</h6><ul id='pontos'></ul>");
	$("#restaurantes").html("<h6>Restaurantes</h6><ul id='pontos'></ul>");
	
	for(var i=0;i<pInt.length;i++){
		if(pInt[i].tipo=="local")	
			var list = $("#locais").find('ul');
		else
			var list = $("#restaurantes").find('ul');
		
	 	list.append('<li value='+i+' class="pontoInt">'+pInt[i].nome+'</li>');	  
	}	
}

function adicionarIntermedio(ponto){
	pInt.push(ponto);
	adicionarIntermedioXML(pInt.length-1);
	criarListaIntermedios();
}

function criarIntermedios(){
	pInt=new Array();
	pInt[00]={nome:"Fontelo",lat:40.65886,lng:-7.90115,descricao:"Tem a dimensão de 10 hectares, dotado com vários equipamentos desportivos e de lazer. Dispõe de uma abundante vegetação, aves raras e árvores centenárias.",instrucao:"Aqui poderá desfrutar da Natureza enquanto repousa da sua caminhada",tipo:"local"};
	pInt[01]={nome:"Museu Grao Vasco",lat:40.66016,lng:-7.91078,descricao:"Localizado no centro histórico de Viseu. <br> Fundado por Francisco de Almeida Moreira. <b>Horário:</b> segunda-feira: Encerrado <br> terça-feira: 14:00 - 17:30 <br> Restantes Dias: 10:00 - 12:30, 14:00 - 17:30",instrucao:"Aqui poderá descansar enquanto visita o Museu Grão Vasco.",tipo:"local"};
	pInt[02]={nome:"Live Beach",lat:40.61173,lng:-7.74837,descricao:"Praia artificial de Mangualde, com diversos espaços de entretenimento e restauração.<br> Ver mais: http://www.livebeach.pt/",instrucao:"Aqui pode aproveitar para fazer uma paragem e visitar os espaços oferecidos pela Live Beach",tipo:"local"};
	pInt[03]={nome:"Bar do Rio",lat:40.63291,lng:-7.78993,descricao:"Poderá usufruir de serviço de bar e esplanada com acesso a sala de jogos, parque infantil e praia fluvial. <br> Ver mais: http://casadorio.webnode.com/sobre-nos/",instrucao:"Aproveite para descansar, e desfrutar da maravilhosa e relaxante paisagem.",tipo:"local"};
	pInt[04]={nome:"Parque Aquilino Ribeiro",lat:40.65551,lng:-7.91539,descricao:"é um dos pulmões da cidade de Viseu onde poderá encontrar grandes árvores e outras espécies vegetais",instrucao:"Aproveite para passear um bocado pelos espaços verdes oferecidos por este parque.",tipo:"local"};
	pInt[05]={nome:"Funicolar",lat:40.66405,lng:-7.91282,descricao:"Transporte não poluente, gratuito, liga a zona ribeirinha da cidade ao centro histórico.",instrucao:"Se estiver muito cansado(a) apanhe uma pequena boleia do Funicular.",tipo:"local"};
	pInt[06]={nome:"Jardim Rua Quinta do Bosque",lat:40.65705,lng:-7.92674,descricao:"Pequeno jardim, que dispõe de uma fonte antiga em granito, que se encontra seca e em mau estado de conservação.",instrucao:"Aproveite para fazer uma pequena pausa.",tipo:"local"};
	pInt[07]={nome:"Igreja Nossa Senhora do Castelo",lat:40.61227,lng:-7.74411,descricao:"Composta por dois corpos, sobressai a torre ameada erguida a partir da fachada principal. Trata-se de um templo neoclássico.",instrucao:"Aproveite esta paragem, para deliciar-se com a paisagem.",tipo:"local"};
	pInt[08]={nome:"Jardim do Rossio",lat:40.60467,lng:-7.75941,descricao:"Parque situado no centro da cidade de Mangualde, com bancos para repouso e parque infantil",instrucao:"Aproveite para fazer uma pausa na sua caminhada.",tipo:"local"};
	pInt[09]={nome:"Cascata de Pedra",lat:40.61586,lng:-7.75999,descricao:"Restaurante moderno em aliança com um ambiente rural, onde o tempero principal é a gastronomia tradicional portuguesa",instrucao:"Se necessitar de comer, aproveite para se deliciar com os cozinhados que a Cascata de Pedra tem para lhe oferecer.",tipo:"restaurante"};
	pInt[10]={nome:"Cacimbo",lat:40.65339,lng:-7.91372,descricao:"Restaurante com espaço de ambiente familiar que pretende a dinâmica do cruzamento das várias classes sociais viseenses",instrucao:"Se necessitar de comer, aproveite para se deliciar com os cozinhados que o Cacimbo tem para lhe oferecer.",tipo:"restaurante"};
	pInt[11]={nome:"Franguito",lat:40.66148,lng:-7.71417,descricao:"Restaurante onde poderá fazer a sua refeição a um bom preço.",instrucao:"Se necessitar de comer, aproveite para se deliciar com os cozinhados que o Franguito tem para lhe oferecer.",tipo:"restaurante"};
	pInt[12]={nome:"Moderno",lat:40.604696,lng:-7.76009,descricao:"Restaurante onde poderá fazer a sua refeição a um bom preço, situado no centro de Mangualde.",instrucao:"Se necessitar de comer, aproveite para se deliciar com os cozinhados que o Moderno tem para lhe oferecer.",tipo:"restaurante"};
	
	for(var i=0;i<pInt.length;i++)	
		adicionarIntermedioXML(i);
}


function adicionarIntermedioXML(pos){
		var xmlDoc;
		
		if(localStorage.getItem("intermedios")==null)				
			xmlDoc=document.implementation.createDocument(null,"pontosInteresse",null);
		
		else
			xmlDoc=new window.DOMParser().parseFromString(localStorage.getItem("intermedios"),"text/xml");
		
		var nomeValue=xmlDoc.createTextNode(pInt[pos].nome);
		var latValue=xmlDoc.createTextNode(pInt[pos].lat);
		var lngValue=xmlDoc.createTextNode(pInt[pos].lng);
		var descricaoValue=xmlDoc.createTextNode(pInt[pos].descricao);
		var instrucaoValue=xmlDoc.createTextNode(pInt[pos].instrucao);
		var tipoValue=pInt[pos].tipo;
		var idValue=pos;
		
		var pontoElement=xmlDoc.createElement("ponto");
		
		var nomeElement=xmlDoc.createElement("nome");
		var latElement=xmlDoc.createElement("latitude");
		var lngElement=xmlDoc.createElement("longitude");
		var descricaoElement=xmlDoc.createElement("descricao");
		var instrucaoElement=xmlDoc.createElement("instrucao");
		
		nomeElement.appendChild(nomeValue);	
		latElement.appendChild(latValue);	
		lngElement.appendChild(lngValue);	
		descricaoElement.appendChild(descricaoValue);	
		instrucaoElement.appendChild(instrucaoValue);	
		
		pontoElement.appendChild(nomeElement);
		pontoElement.appendChild(latElement);
		pontoElement.appendChild(lngElement);
		pontoElement.appendChild(descricaoElement);
		pontoElement.appendChild(instrucaoElement);
		pontoElement.setAttribute("id",idValue);
		pontoElement.setAttribute("tipo",tipoValue);
		
		xmlDoc.documentElement.appendChild(pontoElement);
		
		var xmlDoc=new XMLSerializer().serializeToString(xmlDoc);	
		localStorage.setItem("intermedios",xmlDoc);    	
}

function actualizarIntermedio(pos,ponto){
	pInt[pos]=ponto;
	var xmlDoc;
		
	xmlDoc=new window.DOMParser().parseFromString(localStorage.getItem("intermedios"),"text/xml");
	
	var nomeValue=ponto.nome;
	var descricaoValue=ponto.descricao;
	var tipoValue=ponto.tipo
	
	var pontoXML=xmlDoc.getElementById(pos); 
	if(pontoXML==null)
	{
		var pontos=xmlDoc.getElementsByTagName("ponto");
		for(i=0;i<pontos.length;i++)
		{
			if(pontos[i].attributes["id"].value==pos)
			{
				pontoXML=pontos[i];
				break;
			}
		}	
	}
	pontoXML.getElementsByTagName("nome")[0].firstChild.nodeValue=nomeValue;
	pontoXML.getElementsByTagName("descricao")[0].firstChild.nodeValue=descricaoValue;
	pontoXML.attributes["tipo"].value=tipoValue;
	
	xmlDoc=new XMLSerializer().serializeToString(xmlDoc);
	localStorage.setItem("intermedios",xmlDoc);
			
	criarListaIntermedios();
}

function carregarIntermedios(){
	pInt=new Array();
	var xmlDoc=new window.DOMParser().parseFromString(localStorage.getItem("intermedios"),"text/xml");
	
	var pontos=xmlDoc.getElementsByTagName("ponto");
	
	for(var i=0;i<pontos.length;i++){
		var ponto=pontos[i];
		
		var nome=ponto.getElementsByTagName("nome")[0].firstChild.nodeValue;
		var lat=ponto.getElementsByTagName("latitude")[0].firstChild.nodeValue;
		var lng=ponto.getElementsByTagName("longitude")[0].firstChild.nodeValue;
		var descricao=ponto.getElementsByTagName("descricao")[0].firstChild.nodeValue;
		var instrucao=ponto.getElementsByTagName("instrucao")[0].firstChild.nodeValue;
		var tipo=ponto.attributes["tipo"].value;
		
		pInt.push({nome:nome,lat:lat,lng:lng,descricao:descricao,instrucao:instrucao,tipo:tipo});
	}
	
	criarListaIntermedios();
}

function submitGuardarPonto()
{
	var value=$("#value_ponto").val();
	var nome=$("#nome_ponto").val();
	var desc=$("#desc_ponto").val();
	var tipo=$("#tipo_ponto").val();
	var lat=$("#lat_ponto").val();
	var lng=$("#lng_ponto").val();
	var update=$("#update_ponto").val();	
	var instrucao;
	var pos;
	
	var ponto={
		nome:nome,
		lat:lat,
		lng:lng,
		descricao:desc,
		instrucao:instrucao,
		tipo:tipo
	}
	
	if(update=="true")
	{
		pos=$("#pos_ponto").val();
		actualizarIntermedio(pos,ponto);
	}
	else
	{
		if(tipo=="local")
			ponto.instrucao="Aqui pode visitar um dos seus locais favoritos, "+nome+".";
		else
			ponto.instrucao="Aqui pode encontrar um dos seus restaurantes favoritos.";
		pos=pInt.length;
		adicionarIntermedio(ponto);		
	}
	actualizaCampoRota(value,ponto,pos);
}
