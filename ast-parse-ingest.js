const fs = require('fs');
const path = require('path');

// Dynamically load typescript if available, otherwise fall back to a robust regex parser.
// This guarantees the script runs even if typescript isn't installed globally.
let ts;
try {
  ts = require('typescript');
  console.log('✅ TypeScript compiler API loaded. Parsing with full AST precision.');
} catch (e) {
  console.log('⚠️ TypeScript package not found in this environment. Falling back to robust regex-based metadata scanner.');
}

/**
 * Traverses a directory recursively to find target files (.tsx, .ts, .jsx, .js)
 */
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirPath = path.join(dir, file);
    const stat = fs.statSync(dirPath);
    
    // Skip common build and config directories
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'dist', '.git', 'out', 'build'].includes(file)) {
        walkDir(dirPath, fileList);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
      fileList.push(dirPath);
    }
  }
  return fileList;
}

/**
 * AST-based analyzer utilizing the native TypeScript compiler API
 */
function analyzeWithAST(filePath, fileContent) {
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true // SetParentNodes
  );

  const metadata = {
    name: path.basename(filePath, path.extname(filePath)),
    exports: [],
    imports: [],
    dependencies: new Set(),
    registryDependencies: new Set(),
    tags: new Set(),
    complexityScore: 0,
    linesCount: fileContent.split('\n').length,
    hasWebGL: false,
    hasCanvas: false
  };

  function visit(node) {
    // 1. Identify Imports and Dependencies
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier.text || node.moduleSpecifier.getText(sourceFile).replace(/['"`]/g, '');
      metadata.imports.push(moduleSpecifier);

      // Distinguish third-party dependencies from local utilities
      if (!moduleSpecifier.startsWith('.') && !moduleSpecifier.startsWith('@/')) {
        metadata.dependencies.add(moduleSpecifier);
      } else if (moduleSpecifier.startsWith('@/components/ui/')) {
        // Automatically discover local shadcn dependencies (e.g., "@/components/ui/button")
        const primitive = moduleSpecifier.split('/').pop();
        metadata.registryDependencies.add(primitive);
      }
    }

    // 2. Identify Component Name Exports
    if (ts.isFunctionDeclaration(node) && node.modifiers) {
      const isExported = node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
      if (isExported && node.name) {
        metadata.exports.push(node.name.text);
      }
    } else if (ts.isVariableStatement(node) && node.modifiers) {
      const isExported = node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
      if (isExported) {
        node.declarationList.declarations.forEach(decl => {
          if (decl.name && ts.isIdentifier(decl.name)) {
            metadata.exports.push(decl.name.text);
          }
        });
      }
    }

    // 3. Scan for WebGL / Canvas indicators in code structures
    if (ts.isIdentifier(node)) {
      const name = node.text;
      if (/WebGL|Shader|Renderer|PerspectiveCamera|Mesh/i.test(name)) {
        metadata.hasWebGL = true;
      }
    }

    // 4. Trace JSX elements for Canvas and specific tags
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tagName = node.tagName.getText(sourceFile);
      if (tagName === 'canvas') {
        metadata.hasCanvas = true;
      }
    }

    // Complexity heuristic: Count node visitations (AST size)
    metadata.complexityScore++;

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Derive final component name preference
  if (metadata.exports.length > 0) {
    metadata.name = metadata.exports[0];
  }

  return metadata;
}

/**
 * Fallback regex-based analyzer if TypeScript compiler is not locally available
 */
function analyzeWithRegex(filePath, fileContent) {
  const metadata = {
    name: path.basename(filePath, path.extname(filePath)),
    exports: [],
    imports: [],
    dependencies: new Set(),
    registryDependencies: new Set(),
    tags: new Set(),
    complexityScore: 0,
    linesCount: fileContent.split('\n').length,
    hasWebGL: false,
    hasCanvas: false
  };

  // 1. Scan for imports: matches both ESM import formats
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    const moduleSpecifier = match[1];
    metadata.imports.push(moduleSpecifier);

    if (!moduleSpecifier.startsWith('.') && !moduleSpecifier.startsWith('@/')) {
      metadata.dependencies.add(moduleSpecifier);
    } else if (moduleSpecifier.includes('components/ui/')) {
      const primitive = moduleSpecifier.split('/').pop();
      metadata.registryDependencies.add(primitive);
    }
  }

  // 2. Scan for named exports
  const exportRegex = /export\s+(?:function|const|class)\s+([a-zA-Z0-9_$]+)/g;
  while ((match = exportRegex.exec(fileContent)) !== null) {
    metadata.exports.push(match[1]);
  }

  if (metadata.exports.length > 0) {
    metadata.name = metadata.exports[0];
  }

  // 3. Basic string tells
  metadata.hasCanvas = fileContent.includes('<canvas');
  metadata.hasWebGL = /WebGL|Shader|Renderer|PerspectiveCamera|Mesh/i.test(fileContent);
  metadata.complexityScore = Math.floor(fileContent.length / 35); // Simple proxy based on characters

  return metadata;
}

/**
 * Calculates aesthetic metrics, design dials, categories, and tags
 */
function deriveTaxonomy(metadata, fileContent) {
  const tags = new Set();
  let category = 'ui:primitive'; // Default base

  // Determine core stack tags from imports/dependencies
  const depList = Array.from(metadata.dependencies);
  const impList = metadata.imports;

  if (depList.some(d => /framer-motion|motion/i.test(d)) || impList.some(i => /framer-motion|motion/i.test(i))) {
    tags.add('framer-motion');
    category = 'ui:motion';
  }
  if (depList.some(d => /three/i.test(d)) || metadata.hasWebGL || metadata.hasCanvas) {
    tags.add('threejs');
    tags.add('webgl');
    tags.add('canvas');
    category = 'ui:creative';
  }
  if (depList.some(d => /radix/i.test(d))) {
    tags.add('radix-primitives');
    tags.add('headless');
  }
  if (depList.some(d => /ark-ui/i.test(d))) {
    tags.add('ark-ui');
    tags.add('headless');
  }
  if (depList.some(d => /lucide-react/i.test(d))) {
    tags.add('lucide-react');
  }

  // Classify layouts / blocks
  const isBlock = /Layout|Grid|Dashboard|Navbar|Sidebar|Bento/i.test(metadata.name) || metadata.linesCount > 250;
  if (isBlock && category !== 'ui:creative') {
    category = 'ui:block';
    tags.add('layout-block');
  }

  // Evaluate design dials based on content tells
  let designVariance = 3;
  let motionIntensity = 2;
  let visualDensity = 5;

  // Spacing densities (Tailwind class audits)
  const highSpacing = (fileContent.match(/p[xy]?-(?:16|20|24|32|40|48|56|64)/g) || []).length;
  const denseSpacing = (fileContent.match(/p[xy]?-(?:0|1|2|3|4|5|6)/g) || []).length;
  if (highSpacing > denseSpacing) visualDensity = 3; // Generous whitespace
  if (denseSpacing > highSpacing) visualDensity = 8; // Packed structures

  // Motion tells
  if (category === 'ui:motion') {
    motionIntensity = 6;
    if (fileContent.includes('AnimatePresence') || fileContent.includes('LayoutGroup')) {
      motionIntensity = 8;
    }
  } else if (category === 'ui:creative') {
    motionIntensity = 9;
    designVariance = 8;
  }

  // Design Variance: Brutalist/Editorial patterns
  if (fileContent.includes('grid-cols') && fileContent.includes('gap-')) {
    tags.add('bento-grid');
  }
  if (/border-2|border-black|shadow-\[|brutalist/i.test(fileContent)) {
    tags.add('brutalist');
    designVariance = 8;
  }
  if (/backdrop-blur-md|bg-white\/10/i.test(fileContent)) {
    tags.add('glassmorphism');
  }

  // Ensure tags is a sorted array
  metadata.category = category;
  metadata.tags = Array.from(tags);
  metadata.dials = {
    design_variance: designVariance,
    motion_intensity: motionIntensity,
    visual_density: visualDensity
  };
  
  // Clean up set structures back to standard array format
  metadata.dependencies = Array.from(metadata.dependencies);
  metadata.registryDependencies = Array.from(metadata.registryDependencies);

  delete metadata.hasCanvas;
  delete metadata.hasWebGL;
}

/**
 * Main Orchestrator function
 */
function runIngest(targetDirectory, outputDir) {
  console.log(`\n🔍 Commencing directory scan: ${targetDirectory}`);
  
  if (!fs.existsSync(targetDirectory)) {
    console.error(`❌ Error: Directory "${targetDirectory}" does not exist.`);
    process.exit(1);
  }

  const files = walkDir(targetDirectory);
  console.log(`📂 Found ${files.length} design files to audit.`);

  const registryIndex = [];

  for (const filePath of files) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let componentMeta;

    if (ts) {
      componentMeta = analyzeWithAST(filePath, fileContent);
    } else {
      componentMeta = analyzeWithRegex(filePath, fileContent);
    }

    deriveTaxonomy(componentMeta, fileContent);
    
    // Supplement path parameters for registry schema conformity
    componentMeta.path = path.relative(targetDirectory, filePath);
    
    registryIndex.push(componentMeta);
    console.log(`  └─ Parser registered: [${componentMeta.category}] -> "${componentMeta.name}" (${componentMeta.tags.join(', ') || 'no technical tags'})`);
  }

  // Compile final outputs
  const outputRegistryPath = path.join(outputDir, 'registry.json');
  fs.writeFileSync(outputRegistryPath, JSON.stringify(registryIndex, null, 2));
  console.log(`\n🚀 Ingestion pipeline complete! compiled ${registryIndex.length} items into registry index.`);
  console.log(`📁 File written to: ${outputRegistryPath}`);

  // Create an llms.txt index file from scanned registry
  let llmsTxt = `# Local Component Library Catalog\n> Automatically compiled via ast-parse-ingest.js\n\n`;
  const categoriesMap = {};
  
  registryIndex.forEach(item => {
    if (!categoriesMap[item.category]) categoriesMap[item.category] = [];
    categoriesMap[item.category].push(item);
  });

  for (const [cat, items] of Object.entries(categoriesMap)) {
    llmsTxt += `## Category: ${cat}\n`;
    items.forEach(item => {
      llmsTxt += `- [${item.name}](/${item.path}) - ${item.tags.join(', ') || 'Standard primitive'} (Variance: ${item.dials.design_variance}, Motion: ${item.dials.motion_intensity})\n`;
    });
    llmsTxt += `\n`;
  }

  const outputLlmsPath = path.join(outputDir, 'llms-local.txt');
  fs.writeFileSync(outputLlmsPath, llmsTxt);
  console.log(`📁 Machine listing written to: ${outputLlmsPath}`);
}

// Read parameters from console args
const targetDir = process.argv[2] || './src/components';
const outDir = process.argv[3] || '.';
runIngest(targetDir, outDir);
