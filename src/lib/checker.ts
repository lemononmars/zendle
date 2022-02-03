type display = number[] | string
import { Subject, Qty, Color, Shape, Comparison } from "./Rulebook"

// todo: disprove the guess
// find a pattern that agrees with the solution, but not with the guess, or vice versa

export function verifyPattern(input: display, rule: number[]){
   if (typeof input === "string")
      return false

   // has
   if(rule[0] == Subject.has) {
      const count = input.filter((i)=>
         (rule[2] == Color.none || i%3 == rule[2]) &&
         (rule[3] == Shape.none || Math.floor(i/3) == rule[3])
      ).length

      if(rule[1] == Qty.no) return count == 0
      else if(rule[1] == Qty.atLeastOne) return count >= 1
      else if(rule[1] == Qty.exactlyOne) return count == 1
      else return false
   }

   // the number of 
   if(rule[0] == Subject.numberOf) {
      const count1 = input.filter((i)=>
         (rule[2] == Color.none || i%3 == rule[2]) &&
         (rule[3] == Shape.none || Math.floor(i/3) == rule[3])
      ).length

      const count2 = input.filter((i)=>
         (rule[5] == Color.none || i%3 == rule[5]) &&
         (rule[6] == Shape.none || Math.floor(i/3) == rule[6])
      ).length

      if(rule[4] == Comparison.equal) return count1 == count2
      else if(rule[4] == Comparison.less) return count1 < count2
      else if(rule[4] == Comparison.more) return count1 > count2 
      else return false
   }
}