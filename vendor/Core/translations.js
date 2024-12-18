import moment from 'moment';
import $ from 'jquery';

export const TCOUNTER = {
    AJAX : 0
}

export const locale = $("html").attr("lang");

export const DATES = {
    "dateTime": "%A, %e %B %Y г. %X",
    "date": "%d.%m.%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    "shortDays": ["lu", "ma", "me", "je", "ve", "sa", "di"],
    months : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
    shortMonths: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
}

const body_initial_class = $("body").attr("class");

export const LOADINGSTART = (id)=>{
    if(TCOUNTER.AJAX<0)
        TCOUNTER.AJAX = 0;
    TCOUNTER.AJAX++;
    $( "body" ).addClass(id);
    $( "body" ).addClass("ry-loading");
}

export const LOADINGEND = (id)=>{
    $("body").removeClass(id);
    TCOUNTER.AJAX--;
    if(TCOUNTER.AJAX<=0)
        $( "body" ).removeClass("ry-loading");
}

moment.locale('fr', {
    months : DATES.months,
    monthsShort : DATES.shortMonths,
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : "[Aujourd'hui à] LT",
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : output=>{
			return output==='secondes' ? "à l'instant" : 'il y a %s'.replace(/%s/i, output)
		},
        s : 'secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // Used to determine first week of the year.
    }
});

moment.locale('fr')

export const siteSetup = $("#site-setup").length>0? JSON.parse($("#site-setup").text()) : {
    general : {
        logo : ''
    }
}

export default function trans(input, replaces={}) {
	let result = input
	if(('__' in window) && (input in __)) {
        result = __[input]
    }
    for(let repl in replaces) {
        let by = replaces[repl]
        let re = new RegExp(`:${repl}`, "g");
        result = result.replace(re, by)
    }
	return result;
}

export function plural(word, params, ifplural=null, ifnone=null){
    let number = 0
    if(typeof params == 'object')
        number = params.n
    else {
        number = params
        params = {n:number}
    }
    if(number==0 && ifnone) {
        return trans(ifnone, params)
    }
    const isPlural = (number>1)
    if(isPlural)
        return ifplural ? trans(ifplural, params) : `${trans(word, params)}s`
    return trans(word, params)
}

export const genders = {
    mr : trans('M'),
    mrs : trans('Mme'),
    ms : trans('Mlle')
}
