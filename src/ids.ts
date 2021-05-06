import { ReactionRole } from "./reactionrole";
/** id for galacon #server-support */
export const serversupportchannel: string = "613024393425059981";

/** id for galacon mlem emoji */
export const mlememoji: string = ":Mlem:758757084299788298";

//
// export const serversupportchannel: string = "578740813912211457";

/**
 * id for the author of the bot (person to ping when something goes horribly wrong)
 *
 * see {@link Lang.roleassign.horriblywrongauthorperson} and {@link Lang_en.roleassign.horriblywrongauthorperson}
 */
export const authorperson: string = "379800645571575810";

const channelid = "823351439279259648";
const serverrolemessage = "839966718071406652";
const yearrolemessage = "839966718507221013";

/** reaction roles ids */
export const reactinoroles: ReadonlyArray<ReactionRole> = [
   {
      // artist
      channelid,
      emoji: "823502121487958016", // :Artist:
      messageid: serverrolemessage,
      roleid: "605726501924765706"
   }, {
      // musician
      channelid,
      emoji: "823503291027161128", // :DJ:
      messageid: serverrolemessage,
      roleid: "605451090430918752"
   }, {
      // cosplayer
      channelid,
      emoji: "639189237400469517", // :Innkeep:
      messageid: serverrolemessage,
      roleid: "607227135756599326"
   }, {
      // meme
      channelid,
      emoji: "745824076940968077", // :Dab:
      messageid: serverrolemessage,
      roleid: "605454893620396060"
   }, {
      // rp
      channelid,
      emoji: "667481831293190174", // :Salute:
      messageid: serverrolemessage,
      roleid: "755487852720291851"
   }, {
      // news
      channelid,
      emoji: "823482395202158633", // :Scroll
      messageid: serverrolemessage,
      roleid: "784873956363599912"
   }, {
      // movie night
      channelid,
      emoji: "606565381288493077",
      messageid: serverrolemessage,
      roleid: "839970021803556905"
   }, {
      // 2012
      channelid,
      emoji: "824789163605098516",
      messageid: yearrolemessage,
      roleid: "628136070642401280"
   }, {
      // 2013
      channelid,
      emoji: "824789178448871454",
      messageid: yearrolemessage,
      roleid: "628136127643123732"
   }, {
      // 2014
      channelid,
      emoji: "824789187956965386",
      messageid: yearrolemessage,
      roleid: "628136132701454346"
   }, {
      // 2015
      channelid,
      emoji: "824789203673808936",
      messageid: yearrolemessage,
      roleid: "628136394023370752"
   }, {
      // 2016
      channelid,
      emoji: "824789214251057182",
      messageid: yearrolemessage,
      roleid: "628136665721864202"
   }, {
      // 2017
      channelid,
      emoji: "824789229765656576",
      messageid: yearrolemessage,
      roleid: "628137097244442627"
   }, {
      // 2018
      channelid,
      emoji: "824789240737955880",
      messageid: yearrolemessage,
      roleid: "628136798299750421"
   }, {
      // 2019
      channelid,
      emoji: "824789250582380554",
      messageid: yearrolemessage,
      roleid: "628136797095854100"
   }
];
