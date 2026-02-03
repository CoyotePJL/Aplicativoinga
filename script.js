// --- FUNÇÕES DE INTERFACE (MOSTRAR/ESCONDER) ---

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

// Carrega os preços de Verniz e Metal dinamicamente
function atualizarOpcoesExtra() {
    const tipo = document.getElementById('tipoExtra').value;
    const subDiv = document.getElementById('subOpcoesExtra');
    const selectItem = document.getElementById('itemExtra');
    
    subDiv.style.display = tipo ? 'block' : 'none';
    selectItem.innerHTML = ""; 

    if (tipo === "verniz") {
        selectItem.innerHTML = `
            <option value="15">Folha de Janela</option>
            <option value="70">Porta Lisa</option>
            <option value="90">Porta Detalhada</option>
        `;
    } else if (tipo === "metal") {
        selectItem.innerHTML = `
            <option value="25">Folha de Janela Metal</option>
            <option value="80">Porta Lisa Metal</option>
            <option value="100">Porta Detalhada Metal</option>
        `;
    }
}
// --- FUNÇÃO DE CÁLCULO PRINCIPAL ---

function calcularOrcamento() {
    // 1. Metragem (Quantidade de Paredes x Tamanho)
    const quantidade = Number(document.getElementById('qtdParedes')?.value) || 1;
    const metrosUnitarios = Number(document.getElementById('metros').value) || 0;
    const metros = quantidade * metrosUnitarios;
    const m2Base = 12;

    // 2. Umidade
    const valorUmidade = Number(document.getElementById('valorUmidade').value) || 0;

    // 3. Massa
    let totalMassa = 0;
    const tipoMassa = document.getElementById('tipoMassa').value;
    if (tipoMassa === 'pequeno') {
        totalMassa = Number(document.getElementById('valorMassaManual').value) || 0;
    } else if (tipoMassa === 'corrida' || tipoMassa === 'acrilica') {
        const precoBaseMassa = (tipoMassa === 'corrida') ? 120 : 140; 
        const demaosMassa = Number(document.getElementById('demaosMassa').value) || 1;
        totalMassa = (metros / m2Base) * precoBaseMassa * demaosMassa;
    }

    // 4. Lixamento
    let totalLixamento = 0;
    const tipoLixamento = document.getElementById('tipoLixamento').value;
    if (tipoLixamento === 'manual_pequeno') {
        totalLixamento = Number(document.getElementById('valorLixaManual').value) || 0;
    } else if (tipoLixamento === 'lixa_corrida' || tipoLixamento === 'lixa_acrilica') {
        const precoBaseLixa = (tipoLixamento === 'lixa_corrida') ? 25 : 35;
        totalLixamento = (metros / m2Base) * precoBaseLixa;
    }

    // 5. Pintura
    const estado = document.getElementById('estadoParede').value;
    const demaosTinta = Number(document.getElementById('demaosTinta').value) || 1;
    let precoEstadoBase = (estado === 'simples') ? 20 : (estado === 'liso' ? 30 : 35);
    const totalPintura = (metros / m2Base) * precoEstadoBase * demaosTinta;

    // 6. Serviços Extras (Verniz e Metais)
    let valorExtraTotal = 0;
    let descExtra = "";
    if (document.getElementById('extraSim').checked) {
        const precoUnitario = Number(document.getElementById('itemExtra').value) || 0;
        const qtdExtra = Number(document.getElementById('qtdExtra').value) || 1;
        const selectItem = document.getElementById('itemExtra');
        
        valorExtraTotal = precoUnitario * qtdExtra;
        descExtra = selectItem.options[selectItem.selectedIndex]?.text || "Serviço Extra";
    }

    // --- SOMA FINAL ---
    const totalGeral = valorUmidade + totalMassa + totalLixamento + totalPintura + valorExtraTotal;

    // --- EXIBIÇÃO ---
    const status = document.getElementById('status');
    status.innerHTML = `
        <div style="text-align: left;">
            <strong style="color: #007bff;">RESUMO DA OBRA (${metros}m²)</strong><br><hr>
            Pintura Paredes: R$ ${totalPintura.toFixed(2)}<br>
            Massa/Lixa/Umidade: R$ ${(totalMassa + totalLixamento + valorUmidade).toFixed(2)}<br>
            ${valorExtraTotal > 0 ? `Extra (${descExtra} x${document.getElementById('qtdExtra').value}): R$ ${valorExtraTotal.toFixed(2)}<br>` : ''}
            <hr>
            <strong style="font-size: 22px; color: #28a745;">Total Final: R$ ${totalGeral.toFixed(2)}</strong>
        </div>
    `;
}

// Configuração para o Android
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('script.js').then(() => console.log("IngáApp Pronto!"));
}
        
