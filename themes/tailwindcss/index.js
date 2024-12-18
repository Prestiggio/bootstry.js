import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import Ry from 'Core/Ry';
import Layout from 'bootstrap/Layout';
import 'bootstrap/Sample';
import './Components';
import 'porto/layouts';
import 'facebook/Components';
import 'katolika/Components';
import 'commerce/Components';
import 'Azoantoka/Components';
import 'Core/Components';
import Loading from './Components/Loading';
import 'coreui-admin';
import './layouts';
import { isArray, isString } from 'lodash';

let messe = {};

function descend(name, value) {
    const parsed = /messe\[([^\]]+)\]\[([^\]]+)\]/g.exec(name)
    const hour = parsed[1]
    const task = parsed[2]

    if (!(hour in messe)) {
        messe[hour] = {}
    }
    if (value === null) {
        delete messe[hour][task]
    }
    else {
        messe[hour][task] = value
    }

    return { messe };
}

function getValue(name) {
    const parsed = /messe\[([^\]]+)\]\[([^\]]+)\]/g.exec(name)
    const hour = parsed[1]
    const task = parsed[2]

    if (hour in messe && (task in messe[hour])) {
        return messe[hour][task]
    }

    return null
}

const phoneEl = document.querySelector('input[name="phone"]')

if (phoneEl) {
    const phone = phoneEl.value

    const jsonMesse = sessionStorage.getItem('messe')

    if (jsonMesse !== null) {
        messe = JSON.parse(jsonMesse)
    }

    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        const v = getValue(input.name)
        input.checked = (v === phone)
        input.addEventListener('change', function () {
            descend(this.name, this.checked ? phone : null)
            sessionStorage.setItem('messe', JSON.stringify(messe))
        })
    })

    document.querySelector('button[type="submit"]').addEventListener('click', () => {
        const jsonMesse = sessionStorage.getItem('messe')

        fetch('/mg/Arsidiosezy-Antananarivo/VE-Afovoany/Distrika-Mahamasina/EKAR-Ambatonilita/Faritra-Ampasamadinika/anjara/api/2024/11/23-24/0349654554/save', {
            method: 'POST',
            body: jsonMesse
        })
    })
}

const content = {
    blocks: {}
}

document.querySelectorAll('[data-editable]').forEach((editableBlock)=>{
    content.blocks[editableBlock.getAttribute('data-editable')] = editableBlock.innerHTML
    console.log(content)
})

document.querySelectorAll('[data-html-editor]').forEach((htmlEditor)=>{
    
})

$("script[type='application/ld+json']").each(function () {
    let text = $(this).text()
    let content = JSON.parse(text ? text : '{}');
    if(!('blocks' in content))
        content.blocks = {}
    $('[data-editable]').each(function () {
        if($(this).attr('id')) {
            content.blocks[$(this).attr('id')] = $(this).html()
        }
    });
    container.content = content
    const Th = React.lazy(() => {
        switch(content.color) {
            case 'red':
                return import('./colors/red')
            case 'violet':
                return import('./colors/violet')
            case 'white':
                return import('./colors/white')
            default:
            case 'green':
                return import('./colors/green')
        }
    })
    ReactDOM.render(
        <Layout data={content}>
            <Ry class={content.view} content={content}/>
            {content.layout?null:<Suspense fallback={<Loading/>}>
                <Th/>
            </Suspense>}
        </Layout>, $(this).parent()[0])
});