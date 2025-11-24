# 📊 Configuração do Google Sheets - Guia Completo

Este guia detalha como configurar sua planilha Google Sheets para funcionar perfeitamente com o aplicativo Consulta de Obras.

## 🎯 Objetivo

Permitir que o aplicativo leia dados diretamente de uma planilha Google Sheets, possibilitando atualizações em tempo real sem necessidade de reinstalar ou reconfigurar o app.

## 📋 Passo a Passo Detalhado

### 1. Criar e Preparar a Planilha

#### 1.1 Estrutura da Planilha
Crie uma nova planilha Google Sheets com a seguinte estrutura:

```
Linha 1 (Cabeçalho):
A1: Código    | B1: Empresa    | C1: AF    | D1: Descrição

Linhas seguintes (Dados):
A2: OB-001   | B2: Construtora Silva | C2: AF2024-001 | D2: Fundação do edifício...
A3: OB-002   | B3: Engenharia Santos | C3: AF2024-002 | D3: Instalação elétrica...
```

#### 1.2 Formato dos Dados
- **Código**: Texto curto, preferencialmente único (ex: OB-001, OB-002)
- **Empresa**: Nome da empresa responsável
- **AF**: Número da Autorização de Fornecimento
- **Descrição**: Descrição detalhada da obra (pode ter várias linhas)

#### 1.3 Exemplo de Preenchimento
```
Código  | Empresa             | AF         | Descrição
OB-001  | Construtora Silva   | AF2024-001 | Fundação do edifício residencial Torres do Sol
OB-002  | Engenharia Santos   | AF2024-002 | Instalação elétrica do centro comercial Plaza  
OB-003  | Construtora Silva   | AF2024-003 | Revestimento externo do hospital municipal
OB-004  | Obras Rápidas Ltda  | AF2024-004 | Pavimentação da avenida principal
OB-005  | Engenharia Santos   | AF2024-005 | Instalação hidráulica do prédio administrativo
```

### 2. Configurar Acesso Público

#### 2.1 Tornar Planilha Pública
1. Abra sua planilha Google Sheets
2. Clique no botão "Compartilhar" (canto superior direito)
3. Clique em "Alterar para qualquer pessoa com o link"
4. Em "Acesso", selecione "Leitor" (apenas leitura)
5. Clique em "Concluído"

#### 2.2 Obter ID da Planilha
1. Na URL da planilha, localize o ID entre `/d/` e `/edit`
2. Exemplo: `https://docs.google.com/spreadsheets/d/1ABC123def456GHI789jkl/edit`
3. ID: `1ABC123def456GHI789jkl`

### 3. Configurar no Aplicativo

#### 3.1 Editar o Arquivo JavaScript
1. Abra o arquivo `app.js`
2. Localize a linha:
   ```javascript
   this.googleSheetId = 'SUA_PLANILHA_ID_AQUI';
   ```
3. Substitua pelo ID da sua planilha:
   ```javascript
   this.googleSheetId = '1ABC123def456GHI789jkl';
   ```

#### 3.2 Testar a Conexão
1. Salve o arquivo modificado
2. Abra o aplicativo no navegador
3. Use o botão "Atualizar" para buscar dados
4. Verifique se os dados aparecem corretamente

### 4. Formas de Atualização

#### 4.1 Atualização Automática
- O app verifica atualizações a cada 5 minutos quando online
- Dados novos são sincronizados automaticamente
- Cache é atualizado no dispositivo

#### 4.2 Atualização Manual
- Botão "Atualizar" no topo do app
- Força busca imediata de novos dados
- Útil quando você sabe que há mudanças

#### 4.3 Atualização em Tempo Real
- Edite a planilha Google Sheets
- Mudanças aparecem no app após sincronização
- Sem necessidade de reinstalar ou reconfigurar

## 🔧 Solução de Problemas

### Problema: "Dados não carregam"
**Causas possíveis:**
- Planilha não está pública
- ID da planilha incorreto
- Formato dos dados incorreto
- CORS bloqueando acesso

**Soluções:**
1. Verifique se a planilha está pública
2. Confira o ID no código JavaScript
3. Verifique formato das colunas (A, B, C, D)
4. Teste acesso direto à planilha no navegador

### Problema: "App mostra dados de exemplo"
**Causas:**
- Falha na conexão com Google Sheets
- Planilha inacessível
- Erro de configuração

**Soluções:**
1. Verifique conexão com internet
2. Confirme configuração da planilha
3. Verifique console do navegador (F12)
4. Teste URL da planilha diretamente

### Problema: "Atualizações não aparecem"
**Causas:**
- Cache do navegador
- Sincronização pendente
- Erro na planilha

**Soluções:**
1. Use botão "Atualizar" no app
2. Limpe cache do navegador
3. Verifique se dados estão salvos na planilha
4. Aguarde sincronização automática

## 📊 Limitações e Considerações

### Limitações Técnicas
- Máximo de 10,000 linhas por planilha
- Limite de requisições do Google Sheets
- Dependência de conexão para atualizações
- Cache limitado por dispositivo

### Segurança
- Planilha deve ser pública (apenas leitura)
- Sem autenticação necessária
- Dados visíveis para qualquer pessoa com o link
- Recomendado não incluir informações sensíveis

### Performance
- Primeira carga pode ser lenta
- Cache melhora performance em uso contínuo
- Sincronização em background
- Otimizado para mobile

## 🔄 Manutenção

### Manutenção Regular
1. **Verificar dados**: Confira integridade dos dados regularmente
2. **Backup**: Faça backup periódico da planilha
3. **Monitoramento**: Verifique acesso e uso do app
4. **Atualizações**: Mantenha app atualizado com novas versões

### Melhorias Futuras
- Implementar autenticação (se necessário)
- Adicionar filtros avançados
- Exportar dados para PDF
- Integração com outros sistemas

## 📞 Suporte Técnico

Se encontrar problemas:

1. **Verifique esta documentação**
2. **Teste a planilha diretamente**: Tente acessar via navegador
3. **Verifique console do navegador**: F12 → Console
4. **Teste conexão**: Verifique se há bloqueios de firewall
5. **Documente o erro**: Screenshots e descrição detalhada

---

**Última atualização**: Novembro 2024
**Versão da documentação**: 1.0.0