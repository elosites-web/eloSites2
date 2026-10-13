# Assets de movimento (Flow)

Tudo aqui é lido a partir de `manifest.json` (contagem de frames, dimensões, vídeos e pôsteres).
Nada disso deve ser fixado no código.

## Cenas com scroll (sequência de frames)

| Cena       | Pasta        | Onde aparece                  |
| ---------- | ------------ | ----------------------------- |
| `hero`     | `hero/`      | Tela inicial (Hero)           |
| `corrente` | `corrente/`  | Tela final de contato / CTA   |

- Arquivos: `frame_001.webp`, `frame_002.webp`, ... (numeração começa em 1).
- Componente: `src/components/FlowFrameSequencePlayer.tsx` (progresso pelo scroll, vai e volta).
- Sem frames, `prefers-reduced-motion` ou `saveData`: aparece só o pôster estático (`posters/`).

## Vídeos de fundo em loop (mudos)

| Chave           | Arquivo                  | Onde aparece           |
| --------------- | ------------------------ | ---------------------- |
| `hands-viewing` | `video/hands-viewing.mp4` | Tela "Como funciona"   |
| `hands-near`    | `video/hands-near.mp4`    | Tela "Diferenciais"    |

- Componente: `src/components/AmbientLoopVideo.tsx` (toca só quando visível).
- Com `prefers-reduced-motion` ou `saveData`: só o pôster.

Para trocar uma animação, substitua os frames/vídeos mantendo os nomes e atualize o `manifest.json`.
