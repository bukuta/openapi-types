export interface ApiSpec extends ExtensionFields {
    openapi: string;
    info: InfoObject;
    servers?: ServerObject[];
    paths: MapOf<PathItemObject>;
    components?: ComponentsObject;
    security?: SecurityRequirementObject;
    tags?: Tag[];
    externalDocs?: ExternalDocumentationObject;
}
export interface InfoObject extends ExtensionFields {
    title: string;
    version: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
}
export interface ServerObject extends ExtensionFields {
    url: string;
    description?: string;
    variables?: MapOf<ServerVariableObject>;
}
export declare type PathItemObject = ({
    summary?: string;
    description?: string;
    servers?: ServerObject[];
    parameters?: (ParameterObject | ReferenceObject)[];
} & MethodsOperationObject) | ReferenceObject;
export interface ComponentsObject extends ExtensionFields {
    schemas?: MapOf<SchemaObject | ReferenceObject>;
    responses?: MapOf<ResponseObject | ReferenceObject>;
    parameters?: MapOf<ParameterObject | ReferenceObject>;
    examples?: {
        [media in MediaTypes]?: ExampleObject | ReferenceObject;
    };
    requestBodies?: MapOf<RequestBodyObject | ReferenceObject>;
    headers?: MapOf<HeaderObject | ReferenceObject>;
    securitySchemes?: MapOf<SecuritySchemeObject | ReferenceObject>;
    links?: MapOf<LinkObject | ReferenceObject>;
    callbacks?: MapOf<CallbackObject | ReferenceObject>;
}
export interface SecurityRequirementObject extends ExtensionFields {
    [name: string]: string[];
}
export interface Tag extends ExtensionFields {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}
export interface ExternalDocumentationObject {
    url: string;
    description?: string;
}
export interface ContactObject extends ExtensionFields {
    name?: string;
    url?: string;
    email?: string;
}
export interface LicenseObject extends ExtensionFields {
    name: string;
    url?: string;
}
export interface ServerVariableObject extends ExtensionFields {
    default: string;
    enum?: string[];
    description?: string;
}
export declare type ParameterObject = HeaderAndParameterObjectBase & {
    name: string;
} & ({
    in: "query" | "header" | "cookie";
    required?: boolean;
} | {
    in: 'path';
    required: true;
}) & ({
    schema: SchemaObject | ReferenceObject;
    style?: 'simple' | "form" | "matrix" | "label" | "spaceDelimited" | "pipeDelimited" | "deepObject";
} | {
    content: {
        [media in MediaTypes]?: MediaTypeObject;
    };
}) & ExtensionFields;
export interface ReferenceObject extends ExtensionFields {
    $ref: string;
}
declare type HttpMethods = "get" | "post" | "put" | "patch" | "delete" | "head" | "options" | "trace";
declare type MethodsOperationObject = {
    [k in HttpMethods]?: OperationObject;
} & ExtensionFields;
export declare type SchemaObject = SchemaTypeNumber | SchemaTypeString | SchemaTypeBoolean | SchemaTypeArray | SchemaTypeObject | {
    anyOf: SchemaObject[];
} | {
    allOf: SchemaObject[];
} | {
    oneOf: SchemaObject[];
} | {
    not: SchemaObject;
};
export interface ResponseObject extends ExtensionFields {
    description: string;
    headers?: MapOf<HeaderObject | ReferenceObject>;
    content?: {
        [media in MediaTypes]?: MediaTypeObject;
    };
    links?: MapOf<LinkObject | ReferenceObject>;
}
export interface ExampleObject extends ExtensionFields {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
}
export interface RequestBodyObject extends ExtensionFields {
    content: {
        [media in MediaTypes]?: MediaTypeObject;
    };
    description?: string;
    required?: boolean;
}
export declare type HeaderObject = HeaderAndParameterObjectBase & {
    required?: boolean;
    schema: SchemaObject | ReferenceObject;
    style?: 'simple' | "form" | "matrix" | "label" | "spaceDelimited" | "pipeDelimited" | "deepObject";
} & ExtensionFields;
export declare type SecuritySchemeObject = {
    description?: string;
} & ExtensionFields & (SecuritySchemeObjectHttp | SecuritySchemeObjectApiKey | SecuritySchemeObjectOAuth2 | SecuritySchemeObjectOpenIdConnect);
export interface LinkObject extends ExtensionFields {
    operationRef?: string;
    operationId?: string;
    parameters?: MapOf<any | KeyExpression>;
    requestBody?: KeyExpression | any;
    description?: string;
    server?: ServerObject;
}
declare type CallbackObject = {
    [expression in KeyExpression]?: PathItemObject;
} & ExtensionFields;
export interface MediaTypeObject extends ExtensionFields {
    schema?: SchemaObject | ReferenceObject;
    example?: any;
    examples?: {
        [media in MediaTypes]?: ExampleObject | ReferenceObject;
    };
    encoding?: MapOf<EncodingObject>;
}
export interface OperationObject extends ExtensionFields {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    responses: {
        [code in keyof HTTPStatusCode | 'default']?: ResponseObject;
    };
    callbacks?: MapOf<CallbackObject | ReferenceObject>;
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
}
export interface SchemaTypeNumber extends SchemaTypeBase {
    type: "number" | "integer";
    format?: DataFormat;
    minimun?: number;
    exclusiveMinimum?: boolean;
    maximum?: number;
    exclusiveMaximum?: boolean;
    multipleOf?: number;
    default?: 0;
}
export interface SchemaTypeString extends SchemaTypeBase {
    type: "string";
    format?: DataFormat;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    default?: string;
}
export interface SchemaTypeBoolean extends SchemaTypeBase {
    type: "boolean";
    default?: false;
}
export interface SchemaTypeArray extends SchemaTypeBase {
    type: 'array';
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    xml?: XMLObject;
    items: SchemaObject | ReferenceObject;
    default?: [];
}
export interface SchemaTypeObject extends SchemaTypeBase {
    type?: "object";
    additionalProperties?: boolean | SchemaObject;
    minProperties?: number;
    maxProperties?: number;
    required?: string[];
    properties?: {
        [field: string]: SchemaObject | ReferenceObject;
    };
    default?: {};
    xml?: XMLObject;
}
export declare type HeaderAndParameterObjectBase = {
    description?: string;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    explode?: boolean;
    allowReserved?: boolean;
    example?: any;
    examples?: {
        [media in MediaTypes]?: ExampleObject | ReferenceObject;
    };
} & ExtensionFields;
interface SecuritySchemeObjectHttp {
    type: 'http';
    scheme?: string;
    bearerFormat?: string;
}
interface SecuritySchemeObjectApiKey {
    type: 'apiKey';
    name: string;
    in: string;
}
interface SecuritySchemeObjectOAuth2 {
    type: 'oauth2';
    flows: OAuthFlowsObject;
}
interface SecuritySchemeObjectOpenIdConnect {
    type: 'openIdConnect';
    openIdConnectUrl: string;
}
export interface EncodingObject extends ExtensionFields {
    contentType: MediaTypes;
    headers: {
        [header in keyof Headers]?: HeaderObject | ReferenceObject;
    };
    style: string;
    explode: boolean;
    allowReserved: boolean;
}
export interface XMLObject extends ExtensionFields {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
}
declare type OAuthFlowsObject = {
    implicit?: {
        authorizationUrl: string;
        refreshUrl?: string;
        scopes: {
            [scope: string]: string;
        };
    } & ExtensionFields;
    password?: {
        tokenUrl: string;
        refreshUrl?: string;
        scopes: {
            [scope: string]: string;
        };
    } & ExtensionFields;
    clientCredentials?: {
        tokenUrl: string;
        refreshUrl?: string;
        scopes: {
            [scope: string]: string;
        };
    } & ExtensionFields;
    authorizationCode?: {
        authorizationUrl: string;
        tokenUrl: string;
        refreshUrl?: string;
        scopes: {
            [scope: string]: string;
        };
    } & ExtensionFields;
};
declare type DataFormat = "int32" | "int64" | "float" | "double" | "byte" | "binary" | "date" | "date-time" | "password";
export interface SchemaTypeBase extends ExtensionFields {
    title?: string;
    description?: string;
    nullable?: boolean;
    readonly?: boolean;
    writeOnly?: boolean;
    enum?: any[];
    example?: any;
}
interface ExtensionFields {
    [name: string]: any;
}
interface MapOf<V> {
    [key: string]: V;
}
declare type MediaTypes = "*/*" | "text/plain" | "text/html" | "text/css" | "image/jpeg" | "image/png" | "image/svg+xml" | "image/gif" | "audio/mpeg" | "audio/ogg" | "audio/*" | "video/mp4" | "application/*" | "application/xml" | "application/json" | "application/javascript" | "application/ecmascript" | "application/octet-stream" | "multipart/form-data" | "multipart/byteranges" | "application/x-www-form-urlencoded";
interface Headers {
    'Accept': string;
    'Accept-CH': string;
    "Accept-Charset": string;
    "Accept-Features": string;
    "Accept-Encoding": string;
    "Accept-Language": string;
    "Accept-Ranges": string;
    "Access-Control-Allow-Credentials": string;
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Max-Age": string;
    "Access-Control-Expose-Headers": string;
    "Access-Control-Request-Method": string;
    "Access-Control-Request-Headers": string;
    "Age": string;
    "Allow": string;
    "Alternates": string;
    "Authorization": string;
    "Cache-Control": string;
    "Connection": string;
    "Content-Encoding": string;
    "Content-Language": string;
    "Content-Length": string;
    "Content-Location": string;
    "Content-MD5": string;
    "Content-Range": string;
    "Content-Security-Policy": string;
    "Content-Type": MediaTypes | string;
    "Cookie": string;
    "DNT": string;
    "Date": string;
    "ETag": string;
    "Expect": string;
    "Expires": string;
    "From": string;
    "Host": string;
    "If-Match": string;
    "If-Modified-Since": string;
    "If-None-Match": string;
    "If-Range": string;
    "If-Unmodified-Since": string;
    "Last-Event-ID": string;
    "Last-Modified": string;
    "Link": string;
    "Location": string;
    "Max-Forwards": string;
    "Negotiate": string;
    "Origin": string;
    "Pragma": string;
    "Proxy-Authenticate": string;
    "Proxy-Authorization": string;
    "Range": string;
    "Referer": string;
    "Retry-After": string;
    "Sec-Websocket-Extensions": string;
    "Sec-Websocket-Key": string;
    "Sec-Websocket-Origin": string;
    "Sec-Websocket-Protocol": string;
    "Sec-Websocket-Version": string;
    "Server": string;
    "Set-Cookie": string;
    "Set-Cookie2": string;
    "Strict-Transport-Security": string;
    "TCN": string;
    "TE": string;
    "Trailer": string;
    "Transfer-Encoding": string;
    "Upgrade": string;
    "User-Agent": string;
    "Variant-Vary": string;
    "Vary": string;
    "Via": string;
    "Warning": string;
    "WWW-Authenticate": string;
    "X-Content-Duration": string;
    "X-Content-Security-Policy": string;
    "X-DNSPrefetch-Control": string;
    "X-Frame-Options": string;
    "X-Requested-With": string;
}
interface HTTPStatusCode {
    /**
     * 请求前检查与探测，比如不确定当前服务器是否可以处理接下来的请求，或者是否有权限，或者请求数据很大分多个请求
     * 可以发一个请求，带上部分信息，在请求头中设置Expect: 100-continue,
     * 服务器检查当前用户是否合法，自己是否可以继续处理，返回100后，客户端重新请求且不带Expect: 100-continue, 服务器接收并处理
     */
    100: string;
    /**
     * 一般成功响应
     */
    200: string;
    /**
     * 创建资源成功响应
     */
    201: string;
    /**
     * 已处理，但没有返回值，已删除，已更新等等
     */
    204: string;
    /**
     * 已处理，但没有返回值，且客户端需要重置视图
     */
    /**
     * 对于带 Range 请求的响应
     */
    206: string;
    301: string;
    302: string;
    304: string;
    /**
     * 一般的错误，不可分类的错误
     */
    400: string;
    /**
     * 用户认证未通过/ 用户未登录
     */
    401: string;
    /**
     * 没有权限
     */
    403: string;
    /**
     * 未找到
     */
    404: string;
    /**
     * 冲突，多人同时修改同一资源，资源过期等等
     */
    /**
     * 404 永久版
     */
    /**
     * 客户端发送的content-type/encoding不符合要求
     * 比如接口需要json, 但是传来的是xml，可以报415错误
     */
    /**
     * 一般意义的服务器错误，比如代码错误，栈溢出等                                     ，
     */
    500: string;
}
/**
 * HTTP Method	$method	The allowable values for the $method will be those for the HTTP operation.
 * Requested media type	$request.header.accept
 * Request parameter	$request.path.id	Request parameters MUST be declared in the parameters section of the parent operation or they cannot be evaluated. This includes request headers.
 * Request body property	$request.body#/user/uuid	In operations which accept payloads, references may be made to portions of the requestBody or the entire body.
 * Request URL	$url
 * Response value	$response.body#/status	In operations which return payloads, references may be made to portions of the response body or the entire body.
 * Response header	$response.header.Server	Single header values only are available
 */
declare type KeyExpression = '$method' | '$url' | '$request.path.*' | '$request.query.*' | '$request.header.*' | '$request.body#/**' | '$response.header.**';
export {};
