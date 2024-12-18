//! moment.js locale configuration
//! locale : Malagasy [mg]
//! author : John Fischer : https://github.com/jfroffice

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

    //! moment.js locale configuration

    var monthsStrictRegex = /^(janoary|febroary|martsa|aprily|may|jona|jolay|aogositra|septambra|oktobra|novambra|desambra)/i,
        monthsShortStrictRegex = /(janv\.?|febr\.?|martsa|avr\.?|may|jona|juil\.?|aog|sept\.?|okt\.?|nov\.?|des\.?)/i,
        monthsRegex = /(janv\.?|febr\.?|martsa|avr\.?|may|jona|juil\.?|aog\.?|sept\.?|okt\.?|nov\.?|des\.?|janoary|febroary|martsa|aprily|may|jona|jolay|aogositra|septambra|oktobra|novambra|desambra)/i,
        monthsParse = [
            /^janv/i,
            /^febr/i,
            /^martsa/i,
            /^avr/i,
            /^may/i,
            /^jona/i,
            /^juil/i,
            /^aogositra/i,
            /^sept/i,
            /^okt/i,
            /^nov/i,
            /^des/i,
        ];

    var mg = moment.defineLocale('mg', {
        months: 'janoary_febroary_martsa_aprily_may_jona_jolay_aogositra_septambra_oktobra_novambra_desambra'.split(
            '_'
        ),
        monthsShort: 'janv._févr._martsa_avr._may_jona_juil._aogositra_sept._oct._nov._déc.'.split(
            '_'
        ),
        monthsRegex: monthsRegex,
        monthsShortRegex: monthsRegex,
        monthsStrictRegex: monthsStrictRegex,
        monthsShortStrictRegex: monthsShortStrictRegex,
        monthsParse: monthsParse,
        longMonthsParse: monthsParse,
        shortMonthsParse: monthsParse,
        weekdays: 'alahady_alatsinainy_talata_alarobia_alakamisy_zoma_sabotsy'.split('_'),
        weekdaysShort: 'alh._alt._tal._alb._alk._zom._sab.'.split('_'),
        weekdaysMin: 'ah_at_ta_ab_ak_zo_sa'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
        },
        calendar: {
            sameDay: "[Anio amin'ny] LT",
            nextDay: "[Rahampitso amin'ny] LT",
            nextWeek: 'dddd [à] LT',
            lastDay: '[Omaly à] LT',
            lastWeek: "dddd [teo tamin'ny] LT",
            sameElse: 'L',
        },
        relativeTime: {
            future: 'afaka %s',
            past: "dila %s",
            s: 'segondra vitsy',
            ss: '%d segondra',
            m: 'une minitra',
            mm: '%d minitra',
            h: 'hadiny iray',
            hh: 'hadiny %d',
            d: 'iray andro',
            dd: '%d andro',
            w: 'herinandro',
            ww: '%d herinandro',
            M: 'iray volana',
            MM: '%d volana',
            y: 'herintaona',
            yy: '%d taona',
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
        ordinal: function (number, period) {
            switch (period) {
                // TODO: Return 'e' when day of month > 1. Move this case inside
                // block for masculine words below.
                // See https://github.com/moment/moment/issues/3375
                case 'D':
                    return number + (number === 1 ? 'er' : '');

                // Words with masculine grammatical gender: mois, trimestre, jour
                default:
                case 'M':
                case 'Q':
                case 'DDD':
                case 'd':
                    return number + (number === 1 ? 'er' : 'e');

                // Words with feminine grammatical gender: semayne
                case 'w':
                case 'W':
                    return number + (number === 1 ? 're' : 'e');
            }
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4, // The week that contains Jan 4th is the first week of the year.
        },
    });

    return mg;

})));
