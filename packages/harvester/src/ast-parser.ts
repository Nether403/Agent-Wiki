import ts from "typescript";
import path from "path";

export interface ComponentParsedMetadata {
  name: string;
  filePath: string;
  exports: string[];
  imports: string[];
  dependencies: string[];
  registryDependencies: string[];
  tags: string[];
  hasCanvas: boolean;
  hasWebGL: boolean;
  hasMotion: boolean;
  linesCount: number;
  complexityScore: number;
}

export function parseComponentAST(filePath: string, fileContent: string): ComponentParsedMetadata {
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const metadata: ComponentParsedMetadata = {
    name: path.basename(filePath, path.extname(filePath)),
    filePath,
    exports: [],
    imports: [],
    dependencies: [],
    registryDependencies: [],
    tags: [],
    hasCanvas: false,
    hasWebGL: false,
    hasMotion: false,
    linesCount: fileContent.split("\n").length,
    complexityScore: 0,
  };

  const depSet = new Set<string>();
  const regDepSet = new Set<string>();
  const tagSet = new Set<string>();

  function visit(node: ts.Node) {
    metadata.complexityScore++;

    // 1. Identify Imports & Dependencies
    if (ts.isImportDeclaration(node)) {
      const specifier = (node.moduleSpecifier as ts.StringLiteral).text;
      metadata.imports.push(specifier);

      if (specifier === "motion/react" || specifier === "framer-motion" || specifier === "motion") {
        metadata.hasMotion = true;
        tagSet.add("motion/react");
        depSet.add("motion");
      } else if (specifier.includes("three")) {
        metadata.hasWebGL = true;
        tagSet.add("threejs");
        tagSet.add("webgl");
        depSet.add("three");
      } else if (specifier.startsWith("@radix-ui/")) {
        tagSet.add("radix-primitives");
        tagSet.add("headless");
        depSet.add(specifier);
      } else if (specifier.startsWith("@ark-ui/")) {
        tagSet.add("ark-ui");
        tagSet.add("headless");
        depSet.add(specifier);
      } else if (specifier === "lucide-react") {
        depSet.add("lucide-react");
      } else if (specifier.startsWith("@/components/ui/")) {
        const primitive = specifier.split("/").pop()!;
        regDepSet.add(primitive);
      }
    }

    // 2. Identify Exports
    if (ts.isFunctionDeclaration(node) && node.modifiers) {
      const isExported = node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (isExported && node.name) {
        metadata.exports.push(node.name.text);
      }
    } else if (ts.isVariableStatement(node) && node.modifiers) {
      const isExported = node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (isExported) {
        node.declarationList.declarations.forEach((decl) => {
          if (decl.name && ts.isIdentifier(decl.name)) {
            metadata.exports.push(decl.name.text);
          }
        });
      }
    }

    // 3. Scan for Canvas / WebGL tells
    if (ts.isIdentifier(node)) {
      const text = node.text;
      if (/WebGL|Shader|PerspectiveCamera|Mesh|WebGLRenderer/i.test(text)) {
        metadata.hasWebGL = true;
        tagSet.add("webgl");
      }
    }

    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tagName = node.tagName.getText(sourceFile);
      if (tagName === "canvas") {
        metadata.hasCanvas = true;
        tagSet.add("canvas");
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (metadata.exports.length > 0) {
    metadata.name = metadata.exports[0];
  }

  metadata.dependencies = Array.from(depSet);
  metadata.registryDependencies = Array.from(regDepSet);
  metadata.tags = Array.from(tagSet);

  return metadata;
}
