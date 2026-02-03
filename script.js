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

function toggleExtra() {
    const temExtra = document.getElementById('extraSim').checked;
    document.getElementById('campoServicoExtra').style.display = temExtra ? 'block' : 'none';
}

// --- FUNÇÃO DE CÁLCULO PRINCIPAL ---

function calcularOrcamento() {
    // 1. Metragem Total (Quantidade x Tamanho)
    const quantidade = Number(document.getElementById('qtdParedes').value) || 1;
    const metrosUnitarios = Number(document.getElementById('metros').value) || 0;
    const metros = quantidade * metrosUnitarios;
    const m2Base = 12; // Sua base de cálculo de 12m²

    // 2. Cálculo de Umidade
    const valorUmidade = Number(document.getElementById('valorUmidade').value) || 0;

    // 3. Cálculo de Massa
    let totalMassa = 0;
    const tipoMassa = document.getElementById('tipoMassa').value;
    if (tipoMassa === 'pequeno') {
        totalMassa = Number(document.getElementById('valorMassaManual').value) || 0;
    } else if (tipoMassa === 'corrida' || tipoMassa === 'acrilica') {
        const precoBaseMassa = (tipoMassa === 'corrida') ? 120 : 140; 
        const demaosMassa = Number(document.getElementById('demaosMassa').value) || 1;
        totalMassa = (metros / m2Base) * precoBaseMassa * demaosMassa;
    }

    // 4. Cálculo de Lixamento
    let totalLixamento = 0;
    const tipoLixamento = document.getElementById('tipoLixamento').value;
    if (tipoLixamento === 'manual_pequeno') {
        totalLixamento = Number(document.getElementById('valorLixaManual').value) || 0;
    } else if (tipoLixamento === 'lixa_corrida' || tipoLixamento === 'lixa_acrilica') {
        const precoBaseLixa = (tipoLixamento === 'lixa_corrida') ? 25 : 35;
        totalLixamento = (metros / m2Base) * precoBaseLixa;
    }

    // 5. Cálculo de Pintura (Estado da Parede)
    const estado = document.getElementById('estadoParede').value;
    const demaosTinta = Number(document.getElementById('demaosTinta').value) || 1;
    let precoEstadoBase = 0;
    if (estado === 'simples') precoEstadoBase = 20;
    if (estado === 'liso') precoEstadoBase = 30;
    if (estado === 'gesso') precoEstadoBase = 35;

    const totalPintura = (metros / m2Base) * precoEstadoBase * demaosTinta;

    // 6. Cálculo de Serviço Extra
    let valorExtra = 0;
    let descExtra = "";
    if (document.getElementById('extraSim').checked) {
        valorExtra = Number(document.getElementById('valorExtra').value) || 0;
        descExtra = document.getElementById('descExtra').value || "Serviço Extra";
    }

    // --- SOMA FINAL ---
    const totalGeral = valorUmidade + totalMassa + totalLixamento + totalPintura + valorExtra;

    // --- EXIBIÇÃO NO APP ---
    const status = document.getElementById('status');
    status.innerHTML = `
        <div style="text-align: left;">
            <strong style="color: #007bff;">RESUMO (${metros}m² total)</strong><br><hr>
            Pintura (${demaosTinta} demãos): R$ ${totalPintura.toFixed(2)}<br>
            Preparo (Massa/Lixa/Umidade): R$ ${(totalMassa + totalLixamento + valorUmidade).toFixed(2)}<br>
            ${valorExtra > 0 ? `Extra (${descExtra}): R$ ${valorExtra.toFixed(2)}<br>` : ''}
            <hr>
            <strong style="font-size: 22px; color: #28a745;">Total: R$ ${totalGeral.toFixed(2)}</strong>
        </div>
    `;
}

// Registro para funcionamento offline no Android
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('script.js')
      .then(() => console.log("App Ingá Pintura pronto!"));
}
