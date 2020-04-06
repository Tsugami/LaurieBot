export type Invalid<T> = Error & { __errorMessage: T };

export type AsUniqueArray<A extends ReadonlyArray<any>, B extends ReadonlyArray<any>> = {
  [I in keyof A]: unknown extends {
    [J in keyof B]: J extends I ? never : B[J] extends A[I] ? unknown : never;
  }[number]
    ? Invalid<[A[I], 'is repeated']>
    : A[I];
};

export type Narrowable = string | number | boolean | object | null | undefined | symbol;

export type UniqueArray<A, B extends A[]> = ReadonlyArray<A> & AsUniqueArray<B, B>;
