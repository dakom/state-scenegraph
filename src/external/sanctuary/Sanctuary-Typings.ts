export interface Maybe<A> {
    isNothing:boolean;
    isJust:boolean;
    value:A;
}

export interface Either<A> {
    isLeft:boolean;
    isRight:boolean;
    value:A;
}