# Vado

Aplicação Android para calcular rapidamente **CIF** e **CFR** a partir do valor da factura.

Introduza o valor, obtenha os dois resultados imediatamente, copie, partilhe ou guarde
no histórico. Funciona inteiramente offline, sem conta e sem servidor.

---

## Fórmulas

| Valor | Fórmula             | Exemplo (factura `125 000,00 MZN`)     |
| ----- | ------------------- | -------------------------------------- |
| CIF   | `Factura ÷ divisor` | `125 000 ÷ 1,122` = `111 408,20`       |
| Frete | `Factura × taxa`    | `125 000 × 2%` = `2 500,00`            |
| CFR   | `CIF + Frete`       | `111 408,20 + 2 500,00` = `113 908,20` |

O **divisor CIF** (`1.122`) e a **taxa de frete** (`2%`) são apenas valores por defeito
— ambos são configuráveis em _Definições_ e nenhum está fixo na interface.

---

## Stack

- React Native `0.86` + Expo SDK `57`
- TypeScript em modo `strict`
- Expo Router (navegação por ficheiros, bottom tabs)
- Zustand + AsyncStorage (estado e persistência local)
- Lucide React Native (iconografia)
- Inter (tipografia, quatro pesos)
- Jest + ts-jest (testes da lógica de cálculo e formatação)

---

## Instalação

Requer Node 20+ e um dispositivo ou emulador Android.

```bash
npm install
```

## Execução

```bash
npm start          # arranca o Metro; leia o QR code com o Expo Go
npm run android    # abre directamente no emulador/dispositivo ligado
```

## Verificações

```bash
npm test           # 44 testes: cálculo, formatação, definições, partilha
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint (regras do React Compiler incluídas)
```

## Build Android

O objectivo é gerar um APK instalável directamente.

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

O perfil `preview` produz um **APK** (`buildType: apk`) pronto a instalar.
O perfil `production` produz um **AAB** para a Play Store.

| Campo       | Valor                  |
| ----------- | ---------------------- |
| Package     | `com.arnaldotomo.vado` |
| Version     | `1.0.0`                |
| VersionCode | `1`                    |

---

## Estrutura

```text
app/                   Rotas (Expo Router)
  _layout.tsx          Fontes, splash, tema, toasts
  onboarding.tsx       Introdução de duas telas, mostrada uma só vez
  settings.tsx         Definições
  about.tsx            Sobre, desenvolvedor, privacidade
  (tabs)/
    _layout.tsx        Bottom navigation
    index.tsx          Calculadora (ecrã inicial)
    history.tsx        Histórico e favoritos
    incoterms.tsx      Explicação de CIF e CFR
    more.tsx           Acesso a Definições e Sobre

components/
  ui/                  Primitivas: Text, Card, Button, BottomSheet, Toast…
  calculator/          Campo da factura, cartões de resultado, detalhes
  cards/               Item de histórico, cartão de Incoterm
  layout/              Cabeçalhos e secções

hooks/                 Tema, cálculo, haptics, partilha
store/                 Zustand: definições, histórico, rascunho, app
services/              Adaptador de AsyncStorage
utils/                 calc.ts, format.ts, share.ts, id.ts
constants/             theme.ts (tokens), defaults.ts, incoterms.ts, developer.ts
types/                 Modelos partilhados
assets/images/         Ícone, ícone adaptativo, splash, marca
__tests__/             Testes da lógica pura
```

A lógica em `utils/` não importa nada de React Native — é por isso que pode ser
testada directamente com `ts-jest`, sem emulador.

---

## Configuração

### Contactos do desenvolvedor

Preencha `constants/developer.ts`. Os campos vazios são tratados na interface
(o ecrã _Sobre_ mostra "Por definir" em vez de abrir uma ligação inválida).

```ts
export const developer = {
  name: 'Arnaldo Tomo',
  role: 'Software Developer',
  whatsapp: '', // apenas dígitos, com indicativo — ex.: '258840000000'
  email: '',
  website: '',
};
```

### Valores por defeito

`constants/currencies.ts` define as moedas disponíveis (MZN, USD, ZAR, EUR, CNY,
JPY). `constants/defaults.ts` define a taxa de frete, o divisor CIF, a moeda, o tema,
as casas decimais e os valores rápidos sugeridos. `LIMITS` define os intervalos
aceites nas _Definições_.

### Actualizações OTA

`expo-updates` está instalado mas **desactivado** (`updates.enabled: false` em
`app.config.ts`), para que a aplicação não contacte nenhum servidor. Basta
activar a flag e associar um projecto EAS quando quiser distribuir correcções
sem gerar um novo APK.

---

## Privacidade

Todos os cálculos ficam guardados apenas no dispositivo, em AsyncStorage.
A aplicação não tem autenticação, não tem backend e não envia dados para lado
nenhum.

A única permissão declarada é `INTERNET` — é uma permissão *normal* (não pede
consentimento ao utilizador) e é exigida pelo dev client do Expo. As permissões
de armazenamento que o Expo declara por omissão estão explicitamente bloqueadas
em `app.config.ts`.

---

Criado por **Arnaldo Tomo**
Especialmente para **Rivaldo Tomo**.
