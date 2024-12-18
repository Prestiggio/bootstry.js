import React, {Component} from 'react';
import trans from 'Core/translations';
import Modelizer from 'Core/Modelizer';
import Ry, {getTemplates} from 'Core/Ry';
import './Page.scss';

class Simpletext extends Component
{
  constructor(props) {
    super(props)
    this.state = this.props.data.data
    this.state.layout = this.state.layout ? this.state.layout : 'Layout.Blog'
    this.getRaw = this.getRaw.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.input = React.createRef()
    this.layoutChange = this.layoutChange.bind(this)
  }

  layoutChange(e) {
    const checked = event.target.checked
    const layout = e.target.value
    if(checked) {
        this.setState({
            layout
        })
    }
  }

  componentDidMount() {
    this.input.current.ry = this
  }

  getRaw() {
    return this.state
  }

  handleChange(event) {
    const value = event.target.value
    this.setState({
      value
    })
  }

  render() {
    const templates = getTemplates()
    return <form name="frm_editor_simple_text" action={this.state.action} method="post">
      <div className="modal-header">
        {this.state.title}
      </div>
      <div className="modal-body">
        <div className="form-group">
          <input type="text" className="form-control" placeholder={this.models('state.title')} value={this.models('state.value', '')} onChange={this.handleChange}/>
        </div>
        <div className='row my-3 select-layout'>
            {templates.map(template=><div key={template.id} className='col text-center'>
                <label className='control-label' htmlFor={template.id}>
                    <a href={template.preview} target="_blank"><img src={template.thumbnail} className='img-thumbnail' htmlFor={template.id}/></a><br/>
                    {template.title}
                    <input type="radio" id={template.id} className='ms-1' name="layout" value={template.id} onChange={this.layoutChange} checked={this.state.layout===template.id}/>
                </label>
            </div>)}
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-danger" type='button' data-bs-dismiss="modal" aria-label="Close">{trans('Annuler')}</button>
        <input type="hidden" name="ry" ref={this.input}/>
        <button className="btn btn-primary">{trans('Appliquer')}</button>
      </div>
      <Ry/>
      </form>
  }
}

export default Modelizer(Simpletext)