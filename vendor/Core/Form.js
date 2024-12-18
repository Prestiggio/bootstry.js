import React, {Component} from 'react';
import Ry from 'Core/Ry';
import 'parsleyjs';
import 'parsleyjs/src/i18n/fr';
import 'jquery-serializejson';
import store from 'Core/Store';

class Form extends Component
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
        /*const observer = new MutationObserver((mutationsList)=>{
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    $(this.html_form.current).find('[name]').each(function(){
                        const name = $(this).attr('name')
                        if(sessionStorage.getItem(name)) {
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
        $(this.html_form.current).ajaxForm({
            beforeSubmit: (arr, $form)=>{
                if(this.props.onSubmit) {
                    this.props.onSubmit.call(this)
                }
                return $form.parsley().validate()
            },
            beforeSerialize: ($form, options)=>{
                if($form.attr('method')=='get')
                    options.isPagination = true;
                const raw = this.getRaw();
                if(raw) {
                    options.data = Array.isArray(raw) ? {'ry.array': raw} : raw
                }
            },
            success: response=>{
                $('body').removeClass('ry-loading')
                if(this.props.onSuccess) {
                    this.props.onSuccess.call(this, response)
                } 
                if (response.type) {
                    store.dispatch(response);
                }
                if(response.access_token) {
                    store.dispatch({
                        type: 'login',
                        data: response
                    })
                    auth.setToken(response.access_token)
                }
            },
            error: e=>{
                if(this.props.onError) {
                    this.props.onError.call(this, e)
                }
            }
        });
    }

    render() {
        return <form ref={this.html_form} method={this.props.method} id={this.props.id??'form'+Math.random()} action={this.props.action} className={this.props.className}>
            {this.props.children}
            <Ry/>
        </form>
    }
}

export default Form;