export const ruleStrings = [
   ["The string has", "The number of "],
   ["no", "at least one", "exactly one"],
   ["red", "yellow", "blue"],
   ["circle", "square"],
   ["adjacent to", "is equal to", "is less than", "is more than"],
   ["blue", "red", "yellow"],
   ["circle", "square"],
]

export interface ruleStructure {
   subject: Subject,
   qty: Qty,
   color1: Color,
   shape1: Shape,
   comparison: Comparison,
   color2: Color,
   shape2: Shape
}

export enum Subject {
   has = 0,
   numberOf
}

export enum Qty {
   none = -1,
   no,
   atLeastOne,
   exactlyOne
}

export enum Color {
   none = -1,
   red,
   yellow,
   blue
}

export enum Shape{
   none = -1,
   circle,
   square
}

export enum Comparison {
   none = -1,
   adjacent,
   equal,
   more,
   less
}

const presetRules = [
   [Subject.has, Qty.atLeastOne, Color.blue, Shape.none, Comparison.none, Color.none, Shape.none],
   [Subject.has, Qty.no, Color.none, Shape.square, Comparison.none, Color.none, Shape.none],
   [Subject.numberOf, Qty.none, Color.red, Shape.none,Comparison.equal,Color.none,Shape.circle]
]

export function compareRules(r1: number[], r2: number[]){
   return r1.some((r,idx)=> r != r2[idx])
}
export function getTodaysRule(d: number) {
   // to be programmatically generated later
   return presetRules[(d+1) % presetRules.length]
}