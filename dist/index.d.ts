import * as ts from 'typescript';
import ts__default, { Node, PropertyName } from 'typescript';
import { JSONSchema7, JSONSchema7Definition, JSONSchema7Type, JSONSchema7TypeName } from 'json-schema';

declare abstract class BaseError extends Error {
    constructor(message?: string);
}

declare class DiagnosticError extends BaseError {
    private diagnostics;
    constructor(diagnostics: readonly ts__default.Diagnostic[]);
    getDiagnostics(): readonly ts__default.Diagnostic[];
}

declare class LogicError extends BaseError {
    private msg;
    constructor(msg: string, node?: ts__default.Node);
}

declare class NoRootNamesError extends BaseError {
    get name(): string;
    get message(): string;
}

declare class NoRootTypeError extends BaseError {
    private type;
    constructor(type: string);
    getType(): string;
}

declare class NoTSConfigError extends BaseError {
    get name(): string;
    get message(): string;
}

declare class UnknownNodeError extends BaseError {
    private node;
    private reference?;
    constructor(node: ts__default.Node, reference?: ts__default.Node | undefined);
    getNode(): ts__default.Node;
    getReference(): ts__default.Node | undefined;
}

declare abstract class BaseType {
    abstract getId(): string;
    getName(): string;
}

declare class UnknownTypeError extends BaseError {
    private type;
    constructor(type: BaseType | undefined);
    getType(): BaseType | undefined;
}

interface Config {
    path?: string;
    type?: string;
    schemaId?: string;
    tsconfig?: string;
    expose?: "all" | "none" | "export";
    topRef?: boolean;
    jsDoc?: "none" | "extended" | "basic";
    sortProps?: boolean;
    strictTuples?: boolean;
    skipTypeCheck?: boolean;
    encodeRefs?: boolean;
    extraTags?: string[];
    additionalProperties?: boolean;
    ignoreMultipleDefinitions?: boolean;
    shouldParseNode?: (node: ts__default.Node) => boolean;
    handleUnknownTypes?: boolean;
    showUnknownTypeInfo?: boolean;
    skipParseFiles?: string[];
    skipParseTypes?: string[];
    forceToParseTypes?: string[];
    excludeRootProps?: string[];
    excludeProps?: string[];
    includeProps?: string[];
    maxDepth?: number;
    funcParamMaxDepth?: number;
    allowArbitraryDataTypes?: boolean;
}
declare const DEFAULT_CONFIG: Config;

type JSONSchemaDefinition = JSONSchema7 | boolean;
interface Definition extends JSONSchema7 {
    propertyOrder?: string[];
    parameters?: {
        [key: string]: JSONSchema7;
    };
    properties?: {
        [key: string]: Definition | JSONSchemaDefinition;
    };
    defaultProperties?: string[];
    locale?: string;
    kind?: "function";
    name?: string;
    label?: string;
}

interface TypeFormatter {
    getDefinition(type: BaseType): Definition;
    getChildren(type: BaseType): BaseType[];
}

declare function getAllOfDefinitionReducer(childTypeFormatter: TypeFormatter): (definition: Definition, baseType: BaseType) => Definition;

declare function deepMerge(a: {
    [key: string]: JSONSchema7Definition;
}, b: {
    [key: string]: JSONSchema7Definition;
}): {
    [x: string]: JSONSchema7Definition;
};

declare function derefType(type: BaseType | undefined): BaseType | undefined;
declare function derefAnnotatedType(type: BaseType): BaseType;

declare function extractLiterals(type: BaseType | undefined): string[];

declare function formatError(error: BaseError): string;

declare function hasJsDocTag(node: ts__default.Node, tagName: string): boolean;

declare function intersectionOfArrays<T>(a: T[], b: T[]): T[];

declare function isAssignableTo(target: BaseType | undefined, source: BaseType | undefined, insideTypes?: Set<BaseType>): boolean;

declare function isNodeHidden(node: ts__default.Node): boolean;

declare function hasModifier(node: ts__default.Node, modifier: ts__default.SyntaxKind): boolean;
declare function isPublic(node: ts__default.Node): boolean;
declare function isStatic(node: ts__default.Node): boolean;

declare function narrowType(type: BaseType | undefined, predicate: (type: BaseType | undefined) => boolean): BaseType | undefined;

declare class ReferenceType extends BaseType {
    private type;
    private id;
    private name;
    getId(): string;
    setId(id: string): void;
    getName(): string;
    setName(name: string): void;
    getType(): BaseType;
    setType(type: BaseType): void;
}

declare class Context {
    private cacheKey;
    private arguments;
    private parameters;
    private reference?;
    private defaultArgument;
    private parentContext?;
    ignoreLimits?: boolean | undefined;
    private skipNode;
    isParameter: boolean;
    constructor(reference?: ts__default.Node, parentContext?: Context);
    pushArgument(argumentType: BaseType | undefined): void;
    pushParameter(parameterName: string): void;
    setDefault(parameterName: string, argumentType: BaseType | undefined): void;
    getCacheKey(config?: Config): string;
    getArgument(parameterName: string): BaseType | undefined;
    getParameters(): readonly string[];
    getArguments(): readonly (BaseType | undefined)[];
    getReference(): ts__default.Node | undefined;
    getParentContext(): Context | undefined;
    hasParentContext(): boolean;
    hasParentContextRecreance(): boolean;
    setSkipNode(node: ts__default.Node): this;
    getSkipNode(): ts__default.Node;
}
interface NodeParser {
    createType(node: ts__default.Node, context: Context, reference?: ReferenceType): BaseType | undefined;
}

declare function hash(a: unknown): string | number;
declare function getKey(node: Node, context: Context): string;

declare function notUndefined<T>(x: T | undefined): x is T;

declare function preserveAnnotation(originalType: BaseType, newType: BaseType): BaseType;

declare class UnionType extends BaseType {
    private readonly types;
    constructor(types: readonly (BaseType | undefined)[]);
    getId(): string;
    getName(): string;
    getTypes(): BaseType[];
    normalize(): BaseType | undefined;
}

declare function removeUndefined(propertyType: UnionType): {
    numRemoved: number;
    newType: BaseType;
};

interface StringMap<T> {
    [key: string]: T;
}

declare function removeUnreachable(rootTypeDefinition: Definition | undefined, definitions: StringMap<Definition>): StringMap<Definition>;

declare function strip(input: string, chars?: Set<string>): string;

declare function symbolAtNode(node: ts__default.Node): ts__default.Symbol | undefined;
declare function localSymbolAtNode(node: ts__default.Node): ts__default.Symbol | undefined;

type LiteralValue = string | number | boolean;
declare class LiteralType extends BaseType {
    private value;
    constructor(value: LiteralValue);
    getId(): string;
    getValue(): LiteralValue;
}

declare abstract class PrimitiveType extends BaseType {
}

declare class StringType extends PrimitiveType {
    getId(): string;
}

declare function getTypeKeys(type: BaseType | undefined): LiteralType[];
declare function getTypeByKey(type: BaseType | undefined, index: LiteralType | StringType): BaseType | undefined;

type RawType = JSONSchema7Type;
type RawTypeName = JSONSchema7TypeName;

declare function typeName(value: RawType): RawTypeName;

declare function uniqueArray<T>(array: readonly T[]): T[];

declare function uniqueTypeArray<T extends BaseType>(types: T[]): T[];

interface Annotations {
    [name: string]: any;
}
declare class AnnotatedType extends BaseType {
    private type;
    private annotations;
    private nullable;
    constructor(type: BaseType, annotations: Annotations, nullable: boolean);
    getId(): string;
    getType(): BaseType;
    getAnnotations(): Annotations;
    isNullable(): boolean;
}

interface AnnotationsReader$1 {
    getAnnotations(node: ts__default.Node): Annotations | undefined;
}

interface SubNodeParser$1 extends NodeParser {
    supportsNode(node: ts__default.Node): boolean;
}

interface MutableParser$1 {
    addNodeParser(parser: SubNodeParser$1): MutableParser$1;
}

type Schema = JSONSchema7;

declare class AliasType extends BaseType {
    private id;
    private type;
    constructor(id: string, type: BaseType);
    getId(): string;
    getType(): BaseType;
}

declare class AnyType extends BaseType {
    getId(): string;
}

declare class ArrayType extends BaseType {
    private item;
    constructor(item: BaseType);
    getId(): string;
    getItem(): BaseType;
}

declare class BooleanType extends PrimitiveType {
    getId(): string;
}

declare class DefinitionType extends BaseType {
    private name;
    private type;
    constructor(name: string | undefined, type: BaseType);
    getId(): string;
    getName(): string;
    getType(): BaseType;
}

type EnumValue = string | boolean | number | null;
declare class EnumType extends BaseType {
    private id;
    private values;
    private types;
    constructor(id: string, values: readonly EnumValue[]);
    getId(): string;
    getValues(): readonly EnumValue[];
    getTypes(): BaseType[];
}

declare class FunctionParameter {
    private name;
    private type;
    private required;
    constructor(name: string, type: BaseType, required: boolean);
    getName(): string;
    getType(): BaseType;
    isRequired(): boolean;
}
declare class FunctionType extends BaseType {
    private id;
    private baseTypes;
    private properties;
    private additionalParameters;
    private returnType;
    constructor(id: string, baseTypes: BaseType[], properties: FunctionParameter[], additionalParameters: BaseType | boolean, returnType: BaseType);
    getId(): string;
    getReturnType(): BaseType;
    getBaseTypes(): BaseType[];
    getParameters(): FunctionParameter[];
    getAdditionalParameters(): BaseType | boolean;
}

declare class IntersectionType extends BaseType {
    private types;
    constructor(types: BaseType[]);
    getId(): string;
    getTypes(): BaseType[];
}

declare class NeverType extends BaseType {
    getId(): string;
}

declare class NullType extends PrimitiveType {
    getId(): string;
}

declare class NumberType extends PrimitiveType {
    getId(): string;
}

declare class ObjectProperty {
    private name;
    private type;
    private required;
    constructor(name: string, type: BaseType | undefined, required: boolean);
    getName(): string;
    getType(): BaseType | undefined;
    isRequired(): boolean;
}
declare class ObjectType extends BaseType {
    private id;
    private baseTypes;
    private properties;
    private additionalProperties;
    private nonPrimitive;
    constructor(id: string, baseTypes: readonly BaseType[], properties: readonly ObjectProperty[], additionalProperties: BaseType | boolean, nonPrimitive?: boolean);
    getId(): string;
    getBaseTypes(): readonly BaseType[];
    getProperties(): readonly ObjectProperty[];
    getAdditionalProperties(): BaseType | boolean;
    getNonPrimitive(): boolean;
}

declare class OptionalType extends BaseType {
    private item;
    constructor(item: BaseType);
    getId(): string;
    getType(): BaseType;
}

declare class RestType extends BaseType {
    private item;
    constructor(item: ArrayType);
    getId(): string;
    getType(): ArrayType;
}

declare class SymbolType extends PrimitiveType {
    getId(): string;
}

declare class TupleType extends BaseType {
    private types;
    constructor(types: readonly (BaseType | undefined)[]);
    getId(): string;
    getTypes(): readonly (BaseType | undefined)[];
}

declare class UndefinedType extends BaseType {
    getId(): string;
}

declare class UnknownType extends BaseType {
    getId(): string;
}

declare class VoidType extends BaseType {
    getId(): string;
}

interface AnnotationsReader {
    getAnnotations(node: ts__default.Node): Annotations | undefined;
}

declare class BasicAnnotationsReader implements AnnotationsReader {
    private extraTags?;
    private static requiresDollar;
    private static textTags;
    private static jsonTags;
    constructor(extraTags?: Set<string> | undefined);
    getAnnotations(node: ts__default.Node): Annotations | undefined;
    private parseJsDocTag;
    private parseJson;
}

declare class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    private typeChecker;
    constructor(typeChecker: ts__default.TypeChecker, extraTags?: Set<string>);
    getAnnotations(node: ts__default.Node): Annotations | undefined;
    isNullable(node: ts__default.Node): boolean;
    private getDescriptionAnnotation;
    private getTypeAnnotation;
    private getExampleAnnotation;
}

interface SubTypeFormatter extends TypeFormatter {
    supportsType(type: BaseType): boolean;
}

interface MutableTypeFormatter {
    addTypeFormatter(formatter: SubTypeFormatter): MutableTypeFormatter;
}

declare class ChainTypeFormatter implements SubTypeFormatter, MutableTypeFormatter {
    protected typeFormatters: SubTypeFormatter[];
    constructor(typeFormatters: SubTypeFormatter[]);
    addTypeFormatter(typeFormatter: SubTypeFormatter): this;
    supportsType(type: BaseType): boolean;
    getDefinition(type: BaseType): Definition;
    getChildren(type: BaseType): BaseType[];
    protected getTypeFormatter(type: BaseType): SubTypeFormatter;
}

declare class CircularReferenceTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: SubTypeFormatter;
    protected definition: Map<BaseType, Definition>;
    protected children: Map<BaseType, BaseType[]>;
    constructor(childTypeFormatter: SubTypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: BaseType): Definition;
    getChildren(type: BaseType): BaseType[];
}

declare class AliasTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: AliasType): boolean;
    getDefinition(type: AliasType): Definition;
    getChildren(type: AliasType): BaseType[];
}

declare function makeNullable(def: Definition): Definition;
declare class AnnotatedTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: AnnotatedType): boolean;
    getDefinition(type: AnnotatedType): Definition;
    getChildren(type: AnnotatedType): BaseType[];
}

declare class AnyTypeFormatter implements SubTypeFormatter {
    private config;
    constructor(config: Config);
    supportsType(type: AnyType): boolean;
    getDefinition(type: AnyType): Definition;
    getChildren(type: AnyType): BaseType[];
}

declare class ArrayTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: ArrayType): boolean;
    getDefinition(type: ArrayType): Definition;
    getChildren(type: ArrayType): BaseType[];
}

declare class BooleanTypeFormatter implements SubTypeFormatter {
    supportsType(type: BooleanType): boolean;
    getDefinition(type: BooleanType): Definition;
    getChildren(type: BooleanType): BaseType[];
}

declare class DefinitionTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    protected encodeRefs: boolean;
    constructor(childTypeFormatter: TypeFormatter, encodeRefs: boolean);
    supportsType(type: DefinitionType): boolean;
    getDefinition(type: DefinitionType): Definition;
    getChildren(type: DefinitionType): BaseType[];
}

declare class EnumTypeFormatter implements SubTypeFormatter {
    supportsType(type: EnumType): boolean;
    getDefinition(type: EnumType): Definition;
    getChildren(type: EnumType): BaseType[];
}

declare class IntersectionTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: IntersectionType): boolean;
    getDefinition(type: IntersectionType): Definition;
    getChildren(type: IntersectionType): BaseType[];
}

declare class LiteralTypeFormatter implements SubTypeFormatter {
    supportsType(type: LiteralType): boolean;
    getDefinition(type: LiteralType): Definition;
    getChildren(type: LiteralType): BaseType[];
}

declare class LiteralUnionTypeFormatter implements SubTypeFormatter {
    supportsType(type: UnionType): boolean;
    getDefinition(type: UnionType): Definition;
    getChildren(type: UnionType): BaseType[];
    protected isLiteralUnion(type: UnionType): boolean;
    protected getLiteralValue(value: LiteralType | NullType): string | number | boolean | null;
    protected getLiteralType(value: LiteralType | NullType): RawTypeName;
}

declare class NeverTypeFormatter implements SubTypeFormatter {
    supportsType(type: NeverType): boolean;
    getDefinition(type: NeverType): Definition;
    getChildren(type: NeverType): BaseType[];
}

declare class NullTypeFormatter implements SubTypeFormatter {
    supportsType(type: NullType): boolean;
    getDefinition(type: NullType): Definition;
    getChildren(type: NullType): BaseType[];
}

declare class NumberTypeFormatter implements SubTypeFormatter {
    supportsType(type: NumberType): boolean;
    getDefinition(type: NumberType): Definition;
    getChildren(type: NumberType): BaseType[];
}

declare class ObjectTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: ObjectType): boolean;
    getDefinition(type: ObjectType): Definition;
    getChildren(type: ObjectType): BaseType[];
    protected getObjectDefinition(type: ObjectType): Definition;
    protected prepareObjectProperty(property: ObjectProperty): ObjectProperty;
}

declare class OptionalTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: OptionalType): boolean;
    getDefinition(type: OptionalType): Definition;
    getChildren(type: OptionalType): BaseType[];
}

declare class PrimitiveUnionTypeFormatter implements SubTypeFormatter {
    supportsType(type: UnionType): boolean;
    getDefinition(type: UnionType): Definition;
    getChildren(type: UnionType): BaseType[];
    protected isPrimitiveUnion(type: UnionType): boolean;
    protected getPrimitiveType(item: BaseType): RawTypeName;
}

declare class ReferenceTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    protected encodeRefs: boolean;
    constructor(childTypeFormatter: TypeFormatter, encodeRefs: boolean);
    supportsType(type: ReferenceType): boolean;
    getDefinition(type: ReferenceType): Definition;
    getChildren(type: ReferenceType): BaseType[];
}

declare class RestTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: RestType): boolean;
    getDefinition(type: RestType): Definition;
    getChildren(type: RestType): BaseType[];
}

declare class StringTypeFormatter implements SubTypeFormatter {
    supportsType(type: StringType): boolean;
    getDefinition(type: StringType): Definition;
    getChildren(type: StringType): BaseType[];
}

declare class SymbolTypeFormatter implements SubTypeFormatter {
    supportsType(type: SymbolType): boolean;
    getDefinition(type: SymbolType): Definition;
    getChildren(type: SymbolType): BaseType[];
}

declare class TupleTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: TupleType): boolean;
    getDefinition(type: TupleType): Definition;
    getChildren(type: TupleType): BaseType[];
}

declare class UndefinedTypeFormatter implements SubTypeFormatter {
    supportsType(type: UndefinedType): boolean;
    getDefinition(type: UndefinedType): Definition;
    getChildren(type: UndefinedType): BaseType[];
}

declare class UnionTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: UnionType): boolean;
    getDefinition(type: UnionType): Definition;
    getChildren(type: UnionType): BaseType[];
}

declare class UnknownTypeFormatter implements SubTypeFormatter {
    private config;
    constructor(config: Config);
    supportsType(type: UnknownType): boolean;
    getDefinition(type: UnknownType): Definition;
    getChildren(type: UnknownType): BaseType[];
}

declare class VoidTypeFormatter implements SubTypeFormatter {
    supportsType(type: VoidType): boolean;
    getDefinition(type: VoidType): Definition;
    getChildren(type: VoidType): BaseType[];
}

interface SubNodeParser extends NodeParser {
    supportsNode(node: ts__default.Node): boolean;
}

interface MutableParser {
    addNodeParser(parser: SubNodeParser): MutableParser;
}

declare class ChainNodeParser implements SubNodeParser, MutableParser {
    protected typeChecker: ts__default.TypeChecker;
    protected nodeParsers: SubNodeParser[];
    private config;
    protected readonly typeCaches: WeakMap<ts__default.Node, Map<string, BaseType | undefined>>;
    constructor(typeChecker: ts__default.TypeChecker, nodeParsers: SubNodeParser[], config: Config);
    addNodeParser(nodeParser: SubNodeParser): this;
    supportsNode(node: ts__default.Node): boolean;
    createType(node: ts__default.Node, context: Context, reference?: ReferenceType): BaseType | undefined;
    protected getNodeParser(node: ts__default.Node, context: Context): SubNodeParser;
}

declare class ExposeNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected subNodeParser: SubNodeParser;
    protected expose: "all" | "none" | "export";
    protected jsDoc: "none" | "extended" | "basic";
    private config;
    constructor(typeChecker: ts__default.TypeChecker, subNodeParser: SubNodeParser, expose: "all" | "none" | "export", jsDoc: "none" | "extended" | "basic", config: Config);
    supportsNode(node: ts__default.Node): boolean;
    createType(node: ts__default.Node, context: Context, reference?: ReferenceType): BaseType | undefined;
    protected isExportNode(node: ts__default.Node): boolean;
    protected getDefinitionName(node: ts__default.Node, context: Context): string;
}

declare class TopRefNodeParser implements NodeParser {
    protected childNodeParser: NodeParser;
    protected fullName: string;
    protected topRef: boolean;
    constructor(childNodeParser: NodeParser, fullName: string, topRef: boolean);
    setFullName(fullName: string): void;
    createType(node: ts__default.Node, context: Context): BaseType | undefined;
}

declare class CircularReferenceNodeParser implements SubNodeParser {
    protected childNodeParser: SubNodeParser;
    private config;
    protected circular: Map<string, BaseType>;
    constructor(childNodeParser: SubNodeParser, config: Config);
    supportsNode(node: ts__default.Node): boolean;
    createType(node: ts__default.Node, context: Context): BaseType | undefined;
}

declare class AnnotatedNodeParser implements SubNodeParser {
    protected childNodeParser: SubNodeParser;
    protected annotationsReader: AnnotationsReader;
    constructor(childNodeParser: SubNodeParser, annotationsReader: AnnotationsReader);
    supportsNode(node: ts__default.Node): boolean;
    createType(node: ts__default.Node, context: Context, reference?: ReferenceType): BaseType | undefined;
    protected getNullable(annotatedNode: ts__default.Node): boolean;
    protected getAnnotatedNode(node: ts__default.Node): ts__default.Node;
}

declare class AnyTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class ArrayLiteralExpressionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.ArrayLiteralExpression): boolean;
    createType(node: ts__default.ArrayLiteralExpression, context: Context): BaseType | undefined;
}

declare class ArrayNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.ArrayTypeNode): boolean;
    createType(node: ts__default.ArrayTypeNode, context: Context): BaseType | undefined;
}

declare class AsExpressionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.AsExpression): boolean;
    createType(node: ts__default.AsExpression, context: Context): BaseType | undefined;
}

declare class BooleanLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.BooleanLiteral): boolean;
    createType(node: ts__default.BooleanLiteral, context: Context): BaseType;
}

declare class BooleanTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class CallExpressionParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts__default.CallExpression): boolean;
    createType(node: ts__default.CallExpression, context: Context): BaseType;
    protected createSubContext(node: ts__default.CallExpression, parentContext: Context): Context;
}

declare class ConditionalTypeNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts__default.ConditionalTypeNode): boolean;
    createType(node: ts__default.ConditionalTypeNode, context: Context): BaseType | undefined;
    protected getTypeParameterName(node: ts__default.TypeNode): string | null;
    protected createSubContext(node: ts__default.ConditionalTypeNode, checkTypeParameterName: string, narrowedCheckType: BaseType, parentContext: Context): Context;
}

declare class EnumNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    private config;
    constructor(typeChecker: ts__default.TypeChecker, config: Config);
    supportsNode(node: ts__default.EnumDeclaration | ts__default.EnumMember): boolean;
    createType(node: ts__default.EnumDeclaration | ts__default.EnumMember, context: Context): BaseType;
    protected getMemberValue(member: ts__default.EnumMember, index: number): EnumValue;
    protected parseInitializer(initializer: ts__default.Node): EnumValue;
}

declare class ExpressionWithTypeArgumentsNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    private config;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser, config: Config);
    supportsNode(node: ts__default.ExpressionWithTypeArguments): boolean;
    createType(node: ts__default.ExpressionWithTypeArguments, context: Context): BaseType | undefined;
    protected createSubContext(node: ts__default.ExpressionWithTypeArguments, parentContext: Context): Context;
}

declare class FunctionNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    private config;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser, config: Config);
    supportsNode(node: ts.FunctionTypeNode | ts.FunctionDeclaration | ts.MethodSignature): boolean;
    private pushParameters;
    createType(node: ts.FunctionDeclaration, context: Context): BaseType;
    private getParameters;
    private getAdditionalParameters;
    private getTypeId;
}

declare class FunctionParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.ArrowFunction | ts__default.FunctionDeclaration | ts__default.FunctionExpression): boolean;
    createType(node: ts__default.FunctionDeclaration | ts__default.ArrowFunction, context: Context): DefinitionType;
    getTypeName(node: ts__default.FunctionDeclaration | ts__default.ArrowFunction, context: Context): string;
}

declare class HiddenNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    constructor(typeChecker: ts__default.TypeChecker);
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType | undefined;
}

declare class IndexedAccessTypeNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.IndexedAccessTypeNode): boolean;
    createType(node: ts__default.IndexedAccessTypeNode, context: Context): BaseType | undefined;
}

declare class InterfaceAndClassNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    protected readonly additionalProperties: boolean;
    private config;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser, additionalProperties: boolean, config: Config);
    supportsNode(node: ts__default.InterfaceDeclaration | ts__default.ClassDeclaration): boolean;
    createType(node: ts__default.InterfaceDeclaration | ts__default.ClassDeclaration, context: Context, reference?: ReferenceType): BaseType | undefined;
    protected getArrayItemType(node: ts__default.InterfaceDeclaration | ts__default.ClassDeclaration): ts__default.TypeNode | null;
    protected getBaseTypes(node: ts__default.InterfaceDeclaration | ts__default.ClassDeclaration, context: Context): BaseType[];
    protected getProperties(node: ts__default.InterfaceDeclaration | ts__default.ClassDeclaration, context: Context): ObjectProperty[] | undefined;
    protected getAdditionalProperties(node: ts__default.InterfaceDeclaration | ts__default.ClassDeclaration, context: Context): BaseType | boolean;
    protected getTypeId(node: ts__default.Node, context: Context): string;
    protected getPropertyName(propertyName: PropertyName): string;
}

declare class IntersectionNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts__default.IntersectionTypeNode): boolean;
    createType(node: ts__default.IntersectionTypeNode, context: Context): BaseType | undefined;
}
declare function translate(types: BaseType[]): BaseType | undefined;

declare const intrinsicMethods: Record<string, ((v: string) => string) | undefined>;
declare class IntrinsicNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType | undefined;
}

declare class LiteralNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.LiteralTypeNode): boolean;
    createType(node: ts__default.LiteralTypeNode, context: Context): BaseType | undefined;
}

declare class MappedTypeNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    protected readonly additionalProperties: boolean;
    private config;
    constructor(childNodeParser: NodeParser, additionalProperties: boolean, config: Config);
    supportsNode(node: ts__default.MappedTypeNode): boolean;
    createType(node: ts__default.MappedTypeNode, context: Context): BaseType | undefined;
    protected mapKey(node: ts__default.MappedTypeNode, rawKey: LiteralType, context: Context): LiteralType;
    protected getProperties(node: ts__default.MappedTypeNode, keyListType: UnionType, context: Context): ObjectProperty[];
    protected getValues(node: ts__default.MappedTypeNode, keyListType: EnumType, context: Context): ObjectProperty[];
    protected getAdditionalProperties(node: ts__default.MappedTypeNode, keyListType: UnionType, context: Context): BaseType | boolean;
    protected createSubContext(node: ts__default.MappedTypeNode, key: LiteralType | StringType, parentContext: Context): Context;
}

declare class NeverTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType | undefined;
}

declare class NullLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.NullLiteral): boolean;
    createType(node: ts__default.NullLiteral, context: Context): BaseType;
}

declare class NumberLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.NumericLiteral): boolean;
    createType(node: ts__default.NumericLiteral, context: Context): BaseType;
}

declare class NumberTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class ObjectLiteralExpressionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.ObjectLiteralExpression): boolean;
    createType(node: ts__default.ObjectLiteralExpression, context: Context): BaseType | undefined;
}

declare class ObjectTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class OptionalTypeNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.OptionalTypeNode): boolean;
    createType(node: ts__default.OptionalTypeNode, context: Context): BaseType | undefined;
}

declare class ParameterParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.ParameterDeclaration): boolean;
    createType(node: ts__default.FunctionTypeNode, context: Context): BaseType | undefined;
}

declare class ParenthesizedNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.ParenthesizedTypeNode): boolean;
    createType(node: ts__default.ParenthesizedTypeNode, context: Context): BaseType | undefined;
}

declare class PrefixUnaryExpressionNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.PrefixUnaryExpression): boolean;
    createType(node: ts__default.PrefixUnaryExpression, context: Context): BaseType;
}

declare class PropertyAccessExpressionParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.PropertyAccessExpression): boolean;
    createType(node: ts.PropertyAccessExpression, context: Context): BaseType | undefined;
}

declare class RestTypeNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.RestTypeNode): boolean;
    createType(node: ts__default.RestTypeNode, context: Context): BaseType;
}

declare class StringLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.StringLiteral): boolean;
    createType(node: ts__default.StringLiteral, context: Context): BaseType;
}

declare class StringTemplateLiteralNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.NoSubstitutionTemplateLiteral | ts__default.TemplateLiteralTypeNode): boolean;
    createType(node: ts__default.NoSubstitutionTemplateLiteral | ts__default.TemplateLiteralTypeNode, context: Context): BaseType;
}

declare class StringTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class SymbolTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class TupleNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts__default.TupleTypeNode): boolean;
    createType(node: ts__default.TupleTypeNode, context: Context): BaseType;
}

declare class TypeAliasNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    private config;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser, config: Config);
    supportsNode(node: ts__default.TypeAliasDeclaration): boolean;
    createType(node: ts__default.TypeAliasDeclaration, context: Context, reference?: ReferenceType): BaseType | undefined;
    protected getTypeId(node: ts__default.TypeAliasDeclaration, context: Context): string;
    protected getTypeName(node: ts__default.TypeAliasDeclaration, context: Context): string;
}

declare class TypeLiteralNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    protected readonly additionalProperties: boolean;
    private config;
    constructor(childNodeParser: NodeParser, additionalProperties: boolean, config: Config);
    supportsNode(node: ts__default.TypeLiteralNode): boolean;
    createType(node: ts__default.TypeLiteralNode, context: Context, reference?: ReferenceType): BaseType | undefined;
    protected getProperties(node: ts__default.TypeLiteralNode, context: Context): ObjectProperty[] | undefined;
    protected getAdditionalProperties(node: ts__default.TypeLiteralNode, context: Context): BaseType | boolean;
    protected getTypeId(node: ts__default.Node, context: Context): string;
}

declare class TypeofNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    private config;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser, config: Config);
    supportsNode(node: ts__default.TypeQueryNode): boolean;
    createType(node: ts__default.TypeQueryNode, context: Context, reference?: ReferenceType): BaseType | undefined;
    protected createObjectFromEnum(node: ts__default.EnumDeclaration, context: Context, reference?: ReferenceType, parentNode?: ts__default.Node): ObjectType;
}

declare class TypeOperatorNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts__default.TypeOperatorNode): boolean;
    createType(node: ts__default.TypeOperatorNode, context: Context): BaseType;
}

declare class TypeReferenceNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    private config;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser, config: Config);
    supportsNode(node: ts__default.TypeReferenceNode): boolean;
    createType(node: ts__default.TypeReferenceNode, context: Context): BaseType | undefined;
    protected createSubContext(node: ts__default.TypeReferenceNode, parentContext: Context): Context;
}

declare class UndefinedLiteralNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class UndefinedTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class UnionNodeParser implements SubNodeParser {
    protected typeChecker: ts__default.TypeChecker;
    protected childNodeParser: NodeParser;
    private config;
    constructor(typeChecker: ts__default.TypeChecker, childNodeParser: NodeParser, config: Config);
    supportsNode(node: ts__default.UnionTypeNode): boolean;
    createType(node: ts__default.UnionTypeNode, context: Context): BaseType | undefined;
}

declare class UnknownTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class VoidTypeNodeParser implements SubNodeParser {
    supportsNode(node: ts__default.KeywordTypeNode): boolean;
    createType(node: ts__default.KeywordTypeNode, context: Context): BaseType;
}

declare class SchemaGenerator {
    protected readonly program: ts__default.Program;
    protected readonly nodeParser: NodeParser;
    protected readonly typeFormatter: TypeFormatter;
    protected readonly config?: Config | undefined;
    constructor(program: ts__default.Program, nodeParser: NodeParser, typeFormatter: TypeFormatter, config?: Config | undefined);
    createSchema(fullName: string | undefined): Schema;
    createSchemaFromNodes(rootNodes: ts__default.Node[]): Schema;
    protected getRootNodes(fullName: string | undefined, exposeAll?: boolean): ts__default.Node[];
    protected findNamedNode(fullName: string): ts__default.Node;
    protected getRootTypeDefinition(rootType: BaseType): Definition;
    protected appendRootChildDefinitions(rootType: BaseType, childDefinitions: StringMap<Definition>): void;
    protected partitionFiles(): {
        projectFiles: ts__default.SourceFile[];
        externalFiles: ts__default.SourceFile[];
    };
    protected appendTypes(sourceFiles: readonly ts__default.SourceFile[], typeChecker: ts__default.TypeChecker, types: Map<string, ts__default.Node>, exposeAll?: boolean): void;
    protected inspectNode(node: ts__default.Node, typeChecker: ts__default.TypeChecker, allTypes: Map<string, ts__default.Node>, exposeAll?: boolean): void;
    protected isExportType(node: ts__default.Node): boolean;
    protected isGenericType(node: ts__default.TypeAliasDeclaration): boolean;
    protected getFullName(node: ts__default.Node, typeChecker: ts__default.TypeChecker): string;
    private createSchemaByNodes;
    createSchemaByFilter(filterNode: (node: ts__default.Node) => boolean): Schema | null;
    createSchemaByNodeKind(nodeKinds: ts__default.SyntaxKind | ts__default.SyntaxKind[]): Schema | null;
    private getRootNodesByKind;
    private getRootChildDefinitions;
}

type FormatterAugmentor = (formatter: MutableTypeFormatter, circularReferenceTypeFormatter: CircularReferenceTypeFormatter) => void;
declare function createFormatter(config: Config, augmentor?: FormatterAugmentor): TypeFormatter;

declare function createGenerator(config: Config): SchemaGenerator;

type ParserAugmentor = (parser: MutableParser) => void;
declare function createParser(program: ts__default.Program, config: Config, augmentor?: ParserAugmentor): NodeParser;

declare function createProgram(config: Config, oldProgram?: ts__default.Program): ts__default.Program;

export { AliasType, AliasTypeFormatter, AnnotatedNodeParser, AnnotatedType, AnnotatedTypeFormatter, Annotations, AnnotationsReader$1 as AnnotationsReader, AnyType, AnyTypeFormatter, AnyTypeNodeParser, ArrayLiteralExpressionNodeParser, ArrayNodeParser, ArrayType, ArrayTypeFormatter, AsExpressionNodeParser, BaseError, BaseType, BasicAnnotationsReader, BooleanLiteralNodeParser, BooleanType, BooleanTypeFormatter, BooleanTypeNodeParser, CallExpressionParser, ChainNodeParser, ChainTypeFormatter, CircularReferenceNodeParser, CircularReferenceTypeFormatter, ConditionalTypeNodeParser, Config, Context, DEFAULT_CONFIG, Definition, DefinitionType, DefinitionTypeFormatter, DiagnosticError, EnumNodeParser, EnumType, EnumTypeFormatter, EnumValue, ExposeNodeParser, ExpressionWithTypeArgumentsNodeParser, ExtendedAnnotationsReader, FormatterAugmentor, FunctionNodeParser, FunctionParameter, FunctionParser, FunctionType, HiddenNodeParser, IndexedAccessTypeNodeParser, InterfaceAndClassNodeParser, IntersectionNodeParser, IntersectionType, IntersectionTypeFormatter, IntrinsicNodeParser, JSONSchemaDefinition, LiteralNodeParser, LiteralType, LiteralTypeFormatter, LiteralUnionTypeFormatter, LiteralValue, LogicError, MappedTypeNodeParser, MutableParser$1 as MutableParser, MutableTypeFormatter, NeverType, NeverTypeFormatter, NeverTypeNodeParser, NoRootNamesError, NoRootTypeError, NoTSConfigError, NodeParser, NullLiteralNodeParser, NullType, NullTypeFormatter, NumberLiteralNodeParser, NumberType, NumberTypeFormatter, NumberTypeNodeParser, ObjectLiteralExpressionNodeParser, ObjectProperty, ObjectType, ObjectTypeFormatter, ObjectTypeNodeParser, OptionalType, OptionalTypeFormatter, OptionalTypeNodeParser, ParameterParser, ParenthesizedNodeParser, ParserAugmentor, PrefixUnaryExpressionNodeParser, PrimitiveType, PrimitiveUnionTypeFormatter, PropertyAccessExpressionParser, ReferenceType, ReferenceTypeFormatter, RestType, RestTypeFormatter, RestTypeNodeParser, Schema, SchemaGenerator, StringLiteralNodeParser, StringMap, StringTemplateLiteralNodeParser, StringType, StringTypeFormatter, StringTypeNodeParser, SubNodeParser, SubTypeFormatter, SymbolType, SymbolTypeFormatter, SymbolTypeNodeParser, TopRefNodeParser, TupleNodeParser, TupleType, TupleTypeFormatter, TypeAliasNodeParser, TypeFormatter, TypeLiteralNodeParser, TypeOperatorNodeParser, TypeReferenceNodeParser, TypeofNodeParser, UndefinedLiteralNodeParser, UndefinedType, UndefinedTypeFormatter, UndefinedTypeNodeParser, UnionNodeParser, UnionType, UnionTypeFormatter, UnknownNodeError, UnknownType, UnknownTypeError, UnknownTypeFormatter, UnknownTypeNodeParser, VoidType, VoidTypeFormatter, VoidTypeNodeParser, createFormatter, createGenerator, createParser, createProgram, deepMerge, derefAnnotatedType, derefType, extractLiterals, formatError, getAllOfDefinitionReducer, getKey, getTypeByKey, getTypeKeys, hasJsDocTag, hasModifier, hash, intersectionOfArrays, intrinsicMethods, isAssignableTo, isNodeHidden, isPublic, isStatic, localSymbolAtNode, makeNullable, narrowType, notUndefined, preserveAnnotation, removeUndefined, removeUnreachable, strip, symbolAtNode, translate, typeName, uniqueArray, uniqueTypeArray };
