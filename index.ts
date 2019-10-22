

export interface ApiSpec extends ExtensionFields {
  openapi: string;                            // REQUIRED. This string MUST be the semantic version number of the OpenAPI Specification version that the OpenAPI document uses. The openapi field SHOULD be used by tooling specifications and clients to interpret the OpenAPI document. This is not related to the API info.version string.
  info: InfoObject;                           // REQUIRED. Provides metadata about the API. The metadata MAY be used by tooling as required.
  servers?: ServerObject[];                   // An array of Server Objects, which provide connectivity information to a target server. If the servers property is not provided, or is an empty array, the default value would be a Server Object with a url value of /.
  paths: MapOf<PathItemObject>;               // REQUIRED. The available paths and operations for the API.
  components?: ComponentsObject;              // An element to hold various schemas for the specification.
  security?: SecurityRequirementObject;       // A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition.
  tags?: Tag[];                               // A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
  externalDocs?: ExternalDocumentationObject; // Additional external documentation.
}




export interface InfoObject extends ExtensionFields {
  title: string;            //	REQUIRED. The title of the application.
  version: string;          //	REQUIRED. The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).
  description?: string;     //	A short description of the application. CommonMark syntax MAY be used for rich text representation.
  termsOfService?: string;  //	A URL to the Terms of Service for the API. MUST be in the format of a URL.
  contact?: ContactObject;  //	The contact information for the exposed API.
  license?: LicenseObject;  //	The license information for the exposed API.
}

export interface ServerObject extends ExtensionFields {
  url: string;                              // REQUIRED.A URL to the target host.This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served.Variable substitutions will be made when a variable is named in { brackets }.
  description?: string;                     // An optional string describing the host designated by the URL.CommonMark syntax MAY be used for rich text representation.
  variables?: MapOf<ServerVariableObject>;  // A map between a variable name and its value.The value is used for substitution in the server's URL template.
}

export type PathItemObject = ({
  summary?: string;                                     // An optional, string summary, intended to apply to all operations in this path.
  description?: string;                                 // An optional, string description, intended to apply to all operations in this path. CommonMark syntax MAY be used for rich text representation.
  servers?: ServerObject[];                             // An alternative server array to service all operations in this path.
  parameters?: (ParameterObject | ReferenceObject)[];   // A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object's components/parameters.
} & MethodsOperationObject) | ReferenceObject;

export interface ComponentsObject extends ExtensionFields {
  schemas?: MapOf<SchemaObject | ReferenceObject>;                              // An object to hold reusable Schema Objects.
  responses?: MapOf<ResponseObject | ReferenceObject>;                          // An object to hold reusable Response Objects.
  parameters?: MapOf<ParameterObject | ReferenceObject>;                        // An object to hold reusable Parameter Objects.
  examples?: { [media in MediaTypes]?: ExampleObject | ReferenceObject }; // An object to hold reusable Example Objects.
  requestBodies?: MapOf<RequestBodyObject | ReferenceObject>;                   // An object to hold reusable Request Body Objects.
  headers?: MapOf<HeaderObject | ReferenceObject>;                              // An object to hold reusable Header Objects.
  securitySchemes?: MapOf<SecuritySchemeObject | ReferenceObject>;              // An object to hold reusable Security Scheme Objects.
  links?: MapOf<LinkObject | ReferenceObject>;                                  // An object to hold reusable Link Objects.
  callbacks?: MapOf<CallbackObject | ReferenceObject>;                          // An object to hold reusable Callback Objects.
}

export interface SecurityRequirementObject extends ExtensionFields {
  [name: string]: string[];       // Each name MUST correspond to a security scheme which is declared in the Security Schemes under the Components Object. If the security scheme is of type "oauth2" or "openIdConnect", then the value is a list of scope names required for the execution. For other security scheme types, the array MUST be empty.
}

export interface Tag extends ExtensionFields {
  name: string;                               // The name of the tag.
  description?: string;                       // A short description for the tag. CommonMark syntax MAY be used for rich text representation.
  externalDocs?: ExternalDocumentationObject; // Additional external documentation for this tag.
}

export interface ExternalDocumentationObject {
  url: string;          // The URL for the target documentation. Value MUST be in the format of a URL.
  description?: string; // A short description of the target documentation. CommonMark syntax MAY be used for rich text representation.
}






export interface ContactObject extends ExtensionFields {
  name?: string;          //	The identifying name of the contact person/organization.
  url?: string;           //	The URL pointing to the contact information. MUST be in the format of a URL.
  email?: string;         //	The email address of the contact person/organization. MUST be in the format of an email address.
}
export interface LicenseObject extends ExtensionFields {
  name: string;           //	REQUIRED. The license name used for the API.
  url?: string;           //	A URL to the license used for the API. MUST be in the format of a URL.
}

export interface ServerVariableObject extends ExtensionFields {
  default: string;        //	REQUIRED. The default value to use for substitution, and to send, if an alternate value is not supplied. Unlike the Schema Object's default, this value MUST be provided by the consumer.
  enum?: string[];        //	An enumeration of string values to be used if the substitution options are from a limited set.
  description?: string;   //	An optional description for the server variable. CommonMark syntax MAY be used for rich text representation.
}



export type ParameterObject = HeaderAndParameterObjectBase & {
  name: string;     // The name of the parameter. Parameter names are case sensitive.
} & ({
  //If in is "path", the name field MUST correspond to the associated path segment from the path field in the Paths Object. See Path Templating for further information.
  //If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.
  //For all other cases, the name corresponds to the parameter name used by the in property.
  in: "query" | "header" | "cookie";  // The location of the parameter. Possible values are "query", "header", "path" or "cookie".
  required?: boolean;                 // Determines whether this parameter is mandatory.If the parameter location is "path", this property is REQUIRED and its value MUST be true.Otherwise, the property MAY be included and its default value is false.
} | {
  in: 'path';
  required: true;                     //If the parameter location is "path", this property is REQUIRED and its value MUST be true.
}) & ({
  schema: SchemaObject | ReferenceObject; // The schema defining the type used for the parameter.
  style?: 'simple' | "form" | "matrix" | "label" | "spaceDelimited" | "pipeDelimited" | "deepObject"; // Describes how the parameter value will be serialized depending on the type of the parameter value.Default values(based on value of in): for query - form; for path - simple; for header - simple; for cookie - form.
} | {
  content: { [media in MediaTypes]?: MediaTypeObject } // A map containing the representations for the parameter.The key is the media type and the value describes it.The map MUST only contain one entry.
}) & ExtensionFields

export interface ReferenceObject extends ExtensionFields {
  $ref: string; // The reference string.
}

type HttpMethods = "get" | "post" | "put" | "patch" | "delete" | "head" | "options" | "trace";

type MethodsOperationObject = {
  [k in HttpMethods]?: OperationObject;
} & ExtensionFields;




export type SchemaObject = SchemaTypeNumber
  | SchemaTypeString
  | SchemaTypeBoolean
  | SchemaTypeArray
  | SchemaTypeObject
  | {
    anyOf: SchemaObject[];
  } | {
    allOf: SchemaObject[];
  } | {
    oneOf: SchemaObject[];
  } | {
    not: SchemaObject;
  };

export interface ResponseObject extends ExtensionFields {
  description: string;                                          // A short description of the response. CommonMark syntax MAY be used for rich text representation.
  headers?: MapOf<HeaderObject | ReferenceObject>;              // Maps a header name to its definition. RFC7230 states header names are case insensitive. If a response header is defined with the name "Content-Type", it SHALL be ignored.
  content?: { [media in MediaTypes]?: MediaTypeObject };  // A map containing descriptions of potential response payloads. The key is a media type or media type range and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
  links?: MapOf<LinkObject | ReferenceObject>;                  // A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for Component Objects.
}
export interface ExampleObject extends ExtensionFields {
  summary?: string;       // Short description for the example.
  description?: string;   // Long description for the example. CommonMark syntax MAY be used for rich text representation.
  value?: any;            // Embedded literal example. The value field and externalValue field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary.
  externalValue?: string; // A URL that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The value field and externalValue field are mutually exclusive.
}

export interface RequestBodyObject extends ExtensionFields {
  content: { [media in MediaTypes]?: MediaTypeObject }; // REQUIRED. The content of the request body. The key is a media type or media type range and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
  description?: string;                                 // A brief description of the request body. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.
  required?: boolean;                                   // Determines if the request body is required in the request. Defaults to false.
}

export type HeaderObject = HeaderAndParameterObjectBase & {
  required?: boolean;
  schema: SchemaObject | ReferenceObject; // The schema defining the type used for the parameter.
  style?: 'simple' | "form" | "matrix" | "label" | "spaceDelimited" | "pipeDelimited" | "deepObject";// Describes how the parameter value will be serialized depending on the type of the parameter value.Default values(based on value of in): for query - form; for path - simple; for header - simple; for cookie - form.
} & ExtensionFields;


export type SecuritySchemeObject = {
  description?: string; // Any A short description for security scheme. CommonMark syntax MAY be used for rich text representation.
} & ExtensionFields & (SecuritySchemeObjectHttp | SecuritySchemeObjectApiKey | SecuritySchemeObjectOAuth2 | SecuritySchemeObjectOpenIdConnect)

export interface LinkObject extends ExtensionFields {
  operationRef?: string;                          // A relative or absolute reference to an OAS operation. This field is mutually exclusive of the operationId field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing Operation Object in the OpenAPI definition.
  operationId?: string;                           // The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually exclusive of the operationRef field.
  parameters?: MapOf<any | KeyExpression>;  // A map representing parameters to pass to an operation as specified with operationId or identified via operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location [{in}.]{name} for operations that use the same parameter name in different locations (e.g. path.id).
  requestBody?: KeyExpression | any;        // A literal value or {expression} to use as a request body when calling the target operation.
  description?: string;                           // A description of the link. CommonMark syntax MAY be used for rich text representation.
  server?: ServerObject;                          // A server object to be used by the target operation.
}

type CallbackObject = {
  [expression in KeyExpression]?: PathItemObject; // A Path Item Object used to define a callback request and expected responses. A complete example is available.
} & ExtensionFields;





export interface MediaTypeObject extends ExtensionFields {
  schema?: SchemaObject | ReferenceObject;                                       // The schema defining the type used for the request body.
  example?: any;                                                                 // Example of the media type. The example object SHOULD be in the correct format as specified by the media type. The example object is mutually exclusive of the examples object. Furthermore, if referencing a schema which contains an example, the example value SHALL override the example provided by the schema.
  examples?: { [media in MediaTypes]?: ExampleObject | ReferenceObject; }; // Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The examples object is mutually exclusive of the example object. Furthermore, if referencing a schema which contains an example, the examples value SHALL override the example provided by the schema.
  encoding?: MapOf<EncodingObject>;                                              // A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The encoding object SHALL only apply to requestBody objects when the media type is multipart or application/x-www-form-urlencoded.
}

export interface OperationObject extends ExtensionFields {
  tags?: string[];                              // A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
  summary?: string;                             // A short summary of what the operation does.
  description?: string;                         // A verbose explanation of the operation behavior. CommonMark syntax MAY be used for rich text representation.
  externalDocs?: ExternalDocumentationObject;   // Additional external documentation for this operation.
  operationId?: string;                         // Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.
  parameters?: (ParameterObject | ReferenceObject)[]; // A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object's components/parameters.
  requestBody?: RequestBodyObject | ReferenceObject;  // The request body applicable for this operation. The requestBody is only supported in HTTP methods where the HTTP 1.1 specification RFC7231 has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague, requestBody SHALL be ignored by consumers.
  responses: { [code in keyof HTTPStatusCode | 'default']?: ResponseObject }; // The list of possible responses as they are returned from executing this operation.
  callbacks?: MapOf<CallbackObject | ReferenceObject>;  // A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the Callback Object. Each value in the map is a Callback Object that describes a request that may be initiated by the API provider and the expected responses. The key value used to identify the callback object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.
  deprecated?: boolean;                                 // Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is false.
  security?: SecurityRequirementObject[];               // A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. This definition overrides any declared top-level security. To remove a top-level security declaration, an empty array can be used.
  servers?: ServerObject[];                             // An alternative server array to service this operation. If an alternative server object is specified at the Path Item Object or Root level, it will be overridden by this value.
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
  minItems?: number;      // array size;
  maxItems?: number;      // array size;
  uniqueItems?: boolean;  // specify that all items in the array must be unique
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
  },
  default?: {};
  xml?: XMLObject;
}





export type HeaderAndParameterObjectBase = {
  description?: string;             // A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.
  deprecated?: boolean;             // Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.
  allowEmptyValue?: boolean;        // Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a parameter with an empty value. Default value is false. If style is used, and if behavior is n/a (cannot be serialized), the value of allowEmptyValue SHALL be ignored.
  explode?: boolean;                // When this is true, parameter values of type array or object generate separate parameters for each value of the array or key - value pair of the map.For other types of parameters this property has no effect.When style is form, the default value is true.For all other styles, the default value is false.
  allowReserved?: boolean;          // Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986: /?#[]@!$&'()*+,;= to be included without percent-encoding. This property only applies to parameters with an in value of query. The default value is false.
  example?: any;                    // Example of the media type.The example SHOULD match the specified schema and encoding properties if present.The example object is mutually exclusive of the examples object.Furthermore, if referencing a schema which contains an example, the example value SHALL override the example provided by the schema.To represent examples of media types that cannot naturally be represented in JSON or YAML, a string value can contain the example with escaping where necessary.
  examples?: { [media in MediaTypes]?: ExampleObject | ReferenceObject; }; // Examples of the media type.Each example SHOULD contain a value in the correct format as specified in the parameter encoding.The examples object is mutually exclusive of the example object.Furthermore, if referencing a schema which contains an example, the examples value SHALL override the example provided by the schema.
} & ExtensionFields;



interface SecuritySchemeObjectHttp {
  type: 'http';           // The type of the security scheme.
  scheme?: string;        // The name of the HTTP Authorization scheme to be used in the Authorization header as defined in RFC7235.
  bearerFormat?: string;  // http ("bearer")	A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
}

interface SecuritySchemeObjectApiKey {
  type: 'apiKey'; // The type of the security scheme. 
  name: string;   // The name of the header, query or cookie parameter to be used.
  in: string;     // The location of the API key. Valid values are "query", "header" or "cookie".
}

interface SecuritySchemeObjectOAuth2 {
  type: 'oauth2';           // The type of the security scheme. 
  flows: OAuthFlowsObject;  // An object containing configuration information for the flow types supported.
}

interface SecuritySchemeObjectOpenIdConnect {
  type: 'openIdConnect';    // The type of the security scheme. 
  openIdConnectUrl: string; // OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL.
}

export interface EncodingObject extends ExtensionFields {
  contentType: MediaTypes;        // The Content-Type for encoding a specific property. Default value depends on the property type: for string with format being binary – application/octet-stream; for other primitive types – text/plain; for object - application/json; for array – the default is defined based on the inner type. The value can be a specific media type (e.g. application/json), a wildcard media type (e.g. image/*), or a comma-separated list of the two types.
  headers: { [header in keyof Headers]?: HeaderObject | ReferenceObject };  // A map allowing additional information to be provided as headers, for example Content-Disposition. Content-Type is described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body media type is not a multipart.
  style: string;                        // Describes how a specific property value will be serialized depending on its type. See Parameter Object for details on the style property. The behavior follows the same values as query parameters, including default values. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded.
  explode: boolean;                     // When this is true, property values of type array or object generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When style is form, the default value is true. For all other styles, the default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded.
  allowReserved: boolean;               // Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 :/?#[]@!$&'()*+,;= to be included without percent-encoding. The default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded.
}

export interface XMLObject extends ExtensionFields {
  name?: string;        //	Replaces the name of the element / attribute used for the described schema property.When defined within items, it will affect the name of the individual XML elements within the list.When defined alongside type being array (outside the items), it will affect the wrapping element and only if wrapped is true.If wrapped is false, it will be ignored.
  namespace?: string;   //	The URI of the namespace definition.Value MUST be in the form of an absolute URI.
  prefix?: string;      //	The prefix to be used for the name.
  attribute?: boolean;  // Declares whether the property definition translates to an attribute instead of an element.Default value is false.
  wrapped?: boolean;    // MAY be used only for an array definition.Signifies whether the array is wrapped(for example, <books><book/><book/ > </books>) or unwrapped (<book/ > <book/>). Default value is false. The definition takes effect only when defined alongside type being array (outside the items).
}


type OAuthFlowsObject = {
  implicit?: {
    authorizationUrl: string;
    refreshUrl?: string;
    scopes: { [scope: string]: string };
  } & ExtensionFields;

  password?: {
    tokenUrl: string;
    refreshUrl?: string;
    scopes: { [scope: string]: string };
  } & ExtensionFields;

  clientCredentials?: {
    tokenUrl: string;
    refreshUrl?: string;
    scopes: { [scope: string]: string };
  } & ExtensionFields;

  authorizationCode?: {
    authorizationUrl: string;
    tokenUrl: string;
    refreshUrl?: string;
    scopes: { [scope: string]: string };
  } & ExtensionFields;
}


type DataFormat = "int32" | "int64" | "float" | "double" | "byte" | "binary" | "date" | "date-time" | "password";

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
  [name: string]: any; // TODO 扩展字段需要以x-开头，但是typescript当前不支持此规则类型
}

interface MapOf<V> {
  [key: string]: V;
}

type MediaTypes =
  "*/*" |
  "text/plain" |
  "text/html" |
  "text/css" |
  "image/jpeg" |
  "image/png" |
  "image/svg+xml" |
  "image/gif" |
  "audio/mpeg" |
  "audio/ogg" |
  "audio/*" |
  "video/mp4" |
  "application/*" |
  "application/xml" |
  "application/json" |
  "application/javascript" |
  "application/ecmascript" |
  "application/octet-stream" |
  "multipart/form-data" |
  "multipart/byteranges" |
  "application/x-www-form-urlencoded"

interface Headers {
  'Accept': string; // 用户代理期望的MIME 类型列表	HTTP Content Negotiation	HTTP/1.1
  'Accept-CH': string; // 列出配置数据，服务器可据此来选择适当的响应。	HTTP Client Hints	
  "Accept-Charset": string; // 列出用户代理支持的字符集。	HTTP Content Negotiation	HTTP/1.1
  "Accept-Features": string; //	HTTP Content Negotiation	RFC 2295, §8.2
  "Accept-Encoding": string; //列出用户代理支持的压缩方法。	HTTP Content Negotiation	HTTP/1.1
  "Accept-Language": string; // 列出用户代理期望的页面语言。	HTTP Content Negotiation	HTTP/1.1
  "Accept-Ranges": string;
  "Access-Control-Allow-Credentials": string;	// HTTP Access Control and Server Side Access Control	W3C Cross-Origin Resource Sharing
  "Access-Control-Allow-Origin": string; // HTTP Access Control and Server Side Access Control	W3C Cross-Origin Resource Sharing
  "Access-Control-Allow-Methods": string; // HTTP Access Control and Server Side Access Control	W3C Cross-Origin Resource Sharing
  "Access-Control-Allow-Headers": string; // HTTP Access Control and Server Side Access Control	W3C Cross-Origin Resource Sharing
  "Access-Control-Max-Age": string; // HTTP Access Control and Server Side Access Control	W3C Cross-Origin Resource Sharing
  "Access-Control-Expose-Headers": string; // HTTP Access Control and Server Side Access Control	W3C Cross-Origin Resource Sharing
  "Access-Control-Request-Method": string; // HTTP Access Control and Server Side Access Control	W3C Cross-Origin Resource Sharing
  "Access-Control-Request-Headers": string; // HTTP Access Control and Server Side Access Control	W3C Cross-Origin Resource Sharing
  "Age": string; //			
  "Allow": string; //			
  "Alternates": string; // HTTP Content Negotiation	RFC 2295, §8.3
  "Authorization": string; // 包含用服务器验证用户代理的凭证		
  "Cache-Control": string; //	HTTP Caching FAQ	
  "Connection": string; //			
  "Content-Encoding": string;
  "Content-Language": string;
  "Content-Length": string;
  "Content-Location": string;
  "Content-MD5": string; //	未实现 (查看 bug 232030)	
  "Content-Range": string;
  "Content-Security-Policy": string; // 控制用户代理在一个页面上可以加载使用的资源。	CSP (Content Security Policy)	W3C Content Security Policy
  "Content-Type": MediaTypes | string; // 指示服务器文档的MIME 类型。帮助用户代理（浏览器）去处理接收到的数据。		
  "Cookie": string; //	RFC 2109
  "DNT": string; // 设置该值为1， 表明用户明确退出任何形式的网上跟踪。	Supported by Firefox 4, Firefox 5 for mobile, IE9, and a few major companies.	Tracking Preference Expression (DNT)
  "Date": string; //			
  "ETag": string; // HTTP Caching FAQ	
  "Expect": string;
  "Expires": string; //	HTTP Caching FAQ	
  "From": string;
  "Host": string;
  "If-Match": string;
  "If-Modified-Since": string; //	HTTP Caching FAQ	
  "If-None-Match": string; //	HTTP Caching FAQ	
  "If-Range": string;
  "If-Unmodified-Since": string;
  "Last-Event-ID": string; // 给出服务器在先前HTTP连接上接收的最后事件的ID。用于同步文本/事件流。	Server-Sent Events	Server-Sent Events spec
  "Last-Modified": string; //	HTTP Caching FAQ	
  "Link": string; // 等同于HTML标签中的"link"，但它是在HTTP层上，给出一个与获取的资源相关的URL以及关系的种类。 For the rel=prefetch case, see Link Prefetching FAQ Introduced in HTTP 1.1's RFC 2068, section 19.6.2.4, it was removed in the final HTTP 1.1 spec, then reintroduced, with some extensions, in RFC 5988
  "Location": string;
  "Max-Forwards": string;
  "Negotiate": string; //	HTTP Content Negotiation	RFC 2295, §8.4
  "Origin": string; // HTTP Access Control and Server Side Access Control	More recently defined in the Fetch spec (see Fetch API.) Originally defined in W3C Cross-Origin Resource Sharing
  "Pragma": string; // for the pragma: nocache value see HTTP Caching FAQ	
  "Proxy-Authenticate": string;
  "Proxy-Authorization": string;
  "Range": string;
  "Referer": string; // （请注意，在HTTP / 0.9规范中引入的正交错误必须在协议的后续版本中保留）
  "Retry-After": string;
  "Sec-Websocket-Extensions": string; // Websockets
  "Sec-Websocket-Key": string; // Websockets
  "Sec-Websocket-Origin": string; //	Websockets
  "Sec-Websocket-Protocol": string; // Websockets
  "Sec-Websocket-Version": string; // Websockets
  "Server": string;
  "Set-Cookie": string; //	RFC 2109
  "Set-Cookie2": string; // RFC 2965
  "Strict-Transport-Security": string; //	HTTP Strict Transport Security	IETF reference
  "TCN": string; // HTTP Content Negotiation	RFC 2295, §8.5
  "TE": string;
  "Trailer": string; // 列出将在消息正文之后在尾部块中传输的头。这允许服务器计算一些值，如Content-MD5：在传输数据时。请注意，Trailer：标头不得列出Content-Length :, Trailer：或Transfer-Encoding：headers。 RFC 2616, §14.40
  "Transfer-Encoding": string;
  "Upgrade": string;
  "User-Agent": string; // for Gecko's user agents see the User Agents Reference	
  "Variant-Vary": string; // HTTP Content Negotiation	RFC 2295, §8.6
  "Vary": string; // 列出了用作Web服务器选择特定内容的条件的标头。此服务器对于高效和正确缓存发送的资源很重要。HTTP Content Negotiation & HTTP Caching FAQ	
  "Via": string; //		
  "Warning": string;
  "WWW-Authenticate": string;
  "X-Content-Duration": string; // Configuring servers for Ogg media	
  "X-Content-Security-Policy": string; // Using Content Security Policy	
  "X-DNSPrefetch-Control": string; // Controlling DNS prefetching	
  "X-Frame-Options": string; // The XFrame-Option Response Header	
  "X-Requested-With": string;	// 通常在值为“XMLHttpRequest”时使用 Not standard
}


interface HTTPStatusCode {
  // 信息响应
  /**
   * 请求前检查与探测，比如不确定当前服务器是否可以处理接下来的请求，或者是否有权限，或者请求数据很大分多个请求
   * 可以发一个请求，带上部分信息，在请求头中设置Expect: 100-continue, 
   * 服务器检查当前用户是否合法，自己是否可以继续处理，返回100后，客户端重新请求且不带Expect: 100-continue, 服务器接收并处理
   */
  100: string; // Continue 这个临时响应表明，迄今为止的所有内容都是可行的，客户端应该继续请求，如果已经完成，则忽略它。
  // 101: string; // Switching Protocol 该代码是响应客户端的 Upgrade 标头发送的，并且指示服务器也正在切换的协议。
  // 102: string; // Processing (WebDAV) 此代码表示服务器已收到并正在处理该请求，但没有响应可用
  // 103: string; //Early Hints 此状态代码主要用于与Link 链接头一起使用，以允许用户代理在服务器仍在准备响应时开始预加载资源。


  // 成功响应
  /**
   * 一般成功响应
   */
  200: string; // OK 请求成功。成功的含义取决于HTTP方法： GET：资源已被提取并在消息正文中传输。 HEAD：实体标头位于消息正文中。 POST：描述动作结果的资源在消息体中传输。 TRACE：消息正文包含服务器收到的请求消息
  /**
   * 创建资源成功响应
   */
  201: string; // Created 该请求已成功，并因此创建了一个新的资源。这通常是在POST请求，或是某些PUT请求之后返回的响应。
  // 202: string; // Accepted 请求已经接收到，但还未响应，没有结果。意味着不会有一个异步的响应去表明当前请求的结果，预期另外的进程和服务去处理请求，或者批处理。
  // 203: string; // Non - Authoritative Information 服务器已成功处理了请求，但返回的实体头部元信息不是在原始服务器上有效的确定集合，而是来自本地或者第三方的拷贝。当前的信息可能是原始版本的子集或者超集。例如，包含资源的元数据可能导致原始服务器知道元信息的超集。使用此状态码不是必须的，而且只有在响应不使用此状态码便会返回200 OK的情况下才是合适的。
  /**
   * 已处理，但没有返回值，已删除，已更新等等
   */
  204: string; // No Content 服务器成功处理了请求，但不需要返回任何实体内容，并且希望返回更新了的元信息。响应可能通过实体头部的形式，返回新的或更新后的元信息。如果存在这些头部信息，则应当与所请求的变量相呼应。如果客户端是浏览器的话，那么用户浏览器应保留发送了该请求的页面，而不产生任何文档视图上的变化，即使按照规范新的或更新后的元信息应当被应用到用户浏览器活动视图中的文档。由于204响应被禁止包含任何消息体，因此它始终以消息头后的第一个空行结尾。
  /**
   * 已处理，但没有返回值，且客户端需要重置视图
   */
  // 205: string; // Reset Content 服务器成功处理了请求，且没有返回任何内容。但是与204响应不同，返回此状态码的响应要求请求者重置文档视图。该响应主要是被用于接受用户输入后，立即重置表单，以便用户能够轻松地开始另一次输入。与204响应一样，该响应也被禁止包含任何消息体，且以消息头后的第一个空行结束。
  /**
   * 对于带 Range 请求的响应
   */
  206: string; // Partial Content 服务器已经成功处理了部分 GET 请求。类似于 FlashGet 或者迅雷这类的 HTTP 下载工具都是使用此类响应实现断点续传或者将一个大文档分解为多个下载段同时下载。该请求必须包含 Range 头信息来指示客户端希望得到的内容范围，并且可能包含 If - Range 来作为请求条件。
  // 207: string; // Multi-Status (WebDAV)
  // 208: string; // Multi-Status (WebDAV)
  // 226: string; // IM Used (HTTP Delta encoding)


  //重定向
  // 300: string; // Multiple Choice 被请求的资源有一系列可供选择的回馈信息，每个都有自己特定的地址和浏览器驱动的商议信息。用户或浏览器能够自行选择一个首选的地址进行重定向。
  301: string; // Moved Permanently 被请求的资源已永久移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个 URI 之一。如果可能，拥有链接编辑功能的客户端应当自动把请求的地址修改为从服务器反馈回来的地址。除非额外指定，否则这个响应也是可缓存的。
  302: string; // Found 请求的资源现在临时从不同的 URI 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache - Control或Expires中进行了指定的情况下，这个响应才是可缓存的。
  // 303: string; // See Other 对应当前请求的响应可以在另一个 URI 上被找到，而且客户端应当采用 GET 的方式访问那个资源。这个方法的存在主要是为了允许由脚本激活的POST请求输出重定向到一个新的资源
  304: string; // Not Modified 如果客户端发送了一个带条件的 GET 请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。304 响应禁止包含消息体，因此始终以消息头后的第一个空行结尾。
  // 305: string; // Use Proxy 
  // 306: string; // unused 在最新版的规范中，306 状态码已经不再被使用。
  // 307: string; // Temporary Redirect 请求的资源现在临时从不同的URI 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache - Control或Expires中进行了指定的情况下，这个响应才是可缓存的。
  // 308: string; // Permanent Redirect 这意味着资源现在永久位于由 Location: HTTP Response 标头指定的另一个 URI。 这与 301 Moved Permanently HTTP 响应代码具有相同的语义，但用户代理不能更改所使用的 HTTP 方法：如果在第一个请求中使用 POST，则必须在第二个请求中使用 POST。


  //客户端响应
  /**
   * 一般的错误，不可分类的错误
   */
  400: string; // Bad Request 1、语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。 2、请求参数有误。
  /**
   * 用户认证未通过/ 用户未登录
   */
  401: string; // Unauthorized 当前请求需要用户验证。该响应必须包含一个适用于被请求资源的 WWW-Authenticate 信息头用以询问用户信息。客户端可以重复提交一个包含恰当的 Authorization 头信息的请求。如果当前请求已经包含了 Authorization 证书，那么401响应代表着服务器验证已经拒绝了那些证书。如果401响应包含了与前一个响应相同的身份验证询问，且浏览器已经至少尝试了一次验证，那么浏览器应当向用户展示响应中包含的实体信息，因为这个实体信息中可能包含了相关诊断信息。
  // 402: string; // Payment Required 此响应码保留以便将来使用，创造此响应码的最初目的是用于数字支付系统，然而现在并未使用。
  /**
   * 没有权限
   */
  403: string; // Forbidden 服务器已经理解请求，但是拒绝执行它。与 401 响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。如果这不是一个 HEAD 请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在实体内描述拒绝的原因。当然服务器也可以返回一个 404 响应，假如它不希望让客户端获得任何信息。
  /**
   * 未找到
   */
  404: string; // Not Found 请求失败，请求所希望得到的资源未被在服务器上发现。没有信息能够告诉用户这个状况到底是暂时的还是永久的。假如服务器知道情况的话，应当使用410状态码来告知旧资源因为某些内部的配置机制问题，已经永久的不可用，而且没有任何可以跳转的地址。404这个状态码被广泛应用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应可用的情况下。
  // 405: string; // Method Not Allowed 请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。 鉴于 PUT，DELETE 方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回405错误。
  // 406: string; // Not Acceptable 请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。
  // 407: string; // Proxy Authentication Required 与401响应类似，只不过客户端必须在代理服务器上进行身份验证。代理服务器必须返回一个 Proxy - Authenticate 用以进行身份询问。客户端可以返回一个 Proxy - Authorization 信息头用以验证。
  // 408: string; // Request Timeout 请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
  /**
   * 冲突，多人同时修改同一资源，资源过期等等
   */
  // 409: string; // Conflict 由于和被请求的资源的当前状态之间存在冲突，请求无法完成。这个代码只允许用在这样的情况下才能被使用：用户被认为能够解决冲突，并且会重新提交新的请求。该响应应当包含足够的信息以便用户发现冲突的源头。
  /**
   * 404 永久版
   */
  // 410: string; // Gone 被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。这样的状况应当被认为是永久性的。如果可能，拥有链接编辑功能的客户端应当在获得用户许可后删除所有指向这个地址的引用。如果服务器不知道或者无法确定这个状况是否是永久的，那么就应该使用 404 状态码。除非额外说明，否则这个响应是可缓存的。
  // 411: string; // Length Required 服务器拒绝在没有定义 Content - Length 头的情况下接受请求。在添加了表明请求消息体长度的有效 Content - Length 头之后，客户端可以再次提交该请求。
  // 412: string; // Precondition Failed 服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个。这个状态码允许客户端在获取资源时在请求的元信息（请求头字段数据）中设置先决条件，以此避免该请求方法被应用到其希望的内容以外的资源上。
  // 413: string; // Payload Too Large 服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。此种情况下，服务器可以关闭连接以免客户端继续发送此请求。如果这个状况是临时的，服务器应当返回一个 Retry - After 的响应头，以告知客户端可以在多少时间以后重新尝试。
  // 414: string; // URI Too Long 请求的URI 长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。这比较少见，通常的情况包括：本应使用POST方法的表单提交变成了GET方法，导致查询字符串（Query String）过长。
  /**
   * 客户端发送的content-type/encoding不符合要求
   * 比如接口需要json, 但是传来的是xml，可以报415错误
   */
  // 415: string; // Unsupported Media Type 对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器中所支持的格式，因此请求被拒绝。
  // 416: string; // Requested Range Not Satisfiable 如果请求中包含了 Range 请求头，并且 Range 中指定的任何数据范围都与当前资源的可用范围不重合，同时请求中又没有定义 If - Range 请求头，那么服务器就应当返回416状态码。
  // 417: string; // Expectation Failed 此响应代码意味着服务器无法满足 Expect 请求标头字段指示的期望值。
  // 418: string; // I'm a teapot 服务器拒绝尝试用 “茶壶冲泡咖啡”。
  // 425: string; // Too Early 服务器不愿意冒着风险去处理可能重播的请求。
  // 426: string; // Upgrade Required 服务器拒绝使用当前协议执行请求，但可能在客户机升级到其他协议后愿意这样做。 服务器在 426 响应中发送 Upgrade 头以指示所需的协议。
  // 428: string; // Precondition Required 原始服务器要求该请求是有条件的。 旨在防止“丢失更新”问题，即客户端获取资源状态，修改该状态并将其返回服务器，同时第三方修改服务器上的状态，从而导致冲突。
  // 429: string; // Too Many Requests 用户在给定的时间内发送了太多请求（“限制请求速率”）。
  // 431: string; // Request Header Fields Too Large 服务器不愿意处理请求，因为它的 请求头字段太大（ Request Header Fields Too Large）。 请求可以在减小请求头字段的大小后重新提交。
  // 451: string; // Unavailable For Legal Reasons 用户请求非法资源，例如：由政府审查的网页。


  // 服务端响应
  /**
   * 一般意义的服务器错误，比如代码错误，栈溢出等                                     ，
   */
  500: string;// Internal Server Error 服务器遇到了不知道如何处理的情况。
  // 501: string;// Not Implemented 此请求方法不被服务器支持且无法被处理。只有GET和HEAD是要求服务器支持的，它们必定不会返回此错误代码。
  // 502: string;// Bad Gateway 此错误响应表明服务器作为网关需要得到一个处理这个请求的响应，但是得到一个错误的响应。
  // 503: string;// Service Unavailable 服务器没有准备好处理请求。 常见原因是服务器因维护或重载而停机。 请注意，与此响应一起，应发送解释问题的用户友好页面。 这个响应应该用于临时条件和 Retry - After：如果可能的话，HTTP头应该包含恢复服务之前的估计时间。 网站管理员还必须注意与此响应一起发送的与缓存相关的标头，因为这些临时条件响应通常不应被缓存。
  // 504: string;// Gateway Timeout 当服务器作为网关，不能及时得到响应时返回此错误代码。
  // 505: string;// HTTP Version Not Supported 服务器不支持请求中所使用的HTTP协议版本。
  // 506: string;// Variant Also Negotiates 服务器有一个内部配置错误：对请求的透明内容协商导致循环引用。
  // 507: string;// Insufficient Storage 服务器有内部配置错误：所选的变体资源被配置为参与透明内容协商本身，因此不是协商过程中的适当端点。
  // 508: string;// Loop Detected(WebDAV) 服务器在处理请求时检测到无限循环。
  // 510: string;// Not Extended 客户端需要对请求进一步扩展，服务器才能实现它。服务器会回复客户端发出扩展请求所需的所有信息。
  // 511: string;// Network Authentication Required 511 状态码指示客户端需要进行身份验证才能获得网络访问权限。
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
// TODO 没有办法将对字符串的前缀或者后缀规则定义为类型
type KeyExpression =
  '$method' |
  '$url' |
  '$request.path.*' |
  '$request.query.*' |
  '$request.header.*' |
  '$request.body#/**' |
  '$response.header.**'

