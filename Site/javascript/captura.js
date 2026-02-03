// Seletores
        const inputNome = document.getElementById('nome');
        const inputCpf = document.getElementById('cpf');
        const inputPlaca = document.getElementById('placa');

        const vNome = document.getElementById('v-nome');
        const vCpf = document.getElementById('v-cpf');
        const vPlaca = document.getElementById('v-placa');

        // Sincronização em tempo real (O "Editar")
        inputNome.addEventListener('input', () => vNome.innerText = inputNome.value || "...");
        inputPlaca.addEventListener('input', () => vPlaca.innerText = inputPlaca.value.toUpperCase() || "...");
        
        // Máscara CPF e Sincronização
        inputCpf.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            val = val.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = val;
            vCpf.innerText = val || "...";
        });

        // Máscara Placa
        inputPlaca.addEventListener('input', (e) => {
            let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3);
            e.target.value = val.slice(0, 8);
        });

        // Limpar dados
        document.getElementById('btn-limpar').addEventListener('click', () => {
            document.getElementById('form-cliente').reset();
            vNome.innerText = "...";
            vCpf.innerText = "...";
            vPlaca.innerText = "...";
        });

        // Baixar Voucher
        document.getElementById('btn-baixar').addEventListener('click', function() {
            if(!inputNome.value || !inputCpf.value || !inputPlaca.value) {
                alert('Preencha todos os campos para atualizar o voucher!');
                return;
            }

            const voucher = document.getElementById('voucher');
            html2canvas(voucher, { scale: 3, backgroundColor: '#004200', useCORS: true, logging: false }).then(canvas => {
                const link = document.createElement('a');
                link.download = `Voucher-OlhoVivo-${inputPlaca.value}.jpeg`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        });

        window.onload = function() {
        const hoje = new Date();
    
        // Calcula a data de validade (Hoje + 30 dias)
        const validade = new Date();
        validade.setDate(hoje.getDate() + 30);

        // Formata as datas para o padrão brasileiro
        const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric' };
    
        document.getElementById('data-emissao').innerText = hoje.toLocaleDateString('pt-BR', opcoes);
        document.getElementById('data-validade').innerText = validade.toLocaleDateString('pt-BR', opcoes);
        };

