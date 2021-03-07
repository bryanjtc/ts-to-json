import * as ts from "typescript";
import { NoRootTypeError } from "./Error/NoRootTypeError";
import { Context, NodeParser } from "./NodeParser";
import { Definition } from "./Schema/Definition";
import { Schema } from "./Schema/Schema";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { TypeFormatter } from "./TypeFormatter";
import { StringMap } from "./Utils/StringMap";
import { localSymbolAtNode, symbolAtNode } from "./Utils/symbolAtNode";
import { notUndefined } from "./Utils/notUndefined";
import { removeUnreachable } from "./Utils/removeUnreachable";
import { TopRefNodeParser } from "./TopRefNodeParser";
import { Config } from "./Config";
import { sortProps } from "./Utils";

export class SchemaGenerator {
    public constructor(
        private readonly program: ts.Program,
        private readonly nodeParser: NodeParser,
        private readonly typeFormatter: TypeFormatter,
        private readonly config?: Config
    ) {}

    public createSchema(fullName: string | undefined): Schema {
        const rootNodes = this.getRootNodes(fullName);
        const schema = this.createSchemaFromNodes(rootNodes);
        if (this.config?.sortProps) return sortProps(schema);
        return schema;
    }

    public createSchemaFromNodes(rootNodes: ts.Node[]): Schema {
        const rootTypes = rootNodes
            .map((rootNode) => {
                return this.nodeParser.createType(rootNode, new Context());
            })
            .filter(notUndefined);
        const rootTypeDefinition = rootTypes.length === 1 ? this.getRootTypeDefinition(rootTypes[0]) : undefined;
        const definitions: StringMap<Definition> = {};
        delete definitions["*"];
        rootTypes.forEach((rootType) => this.appendRootChildDefinitions(rootType, definitions));

        const reachableDefinitions = removeUnreachable(rootTypeDefinition, definitions);

        return {
            $schema: "http://json-schema.org/draft-07/schema#",
            ...(rootTypeDefinition ?? {}),
            definitions: reachableDefinitions,
        };
    }

    private getRootNodes(fullName: string | undefined, exposeAll?: boolean) {
        if (fullName && fullName !== "*") {
            return [this.findNamedNode(fullName)];
        } else {
            const rootFileNames = this.program.getRootFileNames();
            const rootSourceFiles = this.program
                .getSourceFiles()
                .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));
            const rootNodes = new Map<string, ts.Node>();
            this.appendTypes(rootSourceFiles, this.program.getTypeChecker(), rootNodes, exposeAll);
            return [...rootNodes.values()];
        }
    }
    private findNamedNode(fullName: string): ts.Node {
        const typeChecker = this.program.getTypeChecker();
        const allTypes = new Map<string, ts.Node>();
        const { projectFiles, externalFiles } = this.partitionFiles();

        this.appendTypes(projectFiles, typeChecker, allTypes);

        if (allTypes.has(fullName)) {
            return allTypes.get(fullName)!;
        }

        this.appendTypes(externalFiles, typeChecker, allTypes);

        if (allTypes.has(fullName)) {
            return allTypes.get(fullName)!;
        }

        throw new NoRootTypeError(fullName);
    }
    private getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType);
    }
    private appendRootChildDefinitions(rootType: BaseType, childDefinitions: StringMap<Definition>): void {
        const seen = new Set<string>();

        const children = this.typeFormatter
            .getChildren(rootType)
            .filter((child): child is DefinitionType => child instanceof DefinitionType)
            .filter((child) => {
                if (!seen.has(child.getId())) {
                    seen.add(child.getId());
                    return true;
                }
                return false;
            });

        const ids = new Map<string, string>();
        for (const child of children) {
            const name = child.getName();
            const previousId = ids.get(name);
            if (!this.config?.ignoreMultipleDefinitions && previousId && child.getId() !== previousId) {
                throw new Error(
                    `Type "${name}" has multiple definitions.
                    To suppress this error you can use 'ignoreMultipleDefinitions'.
                    Note that using this option can introduce new problems.`
                );
            }
            ids.set(name, child.getId());
        }

        children.reduce((definitions, child) => {
            const name = child.getName();
            if (!(name in definitions)) {
                definitions[name] = this.typeFormatter.getDefinition(child.getType());
            }
            return definitions;
        }, childDefinitions);
    }
    private partitionFiles() {
        const projectFiles = new Array<ts.SourceFile>();
        const externalFiles = new Array<ts.SourceFile>();

        for (const sourceFile of this.program.getSourceFiles()) {
            const destination = sourceFile.fileName.includes("/node_modules/") ? externalFiles : projectFiles;
            destination.push(sourceFile);
        }

        return { projectFiles, externalFiles };
    }
    private appendTypes(
        sourceFiles: readonly ts.SourceFile[],
        typeChecker: ts.TypeChecker,
        types: Map<string, ts.Node>,
        exposeAll?: boolean
    ) {
        for (const sourceFile of sourceFiles) {
            this.inspectNode(sourceFile, typeChecker, types, exposeAll);
        }
    }
    private inspectNode(
        node: ts.Node,
        typeChecker: ts.TypeChecker,
        allTypes: Map<string, ts.Node>,
        exposeAll?: boolean
    ): void {
        switch (node.kind) {
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
            case ts.SyntaxKind.TypeAliasDeclaration:
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.ExportAssignment:
                if (this.config?.expose === "all" || this.isExportType(node) || exposeAll) {
                    allTypes.set(this.getFullName(node, typeChecker), node);
                    return;
                }
                return;

            default:
                ts.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes, exposeAll));
                break;
        }
    }
    private isExportType(node: ts.Node): boolean {
        const localSymbol = localSymbolAtNode(node);
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    // private isGenericType(node: ts.TypeAliasDeclaration): boolean {
    //     return !!(node.typeParameters && node.typeParameters.length > 0);
    // }
    private getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string {
        const symbol = symbolAtNode(node)!;
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    }

    /*
        My Implementations
    */

    private createSchemaByNodes(nodes: ts.Node[] | null): Schema | null {
        if (!nodes || !nodes.length) {
            return null;
        }
        const typeChecker = this.program.getTypeChecker();

        let allSchema: Schema = { definitions: {} };

        nodes.forEach((node) => {
            const name = this.getFullName(node, typeChecker);
            // hack read more in TopRefNodeParser file
            (this.nodeParser as TopRefNodeParser).setFullName(name);
            const rootType = this.nodeParser.createType(node, new Context());
            const definitions = this.getRootChildDefinitions(rootType!);
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

    public createSchemaByFilter(filterNode: (node: ts.Node) => boolean): Schema | null {
        const rootNodes = this.getRootNodes("*", true);

        const nodes = rootNodes.filter((n) => filterNode(n));

        return this.createSchemaByNodes(nodes);
    }

    public createSchemaByNodeKind(nodeKinds: ts.SyntaxKind | ts.SyntaxKind[]): Schema | null {
        const nodes = this.getRootNodesByKind(Array.isArray(nodeKinds) ? nodeKinds : [nodeKinds]);

        return this.createSchemaByNodes(nodes);
    }

    private getRootNodesByKind(kinds: ts.SyntaxKind[]): ts.Node[] | null {
        const rootNodes = this.getRootNodes("*", true);

        const nodes = rootNodes.filter((n) => kinds.includes(n.kind));

        return nodes;
    }

    private getRootChildDefinitions(rootType: BaseType): StringMap<Definition> {
        return this.typeFormatter
            .getChildren(rootType)
            .filter((child) => child instanceof DefinitionType)
            .reduce(
                (result: StringMap<Definition>, child: DefinitionType) => ({
                    ...result,
                    [child.getName()]: this.typeFormatter.getDefinition(child.getType()),
                }),
                {}
            );
    }
}
