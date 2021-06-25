/**
 * Compiled info page or component
 * */
enum CompileTarget {
  page = 'page',
  component = 'component',
}

/**
 * {} is true
 * {k:v} is false
 * */
function isEmptyObject(obj: Record<any, any>) {
  return !Object.keys(obj).length;
}

/**
 * if have the same key, by default the v2 object cover the v1 object
 * it returns an object,No matter v1 or v2 Isn't it an object
 * */
function shallowMerge<T extends Object>(v1: T | undefined, v2: T | undefined) {
  if (!v1) {
    return v2 || {};
  }

  if (!v2) {
    return v1 || {};
  }

  return {
    ...v1,
    ...v2,
  };
}

/**
 * if condition === false break the program
 * */
function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(msg);
  }
}

/**
 * if condition === false and then send warning
 * */
function warn(condition: boolean, msg: string) {
  if (!condition) {
    console.warn(msg);
  }
}

/**
 * change the kebab case name to camel case name
 * */
function toHumpName(name: string): string {
  if (!name) return name;

  return name.replace(/-(\w)/g, (_, $1) => $1.toUpperCase());
}

export { isEmptyObject, shallowMerge, assert, CompileTarget, warn, toHumpName };
