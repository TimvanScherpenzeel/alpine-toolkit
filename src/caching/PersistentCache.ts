// Vendor
import { clear, del, get, keys, set, Store } from 'idb-keyval';

// Utilities
import { assert } from '../utilities/assert';

// Types
import { IPersistentCacheOptions } from './types';

/**
 * Check if key is allowed to be stored in IndexedDB
 *
 * @param key Key to validate
 */
const isAllowedAsKey = (key: any): boolean => {
  if (typeof key === 'number' || typeof key === 'string') {
    return true;
  }

  if (key === 'object' && key) {
    if (
      Array.isArray(key) ||
      'setUTCFullYear' in key ||
      (typeof ArrayBuffer === 'function' && ArrayBuffer.isView(key)) ||
      ('byteLength' in key && 'length' in key)
    ) {
      return true;
    }
  }

  return false;
};

/**
 * PersistentCache is a simple { key: value } cache that is made persistent using IndexedDB.
 *
 * IndexedDB is promisified by `idb-keyval`, a small abstraction around the IndexedDB API.
 */
export class PersistentCache {
  // Back persistent cache with in-memory cache in order to maintain functionality
  // in case IndexedDB is not available (private browsing mode)
  private memoryCache: Map<IDBValidKey, any> = new Map();

  private options: IPersistentCacheOptions;
  private store: Store;

  /**
   * Sets various configuration options
   */
  constructor(options: IPersistentCacheOptions) {
    this.options = options;

    this.store = new Store(
      (this.options && this.options.databaseName) || 'spars-cache-db',
      (this.options && this.options.storeName) || 'spars-cache-store'
    );
  }

  /**
   * Sets a { key: value } pair in the persistent cache
   *
   * NOTE: In order to store ArrayBuffers in IndexedDB you will need to convert them to Blobs
   * SEE: `PersistentCache.convertArrayBufferToBlob()` and `PersistentCache.convertBlobToArrayBuffer()`
   *
   * @param key Key to set cache entry with
   * @param value Value to set cache entry with
   */
  public set(key: IDBValidKey, value: any): void {
    assert(isAllowedAsKey(key), 'PersistentCache -> The given type of key is not allowed');

    set(key, value, this.store).catch(err => {
      console.warn(
        `PersistentCache -> Set: { key: ${key}, value: ${value} } has failed with error: ${err}`
      );

      this.memoryCache.set(key, value);
    });
  }

  /**
   * Gets a { key: value } pair by key in the persistent cache
   *
   * @param key Key of cache entry to get
   */
  public get(key: IDBValidKey): Promise<any> {
    assert(isAllowedAsKey(key), 'PersistentCache -> The given type of key is not allowed');

    return new Promise((resolve): void => {
      get(key, this.store)
        .then(value => {
          resolve(value);
        })
        .catch(err => {
          console.warn(`PersistentCache -> Get: { key: ${key} } has failed with error: ${err}`);

          this.memoryCache.get(key);
        });
    });
  }

  /**
   * Gets all { key: value } pairs in the persistent cache
   */
  public getKeys(): Promise<any[]> {
    return new Promise((resolve): void => {
      keys(this.store)
        .then(storeKeys => {
          resolve(storeKeys);
        })
        .catch(err => {
          console.warn(`PersistentCache -> Keys: { key: ${keys} } has failed with error: ${err}`);

          this.memoryCache.keys();
        });
    });
  }

  /**
   * Delete a { key: value } pair by key in the persistent cache
   *
   * @param key Key of cache entry to delete
   */
  public delete(key: IDBValidKey): void {
    assert(isAllowedAsKey(key), 'PersistentCache -> The given type of key is not allowed');

    del(key, this.store).catch(err => {
      console.warn(`PersistentCache -> Delete: { key: ${key} } has failed with error: ${err}`);

      this.memoryCache.delete(key);
    });
  }

  /**
   * Clear the entire persistent cache from { key: value } pairs
   */
  public clear(): void {
    clear(this.store).catch(err => {
      console.warn(`PersistentCache -> Clear: Store clearing has failed with error: ${err}`);

      this.memoryCache.clear();
    });
  }
}
