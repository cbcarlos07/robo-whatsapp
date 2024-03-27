const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// Create a new client instance
const client = new Client();

const optionsList = ['1', '2', '3']
const msgs = 'oi olá bom dia boa tarde boa noite'
const steps = []
var opcaotr = ''
var opcaoInt = 0
var nome = ''
// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

client.on('message_create', message => {
	
	const opcao = message.body
	if ( steps.length == 0 ) {
		if( msgs.indexOf( opcao.toLowerCase() ) != -1 ){
			const welcomeMsg = greetings()
			const msg = `*${welcomeMsg}!*\n
			Agradecemos seu contato\n
			Aqui agendaremos para você a documentação que você precisa\n
			Escolha uma das opções abaixo\n\n
			*1* - Para a Receita Federal (CPF)\n
			*2* - IPVA: Renovação de CNH, Troca de Permissão, recuperar multa e IPVA, gerar de DUDA\n
			*3* - Seguro desemprego`
			client.sendMessage(message.from, msg);
			steps.push('0')
		}
	}
});


client.on('message', message => {
	
	actions(message)
});


const actions = (message, _opcao = 0) => {	
	const opcao = message.body
	if( steps.length == 1 ){
		
		const option = _opcao > 0 ? _opcao.toString() : opcao
		if( optionsList.includes( opcao ) ){
			
			let msgOpcao = ''
			opcaoInt = parseInt(opcao)
			switch (option) {
				case '1':
					msgOpcao = `Opção 1: Receita Federal\n
				Por favor informe seu nome completo`
					opcaotr = 'Receita Federal'
					
					break;
				case '2':
					msgOpcao = `Opção 2: IPVA\n
				Por favor informe seu nome completo`
					opcaotr = 'IPVA'
					break
				case '3':
					msgOpcao = `Opção 3: Seguro desemprego\n
				Por favor informe seu nome completo`
					opcaotr = 'Seguro desemprego'
					break
				default:
					console.log('nao escolheu');
					break
			}
			client.sendMessage(message.from, msgOpcao);
			steps.push(opcao)
			
		}
	}

	if( steps.length == 2 ){
		
		if( isNaN(opcao) ){
			
			nome = opcao
			const msg = `Seu nome é: *${opcao}*\n
			Deseja corrigir?\n
			1: Sim\n
			2: Não`
			client.sendMessage(message.from, msg);
			steps.push(opcao)
		}
	}

	if( steps.length == 3 ){
		
		if( opcao == 1 || opcao == 2 ){
			
			if(opcao === '1'){
				steps.pop()
				steps.pop()
				
				actions(message,opcaoInt)
			}else{
				const msg = `Parabéns ${nome}!\n
				Você agendou o serviço ${opcao}\n
				Em breve entraremos em contato para mais informações para solicitarmos informações de data de agendamento dispoiníveis\n
				${greetings()}!`
				client.sendMessage(message.from, msg);
				steps.length = 0
			}
		}
	}
}



const greetings = () => {
	const date = new Date
	const currentHour = date.getHours()
	if( currentHour >= 0 && currentHour < 12 )
	  return 'Bom dia'
	else if( currentHour >= 12 && currentHour < 18 )
	  return 'Boa tarde'
	else return 'Boa noite'
}

// Start your client
client.initialize();