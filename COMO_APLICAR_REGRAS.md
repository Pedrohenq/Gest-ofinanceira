# 🔥 COMO APLICAR AS REGRAS DO FIRESTORE

## ⚡ SOLUÇÃO RÁPIDA (1 minuto)

### Passo 1: Copie a regra abaixo

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Passo 2: Cole no Firebase Console

1. Abra: https://console.firebase.google.com/
2. Selecione o projeto: **gestaofinanceira-312a1**
3. Menu lateral → **Firestore Database**
4. Aba **Regras** (Rules)
5. **DELETE TUDO** que estiver lá
6. **COLE** a regra acima
7. Clique em **Publicar** (Publish)

### Passo 3: Teste imediatamente

✅ Faça logout e login novamente no app
✅ Tente adicionar uma transação
✅ Deve funcionar instantaneamente!

---

## 📸 VISUAL DO FIREBASE CONSOLE

Você verá algo assim:

```
┌─────────────────────────────────────┐
│ Firestore Database                   │
├─────────────────────────────────────┤
│ Dados | Regras | Índices | Uso      │ ← Clique em "Regras"
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ rules_version = '2';                 │ ← DELETE tudo aqui
│ service cloud.firestore {            │ 
│   match /databases/{database}/...    │ ← COLE a regra nova
│                                      │
└─────────────────────────────────────┘

        [Publicar]  ← CLIQUE AQUI
```

---

## ⚠️ IMPORTANTE

Esta regra é **LEVE** e permite que qualquer usuário autenticado acesse os dados.

É perfeita para:
- ✅ Desenvolvimento
- ✅ Testar se está funcionando
- ✅ Protótipos
- ✅ Apps pessoais

**Para produção com múltiplos usuários**, use depois a regra do arquivo `firestore.rules.production`

---

## 🐛 SE AINDA DER ERRO

### Erro: "Missing or insufficient permissions"

**Solução:** Aguarde 10-30 segundos após publicar as regras. O Firebase demora um pouco para propagar.

### Erro: "auth/user-not-found"

**Solução:** Faça logout e login novamente no app.

### Erro ainda persiste?

Abra o Console do navegador (F12) e me envie a mensagem completa do erro que aparece em vermelho.

---

## ✅ COMO SABER SE FUNCIONOU

No Console do Navegador (F12 → Console) você deve ver:

```
Tentando adicionar transação: {...}
Transação adicionada com sucesso! ID: abc123
```

E a transação aparecerá instantaneamente no dashboard! 🎉
