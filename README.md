# 💰 GestãoFinanceira SaaS

Sistema completo de gestão financeira pessoal construído com React, TypeScript, Tailwind CSS e Firebase.

## 🚀 Funcionalidades

### ✅ Autenticação
- Login e registro com Email/Senha
- Persistência de sessão automática
- Proteção de rotas

### ✅ Gestão de Transações
- ➕ Adicionar receitas e despesas
- 🗑️ Excluir transações
- 🏷️ Categorização automática
- 📅 Filtro por data

### ✅ Dashboard em Tempo Real
- **Real-time Updates**: Dados atualizados instantaneamente usando `onSnapshot` do Firestore
- 📊 Gráfico de pizza (despesas por categoria)
- 📈 Gráfico de barras (fluxo mensal)
- 💵 Cards de resumo (Saldo, Receitas, Despesas)

### ✅ UX/UI Mobile First
- Interface responsiva
- Design moderno com Tailwind CSS
- Componentes acessíveis
- Empty states bonitos

## 🛠️ Tecnologias

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **Firebase** (Auth + Firestore)
- **Recharts** (gráficos)
- **React Router** (rotas)
- **Lucide React** (ícones)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## ⚠️ IMPORTANTE: Erro ao Adicionar Transação?

Se você está recebendo o erro **"Erro ao adicionar transação"**, é porque o Firestore precisa ser configurado no Firebase Console.

**📖 Leia o arquivo:** [`CONFIGURACAO_FIRESTORE.md`](./CONFIGURACAO_FIRESTORE.md) com instruções passo a passo.

**🔧 Para troubleshooting avançado:** [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)

---

## 🔐 Configuração do Firebase

### 1. Ativar Authentication
No console do Firebase:
1. Acesse **Authentication**
2. Clique em **Sign-in method**
3. Ative **Email/Password**

### 2. Criar Firestore Database
1. Acesse **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Production mode** (as regras já estão prontas)

### 3. Configurar Regras de Segurança
No console do Firebase, acesse **Firestore Database** > **Regras** e cole o conteúdo do arquivo `firestore.rules`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transactionId} {
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      
      allow read, update, delete: if request.auth != null 
                                   && resource.data.userId == request.auth.uid;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Publicar as regras** após colar.

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── AddTransactionModal.tsx
│   ├── Charts.tsx
│   ├── ProtectedRoute.tsx
│   └── TransactionList.tsx
├── contexts/           # Estado global
│   ├── AuthContext.tsx
│   └── TransactionContext.tsx
├── lib/               # Configurações
│   └── firebase.ts
├── pages/             # Páginas
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── types/             # Tipos TypeScript
│   └── index.ts
└── utils/             # Utilitários
    └── cn.ts
```

### Padrões Implementados

#### 1. Private User Data Pattern
Cada transação tem um campo `userId` que garante isolamento de dados entre usuários.

#### 2. Real-time Listeners
```typescript
// Em TransactionContext.tsx
useEffect(() => {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', currentUser.uid),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    // Atualização automática quando há mudanças
  });

  return () => unsubscribe();
}, [currentUser]);
```

#### 3. Context API para Estado Global
- **AuthContext**: Gerencia autenticação
- **TransactionProvider**: Gerencia transações e cálculos

## 🔒 Segurança

### Regras do Firestore
As regras garantem que:
- ✅ Usuários só podem criar transações com seu próprio `userId`
- ✅ Usuários só podem ler/editar/excluir suas próprias transações
- ❌ Nenhum acesso a dados de outros usuários
- ❌ Nenhum acesso sem autenticação

### Validações
- ✅ Validação de formulários no frontend
- ✅ Tratamento de erros do Firebase
- ✅ Mensagens de erro amigáveis

## 📱 Responsividade

Sistema totalmente responsivo com breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Design System

### Cores
- **Primária**: Emerald (receitas/ações positivas)
- **Secundária**: Red (despesas/ações negativas)
- **Neutra**: Slate (UI)

### Componentes
- Cards com sombras suaves
- Botões com gradientes
- Inputs com focus states
- Modal overlay com blur
- FAB (Floating Action Button)

## 🚀 Deploy

### Build
```bash
npm run build
```

O build gera um único arquivo HTML em `dist/index.html` pronto para deploy.

### Hospedagem Recomendada
- Firebase Hosting
- Vercel
- Netlify

## 📝 Próximas Melhorias

- [ ] Editar transações existentes
- [ ] Exportar relatórios em PDF
- [ ] Metas financeiras
- [ ] Notificações de gastos
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Múltiplas contas/carteiras
- [ ] Integração com bancos

## 📄 Licença

MIT

---

Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento Full Stack.
