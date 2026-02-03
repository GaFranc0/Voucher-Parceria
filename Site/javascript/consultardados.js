import { initializeApp } from "ESSE_EU_NAO_LEMBRAVA_SE_ERA_IMPORTANTE";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, Timestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "NAO_É_A_MINHA_API",
    authDomain: "NAO_É_A_MINHA_API",
    projectId: "NAO_É_A_MINHA_API",
    storageBucket: "NAO_É_A_MINHA_API",
    messagingSenderId: "NAO_É_A_MINHA_API",
    appId: "NAO_É_A_MINHA_API"
};

async function deletarVencidos() {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const clientesRef = collection(db, "Clientes");
        
        
        const q = query(clientesRef, where("vencimento", "<=", hoje));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("Nenhum voucher vencido para deletar.");
            return;
        }

        let contador = 0;
        
        for (const documento of querySnapshot.docs) {
            await deleteDoc(doc(db, "Clientes", documento.id));
            contador++;
        }

        console.log(`${contador} clientes removidos por vencimento.`);
        alert(`Limpeza concluída! ${contador} vouchers vencidos foram apagados.`);
    } catch (error) {
        console.error("Erro ao deletar vencidos:", error);
    }
}

function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarNome(nome) {
    return nome.toLowerCase().split(' ').map(palavra => 
        palavra.charAt(0).toUpperCase() + palavra.slice(1)
    ).join(' ');
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const btnBuscar = document.getElementById('btnBuscar');
const inputBusca = document.getElementById('inputBusca');
const btnAtender = document.getElementById('btnAtender');

btnBuscar.addEventListener('click', async () => {
    const cpfBusca = inputBusca.value.replace(/\D/g, ''); 
    
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('msgErro').classList.add('hidden');

    if (cpfBusca.length < 11) {
        alert("Por favor, digite um CPF válido.");
        return;
    }

    try {
       
        const q = query(collection(db, "Clientes"), where("cpf", "==", cpfBusca));
        
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((item) => {
                const dados = item.data();
                const idDocumento = item.id;
                
                document.getElementById('resNome').innerText = formatarNome(dados.nome);
                document.getElementById('resCPF').innerText = formatarCPF(dados.cpf);
                document.getElementById('resPlaca').innerText = dados.placa;
                
                const elStatus = document.getElementById('resStatus');
                elStatus.innerText = dados.status || "PENDENTE";

                
            if (dados.status === "ATENDIDO") {
                elStatus.className = "inline-block bg-green-600 text-white px-2 py-1 rounded font-mono text-sm uppercase tracking-widest";
                btnAtender.classList.add('hidden');
            } else {
                elStatus.className = "inline-block bg-olho-dark text-white px-2 py-1 rounded font-mono text-sm uppercase tracking-widest";
                btnAtender.classList.remove('hidden');
            }

                
                btnAtender.onclick = async () => {
                    try {
                        
                    const horasParaApagar = 24; 
                    const dataExpiracao = new Date(Date.now() + (horasParaApagar * 60 * 60 * 1000));
                    

                    const docRef = doc(db, "Clientes", idDocumento);
                    
                    
                    await updateDoc(docRef, { 
                        status: "ATENDIDO",
                        deletarEm: Timestamp.fromDate(dataExpiracao) 
                    });

                        alert("Status atualizado com sucesso!");
                        elStatus.innerText = "ATENDIDO";
                        elStatus.className = "inline-block bg-green-600 text-white px-2 py-1 rounded font-mono text-sm uppercase tracking-widest";
                        btnAtender.classList.add('hidden');
                    } catch (erro) {
                        console.error("Erro ao atualizar:", erro);
                        alert("Erro ao atualizar status.");
                    }
                };
            });
            
            document.getElementById('resultado').classList.remove('hidden');
        } else {
            document.getElementById('msgErro').classList.remove('hidden');
        }
    } catch (error) {
        console.error("Erro técnico:", error);
        alert("Erro ao consultar o banco. Verifique o console.");
    }
});


window.addEventListener('load', () => {
    deletarVencidos();
});