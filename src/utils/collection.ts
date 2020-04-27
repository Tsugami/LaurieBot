import QuickIru from 'quick-lru';

export default class Collection<K, V> extends QuickIru<K, V> {
  constructor(maxSize = 100) {
    super({ maxSize });
  }
}
