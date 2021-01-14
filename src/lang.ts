/**
 * weird placeholder thing used for inserting arguments into lang strings. exported because no idea.
 * There is no use of placeholder outside of this lang module.
 * And there is no guarantee that this is staying as "|ss" (or whatever it currently is).
 * It could change at anytime to "*@!^#(*&(^$&&hhhhhhhhhhhhhhhhhhhh" (for example).
 * If you use this anywhere else, use template strings or string concatenation.
 *
 * see {@link Lang} and {@link Lang_en}
 */
export const placeholder: string = "|ss";

/**
 * the english implementation of {@link Lang}
 *
 * see {@link Lang}
 */
export const langen: Lang = {
   roleassign: {
      novalidyearsfound: "\nI'm sorry, but I didn't find any years that I could assign to you.",
      novalidrolesfound: "\nI'm sorry, but I didn't find any roles that I could assign to you.",
      tryagaininserversupport: `Hello <@${placeholder}>! Could you please try asking me again in the <#${placeholder}> channel?\nWe don't want Berry getting angry at us. <${placeholder}>`,
      horriblywrongauthorperson: `I'm so sorry! It looks like something has gone terribly wrong!\nCould you please send a message to <@${placeholder}> so they can fix me?`,

      alreadyhaveroles: `\n\nIt looks like you already have the ${placeholder} role assigned to you.`,
      alreadyhaverolesmultiple: `\n\nIt looks like you already have the ${placeholder}, and ${placeholder} roles assigned to you.`,
      givenroles: `\n\nSure! I've assigned the ${placeholder} role to you.`,
      givenrolesmultiple: `\n\nSure! I've assigned the ${placeholder}, and ${placeholder} roles to you.`,
      somethingwrongtryagain: "I'm sorry, but I don't know what happened. Could you please try again?",
      stuckonrole: `I'm sorry! I got stuck on ${placeholder}`,
      memewarning: "\nYou've been assigned the meme role.\nPlease keep in mind that this channel is more free than the rest of the server, so viewing discretion is advised.",
      hi: `Hi <@${placeholder}>!`
   },
   ping: {
      responses: ["What is it?", "Yes?", "Hi!", "Hello!"]
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

   for (const replacer of replacers) {
      const iofphrase: number = phrase.indexOf(placeholder);
      if (iofphrase === -1) return phrase;
      phrase = phrase.replace(placeholder, replacer);
   }
   return phrase;
}

/**
 * interface for specifying languages in Sani
 * A language is a massive object that contains all the string data for things like
 * responses to commands, error messages, etc etc
 */
export type Lang = {
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
      /** phrase for when someone already has multiple roles */
      readonly alreadyhaverolesmultiple: string;
      /** phrase for when someone has been successfully given a requested role */
      readonly givenroles: string;
      /** phrase for when someone has been successfully given requested roles */
      readonly givenrolesmultiple: string;
      /** phrase for when something expected goes wrong */
      readonly somethingwrongtryagain: string;
      /** phrase for when the bot errors on a role. (not used anymore, needs to be removed) */
      readonly stuckonrole: string;
      /** warning for people who request the meme role */
      readonly memewarning: string;
      /** Sani says Hi */
      readonly hi: string;
   };

   /** phrases for the ping response command thing */
   readonly ping: {
      /**
       * array of responses to a ping that doesn't have another purpose.
       * response is chosen at random from the array
       */
      readonly responses: Array<string>;
   };
};
