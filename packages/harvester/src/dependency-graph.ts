import path from "path";
import fs from "fs";
import { ComponentParsedMetadata, parseComponentAST } from "./ast-parser";

export interface DependencyNode {
  name: string;
  category: string;
  registryDependencies: string[];
  dependencies: string[];
  devDependencies: string[];
  depth: number;
}

export interface DependencyGraphReport {
  nodes: Record<string, DependencyNode>;
  edges: Array<{ from: string; to: string; type: "registry" | "npm" | "dev" }>;
  hasCircularDependency: boolean;
  circularChains: string[][];
  topologicalInstallOrder: string[];
  totalComponents: number;
  totalNpmDependencies: string[];
}

/**
 * Builds a Directed Acyclic Graph (DAG) for a given collection of component metadata or paths.
 */
export class DependencyGraph {
  private nodes: Map<string, DependencyNode> = new Map();
  private allNpmDeps: Set<string> = new Set();
  private allDevDeps: Set<string> = new Set();

  /**
   * Registers a component node in the graph
   */
  public addComponent(meta: ComponentParsedMetadata): void {
    const slug = meta.name.toLowerCase();
    const regDeps = (meta.registryDependencies || [])
      .map((d) => d.toLowerCase())
      .filter((d) => d !== slug);

    this.nodes.set(slug, {
      name: slug,
      category: meta.category,
      registryDependencies: regDeps,
      dependencies: meta.dependencies || [],
      devDependencies: meta.devDependencies || [],
      depth: 0,
    });

    (meta.dependencies || []).forEach((d) => this.allNpmDeps.add(d));
    (meta.devDependencies || []).forEach((d) => this.allDevDeps.add(d));
  }

  /**
   * Scans a directory of TSX components and registers all items into the graph
   */
  public scanDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) return;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (!["node_modules", ".git", "dist", ".next"].includes(entry.name)) {
          this.scanDirectory(fullPath);
        }
      } else if (/\.(tsx|ts)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const meta = parseComponentAST(fullPath, content);
        this.addComponent(meta);
      }
    }
  }

  /**
   * Detects circular dependencies within registered components
   */
  public detectCircularDependencies(): string[][] {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const circularChains: string[][] = [];
    const currentPath: string[] = [];

    const dfs = (nodeKey: string) => {
      visited.add(nodeKey);
      recStack.add(nodeKey);
      currentPath.push(nodeKey);

      const node = this.nodes.get(nodeKey);
      if (node) {
        for (const dep of node.registryDependencies) {
          if (!this.nodes.has(dep)) continue; // external / unregistered
          if (!visited.has(dep)) {
            dfs(dep);
          } else if (recStack.has(dep)) {
            // Found circular loop
            const cycleStartIndex = currentPath.indexOf(dep);
            if (cycleStartIndex !== -1) {
              circularChains.push([...currentPath.slice(cycleStartIndex), dep]);
            }
          }
        }
      }

      currentPath.pop();
      recStack.delete(nodeKey);
    };

    for (const key of this.nodes.keys()) {
      if (!visited.has(key)) {
        dfs(key);
      }
    }

    return circularChains;
  }

  /**
   * Calculates the topological installation sequence for all components or a target slug.
   * Dependencies are installed before dependents.
   */
  public getTopologicalInstallOrder(targetSlug?: string): string[] {
    const order: string[] = [];
    const visited = new Set<string>();

    const visit = (nodeKey: string) => {
      if (visited.has(nodeKey)) return;
      visited.add(nodeKey);

      const node = this.nodes.get(nodeKey);
      if (node) {
        for (const dep of node.registryDependencies) {
          if (this.nodes.has(dep)) {
            visit(dep);
          }
        }
      }
      order.push(nodeKey);
    };

    if (targetSlug) {
      const slug = targetSlug.toLowerCase();
      if (this.nodes.has(slug)) {
        visit(slug);
      }
    } else {
      for (const key of this.nodes.keys()) {
        visit(key);
      }
    }

    return order;
  }

  /**
   * Computes transitive closure (all required registry and npm dependencies for a component)
   */
  public getTransitiveClosure(targetSlug: string): {
    target: string;
    registryDependencies: string[];
    npmDependencies: string[];
    devDependencies: string[];
    installSequence: string[];
  } {
    const slug = targetSlug.toLowerCase();
    const installSequence = this.getTopologicalInstallOrder(slug);
    const regDeps = new Set<string>();
    const npmDeps = new Set<string>();
    const devDeps = new Set<string>();

    for (const item of installSequence) {
      if (item !== slug) {
        regDeps.add(item);
      }
      const node = this.nodes.get(item);
      if (node) {
        node.dependencies.forEach((d) => npmDeps.add(d));
        node.devDependencies.forEach((d) => devDeps.add(d));
      }
    }

    return {
      target: slug,
      registryDependencies: Array.from(regDeps),
      npmDependencies: Array.from(npmDeps),
      devDependencies: Array.from(devDeps),
      installSequence,
    };
  }

  /**
   * Generates a comprehensive Dependency Graph report
   */
  public generateReport(): DependencyGraphReport {
    const nodesObj: Record<string, DependencyNode> = {};
    const edges: Array<{ from: string; to: string; type: "registry" | "npm" | "dev" }> = [];

    // Calculate node depth
    for (const [key, node] of this.nodes.entries()) {
      const closure = this.getTransitiveClosure(key);
      node.depth = closure.installSequence.length - 1;
      nodesObj[key] = node;

      node.registryDependencies.forEach((dep) => {
        edges.push({ from: key, to: dep, type: "registry" });
      });
      node.dependencies.forEach((dep) => {
        edges.push({ from: key, to: dep, type: "npm" });
      });
      node.devDependencies.forEach((dep) => {
        edges.push({ from: key, to: dep, type: "dev" });
      });
    }

    const circularChains = this.detectCircularDependencies();
    const topologicalInstallOrder = this.getTopologicalInstallOrder();

    return {
      nodes: nodesObj,
      edges,
      hasCircularDependency: circularChains.length > 0,
      circularChains,
      topologicalInstallOrder,
      totalComponents: this.nodes.size,
      totalNpmDependencies: Array.from(this.allNpmDeps),
    };
  }

  /**
   * Exports the dependency graph in Mermaid diagram format
   */
  public exportMermaid(): string {
    const lines: string[] = ["graph TD"];
    lines.push("  %% Styling classes");
    lines.push("  classDef component fill:#2563eb,stroke:#3b82f6,stroke-width:2px,color:#fff;");
    lines.push("  classDef npm fill:#10b981,stroke:#059669,stroke-width:1px,color:#fff;");

    for (const [slug, node] of this.nodes.entries()) {
      lines.push(`  ${slug}["${node.name} (${node.category})"]:::component`);
      node.registryDependencies.forEach((dep) => {
        lines.push(`  ${slug} -->|uses| ${dep}`);
      });
    }

    return lines.join("\n");
  }
}

/**
 * Helper function to create and build a dependency graph for a directory or metadata set
 */
export function buildDependencyGraph(targetDirOrItems: string | ComponentParsedMetadata[]): DependencyGraph {
  const graph = new DependencyGraph();
  if (typeof targetDirOrItems === "string") {
    graph.scanDirectory(targetDirOrItems);
  } else if (Array.isArray(targetDirOrItems)) {
    targetDirOrItems.forEach((item) => graph.addComponent(item));
  }
  return graph;
}
