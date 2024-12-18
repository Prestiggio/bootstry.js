import { merge, isObject } from 'lodash';

class Entity
{
    constructor(name, ini) {
        this.update = this.update.bind(this)
        this.cast = this.cast.bind(this)
        this.get = this.get.bind(this)
        this.set = this.set.bind(this)
        this.getByName = this.getByName.bind(this)
        this.name = name
        this.data = sessionStorage.getItem(name) ? JSON.parse(sessionStorage.getItem(name)) : ini
        this.on = this.on.bind(this)
        this.listeners = {}
    }

    update(data) {
        return new Promise((resolve, reject)=>{
            if(data.initial) {
                const initial = JSON.parse(data.initial)
                delete data.initial
                data = merge(data, initial)
            }
            this.data = data
            sessionStorage.setItem(this.name, JSON.stringify(this.data))
            if(('update' in this.listeners)) {
                this.listeners.update.map(cb=>cb.call(null))
            }
            resolve(this)
        })
    }

    on(eventName, callback) {
        if(!(eventName in this.listeners)) {
            this.listeners[eventName] = []
        }
        this.listeners[eventName].push(callback)
    }

    cast(it, path, fallback='') {
        let ar = path.split('.')
        if(!it)
            return fallback;

        if(ar.length>0 && (ar[0] in it)) {
            let base = it[ar[0]]
            if(base && ar.length>1) {
                for(var i=1; i<ar.length; i++) {
                    let none = true
                    if(typeof base=='object') {
                        if(base && isNaN(ar[i])) {
                            if(ar[i] in base) {
                                base = base[ar[i]]
                                none = false
                            } 
                        }
                        else if(base && !isNaN(ar[i])) {
                            if(parseInt(ar[i]) in base) {
                                base = base[parseInt(ar[i])]
                                none = false
                            } 
                        }
                    }
                    if(none)
                        return fallback
                }
            }
            if(base!==null) {
                return base
            }  
        }

        return fallback
    }

    set(path, value) {
        let base = this.data
        let ar = path.replace(/\]$/, '').replace(/[\[\]]/g, '.').replace(/\.+/g, '.').split('.')
        if(ar.length>0) {
            for(var i=0; i<ar.length-1; i++) {
                if(base && isNaN(ar[i])) {
                    if(!(ar[i] in base))
                        base[ar[i]] = {}
                    if(!isObject(base[ar[i]]) && i<ar.length-1)
                        base[ar[i]] = {}
                    base = base[ar[i]]
                }
                else if(base && !isNaN(ar[i])) {
                    if(!(parseInt(ar[i]) in base))
                        base[parseInt(ar[i])] = {}
                    base = base[parseInt(ar[i])]
                }
            }
            base[ar[i]] = value
        }
        else
            base = value
        this.update(this.data)
    }

    get(path, fallback) {
        return this.cast(this.data, path, fallback);
    }

    getByName(path, fallback='') {
        return this.get(path.replace(/\[/g, '.').replace(/\]/g, '.').replace(/\.\./g, '.').replace(/\.$/, ''), fallback)
    }
}

export default Entity;