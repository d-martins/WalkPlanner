var camposUsersExistem;

//Função executada pelo botão Eliminar Utilizador
function submitEliminarUser()
		{
		//Procura o elemento no HTML com o id "comboUser" e guarda na variavel comboUser
			var comboUser=document.getElementById("comboUser");
		//Guarda o valor da opção selecionada, na variável valor 			
			var valor = comboUser.value;//este valor é o que está no value="x", não o texto mostrado pela comboBox
			
		//Se o campo selecionado da comboBox não for o "Novo" nem o "Selecione"
			if(valor!="novo" &&  valor!="selecione")
			{
				//Como o value guarda o id do utilizador	
				//Executa a função removeUserData com o id do utilizador selecionado como parametro
					removeUserData(valor);
				//Depois de finalizada a operação, faz reload da página
					window.location.reload();
			}			
		}

//Remove do XML guardado em localStorage, os dados do utilizador com o id recebido
function removeUserData(id)
		{
		//Retira da localStorage o ficheiro XML (em string) com os utilizadores
			var xmlDoc=localStorage.getItem("dadosUser");
		//Como o xmlDoc está em string, convertemo-lo para XML, para podermos navegá-lo com as funções do DOM
			xmlDoc=new window.DOMParser().parseFromString(xmlDoc,"text/xml");
			
		//Procura no XML, o elemento cujo id corresponde ao recebido e guarda-o em user
			var user=xmlDoc.getElementById(id);
		//getElementById não funciona para XML no IE e Firefox
			if(user==null)
			{
				var users=xmlDoc.getElementsByTagName("Utilizador");
				for(i=0;i<users.length;i++)
				{
					if(users[i].attributes["id"].value==id)
					{
						user=users[i];
						break;
					}
				}
			}	
			
		//Vai ao elemento pai de user (dadosUtilizador) e remove o elemento
			user.parentNode.removeChild(user);
			
		//Volta a converter o documento numa string, para poder ser armazenado em localStorage
			xmlDoc=new XMLSerializer().serializeToString(xmlDoc);
			localStorage.setItem("dadosUser",xmlDoc);

		}	

//Altera/Atualiza a informação correspondente a um utilizador
function updateUserData(id)
		{
		//Retira da localStorage o ficheiro XML (em string) com os utilizadores
			var xmlDoc=localStorage.getItem("dadosUser");
		//Como o xmlDoc está em string, convertemo-lo para XML, para podermos navegá-lo com as funções do DOM
			xmlDoc=new window.DOMParser().parseFromString(xmlDoc,"text/xml");
			
		//Procura no XML, o elemento cujo id corresponde ao recebido e guarda-o em user
			var user=xmlDoc.getElementById(id);
		//getElementById não funciona para XML no IE e Firefox
			if(user==null)
			{
				var users=xmlDoc.getElementsByTagName("Utilizador");
				for(i=0;i<users.length;i++)
				{
					if(users[i].attributes["id"].value==id)
					{
						user=users[i];
						break;
					}
				}
			}	
			
		//Guarda o valor inserido em cada campo do formulario em variaves
			var nome=document.getElementById("nome").value;
			var idade=document.getElementById("idade").value;
			var altura=document.getElementById("altura").value;
			var peso=document.getElementById("peso").value;
			var sexo=document.getElementById("sexo").value;
			
		//Vai guardar o elemento Nome do utilizador na variavel nomeElement
			var nomeElement=user.getElementsByTagName("Nome")[0];	
			var idadeElement=user.getElementsByTagName("Idade")[0];
			var alturaElement=user.getElementsByTagName("Altura")[0];	
			var pesoElement=user.getElementsByTagName("Peso")[0];
			var sexoElement=user.getElementsByTagName("Sexo")[0];
			
		//Vai ao primeiro nó do elemento Nome (neste caso é o valor do campo: <Nome> [firstChild] </Nome>)	
		//e altera o seu valor
			nomeElement.firstChild.nodeValue=nome;
			idadeElement.firstChild.nodeValue=idade;
			alturaElement.firstChild.nodeValue=altura;
			pesoElement.firstChild.nodeValue=peso;
			sexoElement.firstChild.nodeValue=sexo;
			
			//Volta a converter o documento numa string, para poder ser armazenado em localStorage
			xmlDoc=new XMLSerializer().serializeToString(xmlDoc);
			localStorage.setItem("dadosUser",xmlDoc);
			
			criaComboBoxUsers()
		}		

//Guarda os dados do utilizador num XML armazenado em localStorage		
function saveUserData(){
			
			var id;
			var xmlDoc;
		//Se o XML dadosUser já existir em localStorage
			if(localStorage.getItem("dadosUser")!=null)
			{	
			//Retira da localStorage o ficheiro XML (em string) com os utilizadores
				xmlDoc=localStorage.getItem("dadosUser");
			//Como o xmlDoc está em string, convertemo-lo para XML, para podermos navegá-lo com as funções do DOM
				xmlDoc=new window.DOMParser().parseFromString(xmlDoc,"text/xml");
			
			}
		//Se o XML dadosUser ainda não existir em localStorage
			else 
				xmlDoc=document.implementation.createDocument(null,"dadosUtilizador",null);		
			
			id=0;			
			var users=xmlDoc.getElementsByTagName("Utilizador");
			for(i=0;i<users.length;i++)
			{
				if(users[i].attributes["id"].value==id)
				{
					id++; i=0;
				}
			}
	
		//Cria-se um novo elemento Utilizador que vai ser o elemento principal do novo registo  
			var userElement=xmlDoc.createElement("Utilizador");//<Utilizador></Utilizador>
			
		//Cria-se para cada campo do utilizador, um novo elemento
			var nomeElement= xmlDoc.createElement("Nome");//<Nome></Nome>
			var idadeElement=xmlDoc.createElement("Idade");//<Idade></Idade>
			var pesoElement=xmlDoc.createElement("Peso");//<Peso></Peso>
			var alturaElement=xmlDoc.createElement("Altura");//<Altura></Altura>
			var sexoElement=xmlDoc.createElement("Sexo");//<Sexo></Sexo>
			
		//Vai-se a cada campo do formulário retirar os valores introduzidos e guarda-los em novas textNodes
			var nomeValue= xmlDoc.createTextNode(document.getElementById("nome").value);
			var idadeValue=xmlDoc.createTextNode(document.getElementById("idade").value);
			var pesoValue=xmlDoc.createTextNode(document.getElementById("peso").value);
			var alturaValue=xmlDoc.createTextNode(document.getElementById("altura").value);
			var sexoValue=xmlDoc.createTextNode(document.getElementById("sexo").value);
		
		//Coloca-se o textNode dentro do elemento correspondente
			nomeElement.appendChild(nomeValue);//	<Nome>[nomeValue]</Nome>
			idadeElement.appendChild(idadeValue);//	<Idade>[idadeValue]</Idade>
			pesoElement.appendChild(pesoValue);//	<Peso>[pesoValue]</Peso>
			alturaElement.appendChild(alturaValue);//<Altura>[alturaValue]</Altura>
			sexoElement.appendChild(sexoValue);//	<Sexo>[sexoValue]</Sexo>
			
		//coloca-se o atributo id no elemento Utilizador
			userElement.setAttribute("id",id);//<Utilizador id=[id]>
				
			
		//Adicionam-se todos os elementos ao Utilizador
			//										<Utilizador id=[id]>											
			userElement.appendChild(nomeElement);//		<Nome>[nomeValue]</Nome>
			userElement.appendChild(idadeElement);//	<Idade>[idadeValue]</Idade>
			userElement.appendChild(pesoElement);//		<Peso>[pesoValue]</Peso>
			userElement.appendChild(alturaElement);//	<Altura>[alturaValue]</Altura>
			userElement.appendChild(sexoElement);//		<Sexo>[sexoValue]</Sexo>			
			//										</Utilizador>	
			
		//Adiciona o elemento Utilizador ao elemento principal do XML <dadosUtilizador>
			xmlDoc.documentElement.appendChild(userElement);
			
		//Volta a converter o documento numa string, para poder ser armazenado em localStorage			
			xmlDoc=new XMLSerializer().serializeToString(xmlDoc);			
			localStorage.setItem("dadosUser",xmlDoc);	
			
			//window.location.reload();		
			criaComboBoxUsers();
			$("#comboUser option:last").attr("selected","selected");
			$("#comboUser").change();
		}

//Adiciona uma comboBox com os utilizadores ao HTML
function criaComboBoxUsers()
		{
		//Cria um novo elemento <select /> na variavel comboBox
			var comboBox=$("#comboUser");
			
			comboBox.html("");
			comboBox.append("<option value='selecione'>-- Selecione --</option>");
			comboBox.append("<option value='novo'>-- Novo --</option>");
		//Se existir na localStorage o item dadosUser(aonde se deve encontrar o XML dos utilizadores)
			if(localStorage.getItem("dadosUser")!=null)
			{
				//Retira da localStorage o ficheiro XML (em string) com os utilizadores
					var xmlDoc=localStorage.getItem("dadosUser");
				//Como o xmlDoc está em string, convertemo-lo para XML, para podermos navegá-lo com as funções do DOM
					xmlDoc=new window.DOMParser().parseFromString(xmlDoc,"text/xml");
				//Guarda uma lista com todos os utilizadores na variavel users			
					var users=xmlDoc.getElementsByTagName("Utilizador");
					
				//Para cada Utilizador no documento
					for(var i=0;i<users.length;i++)
					{
						//Guarda o id do utilizador para a variavel id
							var id=users[i].attributes["id"].value;
						//Guarda o valor do elemento Nome para uma variavel (<Nome>[guarda este conteúdo]</Nome>) 
							var nome=users[i].getElementsByTagName("Nome")[0].firstChild.nodeValue;
							
							comboBox.append("<option value="+id+">"+nome+"</option>");
					}		
			}
		}

//Atualiza página, de acordo com o valor selecionado na comboBox dos utilizadores		
function checkComboBoxUsers()
		{
		//Procura o elemento cujo id="comboUser", no HTML e guarda-o numa variavel
			var comboBox=document.getElementById("comboUser");
			
		//Se a opção selecionada tiver o valor "selecione"
			if(comboBox.value=="selecione" )
			{
				$("#camposUser").hide();
			}
		//Se a opção selecionada tiver o valor "novo"
			else if(comboBox.value=="novo" )
    		{
    		//se já existirem os campos, não os vai duplicar
    			$("#camposUser").show();
    			$("#botaoAdicionarUser").show();
    			$("#botaoActualizarUser").hide();
    			$("#botaoEliminarUser").hide();
    			//Limpa os valores dos campos do utilizador
    			limpaCamposUser();
    		}
    	//Se não (o valor é o id de um Utilizador)
    		else
    		{
    		//se já existirem os campos, não os vai duplicar
    				$("#camposUser").show();
    				$("#botaoAdicionarUser").hide();
    				$("#botaoActualizarUser").show();
    				$("#botaoEliminarUser").show();
    			//Chama a funcção  preencheCamposUser enviando o valor da comboBox (o id do User)
    				preencheCamposUser(comboBox.value);
    		}
		}

//Preenche os campos do formulário, de acordo com os dados de um utilizador
function preencheCamposUser(id)
		{
		//Retira da localStorage o ficheiro XML (em string) com os utilizadores
			var xmlDoc=localStorage.getItem("dadosUser");
		//Como o xmlDoc está em string, convertemo-lo para XML, para podermos navegá-lo com as funções do DOM
			xmlDoc=new window.DOMParser().parseFromString(xmlDoc,"text/xml");
		
		//Guarda o elemento correspondente ao utilizador em user	
			var user=xmlDoc.getElementById(id);
		//getElementById não funciona para XML no IE e Firefox
			if(user==null)
			{
				var users=xmlDoc.getElementsByTagName("Utilizador");
				for(i=0;i<users.length;i++)
				{
					if(users[i].attributes["id"].value==id)
					{
						user=users[i];
						break;
					}
				}
			}
		
		//Procura os valores de cada elemento do utilizador e guarda-o numa variavel 	
			var nome=user.getElementsByTagName("Nome")[0].firstChild.nodeValue;//<Nome>[guarda este conteúdo]</Nome>
			var idade=user.getElementsByTagName("Idade")[0].firstChild.nodeValue;//<Idade>[guarda este conteúdo]</Idade>
			var altura=user.getElementsByTagName("Altura")[0].firstChild.nodeValue;//<Altura>[guarda este conteúdo]</Altura>
			var peso=user.getElementsByTagName("Peso")[0].firstChild.nodeValue;//<Peso>[guarda este conteúdo]</Peso>
			var sexo=user.getElementsByTagName("Sexo")[0].firstChild.nodeValue;//<Sexo>[guarda este conteúdo]</Sexo>
		
		//Em cada campo do formulário coloca os valores retirados anteriormente do XML	
			document.getElementById("nome").value=nome;
			document.getElementById("idade").value=idade;
			document.getElementById("altura").value=altura;
			document.getElementById("peso").value=peso;
			document.getElementById("sexo").value=sexo;
		}

//Limpa do formulário os dados do Utilizador
function limpaCamposUser () 
		{	
		//Procura o campo por id e coloca-lhe um valor por defeito
			document.getElementById("nome").value="";
			document.getElementById("idade").value="";
			document.getElementById("altura").value="";
			document.getElementById("peso").value="";
			document.getElementById("sexo").value="M";	 
		}	
	