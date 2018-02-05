import {S, Maybe} from "../../external/sanctuary/Sanctuary";
import * as R from "ramda";

//setPropsFromRamdaLens :: (String -> Lens) -> Object -> StrMap
//https://repl.it/NcuK/2
export const setPropsFromRamdaLens = fn => obj => delta =>
  Object
    .keys(delta)
    .reduce(
      (acc, key) => 
        R.set (fn(key)) (delta[key]) (acc)
      , obj);

//reduce an object to only be the ramda-style lens they contain - https://repl.it/N1p3/2
export const reduceToRamdaLens = lens => obj =>
  Object
    .keys(obj)
    .reduce((acc, key) => 
      {
        R.when(
          v => R.not(R.isNil(v)),
          v => acc[key] = R.merge(v) (reduceToRamdaLens (lens) (v))
        ) (R.view (lens) (obj[key]))
        return acc;
      }, {});

//map keys of an object - via https://github.com/ramda/ramda/wiki/Cookbook#map-keys-of-an-object
//mapKeys :: (String -> String) -> Object -> Object
export const mapObjKeys = fn => obj =>
  R.fromPairs(R.map(R.adjust(fn, 0), R.toPairs(obj)));

//drops items from objB where each value is compared to the one with the same key in objA
export const omitObjCompared = fn => objA => objB =>
  R.pick(
    R.reject(key => fn(R.prop(key, objA), R.prop(key, objB))) (Object.keys(objB)),
    objB
  );
  

//Maps keys in an object to a lookup table
//Drops items that are not found
export const mapObjKeysLookup = lookup => S.pipe([
  R.toPairs,
  S.mapMaybe(([k, v]) => R.has(k, lookup) ? S.Just([lookup[k], v]) : S.Nothing),
  R.fromPairs
]);

//Filters an object by value

export const filterObjVal = fn => obj =>
  Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];
    if (fn(val)) {
      acc[key] = val;
    }
    return acc;
  }, {})

export const filterObjExcludeVals = vals =>
  filterObjVal(val => vals.indexOf(val) === -1);

//filter by keys
export const filterObjectByKeys = fn => obj => 
  Object.keys(obj)
    .filter(key => !fn(key))
    .reduce((ret, key) => 
      {
        ret[key] = obj[key];
        return ret;
      }, {});


export const flap = f => x => S.map(S.T(x), f)

//compare a maybe to its value based on a predicate
//Nothing is always false
//see https://repl.it/@DavidKomer/compareMaybe
export const compareMaybe = <A>(pred:((a:A) => (b:A) => boolean)) => (a:A) => (mB:Maybe<A>):boolean => 
    S.maybe (false) (pred(a)) (mB);

//see if a maybe's value based on a predicate
//Nothing is always false
export const equalsMaybe = <A>(a:A) => (mB:Maybe<A>):boolean => 
    compareMaybe(S.equals) (a) (mB);