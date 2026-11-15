/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const contentDir = path.resolve('src/content');
const publicDir = path.resolve('public');

function checkLocalImageExists(
  imageUrl: string | undefined,
  context: string,
): void {
  if (!imageUrl || !imageUrl.startsWith('/')) return;
  const filePath = path.join(publicDir, imageUrl.replace(/^\//, ''));
  assert.ok(
    fs.existsSync(filePath),
    `[${context}] Imagem local não encontrada no disco: ${imageUrl}`,
  );
}

describe('Integridade de Conteúdo — Verificação de dados das Content Collections', () => {
  describe('Jogos (src/content/games)', () => {
    const dir = path.join(contentDir, 'games');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

    it('deve conter exatamente os 114 jogos reais do acervo', () => {
      assert.equal(files.length, 114);
    });

    it('todos os jogos devem ter dados válidos, notas nos limites e imagens existentes', () => {
      for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        assert.ok(data.title, `Jogo ${file} sem título`);
        assert.ok(
          data.releaseYear >= 1970 && data.releaseYear <= 2030,
          `Jogo ${file} com ano inválido: ${data.releaseYear}`,
        );
        assert.ok(data.platform, `Jogo ${file} sem plataforma`);
        assert.ok(
          [
            'Concluido',
            'Platinado',
            'Jogando',
            'Parado',
            'Descontinuado',
          ].includes(data.status),
          `Jogo ${file} com status inválido: ${data.status}`,
        );

        // Validação de notas
        const s = data.scores;
        assert.ok(s, `Jogo ${file} sem objeto de scores`);
        assert.ok(s.mechanics >= 0 && s.mechanics <= 100);
        assert.ok(s.aesthetics >= 0 && s.aesthetics <= 100);
        assert.ok(s.retention >= 0 && s.retention <= 100);
        assert.ok(s.feeling >= 0 && s.feeling <= 100);
        if (s.plot !== null) {
          assert.ok(s.plot >= 0 && s.plot <= 100);
        }

        // Validação da imagem de capa
        checkLocalImageExists(data.coverImage?.url, `games/${file}`);

        // Regras de publicação
        assert.notEqual(data.isDemo, true);
        assert.notEqual(data.draft, true);
      }
    });
  });

  describe('Filmes (src/content/movies)', () => {
    const dir = path.join(contentDir, 'movies');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

    it('deve conter exatamente os 65 filmes reais do acervo', () => {
      assert.equal(files.length, 65);
    });

    it('todos os filmes devem ter dados válidos, 6 critérios de notas e imagens existentes', () => {
      for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        assert.ok(data.title, `Filme ${file} sem título`);
        assert.ok(data.director, `Filme ${file} sem diretor`);
        assert.ok(
          data.releaseYear >= 1900 && data.releaseYear <= 2030,
          `Filme ${file} com ano inválido: ${data.releaseYear}`,
        );

        const s = data.scores;
        assert.ok(s, `Filme ${file} sem objeto de scores`);
        assert.ok(s.direction >= 0 && s.direction <= 100);
        assert.ok(s.screenplay >= 0 && s.screenplay <= 100);
        assert.ok(s.audiovisual >= 0 && s.audiovisual <= 100);
        assert.ok(s.acting >= 0 && s.acting <= 100);
        assert.ok(s.pacing >= 0 && s.pacing <= 100);
        assert.ok(s.feeling >= 0 && s.feeling <= 100);

        checkLocalImageExists(data.coverImage?.url, `movies/${file}`);

        assert.notEqual(data.isDemo, true);
        assert.notEqual(data.draft, true);
      }
    });
  });

  describe('Livros (src/content/books)', () => {
    const dir = path.join(contentDir, 'books');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

    it('deve conter exatamente os 24 livros reais do acervo', () => {
      assert.equal(files.length, 24);
    });

    it('todos os livros devem ter autor, status de leitura e capas existentes', () => {
      for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        assert.ok(data.title, `Livro ${file} sem título`);
        assert.ok(data.author, `Livro ${file} sem autor`);
        assert.ok(
          ['lendo', 'lido', 'quero_ler'].includes(data.status),
          `Livro ${file} com status inválido`,
        );

        checkLocalImageExists(data.coverImage?.url, `books/${file}`);

        assert.notEqual(data.isDemo, true);
        assert.notEqual(data.draft, true);
      }
    });
  });

  describe('Artigos (src/content/articles)', () => {
    const dir = path.join(contentDir, 'articles');
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

    it('deve conter o artigo real sobre Fedora Workstation', () => {
      assert.equal(files.length, 1);
      assert.equal(files[0], 'por-que-escolhi-fedora.md');
    });

    it('todas as imagens referenciadas no corpo Markdown devem existir em public/', () => {
      const raw = fs.readFileSync(
        path.join(dir, 'por-que-escolhi-fedora.md'),
        'utf-8',
      );
      const imgRegex = /!\[.*?\]\((\/[^\)]+)\)/g;
      let match: RegExpExecArray | null;
      let imgCount = 0;

      while ((match = imgRegex.exec(raw)) !== null) {
        imgCount++;
        checkLocalImageExists(match[1], 'articles/por-que-escolhi-fedora.md');
      }

      assert.equal(
        imgCount,
        3,
        'O artigo deve conter exatamente suas 3 imagens inline',
      );
      checkLocalImageExists(
        '/images/articles/por-que-escolhi-fedora/fedora-capa.jpg',
        'articles/por-que-escolhi-fedora.md (cover)',
      );
      assert.ok(!raw.includes('isDemo: true'));
      assert.ok(!raw.includes('draft: true'));
    });
  });

  describe('Galeria (src/content/gallery)', () => {
    const dir = path.join(contentDir, 'gallery');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

    it('deve conter exatamente as 58 imagens cadastradas nos 3 álbuns', () => {
      assert.equal(files.length, 58);
    });

    it('todas as imagens devem pertencer a álbuns aprovados e existir em public/', () => {
      const allowedAlbums = ['wallpapers', 'desktop', 'ia'];

      for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        assert.ok(data.title, `Galeria ${file} sem título`);
        assert.ok(
          allowedAlbums.includes(data.albumSlug),
          `Galeria ${file} com álbum desconhecido: ${data.albumSlug}`,
        );

        checkLocalImageExists(data.imageUrl, `gallery/${file}`);

        assert.notEqual(data.isDemo, true);
        assert.notEqual(data.draft, true);
      }
    });
  });

  describe('Outras coleções (Open Source, Música e Projetos)', () => {
    it('Open Source (8 ferramentas) com metadados e ícones existentes', () => {
      const dir = path.join(contentDir, 'opensource');
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
      assert.equal(files.length, 8);

      for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        assert.ok(data.name);
        assert.ok(data.category);
        assert.ok(data.description);
        checkLocalImageExists(data.icon?.url, `opensource/${file}`);
        assert.notEqual(data.isDemo, true);
      }
    });

    it('Música (29 registros: 18 artistas, 5 álbuns, 6 faixas)', () => {
      const dir = path.join(contentDir, 'music');
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
      assert.equal(files.length, 29);

      for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        assert.ok(data.title);
        assert.ok(['artist', 'album', 'track'].includes(data.type));
        checkLocalImageExists(data.coverImage?.url, `music/${file}`);
        assert.notEqual(data.isDemo, true);
      }
    });

    it('Projetos (5 projetos reais com imagens em WebP)', () => {
      const dir = path.join(contentDir, 'projects');
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
      assert.equal(files.length, 5);

      for (const file of files) {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
        assert.ok(!raw.includes('isDemo: true'));
      }
    });
  });
});
