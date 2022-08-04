import { ReactionRole } from "./reactionrole";

/** id for galacon server */
export const galaconid: string = "602434888880095242";
/** id for galacon #server-support */
export const serversupportchannel: string = "613024393425059981";

/** id for galacon mlem emoji */
export const mlememoji: string = ":Mlem:758757084299788298";

//
// export const serversupportchannel: string = "578740813912211457";

/**
 * id for the author of the bot (user to ping when something goes horribly wrong)
 *
 * see {@link Lang.roleassign.horriblywrongauthor} and {@link Lang_en.roleassign.horriblywrongauthor}
 */
export const botauthor = "379800645571575810";

/**
 * loyalty role ID
 */
export const loyaltyrole = "865372668618735636";

const channelid = "823351439279259648";
const serverrolemessage = "839966718071406652";
const yearrolemessage = "839966718507221013";

export const artistrole: ReactionRole = {
   // artist
   channelid,
   emoji: "823502121487958016", // :Artist:
   messageid: serverrolemessage,
   roleid: "605726501924765706"
};
export const musicianrole: ReactionRole = {
   // musician
   channelid,
   emoji: "823503291027161128", // :DJ:
   messageid: serverrolemessage,
   roleid: "605451090430918752"
};
export const cosplayerrole: ReactionRole = {
   // cosplayer
   channelid,
   emoji: "639189237400469517", // :Innkeep:
   messageid: serverrolemessage,
   roleid: "607227135756599326"
};
export const memerole: ReactionRole = {
   // meme
   channelid,
   emoji: "745824076940968077", // :Dab:
   messageid: serverrolemessage,
   roleid: "605454893620396060"
};
export const rprole: ReactionRole = {
   // rp
   channelid,
   emoji: "667481831293190174", // :Salute:
   messageid: serverrolemessage,
   roleid: "755487852720291851"
};
export const nobottagsrole: ReactionRole = {
   // no bot tags
   channelid,
   emoji: "605462086788710575", // :gc_stop:
   messageid: serverrolemessage,
   roleid: "962689871305121813"
};
export const movienightrole: ReactionRole = {
   // movie night
   channelid,
   emoji: "606565381288493077", // :gc_bizaam:
   messageid: serverrolemessage,
   roleid: "839970021803556905"
};
export const newsrole: ReactionRole = {
   // news
   channelid,
   emoji: "823482395202158633", // :Scroll
   messageid: serverrolemessage,
   roleid: "784873956363599912"
};
export const year2012: ReactionRole = {
   // 2012
   channelid,
   emoji: "824789163605098516",
   messageid: yearrolemessage,
   roleid: "628136070642401280"
};
export const year2013: ReactionRole = {
   // 2013
   channelid,
   emoji: "824789178448871454",
   messageid: yearrolemessage,
   roleid: "628136127643123732"
};
export const year2014: ReactionRole = {
   // 2014
   channelid,
   emoji: "824789187956965386",
   messageid: yearrolemessage,
   roleid: "628136132701454346"
};
export const year2015: ReactionRole = {
   // 2015
   channelid,
   emoji: "824789203673808936",
   messageid: yearrolemessage,
   roleid: "628136394023370752"
};
export const year2016: ReactionRole = {
   // 2016
   channelid,
   emoji: "824789214251057182",
   messageid: yearrolemessage,
   roleid: "628136665721864202"
};
export const year2017: ReactionRole = {
   // 2017
   channelid,
   emoji: "824789229765656576",
   messageid: yearrolemessage,
   roleid: "628137097244442627"
};
export const year2018: ReactionRole = {
   // 2018
   channelid,
   emoji: "824789240737955880",
   messageid: yearrolemessage,
   roleid: "628136798299750421"
};
export const year2019: ReactionRole = {
   // 2019
   channelid,
   emoji: "824789250582380554",
   messageid: yearrolemessage,
   roleid: "628136797095854100"
};
export const year2022: ReactionRole = {
   // 2022
   channelid,
   emoji: "1004612959080816640",
   messageid: yearrolemessage,
   roleid: "1001441291281891359"
};

export const reactionroles: ReadonlyArray<ReactionRole> = [
   artistrole,
   musicianrole,
   cosplayerrole,
   memerole,
   rprole,
   nobottagsrole,
   movienightrole,
   newsrole,
   year2012,
   year2013,
   year2014,
   year2015,
   year2016,
   year2017,
   year2018,
   year2019,
   year2022
];
