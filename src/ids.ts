export const NOT_FOUND_STRING = "not found lol";


// galacon role ids
// export const y2012 = "628136070642401280";
// export const y2013 = "628136127643123732";
// export const y2014 = "628136132701454346";
// export const y2015 = "628136394023370752";
// export const y2016 = "628136665721864202";
// export const y2017 = "628137097244442627";
// export const y2018 = "628136798299750421";
// export const y2019 = "628136797095854100";

// development role ids in my private server thing
export const y2012 = "740013333184381020";
export const y2013 = "740013318751911979";
export const y2014 = "740013297046257775";
export const y2015 = "740013284824055898";
export const y2016 = "740013272077434973";
export const y2017 = "740013259297652816";
export const y2018 = "740013246962073661";
export const y2019 = "740013228876365855";
export const yeartest: RegExp = /\b20(12|13|14|15|16|17|18|19)\b/gi;

export const yearroles: Array<YearRole> = [
   { yearnum: "2012", regex: yeartest, id: y2012 },
   { yearnum: "2013", regex: yeartest, id: y2013 },
   { yearnum: "2014", regex: yeartest, id: y2014 },
   { yearnum: "2015", regex: yeartest, id: y2015 },
   { yearnum: "2016", regex: yeartest, id: y2016 },
   { yearnum: "2017", regex: yeartest, id: y2017 },
   { yearnum: "2018", regex: yeartest, id: y2018 },
   { yearnum: "2019", regex: yeartest, id: y2019 }
];

// galacon
// export const artist = "605726501924765706";
// export const musician = "605451090430918752";
// export const cosplayer = "607227135756599326";
// export const meme = "605454893620396060";

// development
export const artist = "755287911338868768";
export const musician = "755287986991792229";
export const cosplayer = "755288011721408612";
export const meme = "755288031724044311";
export const roletest = /\brole(s)?\b/;

export const artisttest = /\bart(ist)?\b/gi;
export const musiciantest = /\bmusic(ian)?\b/gi;
export const cosplayertest = /\bcosplay(er)?\b/gi;
export const memetest = /\bmeme(s|z)?\b/gi;

export const otherroles: Array<OtherRole> = [
   { name: "artist", regex: artisttest, id: artist },
   { name: "musician", regex: musiciantest, id: musician },
   { name: "cosplayer", regex: cosplayertest, id: cosplayer },
   { name: "meme", regex: memetest, id: meme }
];

// galacon
// export const serversupportchannel = "613024393425059981";

// mine
export const serversupportchannel = "578740813912211457";

export const authorperson = "379800645571575810";

interface YearRole {
   readonly yearnum: string;
   readonly regex: RegExp;
   readonly id: string;
}
interface OtherRole {
   readonly name: string;
   readonly regex: RegExp;
   readonly id: string;
}
