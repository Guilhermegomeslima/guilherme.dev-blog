/**
 * Controle centralizado de publicação segura da Expansão Editorial (EXP-02A).
 *
 * Em Astro SSG, ocultar links no header NÃO torna uma rota privada.
 * Este módulo garante três garantias arquiteturais:
 * 1. Todas as novas seções iniciam desativadas em produção pública (`false`).
 * 2. Rotas dinâmicas/condicionais (`getStaticPaths`) retornam `[]` quando a
 *    seção não está habilitada, impedindo a geração de HTML em `dist/`.
 * 3. A prévia local (`PREVIEW_EXPANSION=true`) é estritamente bloqueada em
 *    ambientes hospedados/CI (Vercel, GitHub Actions, CI genérico).
 */
import { isPublishable, type PublishableEntry } from './seo.ts';

export type ExpansionSection = 'reviews' | 'linuxDiary' | 'recommendations';

export type EnvRecord = Record<string, string | boolean | undefined>;

/**
 * Flags canônicas de publicação em produção (Vercel e GitHub Pages).
 * Só devem mudar para `true` quando a respectiva seção estiver implementada,
 * com conteúdo real, imagens aprovadas e autorização explícita do autor.
 */
export const EXPANSION_PUBLIC_FLAGS: Readonly<
  Record<ExpansionSection, boolean>
> = Object.freeze({
  reviews: false,
  linuxDiary: false,
  recommendations: false,
});

export interface ExpansionSectionMeta {
  indexRoute: string;
  distPrefix: string;
  extraRoutes?: readonly string[];
}

export const EXPANSION_SECTIONS: Readonly<
  Record<ExpansionSection, ExpansionSectionMeta>
> = Object.freeze({
  reviews: {
    indexRoute: '/resenhas/',
    distPrefix: 'resenhas',
  },
  linuxDiary: {
    indexRoute: '/diario-linux/',
    distPrefix: 'diario-linux',
    extraRoutes: ['/diario-linux/meu-ambiente/'],
  },
  recommendations: {
    indexRoute: '/recomendacoes/',
    distPrefix: 'recomendacoes',
  },
});

function readRuntimeEnv(): EnvRecord {
  const merged: EnvRecord = {};

  const nodeEnv = (globalThis as unknown as { process?: { env?: EnvRecord } })
    .process?.env;
  if (nodeEnv) {
    Object.assign(merged, nodeEnv);
  }

  const metaEnv = (import.meta as unknown as { env?: EnvRecord }).env;
  if (metaEnv) {
    for (const [key, value] of Object.entries(metaEnv)) {
      if (merged[key] === undefined) {
        merged[key] = value;
      }
    }
  }

  return merged;
}

function isTruthyFlag(value: string | boolean | undefined): boolean {
  if (value === true) return true;
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1';
}

/**
 * Identifica builds de produção hospedados ou pipelines de CI
 * (Vercel, GitHub Actions ou ambiente CI genérico).
 */
export function isCiOrHostedProduction(
  env: EnvRecord = readRuntimeEnv(),
): boolean {
  return (
    isTruthyFlag(env.GITHUB_ACTIONS) ||
    isTruthyFlag(env.VERCEL) ||
    isTruthyFlag(env.CI)
  );
}

/**
 * Libera visualização local das seções e rascunhos da expansão exclusivamente
 * fora de ambientes hospedados/CI quando `PREVIEW_EXPANSION=true`.
 */
export function isExpansionPreviewEnabled(
  env: EnvRecord = readRuntimeEnv(),
): boolean {
  if (isCiOrHostedProduction(env)) {
    return false;
  }
  return isTruthyFlag(env.PREVIEW_EXPANSION);
}

/**
 * Indica se a seção foi oficialmente liberada para publicação pública.
 * Nunca é afetada por `PREVIEW_EXPANSION`.
 */
export function isSectionPubliclyPublished(
  section: ExpansionSection,
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): boolean {
  return flags[section] === true;
}

/**
 * Indica se a seção pode ser renderizada no ambiente atual
 * (publicada em produção OU em prévia local segura).
 */
export function isSectionEnabled(
  section: ExpansionSection,
  env: EnvRecord = readRuntimeEnv(),
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): boolean {
  return (
    isSectionPubliclyPublished(section, flags) || isExpansionPreviewEnabled(env)
  );
}

/**
 * Predicado semântico para `getStaticPaths()` de rotas dinâmicas/rest
 * (ex.: `[...slug].astro` e `[id].astro`). Quando retorna `false`,
 * `getStaticPaths()` deve retornar `[]` para não gerar HTML em `dist/`.
 */
export function shouldGenerateSectionRoute(
  section: ExpansionSection,
  env: EnvRecord = readRuntimeEnv(),
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): boolean {
  return isSectionEnabled(section, env, flags);
}

/**
 * Determina se uma entrada individual da coleção deve ser incluída na listagem
 * e gerar rota estática.
 *
 * - Seção desativada → sempre `false`.
 * - Produção pública (sem preview local) → exige `!draft && !isDemo`.
 * - Prévia local (`PREVIEW_EXPANSION=true` fora de CI/Vercel/GH Pages) →
 *   permite revisar rascunhos reais (`draft: true`), bloqueando `isDemo: true`.
 */
export function shouldIncludeEntry(
  section: ExpansionSection,
  entry: PublishableEntry,
  env: EnvRecord = readRuntimeEnv(),
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): boolean {
  if (!isSectionEnabled(section, env, flags)) {
    return false;
  }

  if (entry.isDemo === true) {
    return false;
  }

  if (isExpansionPreviewEnabled(env)) {
    return true;
  }

  return isPublishable(entry);
}

/**
 * Determina se uma seção (ou entrada específica) pode entrar no `sitemap.xml`.
 * Restrito estritamente a conteúdo público aprovado; nunca inclui prévia local.
 */
export function shouldIncludeInSitemap(
  section: ExpansionSection,
  entry?: PublishableEntry,
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): boolean {
  if (!isSectionPubliclyPublished(section, flags)) {
    return false;
  }
  return entry ? isPublishable(entry) : true;
}

/**
 * Retorna as rotas estáticas de índice das seções publicamente aprovadas.
 */
export function getPublishedExpansionStaticRoutes(
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): string[] {
  const routes: string[] = [];
  for (const section of Object.keys(EXPANSION_SECTIONS) as ExpansionSection[]) {
    if (isSectionPubliclyPublished(section, flags)) {
      routes.push(EXPANSION_SECTIONS[section].indexRoute);
    }
  }
  return routes;
}

/**
 * Retorna os prefixos de diretório em `dist/` que NÃO podem existir em builds
 * públicos enquanto suas flags estiverem desativadas.
 */
export function getUnpublishedExpansionPrefixes(
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): string[] {
  const prefixes: string[] = [];
  for (const section of Object.keys(EXPANSION_SECTIONS) as ExpansionSection[]) {
    if (!isSectionPubliclyPublished(section, flags)) {
      prefixes.push(EXPANSION_SECTIONS[section].distPrefix);
    }
  }
  return prefixes;
}
