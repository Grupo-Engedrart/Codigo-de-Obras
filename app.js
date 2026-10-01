// App de Consulta de Obras - JavaScript Principal
//
// Fonte (30/09/2026): lista pública publicada pelo Dataflow a cada carga do Mega (árvore de projetos), num bucket
// separado e só com identificação da obra (código Reduzido, empresa, contrato, AF, descrição). Obra criada no Mega
// aparece sozinha na carga seguinte; finalizadas saem. Antes a fonte era uma planilha mantida à mão.
const FONTE_OBRAS = 'https://publico.dataflow.tec.br/engedrart/obras.json';
const CHAVE_CACHE = 'obras_dataflow_v1';

/** Texto vindo dos dados vai para a tela sempre escapado (nunca como HTML). */
function esc(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const rotuloCodigo = (codigo) => `Código - ${codigo}`;

class ObraApp {
    constructor() {
        this.obras = [];
        this.obrasFiltradas = [];
        this.isOnline = navigator.onLine;
        this.lastUpdate = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkConnection();
        this.loadData();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        searchInput.addEventListener('input', (e) => {
            this.filtrarObras(e.target.value);
            clearSearch.classList.toggle('hidden', !e.target.value);
        });

        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.filtrarObras('');
            clearSearch.classList.add('hidden');
        });

        document.getElementById('refreshBtn').addEventListener('click', () => this.loadData());
        document.getElementById('retryBtn').addEventListener('click', () => this.loadData());

        // Clique num card: pelo atributo data-codigo (código com apóstrofo ou espaço não quebra a tela).
        document.getElementById('obrasList').addEventListener('click', (e) => {
            const card = e.target.closest('[data-codigo]');
            if (card) this.mostrarDetalhes(card.dataset.codigo);
        });

        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('backToList').addEventListener('click', () => this.closeModal());
        document.getElementById('detalhesModal').addEventListener('click', (e) => {
            if (e.target.id === 'detalhesModal') this.closeModal();
        });

        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus();
            this.loadData();
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus();
        });
    }

    checkConnection() {
        this.updateConnectionStatus();
    }

    updateConnectionStatus() {
        const offlineIndicator = document.getElementById('offlineIndicator');
        if (this.isOnline) {
            offlineIndicator.classList.add('hidden');
        } else {
            offlineIndicator.classList.remove('hidden');
            this.showStatus('Modo offline - usando dados em cache', 'warning');
        }
    }

    async loadData() {
        this.showLoading();
        let data = null;

        if (this.isOnline) {
            data = await this.loadFromDataflow();
            if (data) {
                this.saveToCache(data);
                this.showStatus('Dados atualizados com sucesso', 'success');
            }
        }

        if (!data) {
            data = this.loadFromCache();
            if (data) this.showStatus('Usando dados em cache (podem estar desatualizados)', 'warning');
        }

        // Sem rede e sem cópia: erro claro. Nunca mostrar obras de exemplo (alguém poderia anotar um código falso).
        if (!data) {
            this.showError();
            return;
        }

        this.obras = data;
        const termo = document.getElementById('searchInput').value;
        this.filtrarObras(termo);
        this.updateLastUpdateTime();
        document.getElementById('loadingState').classList.add('hidden');
    }

    async loadFromDataflow() {
        try {
            const response = await fetch(FONTE_OBRAS, { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            if (!json || !Array.isArray(json.obras)) throw new Error('formato inesperado');
            this.lastUpdate = json.atualizado_em ? new Date(json.atualizado_em) : new Date();
            return json.obras
                .filter((o) => o && o.codigo)
                .map((o) => ({
                    codigo: String(o.codigo),
                    empresa: String(o.empresa || ''),
                    contrato: String(o.contrato || ''),
                    af: String(o.af || ''),
                    descricao: String(o.descricao || ''),
                }));
        } catch (error) {
            console.error('Erro ao carregar a lista de obras:', error);
            return null;
        }
    }

    filtrarObras(termo) {
        // Todas as palavras digitadas precisam aparecer na obra (código, empresa, contrato, AF ou descrição).
        const termosBusca = termo.toLowerCase().trim().split(/\s+/).filter((t) => t.length > 0);
        if (termosBusca.length === 0) {
            this.obrasFiltradas = this.obras;
        } else {
            this.obrasFiltradas = this.obras.filter((obra) => {
                const conteudoObra = [rotuloCodigo(obra.codigo), obra.empresa, obra.contrato, obra.af, obra.descricao].join(' ').toLowerCase();
                return termosBusca.every((palavra) => conteudoObra.includes(palavra));
            });
        }
        this.renderObras();
    }

    renderObras() {
        const obrasList = document.getElementById('obrasList');
        const emptyState = document.getElementById('emptyState');

        if (this.obrasFiltradas.length === 0) {
            obrasList.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        obrasList.classList.remove('hidden');

        obrasList.innerHTML = this.obrasFiltradas
            .map(
                (obra) => `
            <div class="obra-card bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                 data-codigo="${esc(obra.codigo)}" role="button" tabindex="0">
                <div class="flex justify-between items-start mb-2 gap-2">
                    <h3 class="text-lg font-bold text-gray-900">${esc(rotuloCodigo(obra.codigo))}</h3>
                    ${obra.af ? `<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded text-right">${esc(obra.af)}</span>` : ''}
                </div>
                ${obra.empresa ? `<p class="text-gray-700 font-medium mb-1">${esc(obra.empresa)}</p>` : ''}
                <p class="text-gray-600 text-sm line-clamp-2">${esc(obra.descricao)}</p>
            </div>
        `,
            )
            .join('');
    }

    mostrarDetalhes(codigo) {
        const obra = this.obras.find((o) => o.codigo === codigo);
        if (!obra) return;

        const campo = (titulo, valor, classe = 'text-lg font-medium') => `
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="text-sm font-medium text-gray-500 mb-1">${titulo}</h4>
                <p class="${classe} text-gray-900">${esc(valor)}</p>
            </div>`;

        document.getElementById('detalhesContent').innerHTML = `
            <div class="space-y-4">
                ${campo('Código da Obra', rotuloCodigo(obra.codigo), 'text-lg font-bold')}
                ${obra.empresa ? campo('Empresa', obra.empresa) : ''}
                ${obra.contrato ? campo('Contrato', obra.contrato) : ''}
                ${obra.af ? campo('AF', obra.af) : ''}
                ${campo('Descrição', obra.descricao, 'text-base')}
            </div>
        `;
        document.getElementById('detalhesModal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('detalhesModal').classList.add('hidden');
    }

    showLoading() {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('obrasList').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('errorState').classList.add('hidden');
    }

    showError() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('obrasList').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
    }

    showStatus(message, type = 'info') {
        const statusBar = document.getElementById('statusBar');
        const statusText = document.getElementById('statusText');
        statusText.textContent = message;
        statusBar.className = `px-4 py-2 text-sm ${this.getStatusClass(type)}`;
        statusBar.classList.remove('hidden');
        setTimeout(() => statusBar.classList.add('hidden'), 3000);
    }

    getStatusClass(type) {
        const classes = {
            success: 'bg-green-50 text-green-800',
            warning: 'bg-yellow-50 text-yellow-800',
            error: 'bg-red-50 text-red-800',
            info: 'bg-blue-50 text-blue-800',
        };
        return classes[type] || classes.info;
    }

    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (this.lastUpdate && !isNaN(this.lastUpdate)) {
            lastUpdateElement.textContent = `Atualizado: ${this.lastUpdate.toLocaleDateString('pt-BR')}`;
        }
    }

    // Cópia local para uso sem internet (a última lista recebida).
    saveToCache(data) {
        try {
            localStorage.setItem(CHAVE_CACHE, JSON.stringify({ obras: data, atualizado_em: this.lastUpdate?.toISOString() ?? null }));
        } catch (error) {
            console.error('Erro ao salvar cache:', error);
        }
    }

    loadFromCache() {
        try {
            const json = JSON.parse(localStorage.getItem(CHAVE_CACHE) || 'null');
            if (json && Array.isArray(json.obras) && json.obras.length) {
                this.lastUpdate = json.atualizado_em ? new Date(json.atualizado_em) : null;
                return json.obras;
            }
        } catch (error) {
            console.error('Erro ao carregar cache:', error);
        }
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new ObraApp();
});

// Botão voltar do celular fecha o detalhe.
window.addEventListener('popstate', () => {
    if (window.app) window.app.closeModal();
});
