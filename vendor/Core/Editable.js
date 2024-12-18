import store from 'Core/Store';
import Ry, { register } from 'Core/Ry';
import Modelizer from 'Core/Modelizer';
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './Editable.scss';

export const INITIAL = {
    blocks : {},
    route_action : false,
    editor_mode : false,
    store_subscription : false
}

const BLOCKREFS = {}

export default function Editable(It, Plugins=[], EditorConfig={}) {
    Modelizer(It)

    const CDM = It.prototype.componentDidMount
	const RENDER = It.prototype.render

    register('Editor.Html', content=>{
        const EditorHtml = React.lazy(() => import('Core/Editor/Html'))
        return <Suspense fallback={<p>Chargement...</p>}>
            <EditorHtml data={content} plugins={Plugins} config={EditorConfig}/>
        </Suspense>
    })

    register('Editor.Markdown', content=>{
        const EditorMarkdown = React.lazy(() => import('Core/Editor/Markdown'))
        return <Suspense fallback={<p>Chargement...</p>}>
            <EditorMarkdown data={content} plugins={Plugins} config={EditorConfig}/>
        </Suspense>
    })

    register('Editor.Page', content=>{
        const Simpletext = React.lazy(() => import('Core/Editor/Page'))
        return <Suspense fallback={<p>Chargement...</p>}>
            <Simpletext data={content}/>
        </Suspense>
    })

    register('Editor.Simpletext', content=>{
        const Simpletext = React.lazy(() => import('Core/Editor/Simpletext'))
        return <Suspense fallback={<p>Chargement...</p>}>
            <Simpletext data={content}/>
        </Suspense>
    })

    register('Editor.Bar', content=>{
        const Bar = React.lazy(() => import('Core/Editor/Bar'))
        return <Suspense fallback={<p>Chargement...</p>}>
            <Bar data={content}/>
        </Suspense>
    })

    register('Static', content=>{
        const Bar = React.lazy(() => import('Core/Editor/Static'))
        return <Suspense fallback={<p>Chargement...</p>}>
            <Bar data={content}/>
        </Suspense>
    })

    It.prototype.getInitialBlockContent = function(name) {
        return INITIAL.blocks[name]
    }

    It.prototype.reapplyDialog = function() {
        $('a[href^="#editor-dialog/"]').each(function () {
            let dis = $(this);
            const f = function (e) {
                e.preventDefault();
                store.dispatch({
                    type: 'dialog',
                    url: dis.attr('href').replace('#editor-dialog', ''),
                    method: 'post',
                    data: INITIAL.route_action,
                    display: dis.data("display")
                });
                return false;
            };
            if (!this.dialogBound) {
                $(this).bind('click', f);
                this.dialogBound = true;
            }
        });
    }

    It.prototype.setEditable = function(element, name, plugins = [], dialog_url=false) {
        if(!(name in BLOCKREFS)) {
            BLOCKREFS[name] = {
                element,
                plugins,
                dialog_url
            }
            INITIAL.blocks[name] = element.innerHTML
            this._processBlock(name)
        }
    }

    It.prototype._processBlock = function(i) {
        if(!this._processedBlock)
            return
        
        if(this.props.data && (i in this.models('props.data.blocks', {}))) {
            BLOCKREFS[i].element.innerHTML = this.props.data.blocks[i]
            $(BLOCKREFS[i].element).find("script[type^='application/json+ry']").each((index, element)=>{
                const elementname = $(element).attr('type').replace('application/json+ry', '');
                let text = $(element).text()
                let content = {}
                if(text && text.length>0) {
                    try {
                        content = JSON.parse(text);
                        for(let j in content) {
                            this.props.data[j] = content[j]
                        }
                    }
                    catch(e) {
                        console.error('json+ry content could not be parsed : ', e)
                    }
                }
                Ry.setGlobal(elementname, content)
                const id = $(element).attr('id');
                ReactDOM.render(<Ry class={elementname} content={this.props.data} id={id}/>, $(element).parent()[0])
            });
        }
        
        $(BLOCKREFS[i].element).addClass('position-relative editable')
        if(BLOCKREFS[i].element.nodeType && INITIAL.editor_mode) {
            let dialog_url = BLOCKREFS[i].dialog_url ? BLOCKREFS[i].dialog_url : `/${INITIAL.editor_mode}/html_dialog?field=${i}`
            $(BLOCKREFS[i].element).append(`<a class="position-absolute edit-btn" style="top: 0; right: 0; z-index:100;" href="#editor-dialog${dialog_url}" data-display="modal-xl"><i class="bi bi-pen"></i></a>`)
        }

        this.reapplyDialog()
    }

    It.prototype.componentDidMount = function() {
        if(CDM)
            CDM.call(this)
        if(!INITIAL.editor_mode && this.models('props.data.editor_mode') && this.models('props.data.theme'))
            INITIAL.editor_mode = this.props.data.theme
        if(!INITIAL.route_action && this.props.data && this.props.data.route_action && INITIAL.editor_mode) {
            INITIAL.route_action = this.props.data.route_action
        }
        if(!INITIAL.store_subscription) {
            $('[data-editable]').each((i, el)=>{
                this.setEditable(el, $(el).data('editable'))
                $(el).removeAttr('data-editable')
            })
            INITIAL.store_subscription = store.subscribe(()=>{
                const storeState = store.getState()
                if(storeState.type=='block_edited') {
                    if(storeState.name in BLOCKREFS) {
                        BLOCKREFS[storeState.name].element.innerHTML = storeState.content
                        let dialog_url = BLOCKREFS[storeState.name].dialog_url ?? `/${INITIAL.editor_mode}/html_dialog?field=${storeState.name}`
                        $(BLOCKREFS[storeState.name].element).append(`<a class="position-absolute edit-btn" style="top: 0; right: 0; z-index:100;" href="#editor-dialog${dialog_url}" data-display="modal-xl"><i class="bi bi-pen"></i></a>`)
                        store.dispatch({
                            type: 'dialog.dismiss'
                        })
                    }
                    this.reapplyDialog()
                }
                if(storeState.type=='block_reseted' && (storeState.name in BLOCKREFS)) {
                    BLOCKREFS[storeState.name].element.innerHTML = INITIAL.blocks[storeState.name]
                    store.dispatch({
                        type: 'dialog.dismiss'
                    })
                }
            })
        }
        if(this.props.data && this.props.data.blocks) {
            this._processedBlock = true
            for(let i in BLOCKREFS) {
                this._processBlock(i)
            }
        }
        this.reapplyDialog()
    }

    return It
}