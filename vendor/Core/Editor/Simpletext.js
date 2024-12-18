import React, {Component} from 'react';
import trans from 'Core/translations';
import Modelizer from 'Core/Modelizer';
import Ry from 'Core/Ry';

class Simpletext extends Component
{
  constructor(props) {
    super(props)
    this.state = this.props.data.data
    this.getRaw = this.getRaw.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.input = React.createRef()
  }

  componentDidMount() {
    this.input.current.ry = this
  }

  getRaw() {
    return this.state
  }

  handleChange(event) {
    const value = event.target.value
    this.setState(state=>{
        state[state.field] = value
        return state
    })
  }

  render() {
    return <form name="frm_editor_simple_text" action={this.state.action} method="post">
      <div className="modal-header">
        {this.state.title}
      </div>
      <div className="modal-body">
        <div className="form-group">
          <input type="text" className="form-control" placeholder={this.models('state.title')} value={this.cast(this.state, this.state.field, '')} onChange={this.handleChange}/>
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