// --- FUNÇÕES DE INTERFACE (MOSTRAR/ESCONDER CAMPOS) ---

function toggleUmidade() {
    const temUmidade = document.getElementById('umidadeSim').checked;
    document.getElementById('campoValorUmidade').style.display = temUmidade ? 'block' : 'none';
}

function toggleMassa() {
    const selecao = document.getElementById('tipoMassa').value;
    document.getElementById('campoMassaManual').style.display = (selecao === 'pequeno') ? 'block' : 'none';
    document.getElementById('campoDemaosMassa').style.display = (selecao === 'corrida' || selecao === 'acrilica') ? 'block' : 'none';
}

function toggleLixamento() {
    const selecao = document.getElementById('tipoLixamento').value;
    document.getElementById('campoLixamentoManual').style.display = (selecao === 'manual_pequeno') ? 'block' : 'none';
}

// --- FUNÇÃO DE CÁLCULO PRINCIPAL ---

function calcularOrcamento() {
    const metros = Number(document.getElementById('metros').value) || 0;
    const m2Base = 12; // Sua régua de 12m²

    // 1. Cálculo de Umidade
    const valorUmidade = Number(document.getElementById('valorUmidade').value) || 0;

    // 2. Cálculo de Massa
    let totalMassa = 0;
    const tipoMassa = document.getElementById('tipoMassa').value;
    if (tipoMassa === 'pequeno') {
        totalMassa = Number(document.getElementById('valorMassaManual').value) || 0;
    } else if (tipoMassa === 'corrida' || tipoMassa === 'acrilica') {
        const precoBaseMassa = (tipoMassa === 'corrida') ? 120 : 140; // Preço para 12m²
        const demaosMassa = Number(document.getElementById('demaosMassa').value) || 1;
        totalMassa = (metros / m2Base) * precoBaseMassa * demaosMassa;
    }

    // 3. Cálculo de Lixamento
    let totalLixamento = 0;
    const tipoLixamento = document.getElementById('tipoLixamento').value;
    if (tipoLixamento === 'manual_pequeno') {
        totalLixamento = Number(document.getElementById('valorLixaManual').value) || 0;
    } else if (tipoLixamento === 'lixa_corrida' || tipoLixamento === 'lixa_acrilica') {
        const precoBaseLixa = (tipoLixamento === 'lixa_corrida') ? 25 : 35;
        totalLixamento = (metros / m2Base) * precoBaseLixa;
    }

    // 4. Cálculo de Pintura (Estado da Parede)
    const estado = document.getElementById('estadoParede').value;
    const demaosTinta = Number(document.getElementById('demaosTinta').value) || 1;
    let precoEstadoBase = 0;

    if (estado === 'simples') precoEstadoBase = 20;
    if (estado === 'liso') precoEstadoBase = 30;
    if (estado === 'gesso') precoEstadoBase = 35;

    const totalPintura = (metros / m2Base) * precoEstadoBase * demaosTinta;

    // --- SOMA FINAL ---
    const totalGeral = valorUmidade + totalMassa + totalLixamento + totalPintura;

    // --- EXIBIÇÃO NO APP ---
    const status = document.getElementById('status');
    status.innerHTML = `
        <div style="text-align: left;">
            <strong style="color: #007bff;">RESUMO DO SERVIÇO (${metros}m²)</strong><br><hr>
            Umidade: R$ ${valorUmidade.toFixed(2)}<br>
            Massa: R$ ${totalMassa.toFixed(2)}<br>
            Lixamento: R$ ${totalLixamento.toFixed(2)}<br>
            Pintura (${demaosTinta} demãos): R$ ${totalPintura.toFixed(2)}<br>
            <hr>
            <strong style="font-size: 22px; color: #28a745;">Total: R$ ${totalGeral.toFixed(2)}</strong>
        </div>
    `;
}


