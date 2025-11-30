Atividade Avaliativa para a Prova N2
Aluna: Thaís Silveira Borges Teixeira – GitHub: 
Professor: Victor
Curso: Ciências da Computação – 7º Período
Atividade Técnica 1 – Web App Interativo de Curvas Paramétricas
Visão Geral do Sistema
Este Web App oferece um ambiente interativo para criação e manipulação de curvas paramétricas, utilizando tecnologias web modernas como HTML5, CSS3 e JavaScript.
Funcionalidades principais:
•	Adicionar pontos e manipulá-los; 
•	Visualizar as conexões das curvas entre os pontos;
•	Exportar dados no formato JSON;
•	Limpar a tela para iniciar um novo trabalho;
Arquitetura
1.	index.html
o	Contém os elementos da interface:
	Canvas para renderização das curvas. 
	Botões: Adicionar Ponto, Exportar JSON e Limpar Tela.
2.	styles.css
o	Define a estilização visual:
	Layout e estrutura do canvas. 
	Cores, estilo dos botões e aparência geral.
3.	script.js
o	Gerencia a lógica da aplicação: 
	Controle do estado do sistema (pontos, seleção e modos). 
	Eventos de interação do mouse (cliques e arraste). 
	Renderização do canvas, exportação de JSON e limpeza da tela.
Dificuldades Encontradas
1.	Precisão ao clicar nos pontos: Foi necessário calcular distâncias entre pontos e o cursor do mouse para melhorar a usabilidade. 
2.	Performance no arraste de pontos: Implementar renderização fluida enquanto o ponto é movido. 
3.	Conflitos de estado: Ajustar comportamentos de modos como "adicionar ponto" versus "mover ponto". 
4.	Exportação JSON sem dependências externas: Garantir compatibilidade total com diferentes navegadores atuais.
