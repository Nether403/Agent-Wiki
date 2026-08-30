import { ComponentParsedMetadata, generateYamlFrontmatter, TaxonomyCategory } from "./ast-parser";
import { classifyComponentDials, evaluateLLMReview, DialScoreResult, LLMReviewResult } from "./dial-classifier";

export interface EnrichedMetadataResult {
  category: TaxonomyCategory;
  dials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
  tags: string[];
  complexity: "low" | "medium" | "high";
  a11y: {
    keyboard_navigable: boolean;
    wai_aria_compliant: boolean;
    fallback_provided: boolean;
    reduced_motion_supported?: boolean;
  };
  frontmatter: string;
  llmCritique: LLMReviewResult;
}

/**
 * Enriches component metadata by evaluating AST cues, syntax markers, and heuristic taste dials.
 * Emulates the automated LLM enrichment pipeline to ensure uniform categorization across foreign repos.
 */
export function enrichComponentMetadata(
  astMeta: ComponentParsedMetadata,
  fileContent: string,
  overrides?: {
    category?: TaxonomyCategory;
    tags?: string[];
    dials?: Partial<{ design_variance: number; motion_intensity: number; visual_density: number }>;
  }
): EnrichedMetadataResult {
  const dialClassification = classifyComponentDials(astMeta, fileContent);
  const llmReview = evaluateLLMReview(fileContent, astMeta);

  const category = overrides?.category || dialClassification.category;
  const dials = {
    design_variance: overrides?.dials?.design_variance ?? dialClassification.dials.design_variance,
    motion_intensity: overrides?.dials?.motion_intensity ?? dialClassification.dials.motion_intensity,
    visual_density: overrides?.dials?.visual_density ?? dialClassification.dials.visual_density,
  };

  const tags = Array.from(new Set([...dialClassification.tags, ...(overrides?.tags || [])]));

  const frontmatter = generateYamlFrontmatter(
    {
      ...astMeta,
      category,
      tags,
    },
    dials
  );

  return {
    category,
    dials,
    tags,
    complexity: astMeta.complexity,
    a11y: astMeta.a11y,
    frontmatter,
    llmCritique: llmReview,
  };
}
