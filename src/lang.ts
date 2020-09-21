export const placeholder = "|ss";

export const Lang_en: Lang = {
   roleassign: {
      novalidyearsfound: "sorry! I couldn't find any valid years.",
      novalidrolesfound: "sorry! I couldn't find any valid roles.",
      tryagaininserversupport: `hi! can you try again in <#${placeholder}>? thank you! ^^`,
      horriblywrongauthorperson: `hello! sorry, something went horribly wrong. can you send a message to <@${placeholder}>? thank you! ^^`,

      alreadyhaveroles: `\nYou already have ${placeholder}`,
      givenroles: `\nGave you ${placeholder}`,
      somethingwrongtryagain: "sorry, something went wrong. Can you try again?",
      stuckonrole: `sorry! I got stuck on ${placeholder}`
   },
   ping: {
      responses: ["What?", "why ping?"]
   }
};

export function stickitin(phrase: string, replacers: Array<string> | string): string {
   if (typeof replacers === "string") return phrase.replace(placeholder, replacers);

   for (let i: number = 0; i < replacers.length; i++) {
      const iofphrase = phrase.indexOf(placeholder);
      if (iofphrase === -1) return phrase;
      phrase = phrase.replace(placeholder, replacers[i]);
   }
   return phrase;
}

export interface Lang {
   readonly roleassign: {
      readonly novalidyearsfound: string;
      readonly novalidrolesfound: string;
      readonly tryagaininserversupport: string;
      readonly horriblywrongauthorperson: string

      readonly alreadyhaveroles: string;
      readonly givenroles: string;
      readonly somethingwrongtryagain: string;
      readonly stuckonrole: string;
   }
   readonly ping: {
      readonly responses: Array<string>;
   }
}
