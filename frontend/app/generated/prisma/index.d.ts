
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AppUser
 * 
 */
export type AppUser = $Result.DefaultSelection<Prisma.$AppUserPayload>
/**
 * Model Cafe
 * 
 */
export type Cafe = $Result.DefaultSelection<Prisma.$CafePayload>
/**
 * Model UserSavedCafe
 * 
 */
export type UserSavedCafe = $Result.DefaultSelection<Prisma.$UserSavedCafePayload>
/**
 * Model CafeRecord
 * 
 */
export type CafeRecord = $Result.DefaultSelection<Prisma.$CafeRecordPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more AppUsers
 * const appUsers = await prisma.appUser.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more AppUsers
   * const appUsers = await prisma.appUser.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.appUser`: Exposes CRUD operations for the **AppUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AppUsers
    * const appUsers = await prisma.appUser.findMany()
    * ```
    */
  get appUser(): Prisma.AppUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cafe`: Exposes CRUD operations for the **Cafe** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cafes
    * const cafes = await prisma.cafe.findMany()
    * ```
    */
  get cafe(): Prisma.CafeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userSavedCafe`: Exposes CRUD operations for the **UserSavedCafe** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSavedCafes
    * const userSavedCafes = await prisma.userSavedCafe.findMany()
    * ```
    */
  get userSavedCafe(): Prisma.UserSavedCafeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cafeRecord`: Exposes CRUD operations for the **CafeRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CafeRecords
    * const cafeRecords = await prisma.cafeRecord.findMany()
    * ```
    */
  get cafeRecord(): Prisma.CafeRecordDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    AppUser: 'AppUser',
    Cafe: 'Cafe',
    UserSavedCafe: 'UserSavedCafe',
    CafeRecord: 'CafeRecord'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "appUser" | "cafe" | "userSavedCafe" | "cafeRecord"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AppUser: {
        payload: Prisma.$AppUserPayload<ExtArgs>
        fields: Prisma.AppUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          findFirst: {
            args: Prisma.AppUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          findMany: {
            args: Prisma.AppUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>[]
          }
          create: {
            args: Prisma.AppUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          createMany: {
            args: Prisma.AppUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AppUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          update: {
            args: Prisma.AppUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          deleteMany: {
            args: Prisma.AppUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AppUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          aggregate: {
            args: Prisma.AppUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppUser>
          }
          groupBy: {
            args: Prisma.AppUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppUserCountArgs<ExtArgs>
            result: $Utils.Optional<AppUserCountAggregateOutputType> | number
          }
        }
      }
      Cafe: {
        payload: Prisma.$CafePayload<ExtArgs>
        fields: Prisma.CafeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CafeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CafeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafePayload>
          }
          findFirst: {
            args: Prisma.CafeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CafeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafePayload>
          }
          findMany: {
            args: Prisma.CafeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafePayload>[]
          }
          create: {
            args: Prisma.CafeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafePayload>
          }
          createMany: {
            args: Prisma.CafeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CafeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafePayload>
          }
          update: {
            args: Prisma.CafeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafePayload>
          }
          deleteMany: {
            args: Prisma.CafeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CafeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CafeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafePayload>
          }
          aggregate: {
            args: Prisma.CafeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCafe>
          }
          groupBy: {
            args: Prisma.CafeGroupByArgs<ExtArgs>
            result: $Utils.Optional<CafeGroupByOutputType>[]
          }
          count: {
            args: Prisma.CafeCountArgs<ExtArgs>
            result: $Utils.Optional<CafeCountAggregateOutputType> | number
          }
        }
      }
      UserSavedCafe: {
        payload: Prisma.$UserSavedCafePayload<ExtArgs>
        fields: Prisma.UserSavedCafeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSavedCafeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSavedCafePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSavedCafeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSavedCafePayload>
          }
          findFirst: {
            args: Prisma.UserSavedCafeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSavedCafePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSavedCafeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSavedCafePayload>
          }
          findMany: {
            args: Prisma.UserSavedCafeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSavedCafePayload>[]
          }
          create: {
            args: Prisma.UserSavedCafeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSavedCafePayload>
          }
          createMany: {
            args: Prisma.UserSavedCafeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserSavedCafeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSavedCafePayload>
          }
          update: {
            args: Prisma.UserSavedCafeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSavedCafePayload>
          }
          deleteMany: {
            args: Prisma.UserSavedCafeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSavedCafeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserSavedCafeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSavedCafePayload>
          }
          aggregate: {
            args: Prisma.UserSavedCafeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSavedCafe>
          }
          groupBy: {
            args: Prisma.UserSavedCafeGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSavedCafeGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSavedCafeCountArgs<ExtArgs>
            result: $Utils.Optional<UserSavedCafeCountAggregateOutputType> | number
          }
        }
      }
      CafeRecord: {
        payload: Prisma.$CafeRecordPayload<ExtArgs>
        fields: Prisma.CafeRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CafeRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafeRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CafeRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafeRecordPayload>
          }
          findFirst: {
            args: Prisma.CafeRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafeRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CafeRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafeRecordPayload>
          }
          findMany: {
            args: Prisma.CafeRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafeRecordPayload>[]
          }
          create: {
            args: Prisma.CafeRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafeRecordPayload>
          }
          createMany: {
            args: Prisma.CafeRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CafeRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafeRecordPayload>
          }
          update: {
            args: Prisma.CafeRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafeRecordPayload>
          }
          deleteMany: {
            args: Prisma.CafeRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CafeRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CafeRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CafeRecordPayload>
          }
          aggregate: {
            args: Prisma.CafeRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCafeRecord>
          }
          groupBy: {
            args: Prisma.CafeRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<CafeRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.CafeRecordCountArgs<ExtArgs>
            result: $Utils.Optional<CafeRecordCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    appUser?: AppUserOmit
    cafe?: CafeOmit
    userSavedCafe?: UserSavedCafeOmit
    cafeRecord?: CafeRecordOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AppUserCountOutputType
   */

  export type AppUserCountOutputType = {
    savedCafes: number
    cafeRecords: number
  }

  export type AppUserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedCafes?: boolean | AppUserCountOutputTypeCountSavedCafesArgs
    cafeRecords?: boolean | AppUserCountOutputTypeCountCafeRecordsArgs
  }

  // Custom InputTypes
  /**
   * AppUserCountOutputType without action
   */
  export type AppUserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUserCountOutputType
     */
    select?: AppUserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AppUserCountOutputType without action
   */
  export type AppUserCountOutputTypeCountSavedCafesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSavedCafeWhereInput
  }

  /**
   * AppUserCountOutputType without action
   */
  export type AppUserCountOutputTypeCountCafeRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CafeRecordWhereInput
  }


  /**
   * Count Type CafeCountOutputType
   */

  export type CafeCountOutputType = {
    savedCafes: number
    cafeRecords: number
  }

  export type CafeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedCafes?: boolean | CafeCountOutputTypeCountSavedCafesArgs
    cafeRecords?: boolean | CafeCountOutputTypeCountCafeRecordsArgs
  }

  // Custom InputTypes
  /**
   * CafeCountOutputType without action
   */
  export type CafeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeCountOutputType
     */
    select?: CafeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CafeCountOutputType without action
   */
  export type CafeCountOutputTypeCountSavedCafesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSavedCafeWhereInput
  }

  /**
   * CafeCountOutputType without action
   */
  export type CafeCountOutputTypeCountCafeRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CafeRecordWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AppUser
   */

  export type AggregateAppUser = {
    _count: AppUserCountAggregateOutputType | null
    _avg: AppUserAvgAggregateOutputType | null
    _sum: AppUserSumAggregateOutputType | null
    _min: AppUserMinAggregateOutputType | null
    _max: AppUserMaxAggregateOutputType | null
  }

  export type AppUserAvgAggregateOutputType = {
    id: number | null
  }

  export type AppUserSumAggregateOutputType = {
    id: bigint | null
  }

  export type AppUserMinAggregateOutputType = {
    id: bigint | null
    authProvider: string | null
    providerUserId: string | null
    email: string | null
    nickname: string | null
    displayName: string | null
    profileImageUrl: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLoginAt: Date | null
  }

  export type AppUserMaxAggregateOutputType = {
    id: bigint | null
    authProvider: string | null
    providerUserId: string | null
    email: string | null
    nickname: string | null
    displayName: string | null
    profileImageUrl: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLoginAt: Date | null
  }

  export type AppUserCountAggregateOutputType = {
    id: number
    authProvider: number
    providerUserId: number
    email: number
    nickname: number
    displayName: number
    profileImageUrl: number
    role: number
    createdAt: number
    updatedAt: number
    lastLoginAt: number
    _all: number
  }


  export type AppUserAvgAggregateInputType = {
    id?: true
  }

  export type AppUserSumAggregateInputType = {
    id?: true
  }

  export type AppUserMinAggregateInputType = {
    id?: true
    authProvider?: true
    providerUserId?: true
    email?: true
    nickname?: true
    displayName?: true
    profileImageUrl?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
  }

  export type AppUserMaxAggregateInputType = {
    id?: true
    authProvider?: true
    providerUserId?: true
    email?: true
    nickname?: true
    displayName?: true
    profileImageUrl?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
  }

  export type AppUserCountAggregateInputType = {
    id?: true
    authProvider?: true
    providerUserId?: true
    email?: true
    nickname?: true
    displayName?: true
    profileImageUrl?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
    _all?: true
  }

  export type AppUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppUser to aggregate.
     */
    where?: AppUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppUsers to fetch.
     */
    orderBy?: AppUserOrderByWithRelationInput | AppUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AppUsers
    **/
    _count?: true | AppUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppUserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppUserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppUserMaxAggregateInputType
  }

  export type GetAppUserAggregateType<T extends AppUserAggregateArgs> = {
        [P in keyof T & keyof AggregateAppUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppUser[P]>
      : GetScalarType<T[P], AggregateAppUser[P]>
  }




  export type AppUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppUserWhereInput
    orderBy?: AppUserOrderByWithAggregationInput | AppUserOrderByWithAggregationInput[]
    by: AppUserScalarFieldEnum[] | AppUserScalarFieldEnum
    having?: AppUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppUserCountAggregateInputType | true
    _avg?: AppUserAvgAggregateInputType
    _sum?: AppUserSumAggregateInputType
    _min?: AppUserMinAggregateInputType
    _max?: AppUserMaxAggregateInputType
  }

  export type AppUserGroupByOutputType = {
    id: bigint
    authProvider: string
    providerUserId: string
    email: string | null
    nickname: string
    displayName: string | null
    profileImageUrl: string | null
    role: string
    createdAt: Date
    updatedAt: Date
    lastLoginAt: Date
    _count: AppUserCountAggregateOutputType | null
    _avg: AppUserAvgAggregateOutputType | null
    _sum: AppUserSumAggregateOutputType | null
    _min: AppUserMinAggregateOutputType | null
    _max: AppUserMaxAggregateOutputType | null
  }

  type GetAppUserGroupByPayload<T extends AppUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppUserGroupByOutputType[P]>
            : GetScalarType<T[P], AppUserGroupByOutputType[P]>
        }
      >
    >


  export type AppUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authProvider?: boolean
    providerUserId?: boolean
    email?: boolean
    nickname?: boolean
    displayName?: boolean
    profileImageUrl?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
    savedCafes?: boolean | AppUser$savedCafesArgs<ExtArgs>
    cafeRecords?: boolean | AppUser$cafeRecordsArgs<ExtArgs>
    _count?: boolean | AppUserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appUser"]>



  export type AppUserSelectScalar = {
    id?: boolean
    authProvider?: boolean
    providerUserId?: boolean
    email?: boolean
    nickname?: boolean
    displayName?: boolean
    profileImageUrl?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
  }

  export type AppUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authProvider" | "providerUserId" | "email" | "nickname" | "displayName" | "profileImageUrl" | "role" | "createdAt" | "updatedAt" | "lastLoginAt", ExtArgs["result"]["appUser"]>
  export type AppUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedCafes?: boolean | AppUser$savedCafesArgs<ExtArgs>
    cafeRecords?: boolean | AppUser$cafeRecordsArgs<ExtArgs>
    _count?: boolean | AppUserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $AppUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AppUser"
    objects: {
      savedCafes: Prisma.$UserSavedCafePayload<ExtArgs>[]
      cafeRecords: Prisma.$CafeRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      authProvider: string
      providerUserId: string
      email: string | null
      nickname: string
      displayName: string | null
      profileImageUrl: string | null
      role: string
      createdAt: Date
      updatedAt: Date
      lastLoginAt: Date
    }, ExtArgs["result"]["appUser"]>
    composites: {}
  }

  type AppUserGetPayload<S extends boolean | null | undefined | AppUserDefaultArgs> = $Result.GetResult<Prisma.$AppUserPayload, S>

  type AppUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppUserCountAggregateInputType | true
    }

  export interface AppUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AppUser'], meta: { name: 'AppUser' } }
    /**
     * Find zero or one AppUser that matches the filter.
     * @param {AppUserFindUniqueArgs} args - Arguments to find a AppUser
     * @example
     * // Get one AppUser
     * const appUser = await prisma.appUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppUserFindUniqueArgs>(args: SelectSubset<T, AppUserFindUniqueArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AppUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppUserFindUniqueOrThrowArgs} args - Arguments to find a AppUser
     * @example
     * // Get one AppUser
     * const appUser = await prisma.appUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppUserFindUniqueOrThrowArgs>(args: SelectSubset<T, AppUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserFindFirstArgs} args - Arguments to find a AppUser
     * @example
     * // Get one AppUser
     * const appUser = await prisma.appUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppUserFindFirstArgs>(args?: SelectSubset<T, AppUserFindFirstArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserFindFirstOrThrowArgs} args - Arguments to find a AppUser
     * @example
     * // Get one AppUser
     * const appUser = await prisma.appUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppUserFindFirstOrThrowArgs>(args?: SelectSubset<T, AppUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AppUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AppUsers
     * const appUsers = await prisma.appUser.findMany()
     * 
     * // Get first 10 AppUsers
     * const appUsers = await prisma.appUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appUserWithIdOnly = await prisma.appUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppUserFindManyArgs>(args?: SelectSubset<T, AppUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AppUser.
     * @param {AppUserCreateArgs} args - Arguments to create a AppUser.
     * @example
     * // Create one AppUser
     * const AppUser = await prisma.appUser.create({
     *   data: {
     *     // ... data to create a AppUser
     *   }
     * })
     * 
     */
    create<T extends AppUserCreateArgs>(args: SelectSubset<T, AppUserCreateArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AppUsers.
     * @param {AppUserCreateManyArgs} args - Arguments to create many AppUsers.
     * @example
     * // Create many AppUsers
     * const appUser = await prisma.appUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppUserCreateManyArgs>(args?: SelectSubset<T, AppUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AppUser.
     * @param {AppUserDeleteArgs} args - Arguments to delete one AppUser.
     * @example
     * // Delete one AppUser
     * const AppUser = await prisma.appUser.delete({
     *   where: {
     *     // ... filter to delete one AppUser
     *   }
     * })
     * 
     */
    delete<T extends AppUserDeleteArgs>(args: SelectSubset<T, AppUserDeleteArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AppUser.
     * @param {AppUserUpdateArgs} args - Arguments to update one AppUser.
     * @example
     * // Update one AppUser
     * const appUser = await prisma.appUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppUserUpdateArgs>(args: SelectSubset<T, AppUserUpdateArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AppUsers.
     * @param {AppUserDeleteManyArgs} args - Arguments to filter AppUsers to delete.
     * @example
     * // Delete a few AppUsers
     * const { count } = await prisma.appUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppUserDeleteManyArgs>(args?: SelectSubset<T, AppUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AppUsers
     * const appUser = await prisma.appUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppUserUpdateManyArgs>(args: SelectSubset<T, AppUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AppUser.
     * @param {AppUserUpsertArgs} args - Arguments to update or create a AppUser.
     * @example
     * // Update or create a AppUser
     * const appUser = await prisma.appUser.upsert({
     *   create: {
     *     // ... data to create a AppUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AppUser we want to update
     *   }
     * })
     */
    upsert<T extends AppUserUpsertArgs>(args: SelectSubset<T, AppUserUpsertArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AppUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserCountArgs} args - Arguments to filter AppUsers to count.
     * @example
     * // Count the number of AppUsers
     * const count = await prisma.appUser.count({
     *   where: {
     *     // ... the filter for the AppUsers we want to count
     *   }
     * })
    **/
    count<T extends AppUserCountArgs>(
      args?: Subset<T, AppUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AppUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppUserAggregateArgs>(args: Subset<T, AppUserAggregateArgs>): Prisma.PrismaPromise<GetAppUserAggregateType<T>>

    /**
     * Group by AppUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppUserGroupByArgs['orderBy'] }
        : { orderBy?: AppUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AppUser model
   */
  readonly fields: AppUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AppUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    savedCafes<T extends AppUser$savedCafesArgs<ExtArgs> = {}>(args?: Subset<T, AppUser$savedCafesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    cafeRecords<T extends AppUser$cafeRecordsArgs<ExtArgs> = {}>(args?: Subset<T, AppUser$cafeRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AppUser model
   */
  interface AppUserFieldRefs {
    readonly id: FieldRef<"AppUser", 'BigInt'>
    readonly authProvider: FieldRef<"AppUser", 'String'>
    readonly providerUserId: FieldRef<"AppUser", 'String'>
    readonly email: FieldRef<"AppUser", 'String'>
    readonly nickname: FieldRef<"AppUser", 'String'>
    readonly displayName: FieldRef<"AppUser", 'String'>
    readonly profileImageUrl: FieldRef<"AppUser", 'String'>
    readonly role: FieldRef<"AppUser", 'String'>
    readonly createdAt: FieldRef<"AppUser", 'DateTime'>
    readonly updatedAt: FieldRef<"AppUser", 'DateTime'>
    readonly lastLoginAt: FieldRef<"AppUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AppUser findUnique
   */
  export type AppUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUser to fetch.
     */
    where: AppUserWhereUniqueInput
  }

  /**
   * AppUser findUniqueOrThrow
   */
  export type AppUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUser to fetch.
     */
    where: AppUserWhereUniqueInput
  }

  /**
   * AppUser findFirst
   */
  export type AppUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUser to fetch.
     */
    where?: AppUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppUsers to fetch.
     */
    orderBy?: AppUserOrderByWithRelationInput | AppUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppUsers.
     */
    cursor?: AppUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppUsers.
     */
    distinct?: AppUserScalarFieldEnum | AppUserScalarFieldEnum[]
  }

  /**
   * AppUser findFirstOrThrow
   */
  export type AppUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUser to fetch.
     */
    where?: AppUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppUsers to fetch.
     */
    orderBy?: AppUserOrderByWithRelationInput | AppUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppUsers.
     */
    cursor?: AppUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppUsers.
     */
    distinct?: AppUserScalarFieldEnum | AppUserScalarFieldEnum[]
  }

  /**
   * AppUser findMany
   */
  export type AppUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUsers to fetch.
     */
    where?: AppUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppUsers to fetch.
     */
    orderBy?: AppUserOrderByWithRelationInput | AppUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AppUsers.
     */
    cursor?: AppUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppUsers.
     */
    distinct?: AppUserScalarFieldEnum | AppUserScalarFieldEnum[]
  }

  /**
   * AppUser create
   */
  export type AppUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * The data needed to create a AppUser.
     */
    data: XOR<AppUserCreateInput, AppUserUncheckedCreateInput>
  }

  /**
   * AppUser createMany
   */
  export type AppUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AppUsers.
     */
    data: AppUserCreateManyInput | AppUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppUser update
   */
  export type AppUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * The data needed to update a AppUser.
     */
    data: XOR<AppUserUpdateInput, AppUserUncheckedUpdateInput>
    /**
     * Choose, which AppUser to update.
     */
    where: AppUserWhereUniqueInput
  }

  /**
   * AppUser updateMany
   */
  export type AppUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AppUsers.
     */
    data: XOR<AppUserUpdateManyMutationInput, AppUserUncheckedUpdateManyInput>
    /**
     * Filter which AppUsers to update
     */
    where?: AppUserWhereInput
    /**
     * Limit how many AppUsers to update.
     */
    limit?: number
  }

  /**
   * AppUser upsert
   */
  export type AppUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * The filter to search for the AppUser to update in case it exists.
     */
    where: AppUserWhereUniqueInput
    /**
     * In case the AppUser found by the `where` argument doesn't exist, create a new AppUser with this data.
     */
    create: XOR<AppUserCreateInput, AppUserUncheckedCreateInput>
    /**
     * In case the AppUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppUserUpdateInput, AppUserUncheckedUpdateInput>
  }

  /**
   * AppUser delete
   */
  export type AppUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter which AppUser to delete.
     */
    where: AppUserWhereUniqueInput
  }

  /**
   * AppUser deleteMany
   */
  export type AppUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppUsers to delete
     */
    where?: AppUserWhereInput
    /**
     * Limit how many AppUsers to delete.
     */
    limit?: number
  }

  /**
   * AppUser.savedCafes
   */
  export type AppUser$savedCafesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    where?: UserSavedCafeWhereInput
    orderBy?: UserSavedCafeOrderByWithRelationInput | UserSavedCafeOrderByWithRelationInput[]
    cursor?: UserSavedCafeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSavedCafeScalarFieldEnum | UserSavedCafeScalarFieldEnum[]
  }

  /**
   * AppUser.cafeRecords
   */
  export type AppUser$cafeRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    where?: CafeRecordWhereInput
    orderBy?: CafeRecordOrderByWithRelationInput | CafeRecordOrderByWithRelationInput[]
    cursor?: CafeRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CafeRecordScalarFieldEnum | CafeRecordScalarFieldEnum[]
  }

  /**
   * AppUser without action
   */
  export type AppUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
  }


  /**
   * Model Cafe
   */

  export type AggregateCafe = {
    _count: CafeCountAggregateOutputType | null
    _avg: CafeAvgAggregateOutputType | null
    _sum: CafeSumAggregateOutputType | null
    _min: CafeMinAggregateOutputType | null
    _max: CafeMaxAggregateOutputType | null
  }

  export type CafeAvgAggregateOutputType = {
    latitude: Decimal | null
    longitude: Decimal | null
  }

  export type CafeSumAggregateOutputType = {
    latitude: Decimal | null
    longitude: Decimal | null
  }

  export type CafeMinAggregateOutputType = {
    kakaoPlaceId: string | null
    placeName: string | null
    categoryName: string | null
    phone: string | null
    addressName: string | null
    roadAddressName: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    placeUrl: string | null
    lastFetchedAt: Date | null
    nextRefreshAt: Date | null
    createdAt: Date | null
  }

  export type CafeMaxAggregateOutputType = {
    kakaoPlaceId: string | null
    placeName: string | null
    categoryName: string | null
    phone: string | null
    addressName: string | null
    roadAddressName: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    placeUrl: string | null
    lastFetchedAt: Date | null
    nextRefreshAt: Date | null
    createdAt: Date | null
  }

  export type CafeCountAggregateOutputType = {
    kakaoPlaceId: number
    placeName: number
    categoryName: number
    phone: number
    addressName: number
    roadAddressName: number
    latitude: number
    longitude: number
    placeUrl: number
    lastFetchedAt: number
    nextRefreshAt: number
    createdAt: number
    _all: number
  }


  export type CafeAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type CafeSumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type CafeMinAggregateInputType = {
    kakaoPlaceId?: true
    placeName?: true
    categoryName?: true
    phone?: true
    addressName?: true
    roadAddressName?: true
    latitude?: true
    longitude?: true
    placeUrl?: true
    lastFetchedAt?: true
    nextRefreshAt?: true
    createdAt?: true
  }

  export type CafeMaxAggregateInputType = {
    kakaoPlaceId?: true
    placeName?: true
    categoryName?: true
    phone?: true
    addressName?: true
    roadAddressName?: true
    latitude?: true
    longitude?: true
    placeUrl?: true
    lastFetchedAt?: true
    nextRefreshAt?: true
    createdAt?: true
  }

  export type CafeCountAggregateInputType = {
    kakaoPlaceId?: true
    placeName?: true
    categoryName?: true
    phone?: true
    addressName?: true
    roadAddressName?: true
    latitude?: true
    longitude?: true
    placeUrl?: true
    lastFetchedAt?: true
    nextRefreshAt?: true
    createdAt?: true
    _all?: true
  }

  export type CafeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cafe to aggregate.
     */
    where?: CafeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cafes to fetch.
     */
    orderBy?: CafeOrderByWithRelationInput | CafeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CafeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cafes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cafes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cafes
    **/
    _count?: true | CafeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CafeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CafeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CafeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CafeMaxAggregateInputType
  }

  export type GetCafeAggregateType<T extends CafeAggregateArgs> = {
        [P in keyof T & keyof AggregateCafe]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCafe[P]>
      : GetScalarType<T[P], AggregateCafe[P]>
  }




  export type CafeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CafeWhereInput
    orderBy?: CafeOrderByWithAggregationInput | CafeOrderByWithAggregationInput[]
    by: CafeScalarFieldEnum[] | CafeScalarFieldEnum
    having?: CafeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CafeCountAggregateInputType | true
    _avg?: CafeAvgAggregateInputType
    _sum?: CafeSumAggregateInputType
    _min?: CafeMinAggregateInputType
    _max?: CafeMaxAggregateInputType
  }

  export type CafeGroupByOutputType = {
    kakaoPlaceId: string
    placeName: string
    categoryName: string | null
    phone: string | null
    addressName: string | null
    roadAddressName: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    placeUrl: string | null
    lastFetchedAt: Date
    nextRefreshAt: Date | null
    createdAt: Date
    _count: CafeCountAggregateOutputType | null
    _avg: CafeAvgAggregateOutputType | null
    _sum: CafeSumAggregateOutputType | null
    _min: CafeMinAggregateOutputType | null
    _max: CafeMaxAggregateOutputType | null
  }

  type GetCafeGroupByPayload<T extends CafeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CafeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CafeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CafeGroupByOutputType[P]>
            : GetScalarType<T[P], CafeGroupByOutputType[P]>
        }
      >
    >


  export type CafeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    kakaoPlaceId?: boolean
    placeName?: boolean
    categoryName?: boolean
    phone?: boolean
    addressName?: boolean
    roadAddressName?: boolean
    latitude?: boolean
    longitude?: boolean
    placeUrl?: boolean
    lastFetchedAt?: boolean
    nextRefreshAt?: boolean
    createdAt?: boolean
    savedCafes?: boolean | Cafe$savedCafesArgs<ExtArgs>
    cafeRecords?: boolean | Cafe$cafeRecordsArgs<ExtArgs>
    _count?: boolean | CafeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cafe"]>



  export type CafeSelectScalar = {
    kakaoPlaceId?: boolean
    placeName?: boolean
    categoryName?: boolean
    phone?: boolean
    addressName?: boolean
    roadAddressName?: boolean
    latitude?: boolean
    longitude?: boolean
    placeUrl?: boolean
    lastFetchedAt?: boolean
    nextRefreshAt?: boolean
    createdAt?: boolean
  }

  export type CafeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"kakaoPlaceId" | "placeName" | "categoryName" | "phone" | "addressName" | "roadAddressName" | "latitude" | "longitude" | "placeUrl" | "lastFetchedAt" | "nextRefreshAt" | "createdAt", ExtArgs["result"]["cafe"]>
  export type CafeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedCafes?: boolean | Cafe$savedCafesArgs<ExtArgs>
    cafeRecords?: boolean | Cafe$cafeRecordsArgs<ExtArgs>
    _count?: boolean | CafeCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CafePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cafe"
    objects: {
      savedCafes: Prisma.$UserSavedCafePayload<ExtArgs>[]
      cafeRecords: Prisma.$CafeRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      kakaoPlaceId: string
      placeName: string
      categoryName: string | null
      phone: string | null
      addressName: string | null
      roadAddressName: string | null
      latitude: Prisma.Decimal | null
      longitude: Prisma.Decimal | null
      placeUrl: string | null
      lastFetchedAt: Date
      nextRefreshAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["cafe"]>
    composites: {}
  }

  type CafeGetPayload<S extends boolean | null | undefined | CafeDefaultArgs> = $Result.GetResult<Prisma.$CafePayload, S>

  type CafeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CafeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CafeCountAggregateInputType | true
    }

  export interface CafeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cafe'], meta: { name: 'Cafe' } }
    /**
     * Find zero or one Cafe that matches the filter.
     * @param {CafeFindUniqueArgs} args - Arguments to find a Cafe
     * @example
     * // Get one Cafe
     * const cafe = await prisma.cafe.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CafeFindUniqueArgs>(args: SelectSubset<T, CafeFindUniqueArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cafe that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CafeFindUniqueOrThrowArgs} args - Arguments to find a Cafe
     * @example
     * // Get one Cafe
     * const cafe = await prisma.cafe.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CafeFindUniqueOrThrowArgs>(args: SelectSubset<T, CafeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cafe that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeFindFirstArgs} args - Arguments to find a Cafe
     * @example
     * // Get one Cafe
     * const cafe = await prisma.cafe.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CafeFindFirstArgs>(args?: SelectSubset<T, CafeFindFirstArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cafe that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeFindFirstOrThrowArgs} args - Arguments to find a Cafe
     * @example
     * // Get one Cafe
     * const cafe = await prisma.cafe.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CafeFindFirstOrThrowArgs>(args?: SelectSubset<T, CafeFindFirstOrThrowArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cafes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cafes
     * const cafes = await prisma.cafe.findMany()
     * 
     * // Get first 10 Cafes
     * const cafes = await prisma.cafe.findMany({ take: 10 })
     * 
     * // Only select the `kakaoPlaceId`
     * const cafeWithKakaoPlaceIdOnly = await prisma.cafe.findMany({ select: { kakaoPlaceId: true } })
     * 
     */
    findMany<T extends CafeFindManyArgs>(args?: SelectSubset<T, CafeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cafe.
     * @param {CafeCreateArgs} args - Arguments to create a Cafe.
     * @example
     * // Create one Cafe
     * const Cafe = await prisma.cafe.create({
     *   data: {
     *     // ... data to create a Cafe
     *   }
     * })
     * 
     */
    create<T extends CafeCreateArgs>(args: SelectSubset<T, CafeCreateArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cafes.
     * @param {CafeCreateManyArgs} args - Arguments to create many Cafes.
     * @example
     * // Create many Cafes
     * const cafe = await prisma.cafe.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CafeCreateManyArgs>(args?: SelectSubset<T, CafeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Cafe.
     * @param {CafeDeleteArgs} args - Arguments to delete one Cafe.
     * @example
     * // Delete one Cafe
     * const Cafe = await prisma.cafe.delete({
     *   where: {
     *     // ... filter to delete one Cafe
     *   }
     * })
     * 
     */
    delete<T extends CafeDeleteArgs>(args: SelectSubset<T, CafeDeleteArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cafe.
     * @param {CafeUpdateArgs} args - Arguments to update one Cafe.
     * @example
     * // Update one Cafe
     * const cafe = await prisma.cafe.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CafeUpdateArgs>(args: SelectSubset<T, CafeUpdateArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cafes.
     * @param {CafeDeleteManyArgs} args - Arguments to filter Cafes to delete.
     * @example
     * // Delete a few Cafes
     * const { count } = await prisma.cafe.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CafeDeleteManyArgs>(args?: SelectSubset<T, CafeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cafes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cafes
     * const cafe = await prisma.cafe.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CafeUpdateManyArgs>(args: SelectSubset<T, CafeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Cafe.
     * @param {CafeUpsertArgs} args - Arguments to update or create a Cafe.
     * @example
     * // Update or create a Cafe
     * const cafe = await prisma.cafe.upsert({
     *   create: {
     *     // ... data to create a Cafe
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cafe we want to update
     *   }
     * })
     */
    upsert<T extends CafeUpsertArgs>(args: SelectSubset<T, CafeUpsertArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cafes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeCountArgs} args - Arguments to filter Cafes to count.
     * @example
     * // Count the number of Cafes
     * const count = await prisma.cafe.count({
     *   where: {
     *     // ... the filter for the Cafes we want to count
     *   }
     * })
    **/
    count<T extends CafeCountArgs>(
      args?: Subset<T, CafeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CafeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cafe.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CafeAggregateArgs>(args: Subset<T, CafeAggregateArgs>): Prisma.PrismaPromise<GetCafeAggregateType<T>>

    /**
     * Group by Cafe.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CafeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CafeGroupByArgs['orderBy'] }
        : { orderBy?: CafeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CafeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCafeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cafe model
   */
  readonly fields: CafeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cafe.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CafeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    savedCafes<T extends Cafe$savedCafesArgs<ExtArgs> = {}>(args?: Subset<T, Cafe$savedCafesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    cafeRecords<T extends Cafe$cafeRecordsArgs<ExtArgs> = {}>(args?: Subset<T, Cafe$cafeRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cafe model
   */
  interface CafeFieldRefs {
    readonly kakaoPlaceId: FieldRef<"Cafe", 'String'>
    readonly placeName: FieldRef<"Cafe", 'String'>
    readonly categoryName: FieldRef<"Cafe", 'String'>
    readonly phone: FieldRef<"Cafe", 'String'>
    readonly addressName: FieldRef<"Cafe", 'String'>
    readonly roadAddressName: FieldRef<"Cafe", 'String'>
    readonly latitude: FieldRef<"Cafe", 'Decimal'>
    readonly longitude: FieldRef<"Cafe", 'Decimal'>
    readonly placeUrl: FieldRef<"Cafe", 'String'>
    readonly lastFetchedAt: FieldRef<"Cafe", 'DateTime'>
    readonly nextRefreshAt: FieldRef<"Cafe", 'DateTime'>
    readonly createdAt: FieldRef<"Cafe", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cafe findUnique
   */
  export type CafeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
    /**
     * Filter, which Cafe to fetch.
     */
    where: CafeWhereUniqueInput
  }

  /**
   * Cafe findUniqueOrThrow
   */
  export type CafeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
    /**
     * Filter, which Cafe to fetch.
     */
    where: CafeWhereUniqueInput
  }

  /**
   * Cafe findFirst
   */
  export type CafeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
    /**
     * Filter, which Cafe to fetch.
     */
    where?: CafeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cafes to fetch.
     */
    orderBy?: CafeOrderByWithRelationInput | CafeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cafes.
     */
    cursor?: CafeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cafes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cafes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cafes.
     */
    distinct?: CafeScalarFieldEnum | CafeScalarFieldEnum[]
  }

  /**
   * Cafe findFirstOrThrow
   */
  export type CafeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
    /**
     * Filter, which Cafe to fetch.
     */
    where?: CafeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cafes to fetch.
     */
    orderBy?: CafeOrderByWithRelationInput | CafeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cafes.
     */
    cursor?: CafeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cafes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cafes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cafes.
     */
    distinct?: CafeScalarFieldEnum | CafeScalarFieldEnum[]
  }

  /**
   * Cafe findMany
   */
  export type CafeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
    /**
     * Filter, which Cafes to fetch.
     */
    where?: CafeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cafes to fetch.
     */
    orderBy?: CafeOrderByWithRelationInput | CafeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cafes.
     */
    cursor?: CafeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cafes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cafes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cafes.
     */
    distinct?: CafeScalarFieldEnum | CafeScalarFieldEnum[]
  }

  /**
   * Cafe create
   */
  export type CafeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
    /**
     * The data needed to create a Cafe.
     */
    data: XOR<CafeCreateInput, CafeUncheckedCreateInput>
  }

  /**
   * Cafe createMany
   */
  export type CafeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cafes.
     */
    data: CafeCreateManyInput | CafeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cafe update
   */
  export type CafeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
    /**
     * The data needed to update a Cafe.
     */
    data: XOR<CafeUpdateInput, CafeUncheckedUpdateInput>
    /**
     * Choose, which Cafe to update.
     */
    where: CafeWhereUniqueInput
  }

  /**
   * Cafe updateMany
   */
  export type CafeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cafes.
     */
    data: XOR<CafeUpdateManyMutationInput, CafeUncheckedUpdateManyInput>
    /**
     * Filter which Cafes to update
     */
    where?: CafeWhereInput
    /**
     * Limit how many Cafes to update.
     */
    limit?: number
  }

  /**
   * Cafe upsert
   */
  export type CafeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
    /**
     * The filter to search for the Cafe to update in case it exists.
     */
    where: CafeWhereUniqueInput
    /**
     * In case the Cafe found by the `where` argument doesn't exist, create a new Cafe with this data.
     */
    create: XOR<CafeCreateInput, CafeUncheckedCreateInput>
    /**
     * In case the Cafe was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CafeUpdateInput, CafeUncheckedUpdateInput>
  }

  /**
   * Cafe delete
   */
  export type CafeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
    /**
     * Filter which Cafe to delete.
     */
    where: CafeWhereUniqueInput
  }

  /**
   * Cafe deleteMany
   */
  export type CafeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cafes to delete
     */
    where?: CafeWhereInput
    /**
     * Limit how many Cafes to delete.
     */
    limit?: number
  }

  /**
   * Cafe.savedCafes
   */
  export type Cafe$savedCafesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    where?: UserSavedCafeWhereInput
    orderBy?: UserSavedCafeOrderByWithRelationInput | UserSavedCafeOrderByWithRelationInput[]
    cursor?: UserSavedCafeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSavedCafeScalarFieldEnum | UserSavedCafeScalarFieldEnum[]
  }

  /**
   * Cafe.cafeRecords
   */
  export type Cafe$cafeRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    where?: CafeRecordWhereInput
    orderBy?: CafeRecordOrderByWithRelationInput | CafeRecordOrderByWithRelationInput[]
    cursor?: CafeRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CafeRecordScalarFieldEnum | CafeRecordScalarFieldEnum[]
  }

  /**
   * Cafe without action
   */
  export type CafeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cafe
     */
    select?: CafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cafe
     */
    omit?: CafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeInclude<ExtArgs> | null
  }


  /**
   * Model UserSavedCafe
   */

  export type AggregateUserSavedCafe = {
    _count: UserSavedCafeCountAggregateOutputType | null
    _avg: UserSavedCafeAvgAggregateOutputType | null
    _sum: UserSavedCafeSumAggregateOutputType | null
    _min: UserSavedCafeMinAggregateOutputType | null
    _max: UserSavedCafeMaxAggregateOutputType | null
  }

  export type UserSavedCafeAvgAggregateOutputType = {
    id: number | null
    appUserId: number | null
  }

  export type UserSavedCafeSumAggregateOutputType = {
    id: bigint | null
    appUserId: bigint | null
  }

  export type UserSavedCafeMinAggregateOutputType = {
    id: bigint | null
    appUserId: bigint | null
    kakaoPlaceId: string | null
    savedType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserSavedCafeMaxAggregateOutputType = {
    id: bigint | null
    appUserId: bigint | null
    kakaoPlaceId: string | null
    savedType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserSavedCafeCountAggregateOutputType = {
    id: number
    appUserId: number
    kakaoPlaceId: number
    savedType: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserSavedCafeAvgAggregateInputType = {
    id?: true
    appUserId?: true
  }

  export type UserSavedCafeSumAggregateInputType = {
    id?: true
    appUserId?: true
  }

  export type UserSavedCafeMinAggregateInputType = {
    id?: true
    appUserId?: true
    kakaoPlaceId?: true
    savedType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserSavedCafeMaxAggregateInputType = {
    id?: true
    appUserId?: true
    kakaoPlaceId?: true
    savedType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserSavedCafeCountAggregateInputType = {
    id?: true
    appUserId?: true
    kakaoPlaceId?: true
    savedType?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserSavedCafeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSavedCafe to aggregate.
     */
    where?: UserSavedCafeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSavedCafes to fetch.
     */
    orderBy?: UserSavedCafeOrderByWithRelationInput | UserSavedCafeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSavedCafeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSavedCafes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSavedCafes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSavedCafes
    **/
    _count?: true | UserSavedCafeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserSavedCafeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSavedCafeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSavedCafeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSavedCafeMaxAggregateInputType
  }

  export type GetUserSavedCafeAggregateType<T extends UserSavedCafeAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSavedCafe]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSavedCafe[P]>
      : GetScalarType<T[P], AggregateUserSavedCafe[P]>
  }




  export type UserSavedCafeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSavedCafeWhereInput
    orderBy?: UserSavedCafeOrderByWithAggregationInput | UserSavedCafeOrderByWithAggregationInput[]
    by: UserSavedCafeScalarFieldEnum[] | UserSavedCafeScalarFieldEnum
    having?: UserSavedCafeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSavedCafeCountAggregateInputType | true
    _avg?: UserSavedCafeAvgAggregateInputType
    _sum?: UserSavedCafeSumAggregateInputType
    _min?: UserSavedCafeMinAggregateInputType
    _max?: UserSavedCafeMaxAggregateInputType
  }

  export type UserSavedCafeGroupByOutputType = {
    id: bigint
    appUserId: bigint
    kakaoPlaceId: string
    savedType: string
    createdAt: Date
    updatedAt: Date
    _count: UserSavedCafeCountAggregateOutputType | null
    _avg: UserSavedCafeAvgAggregateOutputType | null
    _sum: UserSavedCafeSumAggregateOutputType | null
    _min: UserSavedCafeMinAggregateOutputType | null
    _max: UserSavedCafeMaxAggregateOutputType | null
  }

  type GetUserSavedCafeGroupByPayload<T extends UserSavedCafeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSavedCafeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSavedCafeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSavedCafeGroupByOutputType[P]>
            : GetScalarType<T[P], UserSavedCafeGroupByOutputType[P]>
        }
      >
    >


  export type UserSavedCafeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appUserId?: boolean
    kakaoPlaceId?: boolean
    savedType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appUser?: boolean | AppUserDefaultArgs<ExtArgs>
    cafe?: boolean | CafeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSavedCafe"]>



  export type UserSavedCafeSelectScalar = {
    id?: boolean
    appUserId?: boolean
    kakaoPlaceId?: boolean
    savedType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserSavedCafeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "appUserId" | "kakaoPlaceId" | "savedType" | "createdAt" | "updatedAt", ExtArgs["result"]["userSavedCafe"]>
  export type UserSavedCafeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appUser?: boolean | AppUserDefaultArgs<ExtArgs>
    cafe?: boolean | CafeDefaultArgs<ExtArgs>
  }

  export type $UserSavedCafePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSavedCafe"
    objects: {
      appUser: Prisma.$AppUserPayload<ExtArgs>
      cafe: Prisma.$CafePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      appUserId: bigint
      kakaoPlaceId: string
      savedType: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userSavedCafe"]>
    composites: {}
  }

  type UserSavedCafeGetPayload<S extends boolean | null | undefined | UserSavedCafeDefaultArgs> = $Result.GetResult<Prisma.$UserSavedCafePayload, S>

  type UserSavedCafeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserSavedCafeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserSavedCafeCountAggregateInputType | true
    }

  export interface UserSavedCafeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSavedCafe'], meta: { name: 'UserSavedCafe' } }
    /**
     * Find zero or one UserSavedCafe that matches the filter.
     * @param {UserSavedCafeFindUniqueArgs} args - Arguments to find a UserSavedCafe
     * @example
     * // Get one UserSavedCafe
     * const userSavedCafe = await prisma.userSavedCafe.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSavedCafeFindUniqueArgs>(args: SelectSubset<T, UserSavedCafeFindUniqueArgs<ExtArgs>>): Prisma__UserSavedCafeClient<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserSavedCafe that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserSavedCafeFindUniqueOrThrowArgs} args - Arguments to find a UserSavedCafe
     * @example
     * // Get one UserSavedCafe
     * const userSavedCafe = await prisma.userSavedCafe.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSavedCafeFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSavedCafeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSavedCafeClient<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSavedCafe that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSavedCafeFindFirstArgs} args - Arguments to find a UserSavedCafe
     * @example
     * // Get one UserSavedCafe
     * const userSavedCafe = await prisma.userSavedCafe.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSavedCafeFindFirstArgs>(args?: SelectSubset<T, UserSavedCafeFindFirstArgs<ExtArgs>>): Prisma__UserSavedCafeClient<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSavedCafe that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSavedCafeFindFirstOrThrowArgs} args - Arguments to find a UserSavedCafe
     * @example
     * // Get one UserSavedCafe
     * const userSavedCafe = await prisma.userSavedCafe.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSavedCafeFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSavedCafeFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSavedCafeClient<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserSavedCafes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSavedCafeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSavedCafes
     * const userSavedCafes = await prisma.userSavedCafe.findMany()
     * 
     * // Get first 10 UserSavedCafes
     * const userSavedCafes = await prisma.userSavedCafe.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSavedCafeWithIdOnly = await prisma.userSavedCafe.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSavedCafeFindManyArgs>(args?: SelectSubset<T, UserSavedCafeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserSavedCafe.
     * @param {UserSavedCafeCreateArgs} args - Arguments to create a UserSavedCafe.
     * @example
     * // Create one UserSavedCafe
     * const UserSavedCafe = await prisma.userSavedCafe.create({
     *   data: {
     *     // ... data to create a UserSavedCafe
     *   }
     * })
     * 
     */
    create<T extends UserSavedCafeCreateArgs>(args: SelectSubset<T, UserSavedCafeCreateArgs<ExtArgs>>): Prisma__UserSavedCafeClient<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserSavedCafes.
     * @param {UserSavedCafeCreateManyArgs} args - Arguments to create many UserSavedCafes.
     * @example
     * // Create many UserSavedCafes
     * const userSavedCafe = await prisma.userSavedCafe.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSavedCafeCreateManyArgs>(args?: SelectSubset<T, UserSavedCafeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserSavedCafe.
     * @param {UserSavedCafeDeleteArgs} args - Arguments to delete one UserSavedCafe.
     * @example
     * // Delete one UserSavedCafe
     * const UserSavedCafe = await prisma.userSavedCafe.delete({
     *   where: {
     *     // ... filter to delete one UserSavedCafe
     *   }
     * })
     * 
     */
    delete<T extends UserSavedCafeDeleteArgs>(args: SelectSubset<T, UserSavedCafeDeleteArgs<ExtArgs>>): Prisma__UserSavedCafeClient<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserSavedCafe.
     * @param {UserSavedCafeUpdateArgs} args - Arguments to update one UserSavedCafe.
     * @example
     * // Update one UserSavedCafe
     * const userSavedCafe = await prisma.userSavedCafe.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSavedCafeUpdateArgs>(args: SelectSubset<T, UserSavedCafeUpdateArgs<ExtArgs>>): Prisma__UserSavedCafeClient<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserSavedCafes.
     * @param {UserSavedCafeDeleteManyArgs} args - Arguments to filter UserSavedCafes to delete.
     * @example
     * // Delete a few UserSavedCafes
     * const { count } = await prisma.userSavedCafe.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSavedCafeDeleteManyArgs>(args?: SelectSubset<T, UserSavedCafeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSavedCafes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSavedCafeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSavedCafes
     * const userSavedCafe = await prisma.userSavedCafe.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSavedCafeUpdateManyArgs>(args: SelectSubset<T, UserSavedCafeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserSavedCafe.
     * @param {UserSavedCafeUpsertArgs} args - Arguments to update or create a UserSavedCafe.
     * @example
     * // Update or create a UserSavedCafe
     * const userSavedCafe = await prisma.userSavedCafe.upsert({
     *   create: {
     *     // ... data to create a UserSavedCafe
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSavedCafe we want to update
     *   }
     * })
     */
    upsert<T extends UserSavedCafeUpsertArgs>(args: SelectSubset<T, UserSavedCafeUpsertArgs<ExtArgs>>): Prisma__UserSavedCafeClient<$Result.GetResult<Prisma.$UserSavedCafePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserSavedCafes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSavedCafeCountArgs} args - Arguments to filter UserSavedCafes to count.
     * @example
     * // Count the number of UserSavedCafes
     * const count = await prisma.userSavedCafe.count({
     *   where: {
     *     // ... the filter for the UserSavedCafes we want to count
     *   }
     * })
    **/
    count<T extends UserSavedCafeCountArgs>(
      args?: Subset<T, UserSavedCafeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSavedCafeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSavedCafe.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSavedCafeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSavedCafeAggregateArgs>(args: Subset<T, UserSavedCafeAggregateArgs>): Prisma.PrismaPromise<GetUserSavedCafeAggregateType<T>>

    /**
     * Group by UserSavedCafe.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSavedCafeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSavedCafeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSavedCafeGroupByArgs['orderBy'] }
        : { orderBy?: UserSavedCafeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSavedCafeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSavedCafeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSavedCafe model
   */
  readonly fields: UserSavedCafeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSavedCafe.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSavedCafeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appUser<T extends AppUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AppUserDefaultArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    cafe<T extends CafeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CafeDefaultArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSavedCafe model
   */
  interface UserSavedCafeFieldRefs {
    readonly id: FieldRef<"UserSavedCafe", 'BigInt'>
    readonly appUserId: FieldRef<"UserSavedCafe", 'BigInt'>
    readonly kakaoPlaceId: FieldRef<"UserSavedCafe", 'String'>
    readonly savedType: FieldRef<"UserSavedCafe", 'String'>
    readonly createdAt: FieldRef<"UserSavedCafe", 'DateTime'>
    readonly updatedAt: FieldRef<"UserSavedCafe", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserSavedCafe findUnique
   */
  export type UserSavedCafeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    /**
     * Filter, which UserSavedCafe to fetch.
     */
    where: UserSavedCafeWhereUniqueInput
  }

  /**
   * UserSavedCafe findUniqueOrThrow
   */
  export type UserSavedCafeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    /**
     * Filter, which UserSavedCafe to fetch.
     */
    where: UserSavedCafeWhereUniqueInput
  }

  /**
   * UserSavedCafe findFirst
   */
  export type UserSavedCafeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    /**
     * Filter, which UserSavedCafe to fetch.
     */
    where?: UserSavedCafeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSavedCafes to fetch.
     */
    orderBy?: UserSavedCafeOrderByWithRelationInput | UserSavedCafeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSavedCafes.
     */
    cursor?: UserSavedCafeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSavedCafes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSavedCafes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSavedCafes.
     */
    distinct?: UserSavedCafeScalarFieldEnum | UserSavedCafeScalarFieldEnum[]
  }

  /**
   * UserSavedCafe findFirstOrThrow
   */
  export type UserSavedCafeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    /**
     * Filter, which UserSavedCafe to fetch.
     */
    where?: UserSavedCafeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSavedCafes to fetch.
     */
    orderBy?: UserSavedCafeOrderByWithRelationInput | UserSavedCafeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSavedCafes.
     */
    cursor?: UserSavedCafeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSavedCafes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSavedCafes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSavedCafes.
     */
    distinct?: UserSavedCafeScalarFieldEnum | UserSavedCafeScalarFieldEnum[]
  }

  /**
   * UserSavedCafe findMany
   */
  export type UserSavedCafeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    /**
     * Filter, which UserSavedCafes to fetch.
     */
    where?: UserSavedCafeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSavedCafes to fetch.
     */
    orderBy?: UserSavedCafeOrderByWithRelationInput | UserSavedCafeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSavedCafes.
     */
    cursor?: UserSavedCafeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSavedCafes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSavedCafes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSavedCafes.
     */
    distinct?: UserSavedCafeScalarFieldEnum | UserSavedCafeScalarFieldEnum[]
  }

  /**
   * UserSavedCafe create
   */
  export type UserSavedCafeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSavedCafe.
     */
    data: XOR<UserSavedCafeCreateInput, UserSavedCafeUncheckedCreateInput>
  }

  /**
   * UserSavedCafe createMany
   */
  export type UserSavedCafeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSavedCafes.
     */
    data: UserSavedCafeCreateManyInput | UserSavedCafeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSavedCafe update
   */
  export type UserSavedCafeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSavedCafe.
     */
    data: XOR<UserSavedCafeUpdateInput, UserSavedCafeUncheckedUpdateInput>
    /**
     * Choose, which UserSavedCafe to update.
     */
    where: UserSavedCafeWhereUniqueInput
  }

  /**
   * UserSavedCafe updateMany
   */
  export type UserSavedCafeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSavedCafes.
     */
    data: XOR<UserSavedCafeUpdateManyMutationInput, UserSavedCafeUncheckedUpdateManyInput>
    /**
     * Filter which UserSavedCafes to update
     */
    where?: UserSavedCafeWhereInput
    /**
     * Limit how many UserSavedCafes to update.
     */
    limit?: number
  }

  /**
   * UserSavedCafe upsert
   */
  export type UserSavedCafeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSavedCafe to update in case it exists.
     */
    where: UserSavedCafeWhereUniqueInput
    /**
     * In case the UserSavedCafe found by the `where` argument doesn't exist, create a new UserSavedCafe with this data.
     */
    create: XOR<UserSavedCafeCreateInput, UserSavedCafeUncheckedCreateInput>
    /**
     * In case the UserSavedCafe was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSavedCafeUpdateInput, UserSavedCafeUncheckedUpdateInput>
  }

  /**
   * UserSavedCafe delete
   */
  export type UserSavedCafeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
    /**
     * Filter which UserSavedCafe to delete.
     */
    where: UserSavedCafeWhereUniqueInput
  }

  /**
   * UserSavedCafe deleteMany
   */
  export type UserSavedCafeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSavedCafes to delete
     */
    where?: UserSavedCafeWhereInput
    /**
     * Limit how many UserSavedCafes to delete.
     */
    limit?: number
  }

  /**
   * UserSavedCafe without action
   */
  export type UserSavedCafeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSavedCafe
     */
    select?: UserSavedCafeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSavedCafe
     */
    omit?: UserSavedCafeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSavedCafeInclude<ExtArgs> | null
  }


  /**
   * Model CafeRecord
   */

  export type AggregateCafeRecord = {
    _count: CafeRecordCountAggregateOutputType | null
    _avg: CafeRecordAvgAggregateOutputType | null
    _sum: CafeRecordSumAggregateOutputType | null
    _min: CafeRecordMinAggregateOutputType | null
    _max: CafeRecordMaxAggregateOutputType | null
  }

  export type CafeRecordAvgAggregateOutputType = {
    id: number | null
    appUserId: number | null
    displayOrder: number | null
  }

  export type CafeRecordSumAggregateOutputType = {
    id: bigint | null
    appUserId: bigint | null
    displayOrder: number | null
  }

  export type CafeRecordMinAggregateOutputType = {
    id: bigint | null
    appUserId: bigint | null
    kakaoPlaceId: string | null
    recordType: string | null
    displayOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CafeRecordMaxAggregateOutputType = {
    id: bigint | null
    appUserId: bigint | null
    kakaoPlaceId: string | null
    recordType: string | null
    displayOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CafeRecordCountAggregateOutputType = {
    id: number
    appUserId: number
    kakaoPlaceId: number
    recordType: number
    displayOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CafeRecordAvgAggregateInputType = {
    id?: true
    appUserId?: true
    displayOrder?: true
  }

  export type CafeRecordSumAggregateInputType = {
    id?: true
    appUserId?: true
    displayOrder?: true
  }

  export type CafeRecordMinAggregateInputType = {
    id?: true
    appUserId?: true
    kakaoPlaceId?: true
    recordType?: true
    displayOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CafeRecordMaxAggregateInputType = {
    id?: true
    appUserId?: true
    kakaoPlaceId?: true
    recordType?: true
    displayOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CafeRecordCountAggregateInputType = {
    id?: true
    appUserId?: true
    kakaoPlaceId?: true
    recordType?: true
    displayOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CafeRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CafeRecord to aggregate.
     */
    where?: CafeRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CafeRecords to fetch.
     */
    orderBy?: CafeRecordOrderByWithRelationInput | CafeRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CafeRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CafeRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CafeRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CafeRecords
    **/
    _count?: true | CafeRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CafeRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CafeRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CafeRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CafeRecordMaxAggregateInputType
  }

  export type GetCafeRecordAggregateType<T extends CafeRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateCafeRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCafeRecord[P]>
      : GetScalarType<T[P], AggregateCafeRecord[P]>
  }




  export type CafeRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CafeRecordWhereInput
    orderBy?: CafeRecordOrderByWithAggregationInput | CafeRecordOrderByWithAggregationInput[]
    by: CafeRecordScalarFieldEnum[] | CafeRecordScalarFieldEnum
    having?: CafeRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CafeRecordCountAggregateInputType | true
    _avg?: CafeRecordAvgAggregateInputType
    _sum?: CafeRecordSumAggregateInputType
    _min?: CafeRecordMinAggregateInputType
    _max?: CafeRecordMaxAggregateInputType
  }

  export type CafeRecordGroupByOutputType = {
    id: bigint
    appUserId: bigint
    kakaoPlaceId: string
    recordType: string
    displayOrder: number
    createdAt: Date
    updatedAt: Date
    _count: CafeRecordCountAggregateOutputType | null
    _avg: CafeRecordAvgAggregateOutputType | null
    _sum: CafeRecordSumAggregateOutputType | null
    _min: CafeRecordMinAggregateOutputType | null
    _max: CafeRecordMaxAggregateOutputType | null
  }

  type GetCafeRecordGroupByPayload<T extends CafeRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CafeRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CafeRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CafeRecordGroupByOutputType[P]>
            : GetScalarType<T[P], CafeRecordGroupByOutputType[P]>
        }
      >
    >


  export type CafeRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appUserId?: boolean
    kakaoPlaceId?: boolean
    recordType?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appUser?: boolean | AppUserDefaultArgs<ExtArgs>
    cafe?: boolean | CafeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cafeRecord"]>



  export type CafeRecordSelectScalar = {
    id?: boolean
    appUserId?: boolean
    kakaoPlaceId?: boolean
    recordType?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CafeRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "appUserId" | "kakaoPlaceId" | "recordType" | "displayOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["cafeRecord"]>
  export type CafeRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appUser?: boolean | AppUserDefaultArgs<ExtArgs>
    cafe?: boolean | CafeDefaultArgs<ExtArgs>
  }

  export type $CafeRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CafeRecord"
    objects: {
      appUser: Prisma.$AppUserPayload<ExtArgs>
      cafe: Prisma.$CafePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      appUserId: bigint
      kakaoPlaceId: string
      recordType: string
      displayOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cafeRecord"]>
    composites: {}
  }

  type CafeRecordGetPayload<S extends boolean | null | undefined | CafeRecordDefaultArgs> = $Result.GetResult<Prisma.$CafeRecordPayload, S>

  type CafeRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CafeRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CafeRecordCountAggregateInputType | true
    }

  export interface CafeRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CafeRecord'], meta: { name: 'CafeRecord' } }
    /**
     * Find zero or one CafeRecord that matches the filter.
     * @param {CafeRecordFindUniqueArgs} args - Arguments to find a CafeRecord
     * @example
     * // Get one CafeRecord
     * const cafeRecord = await prisma.cafeRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CafeRecordFindUniqueArgs>(args: SelectSubset<T, CafeRecordFindUniqueArgs<ExtArgs>>): Prisma__CafeRecordClient<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CafeRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CafeRecordFindUniqueOrThrowArgs} args - Arguments to find a CafeRecord
     * @example
     * // Get one CafeRecord
     * const cafeRecord = await prisma.cafeRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CafeRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, CafeRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CafeRecordClient<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CafeRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeRecordFindFirstArgs} args - Arguments to find a CafeRecord
     * @example
     * // Get one CafeRecord
     * const cafeRecord = await prisma.cafeRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CafeRecordFindFirstArgs>(args?: SelectSubset<T, CafeRecordFindFirstArgs<ExtArgs>>): Prisma__CafeRecordClient<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CafeRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeRecordFindFirstOrThrowArgs} args - Arguments to find a CafeRecord
     * @example
     * // Get one CafeRecord
     * const cafeRecord = await prisma.cafeRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CafeRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, CafeRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__CafeRecordClient<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CafeRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CafeRecords
     * const cafeRecords = await prisma.cafeRecord.findMany()
     * 
     * // Get first 10 CafeRecords
     * const cafeRecords = await prisma.cafeRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cafeRecordWithIdOnly = await prisma.cafeRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CafeRecordFindManyArgs>(args?: SelectSubset<T, CafeRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CafeRecord.
     * @param {CafeRecordCreateArgs} args - Arguments to create a CafeRecord.
     * @example
     * // Create one CafeRecord
     * const CafeRecord = await prisma.cafeRecord.create({
     *   data: {
     *     // ... data to create a CafeRecord
     *   }
     * })
     * 
     */
    create<T extends CafeRecordCreateArgs>(args: SelectSubset<T, CafeRecordCreateArgs<ExtArgs>>): Prisma__CafeRecordClient<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CafeRecords.
     * @param {CafeRecordCreateManyArgs} args - Arguments to create many CafeRecords.
     * @example
     * // Create many CafeRecords
     * const cafeRecord = await prisma.cafeRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CafeRecordCreateManyArgs>(args?: SelectSubset<T, CafeRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CafeRecord.
     * @param {CafeRecordDeleteArgs} args - Arguments to delete one CafeRecord.
     * @example
     * // Delete one CafeRecord
     * const CafeRecord = await prisma.cafeRecord.delete({
     *   where: {
     *     // ... filter to delete one CafeRecord
     *   }
     * })
     * 
     */
    delete<T extends CafeRecordDeleteArgs>(args: SelectSubset<T, CafeRecordDeleteArgs<ExtArgs>>): Prisma__CafeRecordClient<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CafeRecord.
     * @param {CafeRecordUpdateArgs} args - Arguments to update one CafeRecord.
     * @example
     * // Update one CafeRecord
     * const cafeRecord = await prisma.cafeRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CafeRecordUpdateArgs>(args: SelectSubset<T, CafeRecordUpdateArgs<ExtArgs>>): Prisma__CafeRecordClient<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CafeRecords.
     * @param {CafeRecordDeleteManyArgs} args - Arguments to filter CafeRecords to delete.
     * @example
     * // Delete a few CafeRecords
     * const { count } = await prisma.cafeRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CafeRecordDeleteManyArgs>(args?: SelectSubset<T, CafeRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CafeRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CafeRecords
     * const cafeRecord = await prisma.cafeRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CafeRecordUpdateManyArgs>(args: SelectSubset<T, CafeRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CafeRecord.
     * @param {CafeRecordUpsertArgs} args - Arguments to update or create a CafeRecord.
     * @example
     * // Update or create a CafeRecord
     * const cafeRecord = await prisma.cafeRecord.upsert({
     *   create: {
     *     // ... data to create a CafeRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CafeRecord we want to update
     *   }
     * })
     */
    upsert<T extends CafeRecordUpsertArgs>(args: SelectSubset<T, CafeRecordUpsertArgs<ExtArgs>>): Prisma__CafeRecordClient<$Result.GetResult<Prisma.$CafeRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CafeRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeRecordCountArgs} args - Arguments to filter CafeRecords to count.
     * @example
     * // Count the number of CafeRecords
     * const count = await prisma.cafeRecord.count({
     *   where: {
     *     // ... the filter for the CafeRecords we want to count
     *   }
     * })
    **/
    count<T extends CafeRecordCountArgs>(
      args?: Subset<T, CafeRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CafeRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CafeRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CafeRecordAggregateArgs>(args: Subset<T, CafeRecordAggregateArgs>): Prisma.PrismaPromise<GetCafeRecordAggregateType<T>>

    /**
     * Group by CafeRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CafeRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CafeRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CafeRecordGroupByArgs['orderBy'] }
        : { orderBy?: CafeRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CafeRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCafeRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CafeRecord model
   */
  readonly fields: CafeRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CafeRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CafeRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appUser<T extends AppUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AppUserDefaultArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    cafe<T extends CafeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CafeDefaultArgs<ExtArgs>>): Prisma__CafeClient<$Result.GetResult<Prisma.$CafePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CafeRecord model
   */
  interface CafeRecordFieldRefs {
    readonly id: FieldRef<"CafeRecord", 'BigInt'>
    readonly appUserId: FieldRef<"CafeRecord", 'BigInt'>
    readonly kakaoPlaceId: FieldRef<"CafeRecord", 'String'>
    readonly recordType: FieldRef<"CafeRecord", 'String'>
    readonly displayOrder: FieldRef<"CafeRecord", 'Int'>
    readonly createdAt: FieldRef<"CafeRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"CafeRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CafeRecord findUnique
   */
  export type CafeRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    /**
     * Filter, which CafeRecord to fetch.
     */
    where: CafeRecordWhereUniqueInput
  }

  /**
   * CafeRecord findUniqueOrThrow
   */
  export type CafeRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    /**
     * Filter, which CafeRecord to fetch.
     */
    where: CafeRecordWhereUniqueInput
  }

  /**
   * CafeRecord findFirst
   */
  export type CafeRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    /**
     * Filter, which CafeRecord to fetch.
     */
    where?: CafeRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CafeRecords to fetch.
     */
    orderBy?: CafeRecordOrderByWithRelationInput | CafeRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CafeRecords.
     */
    cursor?: CafeRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CafeRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CafeRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CafeRecords.
     */
    distinct?: CafeRecordScalarFieldEnum | CafeRecordScalarFieldEnum[]
  }

  /**
   * CafeRecord findFirstOrThrow
   */
  export type CafeRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    /**
     * Filter, which CafeRecord to fetch.
     */
    where?: CafeRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CafeRecords to fetch.
     */
    orderBy?: CafeRecordOrderByWithRelationInput | CafeRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CafeRecords.
     */
    cursor?: CafeRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CafeRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CafeRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CafeRecords.
     */
    distinct?: CafeRecordScalarFieldEnum | CafeRecordScalarFieldEnum[]
  }

  /**
   * CafeRecord findMany
   */
  export type CafeRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    /**
     * Filter, which CafeRecords to fetch.
     */
    where?: CafeRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CafeRecords to fetch.
     */
    orderBy?: CafeRecordOrderByWithRelationInput | CafeRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CafeRecords.
     */
    cursor?: CafeRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CafeRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CafeRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CafeRecords.
     */
    distinct?: CafeRecordScalarFieldEnum | CafeRecordScalarFieldEnum[]
  }

  /**
   * CafeRecord create
   */
  export type CafeRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a CafeRecord.
     */
    data: XOR<CafeRecordCreateInput, CafeRecordUncheckedCreateInput>
  }

  /**
   * CafeRecord createMany
   */
  export type CafeRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CafeRecords.
     */
    data: CafeRecordCreateManyInput | CafeRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CafeRecord update
   */
  export type CafeRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a CafeRecord.
     */
    data: XOR<CafeRecordUpdateInput, CafeRecordUncheckedUpdateInput>
    /**
     * Choose, which CafeRecord to update.
     */
    where: CafeRecordWhereUniqueInput
  }

  /**
   * CafeRecord updateMany
   */
  export type CafeRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CafeRecords.
     */
    data: XOR<CafeRecordUpdateManyMutationInput, CafeRecordUncheckedUpdateManyInput>
    /**
     * Filter which CafeRecords to update
     */
    where?: CafeRecordWhereInput
    /**
     * Limit how many CafeRecords to update.
     */
    limit?: number
  }

  /**
   * CafeRecord upsert
   */
  export type CafeRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the CafeRecord to update in case it exists.
     */
    where: CafeRecordWhereUniqueInput
    /**
     * In case the CafeRecord found by the `where` argument doesn't exist, create a new CafeRecord with this data.
     */
    create: XOR<CafeRecordCreateInput, CafeRecordUncheckedCreateInput>
    /**
     * In case the CafeRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CafeRecordUpdateInput, CafeRecordUncheckedUpdateInput>
  }

  /**
   * CafeRecord delete
   */
  export type CafeRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
    /**
     * Filter which CafeRecord to delete.
     */
    where: CafeRecordWhereUniqueInput
  }

  /**
   * CafeRecord deleteMany
   */
  export type CafeRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CafeRecords to delete
     */
    where?: CafeRecordWhereInput
    /**
     * Limit how many CafeRecords to delete.
     */
    limit?: number
  }

  /**
   * CafeRecord without action
   */
  export type CafeRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CafeRecord
     */
    select?: CafeRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CafeRecord
     */
    omit?: CafeRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CafeRecordInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AppUserScalarFieldEnum: {
    id: 'id',
    authProvider: 'authProvider',
    providerUserId: 'providerUserId',
    email: 'email',
    nickname: 'nickname',
    displayName: 'displayName',
    profileImageUrl: 'profileImageUrl',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastLoginAt: 'lastLoginAt'
  };

  export type AppUserScalarFieldEnum = (typeof AppUserScalarFieldEnum)[keyof typeof AppUserScalarFieldEnum]


  export const CafeScalarFieldEnum: {
    kakaoPlaceId: 'kakaoPlaceId',
    placeName: 'placeName',
    categoryName: 'categoryName',
    phone: 'phone',
    addressName: 'addressName',
    roadAddressName: 'roadAddressName',
    latitude: 'latitude',
    longitude: 'longitude',
    placeUrl: 'placeUrl',
    lastFetchedAt: 'lastFetchedAt',
    nextRefreshAt: 'nextRefreshAt',
    createdAt: 'createdAt'
  };

  export type CafeScalarFieldEnum = (typeof CafeScalarFieldEnum)[keyof typeof CafeScalarFieldEnum]


  export const UserSavedCafeScalarFieldEnum: {
    id: 'id',
    appUserId: 'appUserId',
    kakaoPlaceId: 'kakaoPlaceId',
    savedType: 'savedType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserSavedCafeScalarFieldEnum = (typeof UserSavedCafeScalarFieldEnum)[keyof typeof UserSavedCafeScalarFieldEnum]


  export const CafeRecordScalarFieldEnum: {
    id: 'id',
    appUserId: 'appUserId',
    kakaoPlaceId: 'kakaoPlaceId',
    recordType: 'recordType',
    displayOrder: 'displayOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CafeRecordScalarFieldEnum = (typeof CafeRecordScalarFieldEnum)[keyof typeof CafeRecordScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const AppUserOrderByRelevanceFieldEnum: {
    authProvider: 'authProvider',
    providerUserId: 'providerUserId',
    email: 'email',
    nickname: 'nickname',
    displayName: 'displayName',
    profileImageUrl: 'profileImageUrl',
    role: 'role'
  };

  export type AppUserOrderByRelevanceFieldEnum = (typeof AppUserOrderByRelevanceFieldEnum)[keyof typeof AppUserOrderByRelevanceFieldEnum]


  export const CafeOrderByRelevanceFieldEnum: {
    kakaoPlaceId: 'kakaoPlaceId',
    placeName: 'placeName',
    categoryName: 'categoryName',
    phone: 'phone',
    addressName: 'addressName',
    roadAddressName: 'roadAddressName',
    placeUrl: 'placeUrl'
  };

  export type CafeOrderByRelevanceFieldEnum = (typeof CafeOrderByRelevanceFieldEnum)[keyof typeof CafeOrderByRelevanceFieldEnum]


  export const UserSavedCafeOrderByRelevanceFieldEnum: {
    kakaoPlaceId: 'kakaoPlaceId',
    savedType: 'savedType'
  };

  export type UserSavedCafeOrderByRelevanceFieldEnum = (typeof UserSavedCafeOrderByRelevanceFieldEnum)[keyof typeof UserSavedCafeOrderByRelevanceFieldEnum]


  export const CafeRecordOrderByRelevanceFieldEnum: {
    kakaoPlaceId: 'kakaoPlaceId',
    recordType: 'recordType'
  };

  export type CafeRecordOrderByRelevanceFieldEnum = (typeof CafeRecordOrderByRelevanceFieldEnum)[keyof typeof CafeRecordOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type AppUserWhereInput = {
    AND?: AppUserWhereInput | AppUserWhereInput[]
    OR?: AppUserWhereInput[]
    NOT?: AppUserWhereInput | AppUserWhereInput[]
    id?: BigIntFilter<"AppUser"> | bigint | number
    authProvider?: StringFilter<"AppUser"> | string
    providerUserId?: StringFilter<"AppUser"> | string
    email?: StringNullableFilter<"AppUser"> | string | null
    nickname?: StringFilter<"AppUser"> | string
    displayName?: StringNullableFilter<"AppUser"> | string | null
    profileImageUrl?: StringNullableFilter<"AppUser"> | string | null
    role?: StringFilter<"AppUser"> | string
    createdAt?: DateTimeFilter<"AppUser"> | Date | string
    updatedAt?: DateTimeFilter<"AppUser"> | Date | string
    lastLoginAt?: DateTimeFilter<"AppUser"> | Date | string
    savedCafes?: UserSavedCafeListRelationFilter
    cafeRecords?: CafeRecordListRelationFilter
  }

  export type AppUserOrderByWithRelationInput = {
    id?: SortOrder
    authProvider?: SortOrder
    providerUserId?: SortOrder
    email?: SortOrderInput | SortOrder
    nickname?: SortOrder
    displayName?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
    savedCafes?: UserSavedCafeOrderByRelationAggregateInput
    cafeRecords?: CafeRecordOrderByRelationAggregateInput
    _relevance?: AppUserOrderByRelevanceInput
  }

  export type AppUserWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    authProvider_providerUserId?: AppUserAuthProviderProviderUserIdCompoundUniqueInput
    AND?: AppUserWhereInput | AppUserWhereInput[]
    OR?: AppUserWhereInput[]
    NOT?: AppUserWhereInput | AppUserWhereInput[]
    authProvider?: StringFilter<"AppUser"> | string
    providerUserId?: StringFilter<"AppUser"> | string
    email?: StringNullableFilter<"AppUser"> | string | null
    nickname?: StringFilter<"AppUser"> | string
    displayName?: StringNullableFilter<"AppUser"> | string | null
    profileImageUrl?: StringNullableFilter<"AppUser"> | string | null
    role?: StringFilter<"AppUser"> | string
    createdAt?: DateTimeFilter<"AppUser"> | Date | string
    updatedAt?: DateTimeFilter<"AppUser"> | Date | string
    lastLoginAt?: DateTimeFilter<"AppUser"> | Date | string
    savedCafes?: UserSavedCafeListRelationFilter
    cafeRecords?: CafeRecordListRelationFilter
  }, "id" | "authProvider_providerUserId">

  export type AppUserOrderByWithAggregationInput = {
    id?: SortOrder
    authProvider?: SortOrder
    providerUserId?: SortOrder
    email?: SortOrderInput | SortOrder
    nickname?: SortOrder
    displayName?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
    _count?: AppUserCountOrderByAggregateInput
    _avg?: AppUserAvgOrderByAggregateInput
    _max?: AppUserMaxOrderByAggregateInput
    _min?: AppUserMinOrderByAggregateInput
    _sum?: AppUserSumOrderByAggregateInput
  }

  export type AppUserScalarWhereWithAggregatesInput = {
    AND?: AppUserScalarWhereWithAggregatesInput | AppUserScalarWhereWithAggregatesInput[]
    OR?: AppUserScalarWhereWithAggregatesInput[]
    NOT?: AppUserScalarWhereWithAggregatesInput | AppUserScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"AppUser"> | bigint | number
    authProvider?: StringWithAggregatesFilter<"AppUser"> | string
    providerUserId?: StringWithAggregatesFilter<"AppUser"> | string
    email?: StringNullableWithAggregatesFilter<"AppUser"> | string | null
    nickname?: StringWithAggregatesFilter<"AppUser"> | string
    displayName?: StringNullableWithAggregatesFilter<"AppUser"> | string | null
    profileImageUrl?: StringNullableWithAggregatesFilter<"AppUser"> | string | null
    role?: StringWithAggregatesFilter<"AppUser"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AppUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AppUser"> | Date | string
    lastLoginAt?: DateTimeWithAggregatesFilter<"AppUser"> | Date | string
  }

  export type CafeWhereInput = {
    AND?: CafeWhereInput | CafeWhereInput[]
    OR?: CafeWhereInput[]
    NOT?: CafeWhereInput | CafeWhereInput[]
    kakaoPlaceId?: StringFilter<"Cafe"> | string
    placeName?: StringFilter<"Cafe"> | string
    categoryName?: StringNullableFilter<"Cafe"> | string | null
    phone?: StringNullableFilter<"Cafe"> | string | null
    addressName?: StringNullableFilter<"Cafe"> | string | null
    roadAddressName?: StringNullableFilter<"Cafe"> | string | null
    latitude?: DecimalNullableFilter<"Cafe"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"Cafe"> | Decimal | DecimalJsLike | number | string | null
    placeUrl?: StringNullableFilter<"Cafe"> | string | null
    lastFetchedAt?: DateTimeFilter<"Cafe"> | Date | string
    nextRefreshAt?: DateTimeNullableFilter<"Cafe"> | Date | string | null
    createdAt?: DateTimeFilter<"Cafe"> | Date | string
    savedCafes?: UserSavedCafeListRelationFilter
    cafeRecords?: CafeRecordListRelationFilter
  }

  export type CafeOrderByWithRelationInput = {
    kakaoPlaceId?: SortOrder
    placeName?: SortOrder
    categoryName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    addressName?: SortOrderInput | SortOrder
    roadAddressName?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    placeUrl?: SortOrderInput | SortOrder
    lastFetchedAt?: SortOrder
    nextRefreshAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    savedCafes?: UserSavedCafeOrderByRelationAggregateInput
    cafeRecords?: CafeRecordOrderByRelationAggregateInput
    _relevance?: CafeOrderByRelevanceInput
  }

  export type CafeWhereUniqueInput = Prisma.AtLeast<{
    kakaoPlaceId?: string
    AND?: CafeWhereInput | CafeWhereInput[]
    OR?: CafeWhereInput[]
    NOT?: CafeWhereInput | CafeWhereInput[]
    placeName?: StringFilter<"Cafe"> | string
    categoryName?: StringNullableFilter<"Cafe"> | string | null
    phone?: StringNullableFilter<"Cafe"> | string | null
    addressName?: StringNullableFilter<"Cafe"> | string | null
    roadAddressName?: StringNullableFilter<"Cafe"> | string | null
    latitude?: DecimalNullableFilter<"Cafe"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"Cafe"> | Decimal | DecimalJsLike | number | string | null
    placeUrl?: StringNullableFilter<"Cafe"> | string | null
    lastFetchedAt?: DateTimeFilter<"Cafe"> | Date | string
    nextRefreshAt?: DateTimeNullableFilter<"Cafe"> | Date | string | null
    createdAt?: DateTimeFilter<"Cafe"> | Date | string
    savedCafes?: UserSavedCafeListRelationFilter
    cafeRecords?: CafeRecordListRelationFilter
  }, "kakaoPlaceId">

  export type CafeOrderByWithAggregationInput = {
    kakaoPlaceId?: SortOrder
    placeName?: SortOrder
    categoryName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    addressName?: SortOrderInput | SortOrder
    roadAddressName?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    placeUrl?: SortOrderInput | SortOrder
    lastFetchedAt?: SortOrder
    nextRefreshAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CafeCountOrderByAggregateInput
    _avg?: CafeAvgOrderByAggregateInput
    _max?: CafeMaxOrderByAggregateInput
    _min?: CafeMinOrderByAggregateInput
    _sum?: CafeSumOrderByAggregateInput
  }

  export type CafeScalarWhereWithAggregatesInput = {
    AND?: CafeScalarWhereWithAggregatesInput | CafeScalarWhereWithAggregatesInput[]
    OR?: CafeScalarWhereWithAggregatesInput[]
    NOT?: CafeScalarWhereWithAggregatesInput | CafeScalarWhereWithAggregatesInput[]
    kakaoPlaceId?: StringWithAggregatesFilter<"Cafe"> | string
    placeName?: StringWithAggregatesFilter<"Cafe"> | string
    categoryName?: StringNullableWithAggregatesFilter<"Cafe"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Cafe"> | string | null
    addressName?: StringNullableWithAggregatesFilter<"Cafe"> | string | null
    roadAddressName?: StringNullableWithAggregatesFilter<"Cafe"> | string | null
    latitude?: DecimalNullableWithAggregatesFilter<"Cafe"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableWithAggregatesFilter<"Cafe"> | Decimal | DecimalJsLike | number | string | null
    placeUrl?: StringNullableWithAggregatesFilter<"Cafe"> | string | null
    lastFetchedAt?: DateTimeWithAggregatesFilter<"Cafe"> | Date | string
    nextRefreshAt?: DateTimeNullableWithAggregatesFilter<"Cafe"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Cafe"> | Date | string
  }

  export type UserSavedCafeWhereInput = {
    AND?: UserSavedCafeWhereInput | UserSavedCafeWhereInput[]
    OR?: UserSavedCafeWhereInput[]
    NOT?: UserSavedCafeWhereInput | UserSavedCafeWhereInput[]
    id?: BigIntFilter<"UserSavedCafe"> | bigint | number
    appUserId?: BigIntFilter<"UserSavedCafe"> | bigint | number
    kakaoPlaceId?: StringFilter<"UserSavedCafe"> | string
    savedType?: StringFilter<"UserSavedCafe"> | string
    createdAt?: DateTimeFilter<"UserSavedCafe"> | Date | string
    updatedAt?: DateTimeFilter<"UserSavedCafe"> | Date | string
    appUser?: XOR<AppUserScalarRelationFilter, AppUserWhereInput>
    cafe?: XOR<CafeScalarRelationFilter, CafeWhereInput>
  }

  export type UserSavedCafeOrderByWithRelationInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    savedType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appUser?: AppUserOrderByWithRelationInput
    cafe?: CafeOrderByWithRelationInput
    _relevance?: UserSavedCafeOrderByRelevanceInput
  }

  export type UserSavedCafeWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    appUserId_kakaoPlaceId?: UserSavedCafeAppUserIdKakaoPlaceIdCompoundUniqueInput
    AND?: UserSavedCafeWhereInput | UserSavedCafeWhereInput[]
    OR?: UserSavedCafeWhereInput[]
    NOT?: UserSavedCafeWhereInput | UserSavedCafeWhereInput[]
    appUserId?: BigIntFilter<"UserSavedCafe"> | bigint | number
    kakaoPlaceId?: StringFilter<"UserSavedCafe"> | string
    savedType?: StringFilter<"UserSavedCafe"> | string
    createdAt?: DateTimeFilter<"UserSavedCafe"> | Date | string
    updatedAt?: DateTimeFilter<"UserSavedCafe"> | Date | string
    appUser?: XOR<AppUserScalarRelationFilter, AppUserWhereInput>
    cafe?: XOR<CafeScalarRelationFilter, CafeWhereInput>
  }, "id" | "appUserId_kakaoPlaceId">

  export type UserSavedCafeOrderByWithAggregationInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    savedType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserSavedCafeCountOrderByAggregateInput
    _avg?: UserSavedCafeAvgOrderByAggregateInput
    _max?: UserSavedCafeMaxOrderByAggregateInput
    _min?: UserSavedCafeMinOrderByAggregateInput
    _sum?: UserSavedCafeSumOrderByAggregateInput
  }

  export type UserSavedCafeScalarWhereWithAggregatesInput = {
    AND?: UserSavedCafeScalarWhereWithAggregatesInput | UserSavedCafeScalarWhereWithAggregatesInput[]
    OR?: UserSavedCafeScalarWhereWithAggregatesInput[]
    NOT?: UserSavedCafeScalarWhereWithAggregatesInput | UserSavedCafeScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"UserSavedCafe"> | bigint | number
    appUserId?: BigIntWithAggregatesFilter<"UserSavedCafe"> | bigint | number
    kakaoPlaceId?: StringWithAggregatesFilter<"UserSavedCafe"> | string
    savedType?: StringWithAggregatesFilter<"UserSavedCafe"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UserSavedCafe"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserSavedCafe"> | Date | string
  }

  export type CafeRecordWhereInput = {
    AND?: CafeRecordWhereInput | CafeRecordWhereInput[]
    OR?: CafeRecordWhereInput[]
    NOT?: CafeRecordWhereInput | CafeRecordWhereInput[]
    id?: BigIntFilter<"CafeRecord"> | bigint | number
    appUserId?: BigIntFilter<"CafeRecord"> | bigint | number
    kakaoPlaceId?: StringFilter<"CafeRecord"> | string
    recordType?: StringFilter<"CafeRecord"> | string
    displayOrder?: IntFilter<"CafeRecord"> | number
    createdAt?: DateTimeFilter<"CafeRecord"> | Date | string
    updatedAt?: DateTimeFilter<"CafeRecord"> | Date | string
    appUser?: XOR<AppUserScalarRelationFilter, AppUserWhereInput>
    cafe?: XOR<CafeScalarRelationFilter, CafeWhereInput>
  }

  export type CafeRecordOrderByWithRelationInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    recordType?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appUser?: AppUserOrderByWithRelationInput
    cafe?: CafeOrderByWithRelationInput
    _relevance?: CafeRecordOrderByRelevanceInput
  }

  export type CafeRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: CafeRecordWhereInput | CafeRecordWhereInput[]
    OR?: CafeRecordWhereInput[]
    NOT?: CafeRecordWhereInput | CafeRecordWhereInput[]
    appUserId?: BigIntFilter<"CafeRecord"> | bigint | number
    kakaoPlaceId?: StringFilter<"CafeRecord"> | string
    recordType?: StringFilter<"CafeRecord"> | string
    displayOrder?: IntFilter<"CafeRecord"> | number
    createdAt?: DateTimeFilter<"CafeRecord"> | Date | string
    updatedAt?: DateTimeFilter<"CafeRecord"> | Date | string
    appUser?: XOR<AppUserScalarRelationFilter, AppUserWhereInput>
    cafe?: XOR<CafeScalarRelationFilter, CafeWhereInput>
  }, "id">

  export type CafeRecordOrderByWithAggregationInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    recordType?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CafeRecordCountOrderByAggregateInput
    _avg?: CafeRecordAvgOrderByAggregateInput
    _max?: CafeRecordMaxOrderByAggregateInput
    _min?: CafeRecordMinOrderByAggregateInput
    _sum?: CafeRecordSumOrderByAggregateInput
  }

  export type CafeRecordScalarWhereWithAggregatesInput = {
    AND?: CafeRecordScalarWhereWithAggregatesInput | CafeRecordScalarWhereWithAggregatesInput[]
    OR?: CafeRecordScalarWhereWithAggregatesInput[]
    NOT?: CafeRecordScalarWhereWithAggregatesInput | CafeRecordScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"CafeRecord"> | bigint | number
    appUserId?: BigIntWithAggregatesFilter<"CafeRecord"> | bigint | number
    kakaoPlaceId?: StringWithAggregatesFilter<"CafeRecord"> | string
    recordType?: StringWithAggregatesFilter<"CafeRecord"> | string
    displayOrder?: IntWithAggregatesFilter<"CafeRecord"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CafeRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CafeRecord"> | Date | string
  }

  export type AppUserCreateInput = {
    id?: bigint | number
    authProvider: string
    providerUserId: string
    email?: string | null
    nickname: string
    displayName?: string | null
    profileImageUrl?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string
    savedCafes?: UserSavedCafeCreateNestedManyWithoutAppUserInput
    cafeRecords?: CafeRecordCreateNestedManyWithoutAppUserInput
  }

  export type AppUserUncheckedCreateInput = {
    id?: bigint | number
    authProvider: string
    providerUserId: string
    email?: string | null
    nickname: string
    displayName?: string | null
    profileImageUrl?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string
    savedCafes?: UserSavedCafeUncheckedCreateNestedManyWithoutAppUserInput
    cafeRecords?: CafeRecordUncheckedCreateNestedManyWithoutAppUserInput
  }

  export type AppUserUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    authProvider?: StringFieldUpdateOperationsInput | string
    providerUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedCafes?: UserSavedCafeUpdateManyWithoutAppUserNestedInput
    cafeRecords?: CafeRecordUpdateManyWithoutAppUserNestedInput
  }

  export type AppUserUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    authProvider?: StringFieldUpdateOperationsInput | string
    providerUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedCafes?: UserSavedCafeUncheckedUpdateManyWithoutAppUserNestedInput
    cafeRecords?: CafeRecordUncheckedUpdateManyWithoutAppUserNestedInput
  }

  export type AppUserCreateManyInput = {
    id?: bigint | number
    authProvider: string
    providerUserId: string
    email?: string | null
    nickname: string
    displayName?: string | null
    profileImageUrl?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string
  }

  export type AppUserUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    authProvider?: StringFieldUpdateOperationsInput | string
    providerUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppUserUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    authProvider?: StringFieldUpdateOperationsInput | string
    providerUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CafeCreateInput = {
    kakaoPlaceId: string
    placeName: string
    categoryName?: string | null
    phone?: string | null
    addressName?: string | null
    roadAddressName?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    placeUrl?: string | null
    lastFetchedAt: Date | string
    nextRefreshAt?: Date | string | null
    createdAt?: Date | string
    savedCafes?: UserSavedCafeCreateNestedManyWithoutCafeInput
    cafeRecords?: CafeRecordCreateNestedManyWithoutCafeInput
  }

  export type CafeUncheckedCreateInput = {
    kakaoPlaceId: string
    placeName: string
    categoryName?: string | null
    phone?: string | null
    addressName?: string | null
    roadAddressName?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    placeUrl?: string | null
    lastFetchedAt: Date | string
    nextRefreshAt?: Date | string | null
    createdAt?: Date | string
    savedCafes?: UserSavedCafeUncheckedCreateNestedManyWithoutCafeInput
    cafeRecords?: CafeRecordUncheckedCreateNestedManyWithoutCafeInput
  }

  export type CafeUpdateInput = {
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    placeName?: StringFieldUpdateOperationsInput | string
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    addressName?: NullableStringFieldUpdateOperationsInput | string | null
    roadAddressName?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    placeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lastFetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRefreshAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedCafes?: UserSavedCafeUpdateManyWithoutCafeNestedInput
    cafeRecords?: CafeRecordUpdateManyWithoutCafeNestedInput
  }

  export type CafeUncheckedUpdateInput = {
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    placeName?: StringFieldUpdateOperationsInput | string
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    addressName?: NullableStringFieldUpdateOperationsInput | string | null
    roadAddressName?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    placeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lastFetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRefreshAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedCafes?: UserSavedCafeUncheckedUpdateManyWithoutCafeNestedInput
    cafeRecords?: CafeRecordUncheckedUpdateManyWithoutCafeNestedInput
  }

  export type CafeCreateManyInput = {
    kakaoPlaceId: string
    placeName: string
    categoryName?: string | null
    phone?: string | null
    addressName?: string | null
    roadAddressName?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    placeUrl?: string | null
    lastFetchedAt: Date | string
    nextRefreshAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CafeUpdateManyMutationInput = {
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    placeName?: StringFieldUpdateOperationsInput | string
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    addressName?: NullableStringFieldUpdateOperationsInput | string | null
    roadAddressName?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    placeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lastFetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRefreshAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CafeUncheckedUpdateManyInput = {
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    placeName?: StringFieldUpdateOperationsInput | string
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    addressName?: NullableStringFieldUpdateOperationsInput | string | null
    roadAddressName?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    placeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lastFetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRefreshAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSavedCafeCreateInput = {
    id?: bigint | number
    savedType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appUser: AppUserCreateNestedOneWithoutSavedCafesInput
    cafe: CafeCreateNestedOneWithoutSavedCafesInput
  }

  export type UserSavedCafeUncheckedCreateInput = {
    id?: bigint | number
    appUserId: bigint | number
    kakaoPlaceId: string
    savedType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSavedCafeUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appUser?: AppUserUpdateOneRequiredWithoutSavedCafesNestedInput
    cafe?: CafeUpdateOneRequiredWithoutSavedCafesNestedInput
  }

  export type UserSavedCafeUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    appUserId?: BigIntFieldUpdateOperationsInput | bigint | number
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSavedCafeCreateManyInput = {
    id?: bigint | number
    appUserId: bigint | number
    kakaoPlaceId: string
    savedType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSavedCafeUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSavedCafeUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    appUserId?: BigIntFieldUpdateOperationsInput | bigint | number
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CafeRecordCreateInput = {
    id?: bigint | number
    recordType: string
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    appUser: AppUserCreateNestedOneWithoutCafeRecordsInput
    cafe: CafeCreateNestedOneWithoutCafeRecordsInput
  }

  export type CafeRecordUncheckedCreateInput = {
    id?: bigint | number
    appUserId: bigint | number
    kakaoPlaceId: string
    recordType: string
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CafeRecordUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appUser?: AppUserUpdateOneRequiredWithoutCafeRecordsNestedInput
    cafe?: CafeUpdateOneRequiredWithoutCafeRecordsNestedInput
  }

  export type CafeRecordUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    appUserId?: BigIntFieldUpdateOperationsInput | bigint | number
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CafeRecordCreateManyInput = {
    id?: bigint | number
    appUserId: bigint | number
    kakaoPlaceId: string
    recordType: string
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CafeRecordUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CafeRecordUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    appUserId?: BigIntFieldUpdateOperationsInput | bigint | number
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserSavedCafeListRelationFilter = {
    every?: UserSavedCafeWhereInput
    some?: UserSavedCafeWhereInput
    none?: UserSavedCafeWhereInput
  }

  export type CafeRecordListRelationFilter = {
    every?: CafeRecordWhereInput
    some?: CafeRecordWhereInput
    none?: CafeRecordWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserSavedCafeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CafeRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AppUserOrderByRelevanceInput = {
    fields: AppUserOrderByRelevanceFieldEnum | AppUserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AppUserAuthProviderProviderUserIdCompoundUniqueInput = {
    authProvider: string
    providerUserId: string
  }

  export type AppUserCountOrderByAggregateInput = {
    id?: SortOrder
    authProvider?: SortOrder
    providerUserId?: SortOrder
    email?: SortOrder
    nickname?: SortOrder
    displayName?: SortOrder
    profileImageUrl?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type AppUserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AppUserMaxOrderByAggregateInput = {
    id?: SortOrder
    authProvider?: SortOrder
    providerUserId?: SortOrder
    email?: SortOrder
    nickname?: SortOrder
    displayName?: SortOrder
    profileImageUrl?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type AppUserMinOrderByAggregateInput = {
    id?: SortOrder
    authProvider?: SortOrder
    providerUserId?: SortOrder
    email?: SortOrder
    nickname?: SortOrder
    displayName?: SortOrder
    profileImageUrl?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type AppUserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type CafeOrderByRelevanceInput = {
    fields: CafeOrderByRelevanceFieldEnum | CafeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CafeCountOrderByAggregateInput = {
    kakaoPlaceId?: SortOrder
    placeName?: SortOrder
    categoryName?: SortOrder
    phone?: SortOrder
    addressName?: SortOrder
    roadAddressName?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    placeUrl?: SortOrder
    lastFetchedAt?: SortOrder
    nextRefreshAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CafeAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type CafeMaxOrderByAggregateInput = {
    kakaoPlaceId?: SortOrder
    placeName?: SortOrder
    categoryName?: SortOrder
    phone?: SortOrder
    addressName?: SortOrder
    roadAddressName?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    placeUrl?: SortOrder
    lastFetchedAt?: SortOrder
    nextRefreshAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CafeMinOrderByAggregateInput = {
    kakaoPlaceId?: SortOrder
    placeName?: SortOrder
    categoryName?: SortOrder
    phone?: SortOrder
    addressName?: SortOrder
    roadAddressName?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    placeUrl?: SortOrder
    lastFetchedAt?: SortOrder
    nextRefreshAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CafeSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AppUserScalarRelationFilter = {
    is?: AppUserWhereInput
    isNot?: AppUserWhereInput
  }

  export type CafeScalarRelationFilter = {
    is?: CafeWhereInput
    isNot?: CafeWhereInput
  }

  export type UserSavedCafeOrderByRelevanceInput = {
    fields: UserSavedCafeOrderByRelevanceFieldEnum | UserSavedCafeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserSavedCafeAppUserIdKakaoPlaceIdCompoundUniqueInput = {
    appUserId: bigint | number
    kakaoPlaceId: string
  }

  export type UserSavedCafeCountOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    savedType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSavedCafeAvgOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
  }

  export type UserSavedCafeMaxOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    savedType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSavedCafeMinOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    savedType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSavedCafeSumOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type CafeRecordOrderByRelevanceInput = {
    fields: CafeRecordOrderByRelevanceFieldEnum | CafeRecordOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CafeRecordCountOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    recordType?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CafeRecordAvgOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
    displayOrder?: SortOrder
  }

  export type CafeRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    recordType?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CafeRecordMinOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
    kakaoPlaceId?: SortOrder
    recordType?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CafeRecordSumOrderByAggregateInput = {
    id?: SortOrder
    appUserId?: SortOrder
    displayOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserSavedCafeCreateNestedManyWithoutAppUserInput = {
    create?: XOR<UserSavedCafeCreateWithoutAppUserInput, UserSavedCafeUncheckedCreateWithoutAppUserInput> | UserSavedCafeCreateWithoutAppUserInput[] | UserSavedCafeUncheckedCreateWithoutAppUserInput[]
    connectOrCreate?: UserSavedCafeCreateOrConnectWithoutAppUserInput | UserSavedCafeCreateOrConnectWithoutAppUserInput[]
    createMany?: UserSavedCafeCreateManyAppUserInputEnvelope
    connect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
  }

  export type CafeRecordCreateNestedManyWithoutAppUserInput = {
    create?: XOR<CafeRecordCreateWithoutAppUserInput, CafeRecordUncheckedCreateWithoutAppUserInput> | CafeRecordCreateWithoutAppUserInput[] | CafeRecordUncheckedCreateWithoutAppUserInput[]
    connectOrCreate?: CafeRecordCreateOrConnectWithoutAppUserInput | CafeRecordCreateOrConnectWithoutAppUserInput[]
    createMany?: CafeRecordCreateManyAppUserInputEnvelope
    connect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
  }

  export type UserSavedCafeUncheckedCreateNestedManyWithoutAppUserInput = {
    create?: XOR<UserSavedCafeCreateWithoutAppUserInput, UserSavedCafeUncheckedCreateWithoutAppUserInput> | UserSavedCafeCreateWithoutAppUserInput[] | UserSavedCafeUncheckedCreateWithoutAppUserInput[]
    connectOrCreate?: UserSavedCafeCreateOrConnectWithoutAppUserInput | UserSavedCafeCreateOrConnectWithoutAppUserInput[]
    createMany?: UserSavedCafeCreateManyAppUserInputEnvelope
    connect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
  }

  export type CafeRecordUncheckedCreateNestedManyWithoutAppUserInput = {
    create?: XOR<CafeRecordCreateWithoutAppUserInput, CafeRecordUncheckedCreateWithoutAppUserInput> | CafeRecordCreateWithoutAppUserInput[] | CafeRecordUncheckedCreateWithoutAppUserInput[]
    connectOrCreate?: CafeRecordCreateOrConnectWithoutAppUserInput | CafeRecordCreateOrConnectWithoutAppUserInput[]
    createMany?: CafeRecordCreateManyAppUserInputEnvelope
    connect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserSavedCafeUpdateManyWithoutAppUserNestedInput = {
    create?: XOR<UserSavedCafeCreateWithoutAppUserInput, UserSavedCafeUncheckedCreateWithoutAppUserInput> | UserSavedCafeCreateWithoutAppUserInput[] | UserSavedCafeUncheckedCreateWithoutAppUserInput[]
    connectOrCreate?: UserSavedCafeCreateOrConnectWithoutAppUserInput | UserSavedCafeCreateOrConnectWithoutAppUserInput[]
    upsert?: UserSavedCafeUpsertWithWhereUniqueWithoutAppUserInput | UserSavedCafeUpsertWithWhereUniqueWithoutAppUserInput[]
    createMany?: UserSavedCafeCreateManyAppUserInputEnvelope
    set?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    disconnect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    delete?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    connect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    update?: UserSavedCafeUpdateWithWhereUniqueWithoutAppUserInput | UserSavedCafeUpdateWithWhereUniqueWithoutAppUserInput[]
    updateMany?: UserSavedCafeUpdateManyWithWhereWithoutAppUserInput | UserSavedCafeUpdateManyWithWhereWithoutAppUserInput[]
    deleteMany?: UserSavedCafeScalarWhereInput | UserSavedCafeScalarWhereInput[]
  }

  export type CafeRecordUpdateManyWithoutAppUserNestedInput = {
    create?: XOR<CafeRecordCreateWithoutAppUserInput, CafeRecordUncheckedCreateWithoutAppUserInput> | CafeRecordCreateWithoutAppUserInput[] | CafeRecordUncheckedCreateWithoutAppUserInput[]
    connectOrCreate?: CafeRecordCreateOrConnectWithoutAppUserInput | CafeRecordCreateOrConnectWithoutAppUserInput[]
    upsert?: CafeRecordUpsertWithWhereUniqueWithoutAppUserInput | CafeRecordUpsertWithWhereUniqueWithoutAppUserInput[]
    createMany?: CafeRecordCreateManyAppUserInputEnvelope
    set?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    disconnect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    delete?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    connect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    update?: CafeRecordUpdateWithWhereUniqueWithoutAppUserInput | CafeRecordUpdateWithWhereUniqueWithoutAppUserInput[]
    updateMany?: CafeRecordUpdateManyWithWhereWithoutAppUserInput | CafeRecordUpdateManyWithWhereWithoutAppUserInput[]
    deleteMany?: CafeRecordScalarWhereInput | CafeRecordScalarWhereInput[]
  }

  export type UserSavedCafeUncheckedUpdateManyWithoutAppUserNestedInput = {
    create?: XOR<UserSavedCafeCreateWithoutAppUserInput, UserSavedCafeUncheckedCreateWithoutAppUserInput> | UserSavedCafeCreateWithoutAppUserInput[] | UserSavedCafeUncheckedCreateWithoutAppUserInput[]
    connectOrCreate?: UserSavedCafeCreateOrConnectWithoutAppUserInput | UserSavedCafeCreateOrConnectWithoutAppUserInput[]
    upsert?: UserSavedCafeUpsertWithWhereUniqueWithoutAppUserInput | UserSavedCafeUpsertWithWhereUniqueWithoutAppUserInput[]
    createMany?: UserSavedCafeCreateManyAppUserInputEnvelope
    set?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    disconnect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    delete?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    connect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    update?: UserSavedCafeUpdateWithWhereUniqueWithoutAppUserInput | UserSavedCafeUpdateWithWhereUniqueWithoutAppUserInput[]
    updateMany?: UserSavedCafeUpdateManyWithWhereWithoutAppUserInput | UserSavedCafeUpdateManyWithWhereWithoutAppUserInput[]
    deleteMany?: UserSavedCafeScalarWhereInput | UserSavedCafeScalarWhereInput[]
  }

  export type CafeRecordUncheckedUpdateManyWithoutAppUserNestedInput = {
    create?: XOR<CafeRecordCreateWithoutAppUserInput, CafeRecordUncheckedCreateWithoutAppUserInput> | CafeRecordCreateWithoutAppUserInput[] | CafeRecordUncheckedCreateWithoutAppUserInput[]
    connectOrCreate?: CafeRecordCreateOrConnectWithoutAppUserInput | CafeRecordCreateOrConnectWithoutAppUserInput[]
    upsert?: CafeRecordUpsertWithWhereUniqueWithoutAppUserInput | CafeRecordUpsertWithWhereUniqueWithoutAppUserInput[]
    createMany?: CafeRecordCreateManyAppUserInputEnvelope
    set?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    disconnect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    delete?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    connect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    update?: CafeRecordUpdateWithWhereUniqueWithoutAppUserInput | CafeRecordUpdateWithWhereUniqueWithoutAppUserInput[]
    updateMany?: CafeRecordUpdateManyWithWhereWithoutAppUserInput | CafeRecordUpdateManyWithWhereWithoutAppUserInput[]
    deleteMany?: CafeRecordScalarWhereInput | CafeRecordScalarWhereInput[]
  }

  export type UserSavedCafeCreateNestedManyWithoutCafeInput = {
    create?: XOR<UserSavedCafeCreateWithoutCafeInput, UserSavedCafeUncheckedCreateWithoutCafeInput> | UserSavedCafeCreateWithoutCafeInput[] | UserSavedCafeUncheckedCreateWithoutCafeInput[]
    connectOrCreate?: UserSavedCafeCreateOrConnectWithoutCafeInput | UserSavedCafeCreateOrConnectWithoutCafeInput[]
    createMany?: UserSavedCafeCreateManyCafeInputEnvelope
    connect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
  }

  export type CafeRecordCreateNestedManyWithoutCafeInput = {
    create?: XOR<CafeRecordCreateWithoutCafeInput, CafeRecordUncheckedCreateWithoutCafeInput> | CafeRecordCreateWithoutCafeInput[] | CafeRecordUncheckedCreateWithoutCafeInput[]
    connectOrCreate?: CafeRecordCreateOrConnectWithoutCafeInput | CafeRecordCreateOrConnectWithoutCafeInput[]
    createMany?: CafeRecordCreateManyCafeInputEnvelope
    connect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
  }

  export type UserSavedCafeUncheckedCreateNestedManyWithoutCafeInput = {
    create?: XOR<UserSavedCafeCreateWithoutCafeInput, UserSavedCafeUncheckedCreateWithoutCafeInput> | UserSavedCafeCreateWithoutCafeInput[] | UserSavedCafeUncheckedCreateWithoutCafeInput[]
    connectOrCreate?: UserSavedCafeCreateOrConnectWithoutCafeInput | UserSavedCafeCreateOrConnectWithoutCafeInput[]
    createMany?: UserSavedCafeCreateManyCafeInputEnvelope
    connect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
  }

  export type CafeRecordUncheckedCreateNestedManyWithoutCafeInput = {
    create?: XOR<CafeRecordCreateWithoutCafeInput, CafeRecordUncheckedCreateWithoutCafeInput> | CafeRecordCreateWithoutCafeInput[] | CafeRecordUncheckedCreateWithoutCafeInput[]
    connectOrCreate?: CafeRecordCreateOrConnectWithoutCafeInput | CafeRecordCreateOrConnectWithoutCafeInput[]
    createMany?: CafeRecordCreateManyCafeInputEnvelope
    connect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserSavedCafeUpdateManyWithoutCafeNestedInput = {
    create?: XOR<UserSavedCafeCreateWithoutCafeInput, UserSavedCafeUncheckedCreateWithoutCafeInput> | UserSavedCafeCreateWithoutCafeInput[] | UserSavedCafeUncheckedCreateWithoutCafeInput[]
    connectOrCreate?: UserSavedCafeCreateOrConnectWithoutCafeInput | UserSavedCafeCreateOrConnectWithoutCafeInput[]
    upsert?: UserSavedCafeUpsertWithWhereUniqueWithoutCafeInput | UserSavedCafeUpsertWithWhereUniqueWithoutCafeInput[]
    createMany?: UserSavedCafeCreateManyCafeInputEnvelope
    set?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    disconnect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    delete?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    connect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    update?: UserSavedCafeUpdateWithWhereUniqueWithoutCafeInput | UserSavedCafeUpdateWithWhereUniqueWithoutCafeInput[]
    updateMany?: UserSavedCafeUpdateManyWithWhereWithoutCafeInput | UserSavedCafeUpdateManyWithWhereWithoutCafeInput[]
    deleteMany?: UserSavedCafeScalarWhereInput | UserSavedCafeScalarWhereInput[]
  }

  export type CafeRecordUpdateManyWithoutCafeNestedInput = {
    create?: XOR<CafeRecordCreateWithoutCafeInput, CafeRecordUncheckedCreateWithoutCafeInput> | CafeRecordCreateWithoutCafeInput[] | CafeRecordUncheckedCreateWithoutCafeInput[]
    connectOrCreate?: CafeRecordCreateOrConnectWithoutCafeInput | CafeRecordCreateOrConnectWithoutCafeInput[]
    upsert?: CafeRecordUpsertWithWhereUniqueWithoutCafeInput | CafeRecordUpsertWithWhereUniqueWithoutCafeInput[]
    createMany?: CafeRecordCreateManyCafeInputEnvelope
    set?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    disconnect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    delete?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    connect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    update?: CafeRecordUpdateWithWhereUniqueWithoutCafeInput | CafeRecordUpdateWithWhereUniqueWithoutCafeInput[]
    updateMany?: CafeRecordUpdateManyWithWhereWithoutCafeInput | CafeRecordUpdateManyWithWhereWithoutCafeInput[]
    deleteMany?: CafeRecordScalarWhereInput | CafeRecordScalarWhereInput[]
  }

  export type UserSavedCafeUncheckedUpdateManyWithoutCafeNestedInput = {
    create?: XOR<UserSavedCafeCreateWithoutCafeInput, UserSavedCafeUncheckedCreateWithoutCafeInput> | UserSavedCafeCreateWithoutCafeInput[] | UserSavedCafeUncheckedCreateWithoutCafeInput[]
    connectOrCreate?: UserSavedCafeCreateOrConnectWithoutCafeInput | UserSavedCafeCreateOrConnectWithoutCafeInput[]
    upsert?: UserSavedCafeUpsertWithWhereUniqueWithoutCafeInput | UserSavedCafeUpsertWithWhereUniqueWithoutCafeInput[]
    createMany?: UserSavedCafeCreateManyCafeInputEnvelope
    set?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    disconnect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    delete?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    connect?: UserSavedCafeWhereUniqueInput | UserSavedCafeWhereUniqueInput[]
    update?: UserSavedCafeUpdateWithWhereUniqueWithoutCafeInput | UserSavedCafeUpdateWithWhereUniqueWithoutCafeInput[]
    updateMany?: UserSavedCafeUpdateManyWithWhereWithoutCafeInput | UserSavedCafeUpdateManyWithWhereWithoutCafeInput[]
    deleteMany?: UserSavedCafeScalarWhereInput | UserSavedCafeScalarWhereInput[]
  }

  export type CafeRecordUncheckedUpdateManyWithoutCafeNestedInput = {
    create?: XOR<CafeRecordCreateWithoutCafeInput, CafeRecordUncheckedCreateWithoutCafeInput> | CafeRecordCreateWithoutCafeInput[] | CafeRecordUncheckedCreateWithoutCafeInput[]
    connectOrCreate?: CafeRecordCreateOrConnectWithoutCafeInput | CafeRecordCreateOrConnectWithoutCafeInput[]
    upsert?: CafeRecordUpsertWithWhereUniqueWithoutCafeInput | CafeRecordUpsertWithWhereUniqueWithoutCafeInput[]
    createMany?: CafeRecordCreateManyCafeInputEnvelope
    set?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    disconnect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    delete?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    connect?: CafeRecordWhereUniqueInput | CafeRecordWhereUniqueInput[]
    update?: CafeRecordUpdateWithWhereUniqueWithoutCafeInput | CafeRecordUpdateWithWhereUniqueWithoutCafeInput[]
    updateMany?: CafeRecordUpdateManyWithWhereWithoutCafeInput | CafeRecordUpdateManyWithWhereWithoutCafeInput[]
    deleteMany?: CafeRecordScalarWhereInput | CafeRecordScalarWhereInput[]
  }

  export type AppUserCreateNestedOneWithoutSavedCafesInput = {
    create?: XOR<AppUserCreateWithoutSavedCafesInput, AppUserUncheckedCreateWithoutSavedCafesInput>
    connectOrCreate?: AppUserCreateOrConnectWithoutSavedCafesInput
    connect?: AppUserWhereUniqueInput
  }

  export type CafeCreateNestedOneWithoutSavedCafesInput = {
    create?: XOR<CafeCreateWithoutSavedCafesInput, CafeUncheckedCreateWithoutSavedCafesInput>
    connectOrCreate?: CafeCreateOrConnectWithoutSavedCafesInput
    connect?: CafeWhereUniqueInput
  }

  export type AppUserUpdateOneRequiredWithoutSavedCafesNestedInput = {
    create?: XOR<AppUserCreateWithoutSavedCafesInput, AppUserUncheckedCreateWithoutSavedCafesInput>
    connectOrCreate?: AppUserCreateOrConnectWithoutSavedCafesInput
    upsert?: AppUserUpsertWithoutSavedCafesInput
    connect?: AppUserWhereUniqueInput
    update?: XOR<XOR<AppUserUpdateToOneWithWhereWithoutSavedCafesInput, AppUserUpdateWithoutSavedCafesInput>, AppUserUncheckedUpdateWithoutSavedCafesInput>
  }

  export type CafeUpdateOneRequiredWithoutSavedCafesNestedInput = {
    create?: XOR<CafeCreateWithoutSavedCafesInput, CafeUncheckedCreateWithoutSavedCafesInput>
    connectOrCreate?: CafeCreateOrConnectWithoutSavedCafesInput
    upsert?: CafeUpsertWithoutSavedCafesInput
    connect?: CafeWhereUniqueInput
    update?: XOR<XOR<CafeUpdateToOneWithWhereWithoutSavedCafesInput, CafeUpdateWithoutSavedCafesInput>, CafeUncheckedUpdateWithoutSavedCafesInput>
  }

  export type AppUserCreateNestedOneWithoutCafeRecordsInput = {
    create?: XOR<AppUserCreateWithoutCafeRecordsInput, AppUserUncheckedCreateWithoutCafeRecordsInput>
    connectOrCreate?: AppUserCreateOrConnectWithoutCafeRecordsInput
    connect?: AppUserWhereUniqueInput
  }

  export type CafeCreateNestedOneWithoutCafeRecordsInput = {
    create?: XOR<CafeCreateWithoutCafeRecordsInput, CafeUncheckedCreateWithoutCafeRecordsInput>
    connectOrCreate?: CafeCreateOrConnectWithoutCafeRecordsInput
    connect?: CafeWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AppUserUpdateOneRequiredWithoutCafeRecordsNestedInput = {
    create?: XOR<AppUserCreateWithoutCafeRecordsInput, AppUserUncheckedCreateWithoutCafeRecordsInput>
    connectOrCreate?: AppUserCreateOrConnectWithoutCafeRecordsInput
    upsert?: AppUserUpsertWithoutCafeRecordsInput
    connect?: AppUserWhereUniqueInput
    update?: XOR<XOR<AppUserUpdateToOneWithWhereWithoutCafeRecordsInput, AppUserUpdateWithoutCafeRecordsInput>, AppUserUncheckedUpdateWithoutCafeRecordsInput>
  }

  export type CafeUpdateOneRequiredWithoutCafeRecordsNestedInput = {
    create?: XOR<CafeCreateWithoutCafeRecordsInput, CafeUncheckedCreateWithoutCafeRecordsInput>
    connectOrCreate?: CafeCreateOrConnectWithoutCafeRecordsInput
    upsert?: CafeUpsertWithoutCafeRecordsInput
    connect?: CafeWhereUniqueInput
    update?: XOR<XOR<CafeUpdateToOneWithWhereWithoutCafeRecordsInput, CafeUpdateWithoutCafeRecordsInput>, CafeUncheckedUpdateWithoutCafeRecordsInput>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserSavedCafeCreateWithoutAppUserInput = {
    id?: bigint | number
    savedType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cafe: CafeCreateNestedOneWithoutSavedCafesInput
  }

  export type UserSavedCafeUncheckedCreateWithoutAppUserInput = {
    id?: bigint | number
    kakaoPlaceId: string
    savedType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSavedCafeCreateOrConnectWithoutAppUserInput = {
    where: UserSavedCafeWhereUniqueInput
    create: XOR<UserSavedCafeCreateWithoutAppUserInput, UserSavedCafeUncheckedCreateWithoutAppUserInput>
  }

  export type UserSavedCafeCreateManyAppUserInputEnvelope = {
    data: UserSavedCafeCreateManyAppUserInput | UserSavedCafeCreateManyAppUserInput[]
    skipDuplicates?: boolean
  }

  export type CafeRecordCreateWithoutAppUserInput = {
    id?: bigint | number
    recordType: string
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cafe: CafeCreateNestedOneWithoutCafeRecordsInput
  }

  export type CafeRecordUncheckedCreateWithoutAppUserInput = {
    id?: bigint | number
    kakaoPlaceId: string
    recordType: string
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CafeRecordCreateOrConnectWithoutAppUserInput = {
    where: CafeRecordWhereUniqueInput
    create: XOR<CafeRecordCreateWithoutAppUserInput, CafeRecordUncheckedCreateWithoutAppUserInput>
  }

  export type CafeRecordCreateManyAppUserInputEnvelope = {
    data: CafeRecordCreateManyAppUserInput | CafeRecordCreateManyAppUserInput[]
    skipDuplicates?: boolean
  }

  export type UserSavedCafeUpsertWithWhereUniqueWithoutAppUserInput = {
    where: UserSavedCafeWhereUniqueInput
    update: XOR<UserSavedCafeUpdateWithoutAppUserInput, UserSavedCafeUncheckedUpdateWithoutAppUserInput>
    create: XOR<UserSavedCafeCreateWithoutAppUserInput, UserSavedCafeUncheckedCreateWithoutAppUserInput>
  }

  export type UserSavedCafeUpdateWithWhereUniqueWithoutAppUserInput = {
    where: UserSavedCafeWhereUniqueInput
    data: XOR<UserSavedCafeUpdateWithoutAppUserInput, UserSavedCafeUncheckedUpdateWithoutAppUserInput>
  }

  export type UserSavedCafeUpdateManyWithWhereWithoutAppUserInput = {
    where: UserSavedCafeScalarWhereInput
    data: XOR<UserSavedCafeUpdateManyMutationInput, UserSavedCafeUncheckedUpdateManyWithoutAppUserInput>
  }

  export type UserSavedCafeScalarWhereInput = {
    AND?: UserSavedCafeScalarWhereInput | UserSavedCafeScalarWhereInput[]
    OR?: UserSavedCafeScalarWhereInput[]
    NOT?: UserSavedCafeScalarWhereInput | UserSavedCafeScalarWhereInput[]
    id?: BigIntFilter<"UserSavedCafe"> | bigint | number
    appUserId?: BigIntFilter<"UserSavedCafe"> | bigint | number
    kakaoPlaceId?: StringFilter<"UserSavedCafe"> | string
    savedType?: StringFilter<"UserSavedCafe"> | string
    createdAt?: DateTimeFilter<"UserSavedCafe"> | Date | string
    updatedAt?: DateTimeFilter<"UserSavedCafe"> | Date | string
  }

  export type CafeRecordUpsertWithWhereUniqueWithoutAppUserInput = {
    where: CafeRecordWhereUniqueInput
    update: XOR<CafeRecordUpdateWithoutAppUserInput, CafeRecordUncheckedUpdateWithoutAppUserInput>
    create: XOR<CafeRecordCreateWithoutAppUserInput, CafeRecordUncheckedCreateWithoutAppUserInput>
  }

  export type CafeRecordUpdateWithWhereUniqueWithoutAppUserInput = {
    where: CafeRecordWhereUniqueInput
    data: XOR<CafeRecordUpdateWithoutAppUserInput, CafeRecordUncheckedUpdateWithoutAppUserInput>
  }

  export type CafeRecordUpdateManyWithWhereWithoutAppUserInput = {
    where: CafeRecordScalarWhereInput
    data: XOR<CafeRecordUpdateManyMutationInput, CafeRecordUncheckedUpdateManyWithoutAppUserInput>
  }

  export type CafeRecordScalarWhereInput = {
    AND?: CafeRecordScalarWhereInput | CafeRecordScalarWhereInput[]
    OR?: CafeRecordScalarWhereInput[]
    NOT?: CafeRecordScalarWhereInput | CafeRecordScalarWhereInput[]
    id?: BigIntFilter<"CafeRecord"> | bigint | number
    appUserId?: BigIntFilter<"CafeRecord"> | bigint | number
    kakaoPlaceId?: StringFilter<"CafeRecord"> | string
    recordType?: StringFilter<"CafeRecord"> | string
    displayOrder?: IntFilter<"CafeRecord"> | number
    createdAt?: DateTimeFilter<"CafeRecord"> | Date | string
    updatedAt?: DateTimeFilter<"CafeRecord"> | Date | string
  }

  export type UserSavedCafeCreateWithoutCafeInput = {
    id?: bigint | number
    savedType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appUser: AppUserCreateNestedOneWithoutSavedCafesInput
  }

  export type UserSavedCafeUncheckedCreateWithoutCafeInput = {
    id?: bigint | number
    appUserId: bigint | number
    savedType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSavedCafeCreateOrConnectWithoutCafeInput = {
    where: UserSavedCafeWhereUniqueInput
    create: XOR<UserSavedCafeCreateWithoutCafeInput, UserSavedCafeUncheckedCreateWithoutCafeInput>
  }

  export type UserSavedCafeCreateManyCafeInputEnvelope = {
    data: UserSavedCafeCreateManyCafeInput | UserSavedCafeCreateManyCafeInput[]
    skipDuplicates?: boolean
  }

  export type CafeRecordCreateWithoutCafeInput = {
    id?: bigint | number
    recordType: string
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    appUser: AppUserCreateNestedOneWithoutCafeRecordsInput
  }

  export type CafeRecordUncheckedCreateWithoutCafeInput = {
    id?: bigint | number
    appUserId: bigint | number
    recordType: string
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CafeRecordCreateOrConnectWithoutCafeInput = {
    where: CafeRecordWhereUniqueInput
    create: XOR<CafeRecordCreateWithoutCafeInput, CafeRecordUncheckedCreateWithoutCafeInput>
  }

  export type CafeRecordCreateManyCafeInputEnvelope = {
    data: CafeRecordCreateManyCafeInput | CafeRecordCreateManyCafeInput[]
    skipDuplicates?: boolean
  }

  export type UserSavedCafeUpsertWithWhereUniqueWithoutCafeInput = {
    where: UserSavedCafeWhereUniqueInput
    update: XOR<UserSavedCafeUpdateWithoutCafeInput, UserSavedCafeUncheckedUpdateWithoutCafeInput>
    create: XOR<UserSavedCafeCreateWithoutCafeInput, UserSavedCafeUncheckedCreateWithoutCafeInput>
  }

  export type UserSavedCafeUpdateWithWhereUniqueWithoutCafeInput = {
    where: UserSavedCafeWhereUniqueInput
    data: XOR<UserSavedCafeUpdateWithoutCafeInput, UserSavedCafeUncheckedUpdateWithoutCafeInput>
  }

  export type UserSavedCafeUpdateManyWithWhereWithoutCafeInput = {
    where: UserSavedCafeScalarWhereInput
    data: XOR<UserSavedCafeUpdateManyMutationInput, UserSavedCafeUncheckedUpdateManyWithoutCafeInput>
  }

  export type CafeRecordUpsertWithWhereUniqueWithoutCafeInput = {
    where: CafeRecordWhereUniqueInput
    update: XOR<CafeRecordUpdateWithoutCafeInput, CafeRecordUncheckedUpdateWithoutCafeInput>
    create: XOR<CafeRecordCreateWithoutCafeInput, CafeRecordUncheckedCreateWithoutCafeInput>
  }

  export type CafeRecordUpdateWithWhereUniqueWithoutCafeInput = {
    where: CafeRecordWhereUniqueInput
    data: XOR<CafeRecordUpdateWithoutCafeInput, CafeRecordUncheckedUpdateWithoutCafeInput>
  }

  export type CafeRecordUpdateManyWithWhereWithoutCafeInput = {
    where: CafeRecordScalarWhereInput
    data: XOR<CafeRecordUpdateManyMutationInput, CafeRecordUncheckedUpdateManyWithoutCafeInput>
  }

  export type AppUserCreateWithoutSavedCafesInput = {
    id?: bigint | number
    authProvider: string
    providerUserId: string
    email?: string | null
    nickname: string
    displayName?: string | null
    profileImageUrl?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string
    cafeRecords?: CafeRecordCreateNestedManyWithoutAppUserInput
  }

  export type AppUserUncheckedCreateWithoutSavedCafesInput = {
    id?: bigint | number
    authProvider: string
    providerUserId: string
    email?: string | null
    nickname: string
    displayName?: string | null
    profileImageUrl?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string
    cafeRecords?: CafeRecordUncheckedCreateNestedManyWithoutAppUserInput
  }

  export type AppUserCreateOrConnectWithoutSavedCafesInput = {
    where: AppUserWhereUniqueInput
    create: XOR<AppUserCreateWithoutSavedCafesInput, AppUserUncheckedCreateWithoutSavedCafesInput>
  }

  export type CafeCreateWithoutSavedCafesInput = {
    kakaoPlaceId: string
    placeName: string
    categoryName?: string | null
    phone?: string | null
    addressName?: string | null
    roadAddressName?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    placeUrl?: string | null
    lastFetchedAt: Date | string
    nextRefreshAt?: Date | string | null
    createdAt?: Date | string
    cafeRecords?: CafeRecordCreateNestedManyWithoutCafeInput
  }

  export type CafeUncheckedCreateWithoutSavedCafesInput = {
    kakaoPlaceId: string
    placeName: string
    categoryName?: string | null
    phone?: string | null
    addressName?: string | null
    roadAddressName?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    placeUrl?: string | null
    lastFetchedAt: Date | string
    nextRefreshAt?: Date | string | null
    createdAt?: Date | string
    cafeRecords?: CafeRecordUncheckedCreateNestedManyWithoutCafeInput
  }

  export type CafeCreateOrConnectWithoutSavedCafesInput = {
    where: CafeWhereUniqueInput
    create: XOR<CafeCreateWithoutSavedCafesInput, CafeUncheckedCreateWithoutSavedCafesInput>
  }

  export type AppUserUpsertWithoutSavedCafesInput = {
    update: XOR<AppUserUpdateWithoutSavedCafesInput, AppUserUncheckedUpdateWithoutSavedCafesInput>
    create: XOR<AppUserCreateWithoutSavedCafesInput, AppUserUncheckedCreateWithoutSavedCafesInput>
    where?: AppUserWhereInput
  }

  export type AppUserUpdateToOneWithWhereWithoutSavedCafesInput = {
    where?: AppUserWhereInput
    data: XOR<AppUserUpdateWithoutSavedCafesInput, AppUserUncheckedUpdateWithoutSavedCafesInput>
  }

  export type AppUserUpdateWithoutSavedCafesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    authProvider?: StringFieldUpdateOperationsInput | string
    providerUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cafeRecords?: CafeRecordUpdateManyWithoutAppUserNestedInput
  }

  export type AppUserUncheckedUpdateWithoutSavedCafesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    authProvider?: StringFieldUpdateOperationsInput | string
    providerUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cafeRecords?: CafeRecordUncheckedUpdateManyWithoutAppUserNestedInput
  }

  export type CafeUpsertWithoutSavedCafesInput = {
    update: XOR<CafeUpdateWithoutSavedCafesInput, CafeUncheckedUpdateWithoutSavedCafesInput>
    create: XOR<CafeCreateWithoutSavedCafesInput, CafeUncheckedCreateWithoutSavedCafesInput>
    where?: CafeWhereInput
  }

  export type CafeUpdateToOneWithWhereWithoutSavedCafesInput = {
    where?: CafeWhereInput
    data: XOR<CafeUpdateWithoutSavedCafesInput, CafeUncheckedUpdateWithoutSavedCafesInput>
  }

  export type CafeUpdateWithoutSavedCafesInput = {
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    placeName?: StringFieldUpdateOperationsInput | string
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    addressName?: NullableStringFieldUpdateOperationsInput | string | null
    roadAddressName?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    placeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lastFetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRefreshAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cafeRecords?: CafeRecordUpdateManyWithoutCafeNestedInput
  }

  export type CafeUncheckedUpdateWithoutSavedCafesInput = {
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    placeName?: StringFieldUpdateOperationsInput | string
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    addressName?: NullableStringFieldUpdateOperationsInput | string | null
    roadAddressName?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    placeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lastFetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRefreshAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cafeRecords?: CafeRecordUncheckedUpdateManyWithoutCafeNestedInput
  }

  export type AppUserCreateWithoutCafeRecordsInput = {
    id?: bigint | number
    authProvider: string
    providerUserId: string
    email?: string | null
    nickname: string
    displayName?: string | null
    profileImageUrl?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string
    savedCafes?: UserSavedCafeCreateNestedManyWithoutAppUserInput
  }

  export type AppUserUncheckedCreateWithoutCafeRecordsInput = {
    id?: bigint | number
    authProvider: string
    providerUserId: string
    email?: string | null
    nickname: string
    displayName?: string | null
    profileImageUrl?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string
    savedCafes?: UserSavedCafeUncheckedCreateNestedManyWithoutAppUserInput
  }

  export type AppUserCreateOrConnectWithoutCafeRecordsInput = {
    where: AppUserWhereUniqueInput
    create: XOR<AppUserCreateWithoutCafeRecordsInput, AppUserUncheckedCreateWithoutCafeRecordsInput>
  }

  export type CafeCreateWithoutCafeRecordsInput = {
    kakaoPlaceId: string
    placeName: string
    categoryName?: string | null
    phone?: string | null
    addressName?: string | null
    roadAddressName?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    placeUrl?: string | null
    lastFetchedAt: Date | string
    nextRefreshAt?: Date | string | null
    createdAt?: Date | string
    savedCafes?: UserSavedCafeCreateNestedManyWithoutCafeInput
  }

  export type CafeUncheckedCreateWithoutCafeRecordsInput = {
    kakaoPlaceId: string
    placeName: string
    categoryName?: string | null
    phone?: string | null
    addressName?: string | null
    roadAddressName?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    placeUrl?: string | null
    lastFetchedAt: Date | string
    nextRefreshAt?: Date | string | null
    createdAt?: Date | string
    savedCafes?: UserSavedCafeUncheckedCreateNestedManyWithoutCafeInput
  }

  export type CafeCreateOrConnectWithoutCafeRecordsInput = {
    where: CafeWhereUniqueInput
    create: XOR<CafeCreateWithoutCafeRecordsInput, CafeUncheckedCreateWithoutCafeRecordsInput>
  }

  export type AppUserUpsertWithoutCafeRecordsInput = {
    update: XOR<AppUserUpdateWithoutCafeRecordsInput, AppUserUncheckedUpdateWithoutCafeRecordsInput>
    create: XOR<AppUserCreateWithoutCafeRecordsInput, AppUserUncheckedCreateWithoutCafeRecordsInput>
    where?: AppUserWhereInput
  }

  export type AppUserUpdateToOneWithWhereWithoutCafeRecordsInput = {
    where?: AppUserWhereInput
    data: XOR<AppUserUpdateWithoutCafeRecordsInput, AppUserUncheckedUpdateWithoutCafeRecordsInput>
  }

  export type AppUserUpdateWithoutCafeRecordsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    authProvider?: StringFieldUpdateOperationsInput | string
    providerUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedCafes?: UserSavedCafeUpdateManyWithoutAppUserNestedInput
  }

  export type AppUserUncheckedUpdateWithoutCafeRecordsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    authProvider?: StringFieldUpdateOperationsInput | string
    providerUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedCafes?: UserSavedCafeUncheckedUpdateManyWithoutAppUserNestedInput
  }

  export type CafeUpsertWithoutCafeRecordsInput = {
    update: XOR<CafeUpdateWithoutCafeRecordsInput, CafeUncheckedUpdateWithoutCafeRecordsInput>
    create: XOR<CafeCreateWithoutCafeRecordsInput, CafeUncheckedCreateWithoutCafeRecordsInput>
    where?: CafeWhereInput
  }

  export type CafeUpdateToOneWithWhereWithoutCafeRecordsInput = {
    where?: CafeWhereInput
    data: XOR<CafeUpdateWithoutCafeRecordsInput, CafeUncheckedUpdateWithoutCafeRecordsInput>
  }

  export type CafeUpdateWithoutCafeRecordsInput = {
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    placeName?: StringFieldUpdateOperationsInput | string
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    addressName?: NullableStringFieldUpdateOperationsInput | string | null
    roadAddressName?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    placeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lastFetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRefreshAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedCafes?: UserSavedCafeUpdateManyWithoutCafeNestedInput
  }

  export type CafeUncheckedUpdateWithoutCafeRecordsInput = {
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    placeName?: StringFieldUpdateOperationsInput | string
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    addressName?: NullableStringFieldUpdateOperationsInput | string | null
    roadAddressName?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    placeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lastFetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextRefreshAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedCafes?: UserSavedCafeUncheckedUpdateManyWithoutCafeNestedInput
  }

  export type UserSavedCafeCreateManyAppUserInput = {
    id?: bigint | number
    kakaoPlaceId: string
    savedType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CafeRecordCreateManyAppUserInput = {
    id?: bigint | number
    kakaoPlaceId: string
    recordType: string
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSavedCafeUpdateWithoutAppUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cafe?: CafeUpdateOneRequiredWithoutSavedCafesNestedInput
  }

  export type UserSavedCafeUncheckedUpdateWithoutAppUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSavedCafeUncheckedUpdateManyWithoutAppUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CafeRecordUpdateWithoutAppUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cafe?: CafeUpdateOneRequiredWithoutCafeRecordsNestedInput
  }

  export type CafeRecordUncheckedUpdateWithoutAppUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CafeRecordUncheckedUpdateManyWithoutAppUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    kakaoPlaceId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSavedCafeCreateManyCafeInput = {
    id?: bigint | number
    appUserId: bigint | number
    savedType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CafeRecordCreateManyCafeInput = {
    id?: bigint | number
    appUserId: bigint | number
    recordType: string
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSavedCafeUpdateWithoutCafeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appUser?: AppUserUpdateOneRequiredWithoutSavedCafesNestedInput
  }

  export type UserSavedCafeUncheckedUpdateWithoutCafeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    appUserId?: BigIntFieldUpdateOperationsInput | bigint | number
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSavedCafeUncheckedUpdateManyWithoutCafeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    appUserId?: BigIntFieldUpdateOperationsInput | bigint | number
    savedType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CafeRecordUpdateWithoutCafeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appUser?: AppUserUpdateOneRequiredWithoutCafeRecordsNestedInput
  }

  export type CafeRecordUncheckedUpdateWithoutCafeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    appUserId?: BigIntFieldUpdateOperationsInput | bigint | number
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CafeRecordUncheckedUpdateManyWithoutCafeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    appUserId?: BigIntFieldUpdateOperationsInput | bigint | number
    recordType?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}