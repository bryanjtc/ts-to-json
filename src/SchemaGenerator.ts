import * as ts from "typescript";
import { NoRootTypeError } from "./Error/NoRootTypeError";
import { Context, NodeParser } from "./NodeParser";
import { Definition } from "./Schema/Definition";
import { Schema } from "./Schema/Schema";
import { TopRefNodeParser } from "./TopRefNodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { TypeFormatter } from "./TypeFormatter";
import { StringMap } from "./Utils/StringMap";
import { localSymbolAtNode, symbolAtNode } from "./Utils/symbolAtNode";

export class SchemaGenerator {
    private allTypes: Map<string, ts.Node>;
    private prioritizedFiles: ts.SourceFile[];
    private unPrioritizedFiles: ts.SourceFile[];
    private nodeInfo: { node: ts.Node, name: string, exported: boolean, kind: ts.SyntaxKind }[] = [];

    public constructor(
        private program: ts.Program,
        private nodeParser: NodeParser,
        private typeFormatter: TypeFormatter,
    ) {
        this.allTypes = new Map<string, ts.Node>();

        const sourceFiles = this.program.getSourceFiles();
        this.prioritizedFiles = [];
        this.unPrioritizedFiles = [];
        for (const f of sourceFiles) {
            if (!f.fileName.includes("/node_modules/")) {
                this.prioritizedFiles.push(f);
            } else {
                this.unPrioritizedFiles.push(f);
            }
        }
    }

    public createSchema(fullName: string): Schema {
        const rootNode = this.findRootNode(fullName);
        const rootType = this.nodeParser.createType(rootNode, new Context());
        return {
            definitions: this.getRootChildDefinitions(rootType),
            ...this.getRootTypeDefinition(rootType),
        };
    }

    public createSchemaByNodeKind(nodeKinds: ts.SyntaxKind | ts.SyntaxKind[]): Schema | null {
        const typeChecker = this.program.getTypeChecker();
        this.setPrioritizedFiles(typeChecker);
        const nodes = this.getRootNodesByKind(Array.isArray(nodeKinds) ? nodeKinds : [nodeKinds]);
        if (!nodes || !nodes.length) { return null; }
        let allSchema: Schema = { definitions: {} };
        nodes.forEach((node) => {
            const name = this.getFullName(node, typeChecker);
            // hack read more in TopRefNodeParser file
            (this.nodeParser as TopRefNodeParser).setFullName(name);
            const rootType = this.nodeParser.createType(node, new Context());
            const definitions = this.getRootChildDefinitions(rootType);
            allSchema = {
                ...allSchema,
                definitions: {
                    ...allSchema.definitions,
                    ...definitions,
                },
            };
        });
        return allSchema;
    }

    private findRootNode(fullName: string): ts.Node {
        const typeChecker = this.program.getTypeChecker();

        this.setPrioritizedFiles(typeChecker);

        if (this.allTypes.has(fullName)) {
            return this.allTypes.get(fullName)!;
        }

        this.setUnPrioritizedFiles(typeChecker);

        if (this.allTypes.has(fullName)) {
            return this.allTypes.get(fullName)!;
        }

        throw new NoRootTypeError(fullName);
    }
    private setPrioritizedFiles(typeChecker: ts.TypeChecker) {
        if (this.prioritizedFiles.length) {
            for (const sourceFile of this.prioritizedFiles) {
                this.inspectNode(sourceFile, typeChecker, this.allTypes);
            }
            this.prioritizedFiles = [];
        }
    }
    private setUnPrioritizedFiles(typeChecker: ts.TypeChecker) {
        if (this.unPrioritizedFiles.length) {
            for (const sourceFile of this.unPrioritizedFiles) {
                this.inspectNode(sourceFile, typeChecker, this.allTypes);
            }
            this.unPrioritizedFiles = [];
        }
    }
    private getRootNodesByKind(kinds: ts.SyntaxKind[]): ts.Node[] | null {
        const nodes = this.nodeInfo.filter(n => n.exported)
            .reduce((result: ts.Node[], inf) => {
                if (inf.kind === ts.SyntaxKind.ExportAssignment) {
                    const assignmentNode = this.nodeInfo
                        .filter(n => n.name === inf.name && kinds.indexOf(n.kind) > -1)
                        .map((n) => {
                            return n.node;
                        });
                    result = [...result, ...assignmentNode];
                } else if (inf.kind === ts.SyntaxKind.FunctionDeclaration) {
                    result.push(inf.node);
                }
                return result;
            }, []);
        return nodes;
    }
    private inspectNode(node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, ts.Node>): void {
        if (
            node.kind === ts.SyntaxKind.InterfaceDeclaration ||
            node.kind === ts.SyntaxKind.EnumDeclaration ||
            node.kind === ts.SyntaxKind.TypeAliasDeclaration ||
            node.kind === ts.SyntaxKind.FunctionDeclaration ||
            node.kind === ts.SyntaxKind.ExportAssignment
        ) {
            if (this.isGenericType(node as ts.TypeAliasDeclaration)) {
                return;
            }
            const name = this.getFullName(node, typeChecker);
            this.nodeInfo.push({
                node,
                name,
                kind: node.kind,
                exported: this.isExportType(node) || node.kind === ts.SyntaxKind.ExportAssignment,
            });
            allTypes.set(this.getFullName(node, typeChecker), node);
        } else {
            ts.forEachChild(node, (subNode) => this.inspectNode(subNode, typeChecker, allTypes));
        }
    }

    private isExportType(node: ts.Node): boolean {
        const localSymbol = localSymbolAtNode(node);
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    private isGenericType(node: ts.TypeAliasDeclaration): boolean {
        return !!(
            node.typeParameters &&
            node.typeParameters.length > 0
        );
    }
    private getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string {
        const symbol = symbolAtNode(node)!;
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    }

    private getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType);
    }
    private getRootChildDefinitions(rootType: BaseType): StringMap<Definition> {
        return this.typeFormatter.getChildren(rootType)
            .filter((child) => child instanceof DefinitionType)
            .reduce((result: StringMap<Definition>, child: DefinitionType) => ({
                ...result,
                [child.getId()]: this.typeFormatter.getDefinition(child.getType()),
            }), {});
    }
}
