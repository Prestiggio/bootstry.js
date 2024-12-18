import React, {Component} from 'react';
import Ry from 'Core/Ry';
import 'jquery-serializejson';

class OfflineForm extends Component
{
    constructor(props) {
        super(props)
        this.state = {}
        this.html_form = React.createRef()
        this.getRaw = this.getRaw.bind(this)
    }

    getRaw() {
        return this.state.raw
    }

    componentDidMount() {
        /*$(this.html_form.current).find('[name]').each(function(){
            const name = $(this).attr('name')
            if(!this.sessionPrefilled && sessionStorage.getItem(name)) {
                this.sessionPrefilled = true
                $(this).val(sessionStorage.getItem(name))
            }
            $(this).on('change', function(){
                const value = $(this).val()
                if(value.length>0) {
                    sessionStorage.setItem(name, value)
                }
            })
        })
        const observer = new MutationObserver((mutationsList)=>{
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    $(this.html_form.current).find('[name]').each(function(){
                        const name = $(this).attr('name')
                        if(!this.sessionPrefilled && sessionStorage.getItem(name)) {
                            this.sessionPrefilled = true
                            $(this).val(sessionStorage.getItem(name))
                        }
                        $(this).on('change', function(){
                            const value = $(this).val()
                            if(value.length>0) {
                                sessionStorage.setItem(name, value)
                            }
                        })
                    })
                }
            }
        });
        observer.observe(this.html_form.current, { childList: true, subtree: true });*/
        $(this.html_form.current).find('[name]').each((index, e)=>{
            const value = this.props.entity.getByName(e.name)
            if(value!==null && value!=='') {
                switch(e.type) {
                    case 'checkbox':
                        if(e.value==value) {
                            $(e).prop('checked', true)
                        }
                        break
                    default:
                        $(e).val(value)
                        break
                }
            }
        })
        this.props.entity.on('update', ()=>{
            setTimeout(()=>{
                console.log('aooooo', this.props.entity.data)
                $(this.html_form.current).find('[name]').each((index, e)=>{
                    const value = this.props.entity.getByName(e.name)
                    if(value!==null && value!=='') {
                        switch(e.type) {
                            case 'radio':
                            case 'checkbox':
                                if(e.value==value) {
                                    $(e).prop('checked', true)
                                }
                                break
                            default:
                                $(e).val(value)
                                break
                        }
                    }
                })
            }, 0)
        })
        $(this.html_form.current).parsley().on('form:submit', ()=>{
            if(this.props.entity) {
                this.props.entity.update($(this.html_form.current).serializeJSON()).then(()=>{
                    this.props.entity.save().then(response=>{
                        this.props.onSuccess(response)
                        this.setState({
                            raw: this.props.entity.data
                        })
                    })
                })
            }
            return false
        })
    }

    render() {
        return <form ref={this.html_form} className={this.props.className}>
            <input type="hidden" name="initial" value={JSON.stringify(this.props.entity.data)}/>
            {this.props.children}
            <Ry/>
        </form>
    }
}

export default OfflineForm;