document.addEventListener('DOMContentLoaded',preencheSchemaAreas);

function preencheSchemaAreas()
{
	var sUsers=localStorage.getItem("schemaUsers");
	var sRotas=localStorage.getItem("schemaRotas");
	var sInteresse=localStorage.getItem("schemaInteresse");
	
	if(sUsers!=null)
		document.getElementById("userSchemaArea").value=sUsers;
	if(sRotas!=null)
		document.getElementById("rotasSchemaArea").value=sRotas;
	if(sInteresse!=null)
		document.getElementById("interesseSchemaArea").value=sInteresse;
	
}

//Valida um Schema
function validarSchema(xmlData,schemaData)
{
	if(xmlData==null || schemaData==null)
		return false;
	
	xmlData=unescape(encodeURIComponent(xmlData));
		
	var Module = {
      xml: xmlData,
      schema: schemaData,
      arguments: ["--noout", "--schema", "schema", "xml"]
	};
	
	//and call function	
	var xmllint = validateXML(Module);
	
	$("#output").append(xmllint+"\n");
	
	if(xmllint.indexOf("xml validates") != -1) 
		return true;
	else
		return false;
}

//Faz upload do Schema
function uploadSchemaUsers()
{
	var txt=document.getElementById("userSchemaArea").value;
	if(txt.length>0)
		localStorage.setItem("schemaUsers",txt)
}
//Faz upload do Schema
function uploadSchemaRotas()
{
	var txt=document.getElementById("rotasSchemaArea").value;
	if(txt.length>0)
		localStorage.setItem("schemaRotas",txt)
}
//Faz upload do Schema
function uploadSchemaInteresse()
{
	var txt=document.getElementById("interesseSchemaArea").value;
	if(txt.length>0)
		localStorage.setItem("schemaInteresse",txt)
}


function botaoValidar()
{
	$("#output").html("");
	
	uploadSchemaUsers();
	uploadSchemaRotas();
	uploadSchemaInteresse();
	
	var res1=validarSchema(localStorage.getItem("dadosUser"),localStorage.getItem("schemaUsers"));
	if(res1)
		$("#userSchemaArea").css("background-color","#49EB7C");
	else
		$("#userSchemaArea").css("background-color","#E62525");
		
	var res2=validarSchema(localStorage.getItem("dadosRotas"),localStorage.getItem("schemaRotas"));
	if(res2)
		$("#rotasSchemaArea").css("background-color","#49EB7C");
	else
		$("#rotasSchemaArea").css("background-color","#E62525");
		
	var res3=validarSchema(localStorage.getItem("intermedios"),localStorage.getItem("schemaInteresse"));
	if(res3)
		$("#interesseSchemaArea").css("background-color","#49EB7C");
	else
		$("#interesseSchemaArea").css("background-color","#E62525");
}



