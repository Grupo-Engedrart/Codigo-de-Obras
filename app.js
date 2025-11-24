// App de Consulta de Obras - JavaScript Principal
class ObraApp {
    constructor() {
        this.obras = [];
        this.obrasFiltradas = [];
        this.isOnline = navigator.onLine;
        this.lastUpdate = null;
        
        // CONFIGURAÇÃO: Use 'google' para Google Sheets ou 'exemplo' para dados de exemplo
        this.dataSource = 'google'; // Altere para 'google' quando configurar sua planilha
        
        this.googleSheetId = '1HRJkTrTHbmdHYmxzrd1r1wCU7bCq-g6tkB36VMNfZyw'; // Substitua pelo ID da sua planilha
        this.googleSheetUrl = `https://docs.google.com/spreadsheets/d/${this.googleSheetId}/gviz/tq?tqx=out:json`;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkConnection();
        this.loadData();
        this.setupServiceWorker();
    }

    setupEventListeners() {
        // Busca
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

        // Botões
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadData(true);
        });

        document.getElementById('retryBtn').addEventListener('click', () => {
            this.loadData();
        });

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('backToList').addEventListener('click', () => {
            this.closeModal();
        });

        // Fechar modal ao clicar fora
        document.getElementById('detalhesModal').addEventListener('click', (e) => {
            if (e.target.id === 'detalhesModal') {
                this.closeModal();
            }
        });

        // Eventos de conexão
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

    async loadData(forceRefresh = false) {
        this.showLoading();
        
        try {
            let data;
            
            if (this.dataSource === 'google' && this.isOnline && (forceRefresh || !this.hasCachedData())) {
                // Tentar carregar do Google Sheets
                data = await this.loadFromGoogleSheets();
                if (data) {
                    this.saveToCache(data);
                    this.lastUpdate = new Date();
                    this.showStatus('Dados atualizados com sucesso', 'success');
                }
            }
            
            if (!data && this.hasCachedData()) {
                // Usar dados em cache
                data = this.loadFromCache();
                if (data) {
                    this.showStatus('Usando dados em cache', 'info');
                }
            }
            
            if (!data) {
                // Dados de exemplo para demonstração
                data = this.getSampleData();
                this.showStatus('Usando dados de exemplo', 'info');
            }
            
             this.obras = data;
             this.obrasFiltradas = data;
             this.renderObras();
             this.updateLastUpdateTime();

             // NOVO: esconder skeleton
              const loadingState = document.getElementById('loadingState');
             if (loadingState) {
             loadingState.classList.add('hidden');
             }
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showError();
        }
    }

    async loadFromGoogleSheets() {
        try {
            // Nota: Para usar com sua planilha, você precisa:
            // 1. Tornar a planilha pública ou usar uma API key
            // 2. Configurar o CORS apropriadamente
            // 3. Ajustar o parsing conforme o formato da sua planilha
            
            const response = await fetch(this.googleSheetUrl);
            const text = await response.text();
            
            // Parse JSONP response
            const jsonText = text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'));
            const data = JSON.parse(jsonText);
            
            return this.parseGoogleSheetsData(data);
        } catch (error) {
            console.error('Erro ao carregar do Google Sheets:', error);
            return null;
        }
    }

    parseGoogleSheetsData(data) {
        const rows = data.table?.rows || [];
        const obras = [];
        
        // Assumindo que as colunas são: Código, Empresa, AF, Descrição
        rows.forEach(row => {
            const cells = row.c || [];
            if (cells.length >= 4) {
                obras.push({
                    codigo: cells[0]?.v || '',
                    empresa: cells[1]?.v || '',
                    af: cells[2]?.v || '',
                    descricao: cells[3]?.v || ''
                });
            }
        });
        
        return obras;
    }

    getSampleData() {
        return [
            {
                codigo: "OB-001",
                empresa: "Construtora Silva",
                af: "AF2024-001",
                descricao: "Fundação do edifício residencial Torres do Sol"
            },
            {
                codigo: "OB-002", 
                empresa: "Engenharia Santos",
                af: "AF2024-002",
                descricao: "Instalação elétrica do centro comercial Plaza"
            },
            {
                codigo: "OB-003",
                empresa: "Construtora Silva", 
                af: "AF2024-003",
                descricao: "Revestimento externo do hospital municipal"
            },
            {
                codigo: "OB-004",
                empresa: "Obras Rápidas Ltda",
                af: "AF2024-004", 
                descricao: "Pavimentação da avenida principal"
            },
            {
                codigo: "OB-005",
                empresa: "Engenharia Santos",
                af: "AF2024-005",
                descricao: "Instalação hidráulica do prédio administrativo"
            }
        ];
    }

     filtrarObras(termo) {
       const termoLower = termo.toLowerCase().trim();

       if (!termoLower) {
          this.obrasFiltradas = this.obras;
        } else {
           this.obrasFiltradas = this.obras.filter(obra => 
              String(obra.codigo).toLowerCase().includes(termoLower) ||
              String(obra.empresa).toLowerCase().includes(termoLower) ||
              String(obra.af).toLowerCase().includes(termoLower) ||
              String(obra.descricao).toLowerCase().includes(termoLower)
            );
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
        
        obrasList.innerHTML = this.obrasFiltradas.map(obra => `
            <div class="obra-card bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow" 
                 onclick="app.mostrarDetalhes('${obra.codigo}')">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-bold text-gray-900">${obra.codigo}</h3>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">${obra.af}</span>
                </div>
                <p class="text-gray-700 font-medium mb-1">${obra.empresa}</p>
                <p class="text-gray-600 text-sm line-clamp-2">${obra.descricao}</p>
            </div>
        `).join('');
    }

    mostrarDetalhes(codigo) {
        const obra = this.obras.find(o => o.codigo === codigo);
        if (!obra) return;
        
        const content = document.getElementById('detalhesContent');
        content.innerHTML = `
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Código da Obra</h4>
                    <p class="text-lg font-bold text-gray-900">${obra.codigo}</p>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Empresa</h4>
                    <p class="text-lg font-medium text-gray-900">${obra.empresa}</p>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-500 mb-1">AF</h4>
                    <p class="text-lg font-medium text-gray-900">${obra.af}</p>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Descrição</h4>
                    <p class="text-base text-gray-900">${obra.descricao}</p>
                </div>
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
        
        setTimeout(() => {
            statusBar.classList.add('hidden');
        }, 3000);
    }

    getStatusClass(type) {
        const classes = {
            success: 'bg-green-50 text-green-800',
            warning: 'bg-yellow-50 text-yellow-800',
            error: 'bg-red-50 text-red-800',
            info: 'bg-blue-50 text-blue-800'
        };
        return classes[type] || classes.info;
    }

    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (this.lastUpdate) {
            const timeStr = this.lastUpdate.toLocaleTimeString('pt-BR');
            lastUpdateElement.textContent = `Atualizado: ${timeStr}`;
        }
    }

    // Cache Management
    saveToCache(data) {
        try {
            localStorage.setItem('obras_data', JSON.stringify(data));
            localStorage.setItem('obras_last_update', new Date().toISOString());
        } catch (error) {
            console.error('Erro ao salvar cache:', error);
        }
    }

    loadFromCache() {
        try {
            const data = localStorage.getItem('obras_data');
            const lastUpdate = localStorage.getItem('obras_last_update');
            
            if (data && lastUpdate) {
                this.lastUpdate = new Date(lastUpdate);
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Erro ao carregar cache:', error);
        }
        return null;
    }

    hasCachedData() {
        return localStorage.getItem('obras_data') !== null;
    }

    setupServiceWorker() {
        // Service Worker é registrado no HTML
        // Aqui podemos adicionar lógica adicional se necessário
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ObraApp();
});

// Handle back button on mobile
window.addEventListener('popstate', (e) => {
    if (window.app) {
        window.app.closeModal();
    }
});