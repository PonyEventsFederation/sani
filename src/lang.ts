/**
 * weird placeholder thing used for inserting arguments into lang strings. exported because no idea.
 * There is no use of placeholder outside of this lang module.
 * And there is no guarantee that this is staying as "|ss" (or whatever it currently is).
 * It could change at anytime to "*@!^#(*&(^$&&hhhhhhhhhhhhhhhhhhhh" (for example).
 * If you use this anywhere else, use template strings or string concatenation.
 *
 * see {@link Lang} and {@link Lang_en}
 */
export const placeholder = "|ss";

/**
 * the english implementation of {@link Lang}
 *
 * see {@link Lang}
 */
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
      responses: ["What?", "why ping?", "hi!"]
   }
};

/**
 * This method takes a phrase to insert arguments into and either a string to
 * insert, or an array of arguments to insert into the phrase.
 *
 * Example:
 * ```typescript
 * const phrase: string = `Hello mister ${placeholder}`;
 * // or this (but this is bad cause placeholder can change at any time)
 * // const phrase: string = "Hello mister |ss";
 * const name: string = "Alexander";   // my name is on github already, whatever
 *
 * stickitin(phrase, name) // result: "Hello mister Alexander"
 * ```
 * See {@link placeholder}
 *
 * @param phrase phrase to insert artuments into
 * @param replacers arguments to insert into the phrase
 */
export function stickitin(phrase: string, replacers: Array<string> | string): string {
   if (typeof replacers === "string") return phrase.replace(placeholder, replacers);

   for (let i: number = 0; i < replacers.length; i++) {
      const iofphrase = phrase.indexOf(placeholder);
      if (iofphrase === -1) return phrase;
      phrase = phrase.replace(placeholder, replacers[i]);
   }
   return phrase;
}

/**
 * interface for specifying languages in Sani
 * A language is a massive object that contains all the string data for things like
 * responses to commands, error messages, etc etc
 */
export interface Lang {
   /** specifys strings related to assigning roles */
   readonly roleassign: {
      /**
       * phrase for when no valid year roles are found in specified discord message.
       * (don't think this is used anymore)
       */
      readonly novalidyearsfound: string;
      /** phrase for when no valid role names are found in specified discord message. */
      readonly novalidrolesfound: string;
      /** phrase for when someone tries to run a role assigning command outside of a server support channel */
      readonly tryagaininserversupport: string;
      /**
       * phrase for when something horribly wrong happens, and its the strangest thing
       * that has not ever been seen, and this should not ever happen and something went __horribly__ wrong.
       * the author person part is so that the bot can tag the owner of the bot
       * (specified by {@link authorperson}) when such events happen
       */
      readonly horriblywrongauthorperson: string;

      /** phrase for when someone already has a requested role */
      readonly alreadyhaveroles: string;
      /** phrase for when someone has been successfully given a requested role */
      readonly givenroles: string;
      /** phrase for when something expected goes wrong */
      readonly somethingwrongtryagain: string;
      /** phrase for when the bot errors on a role. (not used anymore, needs to be removed) */
      readonly stuckonrole: string;
   }

   /** phrases for the ping response command thing */
   readonly ping: {
      /**
       * array of responses to a ping that doesn't have another purpose.
       * response is chosen at random from the array
       */
      readonly responses: Array<string>;
   }
}
