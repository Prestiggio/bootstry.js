import React from 'react';
import { isObject } from 'lodash';
import {register, registerLayoutTemplate} from 'Core/Ry';
import store from 'Core/Store';

export default function Modelizer(It) {
    if('id' in It) {
        register(It.id, (content, children)=><It data={content}>{children}</It>)
        if('layout' in It) {
            registerLayoutTemplate(It.id, It.layout)
        }
    }

    const CDM = It.prototype.componentDidMount

    It.prototype.componentDidMount = function(){
        if(CDM)
            CDM.call(this)
        
        $('a[href^="#dialog/"]').each(function () {
            let dis = $(this);
            const f = function (e) {
                e.preventDefault();
                if (dis.data("content") && dis.data("content") != '')
                    store.dispatch({
                        type: 'dialog',
                        url: dis.attr('href').replace('#dialog', ''),
                        method: 'post',
                        data: props[dis.data("content")],
                        display: dis.data("display")
                    });
                else
                    store.dispatch({type: 'dialog', url: dis.attr('href').replace('#dialog', ''), method: 'get', display: dis.data("display")});
                return false;
            };
            if (!this.dialogBound) {
                $(this).bind('click', f);
                this.dialogBound = true;
            }
        });
    }

	It.prototype.componentDidCatch = function(error, info){
		if(this.state) {
			this.setState({
	            hasError : error
	        })
		}
    }
/*
	It.prototype.render = function() {
		if(this.state && this.state.hasError) {
			return <div>{trans("Une erreur imprévisible s'est produite.")}</div>
		}
		else if(RENDER)
            return RENDER.call(this)
	}
*/
    It.prototype.checkLocation = function(against) {
        if(/^#/.test(against))
            return
        let checked = document.location.pathname === against
        if(!checked && this.props && this.props.data.parents) {
            this.props.data.parents.map(parent=>{
                if(parent.href===against)
                    checked = true
            })
        }
        return checked
    }

    It.prototype.anyChildActive = function(tree) {
        if(!tree)
            return
        let active = false
        tree.map(item=>{
            if(this.checkLocation(item.href))
                active = true
        })
        if(active)
            return true
        tree.map(item=>{
            if(item.children && !active)
                active = this.anyChildActive(item.children)
        })
        if(active)
            return true
    }

    It.prototype.cast = function(it, path, fallback='') {
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
            if(base!==null)
                return base
        }

        return fallback
    }

    It.prototype.descend = function(it, path, value) {
        if(!it)
            it = {}
        let base = it
        let ar = path.split('.')
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
    }

    It.prototype.models = function(path, fallback=''){
        return this.cast(this, path, fallback);
    }

    It.prototype.prefix = function(keys, prefixes=[]){
        let ar = []
        if(keys)
            ar = [...keys]
        if(prefixes) {
            ar.unshift(...prefixes)
        }
        let arname = []
        if(ar.length>0){
            for(var i=0; i<ar.length; i++) {
                if(i==0) {
                    arname.push(ar[i])
                }
                else {
                    arname.push(`[${ar[i]}]`)
                }
            }
        }
        return arname.join('')
    }

    return It
}