/* eslint-disable @typescript-eslint/no-explicit-any */
import { Primitive, Simplify } from "type-fest"

//Based off of PartialDeep from type-fest (https://github.com/sindresorhus/type-fest)

type BuiltIns = Primitive | Date | RegExp

/**
@see NullPartialDeep
*/
export interface NullPartialDeepOptions {
  /**
	Whether to affect the individual elements of arrays and tuples.

	@default true
	*/
  readonly recurseIntoArrays?: boolean

  /**
	@default false
	*/
  readonly makeArrayTypeNullable?: boolean
}

/**
Create a type from another type with all keys and nested keys set to allow null.

Use-cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with its keys would be redundant in terms of the mock or test.

@example
```
import type {NullPartialDeep} from 'type-fest';

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
export type NullPartialDeep<
  T,
  Options extends NullPartialDeepOptions = {
    recurseIntoArrays: true
    makeArrayTypeNullable: false
  },
> = T extends BuiltIns
  ? T
  : T extends Map<infer KeyType, infer ValueType>
  ? NullPartialMapDeep<KeyType, ValueType, Options>
  : T extends Set<infer ItemType>
  ? NullPartialSetDeep<ItemType, Options>
  : T extends ReadonlyMap<infer KeyType, infer ValueType>
  ? NullPartialReadonlyMapDeep<KeyType, ValueType, Options>
  : T extends ReadonlySet<infer ItemType>
  ? NullPartialReadonlySetDeep<ItemType, Options>
  : T extends (...args: any[]) => unknown
  ? T | null
  : T extends object
  ? T extends ReadonlyArray<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
    ? Options["recurseIntoArrays"] extends false // If they opt out of array testing, just use the original type
      ? T
      : ItemType[] extends T // Test for arrays (non-tuples) specifically
      ? readonly ItemType[] extends T // Differentiate readonly and mutable arrays
        ? Options["makeArrayTypeNullable"] extends false
          ? ReadonlyArray<NullPartialDeep<ItemType, Options>>
          : ReadonlyArray<NullPartialDeep<ItemType | null, Options>>
        : Options["makeArrayTypeNullable"] extends false
        ? Array<NullPartialDeep<ItemType, Options>>
        : Array<NullPartialDeep<ItemType | null, Options>>
      : NullPartialObjectDeep<T, Options> // Tuples behave properly
    : NullPartialObjectDeep<T, Options>
  : unknown

/**
Same as `PartialDeep`, but accepts only `Map`s and as inputs. Internal helper for `PartialDeep`.
*/
type NullPartialMapDeep<
  KeyType,
  ValueType,
  Options extends NullPartialDeepOptions,
> = Map<NullPartialDeep<KeyType, Options>, NullPartialDeep<ValueType, Options>>

/**
Same as `PartialDeep`, but accepts only `Set`s as inputs. Internal helper for `PartialDeep`.
*/
type NullPartialSetDeep<T, Options extends NullPartialDeepOptions> = Set<
  NullPartialDeep<T, Options>
>

/**
Same as `PartialDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `PartialDeep`.
*/
type NullPartialReadonlyMapDeep<
  KeyType,
  ValueType,
  Options extends NullPartialDeepOptions,
> = ReadonlyMap<
  NullPartialDeep<KeyType, Options>,
  NullPartialDeep<ValueType, Options>
>

/**
Same as `PartialDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `PartialDeep`.
*/
type NullPartialReadonlySetDeep<
  T,
  Options extends NullPartialDeepOptions,
> = ReadonlySet<NullPartialDeep<T, Options>>

/**
Same as `PartialDeep`, but accepts only `object`s as inputs. Internal helper for `PartialDeep`.
*/
type NullPartialObjectDeep<
  ObjectType extends object,
  Options extends NullPartialDeepOptions,
> = Simplify<{
  [KeyType in keyof ObjectType]: NullPartialDeep<
    ObjectType[KeyType],
    Options
  > | null
}>