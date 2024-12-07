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