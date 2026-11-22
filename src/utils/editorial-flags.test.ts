/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  EXPANSION_PUBLIC_FLAGS,
  EXPANSION_SECTIONS,
  getPublishedExpansionStaticRoutes,
  getUnpublishedExpansionPrefixes,
  isCiOrHostedProduction,
  isExpansionPreviewEnabled,
  isSectionEnabled,
  isSectionPubliclyPublished,
  shouldGenerateSectionRoute,
  shouldIncludeEntry,
  shouldIncludeInSitemap,
  type ExpansionSection,
} from './editorial-flags.ts';

const ALL_SECTIONS: ExpansionSection[] = [
  'reviews',
  'linuxDiary',
  'recommendations',
];

describe('editorial-flags — Controle de publicação segura (EXP-02A / EXP-07B)', () => {
  it('as flags públicas devem manter consistência entre rotas publicadas e prefixos bloqueados', () => {
    for (const section of ALL_SECTIONS) {
      assert.equal(typeof EXPANSION_PUBLIC_FLAGS[section], 'boolean');
      assert.equal(
        isSectionPubliclyPublished(section),
        EXPANSION_PUBLIC_FLAGS[section],
      );
    }

    const publishedRoutes = getPublishedExpansionStaticRoutes();
    const unpublishedPrefixes = getUnpublishedExpansionPrefixes();

    for (const section of ALL_SECTIONS) {
      const meta = EXPANSION_SECTIONS[section];
      if (EXPANSION_PUBLIC_FLAGS[section]) {
        assert.ok(publishedRoutes.includes(meta.indexRoute));
        assert.ok(!unpublishedPrefixes.includes(meta.distPrefix));
      } else {
        assert.ok(!publishedRoutes.includes(meta.indexRoute));
        assert.ok(unpublishedPrefixes.includes(meta.distPrefix));
      }
    }
  });

  it('deve simular ativação completa das 3 seções mantendo rascunhos e demos bloqueados em produção', () => {
    const allEnabled = {
      reviews: true,
      linuxDiary: true,
      recommendations: true,
    } as const;
    const prodEnv = { VERCEL: '1' };

    assert.deepEqual(getPublishedExpansionStaticRoutes(allEnabled), [
      '/resenhas/',
      '/diario-linux/',
      '/diario-linux/meu-ambiente/',
      '/recomendacoes/',
    ]);
    assert.deepEqual(getUnpublishedExpansionPrefixes(allEnabled), []);

    for (const section of ALL_SECTIONS) {
      assert.equal(
        shouldGenerateSectionRoute(section, prodEnv, allEnabled),
        true,
      );
      assert.equal(
        shouldIncludeEntry(
          section,
          { draft: false, isDemo: false },
          prodEnv,
          allEnabled,
        ),
        true,
      );
      assert.equal(
        shouldIncludeEntry(
          section,
          { draft: true, isDemo: false },
          prodEnv,
          allEnabled,
        ),
        false,
      );
      assert.equal(
        shouldIncludeEntry(
          section,
          { draft: false, isDemo: true },
          prodEnv,
          allEnabled,
        ),
        false,
      );
    }
  });

  it('deve bloquear a geração de rotas e entradas em ambiente padrão sem preview', () => {
    const cleanEnv = {};
    for (const section of ALL_SECTIONS) {
      assert.equal(isSectionEnabled(section, cleanEnv), false);
      assert.equal(shouldGenerateSectionRoute(section, cleanEnv), false);
      assert.equal(
        shouldIncludeEntry(section, { draft: false, isDemo: false }, cleanEnv),
        false,
      );
      assert.equal(
        shouldIncludeEntry(section, { draft: true, isDemo: false }, cleanEnv),
        false,
      );
      assert.equal(shouldIncludeInSitemap(section), false);
    }
  });

  it('deve permitir prévia local exclusivamente fora de Vercel, GitHub Actions e CI', () => {
    const localPreviewEnv = { PREVIEW_EXPANSION: 'true' };
    assert.equal(isCiOrHostedProduction(localPreviewEnv), false);
    assert.equal(isExpansionPreviewEnabled(localPreviewEnv), true);

    for (const section of ALL_SECTIONS) {
      assert.equal(isSectionEnabled(section, localPreviewEnv), true);
      assert.equal(shouldGenerateSectionRoute(section, localPreviewEnv), true);
      assert.equal(
        shouldIncludeEntry(
          section,
          { draft: true, isDemo: false },
          localPreviewEnv,
        ),
        true,
      );
      assert.equal(
        shouldIncludeEntry(
          section,
          { draft: false, isDemo: true },
          localPreviewEnv,
        ),
        false,
      );
      // Preview local NUNCA libera entrada no sitemap canônico
      assert.equal(shouldIncludeInSitemap(section), false);
    }
  });

  it('deve bloquear PREVIEW_EXPANSION=true quando executado na Vercel, GitHub Actions ou CI', () => {
    const hostedEnvs = [
      { PREVIEW_EXPANSION: 'true', VERCEL: '1' },
      { PREVIEW_EXPANSION: 'true', VERCEL: 'true' },
      { PREVIEW_EXPANSION: 'true', GITHUB_ACTIONS: 'true' },
      { PREVIEW_EXPANSION: 'true', CI: 'true' },
    ];

    for (const env of hostedEnvs) {
      assert.equal(isCiOrHostedProduction(env), true);
      assert.equal(isExpansionPreviewEnabled(env), false);
      for (const section of ALL_SECTIONS) {
        assert.equal(shouldGenerateSectionRoute(section, env), false);
        assert.equal(
          shouldIncludeEntry(section, { draft: false, isDemo: false }, env),
          false,
        );
      }
    }
  });

  it('quando uma seção for aprovada (flag=true), deve bloquear draft e isDemo em produção e liberar no sitemap apenas itens publicáveis', () => {
    const publishedFlags = {
      reviews: true,
      linuxDiary: false,
      recommendations: false,
    } as const;
    const prodEnv = { VERCEL: '1' };

    assert.equal(
      shouldGenerateSectionRoute('reviews', prodEnv, publishedFlags),
      true,
    );
    assert.equal(
      shouldGenerateSectionRoute('linuxDiary', prodEnv, publishedFlags),
      false,
    );

    // Publicado real passa
    assert.equal(
      shouldIncludeEntry(
        'reviews',
        { draft: false, isDemo: false },
        prodEnv,
        publishedFlags,
      ),
      true,
    );
    // Rascunho é bloqueado em produção mesmo com a seção ativa
    assert.equal(
      shouldIncludeEntry(
        'reviews',
        { draft: true, isDemo: false },
        prodEnv,
        publishedFlags,
      ),
      false,
    );
    // Demo é bloqueado
    assert.equal(
      shouldIncludeEntry(
        'reviews',
        { draft: false, isDemo: true },
        prodEnv,
        publishedFlags,
      ),
      false,
    );

    // Sitemap aceita apenas itens publicáveis da seção aprovada
    assert.equal(
      shouldIncludeInSitemap(
        'reviews',
        { draft: false, isDemo: false },
        publishedFlags,
      ),
      true,
    );
    assert.equal(
      shouldIncludeInSitemap(
        'reviews',
        { draft: true, isDemo: false },
        publishedFlags,
      ),
      false,
    );
    assert.equal(
      shouldIncludeInSitemap(
        'linuxDiary',
        { draft: false, isDemo: false },
        publishedFlags,
      ),
      false,
    );

    assert.deepEqual(getPublishedExpansionStaticRoutes(publishedFlags), [
      '/resenhas/',
    ]);
    assert.deepEqual(getUnpublishedExpansionPrefixes(publishedFlags).sort(), [
      'diario-linux',
      'recomendacoes',
    ]);
  });

  it('rotas e prefixos das três seções devem corresponder à especificação sem colidir com rotas existentes', () => {
    assert.equal(EXPANSION_SECTIONS.reviews.indexRoute, '/resenhas/');
    assert.equal(EXPANSION_SECTIONS.linuxDiary.indexRoute, '/diario-linux/');
    assert.equal(
      EXPANSION_SECTIONS.recommendations.indexRoute,
      '/recomendacoes/',
    );
    assert.deepEqual(EXPANSION_SECTIONS.linuxDiary.extraRoutes, [
      '/diario-linux/meu-ambiente/',
    ]);
  });
});

describe('Schemas e diretórios das novas Content Collections (EXP-02A)', () => {
  it('src/content.config.ts deve registrar reviews, linuxDiary e recommendations com draft default true', () => {
    const configPath = path.resolve('src/content.config.ts');
    const raw = fs.readFileSync(configPath, 'utf-8');

    assert.ok(raw.includes('const reviews = defineCollection('));
    assert.ok(raw.includes('const linuxDiary = defineCollection('));
    assert.ok(raw.includes('const recommendations = defineCollection('));
    assert.ok(raw.includes("base: './src/content/reviews'"));
    assert.ok(raw.includes("base: './src/content/linux-diary'"));
    assert.ok(raw.includes("base: './src/content/recommendations'"));

    const draftDefaultMatches = raw.match(
      /draft:\s*z\.boolean\(\)\.default\(true\)/g,
    );
    assert.equal(
      draftDefaultMatches?.length,
      3,
      'As três novas coleções devem definir draft: z.boolean().default(true)',
    );
  });

  it('os diretórios das novas coleções devem existir e manter rascunhos sob controle seguro', () => {
    const guardedDraftDirs: Array<{
      dir: string;
      published: boolean;
      label: string;
      extPattern: RegExp;
      draftPattern: RegExp;
    }> = [
      {
        dir: path.resolve('src/content/reviews'),
        published: EXPANSION_PUBLIC_FLAGS.reviews,
        label: 'Resenha',
        extPattern: /\.(md|mdx)$/i,
        draftPattern: /draft:\s*true/i,
      },
      {
        dir: path.resolve('src/content/linux-diary'),
        published: EXPANSION_PUBLIC_FLAGS.linuxDiary,
        label: 'Artigo do Diário Linux',
        extPattern: /\.(md|mdx)$/i,
        draftPattern: /draft:\s*true/i,
      },
      {
        dir: path.resolve('src/content/recommendations'),
        published: EXPANSION_PUBLIC_FLAGS.recommendations,
        label: 'Recomendação',
        extPattern: /\.json$/i,
        draftPattern: /"draft":\s*true/i,
      },
    ];

    for (const {
      dir,
      published,
      label,
      extPattern,
      draftPattern,
    } of guardedDraftDirs) {
      assert.ok(fs.existsSync(dir), `Diretório ausente: ${dir}`);
      if (!published) {
        const files = fs.readdirSync(dir).filter((f) => extPattern.test(f));
        for (const file of files) {
          const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
          assert.ok(
            draftPattern.test(raw),
            `${label} ${file} deve permanecer com draft: true enquanto a seção não for publicada`,
          );
        }
      }
    }
  });
});
