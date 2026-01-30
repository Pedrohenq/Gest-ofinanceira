# 🔧 Guia de Solução de Problemas

## ❌ Erro: "Erro ao adicionar transação"

Este erro geralmente ocorre por problemas de configuração do Firebase. Siga este checklist:

### 1. ✅ Verificar se o Firestore está ativado

No [Console do Firebase](https://console.firebase.google.com/):

1. Selecione seu projeto: **gestaofinanceira-312a1**
2. No menu lateral, clique em **Firestore Database**
3. Se não estiver criado, clique em **Criar banco de dados**
4. Escolha **Modo de produção** (vamos configurar as regras manualmente)
5. Escolha a localização mais próxima (ex: `southamerica-east1` para Brasil)

### 2. ✅ Configurar as Regras de Segurança

**MUITO IMPORTANTE**: As regras padrão bloqueiam todas as escritas!

1. No Firestore Database, clique na aba **Regras**
2. **Substitua TODO o conteúdo** pelo código abaixo:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Regra para a coleção de transações
    match /transactions/{transactionId} {
      // Permitir criação apenas se o usuário estiver autenticado
      // E o userId do documento corresponder ao uid do usuário autenticado
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      
      // Permitir leitura, atualização e exclusão apenas se:
      // 1. O usuário estiver autenticado
      // 2. O userId do documento corresponder ao uid do usuário autenticado
      allow read, update, delete: if request.auth != null 
                                   && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Clique em **Publicar** (botão azul no canto superior direito)
4. **Aguarde alguns segundos** para as regras serem aplicadas

### 3. ✅ Verificar Autenticação

1. No menu lateral do Firebase, clique em **Authentication**
2. Clique na aba **Sign-in method**
3. Certifique-se de que **Email/Password** está **Ativado**
4. Se não estiver, clique em **Email/Password** → **Ativar** → **Salvar**

### 4. ✅ Testar a Conexão

Abra o Console do Navegador (F12) e procure por:

#### ✔️ Mensagens de Sucesso:
```
Tentando adicionar transação: {userId: "...", type: "expense", ...}
Transação adicionada com sucesso! ID: abc123...
```

#### ❌ Mensagens de Erro Comuns:

**ERRO 1: "permission-denied"**
```
Código do erro: permission-denied
```
**Solução**: As regras do Firestore não estão configuradas corretamente. Volte ao passo 2.

**ERRO 2: "unavailable"**
```
Código do erro: unavailable
```
**Solução**: Problema de conexão ou Firestore não ativado. Verifique sua internet e o passo 1.

**ERRO 3: "not-found"**
```
Firestore: ... (not found)
```
**Solução**: Projeto Firebase não encontrado. Verifique se as credenciais em `src/lib/firebase.ts` estão corretas.

### 5. ✅ Verificar Estrutura dos Dados

Os dados devem ser salvos neste formato no Firestore:

```javascript
{
  userId: "abc123...",          // ID do usuário autenticado
  type: "expense",               // "income" ou "expense"
  amount: 150.50,                // Número (não string)
  category: "Alimentação",       // String
  description: "Almoço",         // String
  date: "2024-01-15",           // String no formato ISO
  createdAt: 1705334567890      // Timestamp em milissegundos
}
```

### 6. ✅ Limpar Cache e Recarregar

Se nada funcionar:

1. Feche todas as abas do navegador
2. Limpe o cache (Ctrl+Shift+Delete)
3. Reabra o navegador
4. Acesse novamente o sistema
5. Faça logout e login novamente

### 7. 🔍 Debug Avançado

Se o erro persistir, siga estes passos:

1. Abra o Console do Navegador (F12)
2. Vá para a aba **Console**
3. Tente adicionar uma transação
4. Copie TODA a mensagem de erro
5. Procure por:
   - `Código do erro: XXX`
   - `Mensagem: XXX`
   - `Erro detalhado: XXX`

### 8. 📋 Checklist Final

Marque cada item:

- [ ] Firestore Database criado no Firebase Console
- [ ] Regras de segurança publicadas (copiar do passo 2)
- [ ] Authentication Email/Password ativado
- [ ] Console do navegador não mostra erros de "permission-denied"
- [ ] Usuário está logado (verifique o email no canto superior direito)
- [ ] Internet funcionando

## 🎯 Teste Rápido

Para confirmar que está tudo funcionando:

1. Faça login no sistema
2. Clique no botão **+** (canto inferior direito)
3. Preencha:
   - Tipo: Despesa
   - Valor: 10.00
   - Categoria: Outros
   - Descrição: Teste
   - Data: Hoje
4. Clique em **Adicionar Transação**
5. A transação deve aparecer imediatamente na lista

## 📞 Ainda com Problemas?

Se após todos os passos o erro persistir, verifique:

1. **Versão do Firebase**: O projeto usa `firebase@^12.8.0`
2. **Navegador**: Teste em modo anônimo
3. **Firewall**: Certifique-se de que `firebaseapp.com` não está bloqueado
4. **Região**: O Firestore deve estar na mesma região que o projeto

## 💡 Dicas

- **Use o modo anônimo do navegador** para evitar problemas de cache
- **Verifique o Network tab** no DevTools para ver se as requisições estão sendo enviadas
- **Teste com valores simples** primeiro (sem caracteres especiais)
- **Não use VPN** pois pode bloquear requisições ao Firebase

---

## 🔐 Regras Alternativas (Apenas para Testes)

⚠️ **ATENÇÃO**: Use estas regras APENAS temporariamente para testar:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Estas regras permitem que qualquer usuário autenticado leia/escreva em qualquer documento. **NÃO USE EM PRODUÇÃO!**

Depois de confirmar que funciona, **VOLTE para as regras seguras do passo 2**.

---

**Desenvolvido com ❤️ | GestãoFinanceira SaaS**
