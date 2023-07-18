/* eslint-disable @typescript-eslint/no-explicit-any */
import { Primitive, Simplify } from "type-fest"

import { Merge } from "types/util"

//Based off of PartialDeep from type-fest (https://github.com/sindresorhus/type-fest)

//TODO: Make "ignoreKeys" based on full path and not just key name

type BuiltIns = Primitive | Date | RegExp

/**
@see NullableDeep
*/
export interface NullableDeepOptions {
  /**
	Whether to affect the individual elements of arrays and tuples.

	@default true
	*/
  readonly recurseIntoArrays?: boolean

  /**
	@default false
	*/
  readonly makeArrayTypeNullable?: boolean

  /**
	@default true
	*/
  readonly makeObjectTypeNullable?: boolean

  readonly ignoreKeys?: unknown
}

interface DefaultNullableDeepOptions extends NullableDeepOptions {
  recurseIntoArrays: true
  makeArrayTypeNullable: false
  makeObjectTypeNullable: true
  ignoreKeys: never
}

/**
Create a type from another type with all keys and nested keys set to allow null.

Use-cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with its keys would be redundant in terms of the mock or test.

@example
```
import type {NullableDeep} from 'type-fest';

const settings: Settings = {
	textEditor: {
		fontSize: 14;
		fontColor: '#000000';
		fontWeight: 400;
	}
	autocomplete: false;
	autosave: true;
};

const applySavedSettings = (savedSettings: PartialDeep<Settings>) => {
	return {...settings, ...savedSettings};
}

settings = applySavedSettings({textEditor: {fontWeight: 500}});
```

By default, this also affects array and tuple types:

```
import type {PartialDeep} from 'type-fest';

interface Settings {
	languages: string[];
}

const partialSettings: PartialDeep<Settings> = {
	languages: null
};
```

If this is undesirable, you can pass `{recurseIntoArrays: false}` as the second type argument.

@category Object
@category Array
@category Set
@category Map
*/
export type NullableDeep<
  T,
  Options extends NullableDeepOptions = DefaultNullableDeepOptions,
  MergedOptions extends NullableDeepOptions = Merge<
    DefaultNullableDeepOptions,
    Options
  >,
> = T extends BuiltIns
  ? T
  : T extends Map<infer KeyType, infer ValueType>
  ? NullableMapDeep<KeyType, ValueType, MergedOptions>
  : T extends Set<infer ItemType>
  ? NullableSetDeep<ItemType, MergedOptions>
  : T extends ReadonlyMap<infer KeyType, infer ValueType>
  ? NullableReadonlyMapDeep<KeyType, ValueType, MergedOptions>
  : T extends ReadonlySet<infer ItemType>
  ? NullableReadonlySetDeep<ItemType, MergedOptions>
  : T extends (...args: any[]) => unknown
  ? T | null
  : T extends object
  ? T extends ReadonlyArray<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
    ? MergedOptions["recurseIntoArrays"] extends false // If they opt out of array testing, just use the original type
      ? T
      : ItemType[] extends T // Test for arrays (non-tuples) specifically
      ? readonly ItemType[] extends T // Differentiate readonly and mutable arrays
        ? MergedOptions["makeArrayTypeNullable"] extends false
          ? ReadonlyArray<NullableDeep<ItemType, MergedOptions>>
          : ReadonlyArray<NullableDeep<ItemType | null, MergedOptions>>
        : MergedOptions["makeArrayTypeNullable"] extends false
        ? Array<NullableDeep<ItemType, MergedOptions>>
        : Array<NullableDeep<ItemType | null, MergedOptions>>
      : NullableObjectDeep<T, MergedOptions> // Tuples behave properly
    : NullableObjectDeep<T, MergedOptions>
  : unknown

/**
Same as `PartialDeep`, but accepts only `Map`s and as inputs. Internal helper for `PartialDeep`.
*/
type NullableMapDeep<
  KeyType,
  ValueType,
  Options extends NullableDeepOptions,
> = Map<NullableDeep<KeyType, Options>, NullableDeep<ValueType, Options>>

/**
Same as `PartialDeep`, but accepts only `Set`s as inputs. Internal helper for `PartialDeep`.
*/
type NullableSetDeep<T, Options extends NullableDeepOptions> = Set<
  NullableDeep<T, Options>
>

/**
Same as `PartialDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `PartialDeep`.
*/
type NullableReadonlyMapDeep<
  KeyType,
  ValueType,
  Options extends NullableDeepOptions,
> = ReadonlyMap<
  NullableDeep<KeyType, Options>,
  NullableDeep<ValueType, Options>
>

/**
Same as `PartialDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `PartialDeep`.
*/
type NullableReadonlySetDeep<
  T,
  Options extends NullableDeepOptions,
> = ReadonlySet<NullableDeep<T, Options>>

/**
Same as `PartialDeep`, but accepts only `object`s as inputs. Internal helper for `PartialDeep`.
*/
type NullableObjectDeep<
  ObjectType extends object,
  Options extends NullableDeepOptions,
> = Simplify<{
  [KeyType in keyof ObjectType]: KeyType extends Options["ignoreKeys"]
    ? ObjectType[KeyType]
    : Options["makeObjectTypeNullable"] extends true
    ? NullableDeep<ObjectType[KeyType], Options> | null
    : ObjectType[KeyType] extends object
    ? ObjectType[KeyType] extends ReadonlyArray<infer _>
      ? NullableDeep<ObjectType[KeyType], Options> | null
      : NullableDeep<ObjectType[KeyType], Options>
    : NullableDeep<ObjectType[KeyType], Options> | null
}>
