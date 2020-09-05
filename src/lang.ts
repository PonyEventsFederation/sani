export interface Lang {
   readonly yearAssign: {
      readonly noValidYearsFound: string,
      readonly tryAgainInServerSupport: string
      readonly horriblyWrongAuthorPerson: string,

      readonly alreadyHaveYears: string,
      readonly givenYears: string,
      readonly somethingWrongTryAgain: string,
      readonly stuckOnRole: string,
   }
}
export const placeholder = "|s";

export const Lang_en: Lang = {
   yearAssign: {
      noValidYearsFound: "sorry! I couldn't find any valid years.",
      tryAgainInServerSupport: `hi! can you try again in <#${placeholder}>? thank you! ^^`,
      horriblyWrongAuthorPerson: `hello! sorry, something went horribly wrong. can you send a message to <@${placeholder}>? thank you! ^^`,

      alreadyHaveYears: `\nYou already have ${placeholder}`,
      givenYears: `\nGave you ${placeholder}`,
      somethingWrongTryAgain: "sorry, something went wrong. Can you try again?",
      stuckOnRole: `sorry! I got stuck on ${placeholder}`
   }
};

export function stickitin(phrase: string, replacers: string[] | string): string {
   if (typeof replacers === "string") return phrase.replace(placeholder, replacers);

   for (let i = 0; i < replacers.length; i++) {
      const iofphrase = phrase.indexOf(placeholder);
      console.log(iofphrase);
      if (iofphrase === -1) return phrase;
      phrase = phrase.substring(0, iofphrase) + replacers[i] + phrase.substring(iofphrase + 2);
   }
   return phrase;
}
