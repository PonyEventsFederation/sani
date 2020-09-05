export function getroleid(year: string): string {
   // why y cause you cant have numeric constant name so yeaaaaaaaa
   if (year === "2012") return y2012;
   if (year === "2013") return y2013;
   if (year === "2014") return y2014;
   if (year === "2015") return y2015;
   if (year === "2016") return y2016;
   if (year === "2017") return y2017;
   if (year === "2018") return y2018;
   if (year === "2019") return y2019;
   return NOT_FOUND_STRING;
}

export const serversupportchannel: string = "613024393425059981";
export const authorperson: string = "379800645571575810";

// galacon role ids
export const y2012 = "628136070642401280";
export const y2013 = "628136127643123732";
export const y2014 = "628136132701454346";
export const y2015 = "628136394023370752";
export const y2016 = "628136665721864202";
export const y2017 = "628137097244442627";
export const y2018 = "628136798299750421";
export const y2019 = "628136797095854100";


// development role ids in my private server thing
// export const y2012 = "740013333184381020";
// export const y2013 = "740013318751911979";
// export const y2014 = "740013297046257775";
// export const y2015 = "740013284824055898";
// export const y2016 = "740013272077434973";
// export const y2017 = "740013259297652816";
// export const y2018 = "740013246962073661";
// export const y2019 = "740013228876365855";

export const NOT_FOUND_STRING = "NOT FOUND LOL";
export const TESTBEGYEARS: RegExp = /^20(12|13|14|15|16|17|18|19)[^0-9]/;
export const TESTFORYEARS: RegExp = /[^0-9]20(12|13|14|15|16|17|18|19)[^0-9]/g;
export const TESTENDYEARS: RegExp = /[^0-9]20(12|13|14|15|16|17|18|19)$/g;
