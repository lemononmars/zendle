export const enum ruleIndex {
   quantity = 0,
   color,
   shape,
   position,
   comparison
}

export function verifyPattern(input: number[]){
   return input.some((i)=>i%3==0)
}