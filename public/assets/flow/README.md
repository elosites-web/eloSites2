# Sequências de Quadros Flow (WebP) — ēloSites

Este diretório armazena as sequências de quadros extraídas dos seus vídeos gerados no Flow.

## Estrutura de Pastas por Cena:
1. `/public/assets/flow/hero/` — Cena 1: Dois elos de corrente se encaixando (Hero).
2. `/public/assets/flow/processo/` — Cena 2: Blocos de layout se encaixando no celular (Como Funciona).
3. `/public/assets/flow/cliente/` — Cena 3: Fachada e smartphone conectados pelo feixe de luz (Portfólio / Diferenciais).
4. `/public/assets/flow/corrente/` — Cena 4: Corrente completa iluminada (CTA Final).

## Como Nomear os Arquivos:
Nomeie os quadros sequencialmente no formato:
`frame_001.webp`, `frame_002.webp`, `frame_003.webp`, ... até `frame_060.webp` (ou quantos frames o clipe tiver).

## Dica de Extração com FFmpeg:
Se tiver o vídeo MP4 em mãos (ex: `cena1.mp4`):
```bash
ffmpeg -i cena1.mp4 -vf "scale=960:-1:flags=lanczos,fps=15" -c:v libwebp -lossless 0 -compression_level 6 -q:v 75 frame_%03d.webp
```

*Nota: Enquanto os arquivos WebP não forem inseridos, o site renderiza automaticamente simulações procedurais 3D interativas em tempo real de alta fidelidade!*
