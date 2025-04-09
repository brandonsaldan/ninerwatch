"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase, Incident, validateSupabaseConnection } from "@/lib/supabase";

const LOCATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Admissions: { lat: 35.30111323057074, lng: -80.73299333932053 },
  "Admissions Building": { lat: 35.30111323057074, lng: -80.73299333932053 },
  Alumni: { lat: 35.30276842372914, lng: -80.73873474549336 },
  "Alumni Center": { lat: 35.30281037400156, lng: -80.73872110339664 },
  "Alumni Way/Broadrick": { lat: 35.30265567427994, lng: -80.73205648768239 },
  "Alumni Way/Broadrick Blvd.": {
    lat: 35.30265567427994,
    lng: -80.73205648768239,
  },
  Annex: { lat: 35.305690534580606, lng: -80.73169691688499 },
  Atkins: { lat: 35.305733192943606, lng: -80.73191008154319 },
  "Atkins Library": { lat: 35.305733192943606, lng: -80.73191008154319 },
  "Barnes and Noble": { lat: 35.30852348216909, lng: -80.73417098836394 },
  "Barnes & Noble": { lat: 35.30852348216909, lng: -80.73417098836394 },
  Barnard: { lat: 35.30587000495334, lng: -80.73002949124496 },
  Barnhardt: { lat: 35.30638812746262, lng: -80.73438037291629 },
  "Barnhardt Lane": { lat: 35.30629307649671, lng: -80.73623338389348 },
  BATT: { lat: 35.31259210393988, lng: -80.74031679338913 },
  "BATT Cave": { lat: 35.31259210393988, lng: -80.74031679338913 },
  BCOB: { lat: 35.306375560470336, lng: -80.72997959351832 },
  Belk: { lat: 35.30635901681658, lng: -80.72995739603715 },
  "Belk Gym": { lat: 35.30546787659006, lng: -80.73556751318979 },
  "Belk Hall": { lat: 35.31047406540071, lng: -80.73473993175023 },
  "Belk Plaza": { lat: 35.305173906672415, lng: -80.73097988603742 },
  Bioinformatics: { lat: 35.312840493458374, lng: -80.74197285343608 },
  "Bissell House": { lat: 35.30112076969896, lng: -80.73903288995628 },
  "Boulevard 98": { lat: 35.30909501324001, lng: -80.72055065343277 },
  Burson: { lat: 35.307523512913264, lng: -80.73245227190182 },
  "Burson Hall": { lat: 35.307523512913264, lng: -80.73245227190182 },
  CAB: { lat: 35.309098299942654, lng: -80.72824348620226 },
  CATO: { lat: 35.305466066991265, lng: -80.72873598593509 },
  CHHS: { lat: 35.307554133985306, lng: -80.73333936358785 },
  COE: { lat: 35.307605505569846, lng: -80.73417117379482 },
  "College of Education": { lat: 35.307605505569846, lng: -80.73417117379482 },
  "Counseling Center": { lat: 35.310235875002306, lng: -80.73006057424566 },
  "Counselling Center": { lat: 35.310235875002306, lng: -80.73006057424566 },
  "Craver Rd": { lat: 35.30808567880388, lng: -80.73371735016732 },
  "Craver Rd.": { lat: 35.30808567880388, lng: -80.73371735016732 },
  "Craver Road": { lat: 35.30808567880388, lng: -80.73371735016732 },
  CRI: { lat: 35.30923281386327, lng: -80.74345534383328 },
  "CRI Deck": { lat: 35.30922916950404, lng: -80.74343764134831 },
  "Cafeteria Activities Building": {
    lat: 35.309098299942654,
    lng: -80.72824348620226,
  },
  Cameron: { lat: 35.307730357392565, lng: -80.73123355479966 },
  "Cameron Blvd": { lat: 35.306558977125015, lng: -80.73672875703002 },
  "Cameron Center": { lat: 35.307730357392565, lng: -80.73123355479966 },
  Cato: { lat: 35.30549351102161, lng: -80.7287292913576 },
  "Cato Hall": { lat: 35.30549351102161, lng: -80.7287292913576 },
  Cedar: { lat: 35.30962602965161, lng: -80.72893561094548 },
  "Cedar Hall": { lat: 35.30962602965161, lng: -80.72893561094548 },
  "Chancellor's Residence": { lat: 35.30112076969896, lng: -80.73903288995628 },
  Colvard: { lat: 35.30450888861625, lng: -80.7317397125908 },
  Cone: { lat: 35.30515583467655, lng: -80.73324276879883 },
  "Cone Center": { lat: 35.3051636715818, lng: -80.73324279475698 },
  "Cone Deck": { lat: 35.304749132848784, lng: -80.73434914193838 },
  Denny: { lat: 35.305427985598584, lng: -80.72981362683163 },
  "Denny Building": { lat: 35.305427985598584, lng: -80.72981362683163 },
  "Denny Hall": { lat: 35.305427985598584, lng: -80.72981362683163 },
  "Duke Hall": { lat: 35.31197015949181, lng: -80.74120570366482 },
  EPIC: { lat: 35.309184110651444, lng: -80.74155091022566 },
  "Early College": { lat: 35.30893017430985, lng: -80.74405416850408 },
  East: { lat: 35.305437547453295, lng: -80.72681108856622 },
  "East Deck 1": { lat: 35.30480453880019, lng: -80.72748938906241 },
  "East Deck 2": { lat: 35.30544065585483, lng: -80.72681104336117 },
  "East Deck 3": { lat: 35.30603347157714, lng: -80.72610357894776 },
  Elm: { lat: 35.30878116400884, lng: -80.73110627408393 },
  "Elm Hall": { lat: 35.30878116400884, lng: -80.73110627408393 },
  FOPS: { lat: 35.31422917860178, lng: -80.73278855285041 },
  Foundation: { lat: 35.29791415397593, lng: -80.73689994313516 },
  "Foundation Annex": { lat: 35.29791415397593, lng: -80.73689994313516 },
  "Foundation Annex Building": {
    lat: 35.29791415397593,
    lng: -80.73689994313516,
  },
  Fretwell: { lat: 35.306198413356896, lng: -80.72896811055179 },
  Friday: { lat: 35.306375560470336, lng: -80.72997959351832 },
  "Friday Building": { lat: 35.306375560470336, lng: -80.72997959351832 },
  Gage: { lat: 35.30111323057074, lng: -80.73299333932053 },
  "Gage Admissions": { lat: 35.30111323057074, lng: -80.73299333932053 },
  "GAGE Admissions": { lat: 35.30111323057074, lng: -80.73299333932053 },
  "Gage Admissions Center": { lat: 35.30111323057074, lng: -80.73299333932053 },
  Garden: { lat: 35.308497042916805, lng: -80.728718032892 },
  Garinger: { lat: 35.30502656528598, lng: -80.73002808243331 },
  "Garinger Building": { lat: 35.30502656528598, lng: -80.73002808243331 },
  "Garinger Hall": { lat: 35.30502656528598, lng: -80.73002808243331 },
  Greek: { lat: 35.31239269859116, lng: -80.72578153851921 },
  "Greek House 1": { lat: 35.31238138178446, lng: -80.72712005526596 },
  "Greek House 10": { lat: 35.31302003233138, lng: -80.72567731193953 },
  "Greek House 2": { lat: 35.31220313530548, lng: -80.72686829889788 },
  "Greek House 3": { lat: 35.312236774295634, lng: -80.72642939943444 },
  "Greek House 4": { lat: 35.31240796288427, lng: -80.72590387361107 },
  "Greek House 5": { lat: 35.31264658879726, lng: -80.72554999130259 },
  "Greek House 6": { lat: 35.31289731817045, lng: -80.72522789481997 },
  "Greek House 7": { lat: 35.313353770620935, lng: -80.72494237066243 },
  "Greek House 8": { lat: 35.313671123729385, lng: -80.72509664631278 },
  "Greek House 9": { lat: 35.31344886306849, lng: -80.72538423018685 },
  "Greek House 11": { lat: 35.31276490087204, lng: -80.72600641354036 },
  "Greek House 12": { lat: 35.31255817247919, lng: -80.72639832157877 },
  "Greek House 13": { lat: 35.31255017744686, lng: -80.72681822305016 },
  "Greek Village": { lat: 35.31239269859116, lng: -80.72578153851921 },
  "Greek Village 1": { lat: 35.31238138178446, lng: -80.72712005526596 },
  "Greek Village 10": { lat: 35.31302003233138, lng: -80.72567731193953 },
  "Greek Village 2": { lat: 35.31220313530548, lng: -80.72686829889788 },
  "Greek Village 3": { lat: 35.312236774295634, lng: -80.72642939943444 },
  "Greek Village 4": { lat: 35.31240796288427, lng: -80.72590387361107 },
  "Greek Village 5": { lat: 35.31264658879726, lng: -80.72554999130259 },
  "Greek Village 6": { lat: 35.31289731817045, lng: -80.72522789481997 },
  "Greek Village 7": { lat: 35.313353770620935, lng: -80.72494237066243 },
  "Greek Village 8": { lat: 35.313671123729385, lng: -80.72509664631278 },
  "Greek Village 9": { lat: 35.31344886306849, lng: -80.72538423018685 },
  "Greek Village 11": { lat: 35.31276490087204, lng: -80.72600641354036 },
  "Greek Village 12": { lat: 35.31255817247919, lng: -80.72639832157877 },
  "Greek Village 13": { lat: 35.31255017744686, lng: -80.72681822305016 },
  "Grigg Hall": { lat: 35.31131792912825, lng: -80.74188240561898 },
  "Halton-Wagner": { lat: 35.30738168923848, lng: -80.73738195486152 },
  Harris: { lat: 35.30281037400156, lng: -80.73872110339664 },
  "Harris Alumni Center": { lat: 35.30281037400156, lng: -80.73872110339664 },
  "Harris Alumni Pavilion": { lat: 35.30281037400156, lng: -80.73872110339664 },
  "Harris Center": { lat: 35.30281037400156, lng: -80.73872110339664 },
  "Harris Pavilion": { lat: 35.30281037400156, lng: -80.73872110339664 },
  "Harwood Garden": { lat: 35.308497042916805, lng: -80.728718032892 },
  Hawthorn: { lat: 35.31155799537089, lng: -80.7274596770149 },
  "Hawthorn Hall": { lat: 35.31155799537089, lng: -80.7274596770149 },
  Hickory: { lat: 35.309225275826364, lng: -80.72899299312088 },
  "Hickory Hall": { lat: 35.309225275826364, lng: -80.72899299312088 },
  Holshouser: { lat: 35.30213753161986, lng: -80.7360752926913 },
  "Holshouser Hall": { lat: 35.30213753161986, lng: -80.7360752926913 },
  Hunt: { lat: 35.3014602722455, lng: -80.73644891943515 },
  "Hunt Hall": { lat: 35.3014602722455, lng: -80.73644891943515 },
  "Institute Circle/Robert D. Snyder": {
    lat: 35.31194747534912,
    lng: -80.74215735646662,
  },
  "Investigations (PPS)": { lat: 35.312073, lng: -80.730443 },
  Irwin: { lat: 35.305507192658936, lng: -80.73810898581563 },
  "Irwin Belk Track": { lat: 35.305507192658936, lng: -80.73810898581563 },
  "Irwin Belk Track and Field Center": {
    lat: 35.305507192658936,
    lng: -80.73810898581563,
  },
  "Jerry Richardson": {
    lat: 35.31054494321856,
    lng: -80.74010401783029,
  },
  "Jerry Richardson Stadium": {
    lat: 35.31054494321856,
    lng: -80.74010401783029,
  },
  Kennedy: { lat: 35.30600031437926, lng: -80.73094518911772 },
  "Kennedy Building": { lat: 35.30600031437926, lng: -80.73094518911772 },
  "Kennedy Hall": { lat: 35.30600031437926, lng: -80.73094518911772 },
  King: { lat: 35.30511359509126, lng: -80.73253861857071 },
  "King Hall": { lat: 35.30511359509126, lng: -80.73253861857071 },
  Klein: { lat: 35.30851294005984, lng: -80.73018481393747 },
  "Klein Hall": { lat: 35.30851294005984, lng: -80.73018481393747 },
  Kulwicki: { lat: 35.31232377029804, lng: -80.74071433367943 },
  Landingham: { lat: 35.30667940749726, lng: -80.72799851609348 },
  "Landingham Glen": { lat: 35.30667940749726, lng: -80.72799851609348 },
  Laurel: { lat: 35.30276133091521, lng: -80.73656945127522 },
  "Laurel Hall": { lat: 35.30276133091521, lng: -80.73656945127522 },
  Levine: { lat: 35.30272860100916, lng: -80.73306290708054 },
  "Levine Hall": { lat: 35.30272860100916, lng: -80.73306290708054 },
  Library: { lat: 35.305733192943606, lng: -80.73191008154319 },
  "Light Rail": { lat: 35.312271, lng: -80.733932 },
  "Lot 101": { lat: 35.29754272038614, lng: -80.73655862435236 },
  "Lot 102": { lat: 35.314373204807936, lng: -80.72414700218215 },
  "Lot 11": { lat: 35.31039726866363, lng: -80.73070933223568 },
  "Lot 11-A": { lat: 35.31099157488953, lng: -80.73014204113687 },
  "Lot 11A": { lat: 35.31099157488953, lng: -80.73014204113687 },
  "Lot 12": { lat: 35.31143672335098, lng: -80.72880617146247 },
  "Lot 13": { lat: 35.31104913882629, lng: -80.72754572940948 },
  "Lot 14": { lat: 35.30682638094151, lng: -80.73786021816171 },
  "Lot 15": { lat: 35.30792491325862, lng: -80.73239535329594 },
  "Lot 16": { lat: 35.30775753460412, lng: -80.73014482348113 },
  "Lot 16-A": { lat: 35.3077529536635, lng: -80.73014521755536 },
  "Lot 16A": { lat: 35.3077484142592, lng: -80.7301474680402 },
  "Lot 20": { lat: 35.310280919371145, lng: -80.73269809941411 },
  "Lot 21": { lat: 35.31126803312476, lng: -80.7310559001806 },
  "Lot 23": { lat: 35.31059397821839, lng: -80.74150320037988 },
  "Lot 23-A": { lat: 35.3116840586043, lng: -80.74040820182631 },
  "Lot 23A": { lat: 35.3116840586043, lng: -80.74040820182631 },
  "Lot 25": { lat: 35.313003277048054, lng: -80.73270544263463 },
  "Lot 26": { lat: 35.31257766145016, lng: -80.73096106941685 },
  "Lot 27": { lat: 35.30182360093606, lng: -80.74034922262658 },
  "Lot 28": { lat: 35.303148606516814, lng: -80.7291214489276 },
  "Lot 29": { lat: 35.31085801450816, lng: -80.73810089371817 },
  "Lot 29-A": { lat: 35.31094791348675, lng: -80.73891019541873 },
  "Lot 29A": { lat: 35.31094791348675, lng: -80.73891019541873 },
  "Lot 30": { lat: 35.304469332221004, lng: -80.73309232695249 },
  "Lot 4": { lat: 35.30666455807998, lng: -80.7259864040329 },
  "Lot 4-A": { lat: 35.306911642799456, lng: -80.72513958610483 },
  "Lot 4A": { lat: 35.306911642799456, lng: -80.72513958610483 },
  "Lot 5": { lat: 35.307518384320645, lng: -80.72715791288293 },
  "Lot 5-A": { lat: 35.307601881591104, lng: -80.72555616959139 },
  "Lot 5A": { lat: 35.307601881591104, lng: -80.72555616959139 },
  "Lot 6": { lat: 35.30942413585608, lng: -80.72568656644484 },
  "Lot 6-A": { lat: 35.30890547279586, lng: -80.7246464970278 },
  "Lot 6A": { lat: 35.30890547279586, lng: -80.7246464970278 },
  "Lot 7-A": { lat: 35.303989628561055, lng: -80.73646749171373 },
  "Lot 8": { lat: 35.30020432057936, lng: -80.73633977902806 },
  "Lot 8-A": { lat: 35.301457263481, lng: -80.73400265315526 },
  "Lot 8A": { lat: 35.301457263481, lng: -80.73400265315526 },
  Lynch: { lat: 35.31028185878501, lng: -80.73372955747121 },
  "Lynch Hall": { lat: 35.31028185878501, lng: -80.73372955747121 },
  Macy: { lat: 35.3057036625232, lng: -80.73041217346655 },
  "Macy Building": { lat: 35.3057036625232, lng: -80.73041217346655 },
  "Macy Hall": { lat: 35.3057036625232, lng: -80.73041217346655 },
  Maple: { lat: 35.309064255419386, lng: -80.73129429277893 },
  "Maple Hall": { lat: 35.309064255419386, lng: -80.73129429277893 },
  Marriott: { lat: 35.3102290364054, lng: -80.7447686755496 },
  Martin: { lat: 35.31002608542147, lng: -80.72757204765246 },
  "Martin Hall": { lat: 35.31002608542147, lng: -80.72757204765246 },
  "Mary Alexander": { lat: 35.308122636361915, lng: -80.72934252700448 },
  "Mary Alexander Rd": { lat: 35.308122636361915, lng: -80.72934252700448 },
  "McCall 1": { lat: 35.31238138178446, lng: -80.72712005526596 },
  "McCall 10": { lat: 35.31302003233138, lng: -80.72567731193953 },
  "McCall 2": { lat: 35.31220313530548, lng: -80.72686829889788 },
  "McCall 3": { lat: 35.312236774295634, lng: -80.72642939943444 },
  "McCall 4": { lat: 35.31240796288427, lng: -80.72590387361107 },
  "McCall 5": { lat: 35.31264658879726, lng: -80.72554999130259 },
  "McCall 6": { lat: 35.31289731817045, lng: -80.72522789481997 },
  "McCall 7": { lat: 35.313353770620935, lng: -80.72494237066243 },
  "McCall 8": { lat: 35.313671123729385, lng: -80.72509664631278 },
  "McCall 9": { lat: 35.31344886306849, lng: -80.72538423018685 },
  "McCall 11": { lat: 35.31276490087204, lng: -80.72600641354036 },
  "McCall 12": { lat: 35.31255817247919, lng: -80.72639832157877 },
  "McCall 13": { lat: 35.31255017744686, lng: -80.72681822305016 },
  "McCall House 1": { lat: 35.31238138178446, lng: -80.72712005526596 },
  "McCall House 10": { lat: 35.31302003233138, lng: -80.72567731193953 },
  "McCall House 2": { lat: 35.31220313530548, lng: -80.72686829889788 },
  "McCall House 3": { lat: 35.312236774295634, lng: -80.72642939943444 },
  "McCall House 4": { lat: 35.31240796288427, lng: -80.72590387361107 },
  "McCall House 5": { lat: 35.31264658879726, lng: -80.72554999130259 },
  "McCall House 6": { lat: 35.31289731817045, lng: -80.72522789481997 },
  "McCall House 7": { lat: 35.313353770620935, lng: -80.72494237066243 },
  "McCall House 8": { lat: 35.313671123729385, lng: -80.72509664631278 },
  "McCall House 9": { lat: 35.31344886306849, lng: -80.72538423018685 },
  "McCall House 11": { lat: 35.31276490087204, lng: -80.72600641354036 },
  "McCall House 12": { lat: 35.31255817247919, lng: -80.72639832157877 },
  "McCall House 13": { lat: 35.31255017744686, lng: -80.72681822305016 },
  McEniry: { lat: 35.3070911050101, lng: -80.73002298692892 },
  McKnight: { lat: 35.30503348462083, lng: -80.73333572672267 },
  "McKnight Hall": { lat: 35.30503348462083, lng: -80.73333572672267 },
  McMillan: { lat: 35.307851358547964, lng: -80.72970086144977 },
  "McMillan Greenhouse": { lat: 35.307851358547964, lng: -80.72970086144977 },
  Memorial: { lat: 35.30382515486322, lng: -80.735849508953 },
  "Memorial Hall": { lat: 35.30382515486322, lng: -80.735849508953 },
  Miltimore: { lat: 35.31148972816667, lng: -80.7355167891963 },
  "Miltimore Hall": { lat: 35.31148972816667, lng: -80.7355167891963 },
  Motorsports: { lat: 35.31232377029804, lng: -80.74071433367943 },
  "North Deck": { lat: 35.31301726227786, lng: -80.73129360068769 },
  Oak: { lat: 35.30912311745998, lng: -80.73223600721032 },
  "Oak Hall": { lat: 35.30912311745998, lng: -80.73223600721032 },
  "Off Campus": { lat: 35.30150209166273, lng: -80.7313306756337 },
  PPS: { lat: 35.312073, lng: -80.730443 },
  PORTAL: { lat: 35.3116833740611, lng: -80.74299943842078 },
  Pavilion: { lat: 35.30281037400156, lng: -80.73872110339664 },
  Pine: { lat: 35.30935844112632, lng: -80.7310961835919 },
  "Pine Hall": { lat: 35.30935844112632, lng: -80.7310961835919 },
  "Police and Public Safety": { lat: 35.312073, lng: -80.730443 },
  Prospector: { lat: 35.30683528127859, lng: -80.7309218166091 },
  "Prospector Building ": { lat: 35.30683528127859, lng: -80.7309218166091 },
  Reese: { lat: 35.30469294870569, lng: -80.7325012910597 },
  "Richardson Stadium": {
    lat: 35.31054494321856,
    lng: -80.74010401783029,
  },
  Robinson: { lat: 35.30386486692623, lng: -80.72993239136733 },
  "Robinson Hall": { lat: 35.30386486692623, lng: -80.72993239136733 },
  Rowe: { lat: 35.30466694963474, lng: -80.7307608143192 },
  "Rowe Arts": { lat: 35.30448991745258, lng: -80.73073891693303 },
  SAC: { lat: 35.30638812746262, lng: -80.73438037291629 },
  Sanford: { lat: 35.30302555985922, lng: -80.73352501718196 },
  "Sanford Hall": { lat: 35.30302555985922, lng: -80.73352501718196 },
  "Science Building": { lat: 35.30851294005984, lng: -80.73018481393747 },
  Scott: { lat: 35.30174954584869, lng: -80.73538506464213 },
  "Scott Hall": { lat: 35.30174954584869, lng: -80.73538506464213 },
  Smith: { lat: 35.30694960986669, lng: -80.73156517106565 },
  "Smith Building": { lat: 35.30694960986669, lng: -80.73156517106565 },
  "South Deck": { lat: 35.30068782330028, lng: -80.73616031782448 },
  "South Village Deck": { lat: 35.30068782330028, lng: -80.73616031782448 },
  SOVI: { lat: 35.30291844251696, lng: -80.73486179559463 },
  Stadium: {
    lat: 35.31054494321856,
    lng: -80.74010401783029,
  },
  Storrs: { lat: 35.30465074989727, lng: -80.72897746927394 },
  "Student Activity Center": {
    lat: 35.30638812746262,
    lng: -80.73438037291629,
  },
  "Student Health": { lat: 35.310608027022, lng: -80.72961644427237 },
  "Student Health Center": { lat: 35.310608027022, lng: -80.72961644427237 },
  "Student Union": { lat: 35.308651, lng: -80.733818 },
  "Student Union Building": {
    lat: 35.308715615922885,
    lng: -80.73376724157418,
  },
  "Susie Harwood Garden": { lat: 35.308497042916805, lng: -80.728718032892 },
  Sycamore: { lat: 35.30886506841222, lng: -80.72901495570946 },
  "Sycamore Hall": { lat: 35.30886506841222, lng: -80.72901495570946 },
  "Tennis Complex": { lat: 35.30738168923848, lng: -80.73738195486152 },
  "Tennis Courts": { lat: 35.30738168923848, lng: -80.73738195486152 },
  "Title IX": { lat: 35.305466066991265, lng: -80.72873598593509 },
  UREC: { lat: 35.30821410701689, lng: -80.73510410052084 },
  "Union Deck": { lat: 35.309193, lng: -80.735209 },
  "University Recreation Center": {
    lat: 35.30821410701689,
    lng: -80.73510410052084,
  },
  "Van Landingham": { lat: 35.30667940749726, lng: -80.72799851609348 },
  "Van Landingham Glen": { lat: 35.30667940749726, lng: -80.72799851609348 },
  Wallis: { lat: 35.3115037345374, lng: -80.73378354202511 },
  "Wallis Hall": { lat: 35.3115037345374, lng: -80.73378354202511 },
  "Wells Fargo": { lat: 35.3069478089329, lng: -80.74036361643392 },
  "Wells Fargo Field": { lat: 35.3069478089329, lng: -80.74036361643392 },
  "Wells Fargo Fieldhouse": {
    lat: 35.306941530956465,
    lng: -80.74036806691309,
  },
  "Wells Fargo Field House": {
    lat: 35.306941530956465,
    lng: -80.74036806691309,
  },
  "West Deck": { lat: 35.30552751362334, lng: -80.73665977766677 },
  Wilson: { lat: 35.30284667088313, lng: -80.73423262299436 },
  "Wilson Hall": { lat: 35.30284667088313, lng: -80.73423262299436 },
  Winningham: { lat: 35.30516183198022, lng: -80.73039960024325 },
  "Winningham Building": { lat: 35.30516183198022, lng: -80.73039960024325 },
  "Winningham Hall": { lat: 35.30516183198022, lng: -80.73039960024325 },
  Witherspoon: { lat: 35.31086527159319, lng: -80.73227311582812 },
  "Witherspoon Hall": { lat: 35.31086068701267, lng: -80.73226513188185 },
  Woodward: { lat: 35.30752604403662, lng: -80.73538140374912 },
  "Woodward Hall": { lat: 35.30756068679362, lng: -80.7353930074827 },
};

const DEFAULT_LOCATION = { lat: 35.30633448460147, lng: -80.73340059330613 };

function getCoordinates(location: string): { lat: number; lng: number } {
  if (LOCATION_COORDINATES[location]) {
    return LOCATION_COORDINATES[location];
  }

  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (location.includes(key)) {
      return coords;
    }
  }

  return DEFAULT_LOCATION;
}

type IncidentTypeCount = {
  incident_type: string;
  count: number;
};

type IncidentsContextType = {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  refreshIncidents: () => Promise<void>;
  getRecentIncidents: (limit?: number) => Incident[];
  getIncidentsByType: (type: string) => Incident[];
  incidentTypes: IncidentTypeCount[];
};

const IncidentsContext = createContext<IncidentsContextType>({
  incidents: [],
  loading: true,
  error: null,
  refreshIncidents: async () => {},
  getRecentIncidents: () => [],
  getIncidentsByType: () => [],
  incidentTypes: [],
});

export const useIncidents = () => useContext(IncidentsContext);

export const IncidentsProvider = ({ children }: { children: ReactNode }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<IncidentTypeCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);

      let allIncidents: Incident[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error: incidentsError } = await supabase
          .from("crime_incidents")
          .select("*")
          .order("time_reported", { ascending: false })
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (incidentsError) {
          throw incidentsError;
        }

        if (!data || data.length === 0) {
          hasMore = false;
        } else {
          allIncidents = [...allIncidents, ...data];
          page++;

          if (data.length < pageSize) {
            hasMore = false;
          }
        }
      }

      const sortedIncidents = [...allIncidents].sort((a, b) => {
        const dateA = new Date(a.time_reported).getTime();
        const dateB = new Date(b.time_reported).getTime();
        return dateB - dateA;
      });

      const incidentsWithCoords = sortedIncidents.map((incident) => {
        const coords = getCoordinates(incident.incident_location);
        return {
          ...incident,
          ...coords,
        };
      });

      setIncidents(incidentsWithCoords);

      const typeCounts: Record<string, number> = {};
      incidentsWithCoords.forEach((incident) => {
        typeCounts[incident.incident_type] =
          (typeCounts[incident.incident_type] || 0) + 1;
      });

      const typeCountArray: IncidentTypeCount[] = Object.entries(typeCounts)
        .map(([incident_type, count]) => ({
          incident_type,
          count,
        }))
        .sort((a, b) => b.count - a.count);

      setIncidentTypes(typeCountArray);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error fetching incidents:", errorMessage);
      setError("Failed to load incidents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null;

    const setupData = async () => {
      const isConnected = await validateSupabaseConnection();

      if (isConnected) {
        fetchIncidents();

        subscription = supabase
          .channel("crime_incidents-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "crime_incidents",
            },
            () => {
              fetchIncidents();
            }
          )
          .subscribe();
      } else {
        setError(
          "Could not connect to the database. Please check your connection and configuration."
        );
        setLoading(false);
      }
    };

    setupData();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const refreshIncidents = async () => {
    await fetchIncidents();
  };

  const getRecentIncidents = (limit = 10) => {
    return incidents.slice(0, limit);
  };

  const getIncidentsByType = (type: string) => {
    return incidents.filter((incident) => incident.incident_type === type);
  };

  return (
    <IncidentsContext.Provider
      value={{
        incidents,
        loading,
        error,
        refreshIncidents,
        getRecentIncidents,
        getIncidentsByType,
        incidentTypes,
      }}
    >
      {children}
    </IncidentsContext.Provider>
  );
};
