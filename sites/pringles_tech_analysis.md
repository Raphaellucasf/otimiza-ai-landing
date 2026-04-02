# 🍟 Pringles DevArt — Análise Técnica Completa

> Site criado por **Gustavo Campelo / DevArt** usando apenas **HTML + CSS + JavaScript Vanilla** + bibliotecas externas via CDN. Zero frameworks, zero bundlers.

---

## 📦 Stack de Tecnologias

| Camada | Tecnologia | Versão / Fonte |
|---|---|---|
| Estrutura | HTML5 semântico | Nativo |
| Estilização | CSS3 Vanilla (CSS Nesting) | Nativo |
| Tipografia | Google Fonts — **Poppins** | CDN Google |
| Animações | **GSAP** (GreenSock Animation Platform) | v3.13.0 via jsDelivr |
| Scroll | **GSAP ScrollTrigger** (plugin oficial) | v3.13.0 via jsDelivr |
| Texto animado | **SplitType** | via unpkg |
| Gráficos | **SVG inline** (path, textPath) | Nativo |
| Imagens | `.webp` e `.svg` otimizados | Locais |

### Carregamento das bibliotecas no HTML
```html
<!-- No final do <body> -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/split-type"></script>

<!-- Script próprio com defer no <head> -->
<script src="script.js" defer></script>
```

> [!TIP]
> O `defer` garante que o script só execute depois que o HTML inteiro for parseado, evitando erros de elementos não encontrados.

---

## 🎠 SEÇÃO 1 — Slider de Sabores (Hero)

### Como funciona

O slider é um **carrossel manual** implementado com JS puro + CSS. Não usa bibliotecas de slider.

#### Estrutura HTML
- `div.slides` — container pai com `overflow: hidden` e `position: relative`
- Cada sabor é um `div.slide` com `position: absolute` ocupando 100% do espaço
- O slide ativo recebe a classe `.active`
- Cada slide tem: imagem circular (`imgCirc`), texto (`conteudo`), dois potes (`produtos`), e elemento decorativo SVG (`pringlesFundo`)

#### O truque da transição: `clip-path`
O segredo visual da troca de slides é a propriedade `clip-path: circle()`:

```css
/* Estado INATIVO — slide invisível */
.slide {
  clip-path: circle(0% at 89% 50%); /* círculo com raio 0%, centrado à direita */
  opacity: 0;
  transition: clip-path 0s 1s, opacity 0s 1s; /* delay de 1s para sumir */
}

/* Estado ATIVO — slide totalmente visível */
.slide.active {
  clip-path: circle(120% at 89% 50%); /* expande para cobrir tudo */
  opacity: 1;
  transition: clip-path 1s 0s, opacity 0.1s 0s; /* animação de 1s */
  z-index: 1;
}
```

O slide entra **expandindo como uma onda circular** a partir do canto direito (onde ficam os potes). Efeito de "reveal" cinematográfico.

#### Animações secundárias no slide ativo
```css
/* Imagem circular gira ao entrar */
.slide .imgCirc { transition: transform 1s; transform: rotate(100deg); }
.slide.active .imgCirc { transform: rotate(0); }

/* Parágrafo fade in com delay */
.slide p { opacity: 0; transition: opacity 0.6s 0.8s; }
.slide.active p { opacity: 1; }

/* Botão sobe do chão com delay */
.slide .botaoPrimario { opacity: 0; transform: translateY(20px); transition: opacity 0.6s 1s, transform 0.6s 1s; }
.slide.active .botaoPrimario { opacity: 1; transform: translateY(0); }

/* Segundo pote (preview do próximo) aparece */
.slide .imgNext { opacity: 0; transition: opacity 1s; }
.slide.active .imgNext { opacity: 1; }
```

#### Lógica JS — Máquina de estado com índice
```javascript
let i = 0; // índice do slide atual

function passarSlide() {
  slides[i].classList.remove("active");
  bullets[i].classList.remove("active");
  i = (i === slides.length - 1) ? 0 : i + 1; // loop circular
  slides[i].classList.add("active");
  bullets[i].classList.add("active");
  animacaoTexto(); // anima o título do novo slide
}

function voltarSlide() {
  slides[i].classList.remove("active");
  i = (i === 0) ? slides.length - 1 : i - 1;
  slides[i].classList.add("active");
  animacaoTexto();
}

// Botões de seta
botaoNext.onclick = () => passarSlide();
botaoPrev.onclick = () => voltarSlide();

// Clicar no pote do PRÓXIMO sabor também avança
imgsNext.forEach(img => img.onclick = () => passarSlide());
```

#### Animação do título — SplitType + GSAP
```javascript
function animacaoTexto() {
  // SplitType divide o texto em chars individuais
  const text = new SplitType(".slide.active h2", { types: "words, chars" });

  // GSAP anima cada char de baixo para cima, em cascata
  gsap.from(text.chars, {
    y: "100%",       // começa fora do container (overflow: hidden no pai esconde)
    opacity: 0,
    duration: 0.5,
    stagger: {
      each: 0.05,    // 50ms entre cada letra
      overlap: 0.1   // leve sobreposição para fluidez
    },
    delay: 0.3,
  });
}
```

> [!IMPORTANT]
> O `overflow: hidden` no `.tituloSlide h2` é essencial para o efeito de "letras saindo de baixo" funcionar. Sem ele, as letras seriam visíveis antes da animação.

```css
.tituloSlide h2 { overflow: hidden; }
```

---

## 📜 SEÇÃO 2 — Animações por Scroll

### 1. Faixa de texto curvo animada (Marquee SVG)

A faixa vermelha ondulada com o texto "Gustavo Campelo · DevArt · Projetos de Alto Valor" é feita com **dois SVGs sobrepostos** usando CSS Grid:

```html
<!-- SVG 1: Fundo vermelho (a faixa ondulada) -->
<svg class="marquee-bg-svg">
  <path stroke="currentColor" stroke-width="120" stroke-linecap="round"
    d="M-71 400 Q 100 50 720 190 Q 1000 250 1511 200" fill="none"/>
</svg>

<!-- SVG 2: Texto que segue o mesmo caminho curvo -->
<svg class="marquee-text-svg">
  <defs>
    <path id="curve" d="M-71 400 Q 100 50 720 190 Q 1000 250 1511 200"/>
  </defs>
  <text>
    <textPath href="#curve" startOffset="20%">
      Gustavo Campelo · DevArt · Projetos de Alto Valor ·
    </textPath>
  </text>
</svg>
```

O trigger de scroll anima o `startOffset` do textPath — o texto **desliza pela curva** enquanto o usuário rola:

```javascript
gsap.to("textPath", {
  attr: { startOffset: "-20%" }, // move de 20% para -20%
  scrollTrigger: {
    trigger: ".marquee-inner",
    start: "top 70%",   // começa quando a faixa entra 70% da viewport
    end: "bottom top",  // termina quando sai pelo topo
    scrub: 2,           // scrub: segue o scroll com amortecimento de 2s
  },
});
```

### 2. Linha vetorial que se desenha (SVG path draw)

A linha branca sinuosa que percorre a seção 2 usa a técnica clássica de **stroke-dashoffset** para simular o desenho:

```javascript
const linhaPath = document.querySelector(".linhaVetorial svg path");
const linhaComprimento = linhaPath.getTotalLength(); // comprimento total do path

// Configura o traço para ficar "escondido" (dashoffset = comprimento total)
gsap.set(linhaPath, {
  strokeDasharray: linhaComprimento,  // tamanho do traço = tamanho total
  strokeDashoffset: linhaComprimento, // desloca o traço para fora do visível
});

// Timeline que anima junto com o scroll
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".secao2",
    start: "30% 80%",  // 30% da seção passou 80% da tela
    end: "bottom 50%",
    scrub: 3,          // amortecimento suave
  }
});

// Anima o offset de comprimento → 0 (o traço vai "nascendo")
timeline.fromTo(linhaPath,
  { strokeDashoffset: linhaComprimento },
  { strokeDashoffset: 0, duration: 5 }
);

// Na mesma timeline: ao final, fundo da seção 3 muda de transparente para branco
timeline.to(".secao3", {
  backgroundColor: "rgba(255, 255, 255, 1)",
  duration: .2
}, "-=.6"); // começa 0.6s antes do fim da timeline
```

### 3. Latas flutuando com scroll (parallax)

Cada lata nas "etapas" se move e rotaciona conforme o usuário rola, criando um efeito **parallax** individual por elemento:

```javascript
// Lata laranja: sobe e endireita
gsap.to(".laranja .lataEtapa", {
  rotate: "0deg",  // começou rotacionada 20deg no CSS
  y: -80,          // sobe 80px
  scrollTrigger: {
    trigger: ".laranja",
    start: "top 70%",
    end: "bottom top",
    scrub: 2,
  },
});

// Lata azul: inclina 10deg e sobe um pouco
gsap.to(".azul .lataEtapa", {
  rotate: "10deg",
  y: -30,
  scrollTrigger: { trigger: ".azul", start: "top 70%", end: "bottom top", scrub: 2 },
});

// Lata verde: desce (direção oposta!)
gsap.to(".verde .lataEtapa", {
  rotate: "0deg",
  y: 100,
  scrollTrigger: { trigger: ".verde", start: "top 70%", end: "bottom top", scrub: 2 },
});
```

> [!NOTE]
> A rotação **inicial** de cada lata é definida no CSS (`.laranja .lataEtapa { transform: rotate(20deg); }`). O GSAP anima a partir dessa posição até o valor final definido no `gsap.to()`.

---

## 🛠️ Como usar essas ferramentas em novos sites

### Exemplo: Slider com clip-path reveal
```html
<div class="slides">
  <div class="slide active">Slide 1</div>
  <div class="slide">Slide 2</div>
</div>
```
```css
.slide { position: absolute; clip-path: circle(0% at 50% 50%); transition: clip-path 1s; }
.slide.active { clip-path: circle(150% at 50% 50%); }
```
```javascript
let atual = 0;
const slides = document.querySelectorAll(".slide");
function ir(n) {
  slides[atual].classList.remove("active");
  atual = (atual + n + slides.length) % slides.length;
  slides[atual].classList.add("active");
}
```

### Exemplo: Texto letra por letra com SplitType + GSAP
```javascript
gsap.registerPlugin(ScrollTrigger);
const text = new SplitType(".meu-titulo", { types: "chars" });
gsap.from(text.chars, {
  y: "100%", opacity: 0, duration: 0.6,
  stagger: 0.04,
  scrollTrigger: { trigger: ".meu-titulo", start: "top 80%" }
});
```

### Exemplo: Elemento com parallax por scroll (scrub)
```javascript
gsap.to(".minha-imagem", {
  y: -100, rotate: 15,
  scrollTrigger: {
    trigger: ".minha-secao",
    start: "top bottom",
    end: "bottom top",
    scrub: 2, // quanto maior, mais "suave" e atrasado
  }
});
```

### Exemplo: Linha SVG que se desenha no scroll
```javascript
const path = document.querySelector("svg path");
const len = path.getTotalLength();
gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
gsap.to(path, {
  strokeDashoffset: 0,
  scrollTrigger: { trigger: "section", start: "top 80%", end: "bottom 20%", scrub: 2 }
});
```

### Exemplo: Texto seguindo curva SVG
```html
<svg viewBox="0 0 1000 200">
  <defs><path id="curva" d="M0 150 Q 500 0 1000 150"/></defs>
  <textPath href="#curva">Meu texto curvo aqui!</textPath>
</svg>
```
```javascript
// Animar com scroll
gsap.to("textPath", {
  attr: { startOffset: "-30%" },
  scrollTrigger: { trigger: "svg", scrub: 2, start: "top 80%", end: "bottom top" }
});
```

---

## 📐 Outras Técnicas CSS notáveis

| Técnica | Uso no site | Como funciona |
|---|---|---|
| `clip-path: circle()` | Transição do slider | Expande/colapsa um círculo para revelar conteúdo |
| `mix-blend-mode: color-dodge` | Logo Pringles no fundo | Mescla a imagem com o fundo como "dodge" de cor |
| `CSS Nesting` | Todo o CSS | `&.active`, `&:hover` dentro de seletores pai |
| `clamp()` | Tamanho de fonte/padding | `font-size: clamp(16px, 1.1vw, 1.1vw)` — mínimo, fluido, máximo |
| `dvh` | Altura do hero | `height: 106dvh` — dynamic viewport height (melhor que vh em mobile) |
| `filter: drop-shadow()` | Sombra nas latas | Funciona com PNG/WebP transparente, ao contrário de `box-shadow` |
| `grid-template: 1fr / 1fr` | Faixa marquee | Sobrepõe os dois SVGs na mesma célula do grid |
