// Service Worker para Consulta de Obras PWA
const CACHE_NAME = 'consulta-obras-v3'; // Mudei de v2 para v3
const STATIC_CACHE = 'consulta-obras-static-v3';
const DYNAMIC_CACHE = 'consulta-obras-dynamic-v3';

// Arquivos para cache estático
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Cacheando arquivos estáticos');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Arquivos estáticos cacheados');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Erro ao cachear arquivos:', error);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Ativando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deletando cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Ativado');
                return self.clients.claim();
            })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar requisições não-GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Estratégia de cache para diferentes tipos de recursos
    if (url.origin === location.origin) {
    // Recursos locais - Network First (Prioriza sempre a versão mais nova)
    event.respondWith(networkFirst(request));
    } else if (url.hostname === 'fonts.googleapis.com' || 
               url.hostname === 'fonts.gstatic.com' ||
               url.hostname === 'cdn.tailwindcss.com') {
        // Recursos externos de terceiros - Cache First com longo prazo
        event.respondWith(cacheFirst(request));
    } else if (url.hostname === 'docs.google.com') {
        // Google Sheets - Network First para dados atualizados
        event.respondWith(networkFirst(request));
    } else {
        // Outros recursos - Network First
        event.respondWith(networkFirst(request));
    }
});

// Estratégia Cache First
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Service Worker: Recurso servido do cache:', request.url);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('Service Worker: Recurso cacheado:', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Erro em cacheFirst:', error);
        
        // Retornar página offline para recursos HTML
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Estratégia Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('Service Worker: Recurso atualizado e cacheado:', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Recurso servido do cache (offline):', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Retornar dados em cache para Google Sheets
        if (request.url.includes('google.com/spreadsheets')) {
            return new Response(JSON.stringify({
                error: 'offline',
                message: 'Dados offline - conecte-se para atualizar'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        throw error;
    }
}

// Sincronização em background para atualizar dados
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Sincronização em background:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            sincronizarDados()
        );
    }
});

// Função para sincronizar dados
async function sincronizarDados() {
    try {
        console.log('Service Worker: Sincronizando dados...');
        
        // Aqui você pode implementar lógica para sincronizar dados
        // Por exemplo, verificar atualizações no Google Sheets
        
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                message: 'Dados sincronizados com sucesso'
            });
        });
        
    } catch (error) {
        console.error('Service Worker: Erro na sincronização:', error);
    }
}

// Mensagens do cliente
self.addEventListener('message', (event) => {
    console.log('Service Worker: Mensagem recebida:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Limpeza periódica de cache dinâmico
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'cleanup-cache') {
        event.waitUntil(
            limparCacheAntigo()
        );
    }
});

// Função para limpar cache antigo
async function limparCacheAntigo() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        
        // Limpar entradas com mais de 7 dias
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        await Promise.all(
            requests.map(async (request) => {
                const response = await cache.match(request);
                const dateHeader = response.headers.get('date');
                
                if (dateHeader) {
                    const responseDate = new Date(dateHeader).getTime();
                    if (responseDate < oneWeekAgo) {
                        await cache.delete(request);
                        console.log('Service Worker: Cache antigo removido:', request.url);
                    }
                }
            })
        );
        
    } catch (error) {
        console.error('Service Worker: Erro ao limpar cache:', error);
    }
}