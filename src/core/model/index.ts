/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Merge, Simplify } from 'type-fest';

type CollumnOptions = {
  isPrimaryKey?: boolean;
  isNullable?: boolean;
  hasDefault?: boolean;
  isVirtual?: boolean;
};

const defaultOptions = {
  isPrimaryKey: false as const,
  isNullable: false as const,
  hasDefault: false as const,
  isVirtual: false as const,
};

type MergeOptions<T1 extends CollumnOptions, T2 extends CollumnOptions> = Merge<
  T1,
  T2
>;
type DefaultValue<TType> = TType | (() => TType);

class Collumn<
  TName extends string,
  TType,
  TOptions extends CollumnOptions = typeof defaultOptions,
> {
  name: TName;

  type!: TType;

  isPrimaryKey: TOptions['isPrimaryKey'];

  isNullable: TOptions['isNullable'];

  hasDefault: TOptions['hasDefault'];

  isVirtual: TOptions['isVirtual'];

  defaultValue!: DefaultValue<TType>;

  constructor(name: TName) {
    this.name = name;
    this.isPrimaryKey = defaultOptions.isPrimaryKey;
    this.isNullable = defaultOptions.isNullable;
    this.hasDefault = defaultOptions.hasDefault;
    this.isVirtual = defaultOptions.isVirtual;
  }

  primaryKey() {
    this.isPrimaryKey = true;
    return this as unknown as Collumn<
      TName,
      TType,
      MergeOptions<
        TOptions,
        {
          isPrimaryKey: true;
        }
      >
    >;
  }

  nullable() {
    this.isNullable = true;
    return this as unknown as Collumn<
      TName,
      TType,
      MergeOptions<
        TOptions,
        {
          isNullable: true;
        }
      >
    >;
  }

  default(value: DefaultValue<TType>) {
    this.hasDefault = true;
    this.defaultValue = value;
    return this as unknown as Collumn<
      TName,
      TType,
      MergeOptions<
        TOptions,
        {
          hasDefault: true;
        }
      >
    >;
  }

  virtual() {
    this.isVirtual = true;
    return this as unknown as Collumn<
      TName,
      TType,
      MergeOptions<
        TOptions,
        {
          isVirtual: true;
        }
      >
    >;
  }

  modelToRow(value: unknown) {
    return value;
  }

  rowToModel(value: unknown) {
    return value;
  }
}

class BooleanCollumn<TName extends string> extends Collumn<TName, boolean> {
  modelToRow(value: unknown) {
    return value ? 1 : 0;
  }

  rowToModel(value: unknown) {
    return !!value;
  }
}

class JSONCollumn<TName extends string, TType> extends Collumn<TName, TType> {
  modelToRow(value: unknown) {
    return JSON.stringify(value);
  }

  rowToModel(value: unknown) {
    if (typeof value !== 'string') return value;

    try {
      return JSON.parse(value as string);
    } catch {
      return value;
    }
  }
}

class Table<TSchema extends AnyTableSchema> {
  constructor(
    readonly name: string,
    public schema: TSchema,
  ) {}

  extends<TNewSchema extends AnyTableSchema>(name: string, schema: TNewSchema) {
    type ExtendedSchema = Merge<TSchema, TNewSchema>;
    const extenedSchema = {
      ...this.schema,
      ...schema,
    };
    return new Table<ExtendedSchema>(
      name,
      extenedSchema as unknown as ExtendedSchema,
    );
  }
}

type AnyCollumn = Collumn<any, any, any>;

type TableSchema<T extends AnyCollumn> = Record<string, T>;

type AnyTableSchema = TableSchema<AnyCollumn>;

type AnyTable = Table<AnyTableSchema>;

type RequiredInsertKeyOnly<
  TKey,
  TCollumn extends AnyCollumn,
> = TCollumn['isNullable'] extends false
  ?
      | TCollumn['isPrimaryKey']
      | TCollumn['hasDefault']
      | TCollumn['isVirtual'] extends false
    ? TKey
    : never
  : never;

type OptionalInsertKeyOnly<TKey, TCollumn extends AnyCollumn> = true extends
  | TCollumn['isNullable']
  | TCollumn['isPrimaryKey']
  | TCollumn['hasDefault']
  ? TKey
  : never;

type RequiredUpdateKeyOnly<
  TKey,
  TCollumn extends AnyCollumn,
> = TCollumn['isPrimaryKey'] extends true ? TKey : never;

type OptionalUpdateKeyOnly<TKey, TCollumn extends AnyCollumn> =
  | TCollumn['isPrimaryKey']
  | TCollumn['hasDefault']
  | TCollumn['isVirtual'] extends false
  ? TKey
  : never;

type GetType<
  TSchema extends AnyTableSchema,
  TKey extends keyof TSchema,
> = TSchema[TKey]['isNullable'] extends true
  ? TSchema[TKey]['type'] | null
  : TSchema[TKey]['type'];

type mInferSelectSchema<TSchema extends AnyTableSchema> = {
  [TKey in keyof TSchema]: GetType<TSchema, TKey>;
};

type mInferInsertSchema<TSchema extends AnyTableSchema> = Omit<
  Simplify<
    {
      [TKey in keyof TSchema as RequiredInsertKeyOnly<
        TKey,
        TSchema[TKey]
      >]: GetType<TSchema, TKey>;
    } & {
      [TKey in keyof TSchema as OptionalInsertKeyOnly<
        TKey,
        TSchema[TKey]
      >]?: GetType<TSchema, TKey>;
    }
  >,
  'updatedAt' | 'createdAt' | 'createdBy'
>;

type mInferUpdateSchema<TSchema extends AnyTableSchema> = Simplify<
  {
    [TKey in keyof TSchema as RequiredUpdateKeyOnly<
      TKey,
      TSchema[TKey]
    >]: GetType<TSchema, TKey>;
  } & {
    [TKey in keyof TSchema as OptionalUpdateKeyOnly<
      TKey,
      TSchema[TKey]
    >]?: GetType<TSchema, TKey>;
  }
>;

type mInfer<
  TTable extends Table<any>,
  TOperation extends 'select' | 'insert' | 'update' = 'select',
> = TOperation extends 'select'
  ? mInferSelectSchema<TTable['schema']>
  : TOperation extends 'insert'
  ? mInferInsertSchema<TTable['schema']>
  : TOperation extends 'update'
  ? mInferUpdateSchema<TTable['schema']>
  : never;

type mInferRowSchema<TSchema extends AnyTableSchema> = {
  [TKey in keyof TSchema as TSchema[TKey]['name']]: GetType<TSchema, TKey>;
};

type mInferRow<TTable extends Table<any>> = mInferRowSchema<TTable['schema']>;

type MType<T> = {
  value: T;
};

function mTable<TSchema extends AnyTableSchema>(name: string, schema: TSchema) {
  return new Table(name, schema);
}

function mType<TType>() {
  return undefined as unknown as MType<TType>;
}

function mString<TName extends string>(name: TName) {
  return new Collumn<TName, string>(name);
}

function mNumber<TName extends string>(name: TName) {
  return new Collumn<TName, number>(name);
}

function mBoolean<TName extends string>(name: TName) {
  return new BooleanCollumn<TName>(name);
}

function mJSON<TName extends string, TType>(name: TName, _type: MType<TType>) {
  return new JSONCollumn<TName, TType>(name);
}

function mEnum<
  TName extends string,
  U extends string,
  TType extends Readonly<[U, ...U[]]>,
>(name: TName, _type: TType) {
  return new Collumn<TName, TType[number]>(name);
}

function mCollumn<TName extends string, TType>(
  name: TName,
  _type: MType<TType>,
) {
  return new Collumn<TName, TType>(name);
}

export type { AnyCollumn, AnyTable, mInfer, mInferRow };
export { mBoolean, mCollumn, mEnum, mJSON, mNumber, mString, mTable, mType };
