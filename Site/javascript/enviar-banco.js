import { initializeApp } from "ESSE_EU_NAO_LEMBRAVA_SE_ERA_IMPORTANTE";
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "NAO_É_A_MINHA_API",
    authDomain: "NAO_É_A_MINHA_API",
    projectId: "NAO_É_A_MINHA_API",
    storageBucket: "NAO_É_A_MINHA_API",
    messagingSenderId: "NAO_É_A_MINHA_API",
    appId: "NAO_É_A_MINHA_API"
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let idDocumentoGlobal = null; 

const btnVoltar = document.getElementById('voltar')
const btnPlaca = document.getElementById('btn-nova-placa')
const btnErro = document.getElementById('Erro');
const btnNovo = document.getElementById('Novo-Voucher');
const form = document.getElementById('form-cliente');

async function validarESalvarNoBanco(dados) {
    try {
        const clientesRef = collection(db, "Clientes");
        const consulta = query(clientesRef, where("cpf", "==", dados.cpf));

        const querySnapshot = await getDocs(consulta);

        
        if (!querySnapshot.empty) {
            
            idDocumentoGlobal = querySnapshot.docs[0].id; 
            
            console.log("Cliente já existia. ID recuperado:", idDocumentoGlobal);

            document.getElementById('painel-controle').classList.add('hidden');
            document.getElementById('repetido').classList.remove('hidden');
            
            alert("CPF já cadastrado. Veja as opções.");
            return; 
        }

        
        const docRef = await addDoc(clientesRef, dados);
        idDocumentoGlobal = docRef.id;
        
        alert("✅ Cadastro realizado com sucesso!");

    } catch (error) {
        console.error("Erro na operação:", error);
        alert("❌ Erro ao processar dados.");
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dataAtual = new Date();
    const dataVencimento = new Date();
    dataVencimento.setDate(dataAtual.getDate() + 30);

    const dadosSalvar = {
        nome: document.getElementById('nome').value.trim().toLowerCase(),
        cpf: document.getElementById('cpf').value.replace(/\D/g, ""),
        placa: document.getElementById('placa').value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
        status: "PENDENTE",
        vencimento: dataVencimento.toISOString().split('T')[0]
    };

    await validarESalvarNoBanco(dadosSalvar);
});

btnNovo.onclick = async () => {
    
    if (!idDocumentoGlobal) {
        alert("Erro: Nenhum cliente selecionado ou cadastrado.");
        return;
    }

    try {
        const docRef = doc(db, "Clientes", idDocumentoGlobal);
        await updateDoc(docRef, { status: "Pendente" });
        
        alert("Status do cliente marcado como Pendente!");
        

    } catch (erro) {
        console.error("Erro ao atualizar:", erro);
        alert("Erro ao atualizar status.");
    }

    document.getElementById('repetido').classList.add('hidden')
    document.getElementById('Nova-Placa').classList.remove('hidden')
};  

btnErro.onclick = async () => {
  document.getElementById('repetido').classList.add('hidden');
  document.getElementById('painel-controle').classList.remove('hidden');
};

const inputPlacaNova = document.getElementById('placa-nova');

inputPlacaNova.addEventListener('input', (e) => {
    let valor = e.target.value.toUpperCase(); 
    valor = valor.replace(/[^A-Z0-9]/g, "");

    if (valor.length > 3) {
        
        valor = valor.slice(0, 3) + "-" + valor.slice(3, 7);
    }

    e.target.value = valor;
});


const formCliente = document.getElementById('form-placa'); 

formCliente.onsubmit = async (e) => {
    e.preventDefault(); 
    
    if (!idDocumentoGlobal) {
        alert("Erro: Nenhum cliente selecionado ou cadastrado.");
        return;
    }

    const novaPlacaValor = document.getElementById('placa-nova').value.trim().toUpperCase();

    try {
        const docRef = doc(db, "Clientes", idDocumentoGlobal);
        await updateDoc(docRef, { placa: novaPlacaValor });
        
        
        document.getElementById('Nova-Placa').classList.add('hidden');
        document.getElementById('Sucesso').classList.remove('hidden');

    } catch (erro) {
        console.error("Erro ao atualizar:", erro);
        alert("Erro ao atualizar status.");
    }
};

btnVoltar.onclick = async () => {
  document.getElementById('Sucesso').classList.add('hidden');
  document.getElementById('painel-controle').classList.remove('hidden');
}

