# Thainá Sampaio

Site institucional estático com Pacote Boss, Mentoria Boss, Workshop Boss, Guia de Poses e páginas dos cursos Beauty Edit, Boss 4P e Luz em Foco. HTML, CSS e JavaScript; não depende de bibliotecas no navegador nem de instalação de pacotes para construir o site.

## Visualizar

Com Node.js instalado:

```sh
npm run build
npm run dev
```

Abra http://127.0.0.1:4173. A pasta `dist/` contém o site pronto para hospedagem estática. As URLs de cursos usam diretórios com `index.html`. Sirva a pasta por HTTP; links absolutos não são compatíveis com abrir os arquivos por `file://`.

## Conteúdo e manutenção

- `src/home.mjs`: seções da home e trechos dos depoimentos reais em `assets/img/feedbacks/`.
- `src/courses.mjs`: textos, conteúdos, preços e checkout dos três cursos.
- `src/shared.mjs`: cabeçalho, rodapé, história e estrutura HTML.
- `assets/css/style.css`: identidade visual e estilos responsivos.
- `assets/js/config.js`: número de WhatsApp, incluindo país e DDD, somente dígitos.
- `assets/favicon.svg` e `assets/logo.svg`: identidade visual exibida no navegador, cabeçalho e rodapé.
- `assets/img/guia-de-poses-card.jpg`: versão leve da capa exibida na vitrine; o original permanece em `assets/img/guia-de-poses.JPG`.

O formulário valida os campos e prepara uma conversa no WhatsApp. Não armazena dados e não envia e-mail. O visitante conclui o envio no WhatsApp. O destinatário é `553194517665`, publicado no botão de orçamentos do [site oficial](https://thainasampaio.com.br/) em 15/09/2026. Caso o número seja removido da configuração, nenhuma mensagem é enviada e a interface informa a indisponibilidade.

Pacote Boss, Mentoria Boss, Workshop Boss Portugal e Guia de Poses têm mensagens próprias para o WhatsApp. O Workshop Boss tradicional direciona para seu formulário de lista de espera. Beauty Edit e Luz em Foco direcionam para suas páginas de curso.

Após editar, execute `npm run build`. Verifique com `npm run check`.

## Fotografias

As 33 fotos estão em `assets/img/optimized/`:

- `*-master.webp`: resolução integral e compressão sem perdas, com perfil de cor preservado. Os pixels foram comparados por hash após orientação e conversão para sRGB, antes de remover os JPEGs originais.
- `*-640.webp`, `*-1200.webp`, `*-2000.webp`: versões para exibição, com qualidade WebP 94. São selecionadas pelo navegador com `srcset`; têm redução de dimensões e compressão com perdas, ao contrário dos masters.
- `manifest.json`: dimensões, pesos e verificação da preservação de cada imagem.

Os masters ficam fora da pasta pública `dist/`. As imagens de conteúdo carregam sob demanda; a imagem principal tem prioridade. Nenhuma fotografia foi retocada ou recriada.

O script `scripts/optimize-images.mjs` documenta o processo original e requer Sharp caso seja necessário processar novos JPEGs. Construção e servidor não dependem de Sharp.

## Referências de conteúdo

Preços, condições e links consultados em 15/09/2026:

- [Beauty Edit](https://thainasampaio.com.br/beauty-edit/): R$ 297 à vista ou 12× de R$ 30,72; [checkout](https://payment.ticto.app/O93D409CF).
- Boss 4P: página não listada, acessível somente por link direto; os botões de inscrição direcionam para o formulário oficial da lista de espera.
- [Luz em Foco](https://thainasampaio.com.br/luz-em-foco/): R$ 297 à vista ou 12× de R$ 29,82; [checkout](https://payment.ticto.app/O6EE53F3A).

Os temas do Beauty Edit e Luz em Foco foram agrupados para facilitar a leitura, sem apresentar esses agrupamentos como módulos oficiais. Os cinco módulos oficiais e os bônus do Boss 4P estão preservados. Confirme mudanças futuras de valores com a responsável.
