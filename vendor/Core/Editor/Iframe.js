import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import store from 'Core/Store';

class Iframe extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      editor_mode : this.models('props.data.editor_mode')
    }
  }

  componentDidMount() {
    store.subscribe(()=>{
      const storeState = store.getState();
      if(storeState.type=='quit_editor') {
        $.ajax({
          url : `/${this.props.data.theme}/quit`,
          success : response=>{
            this.setState({
              editor_mode : false
            })
            $(`a[href^='#editor-dialog']`).hide()
          }
        })
      }
    })
  }

  render() {
    return (this.models('state.editor_mode') && this.models('props.data.view')!='Editor.Bar')?<iframe className="border-0 w-100 bg-dark" style={{height:44}} src={`/${this.props.data.theme}/editor`}></iframe>:null
  }
}

export default Modelizer(Iframe)